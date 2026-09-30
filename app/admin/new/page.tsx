"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("GR");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const { error } = await supabase.from("articles").insert({
      title,
      content,
      language,
    });

    if (error) {
      setMessage("❌ Σφάλμα κατά την αποθήκευση.");
      console.error(error);
    } else {
      setMessage("✔ Το άρθρο αποθηκεύτηκε επιτυχώς!");
      setTitle("");
      setContent("");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-10">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-6">
        Νέο Άρθρο
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-300 dark:border-zinc-700"
      >
        <input
          type="text"
          placeholder="Τίτλος"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded border border-zinc-300 dark:border-zinc-700"
          required
        />

        <textarea
          placeholder="Περιεχόμενο"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="p-3 rounded border border-zinc-300 dark:border-zinc-700 h-40"
          required
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-3 rounded border border-zinc-300 dark:border-zinc-700"
        >
          <option value="GR">Ελληνικά</option>
          <option value="RU">Ρωσικά</option>
          <option value="EN">Αγγλικά</option>
        </select>

        <button
          type="submit"
          className="p-3 rounded bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-80 transition"
        >
          Αποθήκευση Άρθρου
        </button>

        {message && (
          <p className="text-center text-lg font-medium mt-2">{message}</p>
        )}
      </form>
    </main>
  );
}
