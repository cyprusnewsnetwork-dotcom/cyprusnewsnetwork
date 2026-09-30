'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EditForm({ article }) {
  const [form, setForm] = useState(article);

  async function updateArticle(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("articles")
      .update({
        title: form.title,
        content: form.content,
        language: form.language,
        category: form.category,
        status: form.status,
      })
      .eq("id", form.id);

    if (!error) {
      alert("Το άρθρο ενημερώθηκε!");
      window.location.href = `/admin/articles/${form.id}`;
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">✏️ Επεξεργασία Άρθρου</h1>

      <form onSubmit={updateArticle} className="flex flex-col gap-4 max-w-xl">

        <label>
          Τίτλος:
          <input
            className="border p-2 w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>

        <label>
          Περιεχόμενο:
          <textarea
            className="border p-2 w-full h-40"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </label>

        <label>
          Γλώσσα:
          <input
            className="border p-2 w-full"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          />
        </label>

        <label>
          Κατηγορία:
          <input
            className="border p-2 w-full"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </label>

        <label>
          Status:
          <input
            className="border p-2 w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />
        </label>

        <button
          type="submit"
          className="p-3 bg-black text-white rounded hover:opacity-80"
        >
          💾 Αποθήκευση
        </button>

      </form>
    </main>
  );
}
