import { supabaseServer } from "@/lib/supabaseServer";

type ParamsPromise = Promise<{ id: string }>;

export default async function IncomingArticlePage({
  params,
}: {
  params: ParamsPromise;
}) {
  const { id } = await params;

  const { data: article, error } = await supabaseServer
    .from("incoming_articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    return <div>Article not found.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <a href="/admin/incoming">
        ← Back to Incoming Articles
      </a>

      <h1>{article.title}</h1>

      <p>
        <strong>Source:</strong> {article.source}
      </p>

      <p>
        <strong>Status:</strong> {article.status}
      </p>

      <p>
        <strong>Published:</strong>{" "}
        {article.published_at || "-"}
      </p>

      <p>
        <strong>URL:</strong>{" "}
        <a href={article.url} target="_blank">
          {article.url}
        </a>
      </p>

      <hr />

      <p>{article.content}</p>
    </div>
  );
}