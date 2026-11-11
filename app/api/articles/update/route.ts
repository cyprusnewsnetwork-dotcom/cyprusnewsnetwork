import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const formData: any = await req.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const language = formData.get("language");
    const category = formData.get("category");

    const { error } = await supabase
      .from("articles")
      .update({
        title,
        content,
        language,
        category,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL(`/admin/articles/${id}`, req.url)
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
