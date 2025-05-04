import { getBackgroundColor, getTextColorByHex } from "@/utils/utils";
export const getActualFontFamily = (fontKey: string): string => {
  switch (fontKey) {
    case "comic":
      return '"Comic Sans MS", cursive, sans-serif';
    case "arial":
      return 'Arial, sans-serif';
    case "verdana":
      return 'Verdana, sans-serif';
    case "openDyslexic":
      return '"OpenDyslexic", sans-serif';
    case "lexend":
      return "'Lexend', sans-serif";
    case "lexieReadble":
      return "'Lexie Readable', sans-serif";
    case "centuryGothic":
      return '"Century Gothic", sans-serif';
    default:
      return 'sans-serif';
  }
};

interface PreviewProps {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  fontFamily: string;
  ttsHighlight: boolean;
  ruler: boolean;
  colorTheme: string;
}

const Preview: React.FC<PreviewProps> = ({
  fontSize,
  letterSpacing,
  lineHeight,
  wordSpacing,
  fontFamily,
  ttsHighlight,
  ruler,
  colorTheme,
}) => {
  return (
    <div
      className="preview-container p-4 rounded-lg shadow-md border"
      style={{
        background: getBackgroundColor(colorTheme),
        color: getTextColorByHex(colorTheme)
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
        {ttsHighlight ? (
          "This is how your text will look with the current settings."
        ) : (
          "This is how your text will look with the current settings."
        )}
      </p>
      {ruler && <div className=""></div>}
    </div>
  );
};

export default Preview;
