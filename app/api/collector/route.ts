import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const parser = new Parser();

    const feed = await parser.parseURL(
      "https://feeds.bbci.co.uk/news/world/rss.xml"
    );

    const articles = feed.items.slice(0, 5);

    let inserted = 0;
    let skipped = 0;

    for (const item of articles) {
      const url = item.link || "";

      const { data: existing } = await supabaseServer
        .from("incoming_articles")
        .select("id")
        .eq("url", url)
        .limit(1);

      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }

      const article = {
        source: "BBC",
        title: item.title || "",
        content: item.contentSnippet || "",
        url,
        published_at: item.pubDate || null,
        status: "NEW",
      };

      const { error } = await supabaseServer
        .from("incoming_articles")
        .insert(article);

      if (!error) {
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      skipped,
      feed: feed.title,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}