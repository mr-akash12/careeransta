import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a real-time face-to-face interview AI conducting a live video interview simulation.

You behave like a human interviewer on a video call.

You:
- Speak in short, natural sentences
- Pause after each question
- React to the candidate's tone, clarity, confidence (based on their response patterns)
- Never ask multiple questions at once
- Wait for the candidate's response before continuing

Interview style:
- Professional
- Calm
- Slightly conversational
- Supportive but realistic

Voice Interview Rules:
- Use spoken language, not textbook language
- Ask one question at a time
- Add natural fillers occasionally (e.g., "Alright", "Okay", "I see")
- After user finishes speaking, respond naturally
- If the user pauses or gives a short answer, gently encourage them

Example phrases:
- "Take your time."
- "Go ahead."
- "Can you explain that a bit more?"

Camera/Face-to-Face Simulation (simulated based on response patterns):
- If the candidate seems nervous (short answers, hesitation) → reassure them
- If they seem confident (detailed answers) → acknowledge it subtly
- Provide behavioral feedback at the end

Real-time Response Handling:
- If candidate pauses too long: Say "Take your time, no rush."
- If very short answer: Ask a follow-up: "Can you elaborate a bit more?"
- If off-topic: Politely redirect: "Let's bring it back to the main point."
- If sounds unsure: Encourage: "That's okay, just explain what you know."

Voice-Based Evaluation (track silently):
- Clarity of response
- Confidence level
- Response length
- Use of filler words indicators

CRITICAL RULES:
- Do NOT interrupt mid-answer
- Keep responses under 3 sentences usually
- Be encouraging but professional
- One question at a time, always wait for response`;

interface InterviewRequest {
  action: 'start' | 'respond' | 'end';
  resumeContent?: string;
  targetRole?: string;
  mode?: 'friendly' | 'stress' | 'standard';
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userResponse?: string;
  responsePatterns?: {
    averageLength: number;
    hesitationCount: number;
    fillerWordCount: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, resumeContent, targetRole, mode, conversationHistory, userResponse, responsePatterns } = await req.json() as InterviewRequest;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let userPrompt = '';
    let modeInstruction = '';

    if (mode === 'stress') {
      modeInstruction = '\n\nSTRESS MODE: Be more challenging, ask follow-ups faster, maintain a serious professional tone. Push the candidate.';
    } else if (mode === 'friendly') {
      modeInstruction = '\n\nFRIENDLY MODE: Be warm, encouraging, use a relaxed tone. Make the candidate feel comfortable.';
    }

    if (action === 'start') {
      userPrompt = `The interview is starting. The candidate has uploaded their resume.

Resume Content:
${resumeContent || 'No resume provided'}

Target Role: ${targetRole || 'General Interview'}

${modeInstruction}

Begin the interview naturally. Say your greeting and ask them to introduce themselves. Remember:
- Say: "Hi, can you hear me clearly? Great. Let's begin. Please make yourself comfortable and look at the camera. Whenever you're ready, please introduce yourself."
- Keep it natural and conversational
- Wait for their response`;
    } else if (action === 'respond') {
      const patternAnalysis = responsePatterns ? `
      
Candidate Response Patterns (use subtly in your response):
- Average response length: ${responsePatterns.averageLength} words (${responsePatterns.averageLength < 20 ? 'short - encourage elaboration' : responsePatterns.averageLength > 100 ? 'detailed - good sign' : 'moderate'})
- Signs of hesitation: ${responsePatterns.hesitationCount > 2 ? 'some nervousness detected' : 'seems comfortable'}
- Filler words detected: ${responsePatterns.fillerWordCount > 3 ? 'high - note for feedback' : 'acceptable'}` : '';

      userPrompt = `Continue the interview. Here's the conversation so far:

${conversationHistory?.map(msg => `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`).join('\n\n')}

Candidate just said: "${userResponse}"
${patternAnalysis}
${modeInstruction}

Respond naturally, then ask the next relevant question based on their resume and the conversation flow. Remember:
- One question at a time
- React to what they said
- Use natural fillers occasionally
- If their answer was short, ask for elaboration
- If they went off-topic, gently redirect
- Keep responses conversational and under 3 sentences before the next question`;
    } else if (action === 'end') {
      userPrompt = `The interview is ending. Provide a comprehensive feedback summary.

Conversation History:
${conversationHistory?.map(msg => `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`).join('\n\n')}

Response Patterns:
${responsePatterns ? `
- Average response length: ${responsePatterns.averageLength} words
- Hesitation indicators: ${responsePatterns.hesitationCount}
- Filler word usage: ${responsePatterns.fillerWordCount}
` : 'Not available'}

Provide feedback in this JSON format:
{
  "closingRemarks": "Natural closing statement thanking them for their time",
  "scores": {
    "communication": <1-10>,
    "confidence": <1-10>,
    "technicalKnowledge": <1-10>,
    "bodyLanguage": <1-10>,
    "overallImpression": <1-10>
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "actionableTips": ["tip 1", "tip 2", "tip 3"],
  "overallFeedback": "2-3 sentence summary of their performance"
}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;

    let result;
    if (action === 'end') {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          result = { closingRemarks: content, scores: {}, strengths: [], improvements: [], actionableTips: [], overallFeedback: '' };
        }
      } catch {
        result = { closingRemarks: content, scores: {}, strengths: [], improvements: [], actionableTips: [], overallFeedback: '' };
      }
    } else {
      result = { message: content };
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Interview AI error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
