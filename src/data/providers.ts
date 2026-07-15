import type { Provider } from './types';

/**
 * Mock provider catalogue for the Taskadar demo.
 *
 * In production this data would come from a backend/database. The image URLs
 * are PLACEHOLDERS (seeded Picsum photos) — they are meant to be swapped for
 * real, category-appropriate photography later. Every provider carries a `tags`
 * array that the mock AI matcher scans against a natural-language query.
 */

const img = (seed: string) => `https://picsum.photos/seed/taskadar-${seed}/640/440`;

export const PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'Marco Rossi',
    tagline: 'Licensed plumber • same-day callouts',
    category: 'Plumbing',
    tags: [
      'plumber', 'plumbing', 'leak', 'leaking', 'sink', 'tap', 'faucet', 'pipe',
      'drain', 'toilet', 'water', 'boiler', 'emergency', 'burst', 'blocked',
    ],
    description:
      'Fully licensed and insured plumber with 12 years of experience. I fix leaks, unblock drains, install taps and handle emergency callouts across the city — usually same day.',
    priceRange: '$60 - $180',
    rating: 4.9,
    reviewCount: 214,
    image: img('marco'),
    location: 'Downtown • 2.1 mi away',
    responseTime: 'Replies in ~10 min',
    verified: true,
    availability: ['today', 'tomorrow', 'weekend'],
    services: [
      { id: 'p1s1', title: 'Leak diagnosis & repair', price: 90, unit: 'flat', description: 'Locate and fix a leaking tap, pipe or joint.' },
      { id: 'p1s2', title: 'Drain unblocking', price: 120, unit: 'flat', description: 'Clear blocked sinks, showers or toilets.' },
      { id: 'p1s3', title: 'Emergency callout', price: 60, unit: 'per hour', description: 'Rapid response for burst pipes & floods.' },
    ],
    reviews: [
      { id: 'p1r1', author: 'Elena V.', rating: 5, text: 'Fixed my kitchen leak in under an hour. Tidy and friendly.', date: '3 days ago' },
      { id: 'p1r2', author: 'Tom H.', rating: 5, text: 'Came out on a Sunday for a burst pipe. Absolute lifesaver.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'p2',
    name: 'Sugar & Spice Bakery',
    tagline: 'Custom cakes for every occasion',
    category: 'Baking & Catering',
    tags: [
      'cake', 'cakes', 'birthday', 'baker', 'bakery', 'baking', 'dessert',
      'cupcakes', 'pastry', 'wedding', 'celebration', 'party', 'catering',
      'delivery', 'delivered', 'sweet', 'custom',
    ],
    description:
      'A boutique home bakery specialising in custom celebration cakes, cupcakes and dessert tables. We deliver across the metro area — including next-day for birthdays!',
    priceRange: '$35 - $250',
    rating: 4.8,
    reviewCount: 168,
    image: img('bakery'),
    location: 'Riverside • 3.4 mi away',
    responseTime: 'Replies in ~25 min',
    verified: true,
    availability: ['tomorrow', 'weekend'],
    services: [
      { id: 'p2s1', title: 'Custom birthday cake', price: 65, unit: 'flat', description: '2-layer cake, any theme. Next-day available.' },
      { id: 'p2s2', title: 'Dozen cupcakes', price: 35, unit: 'flat', description: 'Freshly baked, custom flavours & toppings.' },
      { id: 'p2s3', title: 'Local delivery', price: 12, unit: 'flat', description: 'Doorstep delivery within 10 miles.' },
    ],
    reviews: [
      { id: 'p2r1', author: 'Priya S.', rating: 5, text: 'Ordered a unicorn cake for my daughter — it was stunning and delicious.', date: '1 week ago' },
      { id: 'p2r2', author: 'Daniel M.', rating: 4, text: 'Great cake, delivered on time. Would order again.', date: '1 month ago' },
    ],
  },
  {
    id: 'p3',
    name: 'Aisha Bello',
    tagline: 'Maths & science tutor (KS3–A-Level)',
    category: 'Tutoring',
    tags: [
      'tutor', 'tutoring', 'maths', 'math', 'science', 'physics', 'chemistry',
      'lessons', 'teacher', 'exam', 'revision', 'homework', 'study', 'gcse',
      'student', 'learn', 'education',
    ],
    description:
      'Qualified secondary teacher offering one-to-one maths and science tutoring, online or in person. I build confidence and exam technique with tailored lesson plans.',
    priceRange: '$30 - $45',
    rating: 5.0,
    reviewCount: 92,
    image: img('tutor'),
    location: 'Online + Northside',
    responseTime: 'Replies in ~1 hr',
    verified: true,
    availability: ['today', 'tomorrow', 'weekend'],
    services: [
      { id: 'p3s1', title: '1-to-1 maths lesson', price: 35, unit: 'per hour', description: 'Personalised, curriculum-aligned sessions.' },
      { id: 'p3s2', title: 'Exam intensive (3 hrs)', price: 90, unit: 'flat', description: 'Focused pre-exam revision block.' },
    ],
    reviews: [
      { id: 'p3r1', author: 'Grace O.', rating: 5, text: 'My son went from a C to an A. Aisha is patient and brilliant.', date: '5 days ago' },
      { id: 'p3r2', author: 'Karl B.', rating: 5, text: 'Clear explanations and great with nervous students.', date: '3 weeks ago' },
    ],
  },
  {
    id: 'p4',
    name: 'Jordan Fitness',
    tagline: 'Certified personal trainer',
    category: 'Personal Training',
    tags: [
      'trainer', 'personal training', 'fitness', 'gym', 'workout', 'exercise',
      'weight', 'strength', 'coach', 'weekend', 'health', 'training', 'run',
      'cardio', 'muscle', 'nutrition',
    ],
    description:
      'NASM-certified personal trainer helping busy people get strong and stay consistent. Sessions at your home, a local park or the gym — including weekends.',
    priceRange: '$40 - $70',
    rating: 4.7,
    reviewCount: 131,
    image: img('trainer'),
    location: 'Citywide (mobile)',
    responseTime: 'Replies in ~30 min',
    verified: true,
    availability: ['today', 'weekend'],
    services: [
      { id: 'p4s1', title: 'PT session', price: 50, unit: 'per session', description: '60 minutes, tailored to your goals.' },
      { id: 'p4s2', title: '5-session pack', price: 210, unit: 'flat', description: 'Save when you commit to a block.' },
      { id: 'p4s3', title: 'Nutrition plan', price: 40, unit: 'flat', description: 'Custom weekly meal & macro guide.' },
    ],
    reviews: [
      { id: 'p4r1', author: 'Sam T.', rating: 5, text: 'Weekend sessions fit my schedule perfectly. Down 6kg!', date: '4 days ago' },
      { id: 'p4r2', author: 'Nadia F.', rating: 4, text: 'Tough but encouraging. Really knows their stuff.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'p5',
    name: 'SparkleHome Cleaning',
    tagline: 'Trusted home & deep cleaning',
    category: 'Cleaning',
    tags: [
      'clean', 'cleaner', 'cleaning', 'house', 'home', 'deep clean', 'tidy',
      'housekeeping', 'maid', 'domestic', 'end of tenancy', 'move out',
      'apartment', 'weekly', 'vacuum',
    ],
    description:
      'Reliable, background-checked cleaners for regular, one-off and end-of-tenancy cleans. We bring our own eco-friendly supplies and love a spotless finish.',
    priceRange: '$25 - $40',
    rating: 4.6,
    reviewCount: 203,
    image: img('cleaning'),
    location: 'Metro-wide',
    responseTime: 'Replies in ~45 min',
    verified: true,
    availability: ['tomorrow', 'weekend'],
    services: [
      { id: 'p5s1', title: 'Standard home clean', price: 30, unit: 'per hour', description: 'Kitchens, bathrooms, floors & dusting.' },
      { id: 'p5s2', title: 'Deep clean', price: 40, unit: 'per hour', description: 'Top-to-bottom, inside appliances included.' },
      { id: 'p5s3', title: 'End of tenancy', price: 220, unit: 'flat', description: 'Get your deposit back, guaranteed.' },
    ],
    reviews: [
      { id: 'p5r1', author: 'Louise P.', rating: 5, text: 'Spotless! They got my flat ready for viewing in no time.', date: '1 week ago' },
      { id: 'p5r2', author: 'Ahmed K.', rating: 4, text: 'Friendly team, great value for a weekly clean.', date: '1 month ago' },
    ],
  },
  {
    id: 'p6',
    name: 'Happy Paws Pet Care',
    tagline: 'Dog walking & pet sitting',
    category: 'Pet Sitting',
    tags: [
      'pet', 'dog', 'cat', 'sitting', 'sitter', 'walking', 'walker', 'animal',
      'boarding', 'daycare', 'puppy', 'feeding', 'vacation', 'holiday',
      'overnight', 'pets',
    ],
    description:
      'Insured, animal-loving pet sitters and dog walkers. Daily walks, drop-in visits, feeding and overnight boarding so your furry friends are never lonely.',
    priceRange: '$15 - $45',
    rating: 4.9,
    reviewCount: 87,
    image: img('pets'),
    location: 'Greenfield & nearby',
    responseTime: 'Replies in ~20 min',
    verified: true,
    availability: ['today', 'tomorrow', 'weekend'],
    services: [
      { id: 'p6s1', title: '30-min dog walk', price: 15, unit: 'per walk', description: 'Solo or small-group neighbourhood walks.' },
      { id: 'p6s2', title: 'Drop-in visit', price: 20, unit: 'per visit', description: 'Feeding, playtime & a quick check-in.' },
      { id: 'p6s3', title: 'Overnight boarding', price: 45, unit: 'per night', description: 'Cosy home stay with 24/7 care.' },
    ],
    reviews: [
      { id: 'p6r1', author: 'Rachel D.', rating: 5, text: 'Sent photos of every walk. My dog adores them!', date: '6 days ago' },
      { id: 'p6r2', author: 'Marcus L.', rating: 5, text: 'Boarded my cat for a week — came home happy and calm.', date: '3 weeks ago' },
    ],
  },
  {
    id: 'p7',
    name: 'Lena Fields Photography',
    tagline: 'Portrait, event & product photos',
    category: 'Photography',
    tags: [
      'photo', 'photos', 'photography', 'photographer', 'portrait', 'headshot',
      'event', 'wedding', 'product', 'shoot', 'camera', 'pictures', 'family',
      'session', 'editing',
    ],
    description:
      'Award-winning photographer for portraits, family sessions, events and product shoots. Natural, warm imagery with fast turnaround and beautifully edited galleries.',
    priceRange: '$120 - $600',
    rating: 4.8,
    reviewCount: 64,
    image: img('photo'),
    location: 'Studio + on-location',
    responseTime: 'Replies in ~2 hrs',
    verified: true,
    availability: ['tomorrow', 'weekend'],
    services: [
      { id: 'p7s1', title: 'Portrait session', price: 150, unit: 'flat', description: '1 hour, 20 edited photos delivered.' },
      { id: 'p7s2', title: 'Event coverage', price: 120, unit: 'per hour', description: 'Candid + posed, full gallery included.' },
      { id: 'p7s3', title: 'Product photography', price: 200, unit: 'flat', description: 'Clean studio shots for your store.' },
    ],
    reviews: [
      { id: 'p7r1', author: 'Hannah W.', rating: 5, text: 'Our family photos are gorgeous. Lena made everyone relax.', date: '2 weeks ago' },
      { id: 'p7r2', author: 'Owen C.', rating: 4, text: 'Great product shots that boosted my listings.', date: '1 month ago' },
    ],
  },
  {
    id: 'p8',
    name: 'FixIt Dan',
    tagline: 'Handyman & odd jobs',
    category: 'Handyman',
    tags: [
      'handyman', 'repair', 'fix', 'furniture', 'assembly', 'flatpack', 'mount',
      'shelf', 'shelves', 'tv', 'hang', 'paint', 'diy', 'odd jobs', 'door',
      'install', 'drill',
    ],
    description:
      'Your friendly neighbourhood handyman. Flat-pack assembly, TV mounting, shelving, minor repairs and all those odd jobs on your to-do list — done right.',
    priceRange: '$35 - $60',
    rating: 4.7,
    reviewCount: 176,
    image: img('handyman'),
    location: 'Southbank • 1.8 mi away',
    responseTime: 'Replies in ~15 min',
    verified: true,
    availability: ['today', 'tomorrow'],
    services: [
      { id: 'p8s1', title: 'Flat-pack assembly', price: 40, unit: 'per hour', description: 'Wardrobes, beds, desks — built fast.' },
      { id: 'p8s2', title: 'TV wall mounting', price: 60, unit: 'flat', description: 'Securely mounted with cables tidied.' },
      { id: 'p8s3', title: 'General repairs', price: 35, unit: 'per hour', description: 'Doors, shelves, fixtures & more.' },
    ],
    reviews: [
      { id: 'p8r1', author: 'Fiona G.', rating: 5, text: 'Built my entire home office in two hours. Legend.', date: '4 days ago' },
      { id: 'p8r2', author: 'Peter N.', rating: 4, text: 'Prompt and reasonably priced. Recommended.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'p9',
    name: 'Bloom & Grow Gardens',
    tagline: 'Garden care & landscaping',
    category: 'Gardening',
    tags: [
      'garden', 'gardening', 'gardener', 'lawn', 'mowing', 'hedge', 'trimming',
      'landscaping', 'planting', 'weeding', 'outdoor', 'yard', 'trees', 'tidy',
      'maintenance',
    ],
    description:
      'From a quick lawn mow to a full seasonal makeover, we keep your outdoor space healthy and beautiful. Mowing, hedge trimming, planting and green-waste removal.',
    priceRange: '$30 - $55',
    rating: 4.6,
    reviewCount: 58,
    image: img('garden'),
    location: 'Suburbs • mobile',
    responseTime: 'Replies in ~1 hr',
    verified: false,
    availability: ['tomorrow', 'weekend'],
    services: [
      { id: 'p9s1', title: 'Lawn mowing & edging', price: 30, unit: 'flat', description: 'Up to a medium-sized garden.' },
      { id: 'p9s2', title: 'Hedge trimming', price: 40, unit: 'per hour', description: 'Neat, shaped hedges & clippings removed.' },
      { id: 'p9s3', title: 'Seasonal tidy-up', price: 55, unit: 'per hour', description: 'Weeding, pruning & bed refresh.' },
    ],
    reviews: [
      { id: 'p9r1', author: 'Chris A.', rating: 5, text: 'Transformed our overgrown yard in a single afternoon.', date: '1 week ago' },
      { id: 'p9r2', author: 'Beth R.', rating: 4, text: 'Reliable and tidy. Booking again for spring.', date: '1 month ago' },
    ],
  },
  {
    id: 'p10',
    name: 'Volt Bros Electrical',
    tagline: 'Certified electricians',
    category: 'Electrician',
    tags: [
      'electric', 'electrician', 'electrical', 'wiring', 'socket', 'outlet',
      'light', 'lighting', 'fuse', 'power', 'switch', 'fitting', 'fault',
      'install', 'safety', 'rewire',
    ],
    description:
      'Certified electricians for installations, fault-finding and safety checks. Sockets, lighting, fuse boards and full rewires — safe, tidy and up to code.',
    priceRange: '$70 - $150',
    rating: 4.9,
    reviewCount: 119,
    image: img('electric'),
    location: 'Downtown • 2.6 mi away',
    responseTime: 'Replies in ~35 min',
    verified: true,
    availability: ['today', 'tomorrow'],
    services: [
      { id: 'p10s1', title: 'Socket / light install', price: 70, unit: 'flat', description: 'Add or replace sockets & fixtures.' },
      { id: 'p10s2', title: 'Fault finding', price: 90, unit: 'per hour', description: 'Diagnose & fix electrical faults.' },
      { id: 'p10s3', title: 'Safety inspection', price: 150, unit: 'flat', description: 'Full property electrical safety report.' },
    ],
    reviews: [
      { id: 'p10r1', author: 'Yusuf E.', rating: 5, text: 'Sorted a tripping circuit fast and explained everything.', date: '5 days ago' },
      { id: 'p10r2', author: 'Marta S.', rating: 5, text: 'Installed new kitchen lighting beautifully.', date: '3 weeks ago' },
    ],
  },
  {
    id: 'p11',
    name: 'Studio Mane',
    tagline: 'Mobile hair & beauty',
    category: 'Beauty & Hair',
    tags: [
      'hair', 'haircut', 'barber', 'beauty', 'makeup', 'stylist', 'blowdry',
      'colour', 'color', 'nails', 'wedding', 'bridal', 'mobile', 'salon',
      'style', 'grooming',
    ],
    description:
      'A mobile hair & beauty studio that comes to you. Cuts, colour, blow-dries, bridal styling and makeup — perfect for events or a treat at home.',
    priceRange: '$25 - $120',
    rating: 4.8,
    reviewCount: 74,
    image: img('beauty'),
    location: 'Mobile • citywide',
    responseTime: 'Replies in ~40 min',
    verified: true,
    availability: ['tomorrow', 'weekend'],
    services: [
      { id: 'p11s1', title: 'Cut & blow-dry', price: 45, unit: 'flat', description: 'Wash, cut and style at your home.' },
      { id: 'p11s2', title: 'Bridal hair & makeup', price: 120, unit: 'flat', description: 'Trial + wedding-day glam.' },
      { id: 'p11s3', title: 'Kids cut', price: 25, unit: 'flat', description: 'Patient, fuss-free trims.' },
    ],
    reviews: [
      { id: 'p11r1', author: 'Isla M.', rating: 5, text: 'Did my bridal hair — I felt incredible. Thank you!', date: '1 week ago' },
      { id: 'p11r2', author: 'Dev P.', rating: 4, text: 'Convenient home visit and a great cut.', date: '2 weeks ago' },
    ],
  },
  {
    id: 'p12',
    name: 'SwiftMove Removals',
    tagline: 'Man & van + moving help',
    category: 'Moving',
    tags: [
      'move', 'moving', 'removal', 'removals', 'van', 'man and van', 'furniture',
      'transport', 'delivery', 'house move', 'relocate', 'packing', 'lifting',
      'boxes', 'haul',
    ],
    description:
      'Friendly, careful man-and-van and moving crews for house moves, single-item deliveries and clearances. We lift, wrap and transport so you don’t have to.',
    priceRange: '$45 - $90',
    rating: 4.5,
    reviewCount: 141,
    image: img('moving'),
    location: 'Regional • mobile',
    responseTime: 'Replies in ~50 min',
    verified: false,
    availability: ['today', 'tomorrow', 'weekend'],
    services: [
      { id: 'p12s1', title: 'Man & van (1 hr)', price: 45, unit: 'per hour', description: 'One mover + van, you help load.' },
      { id: 'p12s2', title: 'Two-person crew', price: 90, unit: 'per hour', description: 'Full lifting & loading service.' },
      { id: 'p12s3', title: 'Single item delivery', price: 55, unit: 'flat', description: 'Sofa, fridge or wardrobe moved.' },
    ],
    reviews: [
      { id: 'p12r1', author: 'Sophie L.', rating: 5, text: 'Moved my flat in 3 hours, nothing damaged. Great guys.', date: '1 week ago' },
      { id: 'p12r2', author: 'Raj K.', rating: 4, text: 'On time and careful with my furniture.', date: '1 month ago' },
    ],
  },
];

/** Distinct category list for chips / filters. */
export const CATEGORIES = Array.from(new Set(PROVIDERS.map((p) => p.category)));
