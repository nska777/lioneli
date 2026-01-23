import { NextResponse } from "next/server";

export async function GET() {
  // Supabase сам завершит OAuth в браузере, нам достаточно редиректа
  return NextResponse.redirect(new URL("/account", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
