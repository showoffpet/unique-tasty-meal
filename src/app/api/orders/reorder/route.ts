import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Securely fetch order
    const { data: order, error } = await supabase
      .from("orders")
      .select("items")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // In a full implementation, you'd integrate with cartStore via server state / cookies 
    // or by storing "pending cart" in DB and reading it back on /cart.
    // For this prototype we pass items securely back to client and let the client manage it.

    return NextResponse.json({ items: order.items }, { status: 200 });

  } catch (err: unknown) {
    console.error("Reorder Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
