import { Component, HostListener, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Dictionary } from '@microsoft/office-js-helpers';
import * as fromRoot from '../reducers';
import { Store } from '@ngrx/store';
import { Monaco, Snippet } from '../actions';
import { MonacoService, Disposable } from '../services';
import * as debounce from 'lodash/debounce';
import {Strings} from '../helpers';

@Component({
    selector: 'editor',
    template: `
        <ul class="tabs ms-Pivot ms-Pivot--tabs" [hidden]="hide">
            <li class="tabs__tab ms-Pivot-link" *ngFor="let tab of tabs.values()" (click)="changeTab(tab.name)" [ngClass]="{'is-selected tabs__tab--active' : tab.name === currentState?.name}">
                {{tab.view}}
            </li>
        </ul>
        <section id="editor" #editor class="viewport"></section>
        <section [hidden]="!hide" class="viewport__placeholder"></section>
    `
})
export class Editor extends Disposable implements AfterViewInit {
    private _monacoEditor: monaco.editor.IStandaloneCodeEditor;
    @ViewChild('editor') private _editor: ElementRef;
    private _readonly: boolean;

    tabs = new Dictionary<IMonacoEditorState>();
    currentState: IMonacoEditorState;
    hide: boolean = true;

    constructor(
        private _store: Store<fromRoot.State>,
        private _monaco: MonacoService,
    ) {
        super();
    }

    /**
     * Initialize the component and subscribe to all the neccessary actions.
     */
    async ngAfterViewInit() {
        this._monacoEditor = await this._monaco.create(this._editor, { theme: 'vs' });
        this._monacoEditor.onKeyUp(() => this._debouncedInput());
        this._createTabs();
        this._subscribeToState();
    }

    changeTab = (name: string = Strings.scriptTabTag) => this._store.dispatch(new Monaco.ChangeTabAction(name, this.tabs.get(name).language));

    updateIntellisense() {
        if (this.snippet == null) {
            return;
        }

        this._store.dispatch(new Monaco.UpdateIntellisenseAction(this.snippet.libraries.split('\n'), 'typescript'));
    }

    private _createTabs() {
        [Strings.scriptTab, Strings.htmlTab, Strings.cssTab, Strings.librariesTab].forEach(title => {
            let name = title.toLowerCase();

            let tab = <IMonacoEditorState>{
                name: name,
                view: title,
                viewState: null
            };

            this.tabs.insert(name, tab);
        });
    }

    private _subscribeToState() {
        this._store.select(fromRoot.getMenu)
            .subscribe(() => this._resize());

        this._store.select(fromRoot.getTheme)
            .subscribe(theme => this._monaco.updateOptions(this._monacoEditor, { theme: theme ? 'vs' : 'vs-dark' }));

        this._store.select(fromRoot.getCurrent)
            .filter(data => {
                this.hide = data == null;
                return !this.hide;
            })
            .subscribe(snippet => {
                this._store.dispatch(new Monaco.ResetAction());
                this._changeSnippet(snippet);
            });

        this._store.select(fromRoot.getActiveTab)
            .subscribe(newTab => {
                if (newTab == null) {
                    // RESET Action
                    this.currentState = null;
                }

                // If there's a current state, then save it
                if (this.currentState) {
                    let currentTab = this.tabs.get(this.currentState.name);
                    currentTab.content = this._monacoEditor.getValue();
                    currentTab.model = this._monacoEditor.getModel();
                    currentTab.viewState = this._monacoEditor.saveViewState();
                }

                if (newTab) {
                    // Update the current state to the new tab
                    this.currentState = this.tabs.get(newTab);
                    if (this.currentState.name === Strings.scriptTabTag) {
                        this.updateIntellisense();
                    }
                    this._monacoEditor.setModel(this.currentState.model);
                    this._monacoEditor.restoreViewState(this.currentState.viewState);
                    this._monacoEditor.focus();
                    this._resize();
                }
            });
    }

    /**
     * Triggered when the snippet is changed and a new snippet is loaded
     */
    private async _changeSnippet(snippet) {
        this.tabs.values().forEach(item => {
            if (item.model) {
                item.model.dispose();
            }

            let content, language, model, viewState = null;

            if (item.name === 'libraries') {
                [content, language] = [snippet[item.name], item.name];
            }
            else {
                content = snippet[item.name].content;
                language = snippet[item.name].language;
            }
            model = monaco.editor.createModel(content, language);

            item.model = model;
            item.content = content;
            item.language = language;
            item.viewState = viewState;
        });

        this._snippet = snippet;
        this.changeTab();
    }

    /**
     * Update the active content property every 300ms.
     * The same update happens even on tab switch.
     */
    private _debouncedInput = debounce(() => {
        if (!this._readonly) {
            this.currentState.content = this._monacoEditor.getValue();
            this._store.dispatch(new Snippet.SaveAction(this.snippet));
        }
    }, 250);

    /**
     * Rehydrate the 'snippet' with the content from the various tabs.
     */
    private _snippet: ISnippet;
    public get snippet() {
        if (this._snippet == null) {
            return null;
        }

        [Strings.scriptTabTag, Strings.htmlTabTag, 'style', 'libraries'].forEach(name => {
            let {content, language} = this.tabs.get(name);
            if (name === 'libraries') {
                this._snippet.libraries = content;
            }
            else {
                this._snippet[name] = { content, language };
            }
        });

        return this._snippet;
    }

    /**
     * Resize the Monaco Editor when ever there's a change in the
     * resolution. Also invoked when the menu is dismissed.
     */
    @HostListener('window:resize', ['$event'])
    private _resize() {
        if (this._monacoEditor) {
            setTimeout(() => {
                this._monacoEditor.layout();
                this._monacoEditor.setScrollTop(0);
                this._monacoEditor.setScrollLeft(0);
            }, 1);
        }
    }
}
