import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        total_amount,
        status,
        user_id,
        profiles (
          email
        ),
        order_items (
          quantity,
          products ( name )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  // 🔄 Update order status
  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Order status updated");
      fetchAllOrders();
    }
  };

  if (loading) return null;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin • All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders found</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  Order #{order.id.slice(0, 8)}
                </p>

                <span className="text-sm capitalize px-2 py-1 rounded bg-muted">
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                User: {order.profiles?.email}
              </p>

              <p>Total: ₹{order.total_amount}</p>

              <div className="text-sm text-muted-foreground mt-2">
                {order.order_items?.map((item: any, i: number) => (
                  <div key={i}>
                    {item.products?.name} × {item.quantity}
                  </div>
                ))}
              </div>

              {/* 🔧 Admin Controls */}
              <div className="flex gap-2 pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(order.id, "shipped")}
                >
                  Mark Shipped
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(order.id, "delivered")}
                >
                  Mark Delivered
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
