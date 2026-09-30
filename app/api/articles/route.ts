import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json(data, { status: 200 });
}
