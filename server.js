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

// Universal Precise Pro Settings Slider Bar Engine
function generateUniversalProSettings(carInput, categoryInput) {
  const car = (carInput || "Selected Vehicle").trim();
  const cat = (categoryInput || "Street Tier 2").toLowerCase();

  // Slider Bars Structure with exact percentage shifts and notches
  let sliders = {
    arbFront: "0%",
    arbRear: "0%",
    springFront: "0%",
    springRear: "0%",
    damperFront: "0%",
    damperRear: "0%",
    aeroDownforce: "0 notches",
    brakeBalance: "50% Front / 50% Rear",
    brakePressure: "100%",
    gearRatio: "0%",
    steeringSensitivity: "+2 notches",
    tractionControl: "OFF",
    abs: "ON"
  };

  let style = `${categoryInput} Grand Race Setup`;
  let tips = "Optimal baseline Pro Setting. Keep Traction Control OFF to maintain power on corner exit.";

  if (cat.includes("hypercar")) {
    style = "Grand Race Hypercar V-Max Setup";
    sliders.arbFront = "+10%";
    sliders.arbRear = "-10%";
    sliders.springFront = "+15%";
    sliders.springRear = "0%";
    sliders.damperFront = "+10%";
    sliders.damperRear = "-5%";
    sliders.aeroDownforce = "-15% (-3 notches)";
    sliders.brakeBalance = "48% Front / 52% Rear";
    sliders.gearRatio = "+10% (Speed)";
    sliders.steeringSensitivity = "+3 notches";
    tips = "ARBs set to Front +10% and Rear -10% eliminate high-speed sway while preserving 450+ km/h straight-line slipstream speed.";
  } else if (cat.includes("street tier 2") || cat.includes("st2")) {
    style = "Street Tier 2 Technical Circuit Setup";
    sliders.arbFront = "-10%";
    sliders.arbRear = "+15%";
    sliders.springFront = "-5%";
    sliders.springRear = "+10%";
    sliders.damperFront = "0%";
    sliders.damperRear = "+10%";
    sliders.aeroDownforce = "0% (0 notches)";
    sliders.brakeBalance = "47% Front / 53% Rear";
    sliders.gearRatio = "+5% (Speed)";
    sliders.steeringSensitivity = "+3 notches";
    tips = "Rear ARB set to +15% forces heavy AWD/RWD platforms to rotate sharply into hairpins without scrubbing momentum.";
  } else if (cat.includes("street tier 1") || cat.includes("st1")) {
    style = "Street Tier 1 Precision Handling Setup";
    sliders.arbFront = "-15%";
    sliders.arbRear = "+20%";
    sliders.springFront = "-10%";
    sliders.springRear = "+15%";
    sliders.damperFront = "-5%";
    sliders.damperRear = "+10%";
    sliders.aeroDownforce = "+10% (+2 notches)";
    sliders.brakeBalance = "46% Front / 54% Rear";
    sliders.gearRatio = "-5% (Acceleration)";
    sliders.steeringSensitivity = "+4 notches";
    tips = "Setting Front ARB to -15% and Rear ARB to +20% solves FWD/RWD understeer completely.";
  } else if (cat.includes("racing")) {
    style = "Touring & Track Race Setup";
    sliders.arbFront = "+20%";
    sliders.arbRear = "+10%";
    sliders.springFront = "+25%";
    sliders.springRear = "+20%";
    sliders.damperFront = "+20%";
    sliders.damperRear = "+15%";
    sliders.aeroDownforce = "+20% (+4 notches)";
    sliders.brakeBalance = "50% Front / 50% Rear";
    sliders.gearRatio = "0%";
    sliders.steeringSensitivity = "+4 notches";
    tips = "Stiff spring and damper bars keep the aerodynamic platform flat under heavy trail-braking.";
  } else if (cat.includes("drift")) {
    style = "High-Score Summit Drift Setup";
    sliders.arbFront = "-30%";
    sliders.arbRear = "+50%";
    sliders.springFront = "-20%";
    sliders.springRear = "+40%";
    sliders.damperFront = "-15%";
    sliders.damperRear = "+30%";
    sliders.aeroDownforce = "-25% (-5 notches)";
    sliders.brakeBalance = "42% Front / 58% Rear";
    sliders.gearRatio = "-15% (Acceleration)";
    sliders.steeringSensitivity = "+5 notches";
    sliders.abs = "OFF";
    tips = "Rear ARB at +50% and Front ARB at -30% produces instant slide initiation for maximum Summit points.";
  } else if (cat.includes("rally") || cat.includes("raid")) {
    style = "Off-Road Bump Absorption Setup";
    sliders.arbFront = "-25%";
    sliders.arbRear = "-20%";
    sliders.springFront = "-30%";
    sliders.springRear = "-25%";
    sliders.damperFront = "-20%";
    sliders.damperRear = "-20%";
    sliders.aeroDownforce = "0%";
    sliders.brakeBalance = "45% Front / 55% Rear";
    sliders.gearRatio = "-10% (Acceleration)";
    sliders.steeringSensitivity = "+3 notches";
    tips = "Softening all ARB and spring sliders allows the suspension to absorb jump landings without flipping.";
  } else if (cat.includes("alpha gp")) {
    style = "Open-Wheel Aerodynamic Meta Setup";
    sliders.arbFront = "+30%";
    sliders.arbRear = "+25%";
    sliders.springFront = "+35%";
    sliders.springRear = "+30%";
    sliders.damperFront = "+30%";
    sliders.damperRear = "+25%";
    sliders.aeroDownforce = "+25% (+5 notches)";
    sliders.brakeBalance = "50% Front / 50% Rear";
    sliders.gearRatio = "0%";
    sliders.steeringSensitivity = "+5 notches";
    tips = "Maximum stiffness across all suspension bars delivers extreme cornering Gs.";
  }

  return {
    carName: car.replace(/\b\w/g, l => l.toUpperCase()),
    category: categoryInput,
    racingStyle: style,
    sliders,
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
    notes: 'Front ARB +10%, Rear ARB -10%, Aero -15%.'
  }
];

app.get('/api/metadata', (req, res) => {
  res.json({ legendSets: LEGEND_SETS, affixes: AFFIXES });
});

app.get('/api/builds', (req, res) => {
  res.json(savedBuilds);
});

app.get('/api/pro-settings', (req, res) => {
  const car = req.query.car || 'Gordon Murray Automotive T.50';
  const category = req.query.category || 'Hypercar';
  
  const data = generateUniversalProSettings(car, category);
  res.json({ data });
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
