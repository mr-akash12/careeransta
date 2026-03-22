const items = [
  { value: "10K+", label: "Active users" },
  { value: "95%", label: "Interview success" },
  { value: "500+", label: "Partner companies" },
  { value: "4.9★", label: "Average rating" },
  { value: "2M+", label: "Resumes generated" },
];

const TickerSection = () => {
  const doubled = [...items, ...items];

  return (
    <div className="border-t border-b border-border py-5 overflow-hidden relative z-[1]">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0">
            <span className="font-display text-lg font-black text-primary">{item.value}</span>
            <span className="text-sm text-muted-foreground">{item.label}</span>
            {i < doubled.length - 1 && (
              <span className="text-border text-lg ml-10">·</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerSection;
