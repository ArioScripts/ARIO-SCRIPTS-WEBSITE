import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await supabaseServer();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
}
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/unauthorized");
  return profile;
}
export async function requireModerator() {
  const profile = await getCurrentProfile();
  if (!profile || !["moderator","admin"].includes(profile.role)) redirect("/unauthorized");
  return profile;
}
