import {
  File,
  FileCode2,
  FileJson,
  FileText,
  Image,
} from "lucide-react";

import type { JSX } from "react";

interface GetFileIconProps {
  name: string;
  size?: number;
}

export function getFileIcon({
  name,
  size = 16,
}: GetFileIconProps): JSX.Element {
  const lower = name.toLowerCase();

  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) {
    return <FileCode2 size={size} />;
  }

  if (lower.endsWith(".json")) {
    return <FileJson size={size} />;
  }

  if (
    lower.endsWith(".md") ||
    lower.endsWith(".txt")
  ) {
    return <FileText size={size} />;
  }

  if (
    lower.endsWith(".png") ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".svg") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".bmp") ||
    lower.endsWith(".ico")
  ) {
    return <Image size={size} />;
  }

  return <File size={size} />;
}