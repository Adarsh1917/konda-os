export async function generateChatTitle(
  message: string
): Promise<string> {
  const title = message
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .slice(0, 4)
    .join(" ");

  return title.length > 0
    ? title
    : "New Chat";
}