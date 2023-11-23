# Macro Client

This is a macro client created by me.

## How to Use

1. Download the files and start the application by using the command `node index.js` or running the `start.bat`. Ensure that NodeJS is installed. You can download it [here](https://nodejs.org/en/download).

2. After running the command, you will receive a token. Open the following website on your phone, tablet, etc., to control your device: [http://207.180.227.57:2000/](http://207.180.227.57:2000/) (you can change the URL in the `config.json`). Then, enter the token into the input field, create a category, and add a shortcut.

## Creating a Shortcut

When creating a shortcut, provide the following information:

- **Shortcut Name:** The title of the shortcut.
- **Shortcut Description:** The text under the name.
- **Shortcut Icon:** The icon of the shortcut. You can find icon names [here](https://fonts.google.com/icons).
- **Shortcut Color:** The color of the shortcut.
- **Shortcut Action:** Define what should happen when you click the shortcut.
    - **Action Name:** Specify the app to open (on your computer, you will be prompted for this).
        - **Path:** [Path location of the program]
        - **Exe:** [Name of the exe you want to open]

## Configurations

If you make a mistake, you can edit it in the `config.json`.
