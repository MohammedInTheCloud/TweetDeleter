# deleteTweets

DeleteTweets is a Chrome extension designed to help you easily delete all your tweets.

## Features

- Delete All Tweets: Effortlessly remove all your tweets with a single click.

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Visit x.com and interact with the site to trigger the target request.
2. Click on the extension icon in the Chrome toolbar to view the captured information, including cookies.
3. **Refresh the page before starting to delete.**
4. Enter your username.

## Development

The extension is structured as follows:

- `src/background/`: Contains the background script for intercepting requests and capturing cookies.
- `src/popup/`: Contains the popup HTML, JS, and CSS for displaying information.
- `src/utils/`: Contains utility functions for storage operations and cookie retrieval.
- `src/config/`: Contains configuration constants.
- `src/content/`: Contains the content script for extracting information from the webpage.

To modify the target URL, add more features, or adjust cookie capture, edit the respective files in the `src/` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Directory structure

twitter/
|-- manifest.json
|-- README.md
|-- repo_documenter.config
|-- request-info-extension.md
-- src
    |-- background
    |   -- background.js
    |-- config
    |   -- constants.js
    |-- content
    |   -- contentScript.js
    |-- popup
    |   |-- popup.css
    |   |-- popup.html
    |   -- popup.js
    -- utils
        |-- storage.js
        -- cookieUtils.js

## Permissions

This extension requires the following permissions:
- webRequest: To intercept and analyze web requests
- storage: To store captured information
- cookies: To access and retrieve specific cookies
- Host permissions for twitter.com and x.com

## Troubleshooting

If you encounter issues with cookie retrieval:
1. Ensure you're logged into Twitter in the same browser profile where the extension is installed.
2. Check that the extension has the necessary permissions in your browser settings.
3. If cookies are not being captured, try refreshing the Twitter page or logging out and back in.

For more detailed troubleshooting, check the browser console for any error messages.

## Acknowledgments

This project is based on the work of [lolarchiver](https://github.com/Lyfhael/DeleteTweets). I'd like to express my gratitude for their original script that formed the foundation of this Chrome extension. 

### Original Repository
- **Repository**: [deleteTweets](https://github.com/Lyfhael/DeleteTweets)
- **Author**: lolarchiver
- **Description**: A script for bulk deleting tweets with various filtering options.

I've adapted and extended the original work to create this Chrome extension. I encourage users to check out the original repository for more information on the core tweet deletion functionality.

If you find this extension helpful, consider supporting the original author:
- [Ko-fi: lolarchiver](https://ko-fi.com/lolarchiver)

Please note that while we've built upon the original work, any issues with this Chrome extension should be reported here rather than to the original repository.
