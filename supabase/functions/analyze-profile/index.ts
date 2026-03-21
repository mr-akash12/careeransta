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
    const { profileText, language } = await req.json();
    const isHindi = language === "hi";

    if (!profileText || profileText.trim().length < 50) {
      return new Response(JSON.stringify({ error: "Profile text too short" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const langInstruction = isHindi
      ? "Write all text fields in Hinglish (Hindi in English script). Example: 'Aapka profile strong hai lekin improvements ki zaroorat hai.'"
      : "Write all text in clear English.";

    const prompt = `You are a senior LinkedIn career coach and ATS expert for India's tech job market (2026).
Analyze this LinkedIn profile and return ONLY valid JSON (no markdown).
${langInstruction}

Profile:
"""
${profileText.slice(0, 3000)}
"""

Return this exact JSON structure:
{
  "name": "extracted name or Professional",
  "role": "current or target role",
  "atsScore": <0-100>,
  "profileStrength": <0-100>,
  "keywordMatch": <0-100>,
  "recruiterAppeal": <0-100>,
  "stats": [
    {"label": "ATS Score", "value": "<n>%"},
    {"label": "Keywords Found", "value": "<n>/15"},
    {"label": "Profile Completeness", "value": "<n>%"},
    {"label": "Recruiter Appeal", "value": "<n>/10"}
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": [
    {"priority": "P1 — BLOCKER", "title": "...", "impact": "...", "fix": "...", "level": "blocker"},
    {"priority": "P2 — HIGH", "title": "...", "impact": "...", "fix": "...", "level": "high"},
    {"priority": "P3 — MEDIUM", "title": "...", "impact": "...", "fix": "...", "level": "medium"}
  ],
  "keywords": [
    {"word": "Python", "found": true, "freq": "98%"},
    {"word": "SQL", "found": false, "freq": "96%"},
    {"word": "Machine Learning", "found": false, "freq": "91%"},
    {"word": "Data Analysis", "found": true, "freq": "94%"},
    {"word": "Power BI", "found": false, "freq": "78%"},
    {"word": "Data Visualization", "found": false, "freq": "82%"},
    {"word": "EDA", "found": false, "freq": "71%"},
    {"word": "Pandas", "found": false, "freq": "68%"},
    {"word": "Statistics", "found": false, "freq": "66%"},
    {"word": "Tableau", "found": false, "freq": "62%"},
    {"word": "NLP", "found": false, "freq": "58%"},
    {"word": "Deep Learning", "found": false, "freq": "54%"},
    {"word": "GitHub", "found": false, "freq": "71%"},
    {"word": "LLMs", "found": false, "freq": "41%"},
    {"word": "GenAI", "found": false, "freq": "38%"}
  ],
  "checklist": [
    {"week": "Week 1 — Foundation", "icon": "⚡", "tasks": ["task1", "task2", "task3", "task4"]},
    {"week": "Week 2 — Visibility", "icon": "🚀", "tasks": ["task1", "task2", "task3", "task4"]},
    {"week": "Week 3 — Authority", "icon": "🧠", "tasks": ["task1", "task2", "task3", "task4"]},
    {"week": "Week 4 — Outreach", "icon": "🎯", "tasks": ["task1", "task2", "task3", "task4"]}
  ],
  "verdict": "2-3 sentence honest verdict."
}`;

    const response = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a career coach. Return only valid JSON, no markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) throw new Error("AI API failed");

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not parse response");

    const result = JSON.parse(match[0]);
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
