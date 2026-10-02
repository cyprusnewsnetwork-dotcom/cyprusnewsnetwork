import { supabaseServer } from "@/lib/supabaseServer";

export default async function AdminArticlesListPage() {
  const supabase = supabaseServer;

  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return <p>Σφάλμα κατά τη φόρτωση των άρθρων.</p>;
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">📚 Λίστα Άρθρων</h1>

      <a
        href="/admin/articles/new"
        className="p-3 mb-6 inline-block rounded bg-black text-white hover:opacity-80"
      >
        ➕ Νέο Άρθρο
      </a>

      <div className="flex flex-col gap-4">
        {articles.length === 0 && (
          <p className="text-zinc-600">Δεν υπάρχουν άρθρα ακόμα.</p>
        )}

        {articles.map((article) => (
          <a
            key={article.id}
            href={`/admin/articles/${article.id}/edit`}
            className="p-4 border rounded-lg bg-white hover:bg-zinc-100 transition"
          >
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-sm text-zinc-600">
              Γλώσσα: {article.language} — Κατηγορία: {article.category}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
