import { supabase } from "@/app/lib/supabase/client";

export async function toggleWishlist(
  userId: string,
  productId: string,
  snapshot: {
    title?: string;
    price?: number;
    image?: string;
  }
) {
  const { data } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (data?.id) {
    await supabase.from("wishlist_items").delete().eq("id", data.id);
    return false; // удалили
  }

  await supabase.from("wishlist_items").insert({
    user_id: userId,
    product_id: productId,
    product_snapshot: snapshot,
  });

  return true; // добавили
}
