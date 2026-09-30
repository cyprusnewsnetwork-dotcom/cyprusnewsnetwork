import EditForm from "./EditForm";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function EditArticlePage({ params }) {
  const { id } = await params;

  const supabase = supabaseServer();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) {
    return <p>Το άρθρο δεν βρέθηκε.</p>;
  }

  return <EditForm article={article} />;
}

