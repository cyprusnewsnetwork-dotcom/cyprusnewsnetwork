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
According to information published by ${incoming.source}, developments have been reported regarding ${incoming.topic}.

${incoming.content}

The report was collected and processed by CypRus News Network for editorial review.

Source: ${incoming.source}

Original URL:
${incoming.url}
`.trim();

    const { data: article, error: articleError } =
      await supabaseServer
        .from("articles")
        .insert([
          {
            title: draftTitle,
            content: draftContent,

            title_en: draftTitle,
            content_en: draftContent,

            source: incoming.source,
            source_url: incoming.url,
            topic: incoming.topic,

            status: "draft"
          }
        ])
        .select()
        .single();

    if (articleError) {
      return NextResponse.json(
        {
          error: articleError.message
        },
        {
          status: 500
        }
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