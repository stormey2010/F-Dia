# F Dia Chrome Extension

F Dia is a simple Chrome extension that injects custom scripts into [Gemini by Google](https://gemini.google.com/) pages to enhance functionality.

## Prerequisites

- Google Chrome or any Chromium-based browser (Edge, Brave, etc.)
- Basic familiarity with loading unpacked extensions in Chrome

## Downloading the Code

You can download the extension code in one of two ways:

1. **Clone the repository (if available on GitHub):**

   ```powershell
   git clone <repository-url>
   cd Dia
   ```

2. **Download ZIP archive:**
   - Click the **Download ZIP** button on the GitHub page.
   - Extract the ZIP file to a folder of your choice, for example `C:\Users\YourName\Downloads\Dia`.

> **Note:** Replace paths and URLs above with the actual repository URL or folder names as needed.

## Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. In the file picker, navigate to the folder where you extracted or cloned the code (`Dia`) and select it.
5. You should now see **F Dia** in the list of installed extensions.

## Usage

1. Navigate to [https://gemini.google.com/](https://gemini.google.com/).
2. The extension will automatically inject `inject.js` at `document_idle`.
3. Use the extension’s functionality as intended (custom UI, shortcuts, etc.).

## Project Structure

```
Dia/
├── background.js       # Service worker entry point
├── inject.js           # Content script injected into Gemini pages
├── index.html          # (Optional) UI page if you open extension directly
├── icon128.jpg         # Extension icons (16x16, 48x48, 128x128)
├── manifest.json       # Chrome extension manifest (v3)
└── _locales/           # Localization files
    └── en/messages.json
```

## Permissions

- **scripting**: To inject scripts into web pages.
- **tabs**: To interact with browser tabs.
- **host_permissions**: Allows matching for all URLs (`http://*/*`, `https://*/*`) and `https://gemini.google.com/*`.

## Troubleshooting

- If changes to scripts don’t apply, reload the extension on `chrome://extensions/`.
- Check the DevTools console on Gemini pages for errors.

## Contributing

Contributions are welcome! Please open issues or submit pull requests on the repository.
