import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";

export async function Navbar() {
  const profile = await getCurrentProfile();
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
      <Link href="/" className="font-black tracking-tight">ARIO <span className="text-white/50">SCRIPTS</span></Link>
      <div className="hidden gap-6 text-sm text-white/70 md:flex">
        <Link href="/">Home</Link><Link href="/scripts">Scripts</Link><Link href="/categories">Categories</Link>
        {profile && <Link href="/favorites">Favorites</Link>}
        {profile?.role === "admin" && <Link href="/admin">Admin Panel</Link>}
      </div>
      <div className="flex gap-2">
        {profile ? <Link className="rounded-xl border border-white/10 px-4 py-2 text-sm" href="/profile">{profile.username}</Link>
        : <><Link className="rounded-xl px-4 py-2 text-sm" href="/login">Login</Link><Link className="rounded-xl bg-white px-4 py-2 text-sm text-black" href="/register">Register</Link></>}
      </div>
    </nav>
  </header>;
}
