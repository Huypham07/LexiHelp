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
}) => {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="form-row">
          <Label htmlFor="font-family" className="text-gray-600">
            Font
          </Label>
          <Select defaultValue="openDyslexic">
            <SelectTrigger id="font-family" className="min-w-40">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openDyslexic">OpenDyslexic</SelectItem>
              <SelectItem value="comic">Comic Sans</SelectItem>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="verdana">Verdana</SelectItem>
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
          max={3}
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
          min={1}
          max={3}
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
          max={3}
          step={0.1}
          value={[wordSpacing]}
          onValueChange={(value) => setWordSpacing(value[0])}
        />
      </div>
    </div>
  );
};

export default TextTab;
