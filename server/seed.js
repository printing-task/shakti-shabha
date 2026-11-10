/**
 * Shakti Sabha — MongoDB Atlas Initial Seeder
 * Creates all collections, indexes, and populates initial production data.
 * Run with: node server/seed.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');
const { sanitizeMongoUri } = require('./db');

const rawUri = process.env.MONGODB_URI;
if (!rawUri || rawUri.includes('<db_password>')) {
  console.error('❌ Error: MONGODB_URI is not set or still contains <db_password> in your .env');
  console.log('Usage:');
  console.log('  MONGODB_URI="mongodb+srv://user:pass@cluster0.../shakti_sabha" node server/seed.js');
  process.exit(1);
}

const uri = sanitizeMongoUri(rawUri);

const INITIAL_COURSES = [
  {
    id: 'course-self-defense',
    title: 'Self-Defense Foundations & Situational Readiness',
    description: 'Core biomechanics of human vulnerabilities, escaping holds, improvised weapon defense, and rapid emergency voice command protocols. Learn active perimeter management, recognizing pre-violence indicators, and executing explosive counter-strikes.',
    price: 1800,
    original_price: 2500,
    discount_percent: 28,
    discount_tag: 'Save ₹700 · Flagship Offer',
    duration: '4 Weeks',
    level: 'beginner',
    cover_image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    instructor: 'Mission Mardini Faculty',
    published: true,
    syllabus: [
      { week: 'Week 1', topic: 'Cognitive Radar & Threat Identification: Color-code awareness and micro-expression red flags.' },
      { week: 'Week 2', topic: 'Bio-mechanical Escapes: Wrist grabs, bear hugs, chokeholds, and pinned-to-wall extractions.' },
      { week: 'Week 3', topic: 'Empty-Hand High-Impact Strikes: Palm-heel, hammer-fist, elbows, and knee drives.' },
      { week: 'Week 4', topic: 'Improvised Environmental Weapons: Everyday carry items, rapid exit pathways, and post-incident stabilization.' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'course-character-building',
    title: 'Character Building & Mental Fortitude for Young Women',
    description: 'Unapologetic boundary setting, overcoming public anxiety, vocal projection, resilience training, and cultivating unshakeable self-worth grounded in Vedic models of feminine courage.',
    price: 2200,
    original_price: 3000,
    discount_percent: 27,
    discount_tag: 'Save ₹800 · Limited Time',
    duration: '6 Weeks',
    level: 'intermediate',
    cover_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    instructor: 'Harshita Mankar',
    published: true,
    syllabus: [
      { week: 'Week 1', topic: 'De-conditioning People-Pleasing & Autonomic Freeze Responses.' },
      { week: 'Week 2', topic: 'Voice Projection & Command Presence in High-Pressure Environments.' },
      { week: 'Week 3', topic: 'Psychological Resilience: Reframing Adversity through Kshatra-Dharma.' },
      { week: 'Week 4', topic: 'Boundary Architecture: Emotional, Physical, and Professional.' },
      { week: 'Week 5', topic: 'Overcoming Social Anxiety & Public Speaking Mastery.' },
      { week: 'Week 6', topic: 'The Sovereign Warrior Mindset: Long-term Integrity & Community Leadership.' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'course-vedic-parenting',
    title: 'Vedic Parenting & Dharmic Nurturance for Tomorrow',
    description: 'How classical Indian wisdom, sanskaras, and emotional anchoring build confident children resilient against toxic digital addiction and predatory influences.',
    price: 1500,
    original_price: 2000,
    discount_percent: 25,
    discount_tag: 'Save ₹500',
    duration: '3 Weeks',
    level: 'beginner',
    cover_image_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
    instructor: 'Shakti Sabha Academy',
    published: true,
    syllabus: [
      { week: 'Week 1', topic: 'Foundations of Dharmic Parenting: Sanskaras in the Digital Age.' },
      { week: 'Week 2', topic: 'Emotional Regulation & Building Lifelong Trust with Teenagers.' },
      { week: 'Week 3', topic: 'Countering Algorithm Addiction & Instilling Cultural Pride.' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'course-traditional-lathi',
    title: 'Traditional Lathi-Kaushal & Staff Combat Video Guide',
    description: 'Foundations of Indian staff fighting (Lathi-Khel): footwork angles, parries, circular momentum generation, and distance maintenance for self-defense.',
    price: 1200,
    original_price: 1800,
    discount_percent: 33,
    discount_tag: 'Save ₹600',
    duration: '3 Weeks',
    level: 'beginner',
    cover_image_url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&auto=format&fit=crop&q=80',
    instructor: 'Mission Mardini Masters',
    published: true,
    syllabus: [
      { week: 'Week 1', topic: 'Staff Selection, Grip Geometry & Stance Mobility.' },
      { week: 'Week 2', topic: 'The 8 Primary Striking Angles & Kinetic Momentum Transfer.' },
      { week: 'Week 3', topic: 'Circular Deflections, Multi-Attacker Perimeter Control & Street Applications.' }
    ],
    created_at: new Date().toISOString()
  }
];

const INITIAL_CATEGORIES = [
  {
    id: 'cat-mardini-camps',
    name: 'Mission Mardini Camps',
    description: 'Ground combat and lathi self-defense training across schools.',
    cover_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-aaryaveera-leadership',
    name: 'Aaryaveera Leadership',
    description: 'Youth character building and civilizational seminars.',
    cover_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'cat-community-sahyog',
    name: 'Community & Sahyog',
    description: 'On-ground rural assistance and counseling outreach.',
    cover_url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  }
];

const INITIAL_TESTIMONIALS = [
  {
    id: 'testi-1',
    name: 'Dr. Sunita Deshmukh',
    role: 'Principal, Modern Girls College',
    quote: 'Mission Mardini completely transformed the confidence of our 800+ students. The practical reflex drills and psychological boundary training gave them real sovereignty.',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    rating: 5,
    location: 'Nagpur, Maharashtra',
    published: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'testi-2',
    name: 'Aarav Sharma',
    role: 'Youth Coordinator',
    quote: 'Shakti Sabha provides the philosophical backbone that modern youth desperately need. From Strength, Peace is not a mere slogan, but a living practice here.',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    rating: 5,
    location: 'Indore, MP',
    published: true,
    created_at: new Date().toISOString()
  }
];

async function seed() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri, { connectTimeoutMS: 15000 });

  try {
    await client.connect();
    const db = client.db('shakti_sabha');
    console.log('✅ Connected to MongoDB database: shakti_sabha');

    // 1. COURSES
    console.log('📚 Setting up "courses" collection & indexes...');
    const coursesCol = db.collection('courses');
    await coursesCol.createIndex({ published: 1, created_at: -1 });
    for (const c of INITIAL_COURSES) {
      await coursesCol.updateOne({ id: c.id }, { $set: c }, { upsert: true });
    }
    console.log(`   ✓ Upserted ${INITIAL_COURSES.length} courses`);

    // 2. GALLERY CATEGORIES
    console.log('🖼️ Setting up "gallery_categories" collection...');
    const catCol = db.collection('gallery_categories');
    await catCol.createIndex({ created_at: -1 });
    for (const cat of INITIAL_CATEGORIES) {
      await catCol.updateOne({ id: cat.id }, { $set: cat }, { upsert: true });
    }
    console.log(`   ✓ Upserted ${INITIAL_CATEGORIES.length} gallery categories`);

    // 3. GALLERY PHOTOS
    console.log('📷 Setting up "gallery_photos" collection...');
    const photoCol = db.collection('gallery_photos');
    await photoCol.createIndex({ category_id: 1, created_at: -1 });
    console.log('   ✓ Ready for photos');

    // 4. TESTIMONIALS
    console.log('💬 Setting up "testimonials" collection...');
    const testiCol = db.collection('testimonials');
    await testiCol.createIndex({ published: 1, created_at: -1 });
    for (const t of INITIAL_TESTIMONIALS) {
      await testiCol.updateOne({ id: t.id }, { $set: t }, { upsert: true });
    }
    console.log(`   ✓ Upserted ${INITIAL_TESTIMONIALS.length} testimonials`);

    // 5. ARTICLES
    console.log('📰 Setting up "articles" collection...');
    const artCol = db.collection('articles');
    await artCol.createIndex({ published: 1, category: 1, created_at: -1 });
    console.log('   ✓ Articles collection ready');

    // 6. COUNSELLING REQUESTS
    console.log('🤝 Setting up "counselling_requests" collection...');
    const reqCol = db.collection('counselling_requests');
    await reqCol.createIndex({ status: 1, created_at: -1 });
    console.log('   ✓ Counselling requests collection ready');

    // 7. ADMIN USERS
    console.log('🔐 Setting up "admin_users" collection...');
    const userCol = db.collection('admin_users');
    await userCol.createIndex({ email: 1 }, { unique: true });
    console.log('   ✓ Admin users collection ready');

    console.log('\n🎉 ALL COLLECTIONS & INDEXES INITIALIZED SUCCESSFULLY IN MONGODB ATLAS!');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    await client.close();
    console.log('🔌 Disconnected.');
  }
}

seed();
