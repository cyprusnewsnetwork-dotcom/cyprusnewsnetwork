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
        <strong>Published:</strong> {article.published_at || "-"}
      </p>

      <p>
        <strong>URL:</strong>{" "}
        <a href={article.url} target="_blank">
          {article.url}
        </a>
      </p>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <form
          action={`/api/incoming/${id}/approve`}
          method="POST"
          style={{ display: "inline-block", marginRight: "10px" }}
        >
          <button type="submit">
            APPROVE
          </button>
        </form>

        <form
          action={`/api/incoming/${id}/reject`}
          method="POST"
          style={{ display: "inline-block", marginRight: "10px" }}
        >
          <button type="submit">
            REJECT
          </button>
        </form>

        <form
          action={`/api/incoming/${id}/create-article`}
          method="POST"
          style={{ display: "inline-block", marginRight: "10px" }}
        >
          <button type="submit">
            CREATE ARTICLE
          </button>
        </form>

        <a href="/admin/articles">
          <button>
            GO TO ARTICLES
          </button>
        </a>
      </div>

      <hr />

      <p>{article.content}</p>
    </div>
  );
}