const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Legend Sets & Affixes
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

// Explicit Database for Top Meta Cars across Disciplines
const TOP_META_DB = {
  // Hypercars
  "gordon murray automotive t.50": {
    carName: "Gordon Murray Automotive T.50",
    category: "Hypercar",
    racingStyle: "Grand Race High-Speed Meta",
    settings: {
      brakeBalance: "48% Front / 52% Rear",
      tractionControl: "OFF",
      abs: "ON",
      aeroDownforce: "-3 notches (High V-Max)",
      gearRatio: "+2 Speed",
      arbFrontRear: "Front: Stiff | Rear: Medium-Soft",
      steeringSensitivity: "Direct (+3)"
    },
    metaTips: "V12 high-RPM power curve excels in Grand Race slipstreams. Pair with 7x Pure + 7x Extra Pump Nitro Chemist set."
  },
  "bugatti chiron ss 300+": {
    carName: "Bugatti Chiron SS 300+",
    category: "Hypercar",
    racingStyle: "Grand Race Top Speed King",
    settings: {
      brakeBalance: "50% Front / 50% Rear",
      tractionControl: "OFF",
      abs: "ON",
      aeroDownforce: "-5 notches (Minimum Drag)",
      gearRatio: "+3 Speed",
      arbFrontRear: "Front: Medium | Rear: Stiff",
      steeringSensitivity: "Standard (0)"
    },
    metaTips: "Maximize straight-line speed by stripping aerodynamic drag. Essential for long highway Grand Race layouts."
  },
  "koenigsegg jesko": {
    carName: "Koenigsegg Jesko",
    category: "Hypercar",
    racingStyle: "Cornering & Acceleration Meta",
    settings: {
      brakeBalance: "49% Front / 51% Rear",
      tractionControl: "OFF",
      abs: "ON",
      aeroDownforce: "-1 notch",
      gearRatio: "+1 Speed",
      arbFrontRear: "Front: Medium-Stiff | Rear: Medium",
      steeringSensitivity: "High (+2)"
    },
    metaTips: "Incredible grip and top-end punch. Soften rear ARBs slightly to prevent lift-off oversteer on fast transitions."
  },

  // Street Tier 2
  "nissan skyline gt-r (r34)": {
    carName: "Nissan Skyline GT-R (R34)",
    category: "Street Tier 2",
    racingStyle: "All-Rounder Circuit Meta",
    settings: {
      brakeBalance: "46% Front / 54% Rear",
      tractionControl: "OFF",
      abs: "ON",
      aeroDownforce: "+1 notch (Grip)",
      gearRatio: "-1 Acceleration",
      arbFrontRear: "Front: Soft | Rear: Stiff",
      steeringSensitivity: "High (+3)"
    },
    metaTips: "AWD system gives huge corner-exit traction. Rear-biased brakes allow trail-braking rotation into hairpin turns."
  },
  "lamborghini huracan lp610-4": {
    carName: "Lamborghini Huracán LP610-4",
    category: "Street Tier 2",
    racingStyle: "Street Sprint Meta",
    settings: {
      brakeBalance: "48% Front / 52% Rear",
      tractionControl: "OFF",
      abs: "ON",
      aeroDownforce: "0 notches (Balanced)",
      gearRatio: "+1 Speed",
      arbFrontRear: "Front: Medium | Rear: Medium-Stiff",
      steeringSensitivity: "High (+2)"
    },
    metaTips: "Extremely balanced V10 platform. Ideal for technical urban circuits in Grand Race rounds."
  },
  "ferrari f40": {
    carName: "Ferrari F40",
    category: "Street Tier 2",
    racingStyle: "Lightweight Agility Meta",
    settings: {
      brakeBalance: "47% Front / 53% Rear",
      tractionControl: "OFF",
      abs: "ON",
      aeroDownforce: "+2 notches",
      gearRatio: "Standard",
      arbFrontRear: "Front: Soft | Rear: Medium",
      steeringSensitivity: "Direct (+4)"
    },
    metaTips: "High power-to-weight ratio. Gentle throttle modulation required out of low-speed corners."
  },

  // Street Tier 1
  "porsche 911 carrera rs 2.7": {
    carName: "Porsche 911 Carrera RS 2.7",
    category: "Street Tier 1",
    racingStyle: "Technical Track Meta",
    settings: {
      brakeBalance: "45% Front / 55% Rear",
      tractionControl: "OFF",
      abs: "ON",
      aeroDownforce: "+1 notch",
      gearRatio: "Standard",
      arbFrontRear: "Front: Soft | Rear: Stiff",
      steeringSensitivity: "High (+3)"
    },
    metaTips: "Rear-engine layout provides great drive out of corners. Keep rear ARBs stiff to prevent understeer."
  },
  "honda integra type r": {
    carName: "Honda Integra Type R",
    category: "Street Tier 1",
    racingStyle: "FWD Precision Meta",
    settings: {
      brakeBalance: "42% Front / 58% Rear",
      tractionControl: "OFF",
      abs: "ON",
      aeroDownforce: "0 notches",
      gearRatio: "-1 Acceleration",
      arbFrontRear: "Front: Soft | Rear: Very Stiff",
      steeringSensitivity: "High (+4)"
    },
    metaTips: "Stiff rear ARBs and rearward brake bias force the FWD chassis to rotate easily without scrubbing speed."
  },

  // Alpha GP
  "red bull rb14": {
    carName: "Red Bull RB14",
    category: "Alpha GP",
    racingStyle: "Maximum Downforce Circuit Meta",
    settings: {
      brakeBalance: "50% Front / 50% Rear",
      tractionControl: "OFF",
      abs: "ON",
      aeroDownforce: "+4 notches (High Grip)",
      gearRatio: "Standard",
      arbFrontRear: "Front: Stiff | Rear: Stiff",
      steeringSensitivity: "Maximum (+5)"
    },
    metaTips: "Unmatched cornering speeds. Carry extreme momentum through fast chicanes."
  }
};

// Universal Pro Settings Generator for ANY Car in Motorfest
function generateUniversalProSettings(carInput, categoryInput) {
  const car = (carInput || "Selected Vehicle").toLowerCase().trim();
  const category = (categoryInput || "Street Tier 2").trim();

  // Dynamic Rule-Based Pro Settings Algorithmic Engine
  let brakeBalance = "48% Front / 52% Rear";
  let tractionControl = "OFF";
  let abs = "ON";
  let aero = "0 notches (Balanced)";
  let gears = "Standard";
  let arbs = "Front: Medium | Rear: Medium-Stiff";
  let steering = "High (+2)";
  let style = `${category} Optimized Setup`;
  let tips = "Optimal baseline Pro Setting. Keep Traction Control OFF to prevent engine power cut on corner exit.";

  const catLower = category.toLowerCase();

  if (catLower.includes("hypercar")) {
    style = "Grand Race Hypercar Meta Setup";
    aero = "-2 notches (Favors V-Max Top Speed)";
    gears = "+1 Speed";
    brakeBalance = "49% Front / 51% Rear";
    arbs = "Front: Medium-Stiff | Rear: Medium";
    tips = "Hypercars require low aerodynamic drag to maximize slipstream speeds in Grand Races. Run with 7x Pure + 7x Extra Pump.";
  } else if (catLower.includes("street tier 2")) {
    style = "ST2 High Performance Circuit Setup";
    aero = "0 notches";
    gears = "Standard / +1 Speed";
    brakeBalance = "47% Front / 53% Rear";
    arbs = "Front: Soft-Medium | Rear: Stiff";
    tips = "Stiff rear anti-roll bars help rotate heavy AWD and RWD street cars through technical chicanes.";
  } else if (catLower.includes("street tier 1")) {
    style = "ST1 Precision Handling Setup";
    aero = "+1 notch (Cornering Grip)";
    gears = "-1 Acceleration";
    brakeBalance = "46% Front / 54% Rear";
    arbs = "Front: Soft | Rear: Medium-Stiff";
    tips = "Slightly shorter gear ratios capitalize on ST1 engine torque out of slow apexes.";
  } else if (catLower.includes("racing")) {
    style = "Circuit & Endurance Track Setup";
    aero = "+2 notches (Grip & High Downforce)";
    gears = "Standard";
    brakeBalance = "50% Front / 50% Rear";
    arbs = "Front: Stiff | Rear: Stiff";
    tips = "Race-spec chassis benefits from stiff anti-roll bars to maintain flat platform stability during aggressive trail braking.";
  } else if (catLower.includes("drift")) {
    style = "High-Score Summit Drift Setup";
    aero = "-5 notches (Minimum Downforce)";
    gears = "-2 Acceleration";
    brakeBalance = "42% Front / 58% Rear";
    tractionControl = "OFF";
    abs = "OFF";
    arbs = "Front: Soft | Rear: Maximum Stiff";
    steering = "Maximum (+5)";
    tips = "Slippery set bonus with 7x Slippery + 7x Extra Pump affixes ensures continuous high multiplier score chaining.";
  } else if (catLower.includes("rally") || catLower.includes("raid")) {
    style = "Off-Road Traction & Jump Stability Setup";
    aero = "0 notches";
    gears = "-1 Acceleration";
    brakeBalance = "45% Front / 55% Rear";
    arbs = "Front: Soft | Rear: Soft";
    steering = "High (+3)";
    tips = "Soft anti-roll bars absorb off-road bumps and keep all four tires planted over jumps without losing direction.";
  } else if (catLower.includes("alpha gp")) {
    style = "Open-Wheel Aerodynamic Meta";
    aero = "+4 notches";
    gears = "Standard";
    brakeBalance = "50% Front / 50% Rear";
    arbs = "Front: Stiff | Rear: Stiff";
    steering = "Maximum (+5)";
    tips = "Alpha GP vehicles feature instant directional turn-in response. Keep brake bias centered at 50/50.";
  } else if (catLower.includes("dragster")) {
    style = "Drag Strip Launch Meta";
    aero = "-5 notches";
    gears = "+3 Speed";
    brakeBalance = "30% Front / 70% Rear";
    arbs = "Front: Maximum Stiff | Rear: Maximum Stiff";
    tips = "Shift at perfect green-zone RPMs and activate Nitro Chemist immediately after 2nd gear engages.";
  }

  // Capitalize car name nicely
  const formattedCarName = carInput.trim().replace(/\b\w/g, l => l.toUpperCase());

  return {
    carName: formattedCarName,
    category: category,
    racingStyle: style,
    settings: {
      brakeBalance,
      tractionControl,
      abs,
      aeroDownforce: aero,
      gearRatio: gears,
      arbFrontRear: arbs,
      steeringSensitivity: steering
    },
    metaTips: tips
  };
}

let savedBuilds = [
  {
    id: 1,
    carName: 'Gordon Murray Automotive T.50',
    category: 'Hypercar',
    legendSet: 'nitro_chemist',
    affixes: { pure: 7, extra_pump: 7 },
    notes: 'Primary Grand Race Hypercar setup.'
  }
];

// API Routes
app.get('/api/metadata', (req, res) => {
  res.json({ legendSets: LEGEND_SETS, affixes: AFFIXES });
});

app.get('/api/builds', (req, res) => {
  res.json(savedBuilds);
});

// Universal Pro Settings Search API
app.get('/api/pro-settings', (req, res) => {
  const queryCar = (req.query.car || '').toLowerCase().trim();
  const category = (req.query.category || '').trim();

  // Search exact match in database
  const matchedKey = Object.keys(TOP_META_DB).find(key => queryCar === key || queryCar.includes(key) || key.includes(queryCar));

  if (matchedKey && queryCar.length > 2) {
    return res.json({
      foundExact: true,
      data: TOP_META_DB[matchedKey]
    });
  }

  // Fallback to dynamic rules engine for ANY car input
  const generatedData = generateUniversalProSettings(req.query.car, category);
  res.json({
    foundExact: false,
    data: generatedData
  });
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
