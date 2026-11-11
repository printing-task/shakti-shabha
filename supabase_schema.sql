-- =============================================================================
-- SHAKTI SABHA (शक्ति सभा) — SUPABASE DATABASE COMPLETE SETUP SCRIPT
-- Project: https://urpbfpdwtsxfvputrmet.supabase.co
-- Run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/urpbfpdwtsxfvputrmet/sql
-- =============================================================================

-- Enable required cryptographic and UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ADMIN PROFILES TABLE (Linked to Supabase Auth)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'editor'::text CHECK (role = ANY (ARRAY['admin'::text, 'editor'::text])),
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT admin_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Trigger to automatically create admin profile on new user registration in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'editor'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2. ARTICLES TABLE (Bilingual Hindi + English Support)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title_en text,
  title_hi text,
  content_en text,
  content_hi text,
  excerpt_en text,
  excerpt_hi text,
  cover_image_url text,
  category text DEFAULT 'General'::text,
  tags text[] DEFAULT '{}'::text[],
  published boolean DEFAULT false,
  author_name text DEFAULT 'Shakti Sabha Editorial'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT articles_pkey PRIMARY KEY (id)
);

-- -----------------------------------------------------------------------------
-- 3. GALLERY CATEGORIES & PHOTOS TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  cover_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption text,
  category_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_photos_pkey PRIMARY KEY (id),
  CONSTRAINT gallery_photos_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.gallery_categories(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 4. COURSES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric DEFAULT 0,
  duration text,
  level text DEFAULT 'beginner'::text CHECK (level = ANY (ARRAY['beginner'::text, 'intermediate'::text, 'advanced'::text])),
  cover_image_url text,
  syllabus jsonb DEFAULT '[]'::jsonb,
  instructor text DEFAULT 'Shakti Sabha Academy'::text,
  published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  original_price numeric DEFAULT 0,
  discount_percent numeric DEFAULT 0,
  discount_tag text DEFAULT ''::text,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);

-- -----------------------------------------------------------------------------
-- 5. COUNSELLING REQUESTS TABLE (Public Intake)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.counselling_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  concern text,
  message text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'contacted'::text, 'resolved'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT counselling_requests_pkey PRIMARY KEY (id)
);

-- -----------------------------------------------------------------------------
-- 6. TESTIMONIALS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  quote text NOT NULL,
  image_url text,
  rating numeric DEFAULT 5,
  location text,
  published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);

-- -----------------------------------------------------------------------------
-- 7. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- -----------------------------------------------------------------------------
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselling_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Admin Profiles:
DROP POLICY IF EXISTS "Public can view admin profiles" ON public.admin_profiles;
CREATE POLICY "Public can view admin profiles"
  ON public.admin_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own admin profile" ON public.admin_profiles;
CREATE POLICY "Users can update own admin profile"
  ON public.admin_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Articles:
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated users full access to articles" ON public.articles;
CREATE POLICY "Authenticated users full access to articles"
  ON public.articles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Gallery Categories:
DROP POLICY IF EXISTS "Public can view gallery categories" ON public.gallery_categories;
CREATE POLICY "Public can view gallery categories"
  ON public.gallery_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users full access to gallery categories" ON public.gallery_categories;
CREATE POLICY "Authenticated users full access to gallery categories"
  ON public.gallery_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Gallery Photos:
DROP POLICY IF EXISTS "Public can view gallery photos" ON public.gallery_photos;
CREATE POLICY "Public can view gallery photos"
  ON public.gallery_photos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users full access to gallery photos" ON public.gallery_photos;
CREATE POLICY "Authenticated users full access to gallery photos"
  ON public.gallery_photos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Courses:
DROP POLICY IF EXISTS "Public can view published courses" ON public.courses;
CREATE POLICY "Public can view published courses"
  ON public.courses FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated users full access to courses" ON public.courses;
CREATE POLICY "Authenticated users full access to courses"
  ON public.courses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Counselling Requests:
-- Any public visitor can submit a request:
DROP POLICY IF EXISTS "Public can insert counselling requests" ON public.counselling_requests;
CREATE POLICY "Public can insert counselling requests"
  ON public.counselling_requests FOR INSERT
  WITH CHECK (true);

-- Authenticated admins can view and manage counselling requests:
DROP POLICY IF EXISTS "Authenticated admins can manage counselling requests" ON public.counselling_requests;
CREATE POLICY "Authenticated admins can manage counselling requests"
  ON public.counselling_requests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Testimonials:
DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials"
  ON public.testimonials FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated users full access to testimonials" ON public.testimonials;
CREATE POLICY "Authenticated users full access to testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 9. STORAGE BUCKET CREATION & POLICIES ('media')
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public can view files in media bucket
DROP POLICY IF EXISTS "Public Access to media bucket" ON storage.objects;
CREATE POLICY "Public Access to media bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Authenticated users can upload to media bucket
DROP POLICY IF EXISTS "Authenticated users can upload to media" ON storage.objects;
CREATE POLICY "Authenticated users can upload to media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

-- Authenticated users can update files in media bucket
DROP POLICY IF EXISTS "Authenticated users can update media" ON storage.objects;
CREATE POLICY "Authenticated users can update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media');

-- Authenticated users can delete files in media bucket
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;
CREATE POLICY "Authenticated users can delete media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');

-- -----------------------------------------------------------------------------
-- 10. DEFAULT STARTER SEED (Gallery Categories, Courses, Articles)
-- -----------------------------------------------------------------------------
INSERT INTO public.gallery_categories (name, description)
VALUES 
  ('Aaryaveera Camps', 'Residential and rural camps for self defense and leadership'),
  ('Lathi & Sword', 'Traditional martial arts, staff combat, and weapon defense'),
  ('Shakti Bhava', 'Counseling circles, psychological healing, and peer support'),
  ('School Outreach', 'Campus self-defense awareness and legal rights workshops')
ON CONFLICT (name) DO NOTHING;

-- Seed Default Flagship Courses
INSERT INTO public.courses (
  title, description, price, original_price, discount_percent, discount_tag, duration, level, cover_image_url, instructor, published, syllabus
) VALUES 
(
  'Self-Defense Foundations & Situational Readiness',
  'Core biomechanics of human vulnerabilities, escaping holds, improvised weapon defense, and rapid emergency voice command protocols. Learn active perimeter management, recognizing pre-violence indicators, and executing explosive counter-strikes.',
  1800, 2500, 28, 'Save ₹700 · Flagship Offer', '4 Weeks', 'beginner',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  'Mission Mardini Faculty', true,
  '[{"week": "Week 1", "topic": "Cognitive Radar & Threat Identification: Color-code awareness and micro-expression red flags."}, {"week": "Week 2", "topic": "Bio-mechanical Escapes: Wrist grabs, bear hugs, chokeholds, and pinned-to-wall extractions."}, {"week": "Week 3", "topic": "Empty-Hand High-Impact Strikes: Palm-heel, hammer-fist, elbows, and knee drives."}, {"week": "Week 4", "topic": "Improvised Environmental Weapons: Everyday carry items, rapid exit pathways, and post-incident stabilization."}]'::jsonb
),
(
  'Character Building & Mental Fortitude for Young Women',
  'Unapologetic boundary setting, overcoming public anxiety, vocal projection, resilience training, and cultivating unshakeable self-worth grounded in Vedic models of feminine courage.',
  2200, 3000, 27, 'Save ₹800 · Limited Time', '6 Weeks', 'intermediate',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
  'Harshita Mankar', true,
  '[{"week": "Week 1", "topic": "De-conditioning People-Pleasing & Autonomic Freeze Responses."}, {"week": "Week 2", "topic": "Voice Projection & Command Presence in High-Pressure Environments."}, {"week": "Week 3", "topic": "Psychological Resilience: Reframing Adversity through Kshatra-Dharma."}, {"week": "Week 4", "topic": "Boundary Architecture: Emotional, Physical, and Professional."}, {"week": "Week 5", "topic": "Overcoming Social Anxiety & Public Speaking Mastery."}, {"week": "Week 6", "topic": "The Sovereign Warrior Mindset: Long-term Integrity & Community Leadership."}]'::jsonb
),
(
  'Vedic Parenting & Dharmic Nurturance for Tomorrow',
  'How classical Indian wisdom, sanskaras, and emotional anchoring build confident children resilient against toxic digital addiction and predatory influences.',
  1500, 2000, 25, 'Save ₹500', '3 Weeks', 'beginner',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
  'Shakti Sabha Academy', true,
  '[{"week": "Week 1", "topic": "Foundations of Dharmic Parenting: Sanskaras in the Digital Age."}, {"week": "Week 2", "topic": "Emotional Regulation & Building Lifelong Trust with Teenagers."}, {"week": "Week 3", "topic": "Countering Algorithm Addiction & Instilling Cultural Pride."}]'::jsonb
),
(
  'Strategic Leadership for the Modern Bharatiya Warrior',
  'Community organizing, legal literacy under Bharatiya Nyaya Sanhita, crisis mediation, and grassroots campaign management for impactful institutional change.',
  3000, 4500, 33, 'Save ₹1,500 · Special Grant', '8 Weeks', 'advanced',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
  'Executive Board', true,
  '[{"week": "Week 1", "topic": "Civilizational Strategy & Historical Case Studies of Rani Chennamma."}, {"week": "Week 2", "topic": "Institutional Dynamics & Public Speaking Frameworks."}, {"week": "Week 3", "topic": "Legal Shield: Statutory Protections under BNS, IPC, and POSH Act."}, {"week": "Week 4", "topic": "Crisis Communication & Media De-escalation."}]'::jsonb
),
(
  'Dharma, Paurush & Civilizational Discourse',
  'Master the art of rigorous intellectual debate, analyzing Western feminist narratives vs civilizational Bharatiya thought with verified sources.',
  1800, 2600, 31, 'Save ₹800', '5 Weeks', 'intermediate',
  'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&auto=format&fit=crop&q=80',
  'Shakti Varta Research Group', true,
  '[{"week": "Week 1", "topic": "Epistemic Frameworks of Indian Philosophy: Pramanas and Nyaya."}, {"week": "Week 2", "topic": "De-colonizing Indian Historiography: Correcting the Distortion."}, {"week": "Week 3", "topic": "Understanding Paurush: True Masculinity as Dharma-Rakshak."}]'::jsonb
),
(
  'Traditional Lathi-Kaushal & Staff Combat Video Guide',
  'Step-by-step master angles, footwork, dual-strike blocks, and rhythmic flow drills from experienced Maharashtra lathi masters.',
  2000, 2800, 29, 'Save ₹800', '6 Weeks', 'beginner',
  'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&auto=format&fit=crop&q=80',
  'Mission Mardini Faculty', true,
  '[{"week": "Week 1", "topic": "Grip Geometry & Biomechanical Neutral Stance."}, {"week": "Week 2", "topic": "The 8 Cardinal Angle Strikes of Maratha Lathi-Kaushal."}, {"week": "Week 3", "topic": "Circular Redirections & Disarming Counter-Flows."}, {"week": "Week 4", "topic": "Two-on-One Defensive Perimeter Navigation."}]'::jsonb
);

-- Seed Default Articles
INSERT INTO public.articles (
  title_en, title_hi, content_en, content_hi, excerpt_en, excerpt_hi, cover_image_url, category, tags, published, author_name
) VALUES 
(
  'The Sovereign Mind: Why Intellectual Independence Precedes Physical Self-Defense',
  'संप्रभु मन: शारीरिक आत्मरक्षा से पहले बौद्धिक स्वतंत्रता क्यों आवश्यक है',
  'Physical technique is hollow without situational clarity and the internal psychological permission to defend oneself. For generations, social conditioning has taught women to minimize conflict, appease aggressors, and surrender intuitive discomfort for the sake of polite compliance. True defense starts when the intellect rejects submission.',
  'शारीरिक तकनीक बिना परिस्थिति की स्पष्टता और स्वयं की रक्षा करने की आंतरिक अनुमति के खोखली है। पीढ़ियों से सामाजिक अनुकूलन ने महिलाओं को संघर्ष कम करने, आक्रामकों को शांत करने और विनम्रता के नाम पर अपनी सहज असुविधा को दबाने का पाठ पढ़ाया है। सच्ची रक्षा तब शुरू होती है जब बुद्धि समर्पण को अस्वीकार कर देती है।',
  'True defense does not begin in the fist; it begins in the unconditioned mind that refuses subjugation.',
  'सच्ची रक्षा मुट्ठी में नहीं, उस अप्रभावित मन में शुरू होती है जो अधीनता को अस्वीकार करता है।',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  'Philosophy',
  ARRAY['Philosophy', 'Self-Defense', 'Consciousness'],
  true,
  'Harshita Mankar'
),
(
  'Bio-Mechanics of Street Defense: Why Leverage Trumps Mass and Raw Muscle',
  'सड़क रक्षा के बायो-मैकेनिक्स: क्यों उत्तोलन द्रव्यमान और कच्ची मांसपेशियों से श्रेष्ठ है',
  'A 50kg practitioner cannot overpower an 85kg assailant through force. However, human skeletal mechanics do not negotiate: a lever applied to the elbow hyperextends regardless of muscle size; carotid compression restricts cerebral blood flow identically on all bodies. Understanding leverage gives women decisive combat superiority.',
  'एक 50 किलोग्राम की अभ्यासी 85 किलोग्राम के हमलावर को बल से नहीं हरा सकती। लेकिन मानव कंकाल यांत्रिकी समझौता नहीं करती: कोहनी पर लगाया गया लीवर मांसपेशियों के आकार की परवाह किए बिना काम करता है। उत्तोलन को समझना महिलाओं को निर्णायक श्रेष्ठता देता है।',
  'Understanding physics and pressure points bridges the physical asymmetry between attacker and defender.',
  'भौतिकी और दबाव बिंदुओं को समझना हमलावर और रक्षक के बीच शारीरिक विषमता को समाप्त कर देता है।',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  'Combat',
  ARRAY['Mardini', 'Combat', 'Biomechanics'],
  true,
  'Mission Mardini Technical Board'
),
(
  'Deconstructing Digital Warfare: How Algorithmic Feeds Manipulate Youth Outrage',
  'डिजिटल युद्ध का विखंडन: कैसे एल्गोरिदम युवाओं के आक्रोश का संचालन करते हैं',
  'Social algorithms are engineered to optimize for nervous system arousal. Anger, humiliation, and tribal polarity produce higher engagement metrics than reasoned nuance. To preserve civilizational sanity, young thinkers must treat information with forensic skepticism.',
  'सामाजिक एल्गोरिदम तंत्रिका तंत्र के उत्तेजन को अनुकूलित करने के लिए तैयार किए गए हैं। क्रोध, अपमान और ध्रुवीकरण तर्कसंगत संतुलन की तुलना में अधिक जुड़ाव मेट्रिक्स पैदा करते हैं। सभ्यता की स्थिरता बनाए रखने के लिए युवाओं को जानकारी का न्यायिक विश्लेषण करना चाहिए।',
  'A rigorous dissection of how modern digital architecture exploits tribal instincts and degrades cognitive autonomy.',
  'आधुनिक डिजिटल वास्तुकला जनजातीय प्रवृत्तियों का कैसे फायदा उठाती है और संज्ञानात्मक स्वायत्तता को घटाती है, इसका विश्लेषण।',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  'Discourse',
  ARRAY['Shakti Varta', 'Media', 'Digital Age'],
  true,
  'Shakti Varta Research Group'
);

-- Seed Default Testimonials
INSERT INTO public.testimonials (name, role, quote, image_url, rating, location, published)
VALUES 
(
  'Pooja Deshmukh',
  'Mardini Camp Graduate, Pune',
  'Mission Mardini transformed how I carry myself in public spaces. I went from feeling vulnerable during late evening commutes to knowing exactly how to control my perimeter, use my voice, and break away from grabs.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  5,
  'Pune, Maharashtra',
  true
),
(
  'Ananya Sharma',
  'Vedic Fellowship Participant, Delhi',
  'Shakti Varta gave me the intellectual vocabulary and textual grounding to dismantle biased narratives without fear or anger. It taught me how to think independently rather than follow popular trends.',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  5,
  'New Delhi',
  true
),
(
  'Sunita Rathore',
  'Rural Outreach Lead, Amravati',
  'Watching hundreds of village girls pick up lathis with pride and discipline under Harshita Tai’s guidance was awe-inspiring. Shakti Sabha brings tangible confidence where it is needed most.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  5,
  'Vidarbha, Maharashtra',
  true
);
