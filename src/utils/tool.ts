export function parseMarkdownToAnchorItems(md: string) {
  const lines = md.split("\n");
  const result: any[] = [];
  let key = 1;
  let current: any = null;

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)/);
    const h3Match = line.match(/^###\s+(.+)/);

    if (h2Match && h2Match[1]) {
      const title = h2Match[1].trim();
      current = {
        key: String(key++),
        href: `#${title}`,
        title,
      };
      result.push(current);
    } else if (h3Match && h3Match[1]) {
      const title = h3Match[1].trim();
      const child = {
        key: String(key++),
        href: `#${title}`,
        title,
      };
      if (current) {
        current.children = current.children || [];
        current.children.push(child);
      } else {
        // fallback：如果前面没 ##，也允许单独插入
        result.push({
          key: String(key++),
          href: child.href,
          title: "Untitled",
          children: [child],
        });
      }
    }
  }

  return result;
}
