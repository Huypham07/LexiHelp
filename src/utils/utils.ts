export function getBackgroundColor(colorTheme: string): string {
  switch (colorTheme) {
    case "green":
      return "#E8F5E9";
    case "neutral":
      return "#D3D3D3";
    case "vibrant":
      return "#F4C2C2";
    case "subtle and relaxed":
      return "#F5F5DC";
    case "pastel":
      return "#E6E6FA";
    case "hightlight":
      return "#003366";
    case "dark":
      return "#000000";
    case "light":
      return "#333333";
    case "muted":
      return "#2F4F4F";
    default:
      return "#FFFFFF"; // Default background color
  }
}


export function getTextColor (colorTheme: string) : string {
    switch (colorTheme) {
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
