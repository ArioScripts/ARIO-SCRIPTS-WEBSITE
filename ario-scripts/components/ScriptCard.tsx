import Link from "next/link";
import type { Script } from "@/lib/types";
export function ScriptCard({ script }: { script: Script }) { return <article className="card-hover glass overflow-hidden rounded-2xl">
  {script.image_url && <img src={script.image_url} alt="" className="h-44 w-full object-cover" />}
  <div className="p-5"><div className="mb-2 text-xs text-white/40">{script.game_name}</div><h3 className="text-lg font-bold">{script.title}</h3>
  <p className="mt-2 line-clamp-2 text-sm text-white/55">{script.short_description}</p>
  <div className="mt-4 flex items-center justify-between text-xs text-white/40"><span>↗ {script.copy_count} copies</span><span>↓ {script.download_count}</span></div>
  <Link href={`/scripts/${script.slug}`} className="mt-4 block rounded-xl bg-white px-4 py-2 text-center text-sm font-semibold text-black">View Script</Link></div>
</article>; }
