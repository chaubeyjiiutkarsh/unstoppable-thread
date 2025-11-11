import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

export const ProductCard = ({ id, name, price, image_url, category }: ProductCardProps) => {
  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={image_url || "/placeholder.svg"}
              alt={name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
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
