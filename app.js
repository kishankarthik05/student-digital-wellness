// ==========================================
// 1. DYNAMIC DATASET LOADING (From data.json)
// ==========================================
let STUDENT_DATA = [];

function loadDataset() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      STUDENT_DATA = data;
      console.log("Dataset successfully loaded directly from data.json!");
      
      if (document.getElementById("dashboardStats")) {
        computeInlineMetrics();
      }
      if (document.getElementById("platformStoriesGrid")) {
        computePlatformStories();
      }
    })
    .catch(error => console.error("Error loading data.json file:", error));
}

loadDataset();

// ==========================================
// 2. VIEW ROUTING LOGIC & GLOW INTERACTION
// ==========================================
function navigate(viewName) {
  const container = document.getElementById("main-content");

  if (viewName === "home") {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[65vh] text-center space-y-8 max-w-3xl mx-auto animate-fade-in">
        <span class="px-3 py-1 text-[11px] font-bold tracking-wider text-indigo-400 uppercase rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
          Student Insights Platform
        </span>
        <h1 class="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
          Balancing Screen Time & <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Student Success</span>
        </h1>
        <p class="text-base text-slate-400 max-w-2xl font-normal leading-relaxed">
          Explore trends linking social media usage, physical activities, and academic routines. Analyze dataset metrics or evaluate your personal habits against real student distributions.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-6 text-left">
          <button onclick="navigate('dashboard')" class="group rounded-xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-md hover:border-indigo-500/30 hover:bg-slate-900/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:scale-[0.98] transform transition-all duration-300">
            <h3 class="font-bold text-base text-slate-200 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
              Dashboard <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </h3>
            <p class="text-xs text-slate-400 mt-2 font-normal leading-relaxed">Log operational lifestyle profiles and review performance balances.</p>
          </button>
          <button onclick="navigate('calculator')" class="group rounded-xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-md hover:border-purple-500/30 hover:bg-slate-900/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:scale-[0.98] transform transition-all duration-300">
            <h3 class="font-bold text-base text-slate-200 group-hover:text-purple-400 transition-colors flex items-center gap-1">
              Impact Calculator <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </h3>
            <p class="text-xs text-slate-400 mt-2 font-normal leading-relaxed">Input digital habits to calculate screen-to-study ratio trends.</p>
          </button>
          <button onclick="navigate('stories')" class="group rounded-xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-md hover:border-pink-500/30 hover:bg-slate-900/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:scale-[0.98] transform transition-all duration-300">
            <h3 class="font-bold text-base text-slate-200 group-hover:text-pink-400 transition-colors flex items-center gap-1">
              Platform Stories <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </h3>
            <p class="text-xs text-slate-400 mt-2 font-normal leading-relaxed">Deep dive into custom metrics segmented by application profiles.</p>
          </button>
        </div>
      </div>
    `;
  } 
  
  else if (viewName === "dashboard") {
    container.innerHTML = `
      <div class="space-y-8 max-w-4xl mx-auto animate-fade-in">
        <div>
          <h1 class="text-3xl font-black text-white">
            Digital Wellness Dashboard
          </h1>
          <p class="text-xs text-slate-400 mt-1 font-normal">Displaying statistics generated instantly from our linked data.json file.</p>
        </div>
        <div id="dashboardStats" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          </div>
      </div>
    `;
    
    if (STUDENT_DATA.length > 0) {
      computeInlineMetrics();
    } else {
      document.getElementById("dashboardStats").innerHTML = `<p class="text-slate-400 text-sm animate-pulse">Loading data matrix from file...</p>`;
    }
  } 
  
  else if (viewName === "calculator") {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 class="text-3xl font-black text-white">
            Screen Time Impact Calculator
          </h1>
          <p class="text-xs text-slate-400 mt-1 font-normal">Evaluate your habit prediction parameters directly matching dataset behaviors.</p>
        </div>

        <div id="glowCard" class="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md p-8 shadow-2xl transition-all duration-300">
          <div id="cardGlowEffect" class="pointer-events-none absolute -inset-px opacity-0 rounded-2xl transition-opacity duration-300 bg-[radial-gradient(400px_circle_at_var(--x)_var(--y),rgba(99,102,241,0.15),transparent_80%)]"></div>
          
          <form id="impactForm" onsubmit="calculateImpact(event)" class="relative z-10 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2 tracking-wide uppercase">Your Age</label>
                <input type="number" id="userAge" min="15" max="30" value="21" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2 tracking-wide uppercase">Daily Screen Time (Hours)</label>
                <input type="number" id="usageHours" min="0" max="24" step="0.5" value="4.5" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2 tracking-wide uppercase">Daily Device Unlocks</label>
                <input type="number" id="unlocks" min="0" value="120" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-2 tracking-wide uppercase">Daily Study Focus (Hours)</label>
                <input type="number" id="studyHours" min="0" max="24" step="0.5" value="4.0" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-slate-300 mb-2 tracking-wide uppercase">Physical Activity / Sports (Hours)</label>
                <input type="number" id="physicalHours" min="0" max="24" step="0.5" value="1.5" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
            </div>
            <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold py-3 rounded-xl active:scale-[0.98] transform transition-all duration-200 shadow-xl shadow-indigo-600/10 text-sm">
              Analyze Profile Balance
            </button>
          </form>
        </div>

        <div id="predictionResult" class="hidden rounded-2xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-md animate-slide-up"></div>
      </div>
    `;
    attachGlowTracker();
  } 
  
  else if (viewName === "stories") {
    container.innerHTML = `
      <div class="space-y-8 max-w-4xl mx-auto animate-fade-in">
        <div>
          <h1 class="text-3xl font-black text-white">
            Platform Habits & Insights
          </h1>
          <p class="text-xs text-slate-400 mt-1 font-normal">See how student metrics differ depending on their primary social platform choice.</p>
        </div>
        <div id="platformStoriesGrid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          </div>
      </div>
    `;
    
    if (STUDENT_DATA.length > 0) {
      computePlatformStories();
    } else {
      document.getElementById("platformStoriesGrid").innerHTML = `<p class="text-slate-400 text-sm animate-pulse">Loading charts configuration...</p>`;
    }
  }
}

function attachGlowTracker() {
  const card = document.getElementById("glowCard");
  const glow = document.getElementById("cardGlowEffect");
  if (!card || !glow) return;
  
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    glow.style.setProperty("--x", `${e.clientX - rect.left}px`);
    glow.style.setProperty("--y", `${e.clientY - rect.top}px`);
    glow.style.opacity = "1";
  });
  
  card.addEventListener("mouseleave", () => glow.style.opacity = "0");
}

function computeInlineMetrics() {
  const totalStudents = STUDENT_DATA.length;
  if (totalStudents === 0) return;

  let totalUsage = 0;
  let totalStudy = 0;

  STUDENT_DATA.forEach(row => {
    totalUsage += parseFloat(row[6]) || 0;
    totalStudy += parseFloat(row[8]) || 0;
  });

  const avgUsage = (totalUsage / totalStudents).toFixed(1);
  const avgStudy = (totalStudy / totalStudents).toFixed(1);

  const statsContainer = document.getElementById("dashboardStats");
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="rounded-xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-md hover:border-white/10 transition-colors">
        <p class="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Filtered Sample</p>
        <p class="text-4xl font-black text-indigo-400 mt-2 tracking-tight">${totalStudents}</p>
        <p class="text-[10px] text-slate-500 mt-4 font-medium uppercase">Active pipeline matrix rows</p>
      </div>

      <div class="rounded-xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-md space-y-4 hover:border-white/10 transition-colors">
        <div>
          <p class="text-xs font-semibold text-slate-400 tracking-wider uppercase">Avg Screen Time</p>
          <p class="text-4xl font-black text-amber-400 mt-2 tracking-tight">${avgUsage} <span class="text-base font-medium text-slate-500">hrs</span></p>
        </div>
        <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-1000" style="width: ${Math.min((avgUsage / 12) * 100, 100)}%"></div>
        </div>
      </div>

      <div class="rounded-xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-md space-y-4 hover:border-white/10 transition-colors">
        <div>
          <p class="text-xs font-semibold text-slate-400 tracking-wider uppercase">Avg Study Focus</p>
          <p class="text-4xl font-black text-emerald-400 mt-2 tracking-tight">${avgStudy} <span class="text-base font-medium text-slate-500">hrs</span></p>
        </div>
        <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000" style="width: ${Math.min((avgStudy / 12) * 100, 100)}%"></div>
        </div>
      </div>
    `;
  }
}

function computePlatformStories() {
  const platformData = {};
  STUDENT_DATA.forEach(row => {
    const platform = row[4];
    if (!platformData[platform]) platformData[platform] = { count: 0, totalUsage: 0, totalUnlocks: 0 };
    platformData[platform].count += 1;
    platformData[platform].totalUsage += parseFloat(row[6]) || 0;
    platformData[platform].totalUnlocks += parseInt(row[7]) || 0;
  });

  const gridContainer = document.getElementById("platformStoriesGrid");
  if (!gridContainer) return;
  gridContainer.innerHTML = ""; 

  for (const platform in platformData) {
    const stats = platformData[platform];
    gridContainer.innerHTML += `
      <div class="rounded-xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-md hover:border-white/10 transition-all duration-300">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-base font-bold text-slate-200">${platform} Cohort</h3>
          <span class="text-[10px] bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-lg font-semibold tracking-wider uppercase">
            ${stats.count} Rows
          </span>
        </div>
        <div class="space-y-3 text-xs font-normal">
          <div class="flex justify-between">
            <span class="text-slate-400">Mean Screen Time:</span>
            <span class="font-semibold text-slate-200">${(stats.totalUsage / stats.count).toFixed(1)} hrs/day</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Mean Device Unlocks:</span>
            <span class="font-semibold text-slate-200">${Math.round(stats.totalUnlocks / stats.count)} daily</span>
          </div>
        </div>
      </div>
    `;
  }
}

function calculateImpact(event) {
  event.preventDefault();
  const age = parseFloat(document.getElementById("userAge").value);
  const usageHours = parseFloat(document.getElementById("usageHours").value);
  const unlocks = parseFloat(document.getElementById("unlocks").value);
  const studyHours = parseFloat(document.getElementById("studyHours").value);
  const physicalHours = parseFloat(document.getElementById("physicalHours").value);
  const resultContainer = document.getElementById("predictionResult");
  
  resultContainer.classList.remove("hidden");
  resultContainer.innerHTML = `<p class="text-indigo-400 animate-pulse text-xs font-semibold tracking-wider uppercase">Evaluating runtime framework parameters...</p>`;

  const requestData = { age, usageHours, unlocks, studyHours, physicalHours };

  fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      resultContainer.innerHTML = `<p class="text-red-400 text-xs font-semibold">Model Convergence Error: ${data.error}</p>`;
    } else {
      let badgeColor = "text-emerald-400";
      if (data.prediction.includes("Risk")) badgeColor = "text-amber-400";
      if (data.prediction.includes("Optimized")) badgeColor = "text-indigo-400";

      let insightsHTML = "";
      if (data.insights && data.insights.length > 0) {
        data.insights.forEach(item => {
          insightsHTML += `<li class="text-xs text-slate-400 flex items-start gap-2"><span class="text-indigo-400 font-bold">•</span> ${item}</li>`;
        });
      } else {
        insightsHTML = `<li class="text-xs text-slate-500 font-light">No parameters fall outside normal control bounds.</li>`;
      }

      resultContainer.innerHTML = `
        <div class="space-y-4">
          <div>
            <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live ML Analytics Resolution</h3>
            <p class="text-xl font-black ${badgeColor} mt-1 tracking-tight">${data.prediction}</p>
          </div>
          <div class="border-t border-white/5 pt-3">
            <h4 class="text-xs font-bold text-slate-300 mb-2">📊 Dataset Cross-Validation Context:</h4>
            <ul class="space-y-2 bg-slate-950/40 rounded-xl p-4 border border-white/5">
              ${insightsHTML}
            </ul>
          </div>
          <div class="flex justify-between items-center text-[10px] text-slate-500 pt-1 font-medium tracking-wide">
            <span>Server Channel: <span class="text-emerald-400 font-bold uppercase">Live</span></span>
            <span>Confidence Index: <span class="text-slate-300 font-bold">${data.confidence || "Verified"}</span></span>
          </div>
        </div>
      `;
    }
  })
  .catch(error => {
    console.error("Connection failed:", error);
    resultContainer.innerHTML = `<p class="text-red-400 text-xs font-semibold">Connection timed out. Ensure "python app.py" is running.</p>`;
  });
}

document.addEventListener("DOMContentLoaded", () => navigate("home"));