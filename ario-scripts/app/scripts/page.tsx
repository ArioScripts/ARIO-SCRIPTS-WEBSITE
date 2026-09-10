import { supabaseServer } from "@/lib/supabase/server";
import { ScriptCard } from "@/components/ScriptCard";
export default async function Scripts({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q=(await searchParams).q?.trim();
  const db=await supabaseServer(); let query=db.from("scripts").select("*").eq("status","published").order("created_at",{ascending:false}).range(0,23);
  if(q) query=query.or(`title.ilike.%${q}%,game_name.ilike.%${q}%,short_description.ilike.%${q}%,description.ilike.%${q}%`);
  const {data}=await query;
  return <main className="mx-auto max-w-7xl px-5 py-16"><h1 className="text-4xl font-black">Scripts</h1><form className="mt-8"><input name="q" defaultValue={q} placeholder="Search scripts..." className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"/></form><div className="mt-8 grid gap-5 md:grid-cols-3">{(data||[]).map(s=><ScriptCard key={s.id} script={s}/>)}</div></main>;
}
