import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  date: string;
  text: string;
  avatar: string;
  highlighted?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    date: "January 15, 2026",
    text: "It was a nice experience with you, this is my first interview in any company. Thank you for the opportunity!",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rahul Verma",
    date: "January 10, 2026",
    text: "Great opportunity to improve myself, thank you so much for this platform!",
    avatar: "RV",
  },
  {
    id: 3,
    name: "Ananya Patel",
    date: "January 8, 2026",
    text: "It's a good experience in my first interview, it was a good experience overall.",
    avatar: "AP",
  },
  {
    id: 4,
    name: "Vikram Singh",
    date: "January 5, 2026",
    text: "Great session, and the questions were sharp and clear. Really helped me prepare.",
    avatar: "VS",
  },
  {
    id: 5,
    name: "Sneha Reddy",
    date: "December 28, 2025",
    text: "Wonderful experience! Felt like a real world interview. Highly recommended!",
    avatar: "SR",
    highlighted: true,
  },
  {
    id: 6,
    name: "Arjun Kumar",
    date: "December 20, 2025",
    text: "Good opportunity for us, really it was helpful for our preparation.",
    avatar: "AK",
  },
  {
    id: 7,
    name: "Meera Nair",
    date: "December 15, 2025",
    text: "This is my best interview and I learn many details. It's good to practice interviews here.",
    avatar: "MN",
  },
  {
    id: 8,
    name: "Karthik Iyer",
    date: "December 10, 2025",
    text: "It was good experience. By conducting this type of interviews we can overcome our fear.",
    avatar: "KI",
  },
  {
    id: 9,
    name: "Divya Menon",
    date: "December 5, 2025",
    text: "Yea it's very fantastic! It's good platform for beginners and the HR questions are helpful.",
    avatar: "DM",
  },
  {
    id: 10,
    name: "Rohit Gupta",
    date: "November 28, 2025",
    text: "It's a wonderful experience for me to attend like this mock interview.",
    avatar: "RG",
  },
  {
    id: 11,
    name: "Pooja Desai",
    date: "November 20, 2025",
    text: "Amazing platform! The AI interviewer was so realistic and helpful.",
    avatar: "PD",
  },
  {
    id: 12,
    name: "Amit Joshi",
    date: "November 15, 2025",
    text: "Best mock interview experience I've ever had. Highly recommend to all students!",
    avatar: "AJ",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div
    className={`group relative bg-card border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
      testimonial.highlighted
        ? "border-[#ff9f1c] shadow-[0_0_30px_-10px_rgba(255,159,28,0.4)]"
        : "border-border hover:border-[#ff9f1c]/50"
    }`}
  >
    {/* Quote Icon */}
    <div className="absolute top-4 right-4 text-[#ff9f1c]/30">
      <Quote className="h-8 w-8" />
    </div>

    {/* Testimonial Text */}
    <p className="text-muted-foreground text-sm leading-relaxed mb-4 pr-8">
      "{testimonial.text}"
    </p>

    {/* User Info */}
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ff9f1c] to-[#ffca3a] flex items-center justify-center text-white font-semibold text-sm">
        {testimonial.avatar}
      </div>
      <div>
        <p className={`font-semibold text-sm ${testimonial.highlighted ? "text-[#ff9f1c]" : "text-foreground"}`}>
          {testimonial.name}
        </p>
        <p className="text-xs text-muted-foreground">{testimonial.date}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const columns = [column1Ref.current, column2Ref.current, column3Ref.current];
    const speeds = [0.3, -0.4, 0.35]; // Different speeds for each column

    let animationId: number;
    let positions = [0, 0, 0];

    const animate = () => {
      if (!isPaused) {
        columns.forEach((column, index) => {
          if (column) {
            positions[index] += speeds[index];
            const maxScroll = column.scrollHeight / 2;
            
            // Reset position for seamless loop
            if (speeds[index] > 0 && positions[index] >= maxScroll) {
              positions[index] = 0;
            } else if (speeds[index] < 0 && positions[index] <= -maxScroll) {
              positions[index] = 0;
            }
            
            column.style.transform = `translateY(${positions[index]}px)`;
          }
        });
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Split testimonials into 3 columns
  const column1 = testimonials.filter((_, i) => i % 3 === 0);
  const column2 = testimonials.filter((_, i) => i % 3 === 1);
  const column3 = testimonials.filter((_, i) => i % 3 === 2);

  return (
    <section id="testimonials" className="py-20 lg:py-28 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#ff9f1c]/10 text-[#ff9f1c] text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            What Our <span className="text-[#ff9f1c]">Students</span> Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of students who have transformed their interview skills with CareerANSTA
          </p>
        </div>

        {/* Masonry Grid with Animation */}
        <div 
          ref={containerRef}
          className="relative h-[600px] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
            {/* Column 1 - Scrolls Down */}
            <div className="relative overflow-hidden">
              <div ref={column1Ref} className="space-y-6">
                {[...column1, ...column1].map((testimonial, idx) => (
                  <TestimonialCard key={`col1-${testimonial.id}-${idx}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Column 2 - Scrolls Up */}
            <div className="relative overflow-hidden hidden md:block">
              <div ref={column2Ref} className="space-y-6">
                {[...column2, ...column2].map((testimonial, idx) => (
                  <TestimonialCard key={`col2-${testimonial.id}-${idx}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Column 3 - Scrolls Down */}
            <div className="relative overflow-hidden hidden lg:block">
              <div ref={column3Ref} className="space-y-6">
                {[...column3, ...column3].map((testimonial, idx) => (
                  <TestimonialCard key={`col3-${testimonial.id}-${idx}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
