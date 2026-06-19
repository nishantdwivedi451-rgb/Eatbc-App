import { useState, useEffect } from "react";
import { ChevronRight, Utensils, Activity, Target, Share2, Mail, CheckCircle2, Droplet, Flame, LogOut, TrendingDown, Loader2, AlertCircle, Sunrise, Apple, Cookie, Moon, HeartPulse, Sparkles, Stethoscope } from "lucide-react";

/* ---------------- storage ---------------- */
const sget = async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sset = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} };
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return String(h); };
const hashNum = (s) => { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return Math.abs(h); };

const GREEN = "#1DAA61";
const WEEK = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

/* ---------------- questions ---------------- */
const Q = [
  { k: "name", label: "What should we call you?", type: "text", ph: "e.g. Nishant" },
  { k: "age", label: "Your age", type: "number", ph: "e.g. 32" },
  { k: "sex", label: "Sex", type: "pick", opts: ["Male", "Female", "Other"] },
  { k: "height", label: "Your height", type: "height" },
  { k: "weight", label: "Current weight (kg)", type: "number", ph: "e.g. 78" },
  { k: "target", label: "Target weight (kg)", type: "number", ph: "e.g. 72" },
  { k: "goal", label: "Your primary goal", type: "pick", opts: ["Weight loss", "Muscle gain", "Maintain weight", "General fitness"] },
  { k: "condition", label: "Any medical condition we should plan around?", type: "pick", opts: ["None", "Diabetes / pre-diabetes", "High BP (hypertension)", "High cholesterol", "Thyroid (hypothyroid)", "Other"] },
  { k: "diet", label: "Your food preference", type: "pick", opts: ["Pure veg", "Egg + veg", "Non-veg", "Vegan", "Jain"] },
  { k: "region", label: "Which cuisines do you enjoy?", sub: "Pick one or more — your plan mixes from these.", type: "multi", opts: ["North Indian", "South Indian", "East Indian", "West Indian"] },
  { k: "activity", label: "Your daily activity level", type: "pick", opts: ["Mostly desk job", "On feet / moderate", "Physically active"] },
  { k: "exercise", label: "Exercise routine", type: "pick", opts: ["None", "Walks / light", "Gym 3x week", "Gym 5x+ / sports"] },
  { k: "meals", label: "Meals per day you prefer", type: "pick", opts: ["3 meals", "3 meals + 2 snacks", "5-6 small meals"] },
  { k: "cooktime", label: "How do meals usually happen?", type: "pick", opts: ["Minimal cooking (10-15 min)", "Moderate (30 min)", "I enjoy cooking", "I get cooking help", "I order online mostly"] },
  { k: "avoid", label: "Allergies / foods to avoid", sub: "Optional — skip if none.", type: "text", ph: "e.g. lactose, peanuts" },
];

/* ---------------- food database (offline engine) ----------------
   flags: egg, meat, fish, dairy, jain (jain-safe), simple (quick/orderable)
   slot:  b=breakfast ms=mid-morning l=lunch d=dinner es=evening bt=bedtime
   reg:   n s e w all   |   t: lowgi protein fiber fried sugary highsalt goitrogen
------------------------------------------------------------------- */
const DB = [
  // ---- breakfast ----
  { n: "Vegetable poha", c: 300, slot: ["b"], reg: ["w","all"], simple: 1, t: ["fiber"] },
  { n: "Besan chilla with mint chutney", c: 280, slot: ["b"], reg: ["n","all"], jain: 1, simple: 1, t: ["protein","lowgi"] },
  { n: "Moong dal cheela", c: 260, slot: ["b"], reg: ["n","all"], jain: 1, simple: 1, t: ["protein","lowgi"] },
  { n: "Oats with milk, banana & seeds", c: 290, slot: ["b"], reg: ["all"], dairy: 1, simple: 1, t: ["fiber","lowgi"] },
  { n: "Oats with almond milk & fruit", c: 280, slot: ["b"], reg: ["all"], jain: 1, simple: 1, t: ["fiber","lowgi"] },
  { n: "Vegetable upma", c: 300, slot: ["b"], reg: ["s","all"], simple: 1, t: ["fiber"] },
  { n: "Idli (3) with coconut chutney", c: 280, slot: ["b"], reg: ["s"], jain: 1, simple: 1, t: ["lowgi"] },
  { n: "Idli (3) with sambar", c: 290, slot: ["b"], reg: ["s"], simple: 1, t: ["fiber","lowgi"] },
  { n: "Masala dosa with chutney", c: 420, slot: ["b"], reg: ["s"], t: ["fried"] },
  { n: "Plain dosa with sambar", c: 350, slot: ["b"], reg: ["s"], simple: 1, t: [] },
  { n: "Pesarattu (moong dosa)", c: 300, slot: ["b"], reg: ["s"], simple: 1, t: ["protein","lowgi"] },
  { n: "Ragi dosa", c: 280, slot: ["b"], reg: ["s"], simple: 1, t: ["lowgi","fiber"] },
  { n: "Aloo paratha with curd", c: 430, slot: ["b"], reg: ["n"], dairy: 1, t: [] },
  { n: "Paneer paratha with curd", c: 450, slot: ["b"], reg: ["n"], dairy: 1, t: ["protein"] },
  { n: "Methi thepla with curd", c: 340, slot: ["b"], reg: ["w"], dairy: 1, t: ["fiber"] },
  { n: "Steamed dhokla", c: 250, slot: ["b","es"], reg: ["w"], jain: 1, simple: 1, t: ["lowgi","protein"] },
  { n: "Handvo slice", c: 300, slot: ["b"], reg: ["w"], dairy: 1, jain: 1, t: ["fiber"] },
  { n: "Vegetable daliya", c: 260, slot: ["b"], reg: ["all"], jain: 1, simple: 1, t: ["fiber","lowgi"] },
  { n: "Ragi porridge", c: 240, slot: ["b"], reg: ["s","all"], jain: 1, simple: 1, t: ["lowgi","fiber"] },
  { n: "Sprout & veg salad bowl", c: 220, slot: ["b","es"], reg: ["all"], jain: 1, simple: 1, t: ["protein","lowgi","fiber"] },
  { n: "Boiled eggs (2) with toast", c: 280, slot: ["b"], reg: ["all"], egg: 1, simple: 1, t: ["protein"] },
  { n: "Egg bhurji with roti", c: 360, slot: ["b"], reg: ["all"], egg: 1, t: ["protein"] },
  { n: "Bread omelette", c: 320, slot: ["b"], reg: ["all"], egg: 1, simple: 1, t: ["protein"] },
  { n: "Chirer pulao (Bengali poha)", c: 300, slot: ["b"], reg: ["e"], simple: 1, t: ["fiber"] },
  { n: "Luchi with aloo dom", c: 430, slot: ["b"], reg: ["e"], t: ["fried"] },
  { n: "Vegetable khichuri", c: 320, slot: ["b","d"], reg: ["e","all"], jain: 1, simple: 1, t: ["fiber","lowgi"] },
  { n: "Misal pav", c: 450, slot: ["b"], reg: ["w"], t: ["fiber","protein"] },
  { n: "Sabudana khichdi", c: 350, slot: ["b","es"], reg: ["w"], t: [] },
  { n: "Banana peanut-butter toast", c: 320, slot: ["b"], reg: ["all"], jain: 1, simple: 1, t: [] },
  // ---- mid-morning ----
  { n: "Seasonal fruit bowl", c: 90, slot: ["ms","es"], reg: ["all"], jain: 1, simple: 1, t: ["lowgi","fiber"] },
  { n: "An apple", c: 80, slot: ["ms"], reg: ["all"], jain: 1, simple: 1, t: ["lowgi","fiber"] },
  { n: "Buttermilk (chaas)", c: 80, slot: ["ms","es"], reg: ["w","s","all"], dairy: 1, jain: 1, simple: 1, t: ["lowgi"] },
  { n: "Tender coconut water", c: 60, slot: ["ms"], reg: ["s","all"], jain: 1, simple: 1, t: ["lowgi"] },
  { n: "Roasted chana (handful)", c: 120, slot: ["ms","es"], reg: ["all"], jain: 1, simple: 1, t: ["protein","fiber"] },
  { n: "Moong sprouts cup", c: 110, slot: ["ms"], reg: ["all"], jain: 1, simple: 1, t: ["protein","lowgi","fiber"] },
  { n: "Greek yogurt", c: 100, slot: ["ms"], reg: ["all"], dairy: 1, jain: 1, simple: 1, t: ["protein","lowgi"] },
  { n: "Soaked almonds (6)", c: 90, slot: ["ms"], reg: ["all"], jain: 1, simple: 1, t: ["protein","fiber"] },
  { n: "Papaya bowl", c: 80, slot: ["ms"], reg: ["all"], jain: 1, simple: 1, t: ["lowgi","fiber"] },
  // ---- evening ----
  { n: "Green tea with roasted makhana", c: 110, slot: ["es"], reg: ["all"], jain: 1, simple: 1, t: ["lowgi"] },
  { n: "Masala chai with 2 biscuits", c: 120, slot: ["es"], reg: ["all"], dairy: 1, simple: 1, t: ["sugary"] },
  { n: "Light bhel", c: 180, slot: ["es"], reg: ["w"], simple: 1, t: ["fiber"] },
  { n: "Boiled egg with tea", c: 110, slot: ["es"], reg: ["all"], egg: 1, dairy: 1, simple: 1, t: ["protein"] },
  { n: "Roasted peanuts", c: 160, slot: ["es"], reg: ["all"], jain: 1, simple: 1, t: ["protein","fiber"] },
  { n: "Fruit chaat", c: 120, slot: ["es"], reg: ["all"], jain: 1, simple: 1, t: ["lowgi","fiber"] },
  { n: "Grilled veg sandwich", c: 220, slot: ["es"], reg: ["all"], simple: 1, t: ["fiber"] },
  { n: "Chana sundal", c: 150, slot: ["es"], reg: ["s"], simple: 1, t: ["protein","fiber"] },
  { n: "Pan-tossed paneer cubes", c: 160, slot: ["es"], reg: ["all"], dairy: 1, jain: 1, simple: 1, t: ["protein","lowgi"] },
  { n: "Hummus with cucumber", c: 150, slot: ["es"], reg: ["all"], simple: 1, t: ["protein","lowgi","fiber"] },
  // ---- lunch / dinner ----
  { n: "2 roti, dal tadka, bhindi & curd", c: 520, slot: ["l","d"], reg: ["n","all"], dairy: 1, t: ["fiber"] },
  { n: "2 roti, rajma & small rice", c: 560, slot: ["l","d"], reg: ["n"], t: ["fiber","protein"] },
  { n: "2 roti, chole & salad", c: 540, slot: ["l","d"], reg: ["n"], t: ["fiber","protein"] },
  { n: "Palak paneer with 2 roti", c: 540, slot: ["l","d"], reg: ["n"], dairy: 1, t: ["fiber","protein"] },
  { n: "Dal makhani with jeera rice", c: 600, slot: ["l","d"], reg: ["n"], dairy: 1, t: ["protein"] },
  { n: "Mixed veg, dal & 2 roti", c: 500, slot: ["l","d"], reg: ["all"], jain: 1, t: ["fiber"] },
  { n: "Soya chunk curry with rice", c: 520, slot: ["l","d"], reg: ["all"], t: ["protein","fiber"] },
  { n: "Rice, sambar, rasam, poriyal & curd", c: 540, slot: ["l","d"], reg: ["s"], dairy: 1, t: ["fiber"] },
  { n: "Curd rice with pickle", c: 420, slot: ["l","d"], reg: ["s"], dairy: 1, simple: 1, t: ["highsalt"] },
  { n: "Lemon rice with papad & salad", c: 460, slot: ["l","d"], reg: ["s"], simple: 1, t: ["highsalt"] },
  { n: "Bisi bele bath", c: 520, slot: ["l","d"], reg: ["s"], dairy: 1, t: ["fiber","protein"] },
  { n: "Rice, kootu & thoran", c: 500, slot: ["l","d"], reg: ["s"], jain: 1, t: ["fiber"] },
  { n: "Avial with rice", c: 480, slot: ["l","d"], reg: ["s"], dairy: 1, jain: 1, t: ["fiber"] },
  { n: "Fish curry with rice", c: 560, slot: ["l","d"], reg: ["s","e"], fish: 1, t: ["protein"] },
  { n: "Chicken Chettinad with rice", c: 620, slot: ["l","d"], reg: ["s"], meat: 1, t: ["protein"] },
  { n: "Egg curry with rice", c: 540, slot: ["l","d"], reg: ["all"], egg: 1, t: ["protein"] },
  { n: "Rice, cholar dal, aloo posto & curd", c: 540, slot: ["l","d"], reg: ["e"], dairy: 1, t: ["fiber"] },
  { n: "Rice with macher jhol", c: 560, slot: ["l","d"], reg: ["e"], fish: 1, t: ["protein"] },
  { n: "Shukto with rice", c: 460, slot: ["l","d"], reg: ["e"], dairy: 1, t: ["fiber"] },
  { n: "Rice, dal & begun bhaja", c: 500, slot: ["l","d"], reg: ["e"], jain: 1, simple: 1, t: ["fried"] },
  { n: "Gujarati thali (roti, dal, shaak, rice, curd)", c: 560, slot: ["l","d"], reg: ["w"], dairy: 1, jain: 1, t: ["fiber"] },
  { n: "Bajra roti, baingan bharta & chaas", c: 480, slot: ["l","d"], reg: ["w"], dairy: 1, t: ["fiber","lowgi"] },
  { n: "Pithla bhakri", c: 460, slot: ["l","d"], reg: ["w"], jain: 1, t: ["fiber"] },
  { n: "Dal dhokli", c: 520, slot: ["l","d"], reg: ["w"], jain: 1, t: ["fiber","protein"] },
  { n: "Undhiyu with roti", c: 540, slot: ["l","d"], reg: ["w"], t: ["fiber"] },
  { n: "Chicken sukka with bhakri", c: 640, slot: ["l","d"], reg: ["w"], meat: 1, t: ["protein"] },
  { n: "Moong dal khichdi with curd", c: 420, slot: ["l","d"], reg: ["all"], dairy: 1, jain: 1, simple: 1, t: ["lowgi","fiber"] },
  { n: "Moong dal khichdi (light)", c: 360, slot: ["l","d"], reg: ["all"], jain: 1, simple: 1, t: ["lowgi","fiber"] },
  { n: "Vegetable soup with 2 multigrain toast", c: 320, slot: ["d"], reg: ["all"], jain: 1, simple: 1, t: ["lowgi","fiber"] },
  { n: "Grilled chicken with sautéed veg", c: 480, slot: ["l","d"], reg: ["all"], meat: 1, simple: 1, t: ["protein","lowgi"] },
  { n: "Grilled fish with salad", c: 420, slot: ["l","d"], reg: ["all"], fish: 1, simple: 1, t: ["protein","lowgi"] },
  { n: "Paneer tikka with salad", c: 420, slot: ["l","d"], reg: ["all"], dairy: 1, simple: 1, t: ["protein","lowgi"] },
  { n: "Tofu stir-fry with rice", c: 460, slot: ["l","d"], reg: ["all"], simple: 1, t: ["protein"] },
  { n: "Dal with 2 roti & salad", c: 460, slot: ["l","d"], reg: ["all"], jain: 1, simple: 1, t: ["fiber","protein"] },
  { n: "Missi roti with seasonal sabzi", c: 440, slot: ["l","d"], reg: ["n","all"], jain: 1, simple: 1, t: ["fiber"] },
  { n: "Veg pulao with raita", c: 480, slot: ["l","d"], reg: ["all"], dairy: 1, jain: 1, simple: 1, t: ["fiber"] },
  // ---- bedtime ----
  { n: "Turmeric milk", c: 120, slot: ["bt"], reg: ["all"], dairy: 1, jain: 1, simple: 1, t: ["lowgi"] },
  { n: "Warm milk", c: 110, slot: ["bt"], reg: ["all"], dairy: 1, jain: 1, simple: 1, t: ["lowgi"] },
  { n: "Chamomile tea", c: 10, slot: ["bt"], reg: ["all"], jain: 1, simple: 1, t: ["lowgi"] },
  { n: "A few walnuts", c: 90, slot: ["bt"], reg: ["all"], jain: 1, simple: 1, t: ["protein","lowgi"] },
  { n: "Soaked figs (2)", c: 80, slot: ["bt"], reg: ["all"], jain: 1, simple: 1, t: ["fiber","lowgi"] },
];

const SLOTSET = {
  "3 meals": [["b",.32,"Breakfast"],["l",.40,"Lunch"],["d",.28,"Dinner"]],
  "3 meals + 2 snacks": [["b",.25,"Breakfast"],["ms",.10,"Mid-morning"],["l",.30,"Lunch"],["es",.12,"Evening snack"],["d",.23,"Dinner"]],
  "5-6 small meals": [["b",.22,"Breakfast"],["ms",.12,"Mid-morning"],["l",.26,"Lunch"],["es",.12,"Evening snack"],["d",.20,"Dinner"],["bt",.08,"Bedtime"]],
};
const RMAP = { "North Indian":"n","South Indian":"s","East Indian":"e","West Indian":"w" };
const COND_SHORT = { "Diabetes / pre-diabetes":"blood sugar","High BP (hypertension)":"blood pressure","High cholesterol":"cholesterol","Thyroid (hypothyroid)":"thyroid" };

function mapRegions(arr) {
  if (!arr || !arr.length || arr.length === 4) return ["n","s","e","w","all"];
  return [...arr.map(x => RMAP[x]).filter(Boolean), "all"];
}
function calcStats(d) {
  const cm = ((+d.heightFt || 0) * 12 + (+d.heightIn || 0)) * 2.54;
  const h = cm / 100, w = +d.weight || 0, age = +d.age || 30;
  const bmi = w && h ? w / (h * h) : 0;
  const bmr = d.sex === "Female" ? 10*w + 6.25*cm - 5*age - 161 : 10*w + 6.25*cm - 5*age + 5;
  const mult = { "Mostly desk job":1.3, "On feet / moderate":1.5, "Physically active":1.7 }[d.activity] || 1.4;
  let tdee = bmr * mult;
  if (d.goal === "Weight loss") tdee -= 400;
  if (d.goal === "Muscle gain") tdee += 300;
  tdee = Math.max(1300, tdee);
  return { cm, bmi: bmi.toFixed(1), tdee: Math.round(tdee/10)*10, bmiCat: bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese" };
}
function dietOK(f, diet) {
  if (diet === "Non-veg") return true;
  if (f.meat || f.fish) return false;
  if (diet === "Egg + veg") return true;
  if (f.egg) return false;
  if (diet === "Pure veg") return true;
  if (diet === "Vegan") return !f.dairy;
  if (diet === "Jain") return !!f.jain;
  return true;
}
function condOK(f, cond) {
  if (cond === "Diabetes / pre-diabetes") return !f.t.includes("sugary");
  if (cond === "High BP (hypertension)") return !f.t.includes("highsalt");
  if (cond === "High cholesterol") return !f.t.includes("fried");
  if (cond === "Thyroid (hypothyroid)") return !f.t.includes("goitrogen");
  return true;
}
function cands(slot, ctx, relax) {
  return DB.filter(f => {
    if (!f.slot.includes(slot)) return false;
    if (!dietOK(f, ctx.diet)) return false;
    if (relax < 2 && !(f.reg.some(r => ctx.regions.includes(r)))) return false;
    if (relax < 1 && !condOK(f, ctx.cond)) return false;
    return true;
  });
}
function pickMeal(slot, target, di, used, ctx) {
  let list = [];
  for (let r = 0; r < 3 && !list.length; r++) list = cands(slot, ctx, r);
  if (!list.length) return { n: "Seasonal fruit & nuts", c: target };
  const scored = list.map(f => {
    let s = -Math.abs(f.c - target) / Math.max(target, 1);
    if (ctx.goal === "Muscle gain" && f.t.includes("protein")) s += 0.45;
    if ((ctx.goal === "Weight loss" || ctx.cond === "Diabetes / pre-diabetes") && (f.t.includes("lowgi") || f.t.includes("fiber"))) s += 0.3;
    if (ctx.cond === "High cholesterol" && f.t.includes("fiber")) s += 0.2;
    if (ctx.simplePref && f.simple) s += 0.25;
    if (used.has(f.n)) s -= 1.6;
    s += (hashNum(f.n + di) % 100) / 900;
    return { f, s };
  }).sort((a, b) => b.s - a.s);
  return scored[0].f;
}
function makeTips(p, cal) {
  const g = {
    "Weight loss": ["Put protein in every meal — it keeps you full and protects muscle.", "Finish dinner 2-3 hours before bed."],
    "Muscle gain": ["Hit protein at every single meal — aim for a palm-sized source.", "Eat your post-workout meal within 45 minutes of training."],
    "Maintain weight": ["Consistency beats perfection — follow the 80/20 rule.", "Keep portion sizes steady day to day."],
    "General fitness": ["Build the habit first; the body follows.", "Move daily, even a 20-min walk counts."],
  }[p.goal] || [];
  const c = {
    "Diabetes / pre-diabetes": ["Eat fibre/veg first, carbs last — it blunts the sugar spike.", "Take a 10-minute walk after meals."],
    "High BP (hypertension)": ["Keep salt low — go easy on pickles, papad and packaged food.", "Add potassium-rich foods like banana and coconut water."],
    "High cholesterol": ["Avoid deep-fried food; use minimal oil for tadka.", "Oats and soluble fibre help — keep them in your week."],
    "Thyroid (hypothyroid)": ["Take thyroid medicine on an empty stomach, well before breakfast.", "Don't skip meals — keep energy steady through the day."],
    "Other": ["Review this plan with your doctor before starting."],
  }[p.condition] || [];
  const extra = p.cooktime === "I order online mostly"
    ? ["When ordering, pick grilled, dal, roti, curd and salad over fried/creamy dishes."]
    : ["Drink 2.5-3L water daily and aim for 7+ hours of sleep."];
  return [...g, ...c, ...extra].slice(0, 5);
}
function buildPlan(profile) {
  const st = calcStats(profile);
  const cal = st.tdee;
  const ctx = {
    goal: profile.goal, cond: profile.condition, diet: profile.diet,
    regions: mapRegions(profile.region),
    simplePref: ["Minimal cooking (10-15 min)", "I order online mostly"].includes(profile.cooktime),
  };
  const slots = SLOTSET[profile.meals] || SLOTSET["3 meals"];
  const weekUsed = new Set();
  const days = WEEK.map((dn, di) => {
    let raw = slots.map(([code, frac, label]) => {
      const m = pickMeal(code, Math.round(cal * frac), di, weekUsed, ctx);
      weekUsed.add(m.n);
      return { time: label, food: m.n, cal: m.c };
    });
    const total = raw.reduce((a, b) => a + b.cal, 0);
    let f = total ? cal / total : 1; f = Math.max(0.78, Math.min(1.28, f));
    raw = raw.map(m => ({ ...m, cal: Math.round((m.cal * f) / 5) * 5 }));
    if (di % 7 === 6) weekUsed.clear();
    return { day: dn, meals: raw };
  });
  const condClause = profile.condition !== "None" && profile.condition !== "Other"
    ? ` It's tuned to go easy on your ${COND_SHORT[profile.condition]} — still, please review it with your doctor.`
    : profile.condition === "Other" ? " Since you flagged a condition, please clear this plan with your doctor first." : "";
  const regLabel = (!profile.region.length || profile.region.length === 4) ? "pan-Indian" : profile.region.join(" & ");
  return {
    summary: `Here's a ${profile.goal.toLowerCase()} plan at about ${cal} kcal a day, built around ${regLabel} food you actually like.${condClause}`,
    dailyCalories: cal, bmi: st.bmi, bmiCat: st.bmiCat,
    goal: profile.goal, diet: profile.diet, condition: profile.condition, regLabel,
    tips: makeTips(profile, cal), days,
  };
}

/* ---------------- UI bits ---------------- */
function Logo({ size = 40 }) {
  const id = "lg" + size;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22C16B" /><stop offset="1" stopColor="#0E8A4D" /></linearGradient></defs>
      <rect width="48" height="48" rx="14" fill={`url(#${id})`} />
      <path d="M24 13c-5 0-9 3.5-9 9 0 6 5 11 9 13 4-2 9-7 9-13 0-5.5-4-9-9-9z" fill="#fff" opacity="0.18" />
      <path d="M24 12c-1 5-4 7-7 8 0 6 3.5 9 7 11 3.5-2 7-5 7-11-3-1-6-3-7-8z" fill="#fff" />
      <path d="M14 30h6l2-4 3 8 2-4h7" stroke="#0E8A4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function CalRing({ pct = 1, size = 110, color = "#fff", track = "rgba(255,255,255,0.25)", big, small }) {
  const r = (size - 14) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, pct)));
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth="9" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset .7s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold leading-none" style={{ fontSize: size * 0.2, color }}>{big}</span>
        <span style={{ fontSize: size * 0.1, color, opacity: 0.85 }}>{small}</span>
      </div>
    </div>
  );
}
const MEAL_UI = {
  "Breakfast": { Icon: Sunrise, col: "#F59E0B" }, "Mid-morning": { Icon: Apple, col: "#F43F5E" },
  "Lunch": { Icon: Utensils, col: "#1DAA61" }, "Evening snack": { Icon: Cookie, col: "#8B5CF6" },
  "Dinner": { Icon: Moon, col: "#6366F1" }, "Bedtime": { Icon: Moon, col: "#64748B" },
};
function Shell({ children, wide }) {
  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(180deg,#F3FBF6 0%,#F7F8FA 40%)" }}>
      <style>{`@keyframes eFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
      <div className={`mx-auto ${wide ? "max-w-3xl" : "max-w-md"}`}>{children}</div>
    </div>
  );
}
function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 ${className}`}>{children}</div>;
}
function Chip({ label, val }) {
  return <div className="rounded-2xl bg-white border border-gray-100 px-3 py-2.5 shadow-sm"><div className="text-xs text-gray-400">{label}</div><div className="font-semibold text-gray-800 text-sm mt-0.5">{val}</div></div>;
}

/* ---------------- App ---------------- */
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ region: [] });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [session, setSession] = useState(null);
  const [tracking, setTracking] = useState(null);

  useEffect(() => { (async () => {
    const s = await sget("eatbc:session");
    if (s) { setSession(s); setTracking(await sget(`eatbc:track:${s.id}`)); const p = await sget(`eatbc:plan:${s.id}`); if (p) setPlan(p); setScreen("dash"); }
  })(); }, []);

  const cur = Q[step];
  const setVal = (v) => setProfile(p => ({ ...p, [cur.k]: v }));
  const toggleMulti = (o) => setProfile(p => { const a = p[cur.k] || []; return { ...p, [cur.k]: a.includes(o) ? a.filter(x => x !== o) : [...a, o] }; });
  const canNext = !cur ? false
    : cur.type === "multi" ? (profile[cur.k] || []).length > 0
    : cur.type === "height" ? (profile.heightFt ?? "") !== ""
    : cur.k === "avoid" ? true
    : (profile[cur.k] ?? "") !== "";

  function generate() {
    setLoading(true); setErr("");
    setTimeout(() => {
      try { setPlan(buildPlan(profile)); setScreen("plan"); }
      catch { setErr("Something went off — adjust an answer and retry."); }
      setLoading(false);
    }, 650);
  }
  function planText() {
    if (!plan) return "";
    let t = `🥗 *EatBC Weekly Plan — ${profile.name}*\n${plan.summary}\nDaily target: ~${plan.dailyCalories} kcal\n\n`;
    plan.days.forEach(d => { t += `*${d.day}*\n`; d.meals.forEach(m => t += `• ${m.time}: ${m.food} (${m.cal} kcal)\n`); t += `\n`; });
    t += `💡 Tips:\n${plan.tips.map(x => "• " + x).join("\n")}\n\nLet's make the nation fit 💪 — EatBC`;
    return t;
  }
  const shareWA = () => window.open(`https://wa.me/?text=${encodeURIComponent(planText())}`, "_blank");
  const shareEmail = () => window.open(`mailto:?subject=${encodeURIComponent("My EatBC Weekly Plan")}&body=${encodeURIComponent(planText())}`, "_blank");

  /* ---- welcome ---- */
  if (screen === "welcome") return (
    <Shell>
      <Card className="p-8 text-center" >
        <div className="flex justify-center mb-5"><Logo size={72} /></div>
        <h1 className="text-4xl font-bold text-gray-800">EatBC</h1>
        <p className="text-gray-500 mt-2">Eat Better, Change.</p>
        <p className="text-sm text-gray-400 mt-1 mb-7">A few quick questions → a real weekly Indian diet → a tracker that keeps you honest.</p>
        <button onClick={() => setScreen("quiz")} className="w-full py-3.5 rounded-2xl text-white font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md" style={{ background: GREEN }}>
          Start my assessment <ChevronRight size={18} />
        </button>
        <p className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5"><Stethoscope size={13} /> Not medical advice — for any condition, consult your doctor.</p>
      </Card>
    </Shell>
  );

  /* ---- quiz ---- */
  if (screen === "quiz") return (
    <Shell>
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6"><Logo size={28} /><span className="font-bold text-gray-700">EatBC</span></div>
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2"><span>Question {step + 1} of {Q.length}</span><span>{Math.round(((step + 1) / Q.length) * 100)}%</span></div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-2 rounded-full transition-all" style={{ width: `${((step + 1) / Q.length) * 100}%`, background: GREEN }} /></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{cur.label}</h2>
        {cur.sub && <p className="text-sm text-gray-400 mt-1 mb-4">{cur.sub}</p>}
        <div className={cur.sub ? "" : "mt-5"}>
          {cur.type === "pick" && (
            <div className="grid gap-2.5">
              {cur.opts.map(o => (
                <button key={o} onClick={() => setVal(o)} className={`text-left px-5 py-3.5 rounded-2xl border-2 transition font-medium ${profile[cur.k] === o ? "text-white shadow-md" : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"}`} style={profile[cur.k] === o ? { background: GREEN, borderColor: GREEN } : {}}>{o}</button>
              ))}
            </div>
          )}
          {cur.type === "multi" && (
            <div className="grid grid-cols-2 gap-2.5">
              {cur.opts.map(o => { const on = (profile[cur.k] || []).includes(o); return (
                <button key={o} onClick={() => toggleMulti(o)} className={`px-4 py-3.5 rounded-2xl border-2 transition font-medium text-sm inline-flex items-center justify-center gap-1.5 ${on ? "text-white shadow-md" : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"}`} style={on ? { background: GREEN, borderColor: GREEN } : {}}>{on && <CheckCircle2 size={15} />}{o}</button>
              ); })}
            </div>
          )}
          {cur.type === "height" && (
            <div className="flex gap-3">
              <div className="flex-1"><label className="text-xs text-gray-400">Feet</label><input type="number" value={profile.heightFt || ""} onChange={e => setProfile(p => ({ ...p, heightFt: e.target.value }))} placeholder="5" className="w-full mt-1 px-4 py-3.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-lg" autoFocus /></div>
              <div className="flex-1"><label className="text-xs text-gray-400">Inches</label><input type="number" value={profile.heightIn || ""} onChange={e => setProfile(p => ({ ...p, heightIn: e.target.value }))} placeholder="9" className="w-full mt-1 px-4 py-3.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-lg" /></div>
            </div>
          )}
          {cur.type === "text" && <input type="text" value={profile[cur.k] || ""} onChange={e => setVal(e.target.value)} placeholder={cur.ph} className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-lg" autoFocus />}
          {cur.type === "number" && <input type="number" value={profile[cur.k] || ""} onChange={e => setVal(e.target.value)} placeholder={cur.ph} className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-lg" autoFocus />}
        </div>
        {err && <div className="mt-4 flex items-center gap-2 text-red-500 text-sm"><AlertCircle size={16} />{err}</div>}
        <div className="flex justify-between mt-8">
          <button onClick={() => step > 0 ? setStep(step - 1) : setScreen("welcome")} className="px-5 py-2.5 text-gray-500 font-medium">Back</button>
          {step < Q.length - 1 ? (
            <button disabled={!canNext} onClick={() => setStep(step + 1)} className="px-7 py-2.5 rounded-2xl text-white font-semibold disabled:opacity-40 inline-flex items-center gap-1 shadow-md" style={{ background: GREEN }}>Next <ChevronRight size={16} /></button>
          ) : (
            <button disabled={loading || !canNext} onClick={generate} className="px-7 py-2.5 rounded-2xl text-white font-semibold disabled:opacity-60 inline-flex items-center gap-2 shadow-md" style={{ background: GREEN }}>{loading ? <><Loader2 className="animate-spin" size={16} /> Building…</> : <>Build my plan <Sparkles size={16} /></>}</button>
          )}
        </div>
      </Card>
    </Shell>
  );

  /* ---- plan ---- */
  if (screen === "plan" && plan) return (
    <Shell wide>
      <div style={{ animation: "eFade .5s ease both" }}>
        {/* hero */}
        <div className="rounded-3xl p-6 md:p-7 text-white shadow-lg mb-4" style={{ background: "linear-gradient(135deg,#1DAA61 0%,#0E8A4D 55%,#0B6E40 100%)" }}>
          <div className="flex items-center gap-2 mb-4"><Logo size={30} /><span className="font-bold">EatBC</span></div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-white/70 text-sm">Weekly plan for</p>
              <h2 className="text-3xl font-bold truncate">{profile.name || "you"}</h2>
              <p className="text-white/85 text-sm mt-2 max-w-md">{plan.summary}</p>
            </div>
            <CalRing pct={1} big={plan.dailyCalories} small="kcal / day" size={118} />
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={shareWA} className="flex-1 md:flex-none px-5 py-2.5 rounded-2xl bg-white font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition" style={{ color: GREEN }}><Share2 size={16} /> WhatsApp</button>
            <button onClick={shareEmail} className="flex-1 md:flex-none px-5 py-2.5 rounded-2xl font-semibold inline-flex items-center justify-center gap-2 text-white border border-white/40 hover:bg-white/10 transition"><Mail size={16} /> Email</button>
          </div>
        </div>

        {plan.condition !== "None" && (
          <div className="rounded-2xl px-4 py-3 mb-4 flex items-start gap-2.5 text-sm" style={{ background: "#FFF7ED", color: "#9A3412" }}>
            <HeartPulse size={18} className="mt-0.5 shrink-0" /><span>This plan is adjusted for <b>{plan.condition}</b>. Please confirm it with your doctor before starting — especially around medication and portions.</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
          <Chip label="BMI" val={`${plan.bmi} · ${plan.bmiCat}`} />
          <Chip label="Goal" val={plan.goal} />
          <Chip label="Diet" val={plan.diet} />
          <Chip label="Cuisine" val={plan.regLabel} />
        </div>

        <PlanWeek plan={plan} />

        <div className="rounded-3xl p-5 mb-5" style={{ background: "linear-gradient(135deg,#F0FAF4,#E7F7EF)" }}>
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: GREEN }}><Sparkles size={18} /> Coach's tips</h3>
          <div className="grid md:grid-cols-2 gap-2.5">
            {plan.tips.map((t, i) => <div key={i} className="bg-white/70 rounded-2xl px-4 py-3 text-sm text-gray-700 border border-white">{t}</div>)}
          </div>
        </div>

        <Card className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800">Ready to commit?</h3>
          <p className="text-gray-400 text-sm mt-1 mb-4">Accept the challenge and unlock your daily tracker.</p>
          <button onClick={() => setScreen("login")} className="px-8 py-3.5 rounded-2xl text-white font-bold inline-flex items-center gap-2 shadow-md hover:opacity-90 transition" style={{ background: GREEN }}>Accept the challenge 💪 <ChevronRight size={20} /></button>
        </Card>
        <p className="text-center text-xs text-gray-400 mt-4">EatBC gives general guidance, not medical advice. Consult a doctor or registered dietician for any health condition.</p>
      </div>
    </Shell>
  );

  /* ---- login ---- */
  if (screen === "login") return <Login profile={profile} onDone={async (sess) => {
    setSession(sess); await sset("eatbc:session", sess); await sset(`eatbc:plan:${sess.id}`, plan);
    setTracking(await sget(`eatbc:track:${sess.id}`) || {}); setScreen("dash");
  }} onBack={() => setScreen("plan")} />;

  /* ---- dashboard ---- */
  if (screen === "dash" && session) return <Dash session={session} plan={plan}
    tracking={tracking || {}}
    onUpdate={async (t) => { setTracking(t); await sset(`eatbc:track:${session.id}`, t); }}
    onLogout={async () => { await window.storage.delete("eatbc:session"); setSession(null); setScreen("welcome"); setStep(0); setProfile({ region: [] }); setPlan(null); }} />;

  return <Shell><Card className="p-10 text-center text-gray-400">Loading…</Card></Shell>;
}

/* ---- weekly plan view ---- */
function PlanWeek({ plan }) {
  const [sel, setSel] = useState(plan.days[0].day);
  const day = plan.days.find(d => d.day === sel);
  const total = day.meals.reduce((a, b) => a + b.cal, 0);
  return (
    <Card className="p-5 mb-5">
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {plan.days.map(d => <button key={d.day} onClick={() => setSel(d.day)} className={`px-3.5 py-2 rounded-xl text-sm whitespace-nowrap font-semibold transition ${sel === d.day ? "text-white shadow" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`} style={sel === d.day ? { background: GREEN } : {}}>{d.day.slice(0, 3)}</button>)}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{day.day}</h3>
        <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: "#EAF7F0", color: GREEN }}>{total} kcal</span>
      </div>
      <div key={sel} style={{ animation: "eFade .35s ease both" }}>
        {day.meals.map((m, i) => {
          const ui = MEAL_UI[m.time] || MEAL_UI.Lunch; const Icon = ui.Icon; const last = i === day.meals.length - 1;
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: ui.col + "1A" }}><Icon size={18} style={{ color: ui.col }} /></div>
                {!last && <div className="w-0.5 flex-1 my-1" style={{ background: "#EEF1F4" }} />}
              </div>
              <div className={`flex-1 ${last ? "" : "pb-4"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: ui.col }}>{m.time}</span>
                  <span className="text-xs text-gray-400">{m.cal} kcal</span>
                </div>
                <p className="text-gray-800 font-medium mt-0.5">{m.food}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ---- login ---- */
function Login({ profile, onDone, onBack }) {
  const [mode, setMode] = useState("signup");
  const [id, setId] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit() {
    setErr(""); if (!id.trim() || !pw) { setErr("Enter both fields"); return; }
    setBusy(true);
    const k = `eatbc:user:${id.toLowerCase().trim()}`; const ex = await sget(k);
    if (mode === "signup") {
      if (ex) { setErr("Account exists — switch to Log in"); setBusy(false); return; }
      await sset(k, { pw: hash(pw), name: profile?.name || id });
      onDone({ id: id.toLowerCase().trim(), name: profile?.name || id });
    } else {
      if (!ex || ex.pw !== hash(pw)) { setErr("Invalid credentials"); setBusy(false); return; }
      onDone({ id: id.toLowerCase().trim(), name: ex.name });
    }
  }
  return (
    <Shell>
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6"><Logo size={28} /><span className="font-bold text-gray-700">EatBC</span></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{mode === "signup" ? "Create your tracker" : "Welcome back"}</h2>
        <p className="text-gray-400 text-sm mb-6">Use your phone number or email as your login ID.</p>
        <label className="text-sm font-medium text-gray-600">Phone or Email</label>
        <input value={id} onChange={e => setId(e.target.value)} placeholder="9876543210 or you@email.com" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-4 mt-1" />
        <label className="text-sm font-medium text-gray-600">Password</label>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••" className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-2 mt-1" />
        <p className="text-xs text-gray-400 mb-4">Demo tracker login — please don't reuse a real banking password.</p>
        {err && <div className="mb-3 flex items-center gap-2 text-red-500 text-sm"><AlertCircle size={16} />{err}</div>}
        <button disabled={busy} onClick={submit} className="w-full py-3.5 rounded-2xl text-white font-bold disabled:opacity-60 shadow-md" style={{ background: GREEN }}>{mode === "signup" ? "Start tracking" : "Log in"}</button>
        <div className="flex items-center justify-between mt-4 text-sm">
          <button onClick={onBack} className="text-gray-400">← Back to plan</button>
          <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setErr(""); }} className="font-semibold" style={{ color: GREEN }}>{mode === "signup" ? "I have an account" : "New here? Sign up"}</button>
        </div>
      </Card>
    </Shell>
  );
}

/* ---- dashboard ---- */
function Dash({ session, plan, tracking, onUpdate, onLogout }) {
  const today = WEEK[(new Date().getDay() + 6) % 7];
  const [sel, setSel] = useState(today);
  const t = tracking || {};
  const dd = t[sel] || { meals: {}, water: 0 };
  const dp = plan?.days?.find(d => d.day === sel);
  const cal = plan?.dailyCalories || 0;

  const toggle = (i) => onUpdate({ ...t, [sel]: { ...dd, meals: { ...dd.meals, [i]: !dd.meals[i] } } });
  const setWater = (n) => onUpdate({ ...t, [sel]: { ...dd, water: n } });
  const logW = (w) => onUpdate({ ...t, weights: { ...(t.weights || {}), [new Date().toISOString().slice(0, 10)]: w } });

  const consumed = dp ? dp.meals.reduce((a, m, i) => a + (dd.meals[i] ? m.cal : 0), 0) : 0;
  const doneCount = dp ? dp.meals.filter((_, i) => dd.meals[i]).length : 0;
  const streak = WEEK.filter(d => { const x = t[d], p = plan?.days?.find(y => y.day === d); return p && x && p.meals.every((_, i) => x.meals[i]); }).length;

  return (
    <Shell wide>
      <div style={{ animation: "eFade .4s ease both" }}>
        <div className="rounded-3xl p-6 text-white shadow-lg mb-4" style={{ background: "linear-gradient(135deg,#1DAA61 0%,#0E8A4D 60%,#0B6E40 100%)" }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3"><Logo size={26} /><span className="font-bold text-sm">EatBC</span></div>
              <h2 className="text-2xl font-bold">Hi {session.name} 👋</h2>
              <p className="text-white/70 text-sm">{session.id}</p>
              <div className="flex gap-4 mt-4">
                <div><div className="text-2xl font-bold">{streak}/7</div><div className="text-white/70 text-xs">perfect days</div></div>
                <div><div className="text-2xl font-bold">{doneCount}/{dp?.meals.length || 0}</div><div className="text-white/70 text-xs">today's meals</div></div>
              </div>
            </div>
            <CalRing pct={cal ? consumed / cal : 0} big={consumed} small={`/ ${cal}`} size={104} />
          </div>
          <button onClick={onLogout} className="mt-4 text-white/80 inline-flex items-center gap-1 text-sm hover:text-white"><LogOut size={15} /> Logout</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {WEEK.map(d => <button key={d} onClick={() => setSel(d)} className={`px-3.5 py-2 rounded-xl text-sm whitespace-nowrap font-semibold transition ${sel === d ? "text-white shadow" : "bg-white text-gray-500 border border-gray-100"}`} style={sel === d ? { background: GREEN } : {}}>{d.slice(0, 3)}{d === today ? " •" : ""}</button>)}
        </div>

        {dp ? (
          <>
            <Card className="p-5 mb-4">
              <h3 className="font-bold text-gray-800 mb-3">{sel} — tick off as you eat</h3>
              <div className="space-y-1">
                {dp.meals.map((m, i) => {
                  const ui = MEAL_UI[m.time] || MEAL_UI.Lunch; const on = !!dd.meals[i];
                  return (
                    <button key={i} onClick={() => toggle(i)} className="w-full flex items-center gap-3 text-left p-2.5 rounded-2xl hover:bg-gray-50 transition">
                      <CheckCircle2 size={24} style={{ color: on ? GREEN : "#E5E7EB" }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: ui.col }}>{m.time}</span>
                        <div className={`text-sm truncate ${on ? "line-through text-gray-300" : "text-gray-700"}`}>{m.food}</div>
                      </div>
                      <span className="text-xs text-gray-400">{m.cal}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5 mb-4">
              <div className="flex items-center justify-between mb-3"><h3 className="font-bold text-gray-800 flex items-center gap-2"><Droplet size={18} style={{ color: GREEN }} /> Water</h3><span className="text-sm text-gray-400">{dd.water}/8 glasses</span></div>
              <div className="flex gap-1.5">{[...Array(8)].map((_, i) => <button key={i} onClick={() => setWater(i + 1 === dd.water ? i : i + 1)} className="flex-1 h-9 rounded-lg transition" style={{ background: i < dd.water ? GREEN : "#E5E7EB" }} />)}</div>
            </Card>

            <WeightLog t={t} onLog={logW} />
          </>
        ) : <Card className="p-8 text-center text-gray-400">No plan loaded for this session.</Card>}
      </div>
    </Shell>
  );
}
function WeightLog({ t, onLog }) {
  const [w, setW] = useState("");
  const entries = Object.entries(t.weights || {}).sort();
  const latest = entries.length ? entries[entries.length - 1][1] : null;
  const first = entries.length ? entries[0][1] : null;
  const diff = latest != null && first != null ? (latest - first).toFixed(1) : null;
  return (
    <Card className="p-5">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3"><TrendingDown size={18} style={{ color: GREEN }} /> Weight log</h3>
      <div className="flex gap-2 mb-3">
        <input type="number" value={w} onChange={e => setW(e.target.value)} placeholder="Today's weight (kg)" className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500" />
        <button onClick={() => { if (w) { onLog(+w); setW(""); } }} className="px-6 rounded-2xl text-white font-semibold" style={{ background: GREEN }}>Log</button>
      </div>
      {entries.length > 0 && <div className="text-sm text-gray-500">Latest: <b className="text-gray-700">{latest} kg</b>{diff != null && <span style={{ color: +diff <= 0 ? GREEN : "#EA580C" }}> ({diff > 0 ? "+" : ""}{diff} kg since start)</span>}</div>}
    </Card>
  );
}
