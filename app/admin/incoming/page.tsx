import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function IncomingArticlesPage() {
  const { data: articles, error } = await supabaseServer
    .from("incoming_articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Incoming Articles ({articles?.length || 0})</h1>

      <table border={1}>
        <thead>
          <tr>
            <th>Source</th>
            <th>Topic</th>
            <th>Title</th>
            <th>Status</th>
            <th>Published</th>
            <th>Collected</th>
          </tr>
        </thead>

        <tbody>
          {articles?.map((article: any) => (
            <tr key={article.id}>
              <td>{article.source}</td>

              <td>{article.topic || "OTHER"}</td>

              <td>
                <a href={"/admin/incoming/" + article.id}>
                  {article.title}
                </a>
              </td>

              <td>{article.status}</td>

              <td>
                {article.published_at || "-"}
              </td>

              <td>
                {article.created_at || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}