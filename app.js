// ==========================================
// 1. DYNAMIC DATASET LOADING & HEALTH CHECK
// ==========================================
let STUDENT_DATA = [];
let DATASET_AVG_USAGE = 4.5;
let DATASET_AVG_STUDY = 3.5;
let DATASET_AVG_UNLOCKS = 120;

function loadDataset() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      STUDENT_DATA = data;
      console.log("Dataset successfully loaded directly from data.json!");
      
      if (STUDENT_DATA.length > 0) {
        let totalUsage = 0, totalStudy = 0, totalUnlocks = 0;
        STUDENT_DATA.forEach(row => {
          totalUsage += parseFloat(row[6]) || 0;
          totalUnlocks += parseFloat(row[7]) || 0;
          totalStudy += parseFloat(row[8]) || 0;
        });
        DATASET_AVG_USAGE = totalUsage / STUDENT_DATA.length;
        DATASET_AVG_STUDY = totalStudy / STUDENT_DATA.length;
        DATASET_AVG_UNLOCKS = totalUnlocks / STUDENT_DATA.length;
      }

      if (document.getElementById("dashboardStats")) {
        computeInlineMetrics();
      }
      if (document.getElementById("platformStoriesGrid")) {
        computePlatformStories();
      }
    })
    .catch(error => console.error("Error loading data.json file:", error));
}

function checkBackendHealth() {
  fetch('http://127.0.0.1:5000/predict', { method: 'OPTIONS' })
    .then(() => console.log("ML Engine Connection Status: ONLINE"))
    .catch(() => console.warn("ML Engine Connection Status: OFFLINE. Run python app.py to activate calculations."));
}

loadDataset();
checkBackendHealth();

// ==========================================
// 2. VIEW ROUTING LOGIC & GLOW INTERACTION
// ==========================================
function navigate(viewName) {
  const container = document.getElementById("main-content");

  if (viewName === "home") {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 md:space-y-10 max-w-4xl mx-auto animate-fade-in px-2">
        <span class="px-4 py-1.5 text-xs md:text-sm font-bold tracking-wider text-indigo-400 uppercase rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
          Student Insights Platform
        </span>
        <h1 class="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
          Balancing Screen Time & <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Student Success</span>
        </h1>
        <p class="text-sm sm:text-base md:text-xl text-slate-400 max-w-3xl font-normal leading-relaxed">
          Explore trends linking social media usage, physical activities, and academic routines. Analyze dataset metrics or evaluate your personal habits against real student distributions.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full pt-4 md:pt-8 text-left">
          <button onclick="navigate('dashboard')" class="group rounded-2xl border border-white/5 bg-slate-900/20 p-5 md:p-8 backdrop-blur-md hover:border-indigo-500/30 hover:bg-slate-900/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:scale-[0.98] transform transition-all duration-300">
            <h3 class="font-bold text-lg md:text-2xl text-slate-200 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
              Dashboard <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </h3>
            <p class="text-xs md:text-base text-slate-400 mt-2 md:mt-3 font-normal leading-relaxed">Log operational lifestyle profiles and review performance balances.</p>
          </button>
          <button onclick="navigate('calculator')" class="group rounded-2xl border border-white/5 bg-slate-900/20 p-5 md:p-8 backdrop-blur-md hover:border-purple-500/30 hover:bg-slate-900/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:scale-[0.98] transform transition-all duration-300">
            <h3 class="font-bold text-lg md:text-2xl text-slate-200 group-hover:text-purple-400 transition-colors flex items-center gap-2">
              Impact Calculator <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </h3>
            <p class="text-xs md:text-base text-slate-400 mt-2 md:mt-3 font-normal leading-relaxed">Input digital habits to calculate screen-to-study ratio trends.</p>
          </button>
          <button onclick="navigate('stories')" class="group rounded-2xl border border-white/5 bg-slate-900/20 p-5 md:p-8 backdrop-blur-md hover:border-pink-500/30 hover:bg-slate-900/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] active:scale-[0.98] transform transition-all duration-300">
            <h3 class="font-bold text-lg md:text-2xl text-slate-200 group-hover:text-pink-400 transition-colors flex items-center gap-2">
              Platform Stories <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </h3>
            <p class="text-xs md:text-base text-slate-400 mt-2 md:mt-3 font-normal leading-relaxed">Deep dive into custom metrics segmented by application profiles.</p>
          </button>
        </div>
      </div>
    `;
  } 
  
  else if (viewName === "dashboard") {
    container.innerHTML = `
      <div class="space-y-6 md:space-y-10 max-w-5xl mx-auto animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 md:pb-6">
          <div>
            <h1 class="text-2xl md:text-4xl font-black text-white tracking-tight">
              Digital Wellness Dashboard
            </h1>
            <p class="text-xs md:text-base text-slate-400 mt-1 md:mt-2 font-normal">Advanced multi-dimensional optimization trends processed directly across your database matrix rows.</p>
          </div>
          <span class="text-[10px] md:text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(99,102,241,0.1)] self-start sm:self-center">
            Linked: Verified
          </span>
        </div>
        
        <div id="dashboardStats" class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <!-- Dynamic Core KPIs Inserted Here -->
        </div>

        <div id="extendedDashboardPanels" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 opacity-0 transition-opacity duration-500">
          <!-- Populated dynamically via computeInlineMetrics -->
        </div>
        
        <div id="historyPanel" class="border-t border-white/5 pt-6 md:pt-8 hidden">
          <h2 class="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Your Recent Evaluations Log</h2>
          <div id="historyEntries" class="space-y-3 md:space-y-4"></div>
        </div>
      </div>
    `;
    
    if (STUDENT_DATA.length > 0) {
      computeInlineMetrics();
    } else {
      document.getElementById("dashboardStats").innerHTML = `<p class="text-slate-400 text-base md:text-lg animate-pulse">Loading data matrix from file...</p>`;
    }
    renderSavedHistory();
  } 
  
  else if (viewName === "calculator") {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-6 md:space-y-10 animate-fade-in">
        <div>
          <h1 class="text-2xl md:text-4xl font-black text-white">
            Screen Time Impact Calculator
          </h1>
          <p class="text-xs md:text-base text-slate-400 mt-1 md:mt-2 font-normal">Evaluate your habit prediction parameters directly matching dataset behaviors.</p>
        </div>

        <div id="glowCard" class="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md p-6 md:p-10 shadow-2xl transition-all duration-300">
          <div id="cardGlowEffect" class="pointer-events-none absolute -inset-px opacity-0 rounded-2xl transition-opacity duration-300 bg-[radial-gradient(400px_circle_at_var(--x)_var(--y),rgba(99,102,241,0.15),transparent_80%)]"></div>
          
          <form id="impactForm" onsubmit="calculateImpact(event)" class="relative z-10 space-y-5 md:space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-2 tracking-wide uppercase">Your Age</label>
                <input type="number" id="userAge" min="15" max="30" value="21" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 md:py-3 text-slate-200 text-sm md:text-base focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-2 tracking-wide uppercase">Daily Screen Time (Hours)</label>
                <input type="number" id="usageHours" min="0" max="24" step="0.5" value="4.5" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 md:py-3 text-slate-200 text-sm md:text-base focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-2 tracking-wide uppercase">Daily Device Unlocks</label>
                <input type="number" id="unlocks" min="0" value="120" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 md:py-3 text-slate-200 text-sm md:text-base focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-2 tracking-wide uppercase">Daily Study Focus (Hours)</label>
                <input type="number" id="studyHours" min="0" max="24" step="0.5" value="4.0" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 md:py-3 text-slate-200 text-sm md:text-base focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-300 mb-2 tracking-wide uppercase">Physical Activity / Sports (Hours)</label>
                <input type="number" id="physicalHours" min="0" max="24" step="0.5" value="1.5" required 
                  class="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-2.5 md:py-3 text-slate-200 text-sm md:text-base focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300">
              </div>
            </div>
            <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold py-3 md:py-4 rounded-xl active:scale-[0.98] transform transition-all duration-200 shadow-xl shadow-indigo-600/10 text-sm md:text-base">
              Analyze Profile Balance
            </button>
          </form>
        </div>

        <div id="predictionResult" class="hidden rounded-2xl border border-white/5 bg-slate-900/20 p-5 md:p-8 backdrop-blur-md animate-slide-up"></div>
      </div>
    `;
    attachGlowTracker();
  } 
  
  else if (viewName === "stories") {
    container.innerHTML = `
      <div class="space-y-6 md:space-y-10 max-w-5xl mx-auto animate-fade-in">
        <div class="border-b border-white/5 pb-4 md:pb-6">
          <h1 class="text-2xl md:text-4xl font-black text-white tracking-tight">
            Platform Habits & Data Stories
          </h1>
          <p class="text-sm md:text-base text-slate-400 mt-1 md:mt-2 font-normal">Cross-sectional behavioral breakdown mapping student distributions segmented by primary core social platform choice.</p>
        </div>
        <div id="platformStoriesGrid" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <!-- Populated dynamically via computePlatformStories -->
        </div>
      </div>
    `;
    
    if (STUDENT_DATA.length > 0) {
      computePlatformStories();
    } else {
      document.getElementById("platformStoriesGrid").innerHTML = `<p class="text-slate-400 text-base md:text-lg animate-pulse">Loading charts configuration...</p>`;
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

  let totalUsage = 0, totalStudy = 0, totalUnlocks = 0, totalPhysical = 0;
  STUDENT_DATA.forEach(row => {
    totalUsage += parseFloat(row[6]) || 0;
    totalUnlocks += parseFloat(row[7]) || 0;
    totalStudy += parseFloat(row[8]) || 0;
    totalPhysical += parseFloat(row[9]) || 0;
  });

  const avgUsage = (totalUsage / totalStudents).toFixed(1);
  const avgUnlocks = Math.round(totalUnlocks / totalStudents);
  const avgStudy = (totalStudy / totalStudents).toFixed(1);
  const avgPhysical = (totalPhysical / totalStudents).toFixed(1);

  const statsContainer = document.getElementById("dashboardStats");
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="rounded-xl border border-white/5 bg-slate-900/20 p-5 md:p-6 backdrop-blur-md hover:border-white/10 transition-colors">
        <p class="text-xs font-bold text-slate-400 tracking-wider uppercase">Dataset Cohort Sample</p>
        <p class="text-3xl md:text-5xl font-black text-indigo-400 mt-2 tracking-tight">${totalStudents}</p>
        <p class="text-[10px] md:text-xs text-slate-500 mt-4 font-bold uppercase">Total active logs parsed</p>
      </div>

      <div class="rounded-xl border border-white/5 bg-slate-900/20 p-5 md:p-6 backdrop-blur-md space-y-4 hover:border-white/10 transition-colors">
        <div>
          <p class="text-xs font-bold text-slate-400 tracking-wider uppercase">Mean Digital Exposure</p>
          <p class="text-3xl md:text-5xl font-black text-amber-400 mt-2 tracking-tight">${avgUsage} <span class="text-lg md:text-xl font-medium text-slate-500">hrs</span></p>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-1000" style="width: ${Math.min((avgUsage / 12) * 100, 100)}%"></div>
        </div>
      </div>

      <div class="rounded-xl border border-white/5 bg-slate-900/20 p-5 md:p-6 backdrop-blur-md space-y-4 hover:border-white/10 transition-colors">
        <div>
          <p class="text-xs font-bold text-slate-400 tracking-wider uppercase">Mean Academic Focus</p>
          <p class="text-3xl md:text-5xl font-black text-emerald-400 mt-2 tracking-tight">${avgStudy} <span class="text-lg md:text-xl font-medium text-slate-500">hrs</span></p>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000" style="width: ${Math.min((avgStudy / 12) * 100, 100)}%"></div>
        </div>
      </div>
    `;
  }

  const extendedContainer = document.getElementById("extendedDashboardPanels");
  if (extendedContainer) {
    extendedContainer.innerHTML = `
      <div class="rounded-xl border border-white/5 bg-slate-900/10 p-5 md:p-8 space-y-6 md:space-y-8 backdrop-blur-md">
        <div>
          <h3 class="text-lg md:text-xl font-bold text-slate-200">Interactive Lifestyle Efficiency</h3>
          <p class="text-xs md:text-sm text-slate-500 mt-1">Distribution breakdown mapping connectivity limits across inputs.</p>
        </div>
        <div class="space-y-4 text-sm md:text-base">
          <div class="bg-slate-950/40 border border-white/5 rounded-xl p-4 md:p-5 flex justify-between items-center gap-2">
            <div>
              <p class="text-slate-300 font-bold text-sm md:text-lg">Mean Distraction Rate</p>
              <p class="text-[10px] md:text-xs text-slate-500 mt-0.5">Average unlocks per day</p>
            </div>
            <span class="text-xl md:text-2xl font-black text-slate-200 whitespace-nowrap">${avgUnlocks} <span class="text-xs md:text-sm font-normal text-slate-500">times</span></span>
          </div>
          <div class="bg-slate-950/40 border border-white/5 rounded-xl p-4 md:p-5 flex justify-between items-center gap-2">
            <div>
              <p class="text-slate-300 font-bold text-sm md:text-lg">Daily Activity Buffer</p>
              <p class="text-[10px] md:text-xs text-slate-500 mt-0.5">Outdoor recovery timeline</p>
            </div>
            <span class="text-xl md:text-2xl font-black text-purple-400 whitespace-nowrap">${avgPhysical} <span class="text-xs md:text-sm font-normal text-slate-500">hrs</span></span>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-white/5 bg-slate-900/10 p-5 md:p-8 space-y-4 backdrop-blur-md">
        <div>
          <h3 class="text-lg md:text-xl font-bold text-slate-200">Academic Focus Distortion Index</h3>
          <p class="text-xs md:text-sm text-slate-500 mt-1">Direct comparison between study dedication timelines and application usage trends.</p>
        </div>
        <div class="bg-slate-950/60 border border-white/5 rounded-xl p-4 md:p-5 space-y-4">
          <div class="flex justify-between text-sm md:text-base text-slate-300 font-medium">
            <span>Overhead Proportion</span>
            <span class="font-bold text-indigo-400 text-base md:text-lg">${((avgUsage / (parseFloat(avgStudy) || 1)) * 100).toFixed(0)}%</span>
          </div>
          <div class="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full" style="width: ${Math.min((avgUsage / (parseFloat(avgStudy) || 1)) * 25, 100)}%"></div>
          </div>
          <p class="text-[11px] md:text-xs text-slate-500 font-normal leading-relaxed pt-1">
            An overhead score exceeding 100% indicates that screen operations outpace focused study blocks within target sample distributions.
          </p>
        </div>
      </div>
    `;
    extendedContainer.classList.remove("opacity-0");
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

  const platformThemes = {
    'Instagram': { border: 'hover:border-pink-500/40', glow: 'shadow-pink-500/5', accent: 'text-pink-400', badge: 'bg-pink-500/10 border-pink-500/20 text-pink-300', bar: 'from-pink-500 to-rose-500' },
    'TikTok': { border: 'hover:border-teal-400/40', glow: 'shadow-teal-400/5', accent: 'text-teal-400', badge: 'bg-teal-500/10 border-teal-500/20 text-teal-300', bar: 'from-teal-400 to-cyan-500' },
    'YouTube': { border: 'hover:border-red-500/40', glow: 'shadow-red-500/5', accent: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20 text-red-300', bar: 'from-red-500 to-orange-500' },
    'Snapchat': { border: 'hover:border-amber-400/40', glow: 'shadow-amber-400/5', accent: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-300', bar: 'from-amber-400 to-yellow-500' },
    'Facebook': { border: 'hover:border-blue-500/40', glow: 'shadow-blue-500/5', accent: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20 text-blue-300', bar: 'from-blue-500 to-indigo-500' }
  };

  const defaultTheme = { border: 'hover:border-indigo-500/40', glow: 'shadow-indigo-500/5', accent: 'text-indigo-400', badge: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300', bar: 'from-indigo-500 to-purple-500' };

  for (const platform in platformData) {
    const stats = platformData[platform];
    const theme = platformThemes[platform] || defaultTheme;
    const avgUsage = (stats.totalUsage / stats.count).toFixed(1);
    const avgUnlocks = Math.round(stats.totalUnlocks / stats.count);
    const usagePercent = Math.min((parseFloat(avgUsage) / 8) * 100, 100);

    gridContainer.innerHTML += `
      <div class="rounded-2xl border border-white/5 bg-slate-900/20 p-6 md:p-8 shadow-xl backdrop-blur-md transform transition-all duration-300 ${theme.border} ${theme.glow} hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:bg-slate-900/30">
        <div class="flex justify-between items-center mb-5 gap-2">
          <h3 class="text-xl md:text-2xl font-black text-slate-100 tracking-tight">${platform}</h3>
          <span class="text-[10px] md:text-xs px-2.5 py-1 rounded-lg font-bold tracking-wider uppercase border ${theme.badge} whitespace-nowrap">
            ${stats.count} Rows
          </span>
        </div>
        
        <div class="space-y-5 text-sm md:text-base font-normal">
          <div class="space-y-2">
            <div class="flex justify-between text-slate-400">
              <span>Mean Exposure:</span>
              <span class="font-black ${theme.accent}">${avgUsage} hrs/day</span>
            </div>
            <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
              <div class="bg-gradient-to-r h-full rounded-full transition-all duration-1000 ${theme.bar}" style="width: ${usagePercent}%"></div>
            </div>
          </div>
          
          <div class="flex justify-between items-center bg-slate-950/40 border border-white/5 rounded-xl p-3 md:p-4">
            <span class="text-slate-400 text-xs md:text-sm">Distraction Rate:</span>
            <span class="font-bold text-slate-200 text-xs md:text-sm text-right">${avgUnlocks} <span class="text-[10px] text-slate-500 font-normal">unlocks/day</span></span>
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
  resultContainer.innerHTML = `<p class="text-indigo-400 animate-pulse text-xs font-semibold tracking-wider uppercase">Evaluating parameters...</p>`;

  const requestData = { age, usageHours, unlocks, studyHours, physicalHours };

  fetch('https://student-wellness-backend.onrender.com/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      resultContainer.innerHTML = `<p class="text-red-400 text-sm font-semibold">Model Error: ${data.error}</p>`;
    } else {
      let badgeColor = "text-emerald-400";
      let statusBg = "bg-emerald-500/10 border-emerald-500/20";
      if (data.prediction.includes("Risk")) {
        badgeColor = "text-amber-400";
        statusBg = "bg-amber-500/10 border-amber-500/20";
      }
      if (data.prediction.includes("Optimized")) {
        badgeColor = "text-indigo-400";
        statusBg = "bg-indigo-500/10 border-indigo-500/20";
      }

      const screenDeviation = ((usageHours - DATASET_AVG_USAGE) / DATASET_AVG_USAGE * 100).toFixed(0);
      const studyDeviation = ((studyHours - DATASET_AVG_STUDY) / DATASET_AVG_STUDY * 100).toFixed(0);
      
      let screenComparisonText = screenDeviation >= 0 
        ? `<span class="text-amber-400 font-bold">${screenDeviation}% higher</span> than baseline`
        : `<span class="text-emerald-400 font-bold">${Math.abs(screenDeviation)}% lower</span> than baseline`;

      let studyComparisonText = studyDeviation >= 0
        ? `<span class="text-emerald-400 font-bold">${studyDeviation}% higher</span> than standard filters`
        : `<span class="text-amber-400 font-bold">${Math.abs(studyDeviation)}% lower</span> than standard filters`;

      let tacticalStrategies = [];
      if (usageHours > 5.5) tacticalStrategies.push("Implement a hard screen lock ceiling past 5 hours of total daily integration.");
      if (unlocks > 140) tacticalStrategies.push("Move secondary communication portals outside direct workspace visual fields.");
      if (studyHours < 3.0) tacticalStrategies.push("Structure immediate study sequences in focused 25-minute sprints.");
      if (physicalHours < 1.0) tacticalStrategies.push("Introduce a baseline physical activity recovery buffer.");
      if (tacticalStrategies.length === 0) tacticalStrategies.push("Maintain current resource management settings. Calibrated successfully.");

      let strategiesHTML = "";
      tacticalStrategies.forEach(strat => {
        strategiesHTML += `<li class="text-xs md:text-sm text-slate-300 flex items-start gap-2"><span class="text-purple-400 font-black">➔</span> ${strat}</li>`;
      });

      let insightsHTML = "";
      if (data.insights && data.insights.length > 0) {
        data.insights.forEach(item => {
          insightsHTML += `<li class="text-xs md:text-sm text-slate-400 flex items-start gap-2"><span class="text-indigo-400 font-bold">•</span> ${item}</li>`;
        });
      } else {
        insightsHTML = `<li class="text-xs md:text-sm text-slate-500 font-light">No anomalous markers flagged.</li>`;
      }

      resultContainer.innerHTML = `
        <div class="space-y-6 max-w-3xl mx-auto">
          <div class="p-5 rounded-2xl border ${statusBg}">
            <h3 class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prescriptive Diagnostics Report</h3>
            <p class="text-2xl md:text-3xl font-black ${badgeColor} mt-1 tracking-tight">${data.prediction}</p>
          </div>
          
          <div class="space-y-3">
            <h4 class="text-sm md:text-base font-bold text-slate-200">📈 Relative Dataset Deviations:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="bg-slate-950/40 border border-white/5 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
                <p class="font-bold text-slate-300 mb-1 text-xs md:text-sm">Digital Exposure Analysis</p>
                Daily screen exposure is ${screenComparisonText} (${DATASET_AVG_USAGE.toFixed(1)}h avg).
              </div>
              <div class="bg-slate-950/40 border border-white/5 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
                <p class="font-bold text-slate-300 mb-1 text-xs md:text-sm">Academic Endurance Rating</p>
                Structured focus benchmarks at ${studyComparisonText} (${DATASET_AVG_STUDY.toFixed(1)}h avg).
              </div>
            </div>
          </div>

          <div class="border-t border-white/5 pt-4">
            <h4 class="text-xs md:text-sm font-bold text-slate-200 mb-2">📊 Parameter Insights:</h4>
            <ul class="space-y-2 bg-slate-950/40 rounded-xl p-4 border border-white/5">
              ${insightsHTML}
            </ul>
          </div>

          <div class="border-t border-white/5 pt-4">
            <h4 class="text-xs md:text-sm font-bold text-purple-400 mb-2 uppercase tracking-wider">🎯 Prescriptive Blueprint:</h4>
            <ul class="space-y-2 bg-slate-900/40 border border-purple-500/10 rounded-xl p-4">
              ${strategiesHTML}
            </ul>
          </div>

          <div class="flex justify-between items-center text-[10px] md:text-xs text-slate-500 pt-2 border-t border-white/5 font-medium tracking-wide">
            <span>Server Channel: <span class="text-emerald-400 font-bold">Live</span></span>
            <span>Convergence: <span class="text-slate-300">${data.confidence || "Verified"}</span></span>
          </div>
        </div>
      `;

      const logEntry = {
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        prediction: data.prediction,
        badgeColor: badgeColor,
        usage: usageHours,
        study: studyHours
      };
      let historyLogs = JSON.parse(localStorage.getItem('wellness_history')) || [];
      historyLogs.unshift(logEntry);
      localStorage.setItem('wellness_history', JSON.stringify(historyLogs.slice(0, 5)));
    }
  })
  .catch(error => {
    console.error("Connection failed:", error);
    resultContainer.innerHTML = `<p class="text-red-400 text-sm font-semibold">Connection failed. Check backend server logs.</p>`;
  });
}

function renderSavedHistory() {
  const panel = document.getElementById("historyPanel");
  const container = document.getElementById("historyEntries");
  if (!panel || !container) return;

  const logs = JSON.parse(localStorage.getItem('wellness_history')) || [];
  if (logs.length === 0) {
    panel.classList.add("hidden");
    return;
  }

  panel.classList.remove("hidden");
  container.innerHTML = "";

  logs.forEach(log => {
    container.innerHTML += `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-white/5 bg-slate-900/10 p-4 text-xs md:text-sm">
        <div>
          <span class="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">${log.date}</span>
          <p class="text-slate-300 mt-0.5 font-medium">Metrics: <span class="text-slate-400">${log.usage}h screen</span> / <span class="text-slate-400">${log.study}h study</span></p>
        </div>
        <div class="font-black ${log.badgeColor} text-sm md:text-base sm:text-right">${log.prediction}</div>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => navigate("home"));