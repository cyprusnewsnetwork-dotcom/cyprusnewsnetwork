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

    const prompt = `
Μετέτρεψε την παρακάτω είδηση σε σύντομο ελληνικό δημοσιογραφικό άρθρο.

ΤΙΤΛΟΣ:
${incoming.title}

ΠΗΓΗ:
${incoming.source}

ΠΕΡΙΛΗΨΗ:
${incoming.content}

Επέστρεψε μόνο:

ΤΙΤΛΟΣ:
[ελληνικός τίτλος]

ΑΡΘΡΟ:
[ελληνικό άρθρο]
`;

    const response = await fetch(
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
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const ai = await response.json();

    if (!ai?.choices?.length) {
      return NextResponse.json(
        {
          error: "OpenAI returned no content",
          details: ai,
        },
        {
          status: 500,
        }
      );
    }

    const generated =
      ai.choices[0].message.content || "";

    let titleGR = incoming.title;
    let contentGR = generated;

    const articlePos =
      generated.indexOf("ΑΡΘΡΟ:");

    if (articlePos > -1) {
      titleGR = generated
        .replace("ΤΙΤΛΟΣ:", "")
        .substring(0, articlePos)
        .trim();

      contentGR = generated
        .substring(articlePos + 7)
        .trim();
    }

    const { data: article, error: articleError } =
      await supabaseServer
        .from("articles")
        .insert([
          {
            title: incoming.title,
            content: incoming.content,

            title_gr: titleGR,
            content_gr: contentGR,

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
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}