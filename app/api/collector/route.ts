import { NextResponse } from "next/server";

export async function GET() {
  const rssUrl = "https://feeds.bbci.co.uk/news/world/rss.xml";

  const response = await fetch(rssUrl);

  const xml = await response.text();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}