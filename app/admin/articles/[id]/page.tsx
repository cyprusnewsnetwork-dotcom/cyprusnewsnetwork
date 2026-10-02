import { supabaseServer } from "@/lib/supabaseServer";

export default async function ArticleViewPage({ params }) {
  const { id } = await params; // 🔥 ΑΠΑΡΑΙΤΗΤΟ

  const supabase = supabaseServer;

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    return <p>Το άρθρο δεν βρέθηκε.</p>;
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      <p className="text-sm text-zinc-600 mb-6">
        Γλώσσα: {article.language} — Κατηγορία: {article.category}
      </p>

      <article className="prose">
        {article.content}
      </article>

      <a
        href={`/admin/articles/${article.id}/edit`}
        className="mt-10 inline-block p-3 bg-black text-white rounded"
      >
        ✏️ Επεξεργασία
      </a>
    </main>
  );
}
