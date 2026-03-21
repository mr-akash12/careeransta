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

    const prompt = `You are a FAANG-level LinkedIn career coach and ATS expert for India's tech job market (2026).
Analyze this LinkedIn profile comprehensively and return ONLY valid JSON (no markdown, no code fences).
${langInstruction}

Profile:
"""
${profileText.slice(0, 4000)}
"""

Return this exact JSON structure (fill all fields based on the actual profile):
{
  "name": "extracted full name",
  "role": "current or target role extracted from profile",
  "atsScore": <0-100 current ATS score>,
  "atsScoreTarget": <0-100 score after improvements>,
  "profileStrength": <0-100>,
  "keywordMatch": <0-100>,
  "recruiterAppeal": <0-100>,
  "stats": [
    {"label": "ATS Keyword Match", "value": "<n>%"},
    {"label": "Sections to Rebuild", "value": "<n>"},
    {"label": "New Metrics to Add", "value": "<n>"},
    {"label": "Target Keywords", "value": "<n>"},
    {"label": "Projected Recruiter Reach", "value": "<n>×"}
  ],
  "currentHeadline": "extract their current headline verbatim",
  "currentHeadlineProblems": "explain what's wrong with it",
  "headlineOptions": [
    {"rank": 1, "label": "RECOMMENDED — Recruiter Optimized", "text": "write a FAANG-optimized headline under 220 chars with metrics", "chars": <count>, "atsScore": <0-100>, "best": true},
    {"rank": 2, "label": "ML / Deep Learning Focus", "text": "alternative headline", "chars": <count>, "atsScore": <0-100>, "best": false},
    {"rank": 3, "label": "Data Analyst / BI Focus", "text": "alternative headline", "chars": <count>, "atsScore": <0-100>, "best": false},
    {"rank": 4, "label": "GenAI / Modern Stack", "text": "alternative headline", "chars": <count>, "atsScore": <0-100>, "best": false},
    {"rank": 5, "label": "Consulting / Product Analytics", "text": "alternative headline", "chars": <count>, "atsScore": <0-100>, "best": false}
  ],
  "headlineNote": "explain why the recommended headline works (mention ATS Boolean search patterns)",
  "aboutSection": "write a complete FAANG-level About section (200-300 words) with emojis, quantified outcomes, tech stack, and location. Use the profile data to write this.",
  "aboutNote": "explain why this About section works at FAANG level",
  "experiences": [
    {
      "role": "job title",
      "company": "company name",
      "period": "date range",
      "type": "Internship/Full-time/Project",
      "bullets": ["FAANG XYZ-method bullet 1 with metrics", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
      "tags": ["Python", "SQL", "etc"]
    }
  ],
  "experienceNote": "explain FAANG writing rules used",
  "atsMatrix": [
    {"category": "Keyword Density", "before": "description + score", "beforeScore": <0-100>, "after": "description + score", "afterScore": <0-100>, "change": "what changed"},
    {"category": "Job Title Match", "before": "...", "beforeScore": <0-100>, "after": "...", "afterScore": <0-100>, "change": "..."},
    {"category": "Quantified Impact", "before": "...", "beforeScore": <0-100>, "after": "...", "afterScore": <0-100>, "change": "..."},
    {"category": "Tools & Tech Match", "before": "...", "beforeScore": <0-100>, "after": "...", "afterScore": <0-100>, "change": "..."},
    {"category": "Action Verb Quality", "before": "...", "beforeScore": <0-100>, "after": "...", "afterScore": <0-100>, "change": "..."},
    {"category": "Location Signal", "before": "...", "beforeScore": <0-100>, "after": "...", "afterScore": <0-100>, "change": "..."}
  ],
  "skills": [
    {"group": "Core Data Skills", "items": [{"name": "Python", "level": <0-100>}, {"name": "SQL", "level": <0-100>}]},
    {"group": "ML / AI Stack", "items": [{"name": "Scikit-learn", "level": <0-100>}]},
    {"group": "BI / Data Tools", "items": [{"name": "Power BI", "level": <0-100>}]}
  ],
  "gaps": [
    {"priority": "P1 — BLOCKER", "title": "...", "impact": "...", "fix": "...", "level": "blocker"},
    {"priority": "P2 — HIGH", "title": "...", "impact": "...", "fix": "...", "level": "high"},
    {"priority": "P3 — MEDIUM", "title": "...", "impact": "...", "fix": "...", "level": "medium"}
  ],
  "keywords": [
    {"word": "Python", "found": true, "freq": "98%"},
    {"word": "SQL", "found": true, "freq": "96%"}
  ],
  "checklist": [
    {"week": "Week 1 — Foundation", "icon": "⚡", "tasks": ["task1", "task2", "task3", "task4"]},
    {"week": "Week 2 — Visibility", "icon": "🚀", "tasks": ["task1", "task2", "task3", "task4"]},
    {"week": "Week 3 — Authority", "icon": "🧠", "tasks": ["task1", "task2", "task3", "task4"]},
    {"week": "Week 4 — Outreach", "icon": "🎯", "tasks": ["task1", "task2", "task3", "task4"]}
  ],
  "verdict": "2-3 sentence honest verdict about the profile."
}

IMPORTANT:
- Extract REAL data from the profile — names, roles, companies, projects
- Generate 10-15 keywords relevant to their target role
- Write 3-5 experience/project entries based on what they have
- Each experience should have 4-5 FAANG XYZ-method bullets with real metrics
- The aboutSection should be a complete rewrite ready to copy-paste
- All headline options must be under 220 characters
- Be specific and actionable, not generic`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a FAANG-level career coach. Return only valid JSON, no markdown, no code fences." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI API failed");
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not parse AI response");

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
