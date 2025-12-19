import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // ✅ HARD FILTER — ONLY CURRENT USER
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          quantity,
          price,
          products ( name )
        )
      `)
      .eq("user_id", user.id) // 🔥 THIS FIXES EVERYTHING
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-muted-foreground">No orders found</p>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="mb-4">
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p>Status: {order.status}</p>
                <p>Total: ₹{order.total_amount}</p>

                <div className="mt-2 text-sm text-muted-foreground">
                  {order.order_items?.map((item: any, i: number) => (
                    <div key={i}>
                      {item.products?.name} × {item.quantity}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
