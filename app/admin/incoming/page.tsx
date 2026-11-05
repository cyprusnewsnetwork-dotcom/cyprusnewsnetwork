import { supabaseServer } from "@/lib/supabaseServer";

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
      <h1>Incoming Articles</h1>

      <table border={1}>
        <thead>
          <tr>
            <th>Source</th>
            <th>Title</th>
            <th>Status</th>
            <th>Published</th>
          </tr>
        </thead>

        <tbody>
          {articles?.map((article: any) => (
            <tr key={article.id}>
              <td>{article.source}</td>
              <td>{article.title}</td>
              <td>{article.status}</td>
              <td>{article.published_at || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}