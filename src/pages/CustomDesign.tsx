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
import { useAuth0 } from "@auth0/auth0-react";

export default function CustomDesign() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState({
    clothingType: "",
    preferredColors: "",
    size: "",
    specialFeatures: "",
    budget: "",
  });

  // 🔐 Auth0 guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit custom design request");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("custom_design_requests")
        .insert({
          user_id: user.sub, // 🔥 AUTH0 USER ID
          description,
          requirements,
          status: "pending",
        });

      if (error) throw error;

      toast.success(
        "Design request submitted successfully! Our designer will contact you soon."
      );

      setDescription("");
      setRequirements({
        clothingType: "",
        preferredColors: "",
        size: "",
        specialFeatures: "",
        budget: "",
      });

      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            Custom Design Request
          </h1>
          <p className="text-muted-foreground mb-8">
            Tell us about your specific needs and we'll create a custom design
            just for you.
          </p>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Design Description *</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Clothing Type *</Label>
                  <Input
                    value={requirements.clothingType}
                    onChange={(e) =>
                      setRequirements({
                        ...requirements,
                        clothingType: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Colors</Label>
                    <Input
                      value={requirements.preferredColors}
                      onChange={(e) =>
                        setRequirements({
                          ...requirements,
                          preferredColors: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Size *</Label>
                    <Input
                      value={requirements.size}
                      onChange={(e) =>
                        setRequirements({
                          ...requirements,
                          size: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Special Features</Label>
                  <Textarea
                    value={requirements.specialFeatures}
                    onChange={(e) =>
                      setRequirements({
                        ...requirements,
                        specialFeatures: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Budget Range (₹)</Label>
                  <Input
                    value={requirements.budget}
                    onChange={(e) =>
                      setRequirements({
                        ...requirements,
                        budget: e.target.value,
                      })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
