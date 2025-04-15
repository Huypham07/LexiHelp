import { getBackgroundColor, getTextColorByHex } from "@/utils/utils";

interface PreviewProps {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  ttsHighlight: boolean;
  ruler: boolean;
  colorTheme: string;
}

const Preview: React.FC<PreviewProps> = ({
  fontSize,
  letterSpacing,
  lineHeight,
  wordSpacing,
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
