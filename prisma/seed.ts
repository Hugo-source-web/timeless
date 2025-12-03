import { PrismaClient, MediaType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create dealership (required for FK)
  const dealership = await prisma.dealership.create({
    data: {
      name: "Timeless Motors Málaga",
      slug: "timeless-motors-malaga",
      country: "Spain",
      region: "Andalucía",
      city: "Málaga",
      address: "Avenida Velocidad 911",
      phone: "+34 600 000 000",
      email: "info@timelessmotors.com",

      latitude: 36.7213,
      longitude: -4.4213
    },
  });

  // Create vehicle
  const vehicle = await prisma.vehicle.create({
    data: {
      dealershipId: dealership.id,

      slug: "porsche-911-gt3",
      brand: "Porsche",
      model: "911 GT3",
      variant: "992",
      year: 2023,

      price: 199000,
      mileageKm: 5500,
      condition: "USED",

      thumbnailUrl: "/vehicles/porsche-911-gt3/thumb.jpg", // ← ⭐ Add this line


      // Marketing
      heroTitle: "Precision Reimagined",
      heroSubtitle: "Born for the Track, Refined for the Road",
      heroTaglineTitle: "Pure Motorsport",
      heroTaglineBody:
        "A naturally aspirated masterpiece engineered to dominate any circuit.",
      heroVideoUrl:
        "/vehicles/porsche-911-gt3/videos/intro.mp4",

      // Highlight stats
      highlight_0_100_s: 3.2,
      highlight_power_kw: 375,
      highlight_power_hp: 510,
      highlight_top_speed: 318,

      // Performance
      powerTotalHp: 510,
      maxSpeedLimitedKmh: 318,
      massDinKg: 1418,

      accel_0_100_s: 3.2,
      accel_0_200_s: 10.8,

      // Engine
      engineConfiguration: "Flat-6 Naturally Aspirated",
      engineArchitecture: "Boxer 4.0L",
      engineDisplacementL: 4.0,
      enginePowerHp: 510,
      engineTorqueNm: 470,
      engineMaxRpm: 9000,

      // Dimensions
      lengthMm: 4573,
      widthMm: 1852,
      widthWithMirrorsMm: 2033,
      heightMm: 1280,
      wheelbaseMm: 2450,

      // Transmission
      transmissionType: "7-Speed PDK",
      elsdDescription:
        "Electronically controlled limited-slip differential",
      eSynchroDescription:
        "Optimized shift logic based on gear prediction",
      transmissionCooling: "Oil-to-water high-efficiency cooling",

      // Generic attributes
      bodyType: "Coupe",
      doors: 2,
      seats: 2,
      driveType: "RWD",
      fuelType: "PETROL",
      exteriorColor: "Shark Blue",
      interiorColor: "Black Leather",
      upholstery: "Alcantara",
      description:
        "The 992 GT3 is the pinnacle of Porsche’s motorsport engineering, offering razor-sharp dynamics, a 9,000 rpm redline, and unmistakable track presence.",
    },
  });

  // BMW M3 Competition (G80)
  const m3 = await prisma.vehicle.create({
    data: {
      dealershipId: dealership.id,
      slug: "bmw-m3-competition-g80",
      brand: "BMW",
      model: "M3 Competition",
      variant: "G80",
      year: 2024,

      price: 112900,
      mileageKm: 3200,
      condition: "USED",

      thumbnailUrl: "/vehicles/bmw-m3-competition-g80/thumb.jpg",

      heroTitle: "Unfiltered Precision",
      heroSubtitle: "The Icon, Sharper Than Ever",
      heroTaglineTitle: "Daily Driven Performance",
      heroTaglineBody:
        "A powerhouse sedan engineered to blur the line between comfort and pure aggression.",
      heroVideoUrl: "/vehicles/bmw-m3-competition-g80/videos/intro.mp4",

      highlight_0_100_s: 3.5,
      highlight_power_kw: 375,
      highlight_power_hp: 510,
      highlight_top_speed: 290,

      powerTotalHp: 510,
      maxSpeedLimitedKmh: 290,
      massDinKg: 1780,

      accel_0_100_s: 3.5,
      accel_0_200_s: 11.1,

      engineConfiguration: "Inline-6 Twin-Turbo",
      engineArchitecture: "3.0L S58",
      engineDisplacementL: 3.0,
      enginePowerHp: 510,
      engineTorqueNm: 650,
      engineMaxRpm: 7200,

      lengthMm: 4794,
      widthMm: 1903,
      widthWithMirrorsMm: 2087,
      heightMm: 1433,
      wheelbaseMm: 2851,

      transmissionType: "8-Speed M Steptronic",
      elsdDescription: "M active differential with torque modulation",
      eSynchroDescription: "Predictive adaptive shift logic",
      transmissionCooling: "High-capacity oil-cooling system",

      bodyType: "Sedan",
      doors: 4,
      seats: 5,
      driveType: "AWD",
      fuelType: "PETROL",
      exteriorColor: "Isle of Man Green",
      interiorColor: "Black/Kyalami Orange",
      upholstery: "Merino Leather",
      description:
        "The G80 M3 Competition combines precision engineering with relentless power, making every drive an occasion.",
    },
  });

    const rs6 = await prisma.vehicle.create({
    data: {
      dealershipId: dealership.id,
      slug: "audi-rs6-avant-c8",
      brand: "Audi",
      model: "RS6 Avant",
      variant: "C8",
      year: 2022,

      price: 158900,
      mileageKm: 8900,
      condition: "USED",

      thumbnailUrl: "/vehicles/audi-rs6-avant-c8/thumb.jpg",

      heroTitle: "Power That Carries",
      heroSubtitle: "Family Meets Fury",
      heroTaglineTitle: "Unmatched Versatility",
      heroTaglineBody:
        "A supercar disguised as a family wagon — brutal, refined, unstoppable.",
      heroVideoUrl: "/vehicles/audi-rs6-avant-c8/videos/intro.mp4",

      highlight_0_100_s: 3.6,
      highlight_power_kw: 441,
      highlight_power_hp: 600,
      highlight_top_speed: 305,

      powerTotalHp: 600,
      maxSpeedLimitedKmh: 305,
      massDinKg: 2150,

      accel_0_100_s: 3.6,
      accel_0_200_s: 12.1,

      engineConfiguration: "V8 Twin-Turbo",
      engineArchitecture: "4.0L TFSI",
      engineDisplacementL: 4.0,
      enginePowerHp: 600,
      engineTorqueNm: 800,
      engineMaxRpm: 6800,

      lengthMm: 4995,
      widthMm: 1951,
      widthWithMirrorsMm: 2110,
      heightMm: 1460,
      wheelbaseMm: 2920,

      transmissionType: "8-Speed Tiptronic",
      elsdDescription: "Quattro sport differential",
      eSynchroDescription: "Predictive shift control",
      transmissionCooling: "High-pressure oil circuit",

      bodyType: "Wagon",
      doors: 5,
      seats: 5,
      driveType: "AWD",
      fuelType: "PETROL",
      exteriorColor: "Nardo Grey",
      interiorColor: "Black",
      upholstery: "Valcona Leather",
      description:
        "The C8 RS6 Avant blends practicality with supercar acceleration, creating a brutal yet comfortable beast.",
    },
  });

    const plaid = await prisma.vehicle.create({
    data: {
      dealershipId: dealership.id,
      slug: "tesla-model-s-plaid",
      brand: "Tesla",
      model: "Model S Plaid",
      variant: "Tri-Motor",
      year: 2023,

      price: 129000,
      mileageKm: 12000,
      condition: "USED",

      thumbnailUrl: "/vehicles/tesla-model-s-plaid/thumb.jpg",

      heroTitle: "Beyond Ludicrous",
      heroSubtitle: "Acceleration Rewritten",
      heroTaglineTitle: "Electric Supremacy",
      heroTaglineBody:
        "The Model S Plaid redefines speed with a tri-motor powertrain and relentless acceleration.",
      heroVideoUrl: "/vehicles/tesla-model-s-plaid/videos/intro.mp4",

      highlight_0_100_s: 2.1,
      highlight_power_kw: 760,
      highlight_power_hp: 1020,
      highlight_top_speed: 322,

      powerTotalHp: 1020,
      maxSpeedLimitedKmh: 322,
      massDinKg: 2160,

      accel_0_100_s: 2.1,
      accel_0_200_s: 4.2,

      engineConfiguration: "Tri-Motor",
      engineArchitecture: "Permanent magnet + induction",
      engineDisplacementL: 0,
      enginePowerHp: 1020,
      engineTorqueNm: 1400,
      engineMaxRpm: 20000,

      lengthMm: 5021,
      widthMm: 1964,
      widthWithMirrorsMm: 2189,
      heightMm: 1443,
      wheelbaseMm: 2960,

      transmissionType: "Single-Speed",
      elsdDescription: "Torque vectoring at each axle",
      eSynchroDescription: "Adaptive inverter control",
      transmissionCooling: "Liquid thermal loop",

      bodyType: "Sedan",
      doors: 4,
      seats: 5,
      driveType: "AWD",
      fuelType: "ELECTRIC",
      exteriorColor: "Pearl White",
      interiorColor: "Black/White",
      upholstery: "Synthetic Leather",
      description:
        "The Plaid is an electric titan, offering unmatched straight-line performance and futuristic tech.",
    },
  });

    const rr = await prisma.vehicle.create({
    data: {
      dealershipId: dealership.id,
      slug: "range-rover-sport-p530",
      brand: "Land Rover",
      model: "Range Rover Sport",
      variant: "P530",
      year: 2023,

      price: 154500,
      mileageKm: 3400,
      condition: "USED",

      thumbnailUrl: "/vehicles/rr-sport-p530/thumb.jpg",

      heroTitle: "Effortless Authority",
      heroSubtitle: "Presence in Motion",
      heroTaglineTitle: "Luxury, Elevated",
      heroTaglineBody:
        "The P530 blends V8 power with refined off-road prowess for total command on any terrain.",
      heroVideoUrl: "/vehicles/rr-sport-p530/videos/intro.mp4",

      highlight_0_100_s: 4.3,
      highlight_power_kw: 390,
      highlight_power_hp: 530,
      highlight_top_speed: 250,

      powerTotalHp: 530,
      maxSpeedLimitedKmh: 250,
      massDinKg: 2395,

      accel_0_100_s: 4.3,
      accel_0_200_s: 14.8,

      engineConfiguration: "V8 Twin-Turbo",
      engineArchitecture: "4.4L N63 (BMW-sourced)",
      engineDisplacementL: 4.4,
      enginePowerHp: 530,
      engineTorqueNm: 750,
      engineMaxRpm: 6500,

      lengthMm: 4946,
      widthMm: 2073,
      widthWithMirrorsMm: 2209,
      heightMm: 1820,
      wheelbaseMm: 2997,

      transmissionType: "8-Speed ZF",
      elsdDescription: "Active locking rear differential",
      eSynchroDescription: "Terrain Response mode shift mapping",
      transmissionCooling: "Adaptive cooling circuit",

      bodyType: "SUV",
      doors: 5,
      seats: 5,
      driveType: "AWD",
      fuelType: "PETROL",
      exteriorColor: "Carpathian Grey",
      interiorColor: "Vintage Tan",
      upholstery: "Semi-Aniline Leather",
      description:
        "The P530 Sport is a masterclass in commanding luxury, delivering power, presence, and supreme comfort.",
    },
  });

    const c63 = await prisma.vehicle.create({
    data: {
      dealershipId: dealership.id,
      slug: "mercedes-amg-c63-e-performance",
      brand: "Mercedes-AMG",
      model: "C63 S E Performance",
      variant: "W206",
      year: 2024,

      price: 126900,
      mileageKm: 1900,
      condition: "USED",

      thumbnailUrl: "/vehicles/c63-e-performance/thumb.jpg",

      heroTitle: "Electrified Dominance",
      heroSubtitle: "Hybrid Muscle, Reimagined",
      heroTaglineTitle: "AMG’s Future",
      heroTaglineBody:
        "Technology meets aggression with the first hybrid C63 — faster, sharper, and more complex.",
      heroVideoUrl: "/vehicles/c63-e-performance/videos/intro.mp4",

      highlight_0_100_s: 3.4,
      highlight_power_kw: 500,
      highlight_power_hp: 680,
      highlight_top_speed: 280,

      powerTotalHp: 680,
      maxSpeedLimitedKmh: 280,
      massDinKg: 2160,

      accel_0_100_s: 3.4,
      accel_0_200_s: 10.9,

      engineConfiguration: "Inline-4 Turbo + Electric Motor",
      engineArchitecture: "2.0L M139 + rear e-motor",
      engineDisplacementL: 2.0,
      enginePowerHp: 680,
      engineTorqueNm: 1020,
      engineMaxRpm: 7200,

      lengthMm: 4791,
      widthMm: 1820,
      widthWithMirrorsMm: 2033,
      heightMm: 1437,
      wheelbaseMm: 2810,

      transmissionType: "9-Speed MCT",
      elsdDescription: "Rear-axle locking differential",
      eSynchroDescription: "Hybrid torque blending",
      transmissionCooling: "Dual-loop cooling",

      bodyType: "Sedan",
      doors: 4,
      seats: 5,
      driveType: "AWD",
      fuelType: "HYBRID",
      exteriorColor: "Obsidian Black",
      interiorColor: "Black/Red",
      upholstery: "AMG Nappa Leather",
      description:
        "The C63 E Performance is brutally quick and technologically advanced, representing AMG’s hybrid future.",
    },
  });

    const f296 = await prisma.vehicle.create({
    data: {
      dealershipId: dealership.id,
      slug: "ferrari-296-gtb",
      brand: "Ferrari",
      model: "296 GTB",
      variant: "PHEV",
      year: 2023,

      price: 308000,
      mileageKm: 2100,
      condition: "USED",

      thumbnailUrl: "/vehicles/ferrari-296-gtb/thumb.jpg",

      heroTitle: "A New Era of Emotion",
      heroSubtitle: "Hybrid, Reborn",
      heroTaglineTitle: "V6 Masterpiece",
      heroTaglineBody:
        "The 296 GTB introduces Ferrari’s future — lightweight, electrified, and devastatingly quick.",
      heroVideoUrl: "/vehicles/ferrari-296-gtb/videos/intro.mp4",

      highlight_0_100_s: 2.9,
      highlight_power_kw: 610,
      highlight_power_hp: 830,
      highlight_top_speed: 330,

      powerTotalHp: 830,
      maxSpeedLimitedKmh: 330,
      massDinKg: 1470,

      accel_0_100_s: 2.9,
      accel_0_200_s: 7.3,

      engineConfiguration: "V6 Twin-Turbo + e-motor",
      engineArchitecture: "2.9L",
      engineDisplacementL: 2.9,
      enginePowerHp: 830,
      engineTorqueNm: 740,
      engineMaxRpm: 8500,

      lengthMm: 4565,
      widthMm: 1958,
      widthWithMirrorsMm: 2147,
      heightMm: 1187,
      wheelbaseMm: 2600,

      transmissionType: "8-Speed DCT",
      elsdDescription: "E-Diff3 with torque vectoring",
      eSynchroDescription: "Hybrid response mapping",
      transmissionCooling: "Dual electric pumps",

      bodyType: "Coupe",
      doors: 2,
      seats: 2,
      driveType: "RWD",
      fuelType: "HYBRID",
      exteriorColor: "Rosso Corsa",
      interiorColor: "Nero",
      upholstery: "Alcantara",
      description:
        "The 296 GTB pushes Ferrari into a bold future with hybrid punch and intoxicating agility.",
    },
  });

  await prisma.mediaAsset.createMany({
    data: [
      { vehicleId: f296.id, type: MediaType.IMAGE, url: "/vehicles/ferrari-296-gtb/img1.jpg", isHero: true, sortOrder: 0 },
      { vehicleId: f296.id, type: MediaType.IMAGE, url: "/vehicles/ferrari-296-gtb/img2.jpg", isHero: true, sortOrder: 1 },

      { vehicleId: f296.id, type: MediaType.IMAGE, url: "/vehicles/ferrari-296-gtb/gallery/01.jpg", sortOrder: 2 },
      { vehicleId: f296.id, type: MediaType.IMAGE, url: "/vehicles/ferrari-296-gtb/gallery/02.jpg", sortOrder: 3 },
      { vehicleId: f296.id, type: MediaType.IMAGE, url: "/vehicles/ferrari-296-gtb/gallery/03.jpg", sortOrder: 4 },
    ],
  });

  await prisma.mediaAsset.createMany({
    data: [
      { vehicleId: c63.id, type: MediaType.IMAGE, url: "/vehicles/c63-e-performance/img1.jpg", isHero: true, sortOrder: 0 },
      { vehicleId: c63.id, type: MediaType.IMAGE, url: "/vehicles/c63-e-performance/img2.jpg", isHero: true, sortOrder: 1 },

      { vehicleId: c63.id, type: MediaType.IMAGE, url: "/vehicles/c63-e-performance/gallery/01.jpg", sortOrder: 2 },
      { vehicleId: c63.id, type: MediaType.IMAGE, url: "/vehicles/c63-e-performance/gallery/02.jpg", sortOrder: 3 },
      { vehicleId: c63.id, type: MediaType.IMAGE, url: "/vehicles/c63-e-performance/gallery/03.jpg", sortOrder: 4 },
    ],
  });


  await prisma.mediaAsset.createMany({
    data: [
      { vehicleId: rr.id, type: MediaType.IMAGE, url: "/vehicles/rr-sport-p530/img1.jpg", isHero: true, sortOrder: 0 },
      { vehicleId: rr.id, type: MediaType.IMAGE, url: "/vehicles/rr-sport-p530/img2.jpg", isHero: true, sortOrder: 1 },

      { vehicleId: rr.id, type: MediaType.IMAGE, url: "/vehicles/rr-sport-p530/gallery/01.jpg", sortOrder: 2 },
      { vehicleId: rr.id, type: MediaType.IMAGE, url: "/vehicles/rr-sport-p530/gallery/02.jpg", sortOrder: 3 },
      { vehicleId: rr.id, type: MediaType.IMAGE, url: "/vehicles/rr-sport-p530/gallery/03.jpg", sortOrder: 4 },
    ],
  });


  await prisma.mediaAsset.createMany({
    data: [
      { vehicleId: plaid.id, type: MediaType.IMAGE, url: "/vehicles/tesla-model-s-plaid/img1.jpg", isHero: true, sortOrder: 0 },
      { vehicleId: plaid.id, type: MediaType.IMAGE, url: "/vehicles/tesla-model-s-plaid/img2.jpg", isHero: true, sortOrder: 1 },

      { vehicleId: plaid.id, type: MediaType.IMAGE, url: "/vehicles/tesla-model-s-plaid/gallery/01.jpg", sortOrder: 2 },
      { vehicleId: plaid.id, type: MediaType.IMAGE, url: "/vehicles/tesla-model-s-plaid/gallery/02.jpg", sortOrder: 3 },
      { vehicleId: plaid.id, type: MediaType.IMAGE, url: "/vehicles/tesla-model-s-plaid/gallery/03.jpg", sortOrder: 4 },
    ],
  });


  await prisma.mediaAsset.createMany({
    data: [
      { vehicleId: rs6.id, type: MediaType.IMAGE, url: "/vehicles/audi-rs6-avant-c8/img1.jpg", isHero: true, sortOrder: 0 },
      { vehicleId: rs6.id, type: MediaType.IMAGE, url: "/vehicles/audi-rs6-avant-c8/img2.jpg", isHero: true, sortOrder: 1 },

      { vehicleId: rs6.id, type: MediaType.IMAGE, url: "/vehicles/audi-rs6-avant-c8/gallery/01.jpg", sortOrder: 2 },
      { vehicleId: rs6.id, type: MediaType.IMAGE, url: "/vehicles/audi-rs6-avant-c8/gallery/02.jpg", sortOrder: 3 },
      { vehicleId: rs6.id, type: MediaType.IMAGE, url: "/vehicles/audi-rs6-avant-c8/gallery/03.jpg", sortOrder: 4 },
    ],
  });


  await prisma.mediaAsset.createMany({
    data: [
      { vehicleId: m3.id, type: MediaType.IMAGE, url: "/vehicles/bmw-m3-competition-g80/img1.jpg", alt: "BMW M3 hero", isHero: true, sortOrder: 0 },
      { vehicleId: m3.id, type: MediaType.IMAGE, url: "/vehicles/bmw-m3-competition-g80/img2.jpg", alt: "BMW M3 hero 2", isHero: true, sortOrder: 1 },

      { vehicleId: m3.id, type: MediaType.IMAGE, url: "/vehicles/bmw-m3-competition-g80/gallery/01.jpg", alt: "Front", sortOrder: 2 },
      { vehicleId: m3.id, type: MediaType.IMAGE, url: "/vehicles/bmw-m3-competition-g80/gallery/02.jpg", alt: "Rear", sortOrder: 3 },
      { vehicleId: m3.id, type: MediaType.IMAGE, url: "/vehicles/bmw-m3-competition-g80/gallery/03.jpg", alt: "Interior", sortOrder: 4 },
    ],
  });

  // Add media files
  await prisma.mediaAsset.createMany({
    data: [
      {
        vehicleId: vehicle.id,
        type: MediaType.IMAGE,
        url: "/vehicles/porsche-911-gt3/img1.jpg",
        alt: "Porsche 911 GT3 hero image",
        isHero: true,
        sortOrder: 0,
      },
      {
        vehicleId: vehicle.id,
        type: MediaType.IMAGE,
        url: "/vehicles/porsche-911-gt3/img2.jpg",
        alt: "Porsche 911 GT3 second hero",
        isHero: true,   // ← NEW hero image
        sortOrder: 1,
      },
      {
        vehicleId: vehicle.id,
        type: MediaType.IMAGE,
        url: "/vehicles/porsche-911-gt3/gallery/01.jpg",
        alt: "Front view",
        sortOrder: 2,
      },
      {
        vehicleId: vehicle.id,
        type: MediaType.IMAGE,
        url: "/vehicles/porsche-911-gt3/gallery/02.jpg",
        alt: "Rear view",
        sortOrder: 3,
      },
      {
        vehicleId: vehicle.id,
        type: MediaType.IMAGE,
        url: "/vehicles/porsche-911-gt3/gallery/03.jpg",
        alt: "Interior",
        sortOrder: 4,
      },
    ],
  });

  console.log("✨ Seed completed! Visit /vehiculos/porsche-911-gt3");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
