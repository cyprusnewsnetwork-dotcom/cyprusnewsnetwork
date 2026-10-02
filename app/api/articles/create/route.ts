import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const supabase = supabaseServer;

  const { data, error } = await supabase
    .from("articles")
    .insert({
      title: body.title,
      content: body.content,
      category: body.category,
      language: body.language,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
