-- Create professionals table for live session mentors
CREATE TABLE public.professionals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    experience TEXT NOT NULL,
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
    reviews INTEGER NOT NULL DEFAULT 0,
    price INTEGER NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    avatar TEXT,
    available BOOLEAN NOT NULL DEFAULT true,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved professionals
CREATE POLICY "Anyone can view available professionals"
ON public.professionals
FOR SELECT
USING (available = true);

-- Admins can view all professionals
CREATE POLICY "Admins can view all professionals"
ON public.professionals
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert professionals
CREATE POLICY "Admins can insert professionals"
ON public.professionals
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update professionals
CREATE POLICY "Admins can update professionals"
ON public.professionals
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete professionals
CREATE POLICY "Admins can delete professionals"
ON public.professionals
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Professionals can update their own profile
CREATE POLICY "Professionals can update own profile"
ON public.professionals
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial professionals data
INSERT INTO public.professionals (name, role, company, experience, rating, reviews, price, skills, avatar, available) VALUES
('Priya Sharma', 'Senior Software Engineer', 'Google', '8 years', 4.9, 124, 500, ARRAY['System Design', 'DSA', 'React'], 'PS', true),
('Rahul Mehta', 'Data Scientist', 'Amazon', '6 years', 4.8, 89, 600, ARRAY['ML', 'Python', 'Statistics'], 'RM', true),
('Anjali Gupta', 'Product Manager', 'Microsoft', '10 years', 4.9, 156, 800, ARRAY['Product Strategy', 'Agile', 'Leadership'], 'AG', true),
('Vikram Singh', 'Senior Software Engineer', 'Meta', '7 years', 4.7, 98, 550, ARRAY['Backend', 'System Design', 'Java'], 'VS', true),
('Sneha Patel', 'Data Scientist', 'Netflix', '5 years', 4.6, 67, 450, ARRAY['Deep Learning', 'NLP', 'Python'], 'SP', true),
('Arjun Reddy', 'Product Manager', 'Uber', '8 years', 4.8, 112, 700, ARRAY['Growth', 'Analytics', 'Strategy'], 'AR', true);