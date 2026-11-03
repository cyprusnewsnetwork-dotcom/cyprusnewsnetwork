import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      content,
      category_name,
      original_language, // "gr", "en", "ru"
    } = body;

    if (!title || !content || !category_name || !original_language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // -----------------------------
    // Helper: OpenAI call
    // -----------------------------
    async function translate(text: string, target: string) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Translate the following text into ${target}. Return ONLY the translated text.`,
            },
            {
              role: "user",
              content: text,
            },
          ],
        }),
      });

      const result = await response.json();
      return result.choices[0].message.content.trim();
    }

    // -----------------------------
    // Multilingual containers
    // -----------------------------
    let title_gr = "";
    let title_en = "";
    let title_ru = "";

    let content_gr = "";
    let content_en = "";
    let content_ru = "";

    let category_name_gr = "";
    let category_name_en = "";
    let category_name_ru = "";

    // -----------------------------
    // Pipeline logic
    // -----------------------------
    if (original_language === "gr") {
      title_gr = title;
      content_gr = content;
      category_name_gr = category_name;

      title_en = await translate(title, "English");
      title_ru = await translate(title, "Russian");

      content_en = await translate(content, "English");
      content_ru = await translate(content, "Russian");

      category_name_en = await translate(category_name, "English");
      category_name_ru = await translate(category_name, "Russian");
    }

    if (original_language === "en") {
      title_en = title;
      content_en = content;
      category_name_en = category_name;

      title_gr = await translate(title, "Greek");
      title_ru = await translate(title, "Russian");

      content_gr = await translate(content, "Greek");
      content_ru = await translate(content, "Russian");

      category_name_gr = await translate(category_name, "Greek");
      category_name_ru = await translate(category_name, "Russian");
    }

    if (original_language === "ru") {
      title_ru = title;
      content_ru = content;
      category_name_ru = category_name;

      title_en = await translate(title, "English");
      title_gr = await translate(title, "Greek");

      content_en = await translate(content, "English");
      content_gr = await translate(content, "Greek");

      category_name_en = await translate(category_name, "English");
      category_name_gr = await translate(category_name, "Greek");
    }

    // -----------------------------
    // Return multilingual payload
    // -----------------------------
    return NextResponse.json({
      title_gr,
      title_en,
      title_ru,

      content_gr,
      content_en,
      content_ru,

      category_name_gr,
      category_name_en,
      category_name_ru,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Translation failed", details: String(err) },
      { status: 500 }
    );
  }
}