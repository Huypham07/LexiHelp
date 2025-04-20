import React from "react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface TextTabProps {
  fontSize: number;
  setFontSize: (value: number) => void;
  letterSpacing: number;
  setLetterSpacing: (value: number) => void;
  lineHeight: number;
  setLineHeight: (value: number) => void;
  wordSpacing: number;
  setWordSpacing: (value: number) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
}

const TextTab: React.FC<TextTabProps> = ({
  fontSize,
  setFontSize,
  letterSpacing,
  setLetterSpacing,
  lineHeight,
  setLineHeight,
  wordSpacing,
  setWordSpacing,
  fontFamily,
  setFontFamily,
}) => {
  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    chrome.storage.sync.set({ fontFamily: value });
    
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'UPDATE_FONT_FAMILY',
            fontFamily: value,
          });
        }
      });
    });
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    chrome.storage.sync.set({ fontSize: newSize });

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'UPDATE_FONT_SIZE',
            fontSize: newSize
          });
        }
      });
    });
  };

  const handleLetterSpacingChange = (value: number[]) => {
    const newSpacing = value[0];
    setLetterSpacing(newSpacing);
    chrome.storage.sync.set({ letterSpacing: newSpacing });

    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'UPDATE_LETTER_SPACING',
            letterSpacing: newSpacing
          });
        }
      });
    });
  };


  const handleLineHeightChange = (value: number[]) => {
    const newHeight = value[0];
    setLineHeight(newHeight);
    chrome.storage.sync.set({ lineHeight: newHeight });
    
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'UPDATE_LINE_HEIGHT',
            lineHeight: newHeight
          });
        }
      });
    });
  };

  const handleWordSpacingChange = (value: number[]) => {
    const newSpacing = value[0];
    setWordSpacing(newSpacing);
    chrome.storage.sync.set({ wordSpacing: newSpacing });
    
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'UPDATE_WORD_SPACING',
            wordSpacing: newSpacing
          });
        }
      });
    });
  };
  

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="font-family" className="text-gray-600">
            Phông chữ
          </Label>
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger id="font-family" className="min-w-40"
              style={{ 
                fontFamily: fontFamily === "openDyslexic" ? "'OpenDyslexic', sans-serif" : 
                fontFamily === "comic" ? "'Comic Sans MS', cursive, sans-serif" : 
                fontFamily === "arial" ? "'Arial', sans-serif" : 
                fontFamily === "verdana" ? "'Verdana', sans-serif" : 
                fontFamily === "lexend" ? "'Lexend', sans-serif" : 
                fontFamily === "lexieReadble" ? "'LexieReadable', sans-serif" : 
                fontFamily === "centuryGothic" ? "'Century Gothic', sans-serif" : 
                'sans-serif' }} >
              <SelectValue placeholder="Chọn phông chữ"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openDyslexic" style={{ fontFamily: "'OpenDyslexic', sans-serif" }}>OpenDyslexic</SelectItem>
              <SelectItem value="comic" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>Comic Sans</SelectItem>
              <SelectItem value="arial" style={{ fontFamily: "'Arial', sans-serif" }}>Arial</SelectItem>
              <SelectItem value="verdana" style={{ fontFamily: "'Verdana', sans-serif" }}>Verdana</SelectItem>
              <SelectItem value="lexend" style={{ fontFamily: "'Lexend', sans-serif" }}>Lexend</SelectItem>
              <SelectItem value="lexieReadble" style={{ fontFamily: "'LexieReadable', sans-serif" }}>Lexie Readable</SelectItem>
              <SelectItem value="centuryGothic" style={{ fontFamily: "'Century Gothic', sans-serif" }}>Century Gothic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="font-size" className="text-gray-600">
            Kích thước chữ: {fontSize}px
          </Label>
        </div>
        <Slider
          id="font-size"
          min={12}
          max={32}
          step={1}
          value={[fontSize]}
          onValueChange={handleFontSizeChange} // Đảm bảo sử dụng hàm này
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="letter-spacing" className="text-gray-600">
            Khoảng cách chữ: {letterSpacing.toFixed(1)}
          </Label>
        </div>
        <Slider
          id="letter-spacing"
          min={0.5}
          max={10}
          step={0.1}
          value={[letterSpacing]}
          onValueChange={(handleLetterSpacingChange)}
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="line-height" className="text-gray-600">
            Chiều cao dòng: {lineHeight.toFixed(1)}
          </Label>
        </div>
        <Slider
          id="line-height"
          min={0.5}
          max={10}
          step={0.1}
          value={[lineHeight]}
          onValueChange={(handleLineHeightChange)}
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="word-spacing" className="text-gray-600">
            Khoảng cách từ: {wordSpacing.toFixed(1)}
          </Label>
        </div>
        <Slider
          id="word-spacing"
          min={0.5}
          max={10}
          step={0.1}
          value={[wordSpacing]}
          onValueChange={(handleWordSpacingChange)}
        />
      </div>
    </div>
  );
};

export default TextTab;