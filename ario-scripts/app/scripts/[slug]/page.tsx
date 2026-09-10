import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { ScriptCodeBox } from "@/components/ScriptCodeBox";
export default async function ScriptPage({ params }: { params: Promise<{slug:string}> }) {
 const {slug}=await params; const db=await supabaseServer(); const {data:s}=await db.from("scripts").select("*, categories(name)").eq("slug",slug).eq("status","published").single(); if(!s) notFound();
 return <main className="mx-auto max-w-5xl px-5 py-12"><div className="glass overflow-hidden rounded-3xl">{s.image_url&&<img src={s.image_url} alt="" className="max-h-96 w-full object-cover"/>}<div className="p-6 md:p-10"><p className="text-sm text-white/40">{s.game_name}</p><h1 className="mt-2 text-4xl font-black">{s.title}</h1><p className="mt-4 text-white/55">{s.description||s.short_description}</p>{s.showcase_video_url&&<div className="mt-8 aspect-video overflow-hidden rounded-2xl"><iframe className="h-full w-full" src={s.showcase_video_url.replace("watch?v=","embed/").replace("youtu.be/","www.youtube.com/embed/")} allowFullScreen/></div>}<div className="mt-8"><ScriptCodeBox code={s.code}/></div><a download={`${s.slug}.lua`} href={`data:text/plain;charset=utf-8,${encodeURIComponent(s.code)}`} className="mt-5 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black">Download Script</a></div></div></main>;
}
