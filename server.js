<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Motorfest Build Lab - Independent Pro Settings</title>
  <style>
    :root {
      --bg: #0d0f12;
      --panel: #181c24;
      --border: #2a313d;
      --accent: #ff0055;
      --accent-gold: #ffb700;
      --accent-cyan: #00f0ff;
      --text: #f0f4f8;
      --text-muted: #8c9ba5;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, sans-serif; }
    body { background-color: var(--bg); color: var(--text); padding: 24px; min-height: 100vh; }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--accent);
      margin-bottom: 24px;
    }

    h1 { font-size: 1.6rem; text-transform: uppercase; letter-spacing: 2px; color: var(--accent-gold); }
    .subtitle { font-size: 0.85rem; color: var(--text-muted); }

    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }

    .card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text);
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

    input, select, textarea {
      background: #101216;
      border: 1px solid var(--border);
      color: var(--text);
      padding: 10px;
      border-radius: 4px;
      font-size: 0.9rem;
      outline: none;
    }

    input:focus, select:focus, textarea:focus { border-color: var(--accent-gold); }

    .affix-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 10px;
      align-items: center;
      background: rgba(0,0,0,0.2);
      padding: 8px;
      border-radius: 4px;
    }

    .stat-badge {
      background: rgba(255, 183, 0, 0.15);
      border: 1px solid var(--accent-gold);
      color: var(--accent-gold);
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.85rem;
      text-align: center;
    }

    button {
      background: var(--accent);
      color: #fff;
      font-weight: bold;
      padding: 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: opacity 0.2s;
    }

    button:hover { opacity: 0.9; }

    .pro-box {
      background: #11141a;
      border: 1px solid #333d4d;
      border-left: 4px solid var(--accent);
      padding: 14px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .slider-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;
      padding: 3px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .slider-row span { color: var(--text-muted); }
    .slider-val {
      font-weight: bold;
      color: var(--accent-cyan);
      font-family: monospace;
      font-size: 0.88rem;
    }

    .build-list { display: flex; flex-direction: column; gap: 12px; }
    .build-item {
      background: #11141a;
      border: 1px solid var(--border);
      border-left: 4px solid var(--accent-gold);
      padding: 14px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .build-info h3 { font-size: 1rem; color: #fff; }
    .build-info p { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }
    .build-stats { font-size: 0.8rem; color: var(--accent-gold); margin-top: 6px; }

    .btn-delete {
      background: transparent;
      color: #ff4444;
      border: 1px solid #ff4444;
      padding: 4px 8px;
      font-size: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <header>
    <div>
      <h1>Motorfest Build Lab</h1>
      <div class="subtitle">Independent Vehicle Dynamics Engine & Pro Settings</div>
    </div>
    <div class="stat-badge">Per-Vehicle Tuning Engine</div>
  </header>

  <div class="grid">
    
    <!-- LEFT: INDEPENDENT CAR CONFIG -->
    <div class="card">
      <div class="card-title">Vehicle Properties</div>

      <div class="form-group">
        <label>Vehicle Name</label>
        <input type="text" id="carName" value="Gordon Murray Automotive T.50" placeholder="Type any car name..." oninput="fetchProSettings()" />
      </div>

      <div class="form-grid-3">
        <div class="form-group">
          <label>Drivetrain</label>
          <select id="drivetrain" onchange="fetchProSettings()">
            <option value="RWD">RWD</option>
            <option value="AWD">AWD</option>
            <option value="FWD">FWD</option>
          </select>
        </div>

        <div class="form-group">
          <label>Engine Layout</label>
          <select id="engineLayout" onchange="fetchProSettings()">
            <option value="Mid-Engine">Mid-Engine</option>
            <option value="Front-Engine">Front-Engine</option>
            <option value="Rear-Engine">Rear-Engine</option>
          </select>
        </div>

        <div class="form-group">
          <label>Discipline</label>
          <select id="category" onchange="fetchProSettings()">
            <option value="Hypercar">Hypercar</option>
            <option value="Street Tier 2">Street Tier 2</option>
            <option value="Street Tier 1">Street Tier 1</option>
            <option value="Racing">Racing</option>
            <option value="Drift">Drift</option>
          </select>
        </div>
      </div>

      <!-- CALCULATED SLIDER BARS -->
      <div class="pro-box">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span id="proCarName" style="font-weight:bold; color:var(--accent-gold);">Gordon Murray Automotive T.50</span>
          <span id="matchBadge" style="font-size:0.75rem; color:var(--accent-cyan);">[CALCULATED TUNE]</span>
        </div>
        
        <div style="display:flex; flex-direction:column; gap:2px; margin-top:4px;">
          <div class="slider-row"><span>Front Anti-Roll Bar (ARB):</span> <div class="slider-val" id="barArbFront">--</div></div>
          <div class="slider-row"><span>Rear Anti-Roll Bar (ARB):</span> <div class="slider-val" id="barArbRear">--</div></div>
          <div class="slider-row"><span>Front Springs:</span> <div class="slider-val" id="barSpringFront">--</div></div>
          <div class="slider-row"><span>Rear Springs:</span> <div class="slider-val" id="barSpringRear">--</div></div>
          <div class="slider-row"><span>Front Dampers:</span> <div class="slider-val" id="barDamperFront">--</div></div>
          <div class="slider-row"><span>Rear Dampers:</span> <div class="slider-val" id="barDamperRear">--</div></div>
          <div class="slider-row"><span>Aero Downforce:</span> <div class="slider-val" id="barAero">--</div></div>
          <div class="slider-row"><span>Brake Balance:</span> <div class="slider-val" id="barBrake">--</div></div>
          <div class="slider-row"><span>Gear Ratio:</span> <div class="slider-val" id="barGears">--</div></div>
          <div class="slider-row"><span>Steering Sensitivity:</span> <div class="slider-val" id="barSteer">--</div></div>
        </div>

        <div style="font-size:0.78rem; color: var(--accent-gold); margin-top: 4px; border-top:1px dashed #222; padding-top:6px;" id="proTips">
          --
        </div>
      </div>

      <div class="form-group">
        <label>Golden Part Set Bonus</label>
        <select id="legendSet"></select>
      </div>

      <div class="card-title" style="font-size: 0.95rem; margin-top: 8px;">Affix Allocations (Max 7 Parts)</div>

      <div class="affix-row">
        <div>
          <strong style="font-size:0.85rem;">Pure</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">Nitro Power (+3.5%/part)</div>
        </div>
        <input type="number" id="affix_pure" min="0" max="7" value="7" onchange="calculateStats()" />
        <div class="stat-badge" id="calc_pure">+24.5%</div>
      </div>

      <div class="affix-row">
        <div>
          <strong style="font-size:0.85rem;">Extra Pump</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">Nitro Refill (+5.0%/part)</div>
        </div>
        <input type="number" id="affix_extra_pump" min="0" max="7" value="7" onchange="calculateStats()" />
        <div class="stat-badge" id="calc_extra_pump">+35.0%</div>
      </div>

      <div class="form-group">
        <label>Garage Notes</label>
        <textarea id="notes" rows="2" placeholder="e.g. Front ARB set to +10%, Rear ARB -10%"></textarea>
      </div>

      <button onclick="saveBuild()">Save Vehicle Build</button>
    </div>

    <!-- RIGHT: SAVED BUILDS DASHBOARD -->
    <div class="card">
      <div class="card-title">
        Saved Garage Builds
        <span id="buildCount" style="font-size:0.85rem; color: var(--text-muted);">0 Saved</span>
      </div>

      <div class="build-list" id="buildsContainer"></div>
    </div>

  </div>

  <script>
    let metaData = { legendSets: [], affixes: [] };
    let debounceTimer;

    async function init() {
      const res = await fetch('/api/metadata');
      metaData = await res.json();

      const setSelect = document.getElementById('legendSet');
      metaData.legendSets.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} (${s.multiplier})`;
        setSelect.appendChild(opt);
      });

      calculateStats();
      loadBuilds();
      fetchProSettings();
    }

    async function fetchProSettings() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const car = document.getElementById('carName').value || 'Selected Vehicle';
        const drivetrain = document.getElementById('drivetrain').value;
        const engineLayout = document.getElementById('engineLayout').value;
        const category = document.getElementById('category').value;

        const url = `/api/pro-settings?car=${encodeURIComponent(car)}&drivetrain=${encodeURIComponent(drivetrain)}&engineLayout=${encodeURIComponent(engineLayout)}&category=${encodeURIComponent(category)}`;
        const res = await fetch(url);
        const json = await res.json();
        const data = json.data;

        document.getElementById('proCarName').textContent = data.carName;
        document.getElementById('matchBadge').textContent = data.isExplicitMatch ? '[EXACT META MATCH]' : '[DYNAMIC DYNAMICS TUNE]';
        document.getElementById('matchBadge').style.color = data.isExplicitMatch ? 'var(--accent-gold)' : 'var(--accent-cyan)';

        document.getElementById('barArbFront').textContent = data.sliders.arbFront;
        document.getElementById('barArbRear').textContent = data.sliders.arbRear;
        document.getElementById('barSpringFront').textContent = data.sliders.springFront;
        document.getElementById('barSpringRear').textContent = data.sliders.springRear;
        document.getElementById('barDamperFront').textContent = data.sliders.damperFront;
        document.getElementById('barDamperRear').textContent = data.sliders.damperRear;
        document.getElementById('barAero').textContent = data.sliders.aeroDownforce;
        document.getElementById('barBrake').textContent = data.sliders.brakeBalance;
        document.getElementById('barGears').textContent = data.sliders.gearRatio;
        document.getElementById('barSteer').textContent = data.sliders.steeringSensitivity;

        document.getElementById('proTips').textContent = `Physics Note: ${data.metaTips}`;
      }, 150);
    }

    function calculateStats() {
      const pureCount = parseInt(document.getElementById('affix_pure').value) || 0;
      const pumpCount = parseInt(document.getElementById('affix_extra_pump').value) || 0;

      document.getElementById('calc_pure').textContent = `+${(pureCount * 3.5).toFixed(1)}%`;
      document.getElementById('calc_extra_pump').textContent = `+${(pumpCount * 5.0).toFixed(1)}%`;
    }

    async function loadBuilds() {
      const res = await fetch('/api/builds');
      const builds = await res.json();

      const container = document.getElementById('buildsContainer');
      document.getElementById('buildCount').textContent = `${builds.length} Saved`;
      container.innerHTML = '';

      builds.forEach(b => {
        const setName = metaData.legendSets.find(s => s.id === b.legendSet)?.name || b.legendSet;
        const purePct = ((b.affixes?.pure || 0) * 3.5).toFixed(1);
        const pumpPct = ((b.affixes?.extra_pump || 0) * 5.0).toFixed(1);

        const el = document.createElement('div');
        el.className = 'build-item';
        el.innerHTML = `
          <div class="build-info">
            <h3>${b.carName} <span style="font-size:0.75rem; color:var(--text-muted);">[${b.category}]</span></h3>
            <p><strong>Set:</strong> ${setName}</p>
            <div class="build-stats">Pure: +${purePct}% | Extra Pump: +${pumpPct}%</div>
            ${b.notes ? `<p style="margin-top:4px; font-style:italic;">"${b.notes}"</p>` : ''}
          </div>
          <button class="btn-delete" onclick="deleteBuild(${b.id})">Delete</button>
        `;
        container.appendChild(el);
      });
    }

    async function saveBuild() {
      const carName = document.getElementById('carName').value;
      const category = document.getElementById('category').value;
      const legendSet = document.getElementById('legendSet').value;
      const notes = document.getElementById('notes').value;

      const pure = parseInt(document.getElementById('affix_pure').value) || 0;
      const extra_pump = parseInt(document.getElementById('affix_extra_pump').value) || 0;

      if (!carName) {
        alert('Please enter a vehicle name.');
        return;
      }

      await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carName,
          category,
          legendSet,
          affixes: { pure, extra_pump },
          notes
        })
      });

      document.getElementById('notes').value = '';
      loadBuilds();
    }

    async function deleteBuild(id) {
      await fetch(`/api/builds/${id}`, { method: 'DELETE' });
      loadBuilds();
    }

    init();
  </script>
</body>
</html>
