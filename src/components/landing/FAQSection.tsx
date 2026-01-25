import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is CareerANSTA?",
    answer: "CareerANSTA is an AI-powered career preparation platform designed specifically for students and professionals. It offers AI mock interviews, exam practice, and personalized feedback to help you land your dream job or internship."
  },
  {
    question: "Is CareerANSTA free to use for students?",
    answer: "Yes! CareerANSTA offers a free tier for students that includes basic AI mock interviews and exam practice. Premium features are available with our Pro and Enterprise plans for more advanced preparation needs."
  },
  {
    question: "How can CareerANSTA help me find a job or internship?",
    answer: "CareerANSTA prepares you for real-world interviews through AI-powered mock interviews that simulate actual interview scenarios. You'll receive detailed feedback on your answers, communication skills, and areas for improvement, giving you the confidence to ace your actual interviews."
  },
  {
    question: "What is an AI Interview?",
    answer: "An AI Interview is a voice-based mock interview powered by artificial intelligence. Our AI interviewer asks you questions relevant to your target role, listens to your responses in real-time, and provides constructive feedback just like a real interviewer would."
  },
  {
    question: "How do I take an AI interview on CareerANSTA?",
    answer: "Simply sign up, select your target role (like Data Analyst, Software Engineer, etc.), upload your resume if desired, and start your mock interview. The AI will ask questions, listen to your answers via microphone, and provide detailed feedback at the end."
  },
  {
    question: "What types of exams can I practice?",
    answer: "CareerANSTA offers exam practice for various boards and subjects including CBSE, ICSE, State Boards, and competitive exam preparation. You can customize difficulty levels and question types to match your specific needs."
  },
  {
    question: "How accurate is the AI feedback?",
    answer: "Our AI is trained on thousands of successful interview patterns and industry standards. It evaluates your responses based on content relevance, communication clarity, and professional presentation to give you actionable, accurate feedback."
  },
  {
    question: "Can I practice interviews for specific roles?",
    answer: "Absolutely! CareerANSTA supports interview practice for various roles including Data Analyst, Software Engineer, Product Manager, Marketing, HR, and many more. Each interview is tailored to the specific skills and questions relevant to your target role."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about CareerANSTA and how it can help you achieve your career goals.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-medium py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
