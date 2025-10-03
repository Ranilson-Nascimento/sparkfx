
export type FxItem = { name: string; args: Record<string, any> };
export function parseFx(str?: string | null): FxItem[] {
  if (!str) return [];
  const out: FxItem[] = [];
  const tokens = String(str).split('|').map(s => s.trim()).filter(Boolean);
  for (const tok of tokens) {
    const m = tok.match(/^([a-zA-Z0-9_-]+)(?:\((.*)\))?$/);
    if (!m) continue;
    const name = m[1].toLowerCase();
    const args: Record<string, any> = {};
    if (m[2]) {
      const parts = m[2].split(',').map(x => x.trim()).filter(Boolean);
      for (const p of parts) {
        const idx = p.indexOf('=');
        if (idx < 0) { args[p] = true; continue; }
        const k = p.slice(0, idx).trim();
        let v = p.slice(idx + 1).trim();
        if ((/^'.*'$/.test(v) || /^".*"$/.test(v))) v = v.slice(1, -1);
        if (/^-?\d+(\.\d+)?$/.test(v)) args[k] = parseFloat(v);
        else args[k] = v;
      }
    }
    out.push({ name, args });
  }
  return out;
}
