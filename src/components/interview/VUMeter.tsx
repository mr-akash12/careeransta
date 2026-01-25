import { cn } from '@/lib/utils';

interface VUMeterProps {
  volume: number; // 0-1
  frequencyData?: number[]; // Array of 0-1 values
  isActive: boolean;
  variant?: 'bars' | 'arc' | 'simple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Simple horizontal bar meter
const SimpleVUMeter = ({ volume, isActive, size }: { volume: number; isActive: boolean; size: string }) => {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className={cn('w-full bg-muted rounded-full overflow-hidden', heights[size as keyof typeof heights])}>
      <div 
        className={cn(
          'h-full rounded-full transition-all duration-75',
          isActive ? 'bg-gradient-to-r from-success via-warning to-destructive' : 'bg-muted-foreground/30'
        )}
        style={{ width: `${Math.max(volume * 100, isActive ? 5 : 0)}%` }}
      />
    </div>
  );
};

// Frequency bars visualization
const BarsVUMeter = ({ 
  frequencyData, 
  isActive, 
  size 
}: { 
  frequencyData: number[]; 
  isActive: boolean; 
  size: string 
}) => {
  const heights = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };
  
  const barCount = frequencyData.length || 16;
  const bars = frequencyData.length > 0 
    ? frequencyData 
    : Array(barCount).fill(0);
  
  return (
    <div className={cn('flex items-end justify-center gap-[2px]', heights[size as keyof typeof heights])}>
      {bars.map((value, i) => {
        const height = isActive ? Math.max(value * 100, 10) : 10;
        const intensity = value;
        
        return (
          <div
            key={i}
            className={cn(
              'w-1.5 rounded-full transition-all duration-75',
              isActive 
                ? intensity > 0.7 
                  ? 'bg-destructive' 
                  : intensity > 0.4 
                    ? 'bg-warning' 
                    : 'bg-success'
                : 'bg-muted-foreground/20'
            )}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
};

// Arc/semicircle meter (like a classic VU meter)
const ArcVUMeter = ({ volume, isActive, size }: { volume: number; isActive: boolean; size: string }) => {
  const sizes = {
    sm: { width: 80, height: 40, strokeWidth: 6 },
    md: { width: 120, height: 60, strokeWidth: 8 },
    lg: { width: 160, height: 80, strokeWidth: 10 }
  };
  
  const { width, height, strokeWidth } = sizes[size as keyof typeof sizes];
  const radius = height - strokeWidth / 2;
  const circumference = Math.PI * radius;
  const progress = isActive ? volume : 0;
  
  // Color based on volume level
  const getColor = () => {
    if (!isActive) return 'hsl(var(--muted-foreground) / 0.3)';
    if (volume > 0.8) return 'hsl(var(--destructive))';
    if (volume > 0.5) return 'hsl(var(--warning))';
    return 'hsl(var(--success))';
  };
  
  return (
    <div className="relative" style={{ width, height: height + 10 }}>
      <svg 
        width={width} 
        height={height + 10} 
        viewBox={`0 0 ${width} ${height + 10}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${height}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Foreground arc (filled based on volume) */}
        <path
          d={`M ${strokeWidth / 2} ${height} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${height}`}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className="transition-all duration-75"
        />
        {/* Needle indicator */}
        <line
          x1={width / 2}
          y1={height}
          x2={width / 2 + Math.cos(Math.PI * (1 - progress)) * (radius - 5)}
          y2={height - Math.sin(Math.PI * (1 - progress)) * (radius - 5)}
          stroke={isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}
          strokeWidth={2}
          strokeLinecap="round"
          className="transition-all duration-75"
        />
        {/* Center dot */}
        <circle
          cx={width / 2}
          cy={height}
          r={4}
          fill={isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'}
        />
      </svg>
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        <span className="text-[8px] text-muted-foreground">0</span>
        <span className="text-[8px] text-muted-foreground">100</span>
      </div>
    </div>
  );
};

export const VUMeter = ({ 
  volume, 
  frequencyData = [], 
  isActive, 
  variant = 'bars',
  size = 'md',
  className 
}: VUMeterProps) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {variant === 'simple' && (
        <SimpleVUMeter volume={volume} isActive={isActive} size={size} />
      )}
      {variant === 'bars' && (
        <BarsVUMeter frequencyData={frequencyData} isActive={isActive} size={size} />
      )}
      {variant === 'arc' && (
        <ArcVUMeter volume={volume} isActive={isActive} size={size} />
      )}
    </div>
  );
};
