# LexiHelp

A browser extension designed to improve web readability, especially for individuals with dyslexia or reading difficulties. It offers customizable text styling, distraction-free reading, text-to-speech, and smart text summarization to enhance the online reading experience.

---

## Features

- **Font & Text Styling**

  - Adjust **font size**, **letter spacing**, **line height**, and **word spacing**.
  - Choose from dyslexia-friendly fonts like **OpenDyslexic**.
  - Apply accessible **color schemes** to reduce visual stress.

- **Reading Ruler**

  - Highlight lines of text to help maintain focus while reading.

- **Text-to-Speech (TTS)**

  - Convert selected text into speech with customizable voice settings.

- **Remove Distractions**

  - Clean webpages by hiding unnecessary elements for focused reading.

- **Text Summarization**
  - Generate quick summaries of selected text:
    - **Extractive Summarization** (Fast, offline via backend with pyTextRank).
    - **AI-Powered Summarization** using external APIs (Cohere).

---

## Technologies Used

- **TypeScript**
- **React**
- **Webpack** – Module bundler for development and production builds.
- **Web Extension Polyfill** – Ensures cross-browser compatibility.
- **Text-to-Speech APIs** and **Mozilla Readability** for content extraction.

---

## Installation

### Development Setup

1. Clone this repository
   ```
   git clone https://github.com/Huypham07/LexiHelp.git
   cd extension/
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start Development Mode:

- For Chrome:
  ```
  npm run start:chrome
  ```
- For Firefox:
  ```
  npm run start:firefox
  ```

4. Build for Production:

To generate production-ready builds for both Chrome and Firefox:

```
npm run build
```

The output will be located in the `dist/` directory.

### Build for Production

```
npm run build
```

This will create a `dist` folder with the extension files.

### Load the Extension

- Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/chrome` folder

- Firefox

1. Go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on..."
4. Select the `manifest.json` file from the `dist/firefox` folder

---

## Backend Integration

For advanced **AI-powered summarization**, LexiHelp connects to a backend powered by **FastAPI**, supporting both quick extractive and smart abstractive summarization methods.

### Available Endpoints

- `POST /api/summarize/extract`  
  Fast extractive summarization using **TextRank** (via pyTextRank).

- `POST /api/summarize/abstract`  
  Smart abstractive summarization powered by the **Cohere API**.

Ensure your backend server is running and configured properly in the extension settings.

### Setup Backend Server

Ensure you have Python installed, then follow these steps:

After clone this repository

```
cd backend
```

```
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

The backend will start on http://localhost:8000 by default.

> **Note:**  
> Don't forget to configure your `COHERE_API_KEY` in a `.env` file for the abstractive summarization to work properly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
