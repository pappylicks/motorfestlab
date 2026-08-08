const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Grand Race Meta Vehicles Directory & Class Recommendations
const GRAND_RACE_META_DB = {
  "Hypercar": [
    { name: "Pagani Imola", type: "Technical / Cornering Meta", description: "Unmatched grip and downforce through sharp chicanes; dominates technical Grand Race layouts." },
    { name: "Bugatti Chiron SS 300+", type: "Top Speed King", description: "Essential for long highway and straight-line slipstream corridors (440+ km/h V-Max)." },
    { name: "Gordon Murray Automotive T.50", type: "High-RPM Slipstream", description: "Incredible power-to-weight ratio with a high-revving V12 engine that thrives in drafting packs." },
    { name: "Koenigsegg Agera R", type: "All-Rounder", description: "Solid balance of raw top-end speed and predictable chassis stability." }
  ],
  "Street Tier 2": [
    { name: "Ferrari F40 / F50", type: "Handling & Gutter Meta", description: "Top-tier rotation and gutter-riding capabilities through tight turns without losing momentum." },
    { name: "Lamborghini Huracán LP610-4", type: "AWD Traction / Sprint", description: "Stupidly fast off-the-line launch and rock-solid wet weather stability." },
    { name: "Nissan Skyline GT-R (R34)", type: "Technical Cornering", description: "AWD traction makes it almost impossible to lose traction on technical street circuits." }
  ],
  "Street Tier 1": [
    { name: "Porsche 911 Carrera RS 2.7", type: "Overall Class Meta", description: "Exceptional power-to-weight balance and high cornering speeds." },
    { name: "Volkswagen Golf GTI 1800", type: "Agility & Acceleration", description: "Nimble hatchback chassis ideal for dodging chaos and navigating hairpins." },
    { name: "Mazda MX-5 Miata NA / RX-7", type: "Handling / Technical", description: "High corner-entry speed with ultra-responsive steering response." }
  ],
  "Racing": [
    { name: "Gordon Murray T.50s", type: "Top Speed & Acceleration", description: "Extreme V12 track variant that pulls away on every straightaway." },
    { name: "Saleen S7R / Ferrari 458 GT2", type: "Cornering Precision", description: "Smooth aerodynamic downforce platform for high-speed sweepers." },
    { name: "Lamborghini Gallardo Super Trofeo", type: "AWD Track Grip", description: "Consistent, error-forgiving handling during crowded Grand Race starts." }
  ],
  "Alpha GP": [
    { name: "Red Bull RB14 / RB18", type: "Maximum Downforce Meta", description: "Peak cornering G-forces and instant directional changes." },
    { name: "Creators SM71 / IVT Alpha Mark II", type: "All-Rounder", description: "Stable high-speed platform with high predictability on fast sweepers." }
  ],
  "Drift": [
    { name: "Hoonigan Ford Mustang Hoonicorn", type: "High-Score / Feat Meta", description: "Massive horsepower output for holding long, high-angle slides." },
    { name: "Koenigsegg Agera R Drift Edition", type: "Extreme Speed Drift", description: "High-speed drift capability for long, sweeping Summit zones." }
  ],
  "Rally / Rally Raid": [
    { name: "Porsche 959 RAID", type: "Rough Terrain Stability", description: "Absorbs jumps and heavy off-road bumps without bouncing off-track." },
    { name: "Citroën C3 Racing / Peugeot 205", type: "Acceleration & Dirt Grip", description: "High dirt traction off corner exits on dirt/gravel surfaces." }
  ]
};

// Seed Database for Explicit Meta Presets
const INDEPENDENT_CAR_DB = {
  "gordon murray automotive t.50": {
    drivetrain: "RWD",
    engineLayout: "Mid-Engine",
    sliders: {
      arbFront: "+10%", arbRear: "-10%",
      springFront: "+15%", springRear: "0%",
      damperFront: "+10%", damperRear: "-5%",
      aeroDownforce: "-15% (-3 notches)",
      brakeBalance: "48% Front / 52% Rear",
      gearRatio: "+10% (Speed)",
      steeringSensitivity: "+3 notches"
    },
    metaTips: "Mid-engine V12 layout requires Front ARB at +10% and Rear at -10% to prevent snapshot oversteer under trail braking. Hold gears manually near redline."
  },
  "porsche 911 gt3 rs": {
    drivetrain: "RWD",
    engineLayout: "Rear-Engine",
    sliders: {
      arbFront: "-15%", arbRear: "+25%",
      springFront: "-10%", springRear: "+20%",
      damperFront: "-5%", damperRear: "+15%",
      aeroDownforce: "+20% (+4 notches)",
      brakeBalance: "45% Front / 55% Rear",
      gearRatio: "+5% (Speed)",
      steeringSensitivity: "+4 notches"
    },
    metaTips: "Rear-engine weight pendulum causes off-throttle understeer. Offsetting Rear ARB to +25% forces the rear end to rotate cleanly into apexes."
  },
  "nissan skyline gt-r (r34)": {
    drivetrain: "AWD",
    engineLayout: "Front-Engine",
    sliders: {
      arbFront: "-20%", arbRear: "+30%",
      springFront: "-10%", springRear: "+15%",
      damperFront: "-10%", damperRear: "+10%",
      aeroDownforce: "0% (0 notches)",
      brakeBalance: "46% Front / 54% Rear",
      gearRatio: "-5% (Acceleration)",
      steeringSensitivity: "+3 notches"
    },
    metaTips: "Front-heavy AWD system natively understeers. Softening Front ARB to -20% and hardening Rear ARB to +30% unlocks sharp corner-entry rotation."
  }
};

// Dynamic Vehicle Physics Algorithm
function computeIndependentProSettings(carNameInput, drivetrain, engineLayout, category) {
  const carKey = carNameInput.toLowerCase().trim();

  // Recommended Assists
  const assists = {
    tractionControl: "OFF (Crucial for launch & corner exit speed)",
    abs: "ON",
    esp: "OFF",
    countersteerAssist: "OFF (Direct control)",
    transmission: "Manual (Required for powerband management)"
  };

  const matchedKey = Object.keys(INDEPENDENT_CAR_DB).find(k => carKey.includes(k) || k.includes(carKey));
  if (matchedKey && carKey.length > 3) {
    return {
      carName: carNameInput,
      drivetrain,
      engineLayout,
      category,
      sliders: INDEPENDENT_CAR_DB[matchedKey].sliders,
      assists,
      metaTips: INDEPENDENT_CAR_DB[matchedKey].metaTips,
      isExplicitMatch: true
    };
  }

  let arbF = 0, arbR = 0;
  let springF = 0, springR = 0;
  let damperF = 0, damperR = 0;
  let brakeBias = 50;
  let aero = "0% (0 notches)";
  let gears = "0%";
  let steer = "+3 notches";

  if (drivetrain === "FWD") {
    arbF = -25; arbR = +35;
    springF = -15; springR = +25;
    brakeBias = 44;
  } else if (drivetrain === "AWD") {
    arbF = -15; arbR = +20;
    springF = -5; springR = +10;
    brakeBias = 47;
  } else { // RWD
    arbF = +5; arbR = -5;
    springF = +10; springR = 0;
    brakeBias = 49;
  }

  if (engineLayout === "Rear-Engine") {
    arbF -= 10; arbR += 15;
    springR += 15;
    brakeBias -= 3;
  } else if (engineLayout === "Mid-Engine") {
    arbF += 5; arbR -= 10;
    springF += 10;
    gears = "+5% (Speed)";
  } else { // Front-Engine
    arbF -= 5; arbR += 10;
    springF -= 5;
  }

  const catLower = category.toLowerCase();
  if (catLower.includes("hypercar")) {
    aero = "-15% (-3 notches)";
    gears = "+10% (Speed)";
  } else if (catLower.includes("drift")) {
    arbF = -35; arbR = +50;
    springF = -20; springR = +40;
    brakeBias = 42;
    aero = "-25% (-5 notches)";
    gears = "-15% (Acceleration)";
  }

  const formatPct = (val) => (val >= 0 ? `+${val}%` : `${val}%`);

  return {
    carName: carNameInput,
    drivetrain,
    engineLayout,
    category,
    sliders: {
      arbFront: formatPct(arbF),
      arbRear: formatPct(arbR),
      springFront: formatPct(springF),
      springRear: formatPct(springR),
      damperFront: formatPct(damperF),
      damperRear: formatPct(damperR),
      aeroDownforce: aero,
      brakeBalance: `${brakeBias}% Front / ${100 - brakeBias}% Rear`,
      gearRatio: gears,
      steeringSensitivity: steer
    },
    assists,
    metaTips: `Custom calculated setup for a ${drivetrain} ${engineLayout} vehicle in the ${category} class. ARBs balanced specifically for weight distribution.`,
    isExplicitMatch: false
  };
}

// API Endpoints
app.get('/api/pro-settings', (req, res) => {
  const carName = req.query.car || 'Gordon Murray Automotive T.50';
  const drivetrain = req.query.drivetrain || 'RWD';
  const engineLayout = req.query.engineLayout || 'Mid-Engine';
  const category = req.query.category || 'Hypercar';

  const result = computeIndependentProSettings(carName, drivetrain, engineLayout, category);
  res.json({ data: result });
});

app.get('/api/grand-race-meta', (req, res) => {
  res.json(GRAND_RACE_META_DB);
});

app.listen(PORT, () => {
  console.log(`Motorfest Build Lab running on http://localhost:${PORT}`);
});
