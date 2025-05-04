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
    case "default":
      return "";
    default:
      return "#FFFFFF"; // Default background color
  }
}


export function getTextColorByHex (colorTheme: string) : string {
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
        case "default":
            return "";
        default:
            return "#000"; // Default color for custom or other themes
    }
}

export function getTextColorByTailwind(colorTheme: string): string {
  switch (colorTheme) {
    case "high contrast":
      return "text-black"; // Tailwind class for black text
    case "soft contrast":
      return "text-amber-800"; // Tailwind class for a soft brown color
    case "warm and calm":
      return "text-blue-900"; // Tailwind class for a deep blue color
    case "dark":
      return "text-white"; // Tailwind class for white text
    case "light":
      return "text-yellow-400"; // Tailwind class for yellow text
    case "muted":
      return "text-green-300"; // Tailwind class for a muted green color
    case "neutral":
      return "text-gray-700"; // Tailwind class for a neutral gray color
    case "subtle and relaxed":
      return "text-blue-900"; // Tailwind class for a deep blue color
    case "vibrant":
      return "text-black"; // Tailwind class for black text
    case "hightlight":
      return "text-white"; // Tailwind class for white text
    case "pastel":
      return "text-indigo-700"; // Tailwind class for a pastel indigo color
    case "default":
      return "";
    default:
      return "text-black"; // Default Tailwind class for black text
  }
}