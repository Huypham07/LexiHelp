import browser from "webextension-polyfill";
import { StyleMessage, ToggleMessage } from "@/background/background";

browser.runtime.onMessage.addListener((message: StyleMessage) => {
  updateStyles({
    fontFamily: message.fontFamily,
    fontSize: message.fontSize,
    letterSpacing: message.letterSpacing,
    lineHeight: message.lineHeight,
    wordSpacing: message.wordSpacing,
  });
  return true;
});

function updateStyles({
  fontSize,
  letterSpacing,
  lineHeight,
  wordSpacing,
  fontFamily,
}: {
  fontSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
  wordSpacing?: number;
  fontFamily?: string;
}): void {
  const root = document.documentElement.style;
  if (fontSize !== undefined) root.setProperty("--font-size", `${fontSize}px`);
  if (letterSpacing !== undefined) root.setProperty("--letter-spacing", `${letterSpacing}px`);
  if (lineHeight !== undefined) root.setProperty("--line-height", `${lineHeight}`);
  if (wordSpacing !== undefined) root.setProperty("--word-spacing", `${wordSpacing}px`);
  if (fontFamily !== undefined) {
    const name = fontFamily.toLowerCase();
    let fallback = "sans-serif";
    switch (name) {
      case "comic":
        fallback = '"Comic Sans MS", cursive, sans-serif';
        break;
      case "arial":
        fallback = "Arial, sans-serif";
        break;
      case "verdana":
        fallback = "Verdana, sans-serif";
        break;
      case "opendyslexic":
        fallback = '"OpenDyslexic", sans-serif';
        break;
      case "lexend":
        fallback = "'Lexend', sans-serif";
        break;
      case "lexiereadable":
        fallback = "'Lexie Readable', sans-serif";
        break;
      case "centurygothic":
        fallback = '"Century Gothic", sans-serif';
        break;
    }

    root.setProperty("--font-family", fallback);
  }
}

function applyClassStyles() {
  const styleTagId = "readability-extension-style";

  if (!document.getElementById(styleTagId)) {
    const style = document.createElement("style");
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

  document.documentElement.classList.add("readability-mode");
}

function enableTextStyle(message: StyleMessage) {
  updateStyles({
    fontSize: message.fontSize as number | undefined,
    letterSpacing: message.letterSpacing as number | undefined,
    lineHeight: message.lineHeight as number | undefined,
    wordSpacing: message.wordSpacing as number | undefined,
    fontFamily: message.fontFamily as string | undefined,
  });
  applyClassStyles();
}

function disableTextStyle() {
  // Xóa class readability-mode khỏi documentElement
  document.documentElement.classList.remove("readability-mode");
  // Xóa các biến CSS custom (reset về mặc định)
  const root = document.documentElement.style;
  root.removeProperty("--font-size");
  root.removeProperty("--letter-spacing");
  root.removeProperty("--line-height");
  root.removeProperty("--word-spacing");
  root.removeProperty("--font-family");

  // (Tùy chọn) Gỡ <style> tag nếu bạn không dùng lại
  const styleTag = document.getElementById("readability-extension-style");
  if (styleTag) {
    styleTag.remove();
  }
}

browser.runtime.onMessage.addListener((message: StyleMessage) => {
  if (message.action === "setTextStyle") {
    if (message.enabled) {
      enableTextStyle(message);
    } else {
      disableTextStyle();
    }
  }
});
