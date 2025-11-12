import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_id: string;
}

interface ReviewsListProps {
  productId: string;
  refreshTrigger?: number;
}

export const ReviewsList = ({ productId, refreshTrigger }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
      if (data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="text-4xl font-bold">{averageRating}</div>
          <div>
            {renderStars(Math.round(averageRating))}
            <p className="text-sm text-muted-foreground mt-1">
              Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="space-y-2 border-b pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Customer</p>
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              {review.review_text && (
                <p className="text-muted-foreground">{review.review_text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
