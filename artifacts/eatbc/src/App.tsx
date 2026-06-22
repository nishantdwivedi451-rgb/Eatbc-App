import { useState, useEffect, useRef } from "react";
import {
  ChevronRight, Utensils, Share2, Mail,
  CheckCircle2, Droplet, LogOut, TrendingDown, Loader2,
  AlertCircle, Sunrise, Apple, Cookie, Moon, HeartPulse,
  Sparkles, Stethoscope, User, UserPlus, ArrowRight, Scale,
} from "lucide-react";

/* ─────────────── localStorage helpers ─────────────── */
function sget<T>(k: string): T | null {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : null; }
  catch { return null; }
}
function sset<T>(k: string, v: T): void {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}
function sdel(k: string): void {
  try { localStorage.removeItem(k); } catch {}
}
function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return String(h);
}
function hashNum(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

/* ─────────────── API helpers ─────────────── */
async function apiPost(path: string, body: unknown, token?: string) {
  const r = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw data;
  return data;
}
async function apiGet(path: string, token: string) {
  const r = await fetch(path, { headers: { Authorization: `Bearer ${token}` } });
  const data = await r.json();
  if (!r.ok) throw data;
  return data;
}

/* ─────────────── 100+ motivational quotes ─────────────── */
const QUOTES = [
  "Your body hears everything your mind says. Feed it well.",
  "The food you eat can be the safest medicine or the slowest poison.",
  "Take care of your body — it's the only place you have to live.",
  "Health is not a destination. It's a way of traveling.",
  "Every meal is a chance to nourish greatness.",
  "You don't have to eat less. You have to eat right.",
  "Small disciplines, repeated with consistency, equal great achievements.",
  "Your future self is watching what you eat right now.",
  "Don't dig your grave with your own knife and fork.",
  "Eat well, live well — it really is that simple.",
  "A healthy outside starts from the inside.",
  "You are what you eat, so don't be fast, cheap, easy, or fake.",
  "The groundwork of all happiness is health.",
  "It is health that is real wealth, not gold and silver.",
  "Nourishment is not just about food — it's about everything that feeds your soul.",
  "Change your food habits and you change the game entirely.",
  "Your diet is a bank account. Good food choices are good investments.",
  "Strive for progress, not perfection — one meal at a time.",
  "Fitness is not about being better than someone else — it's about being better than you used to be.",
  "The secret to getting ahead is getting started.",
  "Wake up determined. Go to bed satisfied.",
  "Every rep, every meal, every step — it all counts.",
  "Your body is a reflection of your lifestyle.",
  "Push yourself because no one else is going to do it for you.",
  "The only bad workout is the one that didn't happen.",
  "Success is built one healthy choice at a time.",
  "Today I will do what others won't, so tomorrow I can do what others can't.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Be stronger than your excuses.",
  "What you eat in private, you wear in public.",
  "Change takes courage. Start with your plate.",
  "Discipline is the bridge between goals and accomplishment.",
  "Healthy eating is a form of self-respect.",
  "You are one workout away from a good mood.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Your health is an investment, not an expense.",
  "The best time to start was yesterday. The next best time is now.",
  "Eat like you love yourself.",
  "Life is too short to eat boring, unhealthy food.",
  "It always seems impossible until it's done.",
  "Don't stop when you're tired. Stop when you're done.",
  "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.",
  "You have to believe in yourself when no one else does.",
  "A goal without a plan is just a wish.",
  "Fall seven times, stand up eight — and don't skip dal.",
  "Energy and persistence conquer all things.",
  "It's not about having time. It's about making time.",
  "The body achieves what the mind believes.",
  "Commit to being healthy for life, not just for summer.",
  "Eat food. Not too much. Mostly plants.",
  "There is no elevator to health — you have to take the stairs.",
  "You didn't come this far to only come this far.",
  "What seems impossible today will one day become your warm-up.",
  "The comeback is always stronger than the setback.",
  "Rome wasn't built in a day, and neither is a fit body.",
  "One healthy choice leads to another.",
  "Don't wish for it. Work — and eat — for it.",
  "Your habits will determine your future.",
  "Believe you can, and you're halfway there.",
  "A little progress each day adds up to big results.",
  "Sweat is just fat crying.",
  "Take care of your body, it's the only one you've got.",
  "Good things come to those who sweat.",
  "Nutrition is not a punishment. It's power.",
  "Change your habits, change your life.",
  "The clock is ticking — every meal matters.",
  "Strong is the new beautiful.",
  "Eat for the body you want, not the body you have.",
  "Champions aren't made in gyms — they're made from small daily actions.",
  "The hardest lift of all is lifting your butt off the couch.",
  "You are worth the effort.",
  "Don't just exist — thrive.",
  "Healthy is not a size, it's a lifestyle.",
  "The struggle you're in today is developing the strength you need for tomorrow.",
  "Train hard, eat right, sleep well — repeat.",
  "Every step in the right direction is progress.",
  "Live each day as if your health depended on it — it does.",
  "Don't just talk about it, be about it.",
  "Be the change your body needs.",
  "Fuel your purpose.",
  "If it doesn't challenge you, it doesn't change you.",
  "Your speed doesn't matter — forward is forward.",
  "Nothing tastes as good as healthy feels.",
  "One year from now, you'll wish you started today.",
  "Make yourself a priority.",
  "Don't let your mind bully your body.",
  "You are already incredible. Food just unlocks your potential.",
  "The best project you'll ever work on is you.",
  "Wellness is the new wealth.",
  "Feed your mind, nourish your body.",
  "Start where you are. Use what you have. Do what you can.",
  "Great things never came from comfort zones.",
  "The hardest part is starting. Once you start, everything changes.",
  "Transformation is a process, not an event.",
  "Results happen over time, not overnight. Work harder.",
  "Eat clean. Train mean. Live lean.",
  "Your only competition is who you were yesterday.",
  "Don't stop until you're proud.",
  "Health is a journey — enjoy every bite of it.",
  "Make the rest of your life the best of your life.",
  "Progress, not perfection.",
  "Build a body you're proud of — one thali at a time.",
];
function pickQuote(): string { return QUOTES[Math.floor(Math.random() * QUOTES.length)]; }

/* ─────────────── constants ─────────────── */
const GREEN = "#1DAA61";
const WEEK = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;
type DayName = typeof WEEK[number];

/* ─────────────── types ─────────────── */
interface Profile {
  name?: string; age?: string; sex?: string;
  heightFt?: string; heightIn?: string;
  weight?: string; target?: string;
  timeline?: string;
  goal?: string; condition?: string; diet?: string; region: string[];
  activity?: string; exercise?: string; meals?: string;
  cooktime?: string; avoid?: string;
}
interface Meal { time: string; food: string; cal: number; qty: string; }
interface PlanDay { day: DayName; meals: Meal[]; }
interface Plan {
  summary: string; dailyCalories: number; bmi: string; bmiCat: string;
  goal: string; diet: string; condition: string; regLabel: string;
  timeline: string; weeklyLoss: string;
  tips: string[]; days: PlanDay[];
}
interface Session { id: string; name: string; token: string; }
interface FoodLog { n: string; cal: number; qty: string; servings: number; }
interface DayTracking { meals: Record<number, boolean>; water: number; log?: FoodLog[]; }
interface Tracking {
  [day: string]: DayTracking | Record<string, number> | undefined;
  weights?: Record<string, number>;
}
type Screen = "welcome" | "quiz" | "plan" | "login" | "signup" | "dash" | "onboarding";

/* ─────────────── quiz questions ─────────────── */
interface Question {
  k: keyof Profile; label: string;
  type: "text" | "number" | "pick" | "multi" | "height";
  ph?: string; sub?: string; opts?: string[];
}
const Q: Question[] = [
  { k:"name",      label:"What should we call you?",                    type:"text",   ph:"e.g. Nishant" },
  { k:"age",       label:"Your age",                                    type:"number", ph:"e.g. 32" },
  { k:"sex",       label:"Sex",                                         type:"pick",   opts:["Male","Female","Other"] },
  { k:"heightFt", label:"Your height", type:"height" },
  { k:"weight",    label:"Current weight (kg)",                         type:"number", ph:"e.g. 78" },
  { k:"target",    label:"Target weight (kg)",                          type:"number", ph:"e.g. 72",
    sub:"Enter the same number as your current weight if you want to maintain." },
  { k:"timeline",  label:"When do you want to reach your target?",      type:"pick",
    sub:"We'll calibrate your daily calories to match your pace.",
    opts:["1 month (aggressive)","3 months","6 months (recommended)","1 year","No fixed timeline"] },
  { k:"goal",      label:"Your primary goal",                           type:"pick",   opts:["Weight loss","Muscle gain","Maintain weight","General fitness"] },
  { k:"condition", label:"Any medical condition we should plan around?", type:"pick",
    opts:["None","Diabetes / pre-diabetes","High BP (hypertension)","High cholesterol","Thyroid (hypothyroid)","Pregnant","Breastfeeding","Other"] },
  { k:"diet",      label:"Your food preference",                        type:"pick",   opts:["Pure veg","Egg + veg","Non-veg","Vegan","Jain"] },
  { k:"region",    label:"Which cuisines do you enjoy?",                type:"multi",  sub:"Pick one or more — your plan mixes from these.", opts:["North Indian","South Indian","East Indian","West Indian","Punjabi","Gujarati","Rajasthani","Bengali","Goan","Coastal","Continental","East Asian"] },
  { k:"activity",  label:"Your daily activity level",                   type:"pick",   opts:["Mostly desk job","On feet / moderate","Physically active"] },
  { k:"exercise",  label:"Exercise routine",                            type:"pick",   opts:["None","Walks / light","Gym 3x week","Gym 5x+ / sports"] },
  { k:"meals",     label:"Meals per day you prefer",                    type:"pick",   opts:["3 meals","3 meals + 2 snacks","5-6 small meals"] },
  { k:"cooktime",  label:"How do meals usually happen?",                type:"pick",   opts:["Minimal cooking (10-15 min)","Moderate (30 min)","I enjoy cooking","I get cooking help","I order online mostly"] },
  { k:"avoid",     label:"Allergies / foods to avoid",                  type:"text",   sub:"Optional — skip if none.", ph:"e.g. lactose, peanuts" },
];

/* ─────────────── food database (with quantities) ─────────────── */
interface FoodItem {
  n: string; c: number; q: string;
  slot: string[]; reg: string[];
  simple?: number; jain?: number; egg?: number; meat?: number; fish?: number; dairy?: number;
  t: string[];
}

const DB: FoodItem[] = [
  /* ── Breakfast ── */
  {n:"Vegetable poha",                    c:300,q:"1½ cups (250g)",                                           slot:["b"],reg:["w","all"],simple:1,t:["fiber"]},
  {n:"Besan chilla with mint chutney",    c:280,q:"2 chillas (160g) + 2 tbsp chutney",                       slot:["b"],reg:["n","all"],jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Moong dal cheela",                  c:260,q:"2 cheelas (140g)",                                        slot:["b"],reg:["n","all"],jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Oats with milk, banana & seeds",   c:290,q:"½ cup oats + 200ml milk + 1 banana",                     slot:["b"],reg:["all"],dairy:1,simple:1,t:["fiber","lowgi"]},
  {n:"Oats with almond milk & fruit",    c:280,q:"½ cup oats + 200ml almond milk + ½ cup fruit",           slot:["b"],reg:["all"],jain:1,simple:1,t:["fiber","lowgi"]},
  {n:"Vegetable upma",                    c:300,q:"1½ cups (220g)",                                           slot:["b"],reg:["s","all"],simple:1,t:["fiber"]},
  {n:"Idli (3) with coconut chutney",    c:280,q:"3 idlis (180g) + 3 tbsp chutney",                        slot:["b"],reg:["s"],jain:1,simple:1,t:["lowgi"]},
  {n:"Idli (3) with sambar",             c:290,q:"3 idlis (180g) + 1 cup sambar",                           slot:["b"],reg:["s"],simple:1,t:["fiber","lowgi"]},
  {n:"Masala dosa with chutney",         c:420,q:"1 dosa (120g) + 2 tbsp chutney",                          slot:["b"],reg:["s"],t:["fried"]},
  {n:"Plain dosa with sambar",           c:350,q:"1 dosa (100g) + 1 cup sambar",                            slot:["b"],reg:["s"],simple:1,t:[]},
  {n:"Pesarattu (moong dosa)",           c:300,q:"2 dosas (160g)",                                           slot:["b"],reg:["s"],simple:1,t:["protein","lowgi"]},
  {n:"Ragi dosa",                         c:280,q:"2 dosas (150g)",                                          slot:["b"],reg:["s"],simple:1,t:["lowgi","fiber"]},
  {n:"Aloo paratha with curd",           c:430,q:"2 parathas (200g) + ½ cup curd",                          slot:["b"],reg:["n"],dairy:1,t:[]},
  {n:"Paneer paratha with curd",         c:450,q:"2 parathas (200g) + ½ cup curd",                          slot:["b"],reg:["n"],dairy:1,t:["protein"]},
  {n:"Methi thepla with curd",           c:340,q:"2 theplas (120g) + ½ cup curd",                           slot:["b"],reg:["w"],dairy:1,t:["fiber"]},
  {n:"Steamed dhokla",                    c:250,q:"4 pieces (150g) + chutney",                               slot:["b","es"],reg:["w"],jain:1,simple:1,t:["lowgi","protein"]},
  {n:"Handvo slice",                      c:300,q:"2 slices (150g)",                                          slot:["b"],reg:["w"],dairy:1,jain:1,t:["fiber"]},
  {n:"Vegetable daliya",                  c:260,q:"1½ cups (220g)",                                           slot:["b"],reg:["all"],jain:1,simple:1,t:["fiber","lowgi"]},
  {n:"Ragi porridge",                     c:240,q:"1½ cups (250ml)",                                          slot:["b"],reg:["s","all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Sprout & veg salad bowl",          c:220,q:"1½ cups sprouts + 1 cup veggies (300g)",                  slot:["b","es"],reg:["all"],jain:1,simple:1,t:["protein","lowgi","fiber"]},
  {n:"Boiled eggs (2) with toast",       c:280,q:"2 boiled eggs + 2 slices whole wheat toast",             slot:["b"],reg:["all"],egg:1,simple:1,t:["protein"]},
  {n:"Egg bhurji with roti",             c:360,q:"2-egg bhurji + 2 rotis (60g each)",                       slot:["b"],reg:["all"],egg:1,t:["protein"]},
  {n:"Bread omelette",                    c:320,q:"2-egg omelette + 2 bread slices",                         slot:["b"],reg:["all"],egg:1,simple:1,t:["protein"]},
  {n:"Chirer pulao (Bengali poha)",      c:300,q:"1½ cups (240g)",                                           slot:["b"],reg:["e"],simple:1,t:["fiber"]},
  {n:"Luchi with aloo dom",              c:430,q:"3 luchis (90g) + ½ cup aloo dom",                         slot:["b"],reg:["e"],t:["fried"]},
  {n:"Vegetable khichuri",               c:320,q:"1½ cups (270g)",                                           slot:["b","d"],reg:["e","all"],jain:1,simple:1,t:["fiber","lowgi"]},
  {n:"Misal pav",                         c:450,q:"1 cup misal (200g) + 2 pavs",                             slot:["b"],reg:["w"],t:["fiber","protein"]},
  {n:"Sabudana khichdi",                  c:350,q:"1½ cups (220g)",                                           slot:["b","es"],reg:["w"],t:[]},
  {n:"Banana peanut-butter toast",       c:320,q:"2 toast slices + 2 tbsp peanut butter + 1 banana",       slot:["b"],reg:["all"],jain:1,simple:1,t:[]},

  /* ── Mid-morning snacks ── */
  {n:"Seasonal fruit bowl",              c:90, q:"1 cup mixed fruit (150g)",                                 slot:["ms","es"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"An apple",                          c:80, q:"1 medium apple (150g)",                                   slot:["ms"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Buttermilk (chaas)",               c:80, q:"1 glass (250ml)",                                          slot:["ms","es"],reg:["w","s","all"],dairy:1,jain:1,simple:1,t:["lowgi"]},
  {n:"Tender coconut water",             c:60, q:"1 tender coconut (~250ml)",                               slot:["ms"],reg:["s","all"],jain:1,simple:1,t:["lowgi"]},
  {n:"Roasted chana (handful)",          c:120,q:"¼ cup (40g)",                                              slot:["ms","es"],reg:["all"],jain:1,simple:1,t:["protein","fiber"]},
  {n:"Moong sprouts cup",                c:110,q:"1 cup sprouts (100g)",                                     slot:["ms"],reg:["all"],jain:1,simple:1,t:["protein","lowgi","fiber"]},
  {n:"Greek yogurt",                      c:100,q:"150g (¾ cup)",                                            slot:["ms"],reg:["all"],dairy:1,jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Soaked almonds (6)",               c:90, q:"6 almonds (12g)",                                          slot:["ms"],reg:["all"],jain:1,simple:1,t:["protein","fiber"]},
  {n:"Papaya bowl",                       c:80, q:"1 cup papaya (150g)",                                     slot:["ms"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},

  /* ── Evening snacks ── */
  {n:"Green tea with roasted makhana",   c:110,q:"1 cup tea + ½ cup makhana (20g)",                        slot:["es"],reg:["all"],jain:1,simple:1,t:["lowgi"]},
  {n:"Masala chai with 2 biscuits",      c:120,q:"1 cup chai (150ml) + 2 digestive biscuits",              slot:["es"],reg:["all"],dairy:1,simple:1,t:["sugary"]},
  {n:"Light bhel",                        c:180,q:"1½ cups (120g)",                                          slot:["es"],reg:["w"],simple:1,t:["fiber"]},
  {n:"Boiled egg with tea",              c:110,q:"1 boiled egg + 1 cup tea",                                 slot:["es"],reg:["all"],egg:1,dairy:1,simple:1,t:["protein"]},
  {n:"Roasted peanuts",                   c:160,q:"¼ cup (40g)",                                             slot:["es"],reg:["all"],jain:1,simple:1,t:["protein","fiber"]},
  {n:"Fruit chaat",                       c:120,q:"1 cup (180g)",                                            slot:["es"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Grilled veg sandwich",             c:220,q:"1 sandwich (2 slices + filling)",                         slot:["es"],reg:["all"],simple:1,t:["fiber"]},
  {n:"Chana sundal",                      c:150,q:"¾ cup (120g)",                                            slot:["es"],reg:["s"],simple:1,t:["protein","fiber"]},
  {n:"Pan-tossed paneer cubes",          c:160,q:"80g paneer",                                              slot:["es"],reg:["all"],dairy:1,jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Hummus with cucumber",             c:150,q:"3 tbsp hummus (60g) + 1 cup cucumber slices",            slot:["es"],reg:["all"],simple:1,t:["protein","lowgi","fiber"]},

  /* ── Lunch / Dinner ── */
  {n:"2 roti, dal tadka, bhindi & curd", c:520,q:"2 rotis (60g each) + 1 cup dal + 1 cup bhindi + ½ cup curd",     slot:["l","d"],reg:["n","all"],dairy:1,t:["fiber"]},
  {n:"2 roti, rajma & small rice",       c:560,q:"2 rotis (60g each) + 1 cup rajma + ½ cup cooked rice",           slot:["l","d"],reg:["n"],t:["fiber","protein"]},
  {n:"2 roti, chole & salad",            c:540,q:"2 rotis (60g each) + 1 cup chole + 1 cup salad",                slot:["l","d"],reg:["n"],t:["fiber","protein"]},
  {n:"Palak paneer with 2 roti",         c:540,q:"2 rotis (60g each) + 1 cup palak paneer (80g paneer)",          slot:["l","d"],reg:["n"],dairy:1,t:["fiber","protein"]},
  {n:"Dal makhani with jeera rice",      c:600,q:"1 cup dal makhani + 1 cup jeera rice (180g cooked)",            slot:["l","d"],reg:["n"],dairy:1,t:["protein"]},
  {n:"Mixed veg, dal & 2 roti",          c:500,q:"2 rotis (60g each) + 1 cup dal + 1 cup mixed veg",             slot:["l","d"],reg:["all"],jain:1,t:["fiber"]},
  {n:"Soya chunk curry with rice",       c:520,q:"1 cup curry (80g soya chunks) + 1 cup cooked rice",            slot:["l","d"],reg:["all"],t:["protein","fiber"]},
  {n:"Rice, sambar, rasam, poriyal & curd", c:540,q:"1½ cups rice + 1 cup sambar + 1 cup poriyal + ½ cup curd", slot:["l","d"],reg:["s"],dairy:1,t:["fiber"]},
  {n:"Curd rice with pickle",            c:420,q:"1½ cups curd rice (300g) + 1 tsp pickle",                       slot:["l","d"],reg:["s"],dairy:1,simple:1,t:["highsalt"]},
  {n:"Lemon rice with papad & salad",   c:460,q:"1½ cups lemon rice + 1 papad + 1 cup salad",                    slot:["l","d"],reg:["s"],simple:1,t:["highsalt"]},
  {n:"Bisi bele bath",                   c:520,q:"1½ cups (300g)",                                                  slot:["l","d"],reg:["s"],dairy:1,t:["fiber","protein"]},
  {n:"Rice, kootu & thoran",             c:500,q:"1½ cups rice + 1 cup kootu + ½ cup thoran",                     slot:["l","d"],reg:["s"],jain:1,t:["fiber"]},
  {n:"Avial with rice",                  c:480,q:"1½ cups rice + 1 cup avial (200g)",                              slot:["l","d"],reg:["s"],dairy:1,jain:1,t:["fiber"]},
  {n:"Fish curry with rice",             c:560,q:"1½ cups rice + 1 cup curry (100g fish)",                        slot:["l","d"],reg:["s","e"],fish:1,t:["protein"]},
  {n:"Chicken Chettinad with rice",      c:620,q:"1½ cups rice + 1 cup curry (120g chicken)",                     slot:["l","d"],reg:["s"],meat:1,t:["protein"]},
  {n:"Egg curry with rice",              c:540,q:"1½ cups rice + 1 cup curry (2 eggs)",                            slot:["l","d"],reg:["all"],egg:1,t:["protein"]},
  {n:"Rice, cholar dal, aloo posto & curd", c:540,q:"1½ cups rice + 1 cup cholar dal + ½ cup aloo posto + ½ cup curd", slot:["l","d"],reg:["e"],dairy:1,t:["fiber"]},
  {n:"Rice with macher jhol",            c:560,q:"1½ cups rice + 1 cup jhol (120g fish)",                         slot:["l","d"],reg:["e"],fish:1,t:["protein"]},
  {n:"Shukto with rice",                 c:460,q:"1½ cups rice + 1 cup shukto (200g)",                            slot:["l","d"],reg:["e"],dairy:1,t:["fiber"]},
  {n:"Rice, dal & begun bhaja",          c:500,q:"1½ cups rice + 1 cup dal + 2 begun bhaja",                      slot:["l","d"],reg:["e"],jain:1,simple:1,t:["fried"]},
  {n:"Gujarati thali (roti, dal, shaak, rice, curd)", c:560,q:"2 rotis + 1 cup dal + ½ cup shaak + ½ cup rice + ½ cup curd", slot:["l","d"],reg:["w"],dairy:1,jain:1,t:["fiber"]},
  {n:"Bajra roti, baingan bharta & chaas", c:480,q:"2 bajra rotis (80g each) + 1 cup bharta + 1 glass chaas",   slot:["l","d"],reg:["w"],dairy:1,t:["fiber","lowgi"]},
  {n:"Pithla bhakri",                    c:460,q:"2 bhakris (100g each) + ¾ cup pithla",                          slot:["l","d"],reg:["w"],jain:1,t:["fiber"]},
  {n:"Dal dhokli",                       c:520,q:"2 cups (350g)",                                                   slot:["l","d"],reg:["w"],jain:1,t:["fiber","protein"]},
  {n:"Undhiyu with roti",               c:540,q:"2 rotis (60g each) + 1½ cups undhiyu (300g)",                   slot:["l","d"],reg:["w"],t:["fiber"]},
  {n:"Chicken sukka with bhakri",        c:640,q:"2 bhakris (100g each) + 1 cup sukka (150g chicken)",            slot:["l","d"],reg:["w"],meat:1,t:["protein"]},
  {n:"Moong dal khichdi with curd",      c:420,q:"1½ cups khichdi (280g) + ½ cup curd",                           slot:["l","d"],reg:["all"],dairy:1,jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Moong dal khichdi (light)",        c:360,q:"1½ cups khichdi (250g)",                                         slot:["l","d"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Vegetable soup with 2 multigrain toast", c:320,q:"1½ cups soup + 2 toast slices",                           slot:["d"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Grilled chicken with sautéed veg", c:480,q:"150g chicken + 1½ cups sautéed veg",                           slot:["l","d"],reg:["all"],meat:1,simple:1,t:["protein","lowgi"]},
  {n:"Grilled fish with salad",          c:420,q:"150g fish + 1½ cups salad",                                      slot:["l","d"],reg:["all"],fish:1,simple:1,t:["protein","lowgi"]},
  {n:"Paneer tikka with salad",          c:420,q:"100g paneer tikka + 1½ cups salad",                             slot:["l","d"],reg:["all"],dairy:1,simple:1,t:["protein","lowgi"]},
  {n:"Tofu stir-fry with rice",         c:460,q:"120g tofu + 1 cup cooked rice (180g)",                          slot:["l","d"],reg:["all"],simple:1,t:["protein"]},
  {n:"Dal with 2 roti & salad",         c:460,q:"2 rotis (60g each) + 1 cup dal + 1 cup salad",                  slot:["l","d"],reg:["all"],jain:1,simple:1,t:["fiber","protein"]},
  {n:"Missi roti with seasonal sabzi",  c:440,q:"2 missi rotis (70g each) + 1 cup sabzi",                        slot:["l","d"],reg:["n","all"],jain:1,simple:1,t:["fiber"]},
  {n:"Veg pulao with raita",            c:480,q:"1½ cups pulao (280g) + ½ cup raita",                             slot:["l","d"],reg:["all"],dairy:1,jain:1,simple:1,t:["fiber"]},

  /* ── Bedtime ── */
  {n:"Turmeric milk",  c:120,q:"1 glass (250ml)",             slot:["bt"],reg:["all"],dairy:1,jain:1,simple:1,t:["lowgi"]},
  {n:"Warm milk",      c:110,q:"1 glass (250ml)",             slot:["bt"],reg:["all"],dairy:1,jain:1,simple:1,t:["lowgi"]},
  {n:"Chamomile tea",  c:10, q:"1 cup (200ml)",               slot:["bt"],reg:["all"],jain:1,simple:1,t:["lowgi"]},
  {n:"A few walnuts",  c:90, q:"3–4 walnuts (15g)",           slot:["bt"],reg:["all"],jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Soaked figs (2)",c:80, q:"2 figs soaked overnight",     slot:["bt"],reg:["all"],jain:1,simple:1,t:["fiber","lowgi"]},
];

const SLOTSET: Record<string,[string,number,string][]> = {
  "3 meals":            [["b",.32,"Breakfast"],["l",.40,"Lunch"],["d",.28,"Dinner"]],
  "3 meals + 2 snacks": [["b",.25,"Breakfast"],["ms",.10,"Mid-morning"],["l",.30,"Lunch"],["es",.12,"Evening snack"],["d",.23,"Dinner"]],
  "5-6 small meals":    [["b",.22,"Breakfast"],["ms",.12,"Mid-morning"],["l",.26,"Lunch"],["es",.12,"Evening snack"],["d",.20,"Dinner"],["bt",.08,"Bedtime"]],
};
const RMAP: Record<string,string> = {
  "North Indian":"n","South Indian":"s","East Indian":"e","West Indian":"w",
  "Punjabi":"n","Gujarati":"w","Rajasthani":"n","Bengali":"e",
  "Goan":"w","Coastal":"s","Continental":"all","East Asian":"all",
};
const COND_SHORT: Record<string,string> = {
  "Diabetes / pre-diabetes":"blood sugar","High BP (hypertension)":"blood pressure",
  "High cholesterol":"cholesterol","Thyroid (hypothyroid)":"thyroid",
  "Pregnant":"pregnancy","Breastfeeding":"breastfeeding",
};

/* ─────────────── Food diary reference database ─────────────── */
interface LogFood { n: string; c: number; q: string; cat: string; }
const LOG_DB: LogFood[] = [
  /* Grains & Staples */
  {n:"Steamed rice",c:260,q:"1 cup cooked (180g)",cat:"Grains"},
  {n:"Basmati rice",c:240,q:"1 cup cooked (180g)",cat:"Grains"},
  {n:"Brown rice",c:215,q:"1 cup cooked (180g)",cat:"Grains"},
  {n:"Whole wheat roti / chapati",c:80,q:"1 roti (30g)",cat:"Grains"},
  {n:"Multigrain roti",c:75,q:"1 roti (30g)",cat:"Grains"},
  {n:"Plain paratha",c:180,q:"1 paratha (60g)",cat:"Grains"},
  {n:"Stuffed aloo paratha",c:300,q:"1 paratha (90g)",cat:"Grains"},
  {n:"Naan",c:260,q:"1 naan (80g)",cat:"Grains"},
  {n:"Puri",c:150,q:"2 puris (50g)",cat:"Grains"},
  {n:"White bread",c:70,q:"1 slice (30g)",cat:"Grains"},
  {n:"Brown/whole wheat bread",c:65,q:"1 slice (30g)",cat:"Grains"},
  {n:"Poha (cooked)",c:300,q:"1.5 cups (220g)",cat:"Grains"},
  {n:"Upma",c:230,q:"1 cup (180g)",cat:"Grains"},
  {n:"Oats (cooked)",c:150,q:"1 cup (180g)",cat:"Grains"},
  {n:"Daliya / broken wheat porridge",c:220,q:"1 cup (190g)",cat:"Grains"},
  {n:"Semolina / suji upma",c:230,q:"1 cup (180g)",cat:"Grains"},
  {n:"Idli",c:80,q:"1 idli (50g)",cat:"Grains"},
  {n:"Dosa (plain)",c:175,q:"1 medium dosa (75g)",cat:"Grains"},
  {n:"Uttapam",c:220,q:"1 medium (100g)",cat:"Grains"},
  /* Dal & Legumes */
  {n:"Dal tadka (yellow dal)",c:180,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Dal makhani",c:320,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Rajma curry",c:230,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Chana masala",c:280,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Moong dal",c:200,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Sambar",c:130,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Kadhi",c:160,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Chole",c:260,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Lobia / black-eyed peas",c:200,q:"1 cup (200g)",cat:"Dal & Legumes"},
  /* Vegetables */
  {n:"Aloo sabzi",c:200,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Palak paneer",c:280,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Paneer bhurji",c:250,q:"1 cup (150g)",cat:"Vegetables"},
  {n:"Shahi paneer",c:340,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Mixed veg sabzi",c:120,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Gobi / cauliflower sabzi",c:130,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Baingan bharta",c:150,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Bhindi sabzi",c:130,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Lauki / bottle gourd sabzi",c:80,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Palak / spinach sabzi",c:100,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Aloo matar",c:220,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Raita",c:80,q:"1 cup (150g)",cat:"Vegetables"},
  /* Protein */
  {n:"Paneer (plain)",c:265,q:"100g",cat:"Protein"},
  {n:"Egg — boiled",c:78,q:"1 large egg (50g)",cat:"Protein"},
  {n:"Egg — omelette (2-egg)",c:190,q:"2-egg omelette (100g)",cat:"Protein"},
  {n:"Egg bhurji (2-egg)",c:200,q:"2-egg scramble (100g)",cat:"Protein"},
  {n:"Chicken curry",c:300,q:"1 cup (200g)",cat:"Protein"},
  {n:"Chicken breast — grilled",c:165,q:"100g",cat:"Protein"},
  {n:"Chicken — tandoori",c:220,q:"2 pieces (150g)",cat:"Protein"},
  {n:"Fish curry",c:280,q:"1 cup (200g)",cat:"Protein"},
  {n:"Fish — grilled / steamed",c:140,q:"100g",cat:"Protein"},
  {n:"Mutton curry",c:380,q:"1 cup (200g)",cat:"Protein"},
  {n:"Prawns — cooked",c:160,q:"100g",cat:"Protein"},
  {n:"Tofu — plain",c:76,q:"100g",cat:"Protein"},
  {n:"Soya chunks (dry)",c:345,q:"50g dry",cat:"Protein"},
  /* Dairy */
  {n:"Full fat milk",c:150,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Toned milk",c:120,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Dahi / curd",c:120,q:"1 cup (200g)",cat:"Dairy"},
  {n:"Greek yogurt",c:100,q:"150g",cat:"Dairy"},
  {n:"Butter",c:35,q:"1 tsp (5g)",cat:"Dairy"},
  {n:"Ghee",c:45,q:"1 tsp (5g)",cat:"Dairy"},
  {n:"Cheese slice",c:70,q:"1 slice (20g)",cat:"Dairy"},
  {n:"Lassi — sweet",c:230,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Lassi — salted",c:150,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Buttermilk / chaas",c:70,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Paneer (50g)",c:132,q:"50g",cat:"Dairy"},
  /* Snacks & Street Food */
  {n:"Samosa",c:260,q:"1 medium samosa",cat:"Snacks"},
  {n:"Pakoda / bhajiya (4 pcs)",c:200,q:"4 pieces (80g)",cat:"Snacks"},
  {n:"Vada pav",c:250,q:"1 piece",cat:"Snacks"},
  {n:"Pav bhaji (2 pav)",c:450,q:"2 pav + bhaji",cat:"Snacks"},
  {n:"Pani puri (6 pcs)",c:180,q:"6 pieces",cat:"Snacks"},
  {n:"Bhel puri",c:180,q:"1 cup (120g)",cat:"Snacks"},
  {n:"Dhokla (4 pcs)",c:200,q:"4 pieces (150g)",cat:"Snacks"},
  {n:"Roasted chana",c:190,q:"50g",cat:"Snacks"},
  {n:"Makhana / fox nuts",c:100,q:"30g",cat:"Snacks"},
  {n:"Namkeen mixture",c:140,q:"30g",cat:"Snacks"},
  {n:"Potato chips",c:160,q:"1 small pack (30g)",cat:"Snacks"},
  {n:"Biscuits — Marie (4)",c:120,q:"4 biscuits (28g)",cat:"Snacks"},
  {n:"Biscuits — digestive (2)",c:140,q:"2 biscuits (30g)",cat:"Snacks"},
  /* Fruits */
  {n:"Banana",c:90,q:"1 medium (100g)",cat:"Fruits"},
  {n:"Apple",c:80,q:"1 medium (150g)",cat:"Fruits"},
  {n:"Mango (Alfonso/Langra)",c:100,q:"1 cup chunks (150g)",cat:"Fruits"},
  {n:"Papaya",c:55,q:"1 cup (150g)",cat:"Fruits"},
  {n:"Watermelon",c:80,q:"2 cups (300g)",cat:"Fruits"},
  {n:"Grapes",c:110,q:"1 cup (150g)",cat:"Fruits"},
  {n:"Orange",c:62,q:"1 medium (130g)",cat:"Fruits"},
  {n:"Guava",c:68,q:"1 medium (100g)",cat:"Fruits"},
  {n:"Pineapple",c:82,q:"1 cup chunks (150g)",cat:"Fruits"},
  {n:"Pomegranate",c:105,q:"1 cup arils (150g)",cat:"Fruits"},
  {n:"Chickoo / sapota",c:120,q:"1 medium (100g)",cat:"Fruits"},
  {n:"Dates",c:110,q:"3 pieces (30g)",cat:"Fruits"},
  /* Beverages */
  {n:"Chai — milk + sugar",c:80,q:"1 cup (200ml)",cat:"Beverages"},
  {n:"Black tea / green tea",c:5,q:"1 cup (200ml)",cat:"Beverages"},
  {n:"Coffee — with milk + sugar",c:90,q:"1 cup (200ml)",cat:"Beverages"},
  {n:"Black coffee",c:5,q:"1 cup (200ml)",cat:"Beverages"},
  {n:"Coconut water",c:60,q:"1 tender coconut (250ml)",cat:"Beverages"},
  {n:"Cold drink / cola (can)",c:140,q:"1 can (330ml)",cat:"Beverages"},
  {n:"Fresh fruit juice",c:100,q:"1 glass (200ml)",cat:"Beverages"},
  {n:"Sugarcane juice",c:180,q:"1 glass (250ml)",cat:"Beverages"},
  {n:"Protein shake (whey, 1 scoop)",c:120,q:"30g powder in water",cat:"Beverages"},
  /* Restaurant & Takeout */
  {n:"Biryani — chicken (plate)",c:540,q:"1 plate (350g)",cat:"Restaurant"},
  {n:"Biryani — veg (plate)",c:450,q:"1 plate (300g)",cat:"Restaurant"},
  {n:"Chole bhature",c:680,q:"2 bhature + chole",cat:"Restaurant"},
  {n:"North Indian thali (full)",c:900,q:"1 full thali",cat:"Restaurant"},
  {n:"Masala dosa",c:420,q:"1 dosa + chutney",cat:"Restaurant"},
  {n:"Pizza — veg (1 slice)",c:250,q:"1 medium slice (100g)",cat:"Restaurant"},
  {n:"Pizza — non-veg (1 slice)",c:290,q:"1 medium slice (110g)",cat:"Restaurant"},
  {n:"Burger — veg",c:290,q:"1 standard burger",cat:"Restaurant"},
  {n:"Burger — chicken",c:380,q:"1 standard burger",cat:"Restaurant"},
  {n:"French fries — medium",c:340,q:"medium serving (115g)",cat:"Restaurant"},
  {n:"Fried rice — veg",c:350,q:"1 plate (200g)",cat:"Restaurant"},
  {n:"Noodles — Hakka (veg)",c:380,q:"1 plate (200g)",cat:"Restaurant"},
  {n:"Paneer butter masala",c:360,q:"1 cup (180g)",cat:"Restaurant"},
  /* Sweets & Desserts */
  {n:"Gulab jamun",c:125,q:"1 piece (50g)",cat:"Sweets"},
  {n:"Ladoo — besan",c:175,q:"1 piece (40g)",cat:"Sweets"},
  {n:"Kheer / rice pudding",c:280,q:"1 cup (200g)",cat:"Sweets"},
  {n:"Gajar halwa",c:250,q:"1 cup (150g)",cat:"Sweets"},
  {n:"Rasgulla",c:100,q:"1 piece (50g)",cat:"Sweets"},
  {n:"Ice cream (vanilla)",c:130,q:"1 scoop (65g)",cat:"Sweets"},
  {n:"Chocolate (dark)",c:170,q:"30g (3 squares)",cat:"Sweets"},
  {n:"Jalebi",c:150,q:"2 pieces (50g)",cat:"Sweets"},
  /* Nuts, Seeds & Fats */
  {n:"Almonds",c:70,q:"10 almonds (12g)",cat:"Nuts & Fats"},
  {n:"Cashews",c:85,q:"10 cashews (14g)",cat:"Nuts & Fats"},
  {n:"Walnuts",c:130,q:"6 halves (14g)",cat:"Nuts & Fats"},
  {n:"Peanuts — roasted",c:160,q:"¼ cup (40g)",cat:"Nuts & Fats"},
  {n:"Peanut butter",c:95,q:"1 tbsp (16g)",cat:"Nuts & Fats"},
  {n:"Cooking oil",c:40,q:"1 tsp (5ml)",cat:"Nuts & Fats"},
  {n:"Ghee",c:45,q:"1 tsp (5g)",cat:"Nuts & Fats"},
  {n:"Coconut — grated",c:90,q:"¼ cup (20g)",cat:"Nuts & Fats"},
  {n:"Honey",c:64,q:"1 tbsp (21g)",cat:"Nuts & Fats"},
  {n:"Sugar",c:48,q:"1 tbsp (12g)",cat:"Nuts & Fats"},
];

/* ─────────────── calorie calculation ─────────────── */
function mapRegions(arr: string[]): string[] {
  if (!arr||!arr.length) return ["n","s","e","w","all"];
  const mapped=[...new Set(arr.map(x=>RMAP[x]).filter(Boolean))];
  if(["n","s","e","w"].every(r=>mapped.includes(r)||mapped.includes("all"))) return ["n","s","e","w","all"];
  return [...mapped,"all"];
}

function calcStats(d: Profile) {
  const cm=((+(d.heightFt||0))*12+(+(d.heightIn||0)))*2.54;
  const w=+(d.weight||70), age=+(d.age||30);
  const isFemale=d.sex==="Female";

  /* Mifflin-St Jeor BMR — most validated equation for Indian adults */
  const bmr=isFemale?(10*w+6.25*cm-5*age-161):(10*w+6.25*cm-5*age+5);

  /* Activity × Exercise combined PAL matrix (based on WHO/FAO 2001 recommendations) */
  const PAL: Record<string,Record<string,number>>={
    "Mostly desk job":    {"None":1.2,"Walks / light":1.375,"Gym 3x week":1.55,"Gym 5x+ / sports":1.65},
    "On feet / moderate": {"None":1.375,"Walks / light":1.475,"Gym 3x week":1.6,"Gym 5x+ / sports":1.75},
    "Physically active":  {"None":1.55,"Walks / light":1.65,"Gym 3x week":1.75,"Gym 5x+ / sports":1.9},
  };
  const pal=PAL[d.activity||"Mostly desk job"]?.[d.exercise||"None"]??1.4;
  let tdee=bmr*pal;
  const baseTdee=tdee;

  const cond=d.condition||"None";
  /* Condition adjustments backed by clinical guidelines */
  if (cond==="Thyroid (hypothyroid)") tdee*=0.9;        // 10% reduced resting metabolism
  if (cond==="Pregnant")              tdee+=340;          // ACOG: +340 kcal in 2nd trimester
  else if (cond==="Breastfeeding")    tdee+=500;          // +500 kcal for full milk production

  const timeline=d.timeline||"6 months (recommended)";
  /* Safe deficit/surplus: 0.5–1 kg/week fat loss, 0.25 kg/week muscle gain */
  const deficitMap: Record<string,number>={
    "1 month (aggressive)":750,"3 months":500,
    "6 months (recommended)":350,"1 year":200,"No fixed timeline":150,
  };
  const surplusMap: Record<string,number>={
    "1 month (aggressive)":500,"3 months":350,
    "6 months (recommended)":250,"1 year":150,"No fixed timeline":100,
  };
  if (!["Pregnant","Breastfeeding"].includes(cond)) {
    if (d.goal==="Weight loss")  tdee-=deficitMap[timeline]??350;
    else if (d.goal==="Muscle gain") tdee+=surplusMap[timeline]??250;
  }

  /* Floor: never drop below BMR (starvation risk) or absolute minimum */
  const absMin=["Pregnant","Breastfeeding"].includes(cond)?1800:isFemale?1200:1500;
  tdee=Math.max(Math.max(bmr,absMin),tdee);

  /* Weekly estimate based on caloric differential */
  const weeklyKcal=(tdee-baseTdee)*7;                   // negative=deficit, positive=surplus
  const weeklyKg=(Math.abs(weeklyKcal)/7700).toFixed(2);// 1 kg fat ≈ 7700 kcal
  const direction=weeklyKcal<-50?"loss":weeklyKcal>50?"gain":"";

  const bmi=w&&cm?w/((cm/100)**2):0;
  /* Asian BMI cutoffs (WHO Asia-Pacific, 2004) — standard Western cutoffs underestimate risk for Indians */
  const bmiCat=bmi<18.5?"Underweight":bmi<23?"Normal":bmi<27.5?"Overweight":"Obese";

  return {cm,bmi:bmi.toFixed(1),bmiCat,tdee:Math.round(tdee/10)*10,weeklyKg,direction};
}

function dietOK(f: FoodItem, diet: string) {
  if (diet==="Non-veg") return true;
  if (f.meat||f.fish) return false;
  if (diet==="Egg + veg") return true;
  if (f.egg) return false;
  if (diet==="Pure veg") return true;
  if (diet==="Vegan") return !f.dairy;
  if (diet==="Jain") return !!f.jain;
  return true;
}
function condOK(f: FoodItem, cond: string) {
  if (cond==="Diabetes / pre-diabetes") return !f.t.includes("sugary");
  if (cond==="High BP (hypertension)") return !f.t.includes("highsalt");
  if (cond==="High cholesterol") return !f.t.includes("fried");
  if (cond==="Thyroid (hypothyroid)") return !f.t.includes("goitrogen");
  return true;
}

interface MealCtx { goal:string; cond:string; diet:string; regions:string[]; simplePref:boolean; }

function cands(slot: string, ctx: MealCtx, relax: number): FoodItem[] {
  return DB.filter(f=>{
    if (!f.slot.includes(slot)) return false;
    if (!dietOK(f,ctx.diet)) return false;
    if (relax<2&&!f.reg.some(r=>ctx.regions.includes(r))) return false;
    if (relax<1&&!condOK(f,ctx.cond)) return false;
    return true;
  });
}

function pickMeal(slot: string, target: number, di: number, used: Set<string>, ctx: MealCtx): FoodItem {
  let list: FoodItem[]=[];
  for (let r=0;r<3&&!list.length;r++) list=cands(slot,ctx,r);
  if (!list.length) return {n:"Seasonal fruit & nuts",c:target,q:"1 serving",slot:[slot],reg:["all"],t:[]};
  const scored=list.map(f=>{
    let s=-Math.abs(f.c-target)/Math.max(target,1);
    if (ctx.goal==="Muscle gain"&&f.t.includes("protein")) s+=0.45;
    if ((ctx.goal==="Weight loss"||ctx.cond==="Diabetes / pre-diabetes")&&(f.t.includes("lowgi")||f.t.includes("fiber"))) s+=0.3;
    if (ctx.cond==="High cholesterol"&&f.t.includes("fiber")) s+=0.2;
    if (["Pregnant","Breastfeeding"].includes(ctx.cond)&&f.t.includes("protein")) s+=0.35;
    if (ctx.simplePref&&f.simple) s+=0.25;
    if (used.has(f.n)) s-=1.6;
    s+=(hashNum(f.n+di)%100)/900;
    return {f,s};
  }).sort((a,b)=>b.s-a.s);
  return scored[0].f;
}

function makeTips(p: Profile, _cal: number): string[] {
  const goalTips: Record<string,string[]>={
    "Weight loss":    ["Put protein in every meal — it keeps you full and protects muscle.","Finish dinner 2-3 hours before bed."],
    "Muscle gain":    ["Hit protein at every single meal — aim for a palm-sized source.","Eat your post-workout meal within 45 minutes of training."],
    "Maintain weight":["Consistency beats perfection — follow the 80/20 rule.","Keep portion sizes steady day to day."],
    "General fitness":["Build the habit first; the body follows.","Move daily, even a 20-min walk counts."],
  };
  const condTips: Record<string,string[]>={
    "Diabetes / pre-diabetes":["Eat fibre/veg first, carbs last — it blunts the sugar spike.","Take a 10-minute walk after meals."],
    "High BP (hypertension)":["Keep salt low — go easy on pickles, papad and packaged food.","Add potassium-rich foods like banana and coconut water."],
    "High cholesterol":["Avoid deep-fried food; use minimal oil for tadka.","Oats and soluble fibre help — keep them in your week."],
    "Thyroid (hypothyroid)":["Take thyroid medicine on an empty stomach, well before breakfast.","Don't skip meals — keep energy steady through the day."],
    "Pregnant":["Take iron, folate & calcium supplements as prescribed by your doctor.","Eat 5-6 small meals — large gaps can cause nausea.","Avoid raw/undercooked meat, raw sprouts and unpasteurised dairy."],
    "Breastfeeding":["Eat an extra 400–500 kcal for milk production — don't skip meals.","Stay very well hydrated — aim for 3+ litres of water a day.","Calcium-rich foods like curd, paneer and ragi support bone health."],
    "Other":["Review this plan with your doctor before starting."],
  };
  const g=goalTips[p.goal||""]||[];
  const c=condTips[p.condition||""]||[];
  const extra=p.cooktime==="I order online mostly"
    ?["When ordering, pick grilled, dal, roti, curd and salad over fried/creamy dishes."]
    :["Drink 2.5–3L water daily and aim for 7+ hours of sleep."];
  return [...g,...c,...extra].slice(0,5);
}

function buildPlan(profile: Profile): Plan {
  const st=calcStats(profile);
  const cal=st.tdee;
  const ctx: MealCtx={
    goal:profile.goal||"General fitness",
    cond:profile.condition||"None",
    diet:profile.diet||"Pure veg",
    regions:mapRegions(profile.region),
    simplePref:["Minimal cooking (10-15 min)","I order online mostly"].includes(profile.cooktime||""),
  };
  const slots=SLOTSET[profile.meals||"3 meals"]||SLOTSET["3 meals"];
  const weekUsed=new Set<string>();
  const days: PlanDay[]=(WEEK as readonly string[]).map((dn,di)=>{
    let raw=slots.map(([code,frac,label])=>{
      const m=pickMeal(code,Math.round(cal*frac),di,weekUsed,ctx);
      weekUsed.add(m.n);
      return {time:label,food:m.n,cal:m.c,qty:m.q};
    });
    const total=raw.reduce((a,b)=>a+b.cal,0);
    let f=total?cal/total:1; f=Math.max(0.78,Math.min(1.28,f));
    raw=raw.map(m=>({...m,cal:Math.round((m.cal*f)/5)*5}));
    if (di%7===6) weekUsed.clear();
    return {day:dn as DayName,meals:raw};
  });

  const cond=profile.condition||"None";
  const condClause=cond!=="None"&&cond!=="Other"
    ?` It's tuned to support your ${COND_SHORT[cond]||cond} — still, please review it with your doctor.`
    :cond==="Other"?" Since you flagged a condition, please clear this plan with your doctor first.":"";

  const regionArr=profile.region||[];
  const _regMapped=new Set((regionArr as string[]).map((x:string)=>RMAP[x]).filter(Boolean));
  const _allCovered=["n","s","e","w"].every(r=>_regMapped.has(r)||_regMapped.has("all"));
  const regLabel=(!regionArr.length||_allCovered)?"pan-Indian":regionArr.length<=2?(regionArr as string[]).join(" & "):`${(regionArr as string[])[0]} & ${regionArr.length-1} more cuisines`;

  const timeline=profile.timeline||"6 months (recommended)";
  const weeklyLoss=st.direction&&st.weeklyKg!=="0.00"
    ?`~${st.weeklyKg} kg / week ${st.direction}`:"";

  return {
    summary:`Here's a ${(profile.goal||"fitness").toLowerCase()} plan at about ${cal} kcal a day, built around ${regLabel} food you actually like.${condClause}`,
    dailyCalories:cal,bmi:st.bmi,bmiCat:st.bmiCat,
    goal:profile.goal||"General fitness",diet:profile.diet||"Pure veg",
    condition:cond,regLabel,timeline,weeklyLoss,
    tips:makeTips(profile,cal),days,
  };
}

/* ─────────────── UI primitives ─────────────── */
function Logo({size=40}:{size?:number}) {
  const id="lg"+size;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#22C16B"/><stop offset="1" stopColor="#0E8A4D"/>
      </linearGradient></defs>
      <rect width="48" height="48" rx="14" fill={`url(#${id})`}/>
      <path d="M24 13c-5 0-9 3.5-9 9 0 6 5 11 9 13 4-2 9-7 9-13 0-5.5-4-9-9-9z" fill="#fff" opacity="0.18"/>
      <path d="M24 12c-1 5-4 7-7 8 0 6 3.5 9 7 11 3.5-2 7-5 7-11-3-1-6-3-7-8z" fill="#fff"/>
      <path d="M14 30h6l2-4 3 8 2-4h7" stroke="#0E8A4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
function CalRing({pct=1,size=110,color="#fff",track="rgba(255,255,255,0.25)",big,small}:{
  pct?:number;size?:number;color?:string;track?:string;big?:number|string;small?:string;
}) {
  const r=(size-14)/2,c=2*Math.PI*r,off=c*(1-Math.max(0,Math.min(1,pct)));
  return (
    <div className="relative" style={{width:size,height:size}}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth="9" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="9" fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{transition:"stroke-dashoffset .7s ease"}}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold leading-none" style={{fontSize:size*0.2,color}}>{big}</span>
        <span style={{fontSize:size*0.1,color,opacity:0.85}}>{small}</span>
      </div>
    </div>
  );
}

const MEAL_UI: Record<string,{Icon:React.ElementType;col:string}> = {
  "Breakfast":{Icon:Sunrise,col:"#F59E0B"},"Mid-morning":{Icon:Apple,col:"#F43F5E"},
  "Lunch":{Icon:Utensils,col:"#1DAA61"},"Evening snack":{Icon:Cookie,col:"#8B5CF6"},
  "Dinner":{Icon:Moon,col:"#6366F1"},"Bedtime":{Icon:Moon,col:"#64748B"},
};

function Shell({children,wide}:{children:React.ReactNode;wide?:boolean}) {
  return (
    <div className="min-h-screen py-8 px-4" style={{background:"linear-gradient(180deg,#F3FBF6 0%,#F7F8FA 40%)"}}>
      <div className={`mx-auto ${wide?"max-w-3xl":"max-w-md"}`}>{children}</div>
    </div>
  );
}
function Card({children,className=""}:{children:React.ReactNode;className?:string}) {
  return <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 ${className}`}>{children}</div>;
}
function Chip({label,val,accent}:{label:string;val:string;accent?:boolean}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 px-3 py-2.5 shadow-sm">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`font-semibold text-sm mt-0.5 ${accent?"":"text-gray-800"}`}
        style={accent?{color:GREEN}:{}}>{val}</div>
    </div>
  );
}

/* ─────────────── PlanWeek ─────────────── */
function PlanWeek({plan}:{plan:Plan}) {
  const [sel,setSel]=useState(plan.days[0].day);
  const day=plan.days.find(d=>d.day===sel)!;
  const total=day.meals.reduce((a,b)=>a+b.cal,0);
  return (
    <Card className="p-5 mb-5">
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {plan.days.map(d=>(
          <button key={d.day} onClick={()=>setSel(d.day)}
            className={`px-3.5 py-2 rounded-xl text-sm whitespace-nowrap font-semibold transition ${sel===d.day?"text-white shadow":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            style={sel===d.day?{background:GREEN}:{}}>
            {d.day.slice(0,3)}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{day.day}</h3>
        <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{background:"#EAF7F0",color:GREEN}}>{total} kcal</span>
      </div>
      <div key={sel} style={{animation:"eFade .35s ease both"}}>
        {day.meals.map((m,i)=>{
          const ui=MEAL_UI[m.time]||MEAL_UI["Lunch"];
          const Icon=ui.Icon;
          const last=i===day.meals.length-1;
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{background:ui.col+"1A"}}>
                  <Icon size={18} style={{color:ui.col}}/>
                </div>
                {!last&&<div className="w-0.5 flex-1 my-1" style={{background:"#EEF1F4"}}/>}
              </div>
              <div className={`flex-1 ${last?"":"pb-4"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{color:ui.col}}>{m.time}</span>
                  <span className="text-xs font-semibold" style={{color:GREEN}}>{m.cal} kcal</span>
                </div>
                <p className="text-gray-800 font-semibold mt-0.5 leading-snug">{m.food}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Scale size={11} className="text-gray-400 shrink-0"/>
                  <span className="text-xs text-gray-400">{m.qty}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ─────────────── WeightLog ─────────────── */
function WeightLog({t,onLog}:{t:Tracking;onLog:(w:number)=>void}) {
  const [w,setW]=useState("");
  const entries=Object.entries(t.weights||{}).sort() as [string,number][];
  const latest=entries.length?entries[entries.length-1][1]:null;
  const first=entries.length?entries[0][1]:null;
  const diff=latest!=null&&first!=null?(latest-first).toFixed(1):null;
  return (
    <Card className="p-5">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
        <TrendingDown size={18} style={{color:GREEN}}/> Weight log
      </h3>
      <div className="flex gap-2 mb-3">
        <input type="number" value={w} onChange={e=>setW(e.target.value)}
          placeholder="Today's weight (kg)"
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500"/>
        <button onClick={()=>{if(w){onLog(+w);setW("");}}}
          className="px-6 rounded-2xl text-white font-semibold"
          style={{background:GREEN}}>Log</button>
      </div>
      {entries.length>0&&(
        <div className="text-sm text-gray-500">
          Latest: <b className="text-gray-700">{latest} kg</b>
          {diff!=null&&(
            <span style={{color:+diff<=0?GREEN:"#EA580C"}}>
              {" "}({+diff>0?"+":""}{diff} kg since start)
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

/* ─────────────── Onboarding stories ─────────────── */
function OnbSlide1() {
  const [ct,setCt]=useState(0);
  useEffect(()=>{
    const iv=setInterval(()=>setCt(c=>c>=2000?2000:c+55),30);
    return()=>clearInterval(iv);
  },[]);
  return(
    <div className="flex flex-col items-center text-center">
      <div className="mb-5" style={{fontSize:68}}>📚</div>
      <div className="font-black text-white leading-none mb-3" style={{fontSize:76}}>{ct.toLocaleString()}+</div>
      <p className="font-bold text-xl mb-5" style={{color:"#86efac"}}>Nutrition &amp; Dietetics<br/>Ebooks</p>
      <p className="leading-relaxed text-[15px] max-w-[280px]" style={{color:"rgba(255,255,255,0.62)"}}>
        Over <strong className="text-white">2,000 scientific ebooks</strong> on nutrition and dietetics were fed to the AI while building this app — so every recommendation is backed by real science.
      </p>
    </div>
  );
}
function OnbSlide2() {
  return(
    <div className="flex flex-col items-center text-center">
      <div className="mb-5 w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{background:"rgba(147,197,253,0.15)",backdropFilter:"blur(8px)",fontSize:38}}>🔐</div>
      <span className="inline-block rounded-full px-4 py-1 text-xs font-black mb-4 tracking-widest uppercase"
        style={{background:"rgba(147,197,253,0.15)",color:"#93c5fd"}}>Military-Grade Security</span>
      <h2 className="font-black text-white mb-4" style={{fontSize:50,lineHeight:1.1,letterSpacing:"-1px"}}>AES-256<br/>Encrypted</h2>
      <p className="leading-relaxed text-[15px] max-w-[280px]" style={{color:"rgba(255,255,255,0.62)"}}>
        Your health and personal data uses <strong className="text-white">AES-256</strong> — the gold standard used by governments and banks.{" "}
        <strong className="text-white">Not even the creators of this app can see your data.</strong>
      </p>
    </div>
  );
}
function OnbSlide3() {
  return(
    <div className="flex flex-col items-center text-center">
      <div className="mb-5" style={{fontSize:68}}>🫂</div>
      <span className="inline-block rounded-full px-4 py-1 text-xs font-black mb-4 tracking-widest uppercase"
        style={{background:"rgba(216,180,254,0.15)",color:"#d8b4fe"}}>Community First</span>
      <h2 className="font-black text-white mb-4" style={{fontSize:54,lineHeight:1.1,letterSpacing:"-1px"}}>Free.<br/>Forever.</h2>
      <p className="leading-relaxed text-[15px] max-w-[280px]" style={{color:"rgba(255,255,255,0.62)"}}>
        Unlike other health apps, EatBC is a <strong className="text-white">community tool</strong>.{" "}
        It will <strong className="text-white">never charge a premium for any feature</strong> — no paywalls, no tiers, ever.
      </p>
    </div>
  );
}
function OnbSlide4({anim}:{anim:number}) {
  return(
    <div className="relative flex flex-col items-center justify-center" style={{height:320}}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1"
        style={{opacity:anim>=2?0:1,transition:"opacity 0.6s ease",pointerEvents:"none"}}>
        <div style={{
          fontSize:52,fontWeight:900,color:"#ffffff",lineHeight:1.15,
          opacity:anim>=0?1:0,
          transform:anim>=1?"scale(0.82) translateY(6px)":"scale(1) translateY(0)",
          transition:"opacity 0.5s ease,transform 0.65s ease",
        }}>Eat Better</div>
        <div style={{
          fontSize:44,fontWeight:900,color:"#6ee7a0",lineHeight:1.15,
          opacity:anim>=1?1:0,
          transform:anim>=1?"scale(1) translateY(0)":"scale(0.8) translateY(16px)",
          transition:"opacity 0.5s ease 0.15s,transform 0.6s ease 0.15s",
        }}>&amp; Count</div>
      </div>
      <div className="flex flex-col items-center"
        style={{
          opacity:anim>=2?1:0,
          transform:anim>=2?"scale(1)":"scale(0.4)",
          transition:"opacity 0.7s ease,transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
        <Logo size={88}/>
        <h1 className="text-white font-black leading-none mt-3"
          style={{fontSize:76,letterSpacing:"-3px",
            textShadow:anim>=3?"0 0 40px rgba(46,206,120,0.6),0 0 80px rgba(46,206,120,0.3)":"none",
            transition:"text-shadow 0.8s ease",
          }}>EatBC</h1>
        <p className="font-bold text-lg mt-2" style={{color:"#86efac"}}>Eat Better. Change.</p>
      </div>
    </div>
  );
}
function Onboarding({onDone}:{onDone:()=>void}) {
  const [slide,setSlide]=useState(0);
  const [prog,setProg]=useState(0);
  const [anim,setAnim]=useState(0);
  const ivRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const STEP=100/(5000/100);

  useEffect(()=>{
    setProg(0);
    if(ivRef.current) clearInterval(ivRef.current);
    ivRef.current=setInterval(()=>{
      setProg(p=>{
        const next=p+STEP;
        if(next>=100){
          clearInterval(ivRef.current!);
          setTimeout(()=>{if(slide<3)setSlide(s=>s+1);else onDone();},0);
          return 100;
        }
        return next;
      });
    },100);
    return()=>{if(ivRef.current)clearInterval(ivRef.current);};
  },[slide]);

  useEffect(()=>{
    if(slide===3){
      setAnim(0);
      const t1=setTimeout(()=>setAnim(1),700);
      const t2=setTimeout(()=>setAnim(2),1900);
      const t3=setTimeout(()=>setAnim(3),2900);
      return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
    } else { setAnim(0); }
  },[slide]);

  function goNext(){
    if(ivRef.current) clearInterval(ivRef.current);
    if(slide<3) setSlide(slide+1); else onDone();
  }

  const BKGS=[
    "linear-gradient(155deg,#061c0f 0%,#083d1d 45%,#0c6130 100%)",
    "linear-gradient(155deg,#060c1f 0%,#0d1e52 45%,#163087 100%)",
    "linear-gradient(155deg,#130821 0%,#2d0f5e 45%,#5520a8 100%)",
    "linear-gradient(155deg,#010905 0%,#031407 45%,#062916 100%)",
  ];

  return(
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{background:BKGS[slide],transition:"background 0.5s ease"}}
      onClick={goNext}>
      {/* Story progress bars */}
      <div className="absolute left-0 right-0 flex gap-1.5 px-4 z-20" style={{top:52}}>
        {[0,1,2,3].map(i=>(
          <div key={i} className="flex-1 rounded-full overflow-hidden" style={{height:3,background:"rgba(255,255,255,0.22)"}}>
            <div className="h-full rounded-full bg-white" style={{width:i<slide?"100%":i===slide?`${prog}%`:"0%"}}/>
          </div>
        ))}
      </div>
      {/* Brand */}
      <div className="absolute left-4 z-20 flex items-center gap-2" style={{top:42}}>
        <Logo size={28}/>
        <span className="font-black text-white text-base tracking-tight">EatBC</span>
      </div>
      {/* Skip */}
      <button onClick={e=>{e.stopPropagation();onDone();}}
        className="absolute right-4 z-20 font-bold text-sm px-4 py-1.5 rounded-full"
        style={{top:40,background:"rgba(255,255,255,0.13)",backdropFilter:"blur(6px)",color:"rgba(255,255,255,0.82)"}}>
        Skip
      </button>
      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-7 pt-24 pb-6">
        {slide===0&&<OnbSlide1/>}
        {slide===1&&<OnbSlide2/>}
        {slide===2&&<OnbSlide3/>}
        {slide===3&&<OnbSlide4 anim={anim}/>}
      </div>
      {/* Dot nav */}
      <div className="pb-10 flex justify-center gap-2">
        {[0,1,2,3].map(i=>(
          <div key={i} className="rounded-full transition-all duration-300"
            style={{width:i===slide?22:7,height:7,background:i===slide?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.28)"}}/>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Welcome ─────────────── */
function Welcome({onNew,onLogin}:{onNew:()=>void;onLogin:()=>void}) {
  const [quote]=useState(pickQuote);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVisible(true),80);return()=>clearTimeout(t);},[]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{background:"linear-gradient(160deg,#064E30 0%,#0E8A4D 40%,#1DAA61 75%,#2DCE78 100%)"}}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{width:340,height:340,background:"rgba(255,255,255,0.06)",top:"-80px",right:"-80px"}}/>
        <div className="absolute rounded-full" style={{width:260,height:260,background:"rgba(255,255,255,0.05)",bottom:"-60px",left:"-60px"}}/>
        <div className="absolute rounded-full" style={{width:160,height:160,background:"rgba(255,255,255,0.07)",top:"45%",right:"-40px"}}/>
      </div>
      <div className={`relative z-10 w-full max-w-sm transition-all duration-700 ${visible?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="flex flex-col items-center mb-7">
          <Logo size={76}/>
          <h1 className="text-5xl font-black text-white mt-3 tracking-tight">EatBC</h1>
          <p className="text-green-200 font-medium text-base mt-1 tracking-wide">Eat Better. Change.</p>
        </div>
        <div className="relative mb-7 rounded-3xl overflow-hidden"
          style={{background:"linear-gradient(135deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0.08) 100%)",
            border:"1px solid rgba(255,255,255,0.22)",backdropFilter:"blur(12px)"}}>
          <div className="absolute top-3 left-4 text-white/20 font-black leading-none select-none"
            style={{fontSize:72,fontFamily:"Georgia,serif",lineHeight:1}}>"</div>
          <div className="px-6 pt-8 pb-6">
            <p className="text-white font-bold text-[1.05rem] leading-relaxed text-center"
              style={{textShadow:"0 1px 8px rgba(0,0,0,0.18)"}}>{quote}</p>
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <div className="h-px w-8 bg-white/30"/>
              <span className="text-green-200 text-xs font-semibold uppercase tracking-widest">Today's spark</span>
              <div className="h-px w-8 bg-white/30"/>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={onNew}
            className="group relative w-full py-4 px-5 rounded-2xl shadow-xl transition-all duration-150 active:scale-[0.97]"
            style={{background:"#ffffff",color:GREEN}}>
            <span className="absolute left-5 top-1/2 -translate-y-1/2"><UserPlus size={21}/></span>
            <span className="block text-center font-black text-[1.05rem]">I'm a New Warrior 🔥</span>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"><ArrowRight size={19}/></span>
          </button>
          <button onClick={onLogin}
            className="group relative w-full py-4 px-5 rounded-2xl transition-all duration-150 active:scale-[0.97] hover:bg-white/10"
            style={{border:"2px solid rgba(255,255,255,0.55)",color:"#ffffff"}}>
            <span className="absolute left-5 top-1/2 -translate-y-1/2"><User size={21}/></span>
            <span className="block text-center font-black text-[1.05rem]">I Already Hustle 💪</span>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"><ArrowRight size={19}/></span>
          </button>
        </div>
        <p className="text-center text-green-200/60 text-xs mt-6 flex items-center justify-center gap-1.5">
          <Stethoscope size={12}/> Not medical advice — consult your doctor for any condition.
        </p>
      </div>
    </div>
  );
}

/* ─────────────── Login ─────────────── */
function Login({onDone,onBack}:{onDone:(sess:Session,plan?:Plan|null,tracking?:Tracking)=>void;onBack:()=>void}) {
  const [id,setId]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit() {
    setErr(""); if (!id.trim()||!pw){setErr("Enter both fields");return;}
    setBusy(true);
    try {
      const data=await apiPost("/api/login",{id:id.toLowerCase().trim(),password:pw});
      onDone({id:data.user.id,name:data.user.name,token:data.token},data.plan,data.tracking);
    } catch(e:unknown) {
      setErr((e as {error?:string})?.error||"Login failed — check your details.");
    } finally { setBusy(false); }
  }
  return (
    <Shell>
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2"><Logo size={28}/><span className="font-bold text-gray-700">EatBC</span></div>
        <h2 className="text-2xl font-black text-gray-800 mt-4">Welcome back,<br/><span style={{color:GREEN}}>warrior!</span></h2>
        <p className="text-gray-400 text-sm mt-1 mb-6">Sign in to track your progress 🏆</p>
        <label className="text-sm font-semibold text-gray-600">Phone or Email</label>
        <input value={id} onChange={e=>setId(e.target.value)} placeholder="9876543210 or you@email.com"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-4 mt-1"/>
        <label className="text-sm font-semibold text-gray-600">Password</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-2 mt-1"
          onKeyDown={e=>e.key==="Enter"&&submit()}/>
        {err&&<div className="mb-3 flex items-center gap-2 text-red-500 text-sm"><AlertCircle size={16}/>{err}</div>}
        <button disabled={busy} onClick={submit}
          className="w-full py-3.5 rounded-2xl text-white font-black text-base disabled:opacity-60 shadow-md mt-2"
          style={{background:GREEN}}>
          {busy?<span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18}/>Signing in…</span>:"Let's Go! 🚀"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">
          No account yet?{" "}
          <button onClick={onBack} className="font-bold" style={{color:GREEN}}>Start your journey first →</button>
        </p>
      </Card>
    </Shell>
  );
}

/* ─────────────── Signup ─────────────── */
function Signup({profile,plan,onDone,onBack}:{profile:Profile;plan:Plan|null;onDone:(sess:Session)=>void;onBack:()=>void}) {
  const [id,setId]=useState(""); const [pw,setPw]=useState(""); const [pw2,setPw2]=useState("");
  const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
  async function submit() {
    setErr(""); if (!id.trim()||!pw){setErr("Enter both fields");return;}
    if (pw!==pw2){setErr("Passwords don't match");return;}
    if (pw.length<6){setErr("Password must be at least 6 characters");return;}
    setBusy(true);
    try {
      const name=profile?.name||id;
      const data=await apiPost("/api/register",{id:id.toLowerCase().trim(),name,password:pw});
      onDone({id:data.user.id,name:data.user.name,token:data.token});
    } catch(e:unknown) {
      setErr((e as {error?:string})?.error||"Registration failed — try again.");
    } finally { setBusy(false); }
  }
  return (
    <Shell>
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2"><Logo size={28}/><span className="font-bold text-gray-700">EatBC</span></div>
        <div className="rounded-2xl px-4 py-3 mb-5 mt-4" style={{background:"#EAF7F0"}}>
          <p className="text-sm font-bold" style={{color:GREEN}}>🎉 Challenge accepted, {profile?.name||"champ"}!</p>
          <p className="text-xs text-gray-500 mt-0.5">Create your account to unlock your personal tracker.</p>
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-5">Lock in your <span style={{color:GREEN}}>account</span> 🔐</h2>
        <label className="text-sm font-semibold text-gray-600">Phone or Email <span className="text-gray-400 font-normal">(your login ID)</span></label>
        <input value={id} onChange={e=>setId(e.target.value)} placeholder="9876543210 or you@email.com"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-4 mt-1"/>
        <label className="text-sm font-semibold text-gray-600">Set a Password</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Min 6 characters"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-4 mt-1"/>
        <label className="text-sm font-semibold text-gray-600">Confirm Password</label>
        <input type="password" value={pw2} onChange={e=>setPw2(e.target.value)} placeholder="Repeat password"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-2 mt-1"
          onKeyDown={e=>e.key==="Enter"&&submit()}/>
        <p className="text-xs text-gray-400 mb-4">Your data is encrypted with AES-256 and stored securely.</p>
        {err&&<div className="mb-3 flex items-center gap-2 text-red-500 text-sm"><AlertCircle size={16}/>{err}</div>}
        <button disabled={busy} onClick={submit}
          className="w-full py-3.5 rounded-2xl text-white font-black text-base disabled:opacity-60 shadow-md"
          style={{background:GREEN}}>
          {busy?<span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18}/>Creating…</span>:"Activate My Tracker 🏆"}
        </button>
        <button onClick={onBack} className="w-full text-center text-gray-400 text-sm mt-4">← Back to plan</button>
      </Card>
    </Shell>
  );
}

/* ─────────────── Food Logger ─────────────── */
function FoodLogger({log,onUpdate}:{log:FoodLog[];onUpdate:(l:FoodLog[])=>void}) {
  const [open,setOpen]=useState(false);
  const [search,setSearch]=useState("");
  const [pending,setPending]=useState<LogFood|null>(null);
  const [servings,setServings]=useState(1);
  const [cat,setCat]=useState("All");

  const total=log.reduce((s,x)=>s+x.cal,0);
  const CATS=["All",...Array.from(new Set(LOG_DB.map(f=>f.cat)))];
  const filtered=LOG_DB.filter(f=>{
    const matchSearch=!search||f.n.toLowerCase().includes(search.toLowerCase());
    const matchCat=cat==="All"||f.cat===cat;
    return matchSearch&&matchCat;
  }).slice(0,30);

  function addFood(){
    if(!pending)return;
    const cal=Math.round(pending.c*servings);
    const s=servings===1?"":`${servings}× `;
    onUpdate([...log,{n:pending.n,cal,qty:`${s}${pending.q}`,servings}]);
    setPending(null); setServings(1); setSearch(""); setOpen(false);
  }
  function remove(i:number){onUpdate(log.filter((_,idx)=>idx!==i));}

  return(
    <Card className="p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Utensils size={18} style={{color:GREEN}}/> Food Diary
        </h3>
        {total>0&&<span className="text-sm font-bold px-3 py-1 rounded-full" style={{background:"#EAF7F0",color:GREEN}}>{total} kcal</span>}
      </div>
      {log.length>0?(
        <div className="space-y-1.5 mb-3">
          {log.map((item,i)=>(
            <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-xl bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-700 truncate">{item.n}</div>
                <div className="text-xs text-gray-400">{item.qty}</div>
              </div>
              <span className="text-xs font-bold shrink-0 mr-1" style={{color:GREEN}}>{item.cal} kcal</span>
              <button onClick={()=>remove(i)} className="text-gray-300 hover:text-red-400 transition text-base leading-none">✕</button>
            </div>
          ))}
        </div>
      ):(
        <p className="text-sm text-gray-400 mb-3">Nothing logged yet — tap below to add what you actually ate.</p>
      )}
      {!open?(
        <button onClick={()=>setOpen(true)}
          className="w-full py-2.5 rounded-2xl border-2 border-dashed text-sm font-bold transition hover:bg-green-50"
          style={{borderColor:GREEN,color:GREEN}}>
          + Add food eaten
        </button>
      ):(
        <div className="mt-1">
          {pending?(
            <div className="rounded-2xl p-4" style={{background:"#EAF7F0"}}>
              <div className="font-bold text-gray-800 mb-0.5">{pending.n}</div>
              <div className="text-xs text-gray-500 mb-4">1 serving = {pending.q} · {pending.c} kcal</div>
              <p className="text-xs font-semibold text-gray-600 mb-2">How many servings?</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[0.25,0.5,0.75,1,1.25,1.5,2,2.5,3].map(s=>(
                  <button key={s} onClick={()=>setServings(s)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition"
                    style={servings===s?{background:GREEN,color:"#fff"}:{background:"#fff",color:"#555",border:"1.5px solid #e5e7eb"}}>
                    {s}×
                  </button>
                ))}
              </div>
              <div className="text-base font-black mb-4" style={{color:GREEN}}>
                = {Math.round(pending.c*servings)} kcal
              </div>
              <div className="flex gap-2">
                <button onClick={addFood}
                  className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm"
                  style={{background:GREEN}}>
                  Add to Diary
                </button>
                <button onClick={()=>setPending(null)}
                  className="px-4 py-2.5 rounded-xl text-gray-500 text-sm border border-gray-200 bg-white">
                  ← Back
                </button>
              </div>
            </div>
          ):(
            <>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search food — dal, rice, samosa…"
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-sm mb-2"
                autoFocus/>
              <div className="flex gap-1.5 overflow-x-auto pb-1 mb-2">
                {CATS.map(c=>(
                  <button key={c} onClick={()=>setCat(c)}
                    className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition"
                    style={cat===c?{background:GREEN,color:"#fff"}:{background:"#f3f4f6",color:"#6b7280"}}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {filtered.map((f,i)=>(
                  <button key={i} onClick={()=>{setPending(f);setServings(1);}}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-left transition">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-700 truncate">{f.n}</div>
                      <div className="text-xs text-gray-400 truncate">{f.q}</div>
                    </div>
                    <span className="text-xs font-bold shrink-0" style={{color:GREEN}}>{f.c}</span>
                  </button>
                ))}
                {filtered.length===0&&<p className="text-sm text-gray-400 text-center py-6">No matches — try a different search</p>}
              </div>
              <button onClick={()=>{setOpen(false);setSearch("");setPending(null);}}
                className="w-full mt-3 text-center text-gray-400 text-sm py-1 hover:text-gray-600">
                Close
              </button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}

/* ─────────────── Dashboard ─────────────── */
function Dash({session,plan,tracking,onUpdate,onLogout}:{
  session:Session;plan:Plan|null;tracking:Tracking;
  onUpdate:(t:Tracking)=>void;onLogout:()=>void;
}) {
  const today=WEEK[(new Date().getDay()+6)%7];
  const [sel,setSel]=useState<DayName>(today);
  const dd=(tracking[sel] as DayTracking)||{meals:{},water:0};
  const dp=plan?.days?.find(d=>d.day===sel);
  const cal=plan?.dailyCalories||0;
  const toggle=(i:number)=>onUpdate({...tracking,[sel]:{...dd,meals:{...dd.meals,[i]:!dd.meals[i]}}});
  const setWater=(n:number)=>onUpdate({...tracking,[sel]:{...dd,water:n}});
  const logW=(w:number)=>onUpdate({
  ...tracking,
  weights:{
    ...(tracking.weights||{}),
    [new Date().toISOString().slice(0,10)]:w
  }
} as Tracking);
  const planConsumed=dp?dp.meals.reduce((a,m,i)=>a+(dd.meals[i]?m.cal:0),0):0;
  const diaryTotal=(dd.log||[]).reduce((s,x)=>s+x.cal,0);
  const consumed=planConsumed+diaryTotal;
  const doneCount=dp?dp.meals.filter((_,i)=>dd.meals[i]).length:0;
  const streak=WEEK.filter(d=>{
    const x=tracking[d] as DayTracking|undefined;
    const p2=plan?.days?.find(y=>y.day===d);
    return p2&&x&&p2.meals.every((_,i)=>x.meals[i]);
  }).length;
  return (
    <Shell wide>
      <div style={{animation:"eFade .4s ease both"}}>
        <div className="rounded-3xl p-6 text-white shadow-lg mb-4"
          style={{background:"linear-gradient(135deg,#1DAA61 0%,#0E8A4D 60%,#0B6E40 100%)"}}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3"><Logo size={26}/><span className="font-bold text-sm">EatBC</span></div>
              <h2 className="text-2xl font-black">Hi {session.name} 👋</h2>
              <p className="text-white/70 text-sm">{session.id}</p>
              <div className="flex gap-4 mt-4">
                <div><div className="text-2xl font-bold">{streak}/7</div><div className="text-white/70 text-xs">perfect days</div></div>
                <div><div className="text-2xl font-bold">{doneCount}/{dp?.meals.length||0}</div><div className="text-white/70 text-xs">today's meals</div></div>
              </div>
            </div>
            <CalRing pct={cal?consumed/cal:0} big={consumed} small={`/ ${cal}`} size={104}/>
          </div>
          <button onClick={onLogout} className="mt-4 text-white/80 inline-flex items-center gap-1 text-sm hover:text-white">
            <LogOut size={15}/> Logout
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {WEEK.map(d=>(
            <button key={d} onClick={()=>setSel(d)}
              className={`px-3.5 py-2 rounded-xl text-sm whitespace-nowrap font-semibold transition ${sel===d?"text-white shadow":"bg-white text-gray-500 border border-gray-100"}`}
              style={sel===d?{background:GREEN}:{}}>
              {d.slice(0,3)}{d===today?" •":""}
            </button>
          ))}
        </div>
        {dp?(
          <>
            <Card className="p-5 mb-4">
              <h3 className="font-bold text-gray-800 mb-3">{sel} — tick off as you eat</h3>
              <div className="space-y-1">
                {dp.meals.map((m,i)=>{
                  const ui=MEAL_UI[m.time]||MEAL_UI["Lunch"];
                  const on=!!dd.meals[i];
                  return (
                    <button key={i} onClick={()=>toggle(i)}
                      className="w-full flex items-center gap-3 text-left p-2.5 rounded-2xl hover:bg-gray-50 transition">
                      <CheckCircle2 size={24} style={{color:on?GREEN:"#E5E7EB"}}/>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{color:ui.col}}>{m.time}</span>
                        <div className={`text-sm font-medium truncate ${on?"line-through text-gray-300":"text-gray-700"}`}>{m.food}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Scale size={10} className="text-gray-400 shrink-0"/>
                          <span className="text-xs text-gray-400 truncate">{m.qty}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold shrink-0" style={{color:GREEN}}>{m.cal}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
            <FoodLogger
              log={dd.log||[]}
              onUpdate={l=>onUpdate({...tracking,[sel]:{...dd,log:l}})}
            />
            <Card className="p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Droplet size={18} style={{color:GREEN}}/> Water</h3>
                <span className="text-sm text-gray-400">{dd.water}/8 glasses</span>
              </div>
              <div className="flex gap-1.5">
                {[...Array(8)].map((_,i)=>(
                  <button key={i} onClick={()=>setWater(i+1===dd.water?i:i+1)}
                    className="flex-1 h-9 rounded-lg transition" style={{background:i<dd.water?GREEN:"#E5E7EB"}}/>
                ))}
              </div>
            </Card>
            <WeightLog t={tracking} onLog={logW}/>
          </>
        ):(
          <Card className="p-8 text-center text-gray-400">No plan loaded for this session.</Card>
        )}
      </div>
    </Shell>
  );
}

/* ─────────────── Root App ─────────────── */
export default function App() {
  const [screen,setScreen]=useState<Screen>(()=>sget<boolean>("eatbc:onboarded")?"welcome":"onboarding");
  const [step,setStep]=useState(0);
  const [profile,setProfile]=useState<Profile>({region:[]});
  const [plan,setPlan]=useState<Plan|null>(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [session,setSession]=useState<Session|null>(null);
  const [tracking,setTracking]=useState<Tracking>({});
  const quoteRef=useRef(pickQuote());

  useEffect(()=>{
    const s=sget<Session>("eatbc:session");
    if (s?.token){
      setSession(s);
      Promise.all([
        apiGet("/api/plan",s.token),
        apiGet("/api/tracking",s.token),
      ]).then(([pd,td])=>{
        if(pd.plan) setPlan(pd.plan);
        setTracking(td.tracking||{});
        setScreen("dash");
      }).catch(()=>{
        sdel("eatbc:session");
        setScreen("welcome");
      });
    }
  },[]);

  const cur=Q[step];
  const setVal=(v:string|string[])=>setProfile(p=>({...p,[cur.k]:v}));
  const toggleMulti=(o:string)=>setProfile(p=>{
    const a=(p[cur.k] as string[])||[];
    return {...p,[cur.k]:a.includes(o)?a.filter(x=>x!==o):[...a,o]};
  });
  const canNext=!cur?false
    :cur.type==="multi"?((profile[cur.k] as string[]|undefined)||[]).length>0
    :cur.type==="height"?(profile.heightFt??"")!==""
    :cur.k==="avoid"?true
    :(profile[cur.k]||"")!=="";

  function generate() {
    setLoading(true); setErr("");
    setTimeout(()=>{
      try{setPlan(buildPlan(profile));setScreen("plan");}
      catch{setErr("Something went off — adjust an answer and retry.");}
      setLoading(false);
    },650);
  }

  function planText(): string {
    if (!plan) return "";
    let t=`🥗 *EatBC Weekly Plan — ${profile.name}*\n${plan.summary}\nDaily target: ~${plan.dailyCalories} kcal\n`;
    if (plan.weeklyLoss) t+=`Expected: ${plan.weeklyLoss}\n`;
    t+="\n";
    plan.days.forEach(d=>{
      t+=`*${d.day}*\n`;
      d.meals.forEach(m=>t+=`• ${m.time}: ${m.food} — ${m.qty} (${m.cal} kcal)\n`);
      t+="\n";
    });
    t+=`💡 Tips:\n${plan.tips.map(x=>"• "+x).join("\n")}\n\nLet's make the nation fit 💪 — EatBC`;
    return t;
  }
  const shareWA=()=>window.open(`https://wa.me/?text=${encodeURIComponent(planText())}`,"_blank");
  const shareEmail=()=>window.open(`mailto:?subject=${encodeURIComponent("My EatBC Weekly Plan")}&body=${encodeURIComponent(planText())}`,"_blank");

  function doLogin(sess:Session,loginPlan?:Plan|null,loginTracking?:Tracking) {
    setSession(sess); sset<Session>("eatbc:session",sess);
    if(loginPlan) setPlan(loginPlan);
    setTracking(loginTracking||{});
    setScreen("dash");
  }
  async function doSignup(sess:Session) {
    setSession(sess); sset<Session>("eatbc:session",sess);
    if(plan) await apiPost("/api/plan",{plan,profile},sess.token).catch(()=>{});
    setTracking({});
    setScreen("dash");
  }
  function logout() {
    const token=session?.token;
    sdel("eatbc:session"); setSession(null); setScreen("welcome");
    setStep(0); setProfile({region:[]}); setPlan(null); setTracking({});
    quoteRef.current=pickQuote();
    if(token) apiPost("/api/logout",{},token).catch(()=>{});
  }

  function doneOnboarding(){sset("eatbc:onboarded",true);setScreen("welcome");}

  /* ── screens ── */
  if (screen==="onboarding") return <Onboarding onDone={doneOnboarding}/>;
  if (screen==="welcome") return <Welcome onNew={()=>setScreen("quiz")} onLogin={()=>setScreen("login")}/>;
  if (screen==="login")   return <Login onDone={doLogin} onBack={()=>setScreen("welcome")}/>;

  if (screen==="quiz") return (
    <Shell>
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6"><Logo size={28}/><span className="font-bold text-gray-700">EatBC</span></div>
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Question {step+1} of {Q.length}</span><span>{Math.round(((step+1)/Q.length)*100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 rounded-full transition-all" style={{width:`${((step+1)/Q.length)*100}%`,background:GREEN}}/>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{cur.label}</h2>
        {cur.sub&&<p className="text-sm text-gray-400 mt-1 mb-4">{cur.sub}</p>}
        <div className={cur.sub?"":"mt-5"}>
          {cur.type==="pick"&&(
            <div className="grid gap-2.5">
              {cur.opts!.map(o=>(
                <button key={o} onClick={()=>setVal(o)}
                  className={`text-left px-5 py-3.5 rounded-2xl border-2 transition font-medium ${profile[cur.k]===o?"text-white shadow-md":"bg-white text-gray-700 border-gray-200 hover:border-gray-300"}`}
                  style={profile[cur.k]===o?{background:GREEN,borderColor:GREEN}:{}}>
                  {o}
                </button>
              ))}
            </div>
          )}
          {cur.type==="multi"&&(
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
              {cur.opts!.map(o=>{
                const on=((profile[cur.k] as string[])||[]).includes(o);
                return (
                  <button key={o} onClick={()=>toggleMulti(o)}
                    className={`px-3 py-2.5 rounded-2xl border-2 transition font-semibold text-xs inline-flex items-center justify-center gap-1 min-h-[44px] text-center leading-tight ${on?"text-white shadow-md":"bg-white text-gray-700 border-gray-200 hover:border-gray-300"}`}
                    style={on?{background:GREEN,borderColor:GREEN}:{}}>
                    {on&&<CheckCircle2 size={13} className="shrink-0"/>}{o}
                  </button>
                );
              })}
            </div>
          )}
          {cur.type==="height"&&(
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-400">Feet</label>
                <input type="number" value={profile.heightFt||""} onChange={e=>setProfile(p=>({...p,heightFt:e.target.value}))}
                  placeholder="5" className="w-full mt-1 px-4 py-3.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-lg" autoFocus/>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400">Inches</label>
                <input type="number" value={profile.heightIn||""} onChange={e=>setProfile(p=>({...p,heightIn:e.target.value}))}
                  placeholder="9" className="w-full mt-1 px-4 py-3.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-lg"/>
              </div>
            </div>
          )}
          {cur.type==="text"&&(
            <input type="text" value={(profile[cur.k] as string)||""} onChange={e=>setVal(e.target.value)}
              placeholder={cur.ph} className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-lg" autoFocus/>
          )}
          {cur.type==="number"&&(
            <input type="number" value={(profile[cur.k] as string)||""} onChange={e=>setVal(e.target.value)}
              placeholder={cur.ph} className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-lg" autoFocus/>
          )}
        </div>
        {err&&<div className="mt-4 flex items-center gap-2 text-red-500 text-sm"><AlertCircle size={16}/>{err}</div>}
        <div className="flex justify-between mt-8">
          <button onClick={()=>step>0?setStep(step-1):setScreen("welcome")}
            className="px-5 py-2.5 text-gray-500 font-medium">Back</button>
          {step<Q.length-1?(
            <button disabled={!canNext} onClick={()=>setStep(step+1)}
              className="px-7 py-2.5 rounded-2xl text-white font-semibold disabled:opacity-40 inline-flex items-center gap-1 shadow-md"
              style={{background:GREEN}}>
              Next <ChevronRight size={16}/>
            </button>
          ):(
            <button disabled={loading||!canNext} onClick={generate}
              className="px-7 py-2.5 rounded-2xl text-white font-semibold disabled:opacity-60 inline-flex items-center gap-2 shadow-md"
              style={{background:GREEN}}>
              {loading?<><Loader2 className="animate-spin" size={16}/>Building…</>:<>Build my plan <Sparkles size={16}/></>}
            </button>
          )}
        </div>
      </Card>
    </Shell>
  );

  if (screen==="plan"&&plan) return (
    <Shell wide>
      <div style={{animation:"eFade .5s ease both"}}>
        <div className="rounded-3xl p-6 md:p-7 text-white shadow-lg mb-4"
          style={{background:"linear-gradient(135deg,#1DAA61 0%,#0E8A4D 55%,#0B6E40 100%)"}}>
          <div className="flex items-center gap-2 mb-4"><Logo size={30}/><span className="font-bold">EatBC</span></div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-white/70 text-sm">Weekly plan for</p>
              <h2 className="text-3xl font-bold truncate">{profile.name||"you"}</h2>
              <p className="text-white/85 text-sm mt-2 max-w-md">{plan.summary}</p>
              {plan.weeklyLoss&&(
                <div className="mt-2 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                  <TrendingDown size={13}/>
                  <span className="text-xs font-semibold">Expected: {plan.weeklyLoss}</span>
                </div>
              )}
            </div>
            <CalRing pct={1} big={plan.dailyCalories} small="kcal / day" size={118}/>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={shareWA}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-2xl bg-white font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition"
              style={{color:GREEN}}>
              <Share2 size={16}/> WhatsApp
            </button>
            <button onClick={shareEmail}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-2xl font-semibold inline-flex items-center justify-center gap-2 text-white border border-white/40 hover:bg-white/10 transition">
              <Mail size={16}/> Email
            </button>
          </div>
        </div>

        {["Pregnant","Breastfeeding"].includes(plan.condition)&&(
          <div className="rounded-2xl px-4 py-3 mb-4 flex items-start gap-2.5 text-sm" style={{background:"#FFF0F5",color:"#9D174D"}}>
            <HeartPulse size={18} className="mt-0.5 shrink-0"/>
            <span>This plan accounts for your <b>{plan.condition.toLowerCase()}</b> nutritional needs. <b>Always consult your gynaecologist or dietician before making dietary changes.</b></span>
          </div>
        )}
        {plan.condition!=="None"&&!["Pregnant","Breastfeeding"].includes(plan.condition)&&(
          <div className="rounded-2xl px-4 py-3 mb-4 flex items-start gap-2.5 text-sm" style={{background:"#FFF7ED",color:"#9A3412"}}>
            <HeartPulse size={18} className="mt-0.5 shrink-0"/>
            <span>This plan is adjusted for <b>{plan.condition}</b>. Please confirm with your doctor before starting.</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
          <Chip label="BMI" val={`${plan.bmi} · ${plan.bmiCat}`}/>
          <Chip label="Goal" val={plan.goal}/>
          <Chip label="Timeline" val={plan.timeline} accent/>
          <Chip label="Diet" val={plan.diet}/>
        </div>

        <PlanWeek plan={plan}/>

        <div className="rounded-3xl p-5 mb-5" style={{background:"linear-gradient(135deg,#F0FAF4,#E7F7EF)"}}>
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{color:GREEN}}>
            <Sparkles size={18}/> Coach's tips
          </h3>
          <div className="grid md:grid-cols-2 gap-2.5">
            {plan.tips.map((tip,i)=>(
              <div key={i} className="bg-white/70 rounded-2xl px-4 py-3 text-sm text-gray-700 border border-white">{tip}</div>
            ))}
          </div>
        </div>

        <Card className="p-6 text-center">
          <h3 className="text-xl font-black text-gray-800">Ready to lock this in?</h3>
          <p className="text-gray-400 text-sm mt-1 mb-4">Accept the challenge → create your account → start tracking daily.</p>
          <button onClick={()=>setScreen("signup")}
            className="px-8 py-3.5 rounded-2xl text-white font-black text-lg inline-flex items-center gap-2 shadow-md hover:opacity-90 transition"
            style={{background:GREEN}}>
            Accept the Challenge 💪 <ChevronRight size={20}/>
          </button>
          <p className="text-xs text-gray-400 mt-3">Account creation happens next — just one last step!</p>
        </Card>
        <p className="text-center text-xs text-gray-400 mt-4">
          EatBC gives general guidance, not medical advice. Consult a doctor or dietician for any health condition.
        </p>
      </div>
    </Shell>
  );

  if (screen==="signup") return <Signup profile={profile} plan={plan} onDone={doSignup} onBack={()=>setScreen("plan")}/>;

  if (screen==="dash"&&session) return (
    <Dash session={session} plan={plan} tracking={tracking}
      onUpdate={(t)=>{setTracking(t);if(session?.token)apiPost("/api/tracking",{tracking:t},session.token).catch(()=>{});}}
      onLogout={logout}/>
  );

  return <Shell><Card className="p-10 text-center text-gray-400">Loading…</Card></Shell>;
}
