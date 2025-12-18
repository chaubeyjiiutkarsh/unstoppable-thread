import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  addresses: {
    full_name: string;
    city: string;
    state: string;
    postal_code: string;
  };
  order_items: {
    quantity: number;
    price: number;
    products: {
      name: string;
      image_url: string | null;
    };
  }[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        total_amount,
        status,
        addresses (
          full_name,
          city,
          state,
          postal_code
        ),
        order_items (
          quantity,
          price,
          products (
            name,
            image_url
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } else {
      setOrders(data as Order[]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                You have not placed any orders yet.
              </p>
              <Button className="mt-4" onClick={() => location.assign("/")}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6 space-y-4">
                  {/* Order Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-sm bg-muted">
                      {order.status}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {order.addresses.full_name},{" "}
                      {order.addresses.city},{" "}
                      {order.addresses.state} –{" "}
                      {order.addresses.postal_code}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {order.order_items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-3">
                          {item.products.image_url && (
                            <img
                              src={item.products.image_url}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <span>
                            {item.products.name} × {item.quantity}
                          </span>
                        </div>

                        <span>
                          ₹
                          {(item.price * item.quantity).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{order.total_amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
