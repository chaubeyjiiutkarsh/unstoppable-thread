import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CustomDesign() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState({
    clothingType: "",
    preferredColors: "",
    size: "",
    specialFeatures: "",
    budget: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to submit custom design request");
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("custom_design_requests")
        .insert([{
          user_id: user.id,
          description,
          requirements,
          status: "pending",
        } as any]);

      if (error) {
        console.error("Design request error:", error);
        throw new Error("Failed to submit design request");
      }

      toast.success("Design request submitted successfully! Our designer will contact you soon at your registered phone number.");
      setDescription("");
      setRequirements({
        clothingType: "",
        preferredColors: "",
        size: "",
        specialFeatures: "",
        budget: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Custom Design Request</h1>
          <p className="text-muted-foreground mb-8">
            Tell us about your specific needs and we'll create a custom design just for you. Our designer will contact you at your registered phone number to discuss details.
          </p>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Design Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you're looking for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clothingType">Clothing Type *</Label>
                  <Input
                    id="clothingType"
                    placeholder="e.g., T-shirt, Pants, Jacket"
                    value={requirements.clothingType}
                    onChange={(e) => setRequirements({...requirements, clothingType: e.target.value})}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredColors">Preferred Colors</Label>
                    <Input
                      id="preferredColors"
                      placeholder="e.g., Blue, Black"
                      value={requirements.preferredColors}
                      onChange={(e) => setRequirements({...requirements, preferredColors: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Size *</Label>
                    <Input
                      id="size"
                      placeholder="e.g., L, XL"
                      value={requirements.size}
                      onChange={(e) => setRequirements({...requirements, size: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialFeatures">Special Features / Requirements</Label>
                  <Textarea
                    id="specialFeatures"
                    placeholder="Any specific accessibility features needed?"
                    value={requirements.specialFeatures}
                    onChange={(e) => setRequirements({...requirements, specialFeatures: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (₹)</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., 2000-5000"
                    value={requirements.budget}
                    onChange={(e) => setRequirements({...requirements, budget: e.target.value})}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
