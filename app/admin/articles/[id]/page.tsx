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

      {/* BACK BUTTON */}
      <div className="mb-6 flex gap-3">
        <a
          href="/admin/articles"
          className="px-4 py-2 rounded-full bg-gray-700 text-white text-sm hover:bg-gray-800 transition"
        >
          ← Back to Articles
        </a>

        {/* EDIT BUTTON */}
        <a
          href={`/admin/articles/${id}/edit`}
          className="px-4 py-2 rounded-full bg-green-600 text-white text-sm hover:bg-green-700 transition"
        >
          Edit
        </a>

        {/* DELETE BUTTON */}
        <a
          href={`/admin/articles/${id}/delete`}
          className="px-4 py-2 rounded-full bg-red-600 text-white text-sm hover:bg-red-700 transition"
        >
          Delete
        </a>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      {/* STATUS */}
      <p className="text-gray-600 mb-6">Status: {article.status}</p>

      {/* CONTENT */}
      <h2 className="text-xl font-semibold mb-2">Content</h2>
      <p className="mb-6">{article.content}</p>
    </div>
  );
}