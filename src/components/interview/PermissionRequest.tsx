import { Video, Mic, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PermissionRequestProps {
  cameraGranted: boolean;
  micGranted: boolean;
  onRequestAccess: () => void;
  isRequesting: boolean;
}

export const PermissionRequest = ({
  cameraGranted,
  micGranted,
  onRequestAccess,
  isRequesting,
}: PermissionRequestProps) => {
  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-destructive mb-2">AI Interviewer is Requesting Access</h2>
        <p className="text-muted-foreground">
          Your camera access helps create a more realistic interview experience.
          <br />
          Your audio will be used for performance evaluation at the end of the session.
        </p>
      </div>

      <Card className="bg-accent/10 border-accent/30">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-12">
            {/* Camera */}
            <div className="flex flex-col items-center space-y-4">
              <div className="h-20 w-20 rounded-2xl bg-background flex items-center justify-center">
                <Video className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                cameraGranted 
                  ? 'bg-primary border-primary' 
                  : 'border-primary'
              }`}>
                {cameraGranted && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="text-center">
                <p className="font-semibold">Allow Camera Access</p>
                <p className="text-sm text-muted-foreground">
                  This enables facial expression analysis and engagement tracking during practice sessions.
                </p>
              </div>
            </div>

            {/* Microphone */}
            <div className="flex flex-col items-center space-y-4">
              <div className="h-20 w-20 rounded-2xl bg-background flex items-center justify-center">
                <Mic className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                micGranted 
                  ? 'bg-primary border-primary' 
                  : 'border-primary'
              }`}>
                {micGranted && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="text-center">
                <p className="font-semibold">Allow Microphone Access</p>
                <p className="text-sm text-muted-foreground">
                  This captures your responses for post-interview analysis of your interview performance.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onRequestAccess}
            disabled={isRequesting || (cameraGranted && micGranted)}
            variant="hero"
            size="lg"
            className="w-full max-w-md mx-auto mt-8"
          >
            {isRequesting ? 'Requesting Access...' : 
             (cameraGranted && micGranted) ? 'Access Granted' : 'Enable Access'}
          </Button>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Need help? <a href="#" className="text-destructive hover:underline">Check out a 30-second video real quick</a>
      </p>
    </div>
  );
};
