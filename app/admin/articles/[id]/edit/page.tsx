import { supabaseServer } from "@/lib/supabaseServer";

export default async function EditArticlePage({ params }) {
  const { id } = await params; // ΑΠΑΡΑΙΤΗΤΟ

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
      <h1 className="text-2xl font-bold mb-4">Επεξεργασία Άρθρου</h1>

      <form action={`/api/articles/update?id=${id}`} method="POST" className="flex flex-col gap-4">
        <label>
          Τίτλος:
          <input
            type="text"
            name="title"
            defaultValue={article.title}
            className="border p-2 w-full"
          />
        </label>

        <label>
          Περιεχόμενο:
          <textarea
            name="content"
            defaultValue={article.content}
            className="border p-2 w-full h-40"
          />
        </label>

        <label>
          Γλώσσα:
          <input
            type="text"
            name="language"
            defaultValue={article.language}
            className="border p-2 w-full"
          />
        </label>

        <label>
          Κατηγορία:
          <input
            type="text"
            name="category"
            defaultValue={article.category}
            className="border p-2 w-full"
          />
        </label>

        <button className="p-3 bg-black text-white rounded">
          💾 Αποθήκευση
        </button>
      </form>
    </main>
  );
}

