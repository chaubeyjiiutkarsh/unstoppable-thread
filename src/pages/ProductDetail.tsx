import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  colors: string[] | null;
  sizes: string[] | null;
  features: any;
  stock: number;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewRefresh, setReviewRefresh] = useState(0);

  // 🔐 Supabase auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to load product");
      return;
    }

    setProduct(data);
    setSelectedColor(data.colors?.[0] || "");
    setSelectedSize(data.sizes?.[0] || "");
  };

  const handleAddToCart = async () => {
    if (!user?.id) {
      toast.error("Please login to add items to cart");
      navigate("/auth");
      return;
    }

    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
      return;
    }

    // 🔎 check existing cart item for THIS USER
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .eq("color", selectedColor)
      .eq("size", selectedSize)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + quantity,
        })
        .eq("id", existingItem.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id, // ✅ SUPABASE USER ID
        product_id: id,
        quantity,
        color: selectedColor,
        size: selectedSize,
      });
    }

    toast.success("Added to cart!");
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (!product) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold mt-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mt-4">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.colors?.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes?.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="flex-1"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>

              <ReviewsList
                productId={id!}
                refreshTrigger={reviewRefresh}
              />

              <ReviewForm
                productId={id!}
                onReviewSubmitted={() =>
                  setReviewRefresh((prev) => prev + 1)
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
