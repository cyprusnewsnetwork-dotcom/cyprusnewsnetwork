import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, lang, titleGR, contentGR } = await req.json();

    if (!id || !lang || !titleGR || !contentGR) {
      return NextResponse.json(
        { error: "Missing text or target language" },
        { status: 400 }
      );
    }

    const targetLang =
      lang === "EN" ? "English" :
      lang === "RU" ? "Russian" :
      null;

    if (!targetLang) {
      return NextResponse.json(
        { error: "Invalid target language" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: `Translate the following Greek text into ${targetLang}. Return ONLY the translated text.`
          },
          {
            role: "user",
            content: `${titleGR}\n\n${contentGR}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!data?.choices?.[0]?.message?.content) {
      return NextResponse.json(
        { error: "OpenAI returned no content" },
        { status: 500 }
      );
    }

    const translated = data.choices[0].message.content.trim();

    let newTitle = "";
    let newContent = "";

    if (translated.includes("\n")) {
      const [t, ...rest] = translated.split("\n");
      newTitle = t.trim();
      newContent = rest.join("\n").trim();
    } else {
      const parts = translated.split(".");
      newTitle = parts[0].trim();
      newContent = translated.trim();
    }

    return NextResponse.json({
      title: newTitle,
      content: newContent
    });

  } catch (err) {
    console.error("Translation API error:", err);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}