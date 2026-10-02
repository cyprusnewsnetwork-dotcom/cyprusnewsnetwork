import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = supabaseServer;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const formData = await req.formData();

  const title = formData.get("title");
  const content = formData.get("content");
  const language = formData.get("language");
  const category = formData.get("category");

  const { error } = await supabase
    .from("articles")
    .update({
      title,
      content,
      language,
      category,
    })
    .eq("id", id);

  if (error) {
    return new Response("Update failed", { status: 500 });
  }

  // 🔥 ABSOLUTE REDIRECT (διορθώνει το ERR_INVALID_URL)
  return Response.redirect(new URL(`/admin/articles/${id}`, req.url));
}
