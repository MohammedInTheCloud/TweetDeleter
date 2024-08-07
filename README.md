# Twitter Manager

Twitter Manager is an advanced Chrome extension designed to enhance your Twitter experience. It offers tweet management features and real-time sentence improvement powered by AI.

## Features

- Delete All Tweets: Effortlessly remove all your tweets with a single click.
- Unlike All Tweets: Quickly remove all your likes from tweets.
- AI-Powered Sentence Improvement: Get real-time suggestions to enhance your tweets as you type.

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Visit x.com (Twitter) and interact with the site to trigger the target request.
2. Click on the extension icon in the Chrome toolbar to open the popup.
3. For tweet management:
   - Enter your Twitter/X username.
   - Choose to either delete tweets or unlike tweets by clicking the respective button.
   - Wait for the process to complete. You'll see a notification when it's done.
4. For sentence improvement:
   - Start typing in any text input field on Twitter.
   - After a brief pause, you'll see AI-suggested improvements for your text.

## Development

The extension is structured as follows:

- `src/background/`: Contains the background script.
- `src/config/`: Contains configuration constants.
- `src/content/`: Contains the content scripts for interacting with the webpage.
- `src/grammer/`: Houses the AI-powered sentence improvement functionality.
- `src/icons/`: Contains extension icons.
- `src/popup/`: Contains the popup HTML, JS, and CSS for the user interface.
- `src/services/`: Contains service classes, including the Ollama service for AI integration.
- `src/utils/`: Contains utility functions and classes for various operations.

### Key Files

- `background.js`: Manages background processes and communication.
- `contentScript.js`: Injects the main functionality into the webpage.
- `contentScriptInjector.js`: Coordinates between the popup and the main functionality.
- `sentenceImprover.js`: Handles the AI-powered sentence improvement logic.
- `textBoxDetector.js`: Detects and processes text input for improvement.
- `ollamaService.js`: Manages communication with the Ollama AI service.
- `likeManager.js`: Handles the unlike functionality.
- `tweetDeleter.js`: Manages the tweet deletion process.
- `requestInterceptor.js`: Intercepts and analyzes web requests.
- `cookieUtils.js`: Handles cookie-related operations.
- `storage.js`: Manages local storage operations.
- `debounce.js`: Provides debounce functionality for optimized performance.

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
    |-- grammer
    |   |-- sentenceImprover.js
    |   -- textBoxDetector.js
    |-- icons
    |   |-- icon128.png
    |   |-- icon16.png
    |   |-- icon32.png
    |   -- icon48.png
    |-- popup
    |   |-- popup.css
    |   |-- popup.html
    |   -- popup.js
    |-- services
    |   -- ollamaService.js
    -- utils
        |-- cookieUtils.js
        |-- debounce.js
        |-- likeManager.js
        |-- requestInterceptor.js
        |-- storage.js
        -- tweetDeleter.js
``````

## Acknowledgments

This project is based on the work of [lolarchiver](https://github.com/Lyfhael/DeleteTweets). We've significantly expanded upon the original work to create this feature-rich Chrome extension.

### Original Repository
- **Repository**: [deleteTweets](https://github.com/Lyfhael/DeleteTweets)
- **Author**: lolarchiver
- **Repository**: [ollama](https://github.com/ollama/ollama)
- **Author**: jmorganca , mchiang0610


If you find this extension helpful, consider supporting the original author:
- [Ko-fi: lolarchiver](https://ko-fi.com/lolarchiver)

Please note that while we've built upon the original work, any issues with this Chrome extension should be reported in this repository.



## Note on AI Integration

The sentence improvement feature is designed to use the Ollama AI service. However, in the current implementation:

- Direct integration with Ollama is not yet available.
- The extension uses a proxy server to communicate with Ollama.
- Future updates will enable direct Ollama integration.

**Ollama integration is a work in progress. Current implementation
is a placeholder and will be fully implemented in future updates.**
