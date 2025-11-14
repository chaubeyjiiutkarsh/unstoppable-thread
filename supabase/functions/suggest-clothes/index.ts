import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPreferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a fashion advisor specializing in adaptive clothing for specially-abled individuals. 
Recommend clothing that considers:
- Easy-wear features (magnetic closures, elastic waistbands, no buttons)
- Wheelchair accessibility
- Limited mobility or dexterity
- Comfort and independence
- Style and confidence

Provide 3-5 specific product recommendations with reasons.`;

    // Get text suggestions
    const textResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `User preferences: ${userPreferences}. Suggest adaptive clothing options.` }
        ],
      }),
    });

    if (!textResponse.ok) {
      const errorText = await textResponse.text();
      console.error("AI Gateway error:", textResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI suggestions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const textData = await textResponse.json();
    const suggestions = textData.choices[0].message.content;

    // Generate image based on suggestions
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Generate an image of adaptive clothing for specially-abled individuals based on these preferences: ${userPreferences}. Show clothing with magnetic closures, elastic waistbands, and easy-wear features. Professional product photography style.`
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    let imageUrl = "";
    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url || "";
    }

    return new Response(
      JSON.stringify({ suggestions, image: imageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in suggest-clothes:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
