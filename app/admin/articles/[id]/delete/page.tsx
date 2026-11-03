import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import { redirect } from "next/navigation";

type ParamsPromise = Promise<{ id: string }>;

export default async function DeleteArticlePage({
  params,
  searchParams,
}: {
  params: ParamsPromise;
  searchParams: { confirm?: string };
}) {
  const { id } = await params;

  // Αν ο χρήστης πάτησε confirm=yes → κάνε διαγραφή
  if (searchParams.confirm === "yes") {
    const { error } = await supabaseServer
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      return (
        <div className="p-10">
          <h2>Error deleting article</h2>
          <pre>{error.message}</pre>
        </div>
      );
    }

    redirect("/admin/articles");
  }

  // Αλλιώς δείξε σελίδα επιβεβαίωσης
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Delete Article</h1>

      <p className="mb-6">
        Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το άρθρο; Η ενέργεια δεν
        μπορεί να αναιρεθεί.
      </p>

      <div className="flex gap-4">
        <Link
          href={`/admin/articles/${id}/delete?confirm=yes`}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Confirm Delete
        </Link>

        <Link
          href={`/admin/articles/${id}`}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}