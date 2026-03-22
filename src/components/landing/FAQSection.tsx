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
    answer: "CareerANSTA prepares you for real-world interviews through AI-powered mock interviews that simulate actual interview scenarios. You'll receive detailed feedback on your answers, communication skills, and areas for improvement."
  },
  {
    question: "What is an AI Interview?",
    answer: "An AI Interview is a voice-based mock interview powered by artificial intelligence. Our AI interviewer asks you questions relevant to your target role, listens to your responses in real-time, and provides constructive feedback."
  },
  {
    question: "How do I take an AI interview on CareerANSTA?",
    answer: "Simply sign up, select your target role, upload your resume if desired, and start your mock interview. The AI will ask questions, listen to your answers via microphone, and provide detailed feedback at the end."
  },
  {
    question: "What types of exams can I practice?",
    answer: "CareerANSTA offers exam practice for various boards and subjects including CBSE, ICSE, State Boards, and competitive exam preparation. You can customize difficulty levels and question types."
  },
  {
    question: "How accurate is the AI feedback?",
    answer: "Our AI is trained on thousands of successful interview patterns and industry standards. It evaluates your responses based on content relevance, communication clarity, and professional presentation."
  },
  {
    question: "Can I practice interviews for specific roles?",
    answer: "Absolutely! CareerANSTA supports interview practice for various roles including Data Analyst, Software Engineer, Product Manager, Marketing, HR, and many more."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-28 px-6 lg:px-14 max-w-[1200px] mx-auto relative z-[1]">
      <div className="text-center mb-14">
        <span className="text-[9px] tracking-[3.5px] uppercase text-primary block mb-3.5">FAQ</span>
        <h2 className="font-display text-[clamp(28px,4vw,54px)] font-black tracking-tight leading-[1.1] text-foreground mb-4">
          Questions?<br /><span className="text-primary">We got answers.</span>
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-[16px] px-6 bg-card hover:border-primary/20 transition-colors"
            >
              <AccordionTrigger className="text-left text-sm md:text-base font-medium py-5 hover:no-underline text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
