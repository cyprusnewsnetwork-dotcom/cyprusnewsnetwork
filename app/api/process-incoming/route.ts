import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data: incoming, error } = await supabaseServer
      .from("incoming_articles")
      .select("*")
      .eq("status", "NEW")
      .limit(100);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    let processed = 0;

    for (const item of incoming || []) {
      const draftContent = `
${item.content}

Source: ${item.source}

Original URL:
${item.url}
`.trim();

      const articleData: any = {
        title: item.title,
        content: draftContent,
        source: item.source,
        source_url: item.url,
        topic: item.topic,
        status: "draft",
      };

      if (item.source === "TASS_RU") {
        articleData.title_ru = item.title;
        articleData.content_ru = draftContent;
      } else {
        articleData.title_en = item.title;
        articleData.content_en = draftContent;
      }

      const { error: insertError } =
        await supabaseServer
          .from("articles")
          .insert(articleData);

      if (!insertError) {
        await supabaseServer
          .from("incoming_articles")
          .update({ status: "CREATED" })
          .eq("id", item.id);

        processed++;
      }
    }

    return NextResponse.json({
      success: true,
      processed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}