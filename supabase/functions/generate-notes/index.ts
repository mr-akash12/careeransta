import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { topic, subtopic } = await req.json();

    if (!topic || !subtopic) {
      return new Response(JSON.stringify({ error: "Topic and subtopic are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are an expert educator. Generate comprehensive study notes on the subtopic "${subtopic}" under the main topic "${topic}".

Return a JSON array of sections. Each section has:
- "heading": a clear section title
- "content": detailed explanation (use bullet points with "•", keep it clear and beginner-friendly, include key definitions and concepts)
- "code": (optional) a relevant code example if applicable. Only include for programming topics.

Generate 4-6 sections covering the subtopic thoroughly. Include practical examples, key points to remember, and common pitfalls.

Return ONLY valid JSON array, no markdown wrapping. Example format:
[
  {"heading": "Introduction", "content": "...", "code": "..."},
  {"heading": "Key Concepts", "content": "..."}
]`;

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a helpful educator that returns only valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error("Failed to generate notes from AI");
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse notes from AI response");
    }

    const sections = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ success: true, sections }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
