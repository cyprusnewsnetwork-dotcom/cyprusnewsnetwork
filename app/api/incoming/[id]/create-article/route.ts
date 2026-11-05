import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type ParamsPromise = Promise<{ id: string }>;

export async function POST(
  req: Request,
  { params }: { params: ParamsPromise }
) {
  try {
    const { id } = await params;

    const { data: incoming, error: incomingError } =
      await supabaseServer
        .from("incoming_articles")
        .select("*")
        .eq("id", id)
        .single();

    if (incomingError || !incoming) {
      return NextResponse.json(
        { error: "Incoming article not found" },
        { status: 404 }
      );
    }

    const { data: article, error: articleError } =
      await supabaseServer
        .from("articles")
        .insert([
          {
            title: incoming.title,
            content: incoming.content,
          },
        ])
        .select()
        .single();

    if (articleError) {
      return NextResponse.json(
        { error: articleError.message },
        { status: 500 }
      );
    }

    await supabaseServer
      .from("incoming_articles")
      .update({
        status: "CREATED",
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      articleId: article.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}