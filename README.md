[![Build Status](https://travis-ci.com/OfficeDev/script-lab.svg?token=zKp5xy2SuSortMzv5Pqc&branch=master)](https://travis-ci.com/OfficeDev/script-lab)

# Script Lab, a Microsoft Garage project
Experiment with the Office JavaScript API without ever leaving Excel, Word, or PowerPoint! 

## Topics
* [What is Script Lab?](README.md#what-is)
* How do I...
    - [Get started?]() 
    - [Browse the samples?]() (coming soon!)
    - [Create a new snippet?]() (coming soon!)
    - [Edit the HTML and CSS?]() (coming soon!)
    - [Save my snippet?]() (coming soon!)
    - [Run my snippet code?]() (coming soon!)
    - [Share my snippet with someone else?]() (coming soon!)
    - [Switch to a snippet I edited before?]() (coming soon!)
    - [Create an add-in from my snippet?]() (coming soon!)
    - [Contribute code to Script Lab?](README.md#contribute)

<a id="what-is"></a>
## What is Script Lab?

Wouldn’t it be crazy if you could launch Excel, click to open a small code window, and then instantly start writing and executing JavaScript that interacts with your spreadsheet?

Script lab is a tool for anyone who wants to learn about writing Office add-ins for Excel, Word, or PowerPoint. The focus is the Office JavaScript API, which is the technology you need for building Office Add-ins that run across platforms. Maybe you’re an experienced Office developer and you want to quickly prototype a feature for your add-in. Or maybe you’ve never tried writing code for Office and you just want to play with a sample and tweak it to learn more. Either way, Script Lab is for you.
Script Lab has three main features:
* Code in a pane beside your spreadsheet. IntelliSense is there while you type so you can easily discover and use the Office JavaScript objects and methods. And if you don’t want to start from scratch there are plenty of samples preinstalled with Script Lab. Your snippets can use any TypeScript features like arrow functions, template strings, and async/await. But it’s not only script: your snippets can also use HTML, CSS, and references to external libraries and data on the web. Script Lab uses the Monaco editor, the same tech that powers VS Code, so it’s beautiful and lightweight. 
* Run the code in another pane beside the editor. Execution can include logic, API calls to Office, UI in the pane, and even output to a console. Every time you make a code change you can refresh the editor and run the new version in seconds.
* Share your snippets through GitHub. If you create a snippet you’d like to share, you can use Script Lab to save it. Then send the link to someone else to try it and tweak it on their computer. The Import feature lets you load other people’s snippets.

You can [install Script Lab right now for free from the Office Store](https://store.office.com/app.aspx?assetid=WA104380862)! It works for Excel, Word, and PowerPoint on Office 2013 and later, Office Online, and Office for Mac.

![picture alt](.github/images/screenshot-wide.png "Script Lab screenshot in Excel")

<a id="contribute"></a>
## Contribute code or samples to Script Lab

To contribute to Script Lab itself, or to contribute sample code, please see [CONTRIBUTING.md](CONTRIBUTING.md).
