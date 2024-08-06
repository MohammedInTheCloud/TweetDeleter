# Tweet Manager

Tweet Manager is a Chrome extension designed to help you easily manage your tweets and likes on Twitter/X.

## Features

- Delete All Tweets: Effortlessly remove all your tweets with a single click.
- Unlike All Tweets: Quickly remove all your likes from tweets.

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Visit x.com and interact with the site to trigger the target request.
2. Click on the extension icon in the Chrome toolbar to open the popup.
3. Enter your Twitter/X username.
4. Choose to either delete tweets or unlike tweets by clicking the respective button.
5. Wait for the process to complete. You'll see a notification when it's done.

## Development

The extension is structured as follows:

- `src/background/`: Contains the background script.
- `src/config/`: Contains configuration constants.
- `src/content/`: Contains the content scripts for interacting with the webpage.
- `src/popup/`: Contains the popup HTML, JS, and CSS for the user interface.
- `src/utils/`: Contains utility functions and classes for various operations.

### Key Files

- `contentScript.js`: Injects the main functionality into the webpage.
- `contentScriptInjector.js`: Coordinates between the popup and the main functionality.
- `likeManager.js`: Handles the unlike functionality.
- `tweetDeleter.js`: Manages the tweet deletion process.
- `requestInterceptor.js`: Intercepts and analyzes web requests.
- `cookieUtils.js`: Handles cookie-related operations.
- `storage.js`: Manages local storage operations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Permissions

This extension requires the following permissions:
- webRequest: To intercept and analyze web requests
- storage: To store captured information
- cookies: To access and retrieve specific cookies
- Host permissions for x.com and twitter.com

## Structure:
``````
|-- deleteTweets.md
|-- LICENSE
|-- manifest.json
|-- README.md
-- src
    |-- background
    |   -- background.js
    |-- config
    |   -- constants.js
    |-- content
    |   |-- contentScript.js
    |   -- contentScriptInjector.js
    |-- popup
    |   |-- popup.css
    |   |-- popup.html
    |   -- popup.js
    -- utils
        |-- cookieUtils.js
        |-- likeManager.js
        |-- requestInterceptor.js
        |-- storage.js
        -- tweetDeleter.js
``````

## Acknowledgments

This project is based on the work of [lolarchiver](https://github.com/Lyfhael/DeleteTweets). We've adapted and extended the original work to create this Chrome extension with additional features.

### Original Repository
- **Repository**: [deleteTweets](https://github.com/Lyfhael/DeleteTweets)
- **Author**: lolarchiver

If you find this extension helpful, consider supporting the original author:
- [Ko-fi: lolarchiver](https://ko-fi.com/lolarchiver)

Please note that while we've built upon the original work, any issues with this Chrome extension should be reported in this repository.