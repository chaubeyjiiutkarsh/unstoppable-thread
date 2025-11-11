import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SeedInfo {
  id: string;
  seed_number: string;
  plant_name: string;
  plant_type: string;
  description: string;
  care_instructions: string;
  image_url: string;
}

export default function SeedLookup() {
  const [seedNumber, setSeedNumber] = useState("");
  const [seedInfo, setSeedInfo] = useState<SeedInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("seeds")
        .select("*")
        .eq("seed_number", seedNumber)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          toast.error("Seed number not found");
        } else {
          throw error;
        }
        setSeedInfo(null);
        return;
      }

      setSeedInfo(data);
      toast.success("Seed information found!");
    } catch (error: any) {
      toast.error(error.message || "Failed to lookup seed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Seed Information Lookup</h1>
          <p className="text-muted-foreground mb-8">
            Enter your seed number to get detailed care instructions and information.
          </p>

          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleLookup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seedNumber">Seed Number</Label>
                  <Input
                    id="seedNumber"
                    placeholder="Enter seed number (e.g., SD001)"
                    value={seedNumber}
                    onChange={(e) => setSeedNumber(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Looking up..." : "Lookup Seed"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {seedInfo && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {seedInfo.image_url && (
                    <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                      <img
                        src={seedInfo.image_url}
                        alt={seedInfo.plant_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h2 className="text-2xl font-bold mb-2">{seedInfo.plant_name}</h2>
                    <p className="text-muted-foreground">
                      Seed Number: {seedInfo.seed_number} | Type: {seedInfo.plant_type}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-muted-foreground">{seedInfo.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Care Instructions</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {seedInfo.care_instructions}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
