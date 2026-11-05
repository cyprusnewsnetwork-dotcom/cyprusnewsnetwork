import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

type ParamsPromise = Promise<{ id: string }>;

export async function POST(
  req: Request,
  { params }: { params: ParamsPromise }
) {
  const { id } = await params;

  await supabaseServer
    .from("incoming_articles")
    .update({
      status: "APPROVED",
    })
    .eq("id", id);

  return NextResponse.redirect(
    new URL("/admin/incoming", req.url)
  );
}