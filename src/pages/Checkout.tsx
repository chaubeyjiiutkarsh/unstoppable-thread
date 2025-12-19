import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  /* 🔐 Auth Guard */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/auth");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, [navigate]);

  /* 🛒 Fetch cart for logged-in user */
  useEffect(() => {
    if (user) fetchCartItems();
  }, [user]);

  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        products (
          name,
          price,
          image_url
        )
      `
      )
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      toast.error("Failed to load cart");
      return;
    }

    setCartItems(data || []);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  /* 🧾 PLACE ORDER */
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1️⃣ Address
      const { data: address, error: addressError } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          full_name: fullName,
          phone,
          address_line1: addressLine1,
          address_line2: addressLine2 || null,
          city,
          state,
          postal_code: postalCode,
          is_default: true,
        })
        .select()
        .single();

      if (addressError) throw addressError;

      // 2️⃣ Order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          address_id: address.id,
          total_amount: totalAmount,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3️⃣ Order Items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price,
        color: item.color,
        size: item.size,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 4️⃣ Clear cart
      await supabase.from("cart_items").delete().eq("user_id", user.id);

      toast.success("Order placed successfully 🎉");
      navigate("/orders");
    } catch (err: any) {
      console.error("ORDER ERROR:", err);
      toast.error(err.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Address */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Delivery Address</h2>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  <Input placeholder="Address Line 1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required />
                  <Input placeholder="Address Line 2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
                  <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                  <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
                  <Input placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card>
              <CardContent className="p-6 space-y-2">
                <h2 className="text-xl font-bold mb-2">Order Summary</h2>

                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.products.name} × {item.quantity}
                    </span>
                    <span>
                      ₹{(item.products.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}

                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
