import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const supabase = supabaseServer;

  const { error } = await supabase
    .from("articles")
    .update({
      title: body.title,
      content: body.content,
      category: body.category,
      language: body.language,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
