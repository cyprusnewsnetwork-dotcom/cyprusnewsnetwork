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
    <div className="max-w-3xl mx-auto py-10">

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

      <h1 className="text-3xl font-bold mb-4">
        {article.title_gr || article.title}
      </h1>

      <p className="mb-4">
        Status: {article.status}
      </p>

      <p className="mb-4">
        Source: {article.source}
      </p>

      <p className="mb-6">
        Topic: {article.topic}
      </p>

      <div className="whitespace-pre-wrap">
        {article.content_gr || article.content}
      </div>

    </div>
  );
}