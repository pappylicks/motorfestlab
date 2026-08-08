const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for legend sets & affix caps in The Crew Motorfest
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

// Sample saved builds for initial load
let savedBuilds = [
  {
    id: 1,
    carName: 'Bugatti Chiron SS 300+',
    category: 'Hypercar',
    legendSet: 'nitro_chemist',
    affixes: { pure: 7, extra_pump: 7 }, // 7 parts max per vehicle
    notes: 'Meta setup for Grand Race speed sections. Prioritize pure power on straights.'
  },
  {
    id: 2,
    carName: 'Nissan Skyline GT-R (R34)',
    category: 'Street Tier 2',
    legendSet: 'score_breaker',
    affixes: { slippery: 7, extra_pump: 7 },
    notes: 'Primary drift and score feat vehicle for Summit events.'
  }
];

// API Routes
app.get('/api/metadata', (req, res) => {
  res.json({ legendSets: LEGEND_SETS, affixes: AFFIXES });
});

app.get('/api/builds', (req, res) => {
  res.json(savedBuilds);
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