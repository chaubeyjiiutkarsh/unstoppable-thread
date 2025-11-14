import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const AISuggestions = () => {
  const [preferences, setPreferences] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [suggestionImage, setSuggestionImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (!preferences.trim()) {
      toast.error("Please describe your needs");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-clothes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ userPreferences: preferences }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get suggestions");
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
      setSuggestionImage(data.image || "");
      toast.success("AI suggestions generated!");
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast.error("Failed to get suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Clothing Suggestions
        </CardTitle>
        <CardDescription>
          Tell us about your needs, mobility considerations, and style preferences. Our AI will suggest the best adaptive clothing for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Example: I use a wheelchair and have limited hand mobility. I need comfortable, easy-to-wear casual clothes for daily use. I prefer dark colors and modern styles..."
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          rows={5}
          className="resize-none"
        />
        <Button 
          onClick={handleGetSuggestions} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Suggestions...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Suggestions
            </>
          )}
        </Button>

        {suggestions && (
          <div className="mt-6 space-y-4">
            {suggestionImage && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={suggestionImage}
                  alt="AI Suggested Clothing"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">AI Recommendations:</h3>
              <div className="whitespace-pre-wrap text-sm">{suggestions}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
