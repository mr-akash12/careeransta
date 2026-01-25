import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface Professional {
  id: number;
  name: string;
  role: string;
  company: string;
  price: number;
  avatar: string;
}

interface BookingDialogProps {
  professional: Professional | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

const BookingDialog = ({ professional, open, onOpenChange }: BookingDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const { toast } = useToast();

  const handleConfirmBooking = () => {
    if (!date || !selectedTime) {
      toast({
        title: "Please select date and time",
        description: "Choose a date and time slot to proceed with booking.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Coming Soon!",
      description: `Payment integration is being set up. You'll soon be able to book ${professional?.name} on ${format(date, "PPP")} at ${selectedTime}.`,
    });
    
    onOpenChange(false);
    setDate(undefined);
    setSelectedTime(undefined);
  };

  const resetAndClose = () => {
    onOpenChange(false);
    setDate(undefined);
    setSelectedTime(undefined);
  };

  if (!professional) return null;

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Book a Session</DialogTitle>
          <DialogDescription>
            Select your preferred date and time slot
          </DialogDescription>
        </DialogHeader>

        {/* Professional Info */}
        <div className="flex items-center gap-4 p-4 bg-muted rounded-xl mb-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
            {professional.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{professional.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span>{professional.role} at {professional.company}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-display text-lg font-bold text-foreground">₹{professional.price}</span>
            <span className="text-xs text-muted-foreground block">/session</span>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Slots */}
        <div className="space-y-3 mt-4">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Select Time Slot
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-10",
                  selectedTime === time && "bg-primary text-primary-foreground"
                )}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {date && selectedTime && (
          <div className="mt-4 p-4 bg-accent/10 rounded-xl border border-accent/20">
            <h4 className="font-medium text-foreground mb-2">Booking Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium">Mentor:</span> {professional.name}</p>
              <p><span className="font-medium">Date:</span> {format(date, "EEEE, MMMM d, yyyy")}</p>
              <p><span className="font-medium">Time:</span> {selectedTime}</p>
              <p><span className="font-medium">Duration:</span> 45 minutes</p>
              <p className="text-foreground font-semibold mt-2">Total: ₹{professional.price}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button 
            variant="hero" 
            className="flex-1"
            onClick={handleConfirmBooking}
            disabled={!date || !selectedTime}
          >
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
