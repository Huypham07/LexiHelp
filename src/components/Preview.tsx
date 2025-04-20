import React, { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import browser from "webextension-polyfill";
interface PreviewProps {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  ruler: boolean;
  colorTheme: string;
}

export interface PreviewRefs {
  onReadPreviewText: () => Promise<void>;
}

const previewText = "This is how your text will look with the current settings.";

const Preview = forwardRef<PreviewRefs, PreviewProps>(
  ({ fontSize, letterSpacing, lineHeight, wordSpacing, ruler, colorTheme }, ref) => {
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

          await browser.tabs.sendMessage(tab.id, {
              action: "readSelection",
              text: previewText,
            });
        } catch (error) {
          console.error("Error sending TTS message:", error);
        }
      },
    }));

    return (
      <div
        className="preview-container p-4 rounded-lg shadow-md border"
        style={{
          background:
            colorTheme === "cream"
              ? "#f8f3e3"
              : colorTheme === "dark"
              ? "#222"
              : colorTheme === "blue"
              ? "#e6f3ff"
              : colorTheme === "yellow"
              ? "#fffde7"
              : colorTheme === "green"
              ? "#e8f5e9"
              : "#f5f5f5",
          color: colorTheme === "dark" ? "#fff" : "#333",
        }}>
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <p
          className="text-sm"
          style={{
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing * 0.05}em`,
            lineHeight: lineHeight,
            wordSpacing: `${wordSpacing * 0.1}em`,
            color: colorTheme === "dark" ? "#fff" : "#333",
          }}>
          {previewText}
        </p>
        {ruler && <div className=""></div>}
      </div>
    );
  }
);

export default Preview;
