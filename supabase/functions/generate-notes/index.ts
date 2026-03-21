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
    const { topic, subtopic, language } = await req.json();
    const isHindi = language === "hi";

    if (!topic || !subtopic) {
      return new Response(JSON.stringify({ error: "Topic and subtopic are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const languageInstruction = isHindi
      ? `IMPORTANT: Write ALL explanations, descriptions, real-world examples, info boxes, and text blocks in Hinglish (Hindi written in English script). Example: "Variable ek container hai jo data store karta hai." Code comments bhi Hinglish mein likho. Code syntax (Python/JS) English mein rahega. Math formulas English notation mein rahenge.`
      : `Write all content in clear English.`;

    const prompt = `You are an expert educator creating comprehensive study notes on "${subtopic}" under "${topic}".

${languageInstruction}

Return a JSON object with this EXACT structure:
{
  "title": "${subtopic}",
  "subtitle": "One line description",
  "tags": ["tag1", "tag2", "tag3"],
  "sections": [
    {
      "heading": "Section Title",
      "icon": "emoji",
      "blocks": [
        { "type": "text", "content": "Explanation text. Use <hl>word</hl> for highlights." },
        { "type": "real-world", "content": "A real-world example or analogy" },
        { "type": "code", "lang": "python", "code": "actual code here" },
        { "type": "info", "variant": "tip", "content": "A helpful tip" },
        { "type": "info", "variant": "warn", "content": "A warning" },
        { "type": "info", "variant": "note", "content": "An important note" },
        { "type": "math", "title": "FORMULA NAME", "content": "formula = expression\nwhere x = meaning" },
        { "type": "table", "headers": ["Col1", "Col2"], "rows": [["val1", "val2"]] },
        { "type": "output", "content": "Expected output text" }
      ]
    }
  ]
}

RULES:
- Generate 5-8 rich sections covering the subtopic thoroughly
- Each section MUST have 3-6 blocks of MIXED types
- Include at least 2 code blocks, 1 real-world example, 1 info box, and 1 table across all sections
- For programming topics, include practical code examples with comments
- Use <hl>word</hl> tags in text for highlighting important terms
- Code must be complete and runnable where possible
- info variant can be: "tip", "warn", "note", "danger"
- Keep explanations beginner-friendly but thorough

Return ONLY valid JSON, no markdown wrapping.`;

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a helpful educator that returns only valid JSON with rich structured content." },
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

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse notes from AI response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ success: true, ...result }), {
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
