# LexiHelp

A browser extension to help people with dyslexia read web content more easily.

## Features

- **Font Size Adjustment**: Increase text size for better readability
- **Dyslexia-Friendly Fonts**: Including OpenDyslexic and other readable fonts
- **Line Spacing Control**: Adjust line spacing for better text tracking
- **Letter Spacing Control**: Increase space between letters to reduce crowding
- **Color Schemes**: Choose from various dyslexia-friendly color combinations
- **Text Alignment**: Force left alignment for improved readability

## Technologies Used

- TypeScript
- React
- Vite
- Web Extension Polyfill (for cross-browser compatibility)

## Installation

### Development Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Build for Production

```
npm run build
```

This will create a `dist` folder with the extension files.

### Load the extension in Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

### Load the extension in Firefox

1. Go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on..."
4. Select the `manifest.json` file from the `dist` folder

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
