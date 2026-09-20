import mongoose from "mongoose";
import dotenv from "dotenv";
import Destination from "./models/Destination.js";
import Company from "./models/Company.js";

dotenv.config();

const seedDestinations = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelDB";
    await mongoose.connect(mongoUri, { family: 4 });
    console.log("Connected to MongoDB for Destination seeding...");

    // Find travel partner company if exists
    const voyageCompany = await Company.findOne({ name: /Voyage/i });
    const companyId = voyageCompany ? voyageCompany._id : null;

    // Clear previous destinations to ensure fresh high-quality seed
    await Destination.deleteMany({});

    const richDestinations = [
      {
        title: "Dubai Desert Safari & Sky Luxury",
        slug: "dubai-desert-safari-sky-luxury",
        country: "United Arab Emirates",
        city: "Dubai",
        category: "Middle-East",
        badge: "Best Seller",
        durationDays: 5,
        durationNights: 4,
        pricePerPerson: 48500,
        price: 48500,
        discountPercentage: 20,
        description:
          "Experience the futuristic wonder of Dubai! From high-speed dune bashing in the golden Arabian desert to breathtaking vistas atop Burj Khalifa and twilight luxury yacht cruises along Dubai Marina.",
        images: [
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: [
          "Burj Khalifa 124th & 125th Floor Fast-Track Entry",
          "4x4 Desert Dune Bashing with BBQ Dinner & Tanoura Show",
          "Dubai Marina Luxury Sunset Catamaran Cruise",
          "Shopping Tour at Dubai Mall & Gold Souk",
          "Private Airport Transfers in Air-Conditioned SUV",
        ],
        inclusions: [
          "4 Nights Premium Hotel Stay",
          "Daily International Buffet Breakfast",
          "All Sightseeing & Entry Tickets Included",
          "Dedicated English-speaking Tour Guide",
          "UAE Tourist Visa Assistance",
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Dubai & Marina Dhow Dinner Cruise",
            desc: "Arrive at Dubai International Airport. Meet your personal chauffeur and check in to your 5-star hotel. In the evening, board a luxury illuminated dhow cruise with open buffet dinner.",
          },
          {
            day: 2,
            title: "Dubai City Tour & Burj Khalifa Observatory",
            desc: "Tour modern and historic Dubai including Palm Jumeirah, Dubai Frame, and Jumeirah Mosque. Ascend to the 124th floor of Burj Khalifa at sunset.",
          },
          {
            day: 3,
            title: "Red Dunes Desert Safari & Bedouin Camp",
            desc: "Afternoon thrill in the Lahbab Desert. Experience dune bashing, quad biking, camel rides, henna tattoos, and a gourmet Arabian BBQ dinner under the desert stars.",
          },
          {
            day: 4,
            title: "Abu Dhabi Grand Mosque & Ferrari World Excursion",
            desc: "Full-day trip to the UAE capital. Visit the breathtaking Sheikh Zayed Grand Mosque and experience thrilling rides at Ferrari World on Yas Island.",
          },
          {
            day: 5,
            title: "Souk Shopping & Departure",
            desc: "Leisure morning exploring Deira Gold Souk and Spice Souk. Private transfer to the airport for your flight home.",
          },
        ],
        ratings: { avg: 4.9, count: 142 },
        hotels: [
          {
            name: "JW Marriott Marquis Hotel Dubai",
            city: "Business Bay, Dubai",
            price: 12500,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
            amenities: ["Rooftop Pool", "Free High-Speed WiFi", "Luxury Spa", "Breakfast Included"],
          },
          {
            name: "Rove Downtown Hotel",
            city: "Downtown Dubai",
            price: 6800,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
            amenities: ["Burj Khalifa View", "Outdoor Pool", "Fitness Center"],
          },
        ],
        company: companyId,
      },
      {
        title: "Bali Tropical Island & Sacred Temples",
        slug: "bali-tropical-island-sacred-temples",
        country: "Indonesia",
        city: "Ubud & Seminyak",
        category: "Asia",
        badge: "Trending",
        durationDays: 6,
        durationNights: 5,
        pricePerPerson: 36900,
        price: 36900,
        discountPercentage: 15,
        description:
          "Immerse yourself in Bali’s magical blend of emerald rice terraces, sacred volcanic waterfalls, ancient Hindu temples, and world-class beachfront sunsets in Seminyak and Nusa Penida.",
        images: [
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: [
          "Tegalalang Rice Terraces & Famous Jungle Bali Swing",
          "Full-Day Nusa Penida Island Speedboat Tour & Kelingking Beach",
          "Uluwatu Sunset Temple & Fire Kecak Dance Performance",
          "Snorkeling with Manta Rays at Crystal Bay",
          "Traditional Balinese Massage & Aromatherapy Session",
        ],
        inclusions: [
          "5 Nights Villa & Resort Stay with Private Pool Option",
          "Daily Tropical Breakfast & Welcome Drinks",
          "Private Air-Conditioned Van with English Guide",
          "Nusa Penida Speedboat Tickets & Port Fees",
        ],
        itinerary: [
          {
            day: 1,
            title: "Welcome to Denpasar & Ubud Villa Check-in",
            desc: "Arrive at Ngurah Rai International Airport. Transfer to your jungle retreat in Ubud amidst lush tropical greenery.",
          },
          {
            day: 2,
            title: "Ubud Culture, Sacred Monkey Forest & Waterfall",
            desc: "Visit the Sacred Monkey Forest Sanctuary, marvel at the Tegenungan Waterfall, and fly high on the iconic Ubud Bali Swing.",
          },
          {
            day: 3,
            title: "Nusa Penida Island Day Cruise",
            desc: "Board a high-speed catamaran to Nusa Penida. Visit the dinosaur-shaped T-Rex cliff at Kelingking Beach, Broken Beach, and Angel's Billabong.",
          },
          {
            day: 4,
            title: "Mount Batur Sunrise Jeep & Hot Springs",
            desc: "Early morning 4WD Jeep safari over the black volcanic lava sands of Mount Batur, followed by a soak in natural volcanic hot springs.",
          },
          {
            day: 5,
            title: "Seminyak Beachfront & Uluwatu Temple Sunset",
            desc: "Transfer to coastal Seminyak. Spend the evening perched atop the 70-meter cliffs of Uluwatu Temple observing the sacred Kecak fire dance.",
          },
          {
            day: 6,
            title: "Balinese Spa & Farewell",
            desc: "Enjoy a rejuvenating 2-hour Balinese massage and artisan souvenir shopping before your departure transfer.",
          },
        ],
        ratings: { avg: 4.85, count: 98 },
        hotels: [
          {
            name: "Komaneka at Bisma Ubud",
            city: "Ubud, Bali",
            price: 9500,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
            amenities: ["Infinity Pool overlooking Valley", "Organic Breakfast", "Spa Center"],
          },
          {
            name: "Alila Seminyak Beachfront Resort",
            city: "Seminyak, Bali",
            price: 11200,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80",
            amenities: ["Direct Beach Access", "5 Swimming Pools", "Beach Bar"],
          },
        ],
        company: companyId,
      },
      {
        title: "Swiss Alps & Glacier Express Panorama",
        slug: "swiss-alps-glacier-express-panorama",
        country: "Switzerland",
        city: "Zurich, Lucerne & Interlaken",
        category: "Europe",
        badge: "Luxury Pick",
        durationDays: 7,
        durationNights: 6,
        pricePerPerson: 118000,
        price: 118000,
        discountPercentage: 10,
        description:
          "The ultimate Alpine dream: snowcapped peaks, crystal alpine lakes, scenic cogwheel mountain railways, and medieval cobblestone cities nestled in the heart of Europe.",
        images: [
          "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: [
          "Jungfraujoch 'Top of Europe' Cogwheel Train Expedition",
          "Lake Lucerne Steamboat Cruise & Mount Pilatus Cable Car",
          "Scenic GoldenPass Panoramic Train Journey",
          "Chocolate Tasting at Lindt Home of Chocolate Zurich",
          "First-Class Swiss Travel Pass with Unlimited Transit",
        ],
        inclusions: [
          "6 Nights 4-Star Alpine Hotel Stays",
          "Swiss Travel Pass (Unlimited Trains, Boats, and Public Trams)",
          "All Mountain Excursion Passes (Jungfrau & Pilatus)",
          "Daily Swiss Buffet Breakfast",
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Zurich & Old Town Stroll",
            desc: "Arrive at Zurich Airport. Explore the historic Altstadt, Bahnhofstrasse shopping avenue, and Lake Zurich.",
          },
          {
            day: 2,
            title: "Lucerne & Chapel Bridge Exploration",
            desc: "Travel to Lucerne. Walk across the iconic 14th-century Chapel Bridge and take a scenic paddle-steamer cruise across Lake Lucerne.",
          },
          {
            day: 3,
            title: "Mount Pilatus Golden Round Trip",
            desc: "Ascend the world's steepest cogwheel railway to the peak of Mount Pilatus, enjoying 360-degree views of the Swiss Alps.",
          },
          {
            day: 4,
            title: "GoldenPass Line to Interlaken & Lauterbrunnen",
            desc: "Ride the panoramic train through mountain passes to Interlaken. Visit the fairy-tale valley of 72 waterfalls in Lauterbrunnen.",
          },
          {
            day: 5,
            title: "Jungfraujoch - The Top of Europe (3,454m)",
            desc: "Board the Eiger Express tri-cable gondola and train to Jungfraujoch. Walk through the Ice Palace and stand on the Aletsch Glacier.",
          },
          {
            day: 6,
            title: "Lake Thun Boat Cruise & Bern Capital Tour",
            desc: "Cruise across turquoise Lake Thun and visit the UNESCO World Heritage capital city of Bern.",
          },
          {
            day: 7,
            title: "Zurich Departure",
            desc: "Morning train back to Zurich for departure with unforgettable alpine memories.",
          },
        ],
        ratings: { avg: 4.95, count: 76 },
        hotels: [
          {
            name: "Victoria-Jungfrau Grand Hotel & Spa",
            city: "Interlaken, Switzerland",
            price: 24000,
            rating: 5.0,
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
            amenities: ["Spa & Wellness Center", "Mountain Views", "Fine Dining"],
          },
          {
            name: "Radisson Blu Hotel Lucerne",
            city: "Lucerne, Switzerland",
            price: 14500,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80",
            amenities: ["Lake View", "Sauna & Fitness", "Near Train Station"],
          },
        ],
        company: companyId,
      },
      {
        title: "Maldives Luxury Overwater Villa Retreat",
        slug: "maldives-luxury-overwater-villa-retreat",
        country: "Maldives",
        city: "North Malé Atoll",
        category: "Beach & Islands",
        badge: "Honeymoon Favorite",
        durationDays: 5,
        durationNights: 4,
        pricePerPerson: 72000,
        price: 72000,
        discountPercentage: 25,
        description:
          "Wake up above crystalline turquoise lagoons in an iconic overwater villa. Unwind with private plunge pools, vibrant coral reef snorkeling, and romantic sunset sandbank dinners.",
        images: [
          "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: [
          "Private Overwater Villa with Glass-Floor Lagoon Viewing",
          "Return Seaplane or Luxury Speedboat Transfers Included",
          "Guided Coral Reef Snorkeling with Sea Turtles",
          "Romantic Sunset Dolphin Watching Cruise",
          "Complimentary Non-Motorized Water Sports (Kayaking, Paddleboarding)",
        ],
        inclusions: [
          "4 Nights Overwater Villa Accommodation",
          "All-Inclusive Dining (Breakfast, Lunch, 3-Course Dinner, Unlimited Cocktails)",
          "Complimentary Spa Treatment for Two",
          "Dedicated Island Host / Butler Service",
        ],
        itinerary: [
          {
            day: 1,
            title: "Seaplane Arrival over Turquoise Atolls",
            desc: "Arrive at Velana International Airport in Malé. Board a scenic seaplane offering panoramic views of coral atolls to your private island resort.",
          },
          {
            day: 2,
            title: "Lagoon Snorkeling & Marine Safari",
            desc: "Snorkel straight from your villa deck into calm waters teeming with clownfish, baby reef sharks, and sea turtles.",
          },
          {
            day: 3,
            title: "Sunset Dolphin Watching Cruise",
            desc: "Sail on a traditional wooden dhoni into the golden hour while playful spinner dolphins leap alongside the boat.",
          },
          {
            day: 4,
            title: "Private Sandbank Picnic & Stargazing",
            desc: "Spend an exclusive afternoon on an uninhabited sandbank with chef-prepared dining and evening stargazing.",
          },
          {
            day: 5,
            title: "Seaplane Farewell to Malé",
            desc: "Final floating breakfast in your private pool before seaplane transfer back to Malé for your international departure.",
          },
        ],
        ratings: { avg: 4.98, count: 189 },
        hotels: [
          {
            name: "Centara Grand Island Resort & Spa",
            city: "South Ari Atoll, Maldives",
            price: 28000,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80",
            amenities: ["All-Inclusive Dining", "Overwater Bungalows", "PADI Dive Center"],
          },
        ],
        company: companyId,
      },
      {
        title: "Thailand Island Hopper & Phuket Catamaran",
        slug: "thailand-island-hopper-phuket-catamaran",
        country: "Thailand",
        city: "Phuket & Krabi",
        category: "Asia",
        badge: "Top Value",
        durationDays: 6,
        durationNights: 5,
        pricePerPerson: 32500,
        price: 32500,
        discountPercentage: 20,
        description:
          "Explore the emerald waters of the Andaman Sea! Marvel at the limestone karst towers of Phang Nga Bay, Maya Bay, and the legendary Phi Phi Islands with vibrant nightlife in Patong.",
        images: [
          "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
        ],
        highlights: [
          "Phi Phi Islands & Maya Bay Speedboat Tour with Buffet Lunch",
          "James Bond Island Sea Canoe Adventure in Phang Nga Bay",
          "Big Buddha Viewpoint & Old Phuket Town Cultural Walk",
          "Snorkeling at Coral Island & Racha Island",
          "Sunset Dinner at Promthep Cape",
        ],
        inclusions: [
          "5 Nights 4-Star Beachfront Resort Stay",
          "Daily American & Asian Buffet Breakfast",
          "National Park Entry Fees Included",
          "Speedboat Transfers & Snorkeling Gear",
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Phuket & Patong Beach",
            desc: "Arrive at Phuket Airport. Transfer to your beachfront resort in Patong or Karon. Evening at leisure enjoying lively night markets.",
          },
          {
            day: 2,
            title: "Phi Phi Islands, Maya Bay & Pileh Lagoon",
            desc: "Cruise to legendary Maya Bay, swim in emerald Pileh Lagoon, and see wild monkeys at Monkey Beach.",
          },
          {
            day: 3,
            title: "James Bond Island & Sea Canoeing",
            desc: "Paddle through sea caves into hidden lagoons surrounded by sheer limestone cliffs in Phang Nga Bay.",
          },
          {
            day: 4,
            title: "Big Buddha, Wat Chalong & Old Phuket",
            desc: "Visit the 45-meter white marble Big Buddha, explore Wat Chalong temple, and taste authentic street food in Old Phuket Town.",
          },
          {
            day: 5,
            title: "Coral Island Catamaran & Sunset Dinner",
            desc: "Sail on a sailing catamaran to Coral Island for parasailing and swimming, followed by sunset dinner.",
          },
          {
            day: 6,
            title: "Phuket Departure",
            desc: "Relax on the beach before private transfer to Phuket Airport.",
          },
        ],
        ratings: { avg: 4.82, count: 110 },
        hotels: [
          {
            name: "Amari Phuket Beachfront Resort",
            city: "Patong Beach, Phuket",
            price: 7500,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
            amenities: ["Oceanfront Pool", "Private Jetty", "Breeze Spa"],
          },
        ],
        company: companyId,
      },
    ];

    for (const d of richDestinations) {
      const created = await Destination.create(d);
      console.log(`Created destination: ${created.title} (${created.slug})`);
    }

    console.log("Destinations seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Destination seeding error:", err);
    process.exit(1);
  }
};

seedDestinations();
