// ==========================================
// 1. DYNAMIC DATASET LOADING (From data.json)
// ==========================================
let STUDENT_DATA = [];

// Fetch the JSON data file when the website boots up
function loadDataset() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      STUDENT_DATA = data;
      console.log("Dataset successfully loaded directly from data.json!");
      
      // If the user happens to be sitting on the dashboard or stories tab already, refresh it
      if (document.getElementById("dashboardStats")) {
        computeInlineMetrics();
      }
      if (document.getElementById("platformStoriesGrid")) {
        computePlatformStories();
      }
    })
    .catch(error => console.error("Error loading data.json file:", error));
}

// Trigger the asset load immediately when app.js runs
loadDataset();

// ==========================================
// 2. VIEW ROUTING LOGIC
// ==========================================
function navigate(viewName) {
  const container = document.getElementById("main-content");

  if (viewName === "home") {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 max-w-3xl mx-auto">
        <span class="px-3 py-1 text-xs font-semibold tracking-wider text-indigo-400 uppercase rounded-full bg-indigo-500/10 border border-indigo-500/20">
          Student Insights Platform
        </span>
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Balancing Screen Time & Student Success
        </h1>
        <p class="text-lg text-slate-400 max-w-2xl">
          Explore trends linking social media usage, physical activities, and academic routines. Analyze dataset metrics or evaluate your personal habits against real student distributions.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8 text-left">
          <button onclick="navigate('dashboard')" class="group text-left rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-md hover:border-slate-700 transition-all">
            <h3 class="font-semibold text-lg group-hover:text-indigo-400 transition-colors">Wellness Dashboard &rarr;</h3>
            <p class="text-sm text-slate-400 mt-2">Log operational lifestyle profiles and review performance balances.</p>
          </button>
          <button onclick="navigate('calculator')" class="group text-left rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-md hover:border-slate-700 transition-all">
            <h3 class="font-semibold text-lg group-hover:text-indigo-400 transition-colors">Impact Calculator &rarr;</h3>
            <p class="text-sm text-slate-400 mt-2">Input digital habits to calculate screen-to-study ratio trends.</p>
          </button>
          <button onclick="navigate('stories')" class="group text-left rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-md hover:border-slate-700 transition-all">
            <h3 class="font-semibold text-lg group-hover:text-indigo-400 transition-colors">Platform Stories &rarr;</h3>
            <p class="text-sm text-slate-400 mt-2">Deep dive into custom metrics segmented by application profiles.</p>
          </button>
        </div>
      </div>
    `;
  } 
  
  else if (viewName === "dashboard") {
    container.innerHTML = `
      <div class="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Digital Wellness Dashboard
          </h1>
          <p class="text-slate-400 mt-2 font-light">Displaying statistics generated instantly from our linked data.json file.</p>
        </div>

        <div id="dashboardStats" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          </div>
      </div>
    `;
    
    // Only compute metrics if data fetch is already finished
    if (STUDENT_DATA.length > 0) {
      computeInlineMetrics();
    } else {
      document.getElementById("dashboardStats").innerHTML = `<p class="text-slate-400 animate-pulse">Loading data matrix from file...</p>`;
    }
  } 
  
  else if (viewName === "calculator") {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Screen Time Impact Calculator
          </h1>
          <p class="text-slate-400 mt-2 font-light">Evaluate your habit prediction parameters directly matching dataset behaviors.</p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-8 shadow-xl">
          <form id="impactForm" onsubmit="calculateImpact(event)" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Primary Social Platform</label>
                <select id="platform" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors">
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Main Purpose of Use</label>
                <select id="purpose" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors">
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                  <option value="Networking">Social Networking</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Daily Usage Hours</label>
                <input type="number" id="usageHours" min="0" max="24" step="0.5" required placeholder="e.g. 4.5" 
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Daily Device Unlocks</label>
                <input type="number" id="unlocks" min="0" required placeholder="e.g. 120" 
                  class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors">
              </div>
            </div>
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg">
              Analyze Profile Balance
            </button>
          </form>
        </div>

        <div id="predictionResult" class="hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 backdrop-blur-md"></div>
      </div>
    `;
  } 
  
  else if (viewName === "stories") {
    container.innerHTML = `
      <div class="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Platform Habits & Insights
          </h1>
          <p class="text-slate-400 mt-2 font-light">See how student metrics differ depending on their primary social platform choice.</p>
        </div>

        <div id="platformStoriesGrid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          </div>
      </div>
    `;
    
    // Only compute if dataset file is done loading
    if (STUDENT_DATA.length > 0) {
      computePlatformStories();
    } else {
      document.getElementById("platformStoriesGrid").innerHTML = `<p class="text-slate-400 animate-pulse">Loading charts configuration...</p>`;
    }
  }
}

// ==========================================
// 3. CORE PROCESSING LOGIC FUNCTIONS
// ==========================================

function computeInlineMetrics() {
  const totalStudents = STUDENT_DATA.length;
  if (totalStudents === 0) return;

  let totalUsage = 0;
  let totalStudy = 0;
  let totalPhysical = 0;

  STUDENT_DATA.forEach(row => {
    totalUsage += parseFloat(row[6]) || 0;   // Avg_Daily_Usage_Hours (Index 6)
    totalStudy += parseFloat(row[8]) || 0;   // Study_Hours (Index 8)
    totalPhysical += parseFloat(row[9]) || 0; // Physical_Activity_Hours (Index 9)
  });

  const avgUsage = (totalUsage / totalStudents).toFixed(1);
  const avgStudy = (totalStudy / totalStudents).toFixed(1);
  const avgPhysical = (totalPhysical / totalStudents).toFixed(1);

  // Calculate percentage width metrics assuming a max scale baseline of 12 hours
  const usagePercent = Math.min((avgUsage / 12) * 100, 100);
  const studyPercent = Math.min((avgStudy / 12) * 100, 100);

  const statsContainer = document.getElementById("dashboardStats");
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col justify-between">
        <div>
          <p class="text-sm font-medium text-slate-400">Total Filtered Sample</p>
          <p class="text-4xl font-extrabold text-indigo-400 mt-2">${totalStudents}</p>
        </div>
        <p class="text-xs text-slate-500 mt-4">Active student matrices parsed</p>
      </div>

      <div class="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-slate-400">Avg Screen Time</p>
            <p class="text-4xl font-extrabold text-amber-400 mt-2">${avgUsage} <span class="text-lg font-normal text-slate-500">hrs</span></p>
          </div>
          <span class="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md">
            High Dependency
          </span>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
          <div class="bg-amber-500 h-full rounded-full transition-all duration-500" style="width: ${usagePercent}%"></div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-slate-400">Avg Study Focus</p>
            <p class="text-4xl font-extrabold text-emerald-400 mt-2">${avgStudy} <span class="text-lg font-normal text-slate-500">hrs</span></p>
          </div>
          <span class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md">
            Optimized
          </span>
        </div>
        <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
          <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" style="width: ${studyPercent}%"></div>
        </div>
      </div>
    `;
  }
}

function computePlatformStories() {
  const platformData = {};

  STUDENT_DATA.forEach(row => {
    const platform = row[4]; // Platform index position 4
    const usage = parseFloat(row[6]) || 0; 
    const unlocks = parseInt(row[7]) || 0; 

    if (!platformData[platform]) {
      platformData[platform] = { count: 0, totalUsage: 0, totalUnlocks: 0 };
    }

    platformData[platform].count += 1;
    platformData[platform].totalUsage += usage;
    platformData[platform].totalUnlocks += unlocks;
  });

  const gridContainer = document.getElementById("platformStoriesGrid");
  if (!gridContainer) return;

  gridContainer.innerHTML = ""; 

  for (const platform in platformData) {
    const stats = platformData[platform];
    const avgUsage = (stats.totalUsage / stats.count).toFixed(1);
    const avgUnlocks = Math.round(stats.totalUnlocks / stats.count);

    gridContainer.innerHTML += `
      <div class="rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-indigo-400">${platform} Users</h3>
          <span class="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-medium">
            ${stats.count} Samples
          </span>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Avg Screen Time:</span>
            <span class="font-semibold text-slate-200">${avgUsage} hrs/day</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Avg Device Unlocks:</span>
            <span class="font-semibold text-slate-200">${avgUnlocks} times/day</span>
          </div>
        </div>
      </div>
    `;
  }
}

function calculateImpact(event) {
  event.preventDefault();

  const usage = parseFloat(document.getElementById("usageHours").value);
  const unlocks = parseInt(document.getElementById("unlocks").value);
  const resultContainer = document.getElementById("predictionResult");

  let healthScore = "Balanced Digital Profile";
  let analysisText = "Your metrics look solid! Balance ratios sit well within academic performance norms.";
  let colorClass = "text-emerald-400";

  if (usage > 6 || unlocks > 180) {
    healthScore = "High Screen Dependency Profile";
    analysisText = "Warning: Prolonged device usage correlates strongly with low physical activity trends.";
    colorClass = "text-amber-400";
  }

  resultContainer.classList.remove("hidden");
  resultContainer.innerHTML = `
    <h3 class="text-xl font-semibold mb-2">Analysis Outcome:</h3>
    <p class="text-lg font-medium ${colorClass}">${healthScore}</p>
    <p class="text-slate-400 text-sm mt-1 font-light">${analysisText}</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  navigate("home");
});