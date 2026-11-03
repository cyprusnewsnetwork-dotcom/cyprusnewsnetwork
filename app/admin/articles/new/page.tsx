"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabaseClient";   // ✔ Χρησιμοποιούμε ΜΟΝΟ shared client
import { useRouter } from "next/navigation";

export default function NewArticlePage() {
  const router = useRouter();
  const supabase = supabaseClient;   // ✔ Δεν δημιουργούμε νέο client σε κάθε render

  // -----------------------------
  // State
  // -----------------------------
  const [languages, setLanguages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    title_gr: "",
    title_en: "",
    title_ru: "",
    content: "",
    content_gr: "",
    content_en: "",
    content_ru: "",
    category_id: "",
    category_name: "",
    category_name_gr: "",
    category_name_en: "",
    category_name_ru: "",
    language_id: "",
    original_language: "",
    status: "draft",
  });

  // -----------------------------
  // Load languages + categories
  // -----------------------------
  useEffect(() => {
    async function loadData() {
      const { data: langs } = await supabase.from("languages").select("*");
      const { data: cats } = await supabase.from("categories").select("*");

      setLanguages(langs || []);
      setCategories(cats || []);
    }

    loadData();
  }, []);

  // -----------------------------
  // Helper: update field
  // -----------------------------
  function updateField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // -----------------------------
  // Auto-translation on blur
  // -----------------------------
  async function autoTranslate() {
    if (!form.original_language) return;

    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        category_name: form.category_name,
        original_language: form.original_language,
      }),
    });

    const data = await res.json();

    updateField("title_gr", data.title_gr);
    updateField("title_en", data.title_en);
    updateField("title_ru", data.title_ru);

    updateField("content_gr", data.content_gr);
    updateField("content_en", data.content_en);
    updateField("content_ru", data.content_ru);

    updateField("category_name_gr", data.category_name_gr);
    updateField("category_name_en", data.category_name_en);
    updateField("category_name_ru", data.category_name_ru);
  }

  // -----------------------------
  // Save article
  // -----------------------------
  async function handleSubmit(e: any) {
    e.preventDefault();

    const { error } = await supabase.from("articles").insert({
      // Original
      title: form.title,
      content: form.content,

      // Greek
      title_gr: form.title_gr,
      content_gr: form.content_gr,

      // English
      title_en: form.title_en,
      content_en: form.content_en,

      // Russian
      title_ru: form.title_ru,
      content_ru: form.content_ru,

      // Category multilingual
      category_id: form.category_id,
      category_name_gr: form.category_name_gr,
      category_name_en: form.category_name_en,
      category_name_ru: form.category_name_ru,

      // Language + status
      language_id: form.language_id,
      status: form.status,
    });

    if (error) {
      alert("Error saving article: " + error.message);
      return;
    }

    router.push("/admin/articles");
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Language selector */}
        <div>
          <label className="font-semibold">Original Language</label>
          <select
            className="border p-2 w-full"
            value={form.language_id}
            onChange={(e) => {
              const lang = languages.find((l) => l.id === e.target.value);
              updateField("language_id", e.target.value);
              updateField("original_language", lang.code);
            }}
          >
            <option value="">Select language</option>
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category selector */}
        <div>
          <label className="font-semibold">Category</label>
          <select
            className="border p-2 w-full"
            value={form.category_id}
            onChange={(e) => {
              const cat = categories.find((c) => c.id === e.target.value);
              updateField("category_id", e.target.value);
              updateField("category_name", cat.name);
            }}
            onBlur={autoTranslate}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="font-semibold">Title (Original)</label>
          <input
            className="border p-2 w-full"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            onBlur={autoTranslate}
          />
        </div>

        {/* Content */}
        <div>
          <label className="font-semibold">Content (Original)</label>
          <textarea
            className="border p-2 w-full h-40"
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            onBlur={autoTranslate}
          />
        </div>

        {/* Status */}
        <div>
          <label className="font-semibold">Status</label>
          <select
            className="border p-2 w-full"
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Submit */}
        <button className="bg-black text-white p-3 rounded hover:bg-zinc-800">
          Save Article
        </button>
      </form>
    </div>
  );
}
