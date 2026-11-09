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

    const translationResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Μετέτρεψε την είδηση σε σύντομο δημοσιογραφικό άρθρο στα Ελληνικά. Επέστρεψε JSON με title_gr και content_gr."
            },
            {
              role: "user",
              content: `
TITLE:
${incoming.title}

SOURCE:
${incoming.source}

SUMMARY:
${incoming.content}
`
            }
          ],
          response_format: {
            type: "json_object"
          }
        }),
      }
    );

    const ai = await translationResponse.json();

    const result = JSON.parse(
      ai.choices[0].message.content
    );

    const { data: article, error: articleError } =
      await supabaseServer
        .from("articles")
        .insert([
          {
            title: incoming.title,
            content: incoming.content,

            title_gr: result.title_gr,
            content_gr: result.content_gr,

            source: incoming.source,
            source_url: incoming.url,
            topic: incoming.topic,

            status: "draft",
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