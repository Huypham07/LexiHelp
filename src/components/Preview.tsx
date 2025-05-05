import { sendTextMessage, TextMessage } from "@/background/background";
import React, { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import browser from "webextension-polyfill";
import { getBackgroundColor, getTextColorByHex } from "@/utils/utils";
export const getActualFontFamily = (fontKey: string): string => {
  switch (fontKey) {
    case "comic":
      return '"Comic Sans MS", cursive, sans-serif';
    case "arial":
      return "Arial, sans-serif";
    case "verdana":
      return "Verdana, sans-serif";
    case "openDyslexic":
      return '"OpenDyslexic", sans-serif';
    case "lexend":
      return "'Lexend', sans-serif";
    case "lexieReadble":
      return "'Lexie Readable', sans-serif";
    case "centuryGothic":
      return '"Century Gothic", sans-serif';
    default:
      return "sans-serif";
  }
};

interface PreviewProps {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  fontFamily: string;
  ruler: boolean;
  rulerHeight: number;
  rulerOpacity: number;
  rulerColor: string;
  colorTheme: string;
  colorCodingEnabled: boolean;
}

export interface PreviewRefs {
  onReadPreviewText: () => Promise<void>;
}

const previewText = "This is how your text will look with the current settings.";

const Preview = forwardRef<PreviewRefs, PreviewProps>(
  ({ fontSize, letterSpacing, lineHeight, wordSpacing, fontFamily, ruler, rulerHeight, rulerColor, rulerOpacity, colorTheme, colorCodingEnabled }, ref) => {
    useImperativeHandle(ref, () => ({
      onReadPreviewText: async () => {
        // Simulate reading the preview text
        try {
          const tabs = await browser.tabs.query({ active: true, currentWindow: true });
          const tab = tabs[0];
          if (!tab?.id) {
            console.error("No active tab found");
            return;
          }
          const message: TextMessage = {
            action: "readSelection",
            text: previewText,
          };
          sendTextMessage(tab.id, message);
        } catch (error) {
          console.error("Error sending TTS message:", error);
        }
      },
    }));
    return (
      <div
        className="preview-container p-4 rounded-lg shadow-md border"
        style={{
          background: getBackgroundColor(colorTheme),
          color: getTextColorByHex(colorTheme),
        }}>
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <p
          className="text-sm"
          style={{
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing * 0.05}em`,
            lineHeight: lineHeight,
            wordSpacing: `${wordSpacing * 0.1}em`,
            fontFamily: getActualFontFamily(fontFamily),
            color: getTextColorByHex(colorTheme),
          }}>
          {previewText}
        </p>
        {ruler && <div className=""></div>}
      </div>
    );
  }
);

export default Preview;
