import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { supabaseServer } from "@/lib/supabaseServer";

const KEYWORDS = [
  "ukraine",
  "ukrainian",
  "russia",
  "russian",
  "moscow",
  "kremlin",

  "putin",
  "lavrov",
  "zelensky",
  "zelenskyy",

  "trump",
  "donald trump",

  "us election",
  "us elections",
  "election",
  "white house",

  "republican",
  "democrat",

  "gas",
  "oil",
  "energy",
  "gazprom",
  "sanctions",
  "nato"
];

function detectTopic(text: string) {
  const t = text.toLowerCase();

  if (
    t.includes("putin") ||
    t.includes("lavrov") ||
    t.includes("kremlin") ||
    t.includes("moscow")
  ) {
    return "PUTIN";
  }

  if (
    t.includes("ukraine") ||
    t.includes("ukrainian") ||
    t.includes("zelensky") ||
    t.includes("zelenskyy")
  ) {
    return "UKRAINE";
  }

  if (
    t.includes("trump") ||
    t.includes("donald trump")
  ) {
    return "TRUMP";
  }

  if (
    t.includes("gas") ||
    t.includes("oil") ||
    t.includes("energy") ||
    t.includes("gazprom")
  ) {
    return "ENERGY";
  }

  if (
    t.includes("election") ||
    t.includes("white house") ||
    t.includes("republican") ||
    t.includes("democrat")
  ) {
    return "USA_ELECTIONS";
  }

  return "OTHER";
}

async function processFeed(
  parser: Parser,
  source: string,
  rssUrl: string
) {
  let inserted = 0;
  let skipped = 0;
  let ignored = 0;

  const feed = await parser.parseURL(rssUrl);

  for (const item of feed.items) {
    const title = item.title || "";
    const content = item.contentSnippet || "";
    const combined = `${title} ${content}`.toLowerCase();

    const matched = KEYWORDS.some(keyword =>
      combined.includes(keyword)
    );

    if (!matched) {
      ignored++;
      continue;
    }

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

    const topic = detectTopic(combined);

    const { error } = await supabaseServer
      .from("incoming_articles")
      .insert({
        source,
        title,
        content,
        url,
        topic,
        published_at: item.pubDate || null,
        status: "NEW"
      });

    if (!error) {
      inserted++;
    }
  }

  return {
    inserted,
    skipped,
    ignored
  };
}

export async function GET() {
  try {
    const parser = new Parser();

    const bbc = await processFeed(
      parser,
      "BBC",
      "https://feeds.bbci.co.uk/news/world/rss.xml"
    );

    const tass = await processFeed(
      parser,
      "TASS",
      "https://tass.com/rss/v2.xml"
    );

    return NextResponse.json({
      success: true,

      bbc,

      tass,

      totals: {
        inserted:
          bbc.inserted + tass.inserted,

        skipped:
          bbc.skipped + tass.skipped,

        ignored:
          bbc.ignored + tass.ignored
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      {
        status: 500
      }
    );
  }
}