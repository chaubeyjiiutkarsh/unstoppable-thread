import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import all product images
import productShirt from "@/assets/product-adaptive-shirt.jpg";
import productDress from "@/assets/product-dress.jpg";
import productJacket from "@/assets/product-jacket.jpg";
import productPants from "@/assets/product-pants.jpg";
import productShorts from "@/assets/product-shorts.jpg";
import productSmartTee from "@/assets/product-smart-tee.jpg";
import magneticShirt from "@/assets/magnetic-shirt.jpg";
import adaptivePants from "@/assets/adaptive-pants.jpg";
import adaptiveJacketMagnetic from "@/assets/adaptive-jacket-magnetic.jpg";
import adaptiveDressMagnetic from "@/assets/adaptive-dress-magnetic.jpg";
import adaptiveShorts from "@/assets/adaptive-shorts.jpg";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

// Map database image paths to imported images
const imageMap: Record<string, string> = {
  "src/assets/product-adaptive-shirt.jpg": productShirt,
  "src/assets/product-dress.jpg": productDress,
  "src/assets/product-jacket.jpg": productJacket,
  "src/assets/product-pants.jpg": productPants,
  "src/assets/product-shorts.jpg": productShorts,
  "src/assets/product-smart-tee.jpg": productSmartTee,
  "src/assets/magnetic-shirt.jpg": magneticShirt,
  "src/assets/adaptive-pants.jpg": adaptivePants,
  "src/assets/adaptive-jacket-magnetic.jpg": adaptiveJacketMagnetic,
  "src/assets/adaptive-dress-magnetic.jpg": adaptiveDressMagnetic,
  "src/assets/adaptive-shorts.jpg": adaptiveShorts,
};

export const ProductCard = ({ id, name, price, image_url, category }: ProductCardProps) => {
  const resolvedImage = imageMap[image_url] || image_url || "/placeholder.svg";
  
  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={resolvedImage}
              alt={name}
              className="h-full w-full object-contain transition-transform hover:scale-105"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <p className="text-xs text-muted-foreground uppercase">{category}</p>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <div className="flex w-full items-center justify-between">
            <span className="text-lg font-bold text-primary">₹{price.toLocaleString('en-IN')}</span>
            <Button size="sm">View Details</Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
