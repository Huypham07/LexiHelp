import { sendTextMessage, TextMessage } from "@/background/background";
import React, { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import browser from "webextension-polyfill";
import { getBackgroundColor, getTextColorByHex } from "@/utils/color";

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

// Mã phối màu cho người khuyết tật đọc
const colorPalette = [
  "#A0C4FF", // Màu xanh dương nhạt
  "#678CB1", // Màu xanh dương-xám
  "#FFB29B", // Màu cam nhạt
];

// Hàm phân tách từ thành các âm tiết giả định
function splitIntoPseudoSyllables(word: string): string[] {
  if (!word || word.length <= 2) return [word]; // Không phân tách từ ngắn

  const syllables: string[] = [];
  const vowels = "aeiouyAEIOUY";
  let currentSyllable = "";
  let hasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    currentSyllable += char;

    if (vowels.includes(char)) {
      hasVowel = true;
    }

    // Quy tắc phân chia âm tiết đơn giản:
    // 1. Sau khi có ít nhất một nguyên âm
    // 2. Khi gặp mẫu phụ âm-nguyên âm (CV)
    // 3. Hoặc khi độ dài âm tiết đạt tối ưu (2-3 ký tự)
    if (hasVowel && i < word.length - 1) {
      const nextChar = word[i + 1];

      if (
        (!vowels.includes(char) && vowels.includes(nextChar)) || // Ranh giới Phụ âm-Nguyên âm
        currentSyllable.length >= 3 // Độ dài âm tiết tối ưu
      ) {
        syllables.push(currentSyllable);
        currentSyllable = "";
        hasVowel = false;
      }
    }
  }

  // Thêm các ký tự còn lại vào âm tiết cuối cùng
  if (currentSyllable) {
    syllables.push(currentSyllable);
  }

  return syllables;
}

// Hàm để tạo JSX với màu sắc dựa trên âm tiết
function colorizeText(text: string): React.ReactNode[] {
  const wordsAndSpaces = text.split(/(\s+)/);
  const result: React.ReactNode[] = [];

  wordsAndSpaces.forEach((part: string, partIndex: number) => {
    if (part.match(/^\s+$/)) {
      // Giữ nguyên khoảng trắng
      result.push(part);
    } else if (part.length > 0) {
      const isWord = /[a-zA-Z0-9]/.test(part);

      if (isWord) {
        // Phân tách từ thành âm tiết
        const syllables = splitIntoPseudoSyllables(part);

        // Áp dụng màu luân phiên cho các âm tiết
        syllables.forEach((syllable, index) => {
          const colorIndex = index % colorPalette.length;
          result.push(
            <span
              key={`${partIndex}-${index}`}
              style={{ color: colorPalette[colorIndex] }}
              className="dyslexia-color-syllable">
              {syllable}
            </span>
          );
        });
      } else {
        // Giữ nguyên dấu câu và các ký tự đặc biệt khác
        result.push(part);
      }
    }
  });

  return result;
}

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
  (
    {
      fontSize,
      letterSpacing,
      lineHeight,
      wordSpacing,
      fontFamily,
      ruler,
      rulerHeight,
      rulerColor,
      rulerOpacity,
      colorTheme,
      colorCodingEnabled,
    },
    ref
  ) => {
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
            color: colorCodingEnabled ? undefined : getTextColorByHex(colorTheme),
          }}>
          {colorCodingEnabled ? colorizeText(previewText) : previewText}
        </p>
        {ruler && (
          <div
            className="ruler-line mt-1"
            style={{
              height: `${rulerHeight}px`,
              backgroundColor: rulerColor,
              opacity: rulerOpacity / 100,
            }}
          />
        )}
      </div>
    );
  }
);

export default Preview;
