import { supabaseServer } from "@/lib/supabaseServer";

type ParamsPromise = Promise<{ id: string }>;

export default async function ArticleViewPage({
  params,
}: {
  params: ParamsPromise;
}) {
  const { id } = await params;

  const { data: article, error } = await supabaseServer
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    return <div className="p-10">Article not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10">

      <div className="mb-6 flex gap-3">
        <a href="/admin/articles">
          ← Back to Articles
        </a>

        <a href={`/admin/articles/${id}/edit`}>
          Edit
        </a>

        <a href={`/admin/articles/${id}/delete`}>
          Delete
        </a>
      </div>

      <h2>Greek</h2>

      <h1>{article.title_gr}</h1>

      <div className="whitespace-pre-wrap mb-10">
        {article.content_gr}
      </div>

      <hr />

      <h2>English</h2>

      <h1>{article.title_en}</h1>

      <div className="whitespace-pre-wrap mb-10">
        {article.content_en}
      </div>

      <hr />

      <h2>Russian</h2>

      <h1>{article.title_ru}</h1>

      <div className="whitespace-pre-wrap">
        {article.content_ru}
      </div>

    </div>
  );
}