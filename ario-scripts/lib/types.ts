export type Role = "user" | "moderator" | "admin";
export type ScriptStatus = "draft" | "published" | "archived";

export type Script = {
  id: string; title: string; slug: string; game_name: string; category_id: string | null;
  short_description: string | null; description: string | null; code: string; image_url: string | null;
  showcase_video_url: string | null; download_enabled: boolean; status: ScriptStatus;
  featured: boolean; copy_count: number; download_count: number; tags: string[] | null;
  created_by: string | null; created_at: string; updated_at: string;
};
