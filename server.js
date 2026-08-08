const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const LEGEND_SETS = [
  { id: 'nitro_chemist', name: 'Nitro Chemist', multiplier: '2x Nitro Duration', category: 'General' },
  { id: 'score_breaker', name: 'Score Breaker', multiplier: '2x Skill Points', category: 'Feats' },
  { id: 'fame_magnet', name: 'Fame Magnet', multiplier: '2x Follower Points', category: 'Progression' },
  { id: 'loot_digger', name: 'Loot Digger', multiplier: '2x Part Drops', category: 'Farming' },
  { id: 'clean_driver', name: 'Clean Driver', multiplier: '2x Clean Driving Points', category: 'Feats' }
];

const AFFIXES = [
  { id: 'pure', name: 'Pure (Nitro Power)', maxPerPart: 3.5, unit: '%' },
  { id: 'extra_pump', name: 'Extra Pump (Nitro Refill)', maxPerPart: 5.0, unit: '%' },
  { id: 'frenetic', name: 'Frenetic (Nitro Acceleration)', maxPerPart: 4.0, unit: '%' },
  { id: 'ventilated', name: 'Ventilated (Nitro Cooldown)', maxPerPart: 4.5, unit: '%' },
  { id: 'resourceful', name: 'Resourceful (Slipstream Refill)', maxPerPart: 6.0, unit: '%' },
  { id: 'slippery', name: 'Slippery (Drift Score/Multiplier)', maxPerPart: 5.0, unit: '%' },
  { id: 'gold_digger', name: 'Gold Digger (Bucks Booster)', maxPerPart: 3.0, unit: '%' }
];

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
      steeringSensitivity: "+3 notches",
      tractionControl: "OFF", abs: "ON"
    },
    metaTips: "High-revving V12 mid-engine layout. Mid-engine rear stability requires Front ARB at +10% and Rear at -10% to prevent snapshot oversteer under high-speed trail braking."
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
      steeringSensitivity: "+4 notches",
      tractionControl: "OFF", abs: "ON"
    },
    metaTips: "Rear-engine weight bias causes off-throttle understeer. Offsetting Rear ARB to +25% forces the rear pendulum to rotate the car into apexes cleanly."
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
      steeringSensitivity: "+3 notches",
      tractionControl: "OFF", abs: "ON"
    },
    metaTips: "Front-heavy ATTESA AWD setup natively understeers. Softening Front ARB to -20% and hardening Rear ARB to +30% unlocks sharp corner-entry rotation."
  }
};

// Dynamic Car Property Analyzer for any custom vehicle typed by the user
function computeIndependentProSettings(carNameInput, drivetrain, engineLayout, category) {
  const carKey = carNameInput.toLowerCase().trim();

  // Return explicit preset if stored in DB
  const matchedKey = Object.keys(INDEPENDENT_CAR_DB).find(k => carKey.includes(k) || k.includes(carKey));
  if (matchedKey && carKey.length > 3) {
    return {
      carName: carNameInput,
      drivetrain,
      engineLayout,
      category,
      sliders: INDEPENDENT_CAR_DB[matchedKey].sliders,
      metaTips: INDEPENDENT_CAR_DB[matchedKey].metaTips,
      isExplicitMatch: true
    };
  }

  // Calculate dynamic slider percentages based on unique car properties
  let arbF = 0, arbR = 0;
  let springF = 0, springR = 0;
  let damperF = 0, damperR = 0;
  let brakeBias = 50;
  let aero = "0% (0 notches)";
  let gears = "0%";
  let steer = "+3 notches";

  // Drivetrain Bias Logic
  if (drivetrain === "FWD") {
    arbF = -25; arbR = +35;
    springF = -15; springR = +25;
    brakeBias = 44; // Rear biased to rotate FWD
  } else if (drivetrain === "AWD") {
    arbF = -15; arbR = +20;
    springF = -5; springR = +10;
    brakeBias = 47;
  } else { // RWD
    arbF = +5; arbR = -5;
    springF = +10; springR = 0;
    brakeBias = 49;
  }

  // Engine Placement Physics Adjustments
  if (engineLayout === "Rear-Engine") {
    arbF -= 10; arbR += 15; // Fight front push from light nose
    springR += 15;
    brakeBias -= 3;
  } else if (engineLayout === "Mid-Engine") {
    arbF += 5; arbR -= 10; // Tame mid-engine snap oversteer
    springF += 10;
    gears = "+5% (Speed)";
  } else { // Front-Engine
    arbF -= 5; arbR += 10;
    springF -= 5;
  }

  // Category Fine-Tuning Overlay
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
      steeringSensitivity: steer,
      tractionControl: "OFF",
      abs: "ON"
    },
    metaTips: `Custom calculated setup for a ${drivetrain} ${engineLayout} vehicle in the ${category} class. ARBs configured to balance weight distribution.`,
    isExplicitMatch: false
  };
}

let savedBuilds = [];

app.get('/api/metadata', (req, res) => {
  res.json({ legendSets: LEGEND_SETS, affixes: AFFIXES });
});

app.get('/api/builds', (req, res) => {
  res.json(savedBuilds);
});

app.get('/api/pro-settings', (req, res) => {
  const carName = req.query.car || 'Gordon Murray Automotive T.50';
  const drivetrain = req.query.drivetrain || 'RWD';
  const engineLayout = req.query.engineLayout || 'Mid-Engine';
  const category = req.query.category || 'Hypercar';

  const result = computeIndependentProSettings(carName, drivetrain, engineLayout, category);
  res.json({ data: result });
});

app.post('/api/builds', (req, res) => {
  const { carName, category, legendSet, affixes, notes } = req.body;
  if (!carName || !category) {
    return res.status(400).json({ error: 'Car Name and Category are required.' });
  }

  const newBuild = {
    id: Date.now(),
    carName,
    category,
    legendSet: legendSet || 'None',
    affixes: affixes || {},
    notes: notes || ''
  };

  savedBuilds.push(newBuild);
  res.status(201).json(newBuild);
});

app.delete('/api/builds/:id', (req, res) => {
  const buildId = parseInt(req.params.id, 10);
  savedBuilds = savedBuilds.filter(b => b.id !== buildId);
  res.json({ success: true, message: 'Build deleted successfully.' });
});

app.listen(PORT, () => {
  console.log(`Motorfest Build Lab running on http://localhost:${PORT}`);
});
