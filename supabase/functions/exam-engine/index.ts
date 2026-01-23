import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an AI Exam Engine inside an education app.

Your role:
1. Generate exam questions
2. Accept student answers
3. Evaluate answers
4. Give marks + feedback

Rules for Question Generation:
- Questions must match the selected Board and Class syllabus.
- Use real exam-style questions.
- Avoid repeating questions.
- Clearly number each question.
- Mention marks for each question.

Rules for Evaluation:
- Compare student answer with correct concept.
- Allow partial marks if logic is correct.
- Be strict but fair (exam-style checking).
- Do not reveal full model answers unless asked.
- Be encouraging and student-friendly.
- Keep explanations simple and clear.
- Act like a real teacher/examiner.`;

interface ExamRequest {
  action: "generate" | "evaluate";
  board: string;
  class: string;
  subject: string;
  chapter?: string;
  difficulty: string;
  numQuestions: number;
  questionType: string;
  questions?: Array<{ id: number; text: string; marks: number }>;
  answers?: Record<number, string>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body: ExamRequest = await req.json();
    const { action, board, class: classLevel, subject, chapter, difficulty, numQuestions, questionType, questions, answers } = body;

    let userPrompt = "";

    if (action === "generate") {
      userPrompt = `Generate ${numQuestions} ${questionType} questions for:
- Board: ${board}
- Class: ${classLevel}
- Subject: ${subject}
${chapter ? `- Chapter: ${chapter}` : ""}
- Difficulty: ${difficulty}

Format each question as JSON array:
[
  {
    "id": 1,
    "text": "Question text here",
    "marks": 2,
    "type": "${questionType}"
  }
]

For MCQ questions, include options like:
{
  "id": 1,
  "text": "Question text",
  "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
  "marks": 1,
  "type": "MCQ"
}

Return ONLY valid JSON array, no markdown or explanation.`;
    } else if (action === "evaluate") {
      const questionAnswerPairs = questions?.map((q) => {
        return `Q${q.id}. ${q.text} (Marks: ${q.marks})
Student Answer: ${answers?.[q.id] || "Not answered"}`;
      }).join("\n\n");

      userPrompt = `Evaluate these answers for ${subject} (${board} ${classLevel}):

${questionAnswerPairs}

Return evaluation as JSON:
{
  "evaluations": [
    {
      "questionId": 1,
      "givenMarks": 1.5,
      "totalMarks": 2,
      "feedback": "Brief feedback here",
      "isCorrect": false
    }
  ],
  "totalObtained": 7.5,
  "totalMarks": 10,
  "percentage": 75,
  "performance": {
    "strengths": ["List of strong areas"],
    "weakAreas": ["List of weak areas"],
    "improvements": ["How to improve"]
  }
}

Return ONLY valid JSON, no markdown.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse the JSON from the response
    let parsedContent;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedContent = JSON.parse(cleanContent);
    } catch {
      console.error("Failed to parse AI response:", content);
      parsedContent = { raw: content };
    }

    return new Response(JSON.stringify({ success: true, data: parsedContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Exam engine error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
