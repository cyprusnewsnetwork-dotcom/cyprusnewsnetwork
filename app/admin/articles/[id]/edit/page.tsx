"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

type Category = {
  id: string;
  name: string;
};

export default function Page(props: { params: Promise<{ id: string }> }) {
  // Next.js 16 – params is a Promise, must use React.use
  const { id } = React.use(props.params);
  const articleId = id;

  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"GR" | "EN" | "RU">("GR");
  const [showPreview, setShowPreview] = useState(false);

  const [titleGR, setTitleGR] = useState("");
  const [titleEN, setTitleEN] = useState("");
  const [titleRU, setTitleRU] = useState("");

  const [contentGR, setContentGR] = useState("");
  const [contentEN, setContentEN] = useState("");
  const [contentRU, setContentRU] = useState("");

  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Load article
  useEffect(() => {
    async function loadArticle() {
      const { data, error } = await supabase
        .from("articles")
        .select(
          `
          title_gr,
          title_en,
          title_ru,
          content_gr,
          content_en,
          content_ru,
          status,
          category_id
        `
        )
        .eq("id", articleId)
        .single();

      if (error) {
        console.error("Error loading article:", error);
        setLoading(false);
        return;
      }

      setTitleGR(data.title_gr || "");
      setTitleEN(data.title_en || "");
      setTitleRU(data.title_ru || "");

      setContentGR(data.content_gr || "");
      setContentEN(data.content_en || "");
      setContentRU(data.content_ru || "");

      setStatus((data.status as "draft" | "published") || "draft");
      setCategoryId(data.category_id || null);

      setLoading(false);
    }

    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  // Load categories (from public.categories, using name in English)
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error loading categories:", error);
        return;
      }

      setCategories(
        (data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
        }))
      );
    }

    loadCategories();
  }, []);

  // Autosave every 5 seconds when content changes
  useEffect(() => {
    const interval = setInterval(() => {
      saveArticle(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [titleGR, titleEN, titleRU, contentGR, contentEN, contentRU, status, categoryId]);

  async function saveArticle(showConsole = true) {
    if (!articleId) return;

    setSaving(true);

    const { error } = await supabase
      .from("articles")
      .update({
        title_gr: titleGR,
        title_en: titleEN,
        title_ru: titleRU,
        content_gr: contentGR,
        content_en: contentEN,
        content_ru: contentRU,
        status,
        category_id: categoryId,
      })
      .eq("id", articleId);

    if (error && showConsole) {
      console.error("Save error:", error);
    }

    setSaving(false);
  }

  async function publishArticle() {
    if (!articleId) return;

    setPublishing(true);

    const newStatus: "draft" | "published" =
      status === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("articles")
      .update({
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null,
      })
      .eq("id", articleId);

    if (error) {
      console.error("Publish error:", error);
      setPublishing(false);
      return;
    }

    setStatus(newStatus);
    setPublishing(false);
  }

  async function translateFromGR(lang: "EN" | "RU") {
    if (!articleId) return;

    const res = await fetch("/api/translate-one", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: articleId,
        lang,
        titleGR,
        contentGR,
      }),
    });

    if (!res.ok) {
      console.error("Translate error:", await res.text());
      return;
    }

    const data = await res.json();

    if (lang === "EN") {
      setTitleEN(data.title || "");
      setContentEN(data.content || "");
    }

    if (lang === "RU") {
      setTitleRU(data.title || "");
      setContentRU(data.content || "");
    }

    // Save after translation
    await saveArticle(false);
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Edit Article #{articleId}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Status:{" "}
            <span className={status === "published" ? "text-green-600" : "text-orange-600"}>
              {status}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/articles")}
            className="px-3 py-2 text-sm border rounded hover:bg-gray-100"
          >
            ← Back to Articles
          </button>

          <button
            onClick={() => saveArticle(true)}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save now
          </button>

          <button
            onClick={publishArticle}
            className={`px-3 py-2 text-sm rounded ${
              status === "published"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {publishing
              ? "Working..."
              : status === "published"
              ? "Unpublish"
              : "Publish"}
          </button>
        </div>
      </div>

      {/* Category & Preview row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Category:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={categoryId || ""}
            onChange={(e) =>
              setCategoryId(e.target.value ? e.target.value : null)
            }
          >
            <option value="">(none)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Preview mode:</label>
          <button
            onClick={() => setShowPreview((prev) => !prev)}
            className={`px-3 py-1 text-sm border rounded ${
              showPreview ? "bg-gray-200" : "bg-white"
            }`}
          >
            {showPreview ? "Hide preview" : "Show preview"}
          </button>
        </div>
      </div>

      {/* Language tabs */}
      <div className="flex gap-2 border-b pb-2">
        {["GR", "EN", "RU"].map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang as "GR" | "EN" | "RU")}
            className={`px-3 py-1 text-sm rounded-t ${
              activeTab === lang
                ? "bg-white border border-b-0"
                : "bg-gray-100 border border-transparent"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Editor / Preview */}
      {!showPreview && (
        <div className="space-y-4">
          {/* GR tab */}
          {activeTab === "GR" && (
            <>
              <input
                className="w-full p-2 border rounded"
                value={titleGR}
                onChange={(e) => setTitleGR(e.target.value)}
                placeholder="Title (GR)"
              />

              <textarea
                className="w-full p-2 border rounded h-48"
                value={contentGR}
                onChange={(e) => setContentGR(e.target.value)}
                placeholder="Content (GR)"
              />
            </>
          )}

          {/* EN tab */}
          {activeTab === "EN" && (
            <>
              <div className="flex justify-between items-center">
                <button
                  className="mb-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => translateFromGR("EN")}
                >
                  Translate from GR → EN
                </button>
              </div>

              <input
                className="w-full p-2 border rounded"
                value={titleEN}
                onChange={(e) => setTitleEN(e.target.value)}
                placeholder="Title (EN)"
              />

              <textarea
                className="w-full p-2 border rounded h-48"
                value={contentEN}
                onChange={(e) => setContentEN(e.target.value)}
                placeholder="Content (EN)"
              />
            </>
          )}

          {/* RU tab */}
          {activeTab === "RU" && (
            <>
              <div className="flex justify-between items-center">
                <button
                  className="mb-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => translateFromGR("RU")}
                >
                  Translate from GR → RU
                </button>
              </div>

              <input
                className="w-full p-2 border rounded"
                value={titleRU}
                onChange={(e) => setTitleRU(e.target.value)}
                placeholder="Title (RU)"
              />

              <textarea
                className="w-full p-2 border rounded h-48"
                value={contentRU}
                onChange={(e) => setContentRU(e.target.value)}
                placeholder="Content (RU)"
              />
            </>
          )}
        </div>
      )}

      {/* Preview mode */}
      {showPreview && (
        <div className="border rounded p-4 bg-gray-50 space-y-4">
          <h2 className="text-lg font-semibold">
            Preview ({activeTab})
          </h2>

          {activeTab === "GR" && (
            <>
              <h3 className="text-xl font-bold mb-2">{titleGR}</h3>
              <p className="whitespace-pre-wrap">{contentGR}</p>
            </>
          )}

          {activeTab === "EN" && (
            <>
              <h3 className="text-xl font-bold mb-2">{titleEN}</h3>
              <p className="whitespace-pre-wrap">{contentEN}</p>
            </>
          )}

          {activeTab === "RU" && (
            <>
              <h3 className="text-xl font-bold mb-2">{titleRU}</h3>
              <p className="whitespace-pre-wrap">{contentRU}</p>
            </>
          )}
        </div>
      )}

      {/* Footer / autosave indicator */}
      <div className="text-sm text-gray-500 flex justify-between items-center">
        <span>{saving ? "Saving..." : "Saved"}</span>
        <span>
          Status:{" "}
          <strong>{status}</strong>
          {publishing && " (updating...)"}
        </span>
      </div>
    </div>
  );
}