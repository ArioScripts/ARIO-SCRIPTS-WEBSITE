'use client';
import { useState } from "react";
export function ScriptCodeBox({ code }: { code: string }) {
  const [copied,setCopied] = useState(false);
  async function copy() { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),1500); }
  return <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]">
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <span className="tracking-widest text-xs text-white/50">● ● ●</span><span className="text-xs text-white/50">Lua</span>
      <button onClick={copy} className="rounded-lg bg-white/10 px-3 py-1 text-xs">{copied ? "Copied!" : "Copy"}</button>
    </div>
    <pre className="max-h-[600px] overflow-auto p-5 text-sm leading-6 text-white/85"><code>{code}</code></pre>
  </div>;
}
