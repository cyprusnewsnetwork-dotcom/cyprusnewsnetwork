import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    const { data, error } = await supabaseServer
      .from("articles")
      .insert([{ title, content }])
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ data }, { status: 200 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}