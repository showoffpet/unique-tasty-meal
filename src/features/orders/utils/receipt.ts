import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Database } from "@/lib/supabase/database.types";
import type { OrderItemJson } from "@/features/orders/types";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export function generateReceiptPDF(order: OrderRow) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(30, 20, 20); // #1e1414
  doc.text("UTM", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(128, 107, 107); // #806b6b
  doc.text("Unique Tasty Meal", 105, 28, { align: "center" });
  
  // Receipt details
  doc.setFontSize(16);
  doc.setTextColor(30, 20, 20);
  doc.text("Order Receipt", 14, 45);
  
  doc.setFontSize(10);
  doc.setTextColor(128, 107, 107);
  doc.text(`Order ID: #${order.id.split("-")[0].toUpperCase()}`, 14, 55);
  doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 14, 61);
  doc.text(`Status: ${order.order_status.toUpperCase()}`, 14, 67);

  // Items Table
  const items = (order.items as OrderItemJson[]) || [];
  
  const tableData = items.map((item) => {
    let mods = "";
    if (item.options?.portionSize) mods += `Portion: ${item.options.portionSize}\n`;
    if (item.options?.spice_level) mods += `Spice Level: ${item.options.spice_level}\n`;
    if (item.add_ons && item.add_ons.length > 0) {
      mods += `Add-ons: ${item.add_ons.map(a => a.name).join(", ")}`;
    }
    
    return [
      item.meal_name || "Item",
      mods.trim(),
      (item.quantity || 1).toString(),
      `$${((item.item_price || 0) * (item.quantity || 1)).toFixed(2)}`
    ];
  });

  autoTable(doc, {
    startY: 75,
    head: [["Item", "Details", "Qty", "Price"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [123, 45, 45] }, // #7b2d2d
    margin: { top: 75 },
  });

  // Calculate position for summary
  const finalY = (doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 150;
  
  // Summary
  const subtotalFromItems = items.reduce((sum, item) => sum + ((item.item_price || 0) * (item.quantity || 1)), 0);
  const delivery = order.delivery_fee || 0;
  const total = subtotalFromItems + delivery;

  doc.setFontSize(10);
  doc.setTextColor(30, 20, 20);
  doc.text(`Subtotal:`, 140, finalY + 15);
  doc.text(`$${subtotalFromItems.toFixed(2)}`, 180, finalY + 15, { align: "right" });
  
  doc.text(`Delivery Fee:`, 140, finalY + 22);
  doc.text(`$${delivery.toFixed(2)}`, 180, finalY + 22, { align: "right" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total:`, 140, finalY + 32);
  doc.text(`$${total.toFixed(2)}`, 180, finalY + 32, { align: "right" });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(128, 107, 107);
  doc.text("Thank you for ordering with UTM!", 105, finalY + 50, { align: "center" });

  // Download
  doc.save(`UTM_Receipt_${order.id.split("-")[0].toUpperCase()}.pdf`);
}
