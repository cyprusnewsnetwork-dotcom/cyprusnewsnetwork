import * as cheerio from "cheerio";

export async function scrapeArticle(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    const $ = cheerio.load(html);

    let content = "";

    $("p").each((_, el) => {
      const text = $(el).text().trim();

      if (text.length > 40) {
        content += text + "\n\n";
      }
    });

    return content.trim();
  } catch (err) {
    console.error("SCRAPER ERROR:", err);
    return "";
  }
}
