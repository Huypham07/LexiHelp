import React from "react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import browser from "webextension-polyfill";

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
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="font-family" className="text-gray-600">
            Font
          </Label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger
              id="font-family"
              className="min-w-40"
              style={{
                fontFamily:
                  fontFamily === "openDyslexic"
                    ? "'OpenDyslexic', sans-serif"
                    : fontFamily === "comic"
                    ? "'Comic Sans MS', cursive, sans-serif"
                    : fontFamily === "arial"
                    ? "'Arial', sans-serif"
                    : fontFamily === "verdana"
                    ? "'Verdana', sans-serif"
                    : fontFamily === "lexend"
                    ? "'Lexend', sans-serif"
                    : fontFamily === "lexieReadble"
                    ? "'LexieReadable', sans-serif"
                    : fontFamily === "centuryGothic"
                    ? "'Century Gothic', sans-serif"
                    : "sans-serif",
              }}>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openDyslexic" style={{ fontFamily: "'OpenDyslexic', sans-serif" }}>
                OpenDyslexic
              </SelectItem>
              <SelectItem value="comic" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
                Comic Sans
              </SelectItem>
              <SelectItem value="arial" style={{ fontFamily: "'Arial', sans-serif" }}>
                Arial
              </SelectItem>
              <SelectItem value="verdana" style={{ fontFamily: "'Verdana', sans-serif" }}>
                Verdana
              </SelectItem>
              <SelectItem value="lexend" style={{ fontFamily: "'Lexend', sans-serif" }}>
                Lexend
              </SelectItem>
              <SelectItem value="lexieReadble" style={{ fontFamily: "'LexieReadable', sans-serif" }}>
                Lexie Readable
              </SelectItem>
              <SelectItem value="centuryGothic" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
                Century Gothic
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="font-size" className="text-gray-600">
            Font Size: {fontSize}px
          </Label>
        </div>
        <Slider
          id="font-size"
          min={12}
          max={32}
          step={1}
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="letter-spacing" className="text-gray-600">
            Letter Spacing: {letterSpacing.toFixed(1)}
          </Label>
        </div>
        <Slider
          id="letter-spacing"
          min={0.5}
          max={10}
          step={0.1}
          value={[letterSpacing]}
          onValueChange={(value) => setLetterSpacing(value[0])}
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="line-height" className="text-gray-600">
            Line Height: {lineHeight.toFixed(1)}
          </Label>
        </div>
        <Slider
          id="line-height"
          min={0.5}
          max={10}
          step={0.1}
          value={[lineHeight]}
          onValueChange={(value) => setLineHeight(value[0])}
        />
      </div>

      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="word-spacing" className="text-gray-600">
            Word Spacing: {wordSpacing.toFixed(1)}
          </Label>
        </div>
        <Slider
          id="word-spacing"
          min={0.5}
          max={10}
          step={0.1}
          value={[wordSpacing]}
          onValueChange={(value) => setWordSpacing(value[0])}
        />
      </div>
    </div>
  );
};

export default TextTab;
