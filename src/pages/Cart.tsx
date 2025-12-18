import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  color: string;
  size: string;
  products: {
    name: string;
    price: number;
    image_url: string;
  };
}

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 🔐 Auth0 guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        products (
          name,
          price,
          image_url
        )
      `);

    if (!error && data) {
      setCartItems(data as CartItem[]);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", itemId);

    if (!error) {
      fetchCartItems();
    }
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (!error) {
      toast.success("Item removed from cart");
      fetchCartItems();
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Your cart is empty
              </p>
              <Button onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex gap-4 p-4">
                    <img
                      src={item.products.image_url || "/placeholder.svg"}
                      alt={item.products.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {item.products.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Color: {item.color} | Size: {item.size}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        ₹{item.products.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-8 text-center">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold">Order Summary</h2>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
