import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { ScriptCard } from "@/components/ScriptCard";

export default async function Home() {
  const db = await supabaseServer();
  const [{ data: featured }, { data: latest }, { count: scripts }, { count: users }] = await Promise.all([
    db.from("scripts").select("*").eq("status","published").eq("featured",true).order("created_at",{ascending:false}).limit(6),
    db.from("scripts").select("*").eq("status","published").order("created_at",{ascending:false}).limit(6),
    db.from("scripts").select("*",{count:"exact",head:true}).eq("status","published"),
    db.from("profiles").select("*",{count:"exact",head:true})
  ]);
  return <main className="mx-auto max-w-7xl px-5">
    <section className="py-24 md:py-32"><p className="mb-4 text-sm text-white/40">SCRIPT DATABASE</p><h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">Discover Powerful Scripts.</h1>
      <p className="mt-6 max-w-2xl text-lg text-white/50">Browse, discover and access scripts from the ARIO SCRIPTS database.</p>
      <div className="mt-8 flex gap-3"><Link className="rounded-xl bg-white px-5 py-3 font-semibold text-black" href="/scripts">Browse Scripts</Link><Link className="rounded-xl border border-white/10 px-5 py-3" href="/categories">Explore Categories</Link></div></section>
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">{[["Scripts",scripts||0],["Users",users||0],["Downloads","Live"],["Copies","Live"]].map(([a,b])=><div className="glass rounded-2xl p-5" key={String(a)}><div className="text-2xl font-bold">{b}</div><div className="text-sm text-white/40">{a}</div></div>)}</section>
    <section className="py-16"><div className="mb-6 flex justify-between"><h2 className="text-2xl font-bold">Featured Scripts</h2><Link href="/scripts" className="text-sm text-white/50">View all</Link></div><div className="grid gap-5 md:grid-cols-3">{(featured||[]).map(s=><ScriptCard key={s.id} script={s}/>)}</div></section>
    <section className="pb-20"><h2 className="mb-6 text-2xl font-bold">Latest Scripts</h2><div className="grid gap-5 md:grid-cols-3">{(latest||[]).map(s=><ScriptCard key={s.id} script={s}/>)}</div></section>
  </main>;
}
