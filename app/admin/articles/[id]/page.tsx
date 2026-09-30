export const dynamic = "force-dynamic";

import { supabaseServer } from "@/lib/supabaseServer";

export default async function ArticlePage({ params }) {
  const { id } = await params;   // 🔥 ΑΠΑΡΑΙΤΗΤΟ ΣΤΟ NEXT 16

  const supabase = supabaseServer();

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
      <h1 className="text-3xl font-bold mb-6">{article.title}</h1>

      <p><strong>Περιεχόμενο:</strong> {article.content}</p>
      <p><strong>Γλώσσα:</strong> {article.language}</p>
      <p><strong>Κατηγορία:</strong> {article.category}</p>
      <p><strong>Status:</strong> {article.status}</p>
      <p><strong>Ημερομηνία:</strong> {article.created_at}</p>

      <a
        href={`/admin/articles/${article.id}/edit`}
        className="inline-block mt-6 px-4 py-2 bg-black text-white rounded hover:opacity-80"
      >
        ✏️ Edit
      </a>
    </main>
  );
}
