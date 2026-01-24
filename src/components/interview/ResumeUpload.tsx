import { useState, useCallback } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ResumeUploadProps {
  onUpload: (content: string, targetRole: string) => void;
  isLoading?: boolean;
}

export const ResumeUpload = ({ onUpload, isLoading }: ResumeUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  }, []);

  const parseResumeWithAI = async (text: string): Promise<string> => {
    // Clean up extracted text
    const cleaned = text
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, '')
      .trim();
    
    return cleaned || 'Resume content could not be extracted. Proceeding with general interview.';
  };

  const handleSubmit = useCallback(async () => {
    if (!file) {
      toast.error('Please upload your resume');
      return;
    }
    if (!targetRole.trim()) {
      toast.error('Please enter your target role');
      return;
    }

    setIsParsing(true);
    
    try {
      // Read PDF as text (basic extraction)
      const reader = new FileReader();
      
      const textContent = await new Promise<string>((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const bytes = new Uint8Array(arrayBuffer);
            
            // Extract text from PDF (basic approach)
            let text = '';
            const decoder = new TextDecoder('utf-8', { fatal: false });
            const rawText = decoder.decode(bytes);
            
            // Look for text streams in PDF
            const textMatches = rawText.match(/\(([^)]+)\)/g);
            if (textMatches) {
              text = textMatches
                .map(m => m.slice(1, -1))
                .filter(t => t.length > 2 && !/^[0-9.]+$/.test(t))
                .join(' ');
            }
            
            // Fallback: extract readable strings
            if (!text || text.length < 50) {
              const readableChars = rawText.match(/[a-zA-Z0-9@.,\-\s]+/g);
              if (readableChars) {
                text = readableChars
                  .filter(s => s.trim().length > 3)
                  .join(' ');
              }
            }
            
            const parsed = await parseResumeWithAI(text);
            resolve(parsed);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      });
      
      onUpload(textContent, targetRole);
    } catch (error) {
      console.error('Resume parsing error:', error);
      toast.error('Failed to parse resume. Starting with general interview.');
      onUpload('Resume parsing failed. Conduct a general interview based on the target role.', targetRole);
    } finally {
      setIsParsing(false);
    }
  }, [file, targetRole, onUpload]);

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Card className="border-border">
      <CardContent className="p-6 space-y-6">
        {/* File Upload Area */}
        <div className="space-y-2">
          <Label>Upload Resume (PDF)</Label>
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
              <span className="text-xs text-muted-foreground mt-1">PDF up to 5MB</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Target Role Input */}
        <div className="space-y-2">
          <Label htmlFor="targetRole">Target Role</Label>
          <Input
            id="targetRole"
            placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!file || !targetRole.trim() || isParsing || isLoading}
          className="w-full"
          variant="hero"
          size="lg"
        >
          {isParsing || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Preparing Interview...
            </>
          ) : (
            'Start Interview'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
