interface PreviewProps {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  ttsHighlight: boolean;
  ruler: boolean;
  colorTheme: string;
}

// Define the color based on the theme
const getTextColor = (theme: string) => {
  switch (theme) {
    case "high contrast":
      return "#000";
    case "soft contrast":
      return "#6B4F3C";
    case "warm and calm":
      return "#003366";
    case "dark":
      return "#fff";
    case "light":
      return "#FFFF00";
    case "muted":
      return "#98FB98";
    case "neutral":
      return "#4B4B4B";
    case "subtle and relaxed":
      return "#003366";
    case "vibrant":
      return "#000";
    case "hightlight":
      return "#FFFFFF";
    case "pastel":
      return "#4B0082";
    default:
      return "#000"; // Default color for custom or other themes
  }
}

const getBackgroundColor = (theme: string) => {
  switch (theme) {
    case "high contrast":
      return "#FFFFFF";
    case "soft contrast":
      return "#FFF8DC";
    case "warm and calm":
      return "#FFFFE0";
    case "dark":
      return "#000000";
    case "light":
      return "#333333";
    case "muted":
      return "#2F4F4F";
    case "neutral":
      return "#D3D3D3";
    case "subtle and relaxed":
      return "#F5F5DC";
    case "vibrant":
      return "#F4C2C2";
    case "hightlight":
      return "#003366";
    case "pastel":
      return "#E6E6FA";
    case "green":
      return "#E8F5E9";
    default:
      return "#FFFFFF"; // Default color for custom or other themes
  }
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
        color: getTextColor(colorTheme)
      }}>
      <h3 className="text-sm font-medium mb-2">Preview</h3>
      <p
        className="text-sm"
        style={{
          fontSize: `${fontSize}px`,
          letterSpacing: `${letterSpacing * 0.05}em`,
          lineHeight: lineHeight,
          wordSpacing: `${wordSpacing * 0.1}em`,
          color: getTextColor(colorTheme),
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
