'use client';

import { useState } from "react";

export default function NewArticlePage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    language: "",
  });

  async function createArticle(e) {
    e.preventDefault();

    const res = await fetch("/api/articles/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Το άρθρο δημιουργήθηκε!");
      window.location.href = `/admin/articles/${data.id}`;
    } else {
      alert("Σφάλμα κατά τη δημιουργία.");
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">📝 Νέο Άρθρο</h1>

      <form onSubmit={createArticle} className="flex flex-col gap-4 max-w-xl">

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

        <button
          type="submit"
          className="p-3 bg-black text-white rounded hover:opacity-80"
        >
          ➕ Δημιουργία Άρθρου
        </button>

      </form>
    </main>
  );
}
