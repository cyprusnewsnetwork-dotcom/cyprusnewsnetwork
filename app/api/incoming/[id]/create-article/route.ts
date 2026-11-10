import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type ParamsPromise = Promise<{ id: string }>;

export async function POST(
  req: Request,
  { params }: { params: ParamsPromise }
) {
  try {
    const { id } = await params;

    const { data: incoming } = await supabaseServer
      .from("incoming_articles")
      .select("*")
      .eq("id", id)
      .single();

    if (!incoming) {
      return NextResponse.json(
        { error: "Incoming article not found" },
        { status: 404 }
      );
    }

    const draftTitle = incoming.title;

    const draftContent = `
${incoming.content}

Source: ${incoming.source}

Original URL:
${incoming.url}
`.trim();

    const articleData: any = {
      title: draftTitle,
      content: draftContent,

      source: incoming.source,
      source_url: incoming.url,
      topic: incoming.topic,

      status: "draft"
    };

    if (incoming.source === "TASS_RU") {
      articleData.title_ru = draftTitle;
      articleData.content_ru = draftContent;
    } else {
      articleData.title_en = draftTitle;
      articleData.content_en = draftContent;
    }

    const { data: article, error: articleError } =
      await supabaseServer
        .from("articles")
        .insert([articleData])
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
        status: "CREATED"
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      articleId: article.id
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message
      },
      {
        status: 500
      }
    );
  }
}