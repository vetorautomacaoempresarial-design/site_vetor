// Leitura do markdown dos documentos legais em build/SSR (servidor).
// NÃO importar em componentes client.
import fs from "node:fs";
import path from "node:path";

export function getLegalMarkdown(slug: string): string {
  const file = path.join(process.cwd(), "content", "legal", `${slug}.md`);
  return fs.readFileSync(file, "utf8");
}
