import browser from 'webextension-polyfill';

applyClassStyles();

interface StyleMessage {
    type: string;
    fontSize?: number;
    letterSpacing?: number;
    lineHeight?: number;
    wordSpacing?: number;
    fontFamily?: string; 
  }
  
  function updateStyles({ fontSize, letterSpacing, lineHeight, wordSpacing, fontFamily }: {
    fontSize?: number;
    letterSpacing?: number;
    lineHeight?: number;
    wordSpacing?: number;
    fontFamily?: string;
  }): void {
    const root = document.documentElement.style;
    if (fontSize !== undefined) root.setProperty('--font-size', `${fontSize}px`);
    if (letterSpacing !== undefined) root.setProperty('--letter-spacing', `${letterSpacing}px`);
    if (lineHeight !== undefined) root.setProperty('--line-height', `${lineHeight}`);
    if (wordSpacing !== undefined) root.setProperty('--word-spacing', `${wordSpacing}px`);
    if (fontFamily !== undefined) {
      let fallback = 'sans-serif';
      if (fontFamily === 'comic') fallback = '"Comic Sans MS", cursive, sans-serif';
      else if (fontFamily === 'arial') fallback = 'Arial, sans-serif';
      else if (fontFamily === 'verdana') fallback = 'Verdana, sans-serif';
      else if (fontFamily === 'openDyslexic') fallback = '"OpenDyslexic", sans-serif';
      else if (fontFamily === 'lexend') fallback = "'Lexend', sans-serif";
      else if (fontFamily === 'lexieReadble') fallback = "'Lexie Readable', sans-serif";
      else if (fontFamily === 'centuryGothic') fallback = '"Century Gothic", sans-serif';


      root.setProperty('--font-family', fallback);
    }
}
  
  browser.runtime.onMessage.addListener(
    (message: StyleMessage, _sender: browser.runtime.MessageSender, sendResponse: (response: { success: boolean }) => void) => {
      switch (message.type) {
        case 'UPDATE_FONT_SIZE':
          updateStyles({ fontSize: message.fontSize });
          break;
        case 'UPDATE_LETTER_SPACING':
          updateStyles({ letterSpacing: message.letterSpacing });
          break;
        case 'UPDATE_LINE_HEIGHT':
          updateStyles({ lineHeight: message.lineHeight });
          break;
        case 'UPDATE_WORD_SPACING':
          updateStyles({ wordSpacing: message.wordSpacing });
          break;
        case 'UPDATE_FONT_FAMILY':
          updateStyles({ fontFamily: message.fontFamily });
          break;
        case 'UPDATE_ALL_STYLES':
          updateStyles({
            fontSize: message.fontSize,
            letterSpacing: message.letterSpacing,
            lineHeight: message.lineHeight,
            wordSpacing: message.wordSpacing,
            fontFamily: message.fontFamily,
          });
          break;
        case 'ENABLE_EXTENSION':
          applyClassStyles(); // đã có sẵn
          break;
        case 'DISABLE_EXTENSION':
          document.documentElement.classList.remove('readability-mode');
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
      sendResponse({ success: true });
      return true;
    }
  );

  

  function applyClassStyles() {
    const styleTagId = 'readability-extension-style';
  
    if (!document.getElementById(styleTagId)) {
      const style = document.createElement('style');
      style.id = styleTagId;
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Lexend&display=swap');
        
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('${browser.runtime.getURL("fonts/OpenDyslexic-Regular.woff2")}') format('woff2');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Lexie Readable';
          src: url('${browser.runtime.getURL("fonts/LexieReadable-Regular.woff2")}') format('woff2');
          font-weight: normal;
          font-style: normal;
        }
          
        .readability-mode, .readability-mode * {
          font-size: var(--font-size, 16px) !important;
          letter-spacing: var(--letter-spacing, normal) !important;
          line-height: var(--line-height, 1.5) !important;
          word-spacing: var(--word-spacing, normal) !important;
          font-family: var(--font-family, sans-serif) !important;
        }
      `;
      document.head.appendChild(style);
    }
  
    document.documentElement.classList.add('readability-mode');
  }
  
  browser.storage.local.get(['extensionEnabled']).then(({ extensionEnabled }) => {
    if (extensionEnabled) {
      browser.storage.local.get(
        ['fontSize', 'letterSpacing', 'lineHeight', 'wordSpacing', 'fontFamily']).then(
        (result) => {
          updateStyles({ 
            fontSize: result.fontSize as number | undefined, 
            letterSpacing: result.letterSpacing as number | undefined, 
            lineHeight: result.lineHeight as number | undefined, 
            wordSpacing: result.wordSpacing as number | undefined, 
            fontFamily: result.fontFamily as string | undefined 
          });
          applyClassStyles();
        }
      );
    } else {
      // Nếu extension bị tắt thì remove class
      document.documentElement.classList.remove("readability-mode");
    }
  });

  