import fs from "node:fs";
import path from "node:path";

export interface HsxSignature {
  id: string;
  kind: string;
  pattern: string;
  category?: string;
  riskWeight?: number;
  entropyHint?: boolean;
  enabled?: boolean;
}

export function loadSignatures(dir: string): HsxSignature[] {
  if (!fs.existsSync(dir)) return [];
  const acc: HsxSignature[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, "utf8");
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const sig of parsed) {
          if (sig && sig.enabled !== false) acc.push(sig);
        }
      }
    } catch {
      // Ignore malformed file
    }
  }
  return acc;
}