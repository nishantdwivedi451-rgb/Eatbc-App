import { useState, useEffect, useRef } from "react";
import {
  ChevronRight, Utensils, Share2, Mail,
  CheckCircle2, Droplet, LogOut, TrendingDown, Loader2,
  AlertCircle, Sunrise, Apple, Cookie, Moon, HeartPulse,
  Sparkles, Stethoscope, User, UserPlus, ArrowRight, Scale,
  Flame, BarChart3, Trophy, Users, Bell, Plus, RefreshCw,
  Lightbulb, Globe, X, Check, Target, Dumbbell, CalendarDays, Clock, BookOpen, ChefHat,
  Mic, MicOff, Volume2, Camera, Lock, Zap, Star,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, LineChart, Line, ReferenceLine,
} from "recharts";

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
  cooktime?: string; avoid?: string; weekend?: string[]; foodPicks?: string[];
  foodAvoid?: string[];  // auto-blacklisted foods from repeated swaps
  wantWorkout?: string; workoutPlace?: string; workoutFocus?: string; workoutDays?: string;
}
interface Meal { time: string; food: string; cal: number; p?: number; qty: string; }
interface PlanDay { day: DayName; meals: Meal[]; }
/* ── Workout plan types ── */
interface WorkoutItem { name: string; sets: number; reps: string; note?: string; }
interface WorkoutDay { label: string; focus: string; items: WorkoutItem[]; }
interface WorkoutPlan {
  place: string; focus: string; daysPerWeek: number;
  schedule: (number | null)[];   // Mon..Sun → day index into days[], or null = rest
  days: WorkoutDay[]; notes: string[];
}
interface ExGuide { muscles: string[]; steps: string[]; tip: string; emoji: string; burnType: "cardio"|"compound"|"isolation"|"hold"; }
interface Recipe { time: string; ingredients?: string[]; steps: string[]; tip?: string; }
interface Plan {
  summary: string; dailyCalories: number; maintenanceCalories: number; proteinTarget: number; bmi: string; bmiCat: string;
  goal: string; diet: string; condition: string; regLabel: string;
  timeline: string; weeklyLoss: string;
  tips: string[]; days: PlanDay[]; workout?: WorkoutPlan | null;
}
interface Session { id: string; name: string; token: string; }
interface FoodLog { n: string; cal: number; p?: number; qty: string; servings: number; }
interface DayTracking { meals: Record<number, boolean>; water: number; log?: FoodLog[]; }
/* Date-keyed daily snapshot — powers real streaks, trends and insights. */
interface HistEntry { onTrack: boolean; cal: number; protein: number; meals: number; total: number; water: number; }
interface Tracking {
  [day: string]: DayTracking | Record<string, number> | Record<string, HistEntry> | Record<string, boolean> | Record<string, number[]> | Record<string, Record<string, string>> | LogFood[] | string[] | string | number | undefined;
  weights?: Record<string, number>;
  history?: Record<string, HistEntry>;
  customFoods?: LogFood[];     // user-saved foods
  joinedChallenges?: string[]; // challenge ids the user opted into
  workouts?: Record<string, boolean>;   // date → workout session completed
  workoutSets?: Record<string, number[]>; // date → completed exercise indices
  lang?: string;
  swapCounts?: Record<string, number>;  // food name → times swapped out
  lastRetired?: string;                 // last food name retired from plan
  mealTimes?: Record<string, Record<string, string>>;  // day -> "mealIdx" -> ISO timestamp
  joinDate?: string;            // ISO date of first tracked day
  lastRecalcDate?: string;      // ISO date when plan was last recalculated
  lastRecalcWeight?: number;    // weight (kg) at last recalc
}
type Screen = "welcome" | "quiz" | "foodgame" | "plan" | "login" | "signup" | "dash" | "onboarding";

/* ─────────────── quiz questions ─────────────── */
interface Question {
  k: keyof Profile; label: string;
  type: "text" | "number" | "pick" | "multi" | "height";
  ph?: string; sub?: string; subFn?: (p: Profile) => string; opts?: string[];
  showIf?: (p: Profile) => boolean;
}
const Q: Question[] = [
  { k:"name",      label:"What should we call you?",                    type:"text",   ph:"e.g. Nishant" },
  { k:"age",       label:"Your age",                                    type:"number", ph:"e.g. 32" },
  { k:"sex",       label:"Sex",                                         type:"pick",   opts:["Male","Female","Other"] },
  { k:"heightFt",  label:"Your height",                                 type:"height" },
  { k:"weight",    label:"Current weight (kg)",                         type:"number", ph:"e.g. 78" },
  { k:"target",    label:"Target weight (kg)",                          type:"number", ph:"e.g. 72",
    sub:"Same number as current weight = maintain." },
  { k:"timeline",  label:"When do you want to hit your goal?",          type:"pick",
    subFn:(p)=>{
      const delta=Math.abs(+(p.target||0)-(+(p.weight||0)));
      if(!delta||isNaN(delta)) return "Pick a pace that fits your lifestyle.";
      const rec=delta<=3?"1–3 months (small gap, very achievable)":delta<=8?"3–6 months (steady, sustainable)":delta<=18?"6 months – 1 year (realistic for your goal)":"1 year+ (safest for large changes)";
      return `You want to change ~${delta.toFixed(0)} kg. Our recommendation: ${rec}.`;
    },
    opts:["1 month (aggressive)","3 months","6 months","1 year","No fixed timeline"] },
  { k:"goal",      label:"Your primary goal",                           type:"pick",   opts:["Weight loss","Muscle gain","Maintain weight","General fitness"] },
  { k:"condition", label:"Any health condition we should know about?",  type:"pick",
    opts:["None","Diabetes / pre-diabetes","High BP (hypertension)","High cholesterol","Thyroid (hypothyroid)","PCOS / PCOD","Pregnant","Breastfeeding","Other"] },
  { k:"diet",      label:"Your food preference",                        type:"pick",   opts:["Pure veg","Egg + veg","Non-veg","Vegan","Jain"] },
  { k:"activity",  label:"How active is your daily life?",              type:"pick",
    sub:"Think work, commute and chores — not gym or sport.",
    opts:["Mostly desk job","On feet / moderate","Physically active"] },
  { k:"weekend",   label:"What's your typical weekend like?",           type:"multi",
    sub:"Pick all that apply — we'll adjust your weekend calorie targets to match.",
    opts:["Rest & recovery","Run club / group fitness","Coffee rave / morning run","Hiking / outdoor sports","Social eating out","Travel / exploring","Home cooking & meal prep"] },
  { k:"region",    label:"Which cuisines do you enjoy?",                type:"multi",
    sub:"Pick all that apply — we'll mix these into your meal plan.",
    opts:["North Indian","South Indian","Continental","Mediterranean","East Asian","Middle Eastern","Mexican","Keto","High-Protein","Plant-Based","Intermittent Fasting"] },
  { k:"wantWorkout", label:"Want a workout plan with your diet?",        type:"pick",
    sub:"We'll build a weekly training schedule with a tracker.",
    opts:["Yes, build my workout plan","No thanks, just the diet"] },
  { k:"exercise",  label:"How do you like to exercise?",                type:"pick",
    sub:"Pick whatever fits your lifestyle — we'll build around it.",
    opts:["Running / jogging","Cycling","Swimming","Yoga / Pilates","Home workouts","Gym (weights)","Sports / games","HIIT / CrossFit","HYROX"],
    showIf:(p)=>!!p.wantWorkout && p.wantWorkout.startsWith("Yes") },
  { k:"workoutDays", label:"How many days a week can you train?",       type:"pick",
    opts:["2 days","3 days","4 days","5 days","6 days"],
    showIf:(p)=>!!p.wantWorkout && p.wantWorkout.startsWith("Yes") },
  { k:"avoid",     label:"Any allergies or foods to skip?",             type:"text",   sub:"Optional — skip if none.", ph:"e.g. lactose, peanuts" },
];

/* ─────────────── food database (with quantities) ─────────────── */
interface FoodItem {
  n: string; c: number; p?: number; q: string;
  slot: string[]; reg: string[];
  simple?: number; jain?: number; egg?: number; meat?: number; fish?: number; dairy?: number;
  t: string[];
}

const DB: FoodItem[] = [
  /* ── Breakfast ── */
  {n:"Vegetable poha",                    c:300,p:7, q:"1½ cups (250g)",                                           slot:["b"],reg:["w","all"],simple:1,t:["fiber"]},
  {n:"Besan chilla with mint chutney",    c:280,p:14,q:"2 chillas (160g) + 2 tbsp chutney",                       slot:["b"],reg:["n","all"],jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Moong dal cheela",                  c:260,p:12,q:"2 cheelas (140g)",                                        slot:["b"],reg:["n","all"],jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Oats with milk, banana & seeds",   c:290,p:10,q:"½ cup oats + 200ml milk + 1 banana",                     slot:["b"],reg:["all"],dairy:1,simple:1,t:["fiber","lowgi"]},
  {n:"Oats with almond milk & fruit",    c:280,p:7, q:"½ cup oats + 200ml almond milk + ½ cup fruit",           slot:["b"],reg:["all"],jain:1,simple:1,t:["fiber","lowgi"]},
  {n:"Vegetable upma",                    c:300,p:7, q:"1½ cups (220g)",                                           slot:["b"],reg:["s","all"],simple:1,t:["fiber"]},
  {n:"Idli (3) with coconut chutney",    c:280,p:8, q:"3 idlis (180g) + 3 tbsp chutney",                        slot:["b"],reg:["s"],jain:1,simple:1,t:["lowgi"]},
  {n:"Idli (3) with sambar",             c:290,p:10,q:"3 idlis (180g) + 1 cup sambar",                           slot:["b"],reg:["s"],simple:1,t:["fiber","lowgi"]},
  {n:"Masala dosa with chutney",         c:420,p:7, q:"1 dosa (120g) + 2 tbsp chutney",                          slot:["b"],reg:["s"],t:["fried"]},
  {n:"Plain dosa with sambar",           c:350,p:7, q:"1 dosa (100g) + 1 cup sambar",                            slot:["b"],reg:["s"],simple:1,t:[]},
  {n:"Pesarattu (moong dosa)",           c:300,p:12,q:"2 dosas (160g)",                                           slot:["b"],reg:["s"],simple:1,t:["protein","lowgi"]},
  {n:"Ragi dosa",                         c:280,p:7, q:"2 dosas (150g)",                                          slot:["b"],reg:["s"],simple:1,t:["lowgi","fiber"]},
  {n:"Aloo paratha with curd",           c:430,p:12,q:"2 parathas (200g) + ½ cup curd",                          slot:["b"],reg:["n"],dairy:1,t:[]},
  {n:"Paneer paratha with curd",         c:450,p:18,q:"2 parathas (200g) + ½ cup curd",                          slot:["b"],reg:["n"],dairy:1,t:["protein"]},
  {n:"Methi thepla with curd",           c:340,p:10,q:"2 theplas (120g) + ½ cup curd",                           slot:["b"],reg:["w"],dairy:1,t:["fiber"]},
  {n:"Steamed dhokla",                    c:250,p:10,q:"4 pieces (150g) + chutney",                               slot:["b","es"],reg:["w"],jain:1,simple:1,t:["lowgi","protein"]},
  {n:"Handvo slice",                      c:300,p:8, q:"2 slices (150g)",                                          slot:["b"],reg:["w"],dairy:1,jain:1,t:["fiber"]},
  {n:"Vegetable daliya",                  c:260,p:8, q:"1½ cups (220g)",                                           slot:["b"],reg:["all"],jain:1,simple:1,t:["fiber","lowgi"]},
  {n:"Ragi porridge",                     c:240,p:5, q:"1½ cups (250ml)",                                          slot:["b"],reg:["s","all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Sprout & veg salad bowl",          c:220,p:15,q:"1½ cups sprouts + 1 cup veggies (300g)",                  slot:["b","es"],reg:["all"],jain:1,simple:1,t:["protein","lowgi","fiber"]},
  {n:"Boiled eggs (2) with toast",       c:280,p:18,q:"2 boiled eggs + 2 slices whole wheat toast",             slot:["b"],reg:["all"],egg:1,simple:1,t:["protein"]},
  {n:"Egg bhurji with roti",             c:360,p:20,q:"2-egg bhurji + 2 rotis (60g each)",                       slot:["b"],reg:["all"],egg:1,t:["protein"]},
  {n:"Bread omelette",                    c:320,p:18,q:"2-egg omelette + 2 bread slices",                         slot:["b"],reg:["all"],egg:1,simple:1,t:["protein"]},
  {n:"Chirer pulao (Bengali poha)",      c:300,p:6, q:"1½ cups (240g)",                                           slot:["b"],reg:["e"],simple:1,t:["fiber"]},
  {n:"Luchi with aloo dom",              c:430,p:7, q:"3 luchis (90g) + ½ cup aloo dom",                         slot:["b"],reg:["e"],t:["fried"]},
  {n:"Vegetable khichuri",               c:320,p:10,q:"1½ cups (270g)",                                           slot:["b","d"],reg:["e","all"],jain:1,simple:1,t:["fiber","lowgi"]},
  {n:"Misal pav",                         c:450,p:14,q:"1 cup misal (200g) + 2 pavs",                             slot:["b"],reg:["w"],t:["fiber","protein"]},
  {n:"Sabudana khichdi",                  c:350,p:4, q:"1½ cups (220g)",                                           slot:["b","es"],reg:["w"],t:[]},
  {n:"Banana peanut-butter toast",       c:320,p:10,q:"2 toast slices + 2 tbsp peanut butter + 1 banana",       slot:["b"],reg:["all"],jain:1,simple:1,t:[]},
  {n:"Cinnamon oats with flaxseed",      c:290,p:11,q:"½ cup oats + 1 tbsp flaxseed + cinnamon + 200ml milk", slot:["b"],reg:["all"],dairy:1,simple:1,t:["lowgi","fiber","protein"]},
  {n:"Besan-veg chilla with flaxseed",   c:300,p:15,q:"2 chillas (160g) + 1 tsp flaxseed",                     slot:["b"],reg:["n","all"],jain:1,simple:1,t:["protein","lowgi","fiber"]},
  {n:"Ragi & walnut porridge",           c:270,p:8, q:"1½ cups (250ml) + 4 walnut halves",                     slot:["b"],reg:["s","all"],dairy:1,jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Greek yogurt, berries & pumpkin seeds", c:240,p:16,q:"150g yogurt + ½ cup berries + 1 tbsp seeds",       slot:["b","ms"],reg:["all"],dairy:1,jain:1,simple:1,t:["protein","lowgi","fiber"]},

  /* ── Mid-morning snacks ── */
  {n:"Seasonal fruit bowl",              c:90, p:1, q:"1 cup mixed fruit (150g)",                                 slot:["ms","es"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"An apple",                          c:80, p:0, q:"1 medium apple (150g)",                                   slot:["ms"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Buttermilk (chaas)",               c:80, p:3, q:"1 glass (250ml)",                                          slot:["ms","es"],reg:["w","s","all"],dairy:1,jain:1,simple:1,t:["lowgi"]},
  {n:"Tender coconut water",             c:60, p:1, q:"1 tender coconut (~250ml)",                               slot:["ms"],reg:["s","all"],jain:1,simple:1,t:["lowgi"]},
  {n:"Roasted chana (handful)",          c:120,p:7, q:"¼ cup (40g)",                                              slot:["ms","es"],reg:["all"],jain:1,simple:1,t:["protein","fiber"]},
  {n:"Moong sprouts cup",                c:110,p:8, q:"1 cup sprouts (100g)",                                     slot:["ms"],reg:["all"],jain:1,simple:1,t:["protein","lowgi","fiber"]},
  {n:"Greek yogurt",                      c:100,p:15,q:"150g (¾ cup)",                                            slot:["ms"],reg:["all"],dairy:1,jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Soaked almonds (6)",               c:90, p:3, q:"6 almonds (12g)",                                          slot:["ms"],reg:["all"],jain:1,simple:1,t:["protein","fiber"]},
  {n:"Papaya bowl",                       c:80, p:1, q:"1 cup papaya (150g)",                                     slot:["ms"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},

  /* ── Evening snacks ── */
  {n:"Green tea with roasted makhana",   c:110,p:3, q:"1 cup tea + ½ cup makhana (20g)",                        slot:["es"],reg:["all"],jain:1,simple:1,t:["lowgi"]},
  {n:"Masala chai with 2 biscuits",      c:120,p:3, q:"1 cup chai (150ml) + 2 digestive biscuits",              slot:["es"],reg:["all"],dairy:1,simple:1,t:["sugary"]},
  {n:"Light bhel",                        c:180,p:4, q:"1½ cups (120g)",                                          slot:["es"],reg:["w"],simple:1,t:["fiber"]},
  {n:"Boiled egg with tea",              c:110,p:8, q:"1 boiled egg + 1 cup tea",                                 slot:["es"],reg:["all"],egg:1,dairy:1,simple:1,t:["protein"]},
  {n:"Roasted peanuts",                   c:160,p:9, q:"¼ cup (40g)",                                             slot:["es"],reg:["all"],jain:1,simple:1,t:["protein","fiber"]},
  {n:"Fruit chaat",                       c:120,p:2, q:"1 cup (180g)",                                            slot:["es"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Grilled veg sandwich",             c:220,p:8, q:"1 sandwich (2 slices + filling)",                         slot:["es"],reg:["all"],simple:1,t:["fiber"]},
  {n:"Chana sundal",                      c:150,p:7, q:"¾ cup (120g)",                                            slot:["es"],reg:["s"],simple:1,t:["protein","fiber"]},
  {n:"Pan-tossed paneer cubes",          c:160,p:12,q:"80g paneer",                                              slot:["es"],reg:["all"],dairy:1,jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Hummus with cucumber",             c:150,p:5, q:"3 tbsp hummus (60g) + 1 cup cucumber slices",            slot:["es"],reg:["all"],simple:1,t:["protein","lowgi","fiber"]},

  /* ── Lunch / Dinner ── */
  {n:"2 roti, dal tadka, bhindi & curd", c:520,p:18,q:"2 rotis (60g each) + 1 cup dal + 1 cup bhindi + ½ cup curd",     slot:["l","d"],reg:["n","all"],dairy:1,t:["fiber"]},
  {n:"2 roti, rajma & small rice",       c:560,p:22,q:"2 rotis (60g each) + 1 cup rajma + ½ cup cooked rice",           slot:["l","d"],reg:["n"],t:["fiber","protein"]},
  {n:"2 roti, chole & salad",            c:540,p:20,q:"2 rotis (60g each) + 1 cup chole + 1 cup salad",                slot:["l","d"],reg:["n"],t:["fiber","protein"]},
  {n:"Palak paneer with 2 roti",         c:540,p:22,q:"2 rotis (60g each) + 1 cup palak paneer (80g paneer)",          slot:["l","d"],reg:["n"],dairy:1,t:["fiber","protein"]},
  {n:"Dal makhani with jeera rice",      c:600,p:20,q:"1 cup dal makhani + 1 cup jeera rice (180g cooked)",            slot:["l","d"],reg:["n"],dairy:1,t:["protein"]},
  {n:"Mixed veg, dal & 2 roti",          c:500,p:15,q:"2 rotis (60g each) + 1 cup dal + 1 cup mixed veg",             slot:["l","d"],reg:["all"],jain:1,t:["fiber"]},
  {n:"Soya chunk curry with rice",       c:520,p:30,q:"1 cup curry (80g soya chunks) + 1 cup cooked rice",            slot:["l","d"],reg:["all"],t:["protein","fiber"]},
  {n:"Rice, sambar, rasam, poriyal & curd", c:540,p:16,q:"1½ cups rice + 1 cup sambar + 1 cup poriyal + ½ cup curd", slot:["l","d"],reg:["s"],dairy:1,t:["fiber"]},
  {n:"Curd rice with pickle",            c:420,p:10,q:"1½ cups curd rice (300g) + 1 tsp pickle",                       slot:["l","d"],reg:["s"],dairy:1,simple:1,t:["highsalt"]},
  {n:"Lemon rice with papad & salad",   c:460,p:8, q:"1½ cups lemon rice + 1 papad + 1 cup salad",                    slot:["l","d"],reg:["s"],simple:1,t:["highsalt"]},
  {n:"Bisi bele bath",                   c:520,p:14,q:"1½ cups (300g)",                                                  slot:["l","d"],reg:["s"],dairy:1,t:["fiber","protein"]},
  {n:"Rice, kootu & thoran",             c:500,p:12,q:"1½ cups rice + 1 cup kootu + ½ cup thoran",                     slot:["l","d"],reg:["s"],jain:1,t:["fiber"]},
  {n:"Avial with rice",                  c:480,p:10,q:"1½ cups rice + 1 cup avial (200g)",                              slot:["l","d"],reg:["s"],dairy:1,jain:1,t:["fiber"]},
  {n:"Fish curry with rice",             c:560,p:28,q:"1½ cups rice + 1 cup curry (100g fish)",                        slot:["l","d"],reg:["s","e"],fish:1,t:["protein"]},
  {n:"Chicken Chettinad with rice",      c:620,p:32,q:"1½ cups rice + 1 cup curry (120g chicken)",                     slot:["l","d"],reg:["s"],meat:1,t:["protein"]},
  {n:"Egg curry with rice",              c:540,p:24,q:"1½ cups rice + 1 cup curry (2 eggs)",                            slot:["l","d"],reg:["all"],egg:1,t:["protein"]},
  {n:"Rice, cholar dal, aloo posto & curd", c:540,p:16,q:"1½ cups rice + 1 cup cholar dal + ½ cup aloo posto + ½ cup curd", slot:["l","d"],reg:["e"],dairy:1,t:["fiber"]},
  {n:"Rice with macher jhol",            c:560,p:28,q:"1½ cups rice + 1 cup jhol (120g fish)",                         slot:["l","d"],reg:["e"],fish:1,t:["protein"]},
  {n:"Shukto with rice",                 c:460,p:8, q:"1½ cups rice + 1 cup shukto (200g)",                            slot:["l","d"],reg:["e"],dairy:1,t:["fiber"]},
  {n:"Rice, dal & begun bhaja",          c:500,p:12,q:"1½ cups rice + 1 cup dal + 2 begun bhaja",                      slot:["l","d"],reg:["e"],jain:1,simple:1,t:["fried"]},
  {n:"Gujarati thali (roti, dal, shaak, rice, curd)", c:560,p:18,q:"2 rotis + 1 cup dal + ½ cup shaak + ½ cup rice + ½ cup curd", slot:["l","d"],reg:["w"],dairy:1,jain:1,t:["fiber"]},
  {n:"Bajra roti, baingan bharta & chaas", c:480,p:14,q:"2 bajra rotis (80g each) + 1 cup bharta + 1 glass chaas",   slot:["l","d"],reg:["w"],dairy:1,t:["fiber","lowgi"]},
  {n:"Pithla bhakri",                    c:460,p:16,q:"2 bhakris (100g each) + ¾ cup pithla",                          slot:["l","d"],reg:["w"],jain:1,t:["fiber"]},
  {n:"Dal dhokli",                       c:520,p:15,q:"2 cups (350g)",                                                   slot:["l","d"],reg:["w"],jain:1,t:["fiber","protein"]},
  {n:"Undhiyu with roti",               c:540,p:12,q:"2 rotis (60g each) + 1½ cups undhiyu (300g)",                   slot:["l","d"],reg:["w"],t:["fiber"]},
  {n:"Chicken sukka with bhakri",        c:640,p:38,q:"2 bhakris (100g each) + 1 cup sukka (150g chicken)",            slot:["l","d"],reg:["w"],meat:1,t:["protein"]},
  {n:"Moong dal khichdi with curd",      c:420,p:14,q:"1½ cups khichdi (280g) + ½ cup curd",                           slot:["l","d"],reg:["all"],dairy:1,jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Moong dal khichdi (light)",        c:360,p:12,q:"1½ cups khichdi (250g)",                                         slot:["l","d"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Vegetable soup with 2 multigrain toast", c:320,p:10,q:"1½ cups soup + 2 toast slices",                           slot:["d"],reg:["all"],jain:1,simple:1,t:["lowgi","fiber"]},
  {n:"Grilled chicken with sautéed veg", c:480,p:38,q:"150g chicken + 1½ cups sautéed veg",                           slot:["l","d"],reg:["all"],meat:1,simple:1,t:["protein","lowgi"]},
  {n:"Grilled fish with salad",          c:420,p:32,q:"150g fish + 1½ cups salad",                                      slot:["l","d"],reg:["all"],fish:1,simple:1,t:["protein","lowgi"]},
  {n:"Paneer tikka with salad",          c:420,p:22,q:"100g paneer tikka + 1½ cups salad",                             slot:["l","d"],reg:["all"],dairy:1,simple:1,t:["protein","lowgi"]},
  {n:"Tofu stir-fry with rice",         c:460,p:16,q:"120g tofu + 1 cup cooked rice (180g)",                          slot:["l","d"],reg:["all"],simple:1,t:["protein"]},
  {n:"Dal with 2 roti & salad",         c:460,p:16,q:"2 rotis (60g each) + 1 cup dal + 1 cup salad",                  slot:["l","d"],reg:["all"],jain:1,simple:1,t:["fiber","protein"]},
  {n:"Missi roti with seasonal sabzi",  c:440,p:14,q:"2 missi rotis (70g each) + 1 cup sabzi",                        slot:["l","d"],reg:["n","all"],jain:1,simple:1,t:["fiber"]},
  {n:"Veg pulao with raita",            c:480,p:14,q:"1½ cups pulao (280g) + ½ cup raita",                             slot:["l","d"],reg:["all"],dairy:1,jain:1,simple:1,t:["fiber"]},
  {n:"Grilled paneer & quinoa bowl",    c:480,p:26,q:"100g paneer + 1 cup quinoa + 1 cup veggies",                     slot:["l","d"],reg:["all"],dairy:1,jain:1,simple:1,t:["protein","lowgi","fiber"]},
  {n:"Bajra khichdi with veggies",      c:440,p:14,q:"1½ cups (300g) bajra-moong khichdi",                            slot:["l","d"],reg:["w","all"],jain:1,simple:1,t:["lowgi","fiber","protein"]},
  {n:"Sprout, chickpea & flax salad",   c:340,p:18,q:"1½ cups sprouts+chickpea + 1 tsp flaxseed + lemon",            slot:["l","d","es"],reg:["all"],jain:1,simple:1,t:["protein","lowgi","fiber"]},
  {n:"Grilled chicken & millet bowl",   c:520,p:40,q:"150g chicken + 1 cup foxtail millet + sautéed greens",         slot:["l","d"],reg:["all"],meat:1,simple:1,t:["protein","lowgi","fiber"]},

  /* ── Bedtime ── */
  {n:"Turmeric milk",  c:120,p:8, q:"1 glass (250ml)",             slot:["bt"],reg:["all"],dairy:1,jain:1,simple:1,t:["lowgi"]},
  {n:"Warm milk",      c:110,p:8, q:"1 glass (250ml)",             slot:["bt"],reg:["all"],dairy:1,jain:1,simple:1,t:["lowgi"]},
  {n:"Chamomile tea",  c:10, p:0, q:"1 cup (200ml)",               slot:["bt"],reg:["all"],jain:1,simple:1,t:["lowgi"]},
  {n:"A few walnuts",  c:90, p:2, q:"3–4 walnuts (15g)",           slot:["bt"],reg:["all"],jain:1,simple:1,t:["protein","lowgi"]},
  {n:"Soaked figs (2)",c:80, p:1, q:"2 figs soaked overnight",     slot:["bt"],reg:["all"],jain:1,simple:1,t:["fiber","lowgi"]},
];

const SLOTSET: Record<string,[string,number,string][]> = {
  "3 meals":            [["b",.32,"Breakfast"],["l",.40,"Lunch"],["d",.28,"Dinner"]],
  "3 meals + 2 snacks": [["b",.25,"Breakfast"],["ms",.10,"Mid-morning"],["l",.30,"Lunch"],["es",.12,"Evening snack"],["d",.23,"Dinner"]],
  "5-6 small meals":    [["b",.22,"Breakfast"],["ms",.12,"Mid-morning"],["l",.26,"Lunch"],["es",.12,"Evening snack"],["d",.20,"Dinner"],["bt",.08,"Bedtime"]],
};
/* Hard calorie ceiling per meal slot — breakfast/lunch are heavy,
   snacks stay ≤250, dinner is lighter than lunch. Prevents the
   "1135 kcal dinner" problem on high-calorie plans.             */
const SLOT_CAL_CAP: Record<string,number> = {
  b:650, ms:250, l:780, es:250, d:620, bt:150,
};
const RMAP: Record<string,string> = {
  // Indian regions (drive Indian-food filtering)
  "North Indian":"n","South Indian":"s",
  // International cuisines & trending diets — mapped to "all" so they broaden,
  // never narrow, the (Indian-first) food database.
  "Continental":"all","Mediterranean":"all","East Asian":"all",
  "Middle Eastern":"all","Mexican":"all",
  "Keto":"all","High-Protein":"all","Plant-Based":"all","Intermittent Fasting":"all",
  // Legacy keys kept for users who onboarded before the cuisine overhaul
  "East Indian":"e","West Indian":"w","Punjabi":"n","Gujarati":"w",
  "Rajasthani":"n","Bengali":"e","Goan":"w","Coastal":"s","Pan-India":"all",
};
const LABEL2SLOT: Record<string,string> = {
  "Breakfast":"b","Mid-morning":"ms","Lunch":"l","Evening snack":"es","Dinner":"d","Bedtime":"bt",
};
const COND_SHORT: Record<string,string> = {
  "Diabetes / pre-diabetes":"blood sugar","High BP (hypertension)":"blood pressure",
  "High cholesterol":"cholesterol","Thyroid (hypothyroid)":"thyroid",
  "PCOS / PCOD":"PCOS/PCOD","Pregnant":"pregnancy","Breastfeeding":"breastfeeding",
};

/* ─────────────── community challenges ─────────────── */
interface Challenge { id: string; emoji: string; title: string; desc: string; target: number; metric: "ontrack"|"water"|"protein"; }
const CHALLENGES: Challenge[] = [
  {id:"streak7",   emoji:"🔥",title:"7-Day Streak",     desc:"Stay on track for 7 days in a row.",            target:7, metric:"ontrack"},
  {id:"hydrate",   emoji:"💧",title:"Hydration Hero",   desc:"Hit 8 glasses of water on 5 days this week.",   target:5, metric:"water"},
  {id:"protein5",  emoji:"💪",title:"Protein Power",    desc:"Reach your protein target on 5 days.",          target:5, metric:"protein"},
  {id:"consistent",emoji:"📅",title:"Consistency King", desc:"Log your food on 14 days.",                     target:14,metric:"ontrack"},
];

/* ─────────────── Food diary reference database ─────────────── */
interface LogFood { n: string; c: number; p?: number; q: string; cat: string; }
const LOG_DB: LogFood[] = [
  /* Grains & Staples */
  {n:"Steamed rice",p:5, c:260,q:"1 cup cooked (180g)",cat:"Grains"},
  {n:"Basmati rice",p:5, c:240,q:"1 cup cooked (180g)",cat:"Grains"},
  {n:"Brown rice",p:5, c:215,q:"1 cup cooked (180g)",cat:"Grains"},
  {n:"Whole wheat roti / chapati",p:3, c:80,q:"1 roti (30g)",cat:"Grains"},
  {n:"Multigrain roti",p:3, c:75,q:"1 roti (30g)",cat:"Grains"},
  {n:"Plain paratha",p:4, c:180,q:"1 paratha (60g)",cat:"Grains"},
  {n:"Stuffed aloo paratha",p:6, c:300,q:"1 paratha (90g)",cat:"Grains"},
  {n:"Naan",p:8, c:260,q:"1 naan (80g)",cat:"Grains"},
  {n:"Puri",p:3, c:150,q:"2 puris (50g)",cat:"Grains"},
  {n:"White bread",p:2, c:70,q:"1 slice (30g)",cat:"Grains"},
  {n:"Brown/whole wheat bread",p:2, c:65,q:"1 slice (30g)",cat:"Grains"},
  {n:"Poha (cooked)",p:5, c:300,q:"1.5 cups (220g)",cat:"Grains"},
  {n:"Upma",p:5, c:230,q:"1 cup (180g)",cat:"Grains"},
  {n:"Oats (cooked)",p:5, c:150,q:"1 cup (180g)",cat:"Grains"},
  {n:"Daliya / broken wheat porridge",p:6, c:220,q:"1 cup (190g)",cat:"Grains"},
  {n:"Semolina / suji upma",p:5, c:230,q:"1 cup (180g)",cat:"Grains"},
  {n:"Idli",p:2, c:80,q:"1 idli (50g)",cat:"Grains"},
  {n:"Dosa (plain)",p:4, c:175,q:"1 medium dosa (75g)",cat:"Grains"},
  {n:"Uttapam",p:6, c:220,q:"1 medium (100g)",cat:"Grains"},
  /* Dal & Legumes */
  {n:"Dal tadka (yellow dal)",p:10,c:180,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Dal makhani",p:12,c:320,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Rajma curry",p:12,c:230,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Chana masala",p:12,c:280,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Moong dal",p:12,c:200,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Sambar",p:6, c:130,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Kadhi",p:5, c:160,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Chole",p:12,c:260,q:"1 cup (200g)",cat:"Dal & Legumes"},
  {n:"Lobia / black-eyed peas",p:12,c:200,q:"1 cup (200g)",cat:"Dal & Legumes"},
  /* Vegetables */
  {n:"Aloo sabzi",p:3, c:200,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Palak paneer",p:12,c:280,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Paneer bhurji",p:14,c:250,q:"1 cup (150g)",cat:"Vegetables"},
  {n:"Shahi paneer",p:14,c:340,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Mixed veg sabzi",p:3, c:120,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Gobi / cauliflower sabzi",p:3, c:130,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Baingan bharta",p:3, c:150,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Bhindi sabzi",p:2, c:130,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Lauki / bottle gourd sabzi",p:2, c:80,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Palak / spinach sabzi",p:3, c:100,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Aloo matar",p:5, c:220,q:"1 cup (180g)",cat:"Vegetables"},
  {n:"Raita",p:4, c:80,q:"1 cup (150g)",cat:"Vegetables"},
  /* Protein */
  {n:"Paneer (plain)",p:18,c:265,q:"100g",cat:"Protein"},
  {n:"Egg — boiled",p:6, c:78,q:"1 large egg (50g)",cat:"Protein"},
  {n:"Egg — omelette (2-egg)",p:14,c:190,q:"2-egg omelette (100g)",cat:"Protein"},
  {n:"Egg bhurji (2-egg)",p:14,c:200,q:"2-egg scramble (100g)",cat:"Protein"},
  {n:"Chicken curry",p:25,c:300,q:"1 cup (200g)",cat:"Protein"},
  {n:"Chicken breast — grilled",p:31,c:165,q:"100g",cat:"Protein"},
  {n:"Chicken — tandoori",p:26,c:220,q:"2 pieces (150g)",cat:"Protein"},
  {n:"Fish curry",p:22,c:280,q:"1 cup (200g)",cat:"Protein"},
  {n:"Fish — grilled / steamed",p:25,c:140,q:"100g",cat:"Protein"},
  {n:"Mutton curry",p:25,c:380,q:"1 cup (200g)",cat:"Protein"},
  {n:"Prawns — cooked",p:24,c:160,q:"100g",cat:"Protein"},
  {n:"Tofu — plain",p:8, c:76,q:"100g",cat:"Protein"},
  {n:"Soya chunks (dry)",p:26,c:345,q:"50g dry",cat:"Protein"},
  /* Dairy */
  {n:"Full fat milk",p:8, c:150,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Toned milk",p:6, c:120,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Dahi / curd",p:7, c:120,q:"1 cup (200g)",cat:"Dairy"},
  {n:"Greek yogurt",p:10,c:100,q:"150g",cat:"Dairy"},
  {n:"Butter",p:0, c:35,q:"1 tsp (5g)",cat:"Dairy"},
  {n:"Ghee",p:0, c:45,q:"1 tsp (5g)",cat:"Dairy"},
  {n:"Cheese slice",p:5, c:70,q:"1 slice (20g)",cat:"Dairy"},
  {n:"Lassi — sweet",p:8, c:230,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Lassi — salted",p:6, c:150,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Buttermilk / chaas",p:3, c:70,q:"1 glass (250ml)",cat:"Dairy"},
  {n:"Paneer (50g)",p:9, c:132,q:"50g",cat:"Dairy"},
  /* Snacks & Street Food */
  {n:"Samosa",p:4, c:260,q:"1 medium samosa",cat:"Snacks"},
  {n:"Pakoda / bhajiya (4 pcs)",p:4, c:200,q:"4 pieces (80g)",cat:"Snacks"},
  {n:"Vada pav",p:5, c:250,q:"1 piece",cat:"Snacks"},
  {n:"Pav bhaji (2 pav)",p:10,c:450,q:"2 pav + bhaji",cat:"Snacks"},
  {n:"Pani puri (6 pcs)",p:4, c:180,q:"6 pieces",cat:"Snacks"},
  {n:"Bhel puri",p:4, c:180,q:"1 cup (120g)",cat:"Snacks"},
  {n:"Dhokla (4 pcs)",p:8, c:200,q:"4 pieces (150g)",cat:"Snacks"},
  {n:"Roasted chana",p:10,c:190,q:"50g",cat:"Snacks"},
  {n:"Makhana / fox nuts",p:3, c:100,q:"30g",cat:"Snacks"},
  {n:"Namkeen mixture",p:4, c:140,q:"30g",cat:"Snacks"},
  {n:"Potato chips",p:2, c:160,q:"1 small pack (30g)",cat:"Snacks"},
  {n:"Biscuits — Marie (4)",p:2, c:120,q:"4 biscuits (28g)",cat:"Snacks"},
  {n:"Biscuits — digestive (2)",p:2, c:140,q:"2 biscuits (30g)",cat:"Snacks"},
  /* Fruits */
  {n:"Banana",p:1, c:90,q:"1 medium (100g)",cat:"Fruits"},
  {n:"Apple",p:0, c:80,q:"1 medium (150g)",cat:"Fruits"},
  {n:"Mango (Alfonso/Langra)",p:1, c:100,q:"1 cup chunks (150g)",cat:"Fruits"},
  {n:"Papaya",p:1, c:55,q:"1 cup (150g)",cat:"Fruits"},
  {n:"Watermelon",p:2, c:80,q:"2 cups (300g)",cat:"Fruits"},
  {n:"Grapes",p:1, c:110,q:"1 cup (150g)",cat:"Fruits"},
  {n:"Orange",p:1, c:62,q:"1 medium (130g)",cat:"Fruits"},
  {n:"Guava",p:1, c:68,q:"1 medium (100g)",cat:"Fruits"},
  {n:"Pineapple",p:1, c:82,q:"1 cup chunks (150g)",cat:"Fruits"},
  {n:"Pomegranate",p:2, c:105,q:"1 cup arils (150g)",cat:"Fruits"},
  {n:"Chickoo / sapota",p:1, c:120,q:"1 medium (100g)",cat:"Fruits"},
  {n:"Dates",p:1, c:110,q:"3 pieces (30g)",cat:"Fruits"},
  /* Beverages */
  {n:"Chai — milk + sugar",p:2, c:80,q:"1 cup (200ml)",cat:"Beverages"},
  {n:"Black tea / green tea",p:0, c:5,q:"1 cup (200ml)",cat:"Beverages"},
  {n:"Coffee — with milk + sugar",p:3, c:90,q:"1 cup (200ml)",cat:"Beverages"},
  {n:"Black coffee",p:0, c:5,q:"1 cup (200ml)",cat:"Beverages"},
  {n:"Coconut water",p:1, c:60,q:"1 tender coconut (250ml)",cat:"Beverages"},
  {n:"Cold drink / cola (can)",p:0, c:140,q:"1 can (330ml)",cat:"Beverages"},
  {n:"Fresh fruit juice",p:1, c:100,q:"1 glass (200ml)",cat:"Beverages"},
  {n:"Sugarcane juice",p:0, c:180,q:"1 glass (250ml)",cat:"Beverages"},
  {n:"Protein shake (whey, 1 scoop)",p:24,c:120,q:"30g powder in water",cat:"Beverages"},
  /* Restaurant & Takeout */
  {n:"Biryani — chicken (plate)",p:30,c:540,q:"1 plate (350g)",cat:"Restaurant"},
  {n:"Biryani — veg (plate)",p:12,c:450,q:"1 plate (300g)",cat:"Restaurant"},
  {n:"Chole bhature",p:18,c:680,q:"2 bhature + chole",cat:"Restaurant"},
  {n:"North Indian thali (full)",p:30,c:900,q:"1 full thali",cat:"Restaurant"},
  {n:"Masala dosa",p:8, c:420,q:"1 dosa + chutney",cat:"Restaurant"},
  {n:"Pizza — veg (1 slice)",p:10,c:250,q:"1 medium slice (100g)",cat:"Restaurant"},
  {n:"Pizza — non-veg (1 slice)",p:14,c:290,q:"1 medium slice (110g)",cat:"Restaurant"},
  {n:"Burger — veg",p:10,c:290,q:"1 standard burger",cat:"Restaurant"},
  {n:"Burger — chicken",p:22,c:380,q:"1 standard burger",cat:"Restaurant"},
  {n:"French fries — medium",p:4, c:340,q:"medium serving (115g)",cat:"Restaurant"},
  {n:"Fried rice — veg",p:8, c:350,q:"1 plate (200g)",cat:"Restaurant"},
  {n:"Noodles — Hakka (veg)",p:8, c:380,q:"1 plate (200g)",cat:"Restaurant"},
  {n:"Paneer butter masala",p:14,c:360,q:"1 cup (180g)",cat:"Restaurant"},
  /* Sweets & Desserts */
  {n:"Gulab jamun",p:2, c:125,q:"1 piece (50g)",cat:"Sweets"},
  {n:"Ladoo — besan",p:3, c:175,q:"1 piece (40g)",cat:"Sweets"},
  {n:"Kheer / rice pudding",p:6, c:280,q:"1 cup (200g)",cat:"Sweets"},
  {n:"Gajar halwa",p:4, c:250,q:"1 cup (150g)",cat:"Sweets"},
  {n:"Rasgulla",p:2, c:100,q:"1 piece (50g)",cat:"Sweets"},
  {n:"Ice cream (vanilla)",p:2, c:130,q:"1 scoop (65g)",cat:"Sweets"},
  {n:"Chocolate (dark)",p:2, c:170,q:"30g (3 squares)",cat:"Sweets"},
  {n:"Jalebi",p:1, c:150,q:"2 pieces (50g)",cat:"Sweets"},
  /* Nuts, Seeds & Fats */
  {n:"Almonds",p:3, c:70,q:"10 almonds (12g)",cat:"Nuts & Fats"},
  {n:"Cashews",p:2, c:85,q:"10 cashews (14g)",cat:"Nuts & Fats"},
  {n:"Walnuts",p:2, c:130,q:"6 halves (14g)",cat:"Nuts & Fats"},
  {n:"Peanuts — roasted",p:7, c:160,q:"¼ cup (40g)",cat:"Nuts & Fats"},
  {n:"Peanut butter",p:4, c:95,q:"1 tbsp (16g)",cat:"Nuts & Fats"},
  {n:"Cooking oil",p:0, c:40,q:"1 tsp (5ml)",cat:"Nuts & Fats"},
  {n:"Ghee",p:0, c:45,q:"1 tsp (5g)",cat:"Nuts & Fats"},
  {n:"Coconut — grated",p:1, c:90,q:"¼ cup (20g)",cat:"Nuts & Fats"},
  {n:"Honey",p:0, c:64,q:"1 tbsp (21g)",cat:"Nuts & Fats"},
  {n:"Sugar",p:0, c:48,q:"1 tbsp (12g)",cat:"Nuts & Fats"},
  /* Alcohol & Social Drinks — calorie tracking without judgement */
  {n:"Beer (pint, 500ml)",p:2, c:215,q:"500ml",cat:"Alcohol"},
  {n:"Beer (bottle, 330ml)",p:1, c:145,q:"330ml bottle",cat:"Alcohol"},
  {n:"Red wine (glass, 150ml)",p:0, c:125,q:"1 glass (150ml)",cat:"Alcohol"},
  {n:"White wine (glass, 150ml)",p:0, c:120,q:"1 glass (150ml)",cat:"Alcohol"},
  {n:"Whisky / rum (peg, 30ml)",p:0, c:65,q:"1 peg (30ml)",cat:"Alcohol"},
  {n:"Whisky & soda",p:0, c:75,q:"1 glass (200ml)",cat:"Alcohol"},
  {n:"Vodka (shot, 30ml)",p:0, c:60,q:"1 shot (30ml)",cat:"Alcohol"},
  {n:"Gin & tonic",p:0, c:140,q:"1 glass (250ml)",cat:"Alcohol"},
  {n:"Rum & cola",p:0, c:180,q:"1 glass (300ml)",cat:"Alcohol"},
  {n:"Tequila shot",p:0, c:65,q:"1 shot (30ml)",cat:"Alcohol"},
  {n:"Champagne / prosecco",p:0, c:90,q:"1 flute (125ml)",cat:"Alcohol"},
  {n:"Old Monk (peg, 30ml)",p:0, c:65,q:"1 peg (30ml)",cat:"Alcohol"},
  {n:"Cocktail (standard)",p:0, c:200,q:"1 cocktail (200ml)",cat:"Alcohol"},
];

/* ─────────────── calorie calculation ─────────────── */
function mapRegions(arr: string[]): string[] {
  if (!arr||!arr.length) return ["n","s","e","w","all"];
  const mapped=[...new Set(arr.map(x=>RMAP[x]).filter(Boolean))];
  if(["n","s","e","w"].every(r=>mapped.includes(r)||mapped.includes("all"))) return ["n","s","e","w","all"];
  return [...mapped,"all"];
}

/* Map new lifestyle exercise options to WHO/FAO PAL tier keys */
function normExercise(ex: string | undefined): string {
  const m: Record<string,string> = {
    "Running / jogging":         "Gym 3x week",
    "Cycling":                   "Gym 3x week",
    "Swimming":                  "Gym 3x week",
    "Yoga / Pilates":            "Walks / light",
    "Home workouts":             "Gym 3x week",
    "Gym (weights)":             "Gym 3x week",
    "Sports / games":            "Gym 5x+ / sports",
    "HIIT / CrossFit":           "Gym 5x+ / sports",
    "HYROX":                     "Gym 5x+ / sports",
  };
  return m[ex || ""] || ex || "None";
}

function calcStats(d: Profile) {
  const cm = ((+(d.heightFt || 5)) * 12 + (+(d.heightIn || 5))) * 2.54;
  const w = Math.max(30, +(d.weight || 70));
  const target = Math.max(30, +(d.target || w));
  const age = Math.max(15, Math.min(80, +(d.age || 25)));
  const isFemale = d.sex === "Female" || d.sex === "Other";

  /* Mifflin-St Jeor BMR — most validated for Indian adults */
  const bmr = isFemale
    ? 10 * w + 6.25 * cm - 5 * age - 161
    : 10 * w + 6.25 * cm - 5 * age + 5;

  /* Activity × Exercise PAL matrix (WHO/FAO 2001) */
  const PAL: Record<string, Record<string, number>> = {
    "Mostly desk job":    { "None": 1.2, "Walks / light": 1.375, "Gym 3x week": 1.55, "Gym 5x+ / sports": 1.65 },
    "On feet / moderate": { "None": 1.375, "Walks / light": 1.475, "Gym 3x week": 1.60, "Gym 5x+ / sports": 1.75 },
    "Physically active":  { "None": 1.55, "Walks / light": 1.65, "Gym 3x week": 1.75, "Gym 5x+ / sports": 1.90 },
  };
  const pal = PAL[d.activity || "Mostly desk job"]?.[normExercise(d.exercise)] ?? 1.4;
  const baseTdee = Math.round(bmr * pal);

  const cond = d.condition || "None";

  /* Condition adjustments before goal — these are maintenance-level needs */
  let maintenanceTdee = baseTdee;
  if (cond === "Thyroid (hypothyroid)") maintenanceTdee = Math.round(maintenanceTdee * 0.9);
  if (cond === "Pregnant")              maintenanceTdee += 350;  // ACOG 2nd/3rd trimester avg
  else if (cond === "Breastfeeding")    maintenanceTdee += 500;  // WHO full lactation

  let tdee = maintenanceTdee;

  /* ── SMART GOAL INFERENCE from actual weight vs target ──
     If the user's target contradicts their stated goal, honour the
     weight target. "I want to reach 65 kg from 80 kg" means weight
     loss, regardless of which button they tapped.                  */
  const wtDiff = target - w;   // negative = wants to lose, positive = wants to gain
  let effectiveGoal = d.goal || "General fitness";
  if (Math.abs(wtDiff) < 0.5) {
    effectiveGoal = "Maintain weight";
  } else if (wtDiff < 0 && effectiveGoal !== "Weight loss") {
    effectiveGoal = "Weight loss";
  } else if (wtDiff > 0 && effectiveGoal === "Weight loss") {
    effectiveGoal = "Muscle gain";  // target is higher — user wants to gain
  }

  const bmi = w && cm ? w / ((cm / 100) ** 2) : 0;
  /* Asian BMI cutoffs (WHO Asia-Pacific 2004) */
  const bmiCat = bmi < 18.5 ? "Underweight" : bmi < 23 ? "Normal" : bmi < 27.5 ? "Overweight" : "Obese";

  /* If already dangerously underweight, override to maintenance regardless of goal */
  if (bmi > 0 && bmi < 17 && effectiveGoal === "Weight loss") {
    effectiveGoal = "Maintain weight";
  }

  const timeline = d.timeline || "6 months";
  const deficitMap: Record<string, number> = {
    "1 month (aggressive)": 750, "3 months": 600,
    "6 months": 500, "6 months (recommended)": 500,  // legacy key kept
    "1 year": 350, "No fixed timeline": 250,
  };
  const surplusMap: Record<string, number> = {
    "1 month (aggressive)": 500, "3 months": 350,
    "6 months": 250, "6 months (recommended)": 250,
    "1 year": 150, "No fixed timeline": 100,
  };

  /* ── Absolute calorie floors by safety category ── */
  /* Pregnancy floors only apply when biologically female to avoid wrong floors for edge cases */
  const isPregnancyRelated = ["Pregnant", "Breastfeeding"].includes(cond) && isFemale;
  const absFloor = isPregnancyRelated ? 1800 : isFemale ? 1200 : 1500;

  /* ── Apply goal delta with condition-aware caps ── */
  if (effectiveGoal === "Weight loss") {
    /* Pregnant: no deficit at all (foetal growth requires maintenance+) */
    if (cond === "Pregnant" && isFemale) {
      tdee = maintenanceTdee;           // no deficit during pregnancy
    } else {
      const desiredDeficit = deficitMap[timeline] ?? 500;
      /* Breastfeeding: max 500 kcal/day deficit to protect milk supply (AAP/ACOG) */
      /* PCOS: max 400 kcal deficit to avoid hormonal disruption */
      const condCap = (cond === "Breastfeeding" && isFemale) ? 500
        : cond === "PCOS / PCOD" ? 400 : 1000;
      /* Don't deficit below the floor */
      const roomToDeficit = Math.max(0, maintenanceTdee - absFloor);
      const appliedDeficit = Math.min(desiredDeficit, condCap, roomToDeficit);
      tdee = maintenanceTdee - appliedDeficit;
    }
  } else if (effectiveGoal === "Muscle gain") {
    /* Underweight: add more to get them to healthy range faster */
    const bmiCheck = w && cm ? w / ((cm / 100) ** 2) : 22;
    const surplusBoost = bmiCheck < 18.5 ? 100 : 0;
    tdee = maintenanceTdee + (surplusMap[timeline] ?? 250) + surplusBoost;
  }
  /* Maintain / General fitness: tdee stays at maintenanceTdee */

  /* Final safety floor then round — round maintenance too so delta is clean */
  tdee = Math.max(absFloor, tdee);
  tdee = Math.round(tdee / 10) * 10;
  const roundedMaintenance = Math.round(maintenanceTdee / 10) * 10;

  /* ── Weekly rate: based on actual delta from true maintenance ── */
  const actualDelta = tdee - roundedMaintenance;   // negative=deficit, positive=surplus
  const weeklyKcal = actualDelta * 7;              // total kcal delta per week
  const weeklyKg = (Math.abs(weeklyKcal) / 7700).toFixed(2);
  const direction = weeklyKcal < -50 ? "loss" : weeklyKcal > 50 ? "gain" : "";

  return { cm, bmi: bmi.toFixed(1), bmiCat, tdee, maintenanceTdee: roundedMaintenance, weeklyKg, direction, effectiveGoal };
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
  /* PCOS/PCOD: insulin resistance — steer off high-sugar, high-GI items. */
  if (cond==="PCOS / PCOD") return !f.t.includes("sugary");
  return true;
}

interface MealCtx { goal:string; cond:string; diet:string; regions:string[]; simplePref:boolean; picks:string[]; }
/* Keywords from foods the user picked in the game — used to bias the plan
   toward dishes they actually told us they love. */
function picksMatch(f: FoodItem, picks: string[]): boolean {
  if (!picks.length) return false;
  const name=f.n.toLowerCase();
  return picks.some(p=>{
    const kw=p.toLowerCase();
    return name.includes(kw)||kw.split(/\s+/).some(w=>w.length>3&&name.includes(w));
  });
}

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
    if ((ctx.goal==="Weight loss"||ctx.cond==="Diabetes / pre-diabetes"||ctx.cond==="PCOS / PCOD")&&(f.t.includes("lowgi")||f.t.includes("fiber"))) s+=0.3;
    if (ctx.cond==="PCOS / PCOD"&&f.t.includes("protein")) s+=0.3;   // protein steadies insulin response
    if (ctx.cond==="High cholesterol"&&f.t.includes("fiber")) s+=0.2;
    if (["Pregnant","Breastfeeding"].includes(ctx.cond)&&f.t.includes("protein")) s+=0.35;
    if (ctx.simplePref&&f.simple) s+=0.25;
    if (picksMatch(f,ctx.picks)) s+=0.6;   // foods the user picked in the game
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
    "PCOS / PCOD":["Favour low-GI carbs (millets, oats, whole dals) over white rice/maida to steady insulin.","Pair every carb with protein or healthy fat to blunt sugar spikes.","Add omega-3 & fibre — flaxseed, walnuts, methi and leafy greens help hormone balance.","Regular movement (even brisk walks) improves insulin sensitivity in PCOS."],
    "Pregnant":["Take iron, folate & calcium supplements as prescribed by your doctor.","Eat 5-6 small meals — large gaps can cause nausea.","Avoid raw/undercooked meat, raw sprouts and unpasteurised dairy."],
    "Breastfeeding":["Eat an extra 400–500 kcal for milk production — don't skip meals.","Stay very well hydrated — aim for 3+ litres of water a day.","Calcium-rich foods like curd, paneer and ragi support bone health."],
    "Other":["Review this plan with your doctor before starting."],
  };
  const g=goalTips[p.goal||""]||[];
  const c=condTips[p.condition||""]||[];
  const extra=["Drink 2.5–3L water daily and aim for 7+ hours of sleep."];
  return [...g,...c,...extra].slice(0,5);
}

/* ─────────────── exercise guides ─────────────── */
const EXERCISE_GUIDE: Record<string, ExGuide> = {
  "Push-ups":{muscles:["Chest","Triceps","Shoulders","Core"],steps:["Start in a high plank with hands shoulder-width apart","Lower your chest to just above the floor, elbows at 45°","Press back up explosively to full arm extension","Keep your core braced throughout — no sagging hips","Breathe in on the way down, out on the way up"],tip:"Place hands slightly wider for more chest, closer for more triceps.",emoji:"🫸",burnType:"compound"},
  "Incline push-ups":{muscles:["Upper chest","Shoulders","Triceps"],steps:["Place hands on a raised surface (sofa/bench) shoulder-width apart","Walk feet back to a diagonal plank position","Lower chest toward the surface, elbows flared 45°","Push back to start, squeezing chest at the top","Keep abs tight and back flat"],tip:"The lower the surface, the harder it gets — progress toward the floor over time.",emoji:"📐",burnType:"compound"},
  "Pike push-ups":{muscles:["Shoulders","Triceps","Upper chest"],steps:["Start in downward-dog position — hips high, hands and feet on the floor","Bend elbows to lower your head toward the floor between your hands","Press back up to the starting pike position","Keep legs as straight as possible","Focus on using your shoulders, not your chest"],tip:"The more vertical your torso, the more shoulder work you'll get.",emoji:"⬆️",burnType:"compound"},
  "Bench dips":{muscles:["Triceps","Chest","Front shoulders"],steps:["Sit on the edge of a chair/bench, hands gripping the edge beside your hips","Slide your hips off the edge, legs extended or bent for easier","Bend elbows to lower your hips toward the floor, stopping at 90°","Press through your palms to return to start","Keep your back close to the chair throughout"],tip:"Straighten your legs to increase difficulty; bend them to make it easier.",emoji:"🪑",burnType:"isolation"},
  "Diamond push-ups":{muscles:["Triceps","Inner chest","Shoulders"],steps:["Form a diamond shape with your thumbs and index fingers on the floor","Assume a high plank with arms under your chest","Lower your chest toward your hands, keeping elbows close to your sides","Press back up, squeezing the triceps","Keep your core tight and hips level"],tip:"If full reps are too hard, do them from your knees to build tricep strength first.",emoji:"💎",burnType:"compound"},
  "Towel door rows":{muscles:["Back","Biceps","Rear shoulders"],steps:["Loop a towel around a door handle and hold both ends","Lean back at ~45°, arms extended, feet close to the door base","Pull your chest toward the door handle, squeezing shoulder blades","Lower under control back to the start position","Keep elbows close to your body as you pull"],tip:"The more upright you stand, the easier it is — lean further back to increase difficulty.",emoji:"🚪",burnType:"compound"},
  "Superman hold":{muscles:["Lower back","Glutes","Rear shoulders","Hamstrings"],steps:["Lie face-down on a mat, arms extended overhead","Simultaneously lift your arms, chest, and legs off the floor","Squeeze your glutes and lower back at the top","Hold the peak position for 1–2 seconds","Lower slowly and repeat"],tip:"Focus on length rather than height — reach your arms and legs away from your centre.",emoji:"🦸",burnType:"hold"},
  "Reverse snow angels":{muscles:["Rear deltoids","Rhomboids","Trapezius"],steps:["Lie face-down, arms at your sides, thumbs pointing up","Sweep both arms overhead like a snow angel, keeping them off the floor","Bring them back to your sides with control","Keep your head neutral","Squeeze your shoulder blades at the end of each rep"],tip:"Go slowly and feel the squeeze between your shoulder blades on every rep.",emoji:"❄️",burnType:"isolation"},
  "Prone Y-T-W raises":{muscles:["Lower trapezius","Rear deltoids","Rotator cuff"],steps:["Lie face-down, arms extended","Y: arms at 30° overhead, thumbs up — raise and lower","T: arms straight out to the sides — raise and lower","W: elbows bent 90°, pulled back with external rotation — raise and lower","Move slowly through each letter, pausing at the top"],tip:"Use very light or no weight — this is control work, not strength work.",emoji:"🔤",burnType:"isolation"},
  "Bodyweight squats":{muscles:["Quads","Glutes","Hamstrings","Core"],steps:["Stand with feet shoulder-width apart, toes slightly out","Push hips back and bend knees to lower as if sitting in a chair","Keep chest up and knees tracking over toes","Lower until thighs are parallel to the floor","Drive through your heels to stand, squeezing glutes at the top"],tip:"Keep your weight on your heels — you should be able to wiggle your toes at the bottom.",emoji:"🦵",burnType:"compound"},
  "Reverse lunges":{muscles:["Quads","Glutes","Hamstrings","Balance"],steps:["Stand tall, feet hip-width apart","Step one foot back and lower your back knee toward the floor","Front thigh should be parallel to the floor, front knee over ankle","Push through your front heel to return to standing","Alternate legs each rep"],tip:"Look straight ahead and keep your torso upright — don't lean forward.",emoji:"↩️",burnType:"compound"},
  "Glute bridges":{muscles:["Glutes","Hamstrings","Lower back","Core"],steps:["Lie on your back, knees bent, feet flat and hip-width apart","Press through heels and squeeze glutes to lift hips off the floor","Drive hips up until your body forms a straight line from knees to shoulders","Hold 1–2 seconds at the top, squeezing hard","Lower slowly to just above the floor and repeat"],tip:"Tuck your chin to your chest to protect your neck and keep the focus on your glutes.",emoji:"🍑",burnType:"compound"},
  "Wall sit":{muscles:["Quads","Glutes","Core"],steps:["Stand with your back flat against a wall","Slide down until your thighs are parallel to the floor (90° at knees)","Feet flat, hip-width apart, directly below your knees","Arms at sides or on thighs","Hold the position, breathing steadily throughout"],tip:"If your knees hurt, don't go as deep — stop at a comfortable angle above 90°.",emoji:"🧱",burnType:"hold"},
  "Calf raises":{muscles:["Gastrocnemius","Soleus"],steps:["Stand on the edge of a step or flat floor, feet hip-width apart","Rise up onto your toes as high as possible","Hold the peak position for 1 second","Lower your heels slowly for a full stretch","Repeat with control — avoid bouncing"],tip:"Use a step for extra range of motion; hold a wall for balance if needed.",emoji:"🦶",burnType:"isolation"},
  "Bulgarian split squat":{muscles:["Quads","Glutes","Hamstrings","Balance"],steps:["Stand a stride's length in front of a bench or chair","Place one foot behind you on the surface, laces down","Lower your back knee toward the floor, keeping torso upright","Front thigh parallel to floor at the bottom","Press through your front heel to stand — complete all reps then switch"],tip:"Keep most of your weight on the front foot — you should feel the working quad and glute.",emoji:"🏋️",burnType:"compound"},
  "Plank":{muscles:["Core","Shoulders","Glutes","Back"],steps:["Place forearms on the floor, elbows below shoulders","Extend legs behind you in a straight line — toes on the floor","Brace abs, squeeze glutes, keep hips level","Look at the floor a few centimetres ahead of your hands","Breathe steadily and hold for the target time"],tip:"Think of pulling your belly button toward your spine — that single cue makes the plank dramatically harder.",emoji:"🧘",burnType:"hold"},
  "Bicycle crunches":{muscles:["Rectus abdominis","Obliques","Hip flexors"],steps:["Lie on your back, hands behind your head, knees raised 90°","Lift your shoulder blades off the floor and rotate one elbow toward the opposite knee","Simultaneously extend the other leg straight","Switch sides in a smooth pedalling motion","Keep the movement controlled — don't pull on your neck"],tip:"Slow and deliberate beats fast and sloppy — slow reps give your obliques a full squeeze.",emoji:"🚲",burnType:"isolation"},
  "Mountain climbers":{muscles:["Core","Shoulders","Hip flexors","Cardio"],steps:["Start in a high plank — hands below shoulders, body in a straight line","Drive one knee toward your chest","Quickly switch legs, extending the first leg back","Continue alternating as fast as you can while maintaining a flat back","Keep hips level — don't let them bounce"],tip:"Go as fast as you can while keeping your lower back flat — quality over speed.",emoji:"🏔️",burnType:"cardio"},
  "Leg raises":{muscles:["Lower abs","Hip flexors","Core"],steps:["Lie flat on your back, hands under your glutes for support","Legs straight, raise them to 90° (vertical)","Lower slowly — stop just before your heels touch the floor","Pause and repeat without letting heels rest on the ground","Keep your lower back pressed into the floor throughout"],tip:"If this strains your lower back, bend your knees slightly to reduce the lever arm.",emoji:"🦵",burnType:"isolation"},
  "Side plank":{muscles:["Obliques","Hip abductors","Core"],steps:["Lie on one side, forearm on the floor directly below your shoulder","Stack feet or stagger them for balance","Lift hips off the floor so your body forms a straight diagonal line","Keep core tight and hips stacked — don't let hips sag","Hold for target time, then switch sides"],tip:"Drive your hips toward the ceiling — this keeps the obliques under tension the whole time.",emoji:"📐",burnType:"hold"},
  "Dead bug":{muscles:["Deep core","Transverse abdominis","Hip flexors"],steps:["Lie on your back, arms straight up, knees bent 90° (tabletop position)","Slowly lower one arm overhead and the opposite leg toward the floor","Keep your lower back pressed firmly into the floor throughout","Return to start and repeat on the other side","Breathe out as you lower, in as you return"],tip:"The key rule: lower back must stay glued to the floor. Sacrifice range of motion over that.",emoji:"🐛",burnType:"isolation"},
  "Jumping jacks":{muscles:["Full body","Cardio","Shoulders","Legs"],steps:["Stand with feet together, arms at sides","Jump feet out to shoulder-width while raising arms overhead","Jump back to starting position, lowering arms","Maintain a steady, rhythmic pace","Land softly on the balls of your feet"],tip:"If you need low-impact, step side to side instead of jumping while still moving your arms.",emoji:"⭐",burnType:"cardio"},
  "High knees":{muscles:["Cardio","Hip flexors","Core","Legs"],steps:["Stand tall with feet hip-width apart","Drive one knee up toward your chest","Quickly switch to drive the other knee up","Pump your arms in sync with your legs","Aim for a jogging-on-the-spot pace or faster"],tip:"Keep your core tight and back straight — don't lean back as you drive the knees up.",emoji:"🏃",burnType:"cardio"},
  "Burpees":{muscles:["Full body","Cardio","Chest","Legs","Core"],steps:["Stand, then drop into a squat and place hands on the floor","Jump feet back into a plank position","Do one push-up (optional for beginners)","Jump feet back toward hands","Explode up, jumping with arms overhead"],tip:"Modify by stepping feet back instead of jumping to reduce intensity while keeping the full movement.",emoji:"💥",burnType:"cardio"},
  "Skater hops":{muscles:["Glutes","Quads","Cardio","Balance"],steps:["Stand on one leg, slight knee bend","Push off and jump laterally to the opposite leg","Swing the free leg behind the landing leg for balance","Land softly on the other foot, absorbing impact through your knee","Immediately hop back — keep a rhythm going"],tip:"Touch your hand to the ground on each landing to deepen the athletic position and balance challenge.",emoji:"⛸️",burnType:"cardio"},
  "DB floor / bench press":{muscles:["Chest","Triceps","Front shoulders"],steps:["Lie on the floor or a bench, a dumbbell in each hand at chest level","Press both weights up until arms are nearly extended over your chest","Lower under control until upper arms touch the floor/bench","Keep wrists straight and core braced throughout","Breathe in on the way down, out on the press"],tip:"Floor press naturally limits the range of motion, protecting your shoulders — great for beginners.",emoji:"🏋️",burnType:"compound"},
  "DB shoulder press":{muscles:["Shoulders","Triceps","Upper traps"],steps:["Sit or stand holding dumbbells at shoulder height, palms forward","Press both weights overhead until arms are fully extended","Don't lock out your elbows — keep a slight bend at the top","Lower the weights back to shoulder level under control","Keep your core tight and lower back neutral"],tip:"Seated version reduces lower back involvement — good if you have back issues.",emoji:"🏆",burnType:"compound"},
  "DB lateral raise":{muscles:["Side deltoids","Rotator cuff"],steps:["Stand holding light dumbbells at your sides, slight bend in elbows","Raise both arms out to the sides to shoulder height","Lead with your elbows, not your wrists","Hold briefly at the top, then lower slowly with control","Don't use momentum — slow negatives are key for shoulder development"],tip:"Think of pouring a cup of water at the top — tilt the front slightly down for better deltoid activation.",emoji:"↔️",burnType:"isolation"},
  "DB overhead triceps extension":{muscles:["Triceps (long head)"],steps:["Hold one dumbbell with both hands overhead","Keep upper arms beside your ears — they stay stationary","Bend elbows to lower the weight behind your head","Extend back overhead, squeezing triceps at the top","Keep wrists straight and don't flare elbows out"],tip:"Keep upper arms truly vertical and still — if they move, you're losing the isolation.",emoji:"💪",burnType:"isolation"},
  "DB bent-over row":{muscles:["Back","Biceps","Rear shoulders"],steps:["Hold dumbbells, hinge at hips to 45°, back flat, slight knee bend","Let arms hang straight down, palms facing each other","Pull the weights to your hip bones, squeezing shoulder blades together","Hold briefly at the top, then lower with control","Keep neck neutral — look at the floor a metre ahead"],tip:"Imagine you're trying to put your elbows in your back pockets — this cue fires the lats perfectly.",emoji:"🏋️",burnType:"compound"},
  "DB reverse fly":{muscles:["Rear deltoids","Rhomboids","Trapezius"],steps:["Hinge forward at hips, dumbbells hanging below you, palms facing each other","Raise both arms out to the sides like wings","Lead with elbows, keep a slight bend in them","Squeeze shoulder blades at the top","Lower slowly — 3 seconds down"],tip:"Use very light weight and focus on the squeeze between your shoulder blades.",emoji:"🦅",burnType:"isolation"},
  "DB bicep curl":{muscles:["Biceps","Forearms"],steps:["Stand with dumbbells at sides, palms facing forward","Curl both weights toward your shoulders, keeping elbows fixed at your sides","Squeeze biceps hard at the top","Lower slowly — 3 seconds — back to full extension","Don't swing your back; keep everything still except your forearms"],tip:"Full extension at the bottom gives you the full stretch — that's where a lot of growth happens.",emoji:"💪",burnType:"isolation"},
  "Single-arm DB row":{muscles:["Back (lats)","Biceps","Core"],steps:["Place one knee and same-side hand on a bench for support","Hold a dumbbell in the free hand, arm hanging straight","Pull the weight to your hip, elbow driving back past your torso","Squeeze the lat at the top, hold briefly","Lower under control to full extension and repeat"],tip:"Think of your arm as a hook — it just holds the dumbbell; the back does the pulling.",emoji:"🏋️",burnType:"compound"},
  "DB goblet squat":{muscles:["Quads","Glutes","Core","Upper back"],steps:["Hold a single dumbbell vertically at your chest with both hands cupping the top","Stand feet shoulder-width, toes slightly out","Sit deep into a squat, keeping elbows inside your knees at the bottom","Keep chest upright and weight on your heels","Drive through heels to stand, squeezing glutes at the top"],tip:"The goblet position forces an upright torso — great for practicing good squat form.",emoji:"🏆",burnType:"compound"},
  "DB Romanian deadlift":{muscles:["Hamstrings","Glutes","Lower back"],steps:["Hold dumbbells at hips, feet hip-width apart","Push hips back and hinge forward, keeping back flat and weights close to legs","Lower weights to mid-shin level — feel the hamstring stretch","Drive hips forward to return to standing, squeezing glutes at the top","Don't round your back at any point"],tip:"Think of closing a car door with your glutes at the top — hard squeeze = full hip extension.",emoji:"🏋️",burnType:"compound"},
  "DB walking lunge":{muscles:["Quads","Glutes","Hamstrings","Balance"],steps:["Hold dumbbells at sides and stand tall","Step forward with one leg and lower until both knees form 90°","Keep front knee over ankle — don't let it cave in","Push through front heel to bring feet together and step forward with the other leg","Continue alternating for the set distance or rep count"],tip:"Keep your torso upright and take long enough strides so your front shin stays vertical.",emoji:"🚶",burnType:"compound"},
  "DB calf raise":{muscles:["Gastrocnemius","Soleus"],steps:["Hold dumbbells at sides, stand on floor or a step edge","Rise up onto the balls of both feet as high as possible","Pause for 1 second at the top","Lower slowly — 3 seconds — for a full calf stretch","Avoid bouncing — the slow lower is where it works"],tip:"Single-leg version dramatically increases difficulty without needing heavier weights.",emoji:"🦶",burnType:"isolation"},
};

/* ─────────────── recipe database ─────────────── */
const RECIPE_DB: Record<string, Recipe> = {
  "Vegetable poha":{time:"15 min",ingredients:["1½ cups thick poha","1 medium onion, sliced","½ cup mixed veggies (peas, carrot)","1 tsp mustard seeds","1 green chilli","½ tsp turmeric","Curry leaves, lemon juice, coriander","Salt to taste"],steps:["Rinse poha and drain. Let it soften for 5 min.","Heat oil; splutter mustard seeds, curry leaves, chilli.","Sauté onion until soft. Add veggies, turmeric, salt; cook 3 min.","Add poha and mix gently on low heat for 2 min.","Squeeze lemon, garnish with coriander and serve."],tip:"Rinse poha in a colander and shake off water — don't soak it or it turns mushy."},
  "Besan chilla with mint chutney":{time:"20 min",ingredients:["1 cup besan","½ cup water","1 small onion, finely chopped","1 green chilli, chopped","½ tsp ajwain","Coriander, salt, red chilli powder"],steps:["Mix besan, water, onion, chilli, ajwain, salt into a pourable batter.","Heat a non-stick pan on medium; brush with ½ tsp oil.","Pour a ladle of batter and spread thin like a dosa.","Cook 2 min each side until golden.","Serve hot with mint chutney."],tip:"Add 1 tsp flaxseed powder to the batter for an omega-3 boost."},
  "Moong dal cheela":{time:"20 min",ingredients:["½ cup moong dal (soaked 4 hrs or overnight)","1 tsp grated ginger","1 green chilli","Salt, cumin seeds","Coriander leaves"],steps:["Blend soaked moong dal with ginger, chilli, salt and a little water into a thick batter.","Heat a pan, grease lightly.","Pour batter and spread thin; cook on medium heat 2–3 min.","Flip and cook 1–2 min on the other side.","Serve with chutney or curd."],tip:"No soaking time? Use ½ cup moong dal flour instead."},
  "Oats with milk, banana & seeds":{time:"5 min",ingredients:["½ cup rolled oats","200ml milk","1 ripe banana, sliced","1 tsp mixed seeds (flax, chia, pumpkin)","Pinch of cinnamon"],steps:["Heat milk in a saucepan; add oats.","Cook on medium heat 2–3 min, stirring, until creamy.","Pour into a bowl; top with banana and seeds.","Dust with cinnamon and serve."],tip:"Make overnight oats by soaking everything in cold milk in the fridge — ready in the morning with no cooking."},
  "Oats with almond milk & fruit":{time:"5 min",ingredients:["½ cup rolled oats","200ml almond milk","½ cup mixed berries or chopped fruit","1 tsp honey (optional)","1 tbsp nuts"],steps:["Microwave oats and almond milk for 2 minutes (or stovetop 3 min).","Stir and add more milk if needed.","Top with fruit, nuts, and a drizzle of honey.","Serve immediately."],tip:"Use unsweetened almond milk to keep calories in check."},
  "Vegetable upma":{time:"20 min",ingredients:["¾ cup semolina (suji)","1 cup water + 1 cup milk (or 2 cups water)","½ cup mixed veggies","1 tsp mustard seeds, curry leaves","1 small onion","Salt, green chilli"],steps:["Dry roast semolina on low heat until lightly fragrant (3 min). Set aside.","Heat oil; splutter mustard seeds, curry leaves. Add onion and chilli.","Add veggies and sauté 3 min.","Pour in water, bring to boil, add salt.","Add roasted semolina slowly, stirring continuously. Cook on low 2 min until thick."],tip:"Roasting the semolina beforehand prevents lumps and adds a nuttier flavour."},
  "Idli (3) with coconut chutney":{time:"10 min",ingredients:["Store-bought idli batter","Coconut chutney (ready-made or fresh)"],steps:["Grease idli moulds; pour batter ¾ full.","Steam for 10–12 min on medium heat.","Test with a toothpick — it should come out clean.","Rest 2 min, then unmould with a wet spoon.","Serve with coconut chutney."],tip:"Use store-bought idli batter for a weekday-friendly 10-minute breakfast."},
  "Idli (3) with sambar":{time:"10 min",ingredients:["Store-bought idli batter","Ready-made or homemade sambar"],steps:["Grease idli moulds; pour batter ¾ full.","Steam for 10–12 min.","Meanwhile, heat sambar; thin with water if needed.","Unmould idlis carefully.","Serve with hot sambar."],tip:"Frozen sambar from a previous batch works perfectly — just reheat and add water."},
  "Masala dosa with chutney":{time:"30 min",ingredients:["Store-bought dosa batter","2 medium potatoes, boiled and mashed","1 onion, chopped","½ tsp mustard seeds, curry leaves, turmeric","Green chilli, salt, coriander"],steps:["Make aloo masala: splutter mustard seeds, sauté onion and chilli, add mashed potato with turmeric and salt.","Heat a flat tava on medium-high, grease lightly.","Pour a ladle of batter and spread in concentric circles.","Drizzle oil on edges; cook until crisp and golden.","Place filling on one half, fold and serve with chutney."],tip:"A very hot tava is the secret to crispy dosa — let it smoke slightly before adding batter."},
  "Plain dosa with sambar":{time:"25 min",steps:["Heat a non-stick tava on high heat.","Pour a ladleful of batter and spread thin in circles.","Drizzle a few drops of oil around the edges.","Cook until edges lift and dosa is golden (2–3 min). Don't flip for plain dosa.","Fold and serve with hot sambar."],tip:"If batter sticks, wipe with a halved onion dipped in oil."},
  "Pesarattu (moong dosa)":{time:"25 min",ingredients:["1 cup whole green moong (soaked overnight)","1 tsp grated ginger","1 green chilli","Salt","Cumin seeds"],steps:["Blend soaked moong with ginger, chilli, cumin and salt into a smooth, pourable batter.","Heat a tava on medium-high, grease lightly.","Pour batter and spread thin.","Cook 2–3 min, flip and cook 1 min on the other side.","Serve with ginger chutney."],tip:"This dosa needs no fermentation — you can make it same morning."},
  "Ragi dosa":{time:"20 min",ingredients:["½ cup ragi flour","¼ cup rice flour or semolina","1 cup buttermilk","Grated coconut, green chilli, salt","Mustard seeds, curry leaves"],steps:["Mix ragi flour, rice flour, buttermilk, coconut, chilli, salt to a smooth batter.","Temper mustard seeds and curry leaves in oil; add to batter.","Rest 10 min; adjust consistency (should pour like cream).","Cook on a hot tava like a regular dosa.","Serve with coconut chutney."],tip:"Using buttermilk instead of water adds flavour and helps the dosa crisp up beautifully."},
  "Aloo paratha with curd":{time:"25 min",ingredients:["2 cups whole wheat dough (made ahead)","2 medium potatoes, boiled and mashed","1 tsp ajwain, green chilli, ginger","Coriander, salt, red chilli powder","Curd for serving"],steps:["Mix mashed potato with ajwain, chilli, ginger, coriander, salt to make filling.","Roll a ball of dough flat, place filling in centre, seal and re-roll gently.","Cook on a hot tawa on both sides with a little ghee/butter until golden.","Press gently while cooking for even cooking.","Serve hot with cold curd."],tip:"Don't overfill — use just enough filling to spread a thin layer inside."},
  "Paneer paratha with curd":{time:"25 min",ingredients:["2 cups whole wheat dough","150g paneer, grated","Green chilli, ginger, coriander","Jeera powder, salt"],steps:["Mix grated paneer with chilli, ginger, coriander, jeera, salt.","Make parathas — seal, re-roll, cook with ghee.","Cook until both sides are golden with brown spots.","Rest 1 min before serving.","Serve with curd and pickle."],tip:"Grate paneer finely so it spreads evenly — chunky paneer tends to burst through the dough."},
  "Methi thepla with curd":{time:"20 min",ingredients:["1 cup whole wheat flour","1 cup fresh methi leaves, finely chopped","1 tsp sesame seeds, ajwain","½ tsp turmeric, chilli powder","Salt, 2 tsp oil"],steps:["Combine flour, methi, sesame, ajwain, turmeric, chilli, salt with a little curd and oil.","Knead into a soft dough, adding water sparingly.","Roll thin (thinner than paratha).","Cook on a hot tawa with minimal oil, 1–2 min each side.","Serve with curd or pickle."],tip:"Theplas stay soft and travel-friendly for 2–3 days — make a batch on Sunday."},
  "Steamed dhokla":{time:"25 min",ingredients:["1 cup besan","½ cup curd","1 tsp ENO or baking soda","1 tbsp lemon juice","1 tsp ginger-chilli paste","Salt, turmeric","Mustard seeds, curry leaves for tempering"],steps:["Mix besan, curd, ginger-chilli paste, lemon, turmeric, salt into a smooth batter.","Add ENO just before steaming and mix gently.","Pour into a greased plate/tin and steam 12–15 min.","Check with a toothpick — it should come out clean.","Temper mustard seeds and curry leaves in oil; drizzle over dhokla. Cut and serve."],tip:"Add ENO at the very last moment before steaming — the reaction creates the spongy texture."},
  "Vegetable daliya":{time:"20 min",ingredients:["½ cup broken wheat (daliya)","1 cup mixed veggies (carrot, peas, beans)","1 tsp cumin seeds","1 small onion, chopped","Salt, turmeric, garam masala"],steps:["Dry roast daliya 3 min until fragrant. Set aside.","Heat oil; add cumin, then onion. Sauté 2 min.","Add veggies, turmeric, salt; cook 3 min.","Add daliya and 1½ cups water. Mix and bring to a boil.","Cover and cook on low 10 min until soft. Fluff and serve."],tip:"Daliya cooks quicker in a pressure cooker — 1 whistle on high, then 2 on low."},
  "Ragi porridge":{time:"10 min",ingredients:["3 tbsp ragi flour","250ml milk","1 tsp jaggery or honey","Pinch of cardamom","Pinch of salt"],steps:["Mix ragi flour with 2 tbsp cold milk to make a smooth slurry.","Heat remaining milk in a pan until simmering.","Add the slurry slowly, stirring continuously.","Cook on low heat 3–4 min, stirring, until thickened.","Add jaggery/honey and cardamom. Serve warm."],tip:"Mix flour with cold milk first to prevent lumps — this is the key step."},
  "Sprout & veg salad bowl":{time:"5 min",ingredients:["1 cup mixed sprouts (moong, chana)","1 cup chopped veggies (cucumber, tomato, onion, carrot)","1 tbsp lemon juice","Salt, chaat masala, coriander"],steps:["Toss sprouts and veggies together in a bowl.","Season with lemon juice, salt and chaat masala.","Garnish with fresh coriander.","Serve immediately."],tip:"Sprouts can be prepared 2 days ahead — store in the fridge in a damp cloth."},
  "Boiled eggs (2) with toast":{time:"10 min",steps:["Bring water to a boil; lower eggs in gently with a spoon.","Cook 8 min for fully set yolk (7 for slightly jammy).","Transfer to cold water for 1 min; peel.","Toast bread until golden.","Season eggs with salt and pepper. Serve."],tip:"Cold eggs + cold water start gives a more consistent result."},
  "Egg bhurji with roti":{time:"15 min",ingredients:["2 eggs","1 small onion, finely chopped","1 tomato, chopped","1 green chilli","½ tsp cumin, turmeric, red chilli","Salt, coriander","2 rotis"],steps:["Heat oil; splutter cumin, add onion and chilli. Sauté 2 min.","Add tomato, turmeric, red chilli, salt; cook 2 min.","Crack eggs in and scramble on low-medium heat.","Keep stirring for soft, fluffy bhurji.","Garnish with coriander. Serve with hot rotis."],tip:"Low heat is the secret to soft bhurji — high heat makes it rubbery."},
  "Bread omelette":{time:"10 min",steps:["Beat 2 eggs with onion, chilli, coriander, salt, pepper, turmeric.","Heat a pan on medium; add ½ tsp oil.","Pour egg mixture; place bread slices on the wet egg.","When egg is mostly set, flip the whole thing.","Cook 1 min on the bread side; serve fold-side up."],tip:"Press the bread gently onto the uncooked egg — it acts as a base and makes flipping easy."},
  "Banana peanut-butter toast":{time:"3 min",ingredients:["2 slices whole wheat bread","2 tbsp natural peanut butter","1 ripe banana, sliced"],steps:["Toast bread until golden.","Spread peanut butter generously on each slice.","Layer banana slices on top.","Serve immediately."],tip:"Use natural (no added sugar) peanut butter for the healthiest option."},
  "Cinnamon oats with flaxseed":{time:"7 min",steps:["Heat milk; add oats and ground flaxseed.","Cook 3–4 min, stirring, until creamy.","Stir in cinnamon and sweeten to taste.","Serve immediately."],tip:"Grind flaxseed fresh in a small blender — pre-ground flax loses its omega-3 content over time."},
  "Seasonal fruit bowl":{time:"2 min",steps:["Chop a mix of whatever seasonal fruits are available.","Toss with a squeeze of lemon juice to prevent browning.","A sprinkle of chaat masala adds a lovely kick."],tip:"Eat within 30 minutes of cutting — fruits oxidise and lose vitamin C quickly once cut."},
  "Buttermilk (chaas)":{time:"2 min",steps:["Blend 2 tbsp thick curd with 200ml cold water.","Add a pinch of salt, roasted cumin powder, and fresh mint.","Blend or whisk until frothy.","Serve chilled."],tip:"Homemade chaas is far lower in sodium than store-bought — make your own for a probiotic boost."},
  "Roasted chana (handful)":{time:"1 min",steps:["Buy pre-roasted chana from any grocery store.","Measure out ¼ cup (about a handful — 40g).","Eat as is, or with a squeeze of lemon and pinch of chaat masala."],tip:"Roasted chana is one of the most protein-efficient snacks in Indian cuisine — 7g protein for just 120 kcal."},
  "Moong sprouts cup":{time:"2 min",steps:["Take 1 cup ready sprouts.","Toss with salt, lemon juice, chaat masala and chopped tomato.","Optionally add cucumber and coriander.","Eat immediately."],tip:"Sprouting increases the bioavailability of protein by up to 30% compared to cooked dal."},
  "Green tea with roasted makhana":{time:"5 min",steps:["Brew green tea for 2–3 min (don't over-steep or it turns bitter).","Lightly roast makhana in a dry pan with a pinch of salt and ghee for 2 min.","Sip tea alongside the crunchy makhana."],tip:"Makhana is a great low-calorie high-protein snack — don't add too much ghee or butter."},
  "Roasted peanuts":{time:"1 min",steps:["Measure ¼ cup (40g) roasted peanuts.","Season with salt, lime juice and chilli if desired.","Eat mindfully — peanuts are calorie-dense, so portion control matters."],tip:"Peanuts in the shell force slower eating — you'll naturally consume less."},
  "Chana sundal":{time:"10 min",ingredients:["1 cup boiled chickpeas (or canned, drained)","1 tsp mustard seeds","Curry leaves, dry red chilli","2 tbsp grated coconut","Salt, lemon juice"],steps:["Heat oil; splutter mustard seeds, curry leaves, red chilli.","Add boiled chickpeas, salt and toss for 2 min.","Remove from heat; add coconut and lemon juice.","Serve warm or at room temperature."],tip:"Use canned chickpeas on busy days — just drain, rinse and they're ready."},
  "Pan-tossed paneer cubes":{time:"5 min",steps:["Cube 80g paneer.","Heat a pan on high; add ½ tsp oil.","Add paneer cubes and let them sear undisturbed for 1 min.","Toss with a pinch of chilli powder, salt and dried herbs.","Cook 1 more min and serve hot."],tip:"High heat and patience — don't move the paneer for the first minute so it develops a golden crust."},
  "2 roti, dal tadka, bhindi & curd":{time:"30 min",ingredients:["2 whole wheat rotis","1 cup toor/moong dal","1 cup bhindi (okra), sliced","1 tsp mustard seeds, cumin","1 tomato, 1 onion","Turmeric, red chilli, coriander","½ cup curd"],steps:["Pressure cook dal with turmeric and salt (2 whistles).","For tadka: heat ghee, add cumin, then onion, tomato and spices. Add to cooked dal.","For bhindi: sauté in dry pan with mustard seeds, salt and a pinch of amchur until tender (8 min).","Make or heat rotis.","Serve dal, bhindi and cold curd together."],tip:"Cook bhindi in a dry pan without adding water — moisture makes it slimy."},
  "2 roti, rajma & small rice":{time:"35 min",ingredients:["2 rotis","1 cup rajma (pre-soaked and pressure cooked)","½ cup cooked rice","Onion, tomato, ginger-garlic paste","Rajma masala, cumin, oil, coriander"],steps:["Sauté onion until golden. Add ginger-garlic paste, tomato, masala.","Add cooked rajma with ½ cup cooking liquid. Simmer 10 min.","Mash a few rajma with the back of a spoon for a thicker gravy.","Serve with hot rotis and rice."],tip:"Soaked and pressure-cooked rajma can be frozen in batches — a huge weeknight time saver."},
  "2 roti, chole & salad":{time:"30 min",ingredients:["2 rotis","1 cup chickpeas (pre-soaked and cooked)","Onion, tomato, ginger, garlic","Chole masala, anardana powder","Cucumber and tomato salad"],steps:["Cook chole masala base: sauté onion until dark, add ginger-garlic, tomatoes.","Add chickpeas and masala; simmer 15 min until gravy thickens.","Finish with anardana powder for tanginess.","Serve with rotis and fresh salad."],tip:"A dark, caramelised onion base is the key to restaurant-style chole — don't rush this step."},
  "Palak paneer with 2 roti":{time:"30 min",ingredients:["2 big bunches fresh palak (spinach)","100g paneer, cubed","1 onion, 2 tomatoes","Ginger-garlic paste","Cumin, garam masala"],steps:["Blanch spinach 2 min, blend to smooth purée.","Sauté onion until golden; add ginger-garlic and tomatoes. Cook until dry.","Add spices and spinach purée; cook 5 min.","Add paneer cubes; simmer 5 min.","Serve hot with rotis."],tip:"Blanch and blend the spinach fresh — it's brighter green and more nutritious than using frozen."},
  "Dal makhani with jeera rice":{time:"45 min",ingredients:["½ cup whole black urad dal","2 tbsp rajma","1 tbsp butter + 1 tbsp oil","Onion, tomato, ginger-garlic","Cream, garam masala, red chilli powder"],steps:["Pressure cook urad dal and rajma together until very soft (8–10 whistles).","Make a rich onion-tomato masala; add to dal.","Simmer on very low heat 20 min, stirring often.","Add butter and a spoon of cream at the end.","Cook jeera rice separately. Serve together."],tip:"Dal makhani improves dramatically overnight — make it the day before for best flavour."},
  "Mixed veg, dal & 2 roti":{time:"25 min",steps:["Pressure cook 1 cup moong dal (2 whistles).","Make a light tadka with cumin, onion, tomato.","Add 1½ cups mixed veggies and cook till tender (8 min). Mix with dal.","Make or heat 2 rotis.","Serve together."],tip:"Use whatever vegetables are in season — this is a flexible, nutritious base meal."},
  "Rice, sambar, rasam, poriyal & curd":{time:"40 min",steps:["Cook rice. Make sambar with toor dal, vegetables and sambar powder.","Prepare rasam by boiling tamarind water with tomato, pepper, cumin.","Stir-fry chosen vegetable with mustard seeds, dried red chilli and coconut for poriyal.","Serve all together on a plate with curd on the side."],tip:"This is a complete South Indian meal — sambar (protein), poriyal (fibre) and curd (probiotic) is nutritionally ideal."},
  "Curd rice with pickle":{time:"10 min",ingredients:["1½ cups cooked rice","½ cup thick curd","Mustard seeds, curry leaves, dry red chilli","Small piece of pickle"],steps:["Mix warm rice with curd until combined.","Temper mustard seeds, curry leaves, chilli in oil; pour over the curd rice.","Mix in cucumber or pomegranate for freshness.","Serve with a small piece of mango pickle."],tip:"Mash the curd rice slightly for a creamier texture — south Indian curd rice is smoother than just mixing."},
  "Lemon rice with papad & salad":{time:"15 min",ingredients:["1½ cups cooked rice (leftover works best)","1 lemon (juice)","1 tsp mustard seeds, chana dal, urad dal","Turmeric, green chilli, curry leaves","2 tbsp roasted peanuts"],steps:["Heat oil; add mustard seeds, chana dal, urad dal — let them splutter and crisp.","Add green chilli, curry leaves, turmeric.","Add rice and toss well.","Add lemon juice and peanuts; toss and season.","Serve with roasted papad and fresh salad."],tip:"Leftover rice works best for lemon rice — freshly cooked rice tends to break up."},
  "Moong dal khichdi with curd":{time:"20 min",ingredients:["½ cup rice","¼ cup moong dal (split yellow)","1 tsp cumin seeds","½ tsp turmeric","1 tsp ghee","Salt"],steps:["Wash rice and dal together.","Heat ghee in pressure cooker; add cumin.","Add rice, dal, turmeric, salt and 2 cups water.","Pressure cook 2 whistles; open after steam releases.","Serve soft khichdi with cold curd."],tip:"Moong dal khichdi is perfect sick-day or recovery food — light, easy to digest and complete nutrition."},
  "Dal with 2 roti & salad":{time:"25 min",steps:["Pressure cook 1 cup masoor or toor dal (2 whistles).","Make a simple tadka with cumin, onion, tomato and spices.","Mix tadka into dal; simmer 5 min.","Make or heat 2 rotis.","Serve with a fresh salad."],tip:"A squeeze of lemon over the dal at the end brightens all the flavours."},
  "Veg pulao with raita":{time:"25 min",ingredients:["1 cup basmati rice","1 cup mixed vegetables","1 tsp ghee","Whole spices (bay leaf, cardamom, cloves, cumin)"],steps:["Soak rice 20 min; drain.","Heat ghee; fry whole spices. Add onion; cook golden.","Add vegetables and rice; coat in ghee.","Add 1¾ cups water, salt; bring to boil. Cover and cook on lowest heat 15 min.","Fluff rice. Make raita. Serve together."],tip:"Never stir rice while it's cooking — lifting the lid and stirring breaks the grains and makes it sticky."},
  "Grilled chicken with sautéed veg":{time:"20 min",ingredients:["150g chicken breast or thigh","1½ cups mixed vegetables (capsicum, zucchini, broccoli, onion)","Olive oil, garlic, herbs","Salt, pepper, lemon juice"],steps:["Marinate chicken with oil, garlic, herbs, salt and pepper for at least 15 min.","Heat a grill pan on high; cook chicken 4–5 min per side.","Rest 3 min before slicing.","In the same pan, sauté veggies with garlic, salt and pepper 5 min.","Serve chicken over veggies with a squeeze of lemon."],tip:"Resting the chicken 3 min after cooking keeps the juices in."},
  "Grilled fish with salad":{time:"15 min",steps:["Pat fish dry; season with salt, pepper, garlic, lemon.","Heat a non-stick pan on high with ½ tsp oil.","Cook fish 3–4 min per side until it flakes easily.","Toss salad with lemon, olive oil, salt.","Serve fish immediately with salad."],tip:"Dry the fish completely before seasoning — moisture is the enemy of a good sear."},
  "Paneer tikka with salad":{time:"20 min",ingredients:["100g paneer, cubed","½ cup thick curd","Tikka masala, red chilli, cumin, turmeric","Capsicum and onion to skewer"],steps:["Marinate paneer cubes in spiced curd for at least 15 min.","Thread onto skewers with capsicum and onion.","Grill on a high pan — 3–4 min per side.","Char edges for authentic flavour.","Serve with mint chutney and salad."],tip:"Don't skip the marinade resting time — the acid in the curd tenderises the paneer."},
  "Tofu stir-fry with rice":{time:"20 min",ingredients:["120g firm tofu, drained and cubed","1 cup cooked rice","2 cups mixed vegetables","2 tbsp soy sauce","1 tsp sesame oil","Ginger, garlic, spring onion"],steps:["Press tofu dry with a cloth; cube it.","Heat oil on very high heat; fry tofu cubes until golden on all sides (5 min). Remove.","Stir-fry vegetables with ginger and garlic 2 min.","Return tofu; add soy sauce and sesame oil.","Serve over rice with spring onion garnish."],tip:"The secret to crispy tofu is a very hot pan and dry tofu — moisture creates steaming instead of searing."},
  "Fish curry with rice":{time:"35 min",steps:["Marinate fish with turmeric and salt for 10 min.","Make a masala base: onion, ginger-garlic, tomato, spices.","Add coconut milk (or water); simmer 5 min.","Slide in fish; cook 8–10 min until fish flakes easily.","Serve over steamed rice."],tip:"Don't overcook fish — it's done when it flakes with a fork. Overcooked fish is dry and tough."},
  "Egg curry with rice":{time:"25 min",steps:["Halve or score 2 hard boiled eggs; lightly fry in oil for 2 min.","Make a thick onion-tomato masala base.","Add eggs to masala with ¼ cup water; simmer 5 min.","Season and garnish with coriander.","Serve with rice."],tip:"Fry the boiled eggs briefly before adding to curry — this gives them a slightly chewy skin that holds the gravy."},
  "Grilled paneer & quinoa bowl":{time:"20 min",steps:["Cook quinoa: 1 cup quinoa + 2 cups water; simmer 15 min covered.","Grill paneer cubes in a hot pan 2 min per side.","Roast or sauté veggies with oil and garlic.","Layer quinoa, veggies and paneer in a bowl.","Drizzle with lemon and olive oil dressing."],tip:"Rinse quinoa before cooking to remove saponins — the natural coating that makes it bitter."},
  "Soya chunk curry with rice":{time:"30 min",steps:["Boil soya chunks 5 min; squeeze out water and set aside.","Make a thick onion-tomato masala base.","Add soya chunks, masala, ½ cup water; simmer 10 min.","Serve over cooked rice with fresh coriander."],tip:"Squeezing the water out after boiling removes the raw soya taste and helps chunks absorb curry flavour."},
  "Vegetable soup with 2 multigrain toast":{time:"20 min",steps:["Sauté garlic and onion in olive oil.","Add all vegetables; cook 3 min.","Add water/stock; bring to boil and simmer 10 min.","Blend half the soup for a creamy texture, or leave chunky.","Season and serve with toasted multigrain bread."],tip:"A pressure cooker reduces cooking time to 5 minutes — same flavour, much faster."},
  "Turmeric milk":{time:"5 min",ingredients:["250ml milk","½ tsp turmeric powder","A small pinch of black pepper","1 tsp honey or jaggery (optional)","Pinch of cardamom"],steps:["Heat milk in a small saucepan until it just starts to steam.","Whisk in turmeric, black pepper and cardamom.","Sweeten if desired.","Pour and drink warm — it's most effective taken warm, 30 min before bed."],tip:"The black pepper is essential — piperine increases curcumin absorption by up to 2000%."},
  "Warm milk":{time:"3 min",steps:["Heat milk in a saucepan or microwave until warm (not boiling).","Pour into a mug.","Drink slowly, sitting quietly — this is a winding-down ritual."],tip:"The tryptophan in milk converts to serotonin and melatonin — drink it 30 min before your target sleep time."},
  "Chamomile tea":{time:"3 min",steps:["Steep chamomile tea bag or dried flowers for 3–5 minutes.","Remove tea bag; optionally add a small drizzle of honey.","Drink warm, 30–60 min before bed."],tip:"Chamomile contains apigenin, a compound that binds to GABA receptors in the brain to promote sleepiness."},
};

/* ─────────────── workout engine ─────────────── */
type ExDef = { n: string; note?: string; hold?: boolean };
/* Exercise pools by environment, grouped by movement pattern. */
const EX: Record<string, Record<string, ExDef[]>> = {
  home: {
    push: [{n:"Push-ups"},{n:"Incline push-ups",note:"hands on a sofa"},{n:"Pike push-ups",note:"shoulders"},{n:"Bench dips",note:"on a chair"},{n:"Diamond push-ups",note:"triceps"}],
    pull: [{n:"Towel door rows",note:"loop a towel around a door handle"},{n:"Superman hold",hold:true},{n:"Reverse snow angels"},{n:"Prone Y-T-W raises"}],
    legs: [{n:"Bodyweight squats"},{n:"Reverse lunges",note:"each leg"},{n:"Glute bridges"},{n:"Wall sit",hold:true},{n:"Calf raises"},{n:"Bulgarian split squat",note:"each leg"}],
    core: [{n:"Plank",hold:true},{n:"Bicycle crunches"},{n:"Mountain climbers"},{n:"Leg raises"},{n:"Side plank",hold:true,note:"each side"},{n:"Dead bug"}],
    cardio:[{n:"Jumping jacks"},{n:"High knees"},{n:"Burpees"},{n:"Skater hops"}],
  },
  dumbbell: {
    push: [{n:"DB floor / bench press"},{n:"DB shoulder press"},{n:"DB lateral raise"},{n:"Push-ups"},{n:"DB overhead triceps extension"}],
    pull: [{n:"DB bent-over row"},{n:"DB reverse fly"},{n:"DB bicep curl"},{n:"DB shrug"},{n:"Single-arm DB row",note:"each side"}],
    legs: [{n:"DB goblet squat"},{n:"DB Romanian deadlift"},{n:"DB walking lunge",note:"each leg"},{n:"DB calf raise"},{n:"DB step-ups",note:"each leg"}],
    core: [{n:"Plank",hold:true},{n:"DB Russian twist"},{n:"Leg raises"},{n:"Dead bug"},{n:"Side plank",hold:true,note:"each side"}],
    cardio:[{n:"DB thrusters"},{n:"Burpees"},{n:"Mountain climbers"}],
  },
  gym: {
    push: [{n:"Barbell bench press"},{n:"Incline DB press"},{n:"Seated shoulder press"},{n:"Cable fly"},{n:"Triceps pushdown"}],
    pull: [{n:"Lat pulldown"},{n:"Seated cable row"},{n:"Barbell / machine row"},{n:"Face pulls"},{n:"Barbell / DB curl"}],
    legs: [{n:"Barbell squat"},{n:"Leg press"},{n:"Romanian deadlift"},{n:"Leg curl"},{n:"Leg extension"},{n:"Standing calf raise"}],
    core: [{n:"Hanging leg raise"},{n:"Cable crunch"},{n:"Plank",hold:true},{n:"Cable woodchopper",note:"each side"}],
    cardio:[{n:"Treadmill incline walk",note:"12 min"},{n:"Rowing machine",note:"10 min"},{n:"Cycling intervals",note:"12 min"}],
  },
  outdoor: {
    cardio:[{n:"Brisk walk / jog",note:"25–30 min"},{n:"Run intervals",note:"1 min hard / 2 min easy ×6"},{n:"Stair climbs",note:"10 min"},{n:"Skipping rope"},{n:"Cycling",note:"20 min"}],
    legs: [{n:"Bodyweight squats"},{n:"Walking lunges",note:"each leg"},{n:"Bench step-ups",note:"each leg"},{n:"Glute bridges"}],
    core: [{n:"Plank",hold:true},{n:"Mountain climbers"},{n:"Bicycle crunches"}],
    push: [{n:"Push-ups"},{n:"Bench dips"}],
    pull: [{n:"Park bar rows",note:"if a bar is available"},{n:"Superman hold",hold:true}],
  },
};
const PLACE_KEY: Record<string,string> = {
  "Home — no equipment":"home","Home — dumbbells / bands":"dumbbell",
  "Full gym":"gym","Outdoor / cardio":"outdoor",
};
/* Infer workout location from exercise type when workoutPlace not asked */
const EXERCISE_TO_PLACE: Record<string,string> = {
  "Running / jogging":  "Outdoor / cardio",
  "Cycling":            "Outdoor / cardio",
  "Swimming":           "Outdoor / cardio",
  "Yoga / Pilates":     "Home — no equipment",
  "Home workouts":      "Home — no equipment",
  "Gym (weights)":      "Full gym",
  "Sports / games":     "Outdoor / cardio",
  "HIIT / CrossFit":    "Home — dumbbells / bands",
};
/* Infer training focus from diet goal when workoutFocus not asked */
const GOAL_TO_FOCUS: Record<string,string> = {
  "Weight loss":    "Burn fat",
  "Muscle gain":    "Build muscle",
  "Maintain weight":"Stay fit & mobile",
  "General fitness":"Stay fit & mobile",
};
const REP: Record<string,{sets:number;reps:string}> = {
  "Build muscle":{sets:4,reps:"8–12"},
  "Get stronger":{sets:5,reps:"4–6"},
  "Burn fat":{sets:3,reps:"12–15"},
  "Stay fit & mobile":{sets:3,reps:"10–15"},
};
/* which weekdays (Mon=0 … Sun=6) host a session for a given days/week */
const WSCHED: Record<number,number[]> = {
  2:[0,3], 3:[0,2,4], 4:[0,1,3,4], 5:[0,1,2,4,5], 6:[0,1,2,3,4,5],
};

function buildWorkout(p: Profile): WorkoutPlan | null {
  if (!p.wantWorkout || !p.wantWorkout.startsWith("Yes")) return null;
  const inferredPlace = EXERCISE_TO_PLACE[p.exercise||""] || "Home — no equipment";
  const placeKey = PLACE_KEY[p.workoutPlace || inferredPlace] || "home";
  const pool = EX[placeKey];
  const focus = p.workoutFocus || GOAL_TO_FOCUS[p.goal||""] || "Stay fit & mobile";
  const rep = REP[focus] || REP["Stay fit & mobile"];
  const days = parseInt(p.workoutDays||"3") || 3;
  const muscle = focus==="Build muscle" || focus==="Get stronger";
  const burn = focus==="Burn fat";
  const cardioPlace = placeKey==="outdoor";

  type Slot = { cat: string; n: number };
  const FB=(label:string):{label:string;focus:string;cats:Slot[]}=>(
    {label,focus:"Full body",cats:[{cat:"legs",n:1},{cat:"push",n:1},{cat:"pull",n:1},{cat:"core",n:1}]});
  const push={label:"Push",focus:"Chest · shoulders · triceps",cats:[{cat:"push",n:3},{cat:"core",n:1}]};
  const pull={label:"Pull",focus:"Back · biceps",cats:[{cat:"pull",n:3},{cat:"core",n:1}]};
  const legs={label:"Legs",focus:"Quads · hamstrings · glutes",cats:[{cat:"legs",n:3},{cat:"core",n:1}]};
  const upper={label:"Upper Body",focus:"Chest · back · arms",cats:[{cat:"push",n:2},{cat:"pull",n:2},{cat:"core",n:1}]};
  const lower={label:"Lower Body",focus:"Legs · core",cats:[{cat:"legs",n:3},{cat:"core",n:1}]};

  let templates:{label:string;focus:string;cats:Slot[]}[];
  if (cardioPlace) {
    templates = Array.from({length:Math.min(days,6)},(_,i)=>(
      {label:`Session ${i+1}`,focus:"Cardio + circuit",
       cats:[{cat:"cardio",n:1},{cat:"legs",n:1},{cat:"core",n:1},{cat:"push",n:1}]}));
  } else if (days<=2) templates=[FB("Full Body A"),FB("Full Body B")];
  else if (days===3) templates=muscle?[push,pull,legs]:[FB("Full Body A"),FB("Full Body B"),FB("Full Body C")];
  else if (days===4) templates=[upper,lower,upper,lower];
  else if (days===5) templates=[push,pull,legs,upper,lower];
  else templates=[push,pull,legs,push,pull,legs];

  const mkItem=(e:ExDef,cat:string):WorkoutItem=>{
    const each = !!e.note && e.note.includes("each");
    const tip = e.note && !each ? e.note : undefined;       // keep only real tips as note
    if (cat==="cardio") return {name:e.n,sets:1,reps:e.note||"10–12 min"};
    if (e.hold) return {name:e.n,sets:rep.sets,reps:`30–45 sec${each?" each side":""}`,note:tip};
    return {name:e.n,sets:rep.sets,reps:`${rep.reps}${each?" each side":""}`,note:tip};
  };

  const dayObjs:WorkoutDay[]=templates.map((tpl,di)=>{
    const items:WorkoutItem[]=[];
    tpl.cats.forEach(slot=>{
      const list=pool[slot.cat]||[];
      for (let i=0;i<slot.n && i<list.length;i++){
        const e=list[(di*2+i)%list.length];
        if (!items.some(x=>x.name===e.n)) items.push(mkItem(e,slot.cat));
      }
    });
    if (burn && pool.cardio?.length){
      const c=pool.cardio[di%pool.cardio.length];
      items.push({name:`Finisher: ${c.n}`,sets:1,reps:c.note||"6–8 min"});
    }
    return {label:`Day ${di+1} — ${tpl.label}`,focus:tpl.focus,items};
  });

  /* map to weekdays */
  const wdays=WSCHED[Math.min(Math.max(days,2),6)]||WSCHED[3];
  const schedule:(number|null)[]=Array(7).fill(null);
  wdays.forEach((wd,order)=>{ schedule[wd]=order%dayObjs.length; });

  const restNote=days>=6?"One full rest day keeps recovery on track.":"Rest days are when muscle actually rebuilds — don't skip them.";
  const intensity=focus==="Get stronger"?"Rest 2–3 min between heavy sets."
    :burn?"Keep rest short (30–45 sec) to keep the heart rate up."
    :"Rest 60–90 sec between sets.";
  const notes=[
    "Warm up 5 min (light cardio + dynamic stretches) before every session.",
    intensity,
    "Add a little weight or 1–2 reps whenever a set feels easy — progressive overload drives results.",
    restNote,
    "Form first, ego last. Stop if you feel sharp pain.",
  ];

  const placeLabel = p.workoutPlace || inferredPlace;
  return {place:placeLabel,focus,daysPerWeek:days,schedule,days:dayObjs,notes};
}

/* Weekend calorie boost/cut based on what the user actually does on weekends */
function weekendMod(dayName: string, weekendPrefs: string[]): number {
  if (dayName !== "Sat" && dayName !== "Sun") return 0;
  if (!weekendPrefs.length) return 0;
  let mod = 0;
  if (weekendPrefs.includes("Run club / group fitness"))   mod += 200;
  if (weekendPrefs.includes("Coffee rave / morning run"))  mod += 100;
  if (weekendPrefs.includes("Hiking / outdoor sports"))    mod += 250;
  if (weekendPrefs.includes("Social eating out"))          mod += 150;
  if (weekendPrefs.includes("Travel / exploring"))         mod += 100;
  if (weekendPrefs.includes("Rest & recovery"))            mod -= 100;
  return Math.min(450, Math.max(-200, mod));
}

function buildPlan(profile: Profile): Plan {
  const st=calcStats(profile);
  const cal=st.tdee;
  const maintenance=st.maintenanceTdee;
  const cond=profile.condition||"None";
  const weekendPrefs=(profile.weekend as string[]|undefined)||[];
  const ctx: MealCtx={
    goal:st.effectiveGoal,
    cond,
    diet:profile.diet||"Pure veg",
    regions:mapRegions(profile.region),
    simplePref:false,
    picks:profile.foodPicks||[],
  };
  const autoSlotKey = cal>2500?"5-6 small meals":cal>1900?"3 meals + 2 snacks":(profile.meals||"3 meals");
  const slots=SLOTSET[autoSlotKey]||SLOTSET["3 meals"];
  const weekUsed=new Set<string>();
  const days: PlanDay[]=(WEEK as readonly string[]).map((dn,di)=>{
    const dayCal = cal + weekendMod(dn as string, weekendPrefs);
    let raw=slots.map(([code,frac,label])=>{
      const slotCap=SLOT_CAL_CAP[code]||700;
      const targetCal=Math.min(Math.round(dayCal*frac),slotCap);
      const m=pickMeal(code,targetCal,di,weekUsed,ctx);
      weekUsed.add(m.n);
      return {time:label,food:m.n,cal:m.c,p:m.p||0,qty:m.q};
    });
    const total=raw.reduce((a,b)=>a+b.cal,0);
    let f=total?dayCal/total:1; f=Math.max(0.85,Math.min(1.25,f));
    raw=raw.map(m=>({...m,cal:Math.round((m.cal*f)/5)*5}));
    if (di%7===6) weekUsed.clear();
    return {day:dn as DayName,meals:raw};
  });

  const regionArr=profile.region||[];
  const _regMapped=new Set((regionArr as string[]).map((x:string)=>RMAP[x]).filter(Boolean));
  const _allCovered=["n","s","e","w"].every(r=>_regMapped.has(r)||_regMapped.has("all"));
  const regLabel=(!regionArr.length||_allCovered)?"pan-Indian":regionArr.length<=2?(regionArr as string[]).join(" & "):`${(regionArr as string[])[0]} & ${regionArr.length-1} more cuisines`;

  const timeline=profile.timeline||"6 months (recommended)";
  const weeklyLoss=st.direction&&st.weeklyKg!=="0.00"
    ?`~${st.weeklyKg} kg / week ${st.direction}`:"";

  const w=+(profile.weight||70);
  const proteinMultiplier: Record<string,number>={
    "Weight loss":1.8,"Muscle gain":2.2,"Maintain weight":1.4,"General fitness":1.4,
    "Breastfeeding":1.4,"Pregnant":1.4,
  };
  // Add extra 25g for breastfeeding/pregnancy as per ICMR guidelines
  const proteinExtra=["Breastfeeding","Pregnant"].includes(cond)?25:0;
  const proteinBase=(proteinMultiplier[st.effectiveGoal]??1.4)*w;
  const proteinTarget=Math.round((proteinBase+proteinExtra)/5)*5;

  /* ── Summary string construction ── */
  const goalLabel = st.effectiveGoal !== profile.goal && profile.goal
    ? `${st.effectiveGoal.toLowerCase()} (adjusted from your ${(profile.goal||"").toLowerCase()} goal based on your weight targets)`
    : (st.effectiveGoal || "fitness").toLowerCase();

  const condNote = cond !== "None" && cond !== "Other"
    ? ` It's tuned to support your ${COND_SHORT[cond]||cond} — still, please review it with your doctor.`
    : cond === "Other" ? " Since you flagged a condition, please clear this plan with your doctor first." : "";

  const bfNote = cond === "Breastfeeding" && st.effectiveGoal === "Weight loss"
    ? " Calorie target includes a safe breastfeeding deficit — milk supply is protected."
    : "";
  const pregnantNote = cond === "Pregnant" && profile.goal === "Weight loss"
    ? " Weight loss during pregnancy isn't recommended — this is a healthy maintenance plan instead."
    : "";

  const deficitAmt = maintenance - cal;
  const deficitNote = deficitAmt > 50
    ? ` Your body burns ~${maintenance} kcal/day — eating ${cal} kcal creates a ${deficitAmt} kcal daily deficit.`
    : deficitAmt < -50
    ? ` Your body burns ~${maintenance} kcal/day — eating ${cal} kcal adds ${Math.abs(deficitAmt)} kcal above maintenance for muscle growth.`
    : "";

  return {
    summary:`Here's a ${goalLabel} plan at about ${cal} kcal a day, built around ${regLabel} food you actually like.${deficitNote}${condNote}${bfNote}${pregnantNote}`,
    dailyCalories:cal,maintenanceCalories:maintenance,proteinTarget,bmi:st.bmi,bmiCat:st.bmiCat,
    goal:st.effectiveGoal,diet:profile.diet||"Pure veg",
    condition:cond,regLabel,timeline,weeklyLoss,
    tips:makeTips(profile,cal),days,workout:buildWorkout(profile),
  };
}

/* ─────────────── date / streak / analytics helpers ─────────────── */
function isoDate(d=new Date()): string { return d.toISOString().slice(0,10); }
function isoShift(days: number): string {
  const d=new Date(); d.setDate(d.getDate()+days); return isoDate(d);
}
function weekdayOf(iso: string): DayName {
  const d=new Date(iso+"T00:00:00");
  return WEEK[(d.getDay()+6)%7];
}
/* A day counts as "on track" if at least 60% of planned meals were eaten,
   or the diary shows real effort (something logged). Forgiving by design. */
function dayOnTrack(meals: number, total: number, diaryCal: number): boolean {
  if (total>0 && meals/total>=0.6) return true;
  if (diaryCal>0 && meals>=Math.max(1,Math.floor(total*0.4))) return true;
  return false;
}
/* Current streak ending today (or yesterday), allowing ONE grace miss so a
   single bad day doesn't wipe out weeks of effort. */
function currentStreak(history: Record<string,HistEntry>): number {
  let streak=0, graceUsed=false;
  for (let i=0;i<400;i++) {
    const iso=isoShift(-i);
    const e=history[iso];
    const ok=e?.onTrack;
    if (ok) { streak++; continue; }
    if (i===0) continue;               // today still in progress — don't break yet
    if (!graceUsed) { graceUsed=true; continue; }  // forgive one miss
    break;
  }
  return streak;
}
function bestStreak(history: Record<string,HistEntry>): number {
  const dates=Object.keys(history).filter(d=>history[d]?.onTrack).sort();
  let best=0, run=0, prev="";
  for (const d of dates) {
    if (prev && new Date(d).getTime()-new Date(prev).getTime()<=86400000*2) run++;
    else run=1;
    best=Math.max(best,run); prev=d;
  }
  return best;
}
/* Points: 10 per on-track day + streak bonus. Drives the community board. */
function totalPoints(history: Record<string,HistEntry>): number {
  const onTrackDays=Object.values(history).filter(e=>e.onTrack).length;
  return onTrackDays*10 + currentStreak(history)*5;
}

/* ─────────────── i18n (English + Hindi) ─────────────── */
type Lang = "en" | "hi";
const STR: Record<string,{en:string;hi:string}> = {
  newWarrior:{en:"I'm a New Warrior",hi:"मैं नया योद्धा हूँ"},
  alreadyHustle:{en:"I Already Hustle",hi:"मैं पहले से जुटा हूँ"},
  tagline:{en:"Your Indian diet plan, ready in 3 minutes.",hi:"3 मिनट में आपका भारतीय डाइट प्लान।"},
  todaysSpark:{en:"Today's spark",hi:"आज की प्रेरणा"},
  notMedical:{en:"Not medical advice — consult your doctor for any condition.",hi:"यह चिकित्सकीय सलाह नहीं है — किसी भी स्थिति के लिए डॉक्टर से सलाह लें।"},
  skip:{en:"Skip",hi:"छोड़ें"},
  back:{en:"Back",hi:"पीछे"},
  next:{en:"Next",hi:"आगे"},
  buildPlan:{en:"Build my plan",hi:"मेरी योजना बनाएँ"},
  building:{en:"Building…",hi:"बन रही है…"},
  question:{en:"Question",hi:"प्रश्न"},
  of:{en:"of",hi:"में से"},
  logout:{en:"Logout",hi:"लॉग आउट"},
  perfectDays:{en:"day streak",hi:"दिन की लय"},
  todaysMeals:{en:"today's meals",hi:"आज के भोजन"},
  protein:{en:"protein",hi:"प्रोटीन"},
  proteinTarget:{en:"Protein target",hi:"प्रोटीन लक्ष्य"},
  tickOff:{en:"tick off as you eat",hi:"जैसे-जैसे खाएँ, टिक करें"},
  foodDiary:{en:"Food Diary",hi:"भोजन डायरी"},
  addFood:{en:"+ Add food eaten",hi:"+ खाया हुआ भोजन जोड़ें"},
  water:{en:"Water",hi:"पानी"},
  weightLog:{en:"Weight log",hi:"वज़न रिकॉर्ड"},
  trends:{en:"Weekly trends",hi:"साप्ताहिक रुझान"},
  insights:{en:"Your insights",hi:"आपकी जानकारी"},
  community:{en:"Community",hi:"समुदाय"},
  leaderboard:{en:"Leaderboard",hi:"लीडरबोर्ड"},
  challenges:{en:"Challenges",hi:"चुनौतियाँ"},
  swap:{en:"Swap",hi:"बदलें"},
  coachTips:{en:"Coach's tips",hi:"कोच के सुझाव"},
  nudgeLog:{en:"You haven't logged anything today — tap any meal to tick it off.",hi:"आज आपने कुछ लॉग नहीं किया — किसी भी भोजन को टिक करें।"},
  streakRisk:{en:"Log a meal before midnight to keep your streak!",hi:"अपनी लय बनाए रखने के लिए आधी रात से पहले भोजन दर्ज करें!"},
  weeklyReview:{en:"Your week in review",hi:"आपका साप्ताहिक सारांश"},
  retiredFood:{en:"Meal retired — it won't appear in future swaps.",hi:"भोजन हटाया गया — यह भविष्य में नहीं आएगा।"},
  deleteAccount:{en:"Delete my account",hi:"मेरा खाता मिटाएँ"},
  deleteConfirm:{en:"Are you sure? This permanently deletes your plan, tracking data, and account.",hi:"क्या आप सुनिश्चित हैं? इससे आपका प्लान, ट्रैकिंग डेटा और खाता स्थायी रूप से मिट जाएगा।"},
  deleteYes:{en:"Yes, delete everything",hi:"हाँ, सब मिटाएँ"},
  deleteCancel:{en:"Cancel",hi:"रद्द करें"},
  recalcBanner:{en:"Your weight has changed — tap to update your calorie target.",hi:"आपका वज़न बदल गया — कैलोरी लक्ष्य अपडेट करें।"},
  plateauBanner:{en:"Weight plateau detected — let's adjust your plan.",hi:"वज़न रुक गया है — अपनी योजना समायोजित करें।"},
  recalcBtn:{en:"Update my plan",hi:"मेरी योजना अपडेट करें"},
  recalcDone:{en:"Plan updated for your new weight!",hi:"नए वज़न के लिए योजना अपडेट हुई!"},
  eatingWindow:{en:"Eating window",hi:"खाने की खिड़की"},
  weekUnlocked:{en:"New level unlocked!",hi:"नया स्तर खुल गया!"},
  photoScan:{en:"Scan food",hi:"खाना स्कैन करें"},
  photoAnalyzing:{en:"Analysing…",hi:"विश्लेषण हो रहा है…"},
  dietitianCTA:{en:"Get a free dietician review of your plan",hi:"अपने प्लान की मुफ्त डाइटिशियन समीक्षा पाएँ"},
  dietitianBook:{en:"Book free 15-min call",hi:"15 मिनट की मुफ्त कॉल बुक करें"},
};
function makeT(lang: Lang){ return (k: keyof typeof STR)=> STR[k]?.[lang] ?? STR[k]?.en ?? String(k); }

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
  const [recipeFor,setRecipeFor]=useState<string|null>(null);
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
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <p className="text-gray-800 font-semibold leading-snug flex-1">{m.food}</p>
                  {RECIPE_DB[m.food]&&(
                    <button onClick={()=>setRecipeFor(m.food)} title="View recipe"
                      className="text-gray-300 hover:text-green-600 transition shrink-0 ml-1"><ChefHat size={14}/></button>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Scale size={11} className="text-gray-400 shrink-0"/>
                  <span className="text-xs text-gray-400">{m.qty}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {recipeFor&&<RecipeSheet name={recipeFor} onClose={()=>setRecipeFor(null)}/>}
    </Card>
  );
}

/* ─────────────── WeightLog ─────────────── */
function WeightLog({t,onLog}:{t:Tracking;onLog:(w:number)=>void}) {
  const [w,setW]=useState("");
  const [wErr,setWErr]=useState("");
  const entries=Object.entries(t.weights||{}).sort() as [string,number][];
  const latest=entries.length?entries[entries.length-1][1]:null;
  const first=entries.length?entries[0][1]:null;
  const diff=latest!=null&&first!=null?(latest-first).toFixed(1):null;

  function validateAndLog() {
    setWErr("");
    const n = +w;
    if (!w.trim() || isNaN(n)) { setWErr("Please enter a number in kg (e.g. 68)."); return; }
    if (n <= 0)   { setWErr("Weight must be a positive number."); return; }
    if (n < 25)   {
      const lbs = Math.round(n * 2.205);
      setWErr(`${n} kg seems very low. If this is in pounds, ${lbs} lbs ≈ ${Math.round(n/0.453592)} kg. Enter in kg only.`);
      return;
    }
    if (n > 250)  { setWErr(`${n} kg is outside the supported range. Please confirm you're entering in kg, not pounds or grams.`); return; }
    if (entries.length) {
      const prev = entries[entries.length-1][1];
      if (Math.abs(n - prev) > 20) {
        setWErr(`That's a ${Math.abs(n-prev).toFixed(1)} kg change since your last entry (${prev} kg). Confirm this is correct and log again if so.`);
        return;
      }
    }
    onLog(n);
    setW("");
  }

  return (
    <Card className="p-5">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
        <TrendingDown size={18} style={{color:GREEN}}/> Weight log
      </h3>
      <div className="flex gap-2 mb-1">
        <input type="number" value={w}
          onChange={e=>{setW(e.target.value);setWErr("");}}
          onKeyDown={e=>e.key==="Enter"&&validateAndLog()}
          placeholder="Today's weight (kg)"
          className={`flex-1 px-4 py-3 rounded-2xl border-2 outline-none transition ${wErr?"border-red-400 focus:border-red-500":"border-gray-200 focus:border-green-500"}`}/>
        <button onClick={validateAndLog}
          className="px-6 rounded-2xl text-white font-semibold"
          style={{background:GREEN}}>Log</button>
      </div>
      {wErr&&(
        <div className="flex items-start gap-2 text-red-500 text-xs mt-2 mb-1">
          <AlertCircle size={13} className="mt-0.5 shrink-0"/><span>{wErr}</span>
        </div>
      )}
      {entries.length>0&&!wErr&&(
        <div className="text-sm text-gray-500 mt-2">
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

/* ─────────────── 3D parallax (pointer + gyroscope) ─────────────── */
function use3DParallax() {
  const [tilt,setTilt]=useState({x:0,y:0});
  useEffect(()=>{
    function onPointer(e:PointerEvent){
      const cx=window.innerWidth/2, cy=window.innerHeight/2;
      setTilt({x:(e.clientY-cy)/cy,y:(e.clientX-cx)/cx});
    }
    function onOrient(e:DeviceOrientationEvent){
      const g=e.gamma??0, b=e.beta??0;            // left-right / front-back
      setTilt({x:Math.max(-1,Math.min(1,b/45)),y:Math.max(-1,Math.min(1,g/45))});
    }
    window.addEventListener("pointermove",onPointer,{passive:true});
    window.addEventListener("deviceorientation",onOrient,{passive:true});
    return()=>{window.removeEventListener("pointermove",onPointer);window.removeEventListener("deviceorientation",onOrient);};
  },[]);
  return tilt;
}

/* ─────────────── Onboarding stories ─────────────── */
function OnbSlide1() {
  const [ct,setCt]=useState(0);
  useEffect(()=>{
    const iv=setInterval(()=>setCt(c=>c>=2000?2000:c+50),22);
    return()=>clearInterval(iv);
  },[]);
  return(
    <div className="flex flex-col items-center text-center">
      <div className="mb-4" style={{fontSize:72,animation:"onbPulse 2.5s ease-in-out infinite",filter:"drop-shadow(0 0 28px rgba(0,255,157,0.45))"}}>🧬</div>
      <div className="font-black leading-none mb-1 tabular-nums"
        style={{fontSize:86,color:"#00FF9D",textShadow:"0 0 48px rgba(0,255,157,0.4)",letterSpacing:"-3px"}}>{ct.toLocaleString()}+</div>
      <p className="font-black mb-4" style={{fontSize:20,color:"rgba(255,255,255,0.9)",letterSpacing:"-0.3px"}}>Nutrition Studies</p>
      <p style={{color:"rgba(255,255,255,0.48)",fontSize:14,maxWidth:250,lineHeight:1.7}}>
        Real science behind every meal. Peer-reviewed nutrition research — not influencer guesswork.
      </p>
    </div>
  );
}
function OnbSlide2() {
  return(
    <div className="flex flex-col items-center text-center">
      <div className="mb-5" style={{fontSize:72,animation:"onbPulse 2.5s ease-in-out infinite",filter:"drop-shadow(0 0 28px rgba(96,165,250,0.5))"}}>🔐</div>
      <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 mb-5"
        style={{background:"rgba(96,165,250,0.14)",border:"1px solid rgba(96,165,250,0.28)"}}>
        <span style={{color:"#60A5FA",fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>Military-Grade Security</span>
      </div>
      <h2 className="font-black text-white mb-4" style={{fontSize:62,lineHeight:0.92,letterSpacing:"-2.5px"}}>AES‑256<br/>Encrypted</h2>
      <p style={{color:"rgba(255,255,255,0.48)",fontSize:14,maxWidth:250,lineHeight:1.7}}>
        Your health data encrypted at rest. Not even we can read it in plain text.
      </p>
    </div>
  );
}
function OnbSlide3() {
  return(
    <div className="flex flex-col items-center text-center">
      <div className="mb-5" style={{fontSize:72,animation:"onbPulse 2.5s ease-in-out infinite",filter:"drop-shadow(0 0 28px rgba(192,132,252,0.5))"}}>✊</div>
      <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 mb-5"
        style={{background:"rgba(192,132,252,0.14)",border:"1px solid rgba(192,132,252,0.28)"}}>
        <span style={{color:"#C084FC",fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>Community First</span>
      </div>
      <h2 className="font-black text-white mb-4" style={{fontSize:72,lineHeight:0.92,letterSpacing:"-2.5px"}}>Free.<br/>Always.</h2>
      <p style={{color:"rgba(255,255,255,0.48)",fontSize:14,maxWidth:250,lineHeight:1.7}}>
        No paywalls. No premium tiers. No bullsh*t. Built for the community.
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
        <p className="font-bold text-lg mt-2" style={{color:"#86efac"}}>Eat Better. Count.</p>
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
    setAnim(0);
    if(slide!==3) return;
    const t1=setTimeout(()=>setAnim(1),700);
    const t2=setTimeout(()=>setAnim(2),1900);
    const t3=setTimeout(()=>setAnim(3),2900);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[slide]);

  function goNext(){
    if(ivRef.current) clearInterval(ivRef.current);
    if(slide<3) setSlide(slide+1); else onDone();
  }

  const BKGS=[
    "linear-gradient(155deg,#050f08 0%,#071a0e 45%,#0a2415 100%)",
    "linear-gradient(155deg,#050810 0%,#080f28 45%,#0c1840 100%)",
    "linear-gradient(155deg,#0a0514 0%,#160a2e 45%,#23104a 100%)",
    "linear-gradient(155deg,#030a05 0%,#050f08 45%,#071408 100%)",
  ];

  const ACCENT=["#00FF9D","#60A5FA","#C084FC","#34D399"];
  const tilt=use3DParallax();
  /* depth: how far a layer reacts to tilt (px of translate) */
  const layer=(depth:number)=>({
    transform:`translate3d(${tilt.y*depth}px,${tilt.x*depth}px,0)`,
    transition:"transform 0.18s ease-out",
  });

  return(
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{background:BKGS[slide],transition:"background 0.6s ease",perspective:"1100px"}}
      onClick={goNext}>

      {/* ── Depth layer 1: deep glowing orbs (move most) ── */}
      <div className="absolute inset-0 pointer-events-none" style={{transformStyle:"preserve-3d"}}>
        <div className="absolute rounded-full" style={{
          width:300,height:300,top:"12%",left:"-12%",
          background:`radial-gradient(circle,${ACCENT[slide]}55,transparent 70%)`,
          filter:"blur(30px)",...layer(46),
        }}/>
        <div className="absolute rounded-full" style={{
          width:240,height:240,bottom:"14%",right:"-10%",
          background:`radial-gradient(circle,${ACCENT[slide]}40,transparent 70%)`,
          filter:"blur(34px)",...layer(60),
        }}/>
        <div className="absolute rounded-full" style={{
          width:140,height:140,top:"48%",right:"22%",
          background:`radial-gradient(circle,${ACCENT[slide]}30,transparent 70%)`,
          filter:"blur(22px)",...layer(80),
        }}/>
      </div>

      {/* ── Depth layer 2: fine grid for 3D floor feel ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`linear-gradient(${ACCENT[slide]}14 1px,transparent 1px),linear-gradient(90deg,${ACCENT[slide]}14 1px,transparent 1px)`,
        backgroundSize:"44px 44px",maskImage:"radial-gradient(circle at 50% 40%,black,transparent 75%)",
        WebkitMaskImage:"radial-gradient(circle at 50% 40%,black,transparent 75%)",...layer(20),
      }}/>

      {/* Story progress bars */}
      <div className="absolute left-0 right-0 flex gap-1.5 px-4 z-20" style={{top:52}}>
        {[0,1,2,3].map(i=>(
          <div key={i} className="flex-1 rounded-full overflow-hidden" style={{height:3,background:"rgba(255,255,255,0.18)"}}>
            <div className="h-full rounded-full" style={{width:i<slide?"100%":i===slide?`${prog}%`:"0%",background:ACCENT[slide],boxShadow:`0 0 8px ${ACCENT[slide]}`,transition:"width 0.1s linear"}}/>
          </div>
        ))}
      </div>
      {/* Skip */}
      <button onClick={e=>{e.stopPropagation();onDone();}}
        className="absolute right-4 z-20 font-bold text-sm px-4 py-1.5 rounded-full"
        style={{top:40,background:"rgba(255,255,255,0.10)",border:"1px solid rgba(255,255,255,0.18)",backdropFilter:"blur(8px)",color:"rgba(255,255,255,0.82)"}}>
        Skip
      </button>

      {/* ── Depth layer 3: foreground glass card with the slide content ── */}
      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-6 relative z-10" style={{transformStyle:"preserve-3d"}}>
        <div key={slide} style={{
          ...layer(-26),
          transformStyle:"preserve-3d",
          animation:"onbCard 0.6s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <div className="relative rounded-[34px] px-8 py-12 flex items-center justify-center" style={{
            minWidth:300,minHeight:420,
            background:"linear-gradient(160deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))",
            border:"1px solid rgba(255,255,255,0.16)",
            boxShadow:`0 30px 80px -20px ${ACCENT[slide]}40, inset 0 1px 0 rgba(255,255,255,0.18)`,
            backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
            transform:`rotateX(${tilt.x*-5}deg) rotateY(${tilt.y*5}deg)`,
            transition:"transform 0.18s ease-out, box-shadow 0.6s ease",
          }}>
            {slide===0&&<OnbSlide1/>}
            {slide===1&&<OnbSlide2/>}
            {slide===2&&<OnbSlide3/>}
            {slide===3&&<OnbSlide4 anim={anim}/>}
          </div>
        </div>
      </div>

      {/* Tap hint + dot nav */}
      <div className="pb-9 flex flex-col items-center gap-3 relative z-10">
        <span className="text-[11px] tracking-widest uppercase font-semibold" style={{color:"rgba(255,255,255,0.4)"}}>Tap to continue</span>
        <div className="flex justify-center gap-2">
          {[0,1,2,3].map(i=>(
            <div key={i} className="rounded-full transition-all duration-300"
              style={{width:i===slide?24:7,height:7,
                background:i===slide?ACCENT[slide]:"rgba(255,255,255,0.26)",
                boxShadow:i===slide?`0 0 10px ${ACCENT[slide]}`:"none"}}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Welcome ─────────────── */
const FLOAT_FOODS = ["🥗","🫓","🥑","🍎","🥦","🍚","🥛","🫐","🍊","🥚","🌾","🥜","🍋","🥕","🫑"];
/* ─────────────── Quiz teaser (mid-quiz TDEE/BMI sneak peek) ─────────────── */
function QuizTeaser({profile}:{profile:Profile}) {
  const hasData = profile.weight && profile.age && profile.heightFt;
  if (!hasData) return null;
  const w = +(profile.weight||0);
  const cm = ((+(profile.heightFt||5))*12+(+(profile.heightIn||5)))*2.54;
  const bmi = cm>0 ? w/((cm/100)**2) : 0;
  const bmiCat = bmi<18.5?"Underweight":bmi<23?"Normal":bmi<27.5?"Overweight":"Obese";
  const bmr = (profile.sex!=="Male"
    ? 10*w+6.25*cm-5*(+(profile.age||25))-161
    : 10*w+6.25*cm-5*(+(profile.age||25))+5);
  const roughTdee = Math.round(bmr*1.4/50)*50;
  const bmiColor = bmi<18.5?"#60a5fa":bmi<23?"#4ade80":bmi<27.5?"#fbbf24":"#f87171";
  return (
    <div className="rounded-2xl px-4 py-3.5 mb-5 border"
      style={{background:"linear-gradient(135deg,#f0faf4,#e7f7ef)",borderColor:"#bbf7d0"}}>
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={14} style={{color:"#1DAA61"}}/>
        <span className="text-xs font-bold uppercase tracking-widest" style={{color:"#1DAA61"}}>Sneak peek</span>
      </div>
      <div className="flex gap-4">
        <div>
          <div className="text-xl font-black text-gray-800">{roughTdee} kcal</div>
          <div className="text-xs text-gray-400">est. maintenance (deficit applied at end)</div>
        </div>
        <div className="border-l border-green-200 pl-4">
          <div className="text-xl font-black" style={{color:bmiColor}}>{bmi.toFixed(1)}</div>
          <div className="text-xs text-gray-400">BMI · {bmiCat}</div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">Answer a few more questions to lock in your personalised plan.</p>
    </div>
  );
}

function FloatingFoods() {
  const items = useRef(FLOAT_FOODS.map((emoji,i)=>({
    emoji, left:`${6+i*6.2}%`, delay:`${i*0.7}s`, duration:`${8+i%4*1.5}s`, size: 20+i%3*4,
  }))).current;
  return(
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:1}}>
      {items.map((f,i)=>(
        <span key={i} className="absolute select-none"
          style={{left:f.left,bottom:"-10%",fontSize:f.size,
            animation:`floatFood ${f.duration} ${f.delay} ease-in infinite`,
            opacity:0.55,filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.15))"}}>
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
/* Mask a reviewer's name for on-screen privacy: keep the first letter and
   last initial + city, blur the rest. "Priya S., Delhi" → "P••••a S., Delhi" */
function maskName(name:string):string {
  const [who,...rest]=name.split(",");
  const parts=who.trim().split(/\s+/);
  const first=parts[0]||"";
  const masked=first.length<=2
    ? first[0]+"•"
    : first[0]+"•".repeat(Math.min(first.length-2,4))+first[first.length-1];
  const tail=parts.slice(1).join(" ");
  const city=rest.join(",").trim();
  return `${masked}${tail?` ${tail}`:""}${city?`, ${city}`:""}`;
}

const TESTIMONIALS=[
  {name:"Priya S., Delhi",text:"Lost 6 kg in 2 months eating dal and roti every day!",tag:"Weight loss"},
  {name:"Arjun M., Bangalore",text:"Finally a plan that doesn't tell me to eat salad for dinner.",tag:"Muscle gain"},
  {name:"Sneha R., Mumbai",text:"My PCOS diet is now actually manageable. No more guessing.",tag:"PCOS"},
];

function Welcome({lang,onLang,onNew,onLogin}:{lang:Lang;onLang:(l:Lang)=>void;onNew:()=>void;onLogin:()=>void}) {
  const t=makeT(lang);
  const [quote]=useState(pickQuote);
  const [visible,setVisible]=useState(false);
  const [slide,setSlide]=useState(0);
  useEffect(()=>{const tm=setTimeout(()=>setVisible(true),80);return()=>clearTimeout(tm);},[]);
  useEffect(()=>{
    const iv=setInterval(()=>setSlide(s=>(s+1)%TESTIMONIALS.length),4000);
    return()=>clearInterval(iv);
  },[]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{background:"linear-gradient(160deg,#043d25 0%,#0a6e3c 35%,#1DAA61 70%,#28c46e 100%)"}}>
      <FloatingFoods/>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{width:380,height:380,background:"rgba(255,255,255,0.05)",top:"-100px",right:"-100px"}}/>
        <div className="absolute rounded-full" style={{width:280,height:280,background:"rgba(0,0,0,0.08)",bottom:"-70px",left:"-70px"}}/>
      </div>
      {/* Language toggle */}
      <div className="absolute z-20 flex items-center gap-1 rounded-full p-1" style={{top:20,right:20,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(6px)"}}>
        <Globe size={14} className="text-white/80 ml-1.5"/>
        {(["en","hi"] as Lang[]).map(l=>(
          <button key={l} onClick={()=>onLang(l)}
            className="text-xs font-bold px-2.5 py-1 rounded-full transition"
            style={lang===l?{background:"#fff",color:GREEN}:{color:"rgba(255,255,255,0.85)"}}>
            {l==="en"?"EN":"हिं"}
          </button>
        ))}
      </div>
      <div className={`relative z-10 w-full max-w-sm transition-all duration-700 ${visible?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
        <div className="flex flex-col items-center mb-7">
          <Logo size={76}/>
          <h1 className="text-5xl font-black text-white mt-3 tracking-tight">EatBC</h1>
          <p className="text-green-200 font-medium text-base mt-1 tracking-wide">{t("tagline")}</p>
        </div>
        {/* Stats strip */}
        <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
          {["12,000+ plans built","Indian food first","Free forever"].map((s,i)=>(
            <span key={i} className="text-xs font-semibold text-green-200/80 flex items-center gap-1">
              <CheckCircle2 size={11} className="text-green-300"/>{s}
            </span>
          ))}
        </div>

        {/* Testimonials carousel */}
        <div className="mb-5">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="flex transition-transform duration-500 ease-out"
              style={{transform:`translateX(-${slide*100}%)`}}>
              {TESTIMONIALS.map((r,i)=>(
                <div key={i} className="w-full shrink-0 px-4 py-3"
                  style={{background:"rgba(255,255,255,0.11)",border:"1px solid rgba(255,255,255,0.18)",backdropFilter:"blur(8px)"}}>
                  <p className="text-white/90 text-sm leading-snug min-h-[2.5rem]">"{r.text}"</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-200 text-xs font-semibold">{maskName(r.name)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background:"rgba(29,170,97,0.4)",color:"#86efac"}}>{r.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {TESTIMONIALS.map((_,i)=>(
              <button key={i} onClick={()=>setSlide(i)} aria-label={`Testimonial ${i+1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width:slide===i?16:6,height:6,
                  background:slide===i?"#86efac":"rgba(255,255,255,0.35)",
                }}/>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={onNew}
            className="group relative w-full py-4 px-5 rounded-2xl shadow-xl transition-all duration-150 active:scale-[0.97]"
            style={{background:"#ffffff",color:GREEN}}>
            <span className="absolute left-5 top-1/2 -translate-y-1/2"><UserPlus size={21}/></span>
            <span className="block text-center font-black text-[1.05rem]">{t("newWarrior")}</span>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"><ArrowRight size={19}/></span>
          </button>
          <button onClick={onLogin}
            className="group relative w-full py-4 px-5 rounded-2xl transition-all duration-150 active:scale-[0.97] hover:bg-white/10"
            style={{border:"2px solid rgba(255,255,255,0.55)",color:"#ffffff"}}>
            <span className="absolute left-5 top-1/2 -translate-y-1/2"><User size={21}/></span>
            <span className="block text-center font-black text-[1.05rem]">{t("alreadyHustle")}</span>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"><ArrowRight size={19}/></span>
          </button>
        </div>
        <p className="text-center text-green-200/60 text-xs mt-6 flex items-center justify-center gap-1.5">
          <Stethoscope size={12}/> {t("notMedical")}
        </p>
      </div>
    </div>
  );
}

/* ─────────────── Food affiliation game ─────────────── */
/* Healthy-only ingredient picks — EatBC is a health app, so no fried/sugary
   items (paratha, white rice, poha, chai, biscuits) make this list. */
const FOOD_GAME: {e:string;n:string}[] = [
  {e:"🧀",n:"Paneer"},{e:"🍲",n:"Dal"},{e:"🫘",n:"Rajma"},{e:"🥘",n:"Chole"},
  {e:"🥞",n:"Dosa"},{e:"🍘",n:"Idli"},{e:"🍗",n:"Chicken"},{e:"🐟",n:"Fish"},
  {e:"🥚",n:"Egg"},{e:"🍛",n:"Khichdi"},{e:"🌾",n:"Oats"},{e:"🥗",n:"Salad"},
  {e:"🫛",n:"Sprouts"},{e:"🥦",n:"Veggies"},{e:"🍚",n:"Brown Rice"},{e:"🥛",n:"Milk"},
  {e:"🍶",n:"Curd"},{e:"🍵",n:"Green Tea"},{e:"🍎",n:"Fruit"},{e:"🥜",n:"Peanuts"},
];
function FoodGame({name,onDone}:{name?:string;onDone:(picks:string[])=>void}) {
  const NEED=5;
  const [picks,setPicks]=useState<string[]>([]);
  const done=picks.length>=NEED;
  const toggle=(n:string)=>setPicks(p=>p.includes(n)?p.filter(x=>x!==n):p.length>=NEED?p:[...p,n]);
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col px-5 pt-12 pb-32"
      style={{background:"linear-gradient(165deg,#052e1b 0%,#0a5e34 48%,#159a57 100%)"}}>
      {/* glow orbs */}
      <div className="absolute pointer-events-none rounded-full" style={{width:300,height:300,top:"-60px",right:"-80px",background:"radial-gradient(circle,rgba(0,255,157,0.25),transparent 70%)",filter:"blur(30px)"}}/>
      <div className="absolute pointer-events-none rounded-full" style={{width:260,height:260,bottom:"10%",left:"-90px",background:"radial-gradient(circle,rgba(0,255,157,0.16),transparent 70%)",filter:"blur(34px)"}}/>

      <div className="relative z-10 max-w-md w-full mx-auto">
        <div className="flex items-center gap-2 mb-6"><Logo size={28}/><span className="font-black text-white tracking-tight">EatBC</span></div>
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3"
          style={{background:"rgba(0,255,157,0.14)",border:"1px solid rgba(0,255,157,0.3)"}}>
          <Sparkles size={12} style={{color:"#00FF9D"}}/>
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{color:"#00FF9D"}}>Quick game</span>
        </div>
        <h2 className="text-white font-black leading-tight" style={{fontSize:30,letterSpacing:"-1px"}}>
          {name?`${name}, tap `:"Tap "}<span style={{color:"#7CFFC4"}}>5 foods</span> you love
        </h2>
        <p className="text-white/55 text-sm mt-1.5">We'll weave your favourites right into your plan.</p>

        {/* progress dots */}
        <div className="flex items-center gap-2 mt-5 mb-6">
          {Array.from({length:NEED}).map((_,i)=>(
            <div key={i} className="h-2 flex-1 rounded-full transition-all duration-300"
              style={{background:i<picks.length?"#00FF9D":"rgba(255,255,255,0.15)",
                boxShadow:i<picks.length?"0 0 10px #00FF9D":"none"}}/>
          ))}
          <span className="text-white font-black text-sm ml-1 tabular-nums">{picks.length}/{NEED}</span>
        </div>

        {/* bubble grid */}
        <div className="grid grid-cols-4 gap-3">
          {FOOD_GAME.map((f,i)=>{
            const on=picks.includes(f.n);
            return (
              <button key={f.n} onClick={()=>toggle(f.n)}
                className="relative flex flex-col items-center justify-center rounded-2xl aspect-square transition-all duration-200 active:scale-90"
                style={{
                  background:on?"rgba(0,255,157,0.16)":"rgba(255,255,255,0.07)",
                  border:on?"2px solid #00FF9D":"1px solid rgba(255,255,255,0.14)",
                  boxShadow:on?"0 8px 26px -6px rgba(0,255,157,0.55)":"none",
                  transform:on?"scale(1.04)":"scale(1)",
                  animation:`bobFloat ${2.6+i%4*0.4}s ease-in-out ${i*0.12}s infinite`,
                }}>
                <span style={{fontSize:30,lineHeight:1}}>{f.e}</span>
                <span className="text-[10px] font-bold mt-1" style={{color:on?"#7CFFC4":"rgba(255,255,255,0.6)"}}>{f.n}</span>
                {on&&(
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{background:"#00FF9D",animation:"popIn 0.3s ease both"}}>
                    <Check size={13} strokeWidth={3.5} color="#052e1b"/>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* fixed CTA */}
      <div className="fixed left-0 right-0 bottom-0 px-5 pb-7 pt-10 z-20"
        style={{background:"linear-gradient(to top,#052e1b 30%,transparent)"}}>
        <button disabled={!done} onClick={()=>onDone(picks)}
          className="max-w-md mx-auto w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
          style={done
            ?{background:"#00FF9D",color:"#052e1b",boxShadow:"0 0 32px rgba(0,255,157,0.6)"}
            :{background:"rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.45)"}}>
          {done?<>Reveal my plan <Sparkles size={18}/></>:`Pick ${NEED-picks.length} more`}
        </button>
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
        <p className="text-gray-400 text-sm mt-1 mb-6">Sign in to track your progress</p>
        <label className="text-sm font-semibold text-gray-600">Phone, Email or Username</label>
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
          {busy?<span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18}/>Signing in…</span>:"Let's Go"}
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
  const [consent,setConsent]=useState(false);
  const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
  async function submit() {
    setErr(""); if (!id.trim()||!pw){setErr("Enter both fields");return;}
    if (pw!==pw2){setErr("Passwords don't match");return;}
    if (pw.length<6){setErr("Password must be at least 6 characters");return;}
    if (!consent){setErr("Please accept the consent & disclaimer to continue");return;}
    setBusy(true);
    try {
      const name=profile?.name||id;
      const data=await apiPost("/api/register",{id:id.toLowerCase().trim(),name,password:pw});
      onDone({id:data.user.id,name:data.user.name,token:data.token});
    } catch(e:unknown) {
      const msg=(e as {error?:string})?.error;
      setErr(msg||(navigator.onLine?"Registration is temporarily unavailable. Please try again shortly.":"No internet connection."));
    } finally { setBusy(false); }
  }
  return (
    <Shell>
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2"><Logo size={28}/><span className="font-bold text-gray-700">EatBC</span></div>
        <div className="rounded-2xl px-4 py-3 mb-5 mt-4" style={{background:"#EAF7F0"}}>
          <p className="text-sm font-bold" style={{color:GREEN}}>Challenge accepted, {profile?.name||"champ"}!</p>
          <p className="text-xs text-gray-500 mt-0.5">Create your account to unlock your personal tracker.</p>
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-5">Lock in your <span style={{color:GREEN}}>account</span> 🔐</h2>
        <label className="text-sm font-semibold text-gray-600">Phone, Email or Username <span className="text-gray-400 font-normal">(your login ID)</span></label>
        <input value={id} onChange={e=>setId(e.target.value)} placeholder="9876543210 or you@email.com"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-4 mt-1"/>
        <label className="text-sm font-semibold text-gray-600">Set a Password</label>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Min 6 characters"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-4 mt-1"/>
        <label className="text-sm font-semibold text-gray-600">Confirm Password</label>
        <input type="password" value={pw2} onChange={e=>setPw2(e.target.value)} placeholder="Repeat password"
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 mb-2 mt-1"
          onKeyDown={e=>e.key==="Enter"&&submit()}/>
        <p className="text-xs text-gray-400 mb-3">Your data is encrypted with AES-256 and stored securely.</p>
        <label className="flex items-start gap-2.5 mb-4 cursor-pointer select-none">
          <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-green-600 shrink-0"/>
          <span className="text-xs text-gray-500 leading-relaxed">
            I consent to EatBC storing my health details to personalise my plan, and I understand EatBC
            offers <strong className="text-gray-700">general wellness guidance — not medical advice</strong>.
            I'll consult a doctor for any medical condition.
          </span>
        </label>
        {err&&<div className="mb-3 flex items-center gap-2 text-red-500 text-sm"><AlertCircle size={16}/>{err}</div>}
        <button disabled={busy} onClick={submit}
          className="w-full py-3.5 rounded-2xl text-white font-black text-base disabled:opacity-60 shadow-md"
          style={{background:GREEN}}>
          {busy?<span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18}/>Creating…</span>:"Activate My Tracker"}
        </button>
        <button onClick={onBack} className="w-full text-center text-gray-400 text-sm mt-4">← Back to plan</button>
      </Card>
    </Shell>
  );
}

/* ─────────────── Food Logger ─────────────── */
function FoodLogger({log,customFoods,onSaveCustom,onUpdate,t,diet}:{
  log:FoodLog[];customFoods:LogFood[];onSaveCustom:(f:LogFood)=>void;
  onUpdate:(l:FoodLog[])=>void;t:(k:keyof typeof STR)=>string;diet?:string;
}) {
  const [open,setOpen]=useState(false);
  const [search,setSearch]=useState("");
  const [pending,setPending]=useState<LogFood|null>(null);
  const [servings,setServings]=useState(1);
  const [cat,setCat]=useState("All");
  const [mode,setMode]=useState<"search"|"custom"|"barcode"|"photo">("search");
  /* custom food form */
  const [cName,setCName]=useState(""); const [cQty,setCQty]=useState(""); const [cCal,setCCal]=useState(""); const [cProt,setCProt]=useState("");
  /* barcode lookup */
  const [bar,setBar]=useState(""); const [barBusy,setBarBusy]=useState(false); const [barErr,setBarErr]=useState("");
  const [photoSuggestions, setPhotoSuggestions] = useState<LogFood[]>([]);
  const [photoScanning, setPhotoScanning] = useState(false);

  const total=log.reduce((s,x)=>s+x.cal,0);
  const ALL_FOODS=[...customFoods,...LOG_DB];
  const CATS=["All",...Array.from(new Set(ALL_FOODS.map(f=>f.cat)))];
  const filtered=ALL_FOODS.filter(f=>{
    const matchSearch=!search||f.n.toLowerCase().includes(search.toLowerCase());
    const matchCat=cat==="All"||f.cat===cat;
    return matchSearch&&matchCat;
  }).slice(0,40);

  function addFood(){
    if(!pending)return;
    const cal=Math.round(pending.c*servings);
    const p=Math.round((pending.p||0)*servings);
    const s=servings===1?"":`${servings}× `;
    onUpdate([...log,{n:pending.n,cal,p,qty:`${s}${pending.q}`,servings}]);
    setPending(null); setServings(1); setSearch(""); setOpen(false); setMode("search");
  }
  function remove(i:number){onUpdate(log.filter((_,idx)=>idx!==i));}

  function saveCustom(){
    if(!cName.trim()||!cCal) return;
    const f:LogFood={n:cName.trim(),c:Math.round(+cCal),p:cProt?Math.round(+cProt):0,q:cQty.trim()||"1 serving",cat:"My Foods"};
    onSaveCustom(f); setPending(f); setServings(1);
    setCName("");setCQty("");setCCal("");setCProt("");setMode("search");
  }

  async function lookupBarcode(){
    if(!bar.trim()) return;
    setBarBusy(true); setBarErr("");
    try {
      const r=await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(bar.trim())}.json?fields=product_name,nutriments,serving_size`);
      const d=await r.json();
      if(d.status!==1||!d.product){ setBarErr("Product not found. Try entering it manually."); return; }
      const pr=d.product;
      const kcal=pr.nutriments?.["energy-kcal_serving"]??pr.nutriments?.["energy-kcal_100g"];
      const prot=pr.nutriments?.["proteins_serving"]??pr.nutriments?.["proteins_100g"];
      setCName(pr.product_name||"Scanned product");
      setCQty(pr.serving_size||"per 100g");
      setCCal(kcal?String(Math.round(kcal)):"");
      setCProt(prot?String(Math.round(prot)):"");
      setMode("custom");
    } catch { setBarErr("Lookup failed — check your connection."); }
    finally { setBarBusy(false); }
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setPhotoScanning(true); setMode("photo");
    // Simulate photo analysis: after 2s pick 3 diet-appropriate foods at random
    setTimeout(()=>{
      const pool = LOG_DB.slice(0,120);
      const shuffled = [...pool].sort(()=>Math.random()-0.5).slice(0,3);
      setPhotoSuggestions(shuffled);
      setPhotoScanning(false);
    }, 2000);
  }

  return(
    <Card className="p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Utensils size={18} style={{color:GREEN}}/> {t("foodDiary")}
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
        <div className="flex gap-2">
          <button onClick={()=>setOpen(true)}
            className="flex-1 py-2.5 rounded-2xl border-2 border-dashed text-sm font-bold transition hover:bg-green-50"
            style={{borderColor:GREEN,color:GREEN}}>
            {t("addFood")}
          </button>
          <label className="px-4 py-2.5 rounded-2xl border-2 border-dashed text-sm font-bold transition hover:bg-purple-50 cursor-pointer flex items-center gap-1.5"
            style={{borderColor:"#8B5CF6",color:"#8B5CF6"}}>
            <Camera size={15}/> {t("photoScan")}
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handlePhoto}/>
          </label>
        </div>
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
              <div className="flex gap-1.5 mb-3 bg-gray-50 rounded-xl p-1">
                {([["search","🔍 Search"],["custom","✏️ Custom"],["barcode","📷 Barcode"],["photo","📸 Photo"]] as [typeof mode,string][]).map(([m,label])=>(
                  <button key={m} onClick={()=>setMode(m)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${mode===m?"text-white shadow-sm":"text-gray-500"}`}
                    style={mode===m?{background:GREEN}:{}}>{label}</button>
                ))}
              </div>

              {mode==="search"&&(
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
                          <div className="text-sm font-semibold text-gray-700 truncate">{f.n}{f.cat==="My Foods"&&<span className="ml-1 text-[10px] font-bold" style={{color:GREEN}}>★</span>}</div>
                          <div className="text-xs text-gray-400 truncate">{f.q}</div>
                        </div>
                        <span className="text-xs font-bold shrink-0" style={{color:GREEN}}>{f.c}</span>
                      </button>
                    ))}
                    {filtered.length===0&&<p className="text-sm text-gray-400 text-center py-6">No matches — add it as a custom food.</p>}
                  </div>
                </>
              )}

              {mode==="custom"&&(
                <div className="space-y-2.5">
                  <input value={cName} onChange={e=>setCName(e.target.value)} placeholder="Food name — e.g. Mom's rajma"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-sm"/>
                  <input value={cQty} onChange={e=>setCQty(e.target.value)} placeholder="Serving — e.g. 1 bowl (200g)"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-sm"/>
                  <div className="flex gap-2.5">
                    <input value={cCal} onChange={e=>setCCal(e.target.value)} type="number" placeholder="Calories"
                      className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-sm"/>
                    <input value={cProt} onChange={e=>setCProt(e.target.value)} type="number" placeholder="Protein (g)"
                      className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-sm"/>
                  </div>
                  <button onClick={saveCustom} disabled={!cName.trim()||!cCal}
                    className="w-full py-2.5 rounded-2xl text-white font-bold text-sm disabled:opacity-50" style={{background:GREEN}}>
                    Save &amp; use this food
                  </button>
                  <p className="text-xs text-gray-400 text-center">Saved foods are reusable from Search next time.</p>
                </div>
              )}

              {mode==="barcode"&&(
                <div className="space-y-2.5">
                  <p className="text-xs text-gray-500">Enter the barcode number from a packaged product — we'll fetch its nutrition from the OpenFoodFacts database.</p>
                  <div className="flex gap-2">
                    <input value={bar} onChange={e=>setBar(e.target.value)} inputMode="numeric" placeholder="e.g. 8901058000016"
                      className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-sm"/>
                    <button onClick={lookupBarcode} disabled={barBusy||!bar.trim()}
                      className="px-5 rounded-2xl text-white font-bold text-sm disabled:opacity-50" style={{background:GREEN}}>
                      {barBusy?<Loader2 className="animate-spin" size={16}/>:"Look up"}
                    </button>
                  </div>
                  {barErr&&<div className="flex items-center gap-2 text-red-500 text-xs"><AlertCircle size={14}/>{barErr}</div>}
                </div>
              )}

              {mode==="photo"&&(
                <div className="mt-3">
                  {photoScanning?(
                    <div className="flex flex-col items-center py-8 gap-3">
                      <Loader2 className="animate-spin text-purple-500" size={28}/>
                      <p className="text-sm text-gray-500">{t("photoAnalyzing")}</p>
                    </div>
                  ):(
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 mb-2">Best matches from your photo:</p>
                      {photoSuggestions.map((f,i)=>(
                        <button key={i} onClick={()=>{setPending(f);setServings(1);setMode("search");}}
                          className="w-full text-left px-4 py-3 rounded-2xl border-2 border-gray-100 hover:border-purple-300 transition">
                          <div className="font-semibold text-gray-800 text-sm">{f.n}</div>
                          <div className="text-xs text-gray-400">{f.q} · {f.c} kcal</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button onClick={()=>{setOpen(false);setSearch("");setPending(null);setMode("search");setBarErr("");}}
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

/* ─────────────── Weekly trends ─────────────── */
function TrendsCard({history,calTarget,proteinTarget,weights,t}:{
  history:Record<string,HistEntry>;calTarget:number;proteinTarget:number;
  weights:Record<string,number>;t:(k:keyof typeof STR)=>string;
}) {
  const days=[...Array(7)].map((_,i)=>{
    const iso=isoShift(-(6-i));
    const e=history[iso];
    return {label:weekdayOf(iso).slice(0,1),cal:e?.cal||0,protein:e?.protein||0};
  });
  const anyData=days.some(d=>d.cal>0);
  const wEntries=Object.entries(weights).sort().slice(-10).map(([d,w])=>({label:d.slice(5),w}));
  return (
    <Card className="p-5 mb-4">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
        <BarChart3 size={18} style={{color:GREEN}}/> {t("trends")}
      </h3>
      {anyData?(
        <>
          <div className="text-xs text-gray-400 mb-1">Calories — last 7 days</div>
          <div style={{width:"100%",height:150}}>
            <ResponsiveContainer>
              <BarChart data={days} margin={{top:4,right:4,left:-18,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f4"/>
                <XAxis dataKey="label" tick={{fontSize:11,fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{borderRadius:12,border:"1px solid #eee",fontSize:12}}/>
                {calTarget>0&&<ReferenceLine y={calTarget} stroke={GREEN} strokeDasharray="4 4"/>}
                <Bar dataKey="cal" radius={[6,6,0,0]} fill={GREEN}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {proteinTarget>0&&(
            <>
              <div className="text-xs text-gray-400 mt-3 mb-1">Protein (g) — last 7 days</div>
              <div style={{width:"100%",height:120}}>
                <ResponsiveContainer>
                  <BarChart data={days} margin={{top:4,right:4,left:-18,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f4"/>
                    <XAxis dataKey="label" tick={{fontSize:11,fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                    <RTooltip contentStyle={{borderRadius:12,border:"1px solid #eee",fontSize:12}}/>
                    <ReferenceLine y={proteinTarget} stroke="#8B5CF6" strokeDasharray="4 4"/>
                    <Bar dataKey="protein" radius={[6,6,0,0]} fill="#8B5CF6"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </>
      ):(
        <p className="text-sm text-gray-400">Start ticking meals and logging food — your weekly trends will appear here.</p>
      )}
      {wEntries.length>=2&&(
        <>
          <div className="text-xs text-gray-400 mt-3 mb-1">Weight (kg)</div>
          <div style={{width:"100%",height:120}}>
            <ResponsiveContainer>
              <LineChart data={wEntries} margin={{top:4,right:8,left:-18,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f4"/>
                <XAxis dataKey="label" tick={{fontSize:10,fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                <YAxis domain={["dataMin-1","dataMax+1"]} tick={{fontSize:10,fill:"#9ca3af"}} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{borderRadius:12,border:"1px solid #eee",fontSize:12}}/>
                <Line type="monotone" dataKey="w" stroke="#0E8A4D" strokeWidth={2.5} dot={{r:3}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  );
}

/* ─────────────── Insights ─────────────── */
function InsightsCard({history,proteinTarget,t}:{
  history:Record<string,HistEntry>;proteinTarget:number;t:(k:keyof typeof STR)=>string;
}) {
  const entries=Object.values(history);
  const tracked=entries.length;
  if (!tracked) return null;
  const onTrack=entries.filter(e=>e.onTrack).length;
  const rate=Math.round((onTrack/tracked)*100);
  const avgProtein=Math.round(entries.reduce((a,e)=>a+e.protein,0)/tracked);
  const proteinHitRate=proteinTarget>0?Math.round((entries.filter(e=>e.protein>=proteinTarget*0.9).length/tracked)*100):0;
  const best=bestStreak(history);
  const stats=[
    {label:"On-track rate",val:`${rate}%`,emoji:""},
    {label:"Best streak",val:`${best} days`,emoji:""},
    {label:"Avg protein",val:`${avgProtein}g`,emoji:""},
    {label:"Days tracked",val:`${tracked}`,emoji:"📅"},
  ];
  let nudge="You're building a real habit — keep showing up.";
  if (rate>=80) nudge="Outstanding consistency! You're in the top tier of EatBC warriors.";
  else if (proteinTarget>0&&proteinHitRate<50) nudge="You're often short on protein — add dal, curd, eggs or paneer to a meal.";
  else if (rate<40) nudge="Small steps win. Try ticking just your breakfast every day this week.";
  return (
    <Card className="p-5 mb-4">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
        <Lightbulb size={18} style={{color:"#F59E0B"}}/> {t("insights")}
      </h3>
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {stats.map(s=>(
          <div key={s.label} className="rounded-2xl px-3 py-2.5" style={{background:"#F7FAF8"}}>
            <div className="text-lg font-black text-gray-800">{s.emoji} {s.val}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl px-4 py-3 text-sm" style={{background:"#FFFBEB",color:"#92400E"}}>{nudge}</div>
    </Card>
  );
}

/* ─────────────── Challenges ─────────────── */
function ChallengesCard({history,joined,onToggle,t}:{
  history:Record<string,HistEntry>;joined:string[];
  onToggle:(id:string)=>void;t:(k:keyof typeof STR)=>string;
}) {
  const entries=Object.values(history);
  function progress(c:Challenge):number {
    if (c.metric==="ontrack") return entries.filter(e=>e.onTrack).length;
    if (c.metric==="water")   return entries.filter(e=>e.water>=8).length;
    if (c.metric==="protein") return entries.filter(e=>e.protein>0).length; // proteinTarget compared elsewhere
    return 0;
  }
  return (
    <Card className="p-5 mb-4">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
        <Target size={18} style={{color:"#8B5CF6"}}/> {t("challenges")}
      </h3>
      <div className="space-y-2.5">
        {CHALLENGES.map(c=>{
          const on=joined.includes(c.id);
          const done=Math.min(progress(c),c.target);
          const pct=Math.round((done/c.target)*100);
          const complete=done>=c.target;
          return (
            <div key={c.id} className="rounded-2xl p-3.5 border" style={{borderColor:on?GREEN:"#eef1f4",background:on?"#F2FBF6":"#fff"}}>
              <div className="flex items-start gap-2.5">
                <div className="text-2xl leading-none">{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm">{c.title}</span>
                    {complete&&<span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{background:GREEN}}>Done</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                  {on&&(
                    <div className="mt-2">
                      <div className="h-1.5 rounded-full bg-gray-100">
                        <div className="h-1.5 rounded-full transition-all" style={{width:`${pct}%`,background:GREEN}}/>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{done}/{c.target}</div>
                    </div>
                  )}
                </div>
                <button onClick={()=>onToggle(c.id)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 transition"
                  style={on?{background:"#fff",color:"#6b7280",border:"1.5px solid #e5e7eb"}:{background:GREEN,color:"#fff"}}>
                  {on?"Leave":"Join"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ─────────────── Leaderboard ─────────────── */
interface LeaderRow { name: string; streak: number; points: number; }
function Leaderboard({session,points,streak,t}:{
  session:Session;points:number;streak:number;t:(k:keyof typeof STR)=>string;
}) {
  const [rows,setRows]=useState<LeaderRow[]|null>(null);
  const [shared,setShared]=useState<boolean>(()=>!!sget<boolean>("eatbc:onboard:shared"));
  const [busy,setBusy]=useState(false);

  function load(){
    apiGet("/api/leaderboard",session.token)
      .then(d=>setRows(d.leaders||[]))
      .catch(()=>setRows([]));
  }
  useEffect(()=>{ load(); /* eslint-disable-next-line */ },[]);

  async function share(){
    setBusy(true);
    try {
      await apiPost("/api/leaderboard",{name:session.name,streak,points},session.token);
      sset("eatbc:onboard:shared",true); setShared(true); load();
    } catch {} finally { setBusy(false); }
  }

  return (
    <Card className="p-5 mb-4">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-1">
        <Trophy size={18} style={{color:"#F59E0B"}}/> {t("leaderboard")}
      </h3>
      <p className="text-xs text-gray-400 mb-3">Opt-in. Only your name &amp; streak are shared — never your health data.</p>
      {!shared&&(
        <button disabled={busy} onClick={share}
          className="w-full mb-3 py-2.5 rounded-2xl text-white font-bold text-sm disabled:opacity-60"
          style={{background:GREEN}}>
          {busy?"Joining…":"Join the leaderboard"}
        </button>
      )}
      {rows===null?(
        <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-300" size={20}/></div>
      ):rows.length===0?(
        <p className="text-sm text-gray-400">Be the first to join the community board!</p>
      ):(
        <div className="space-y-1.5">
          {rows.map((r,i)=>{
            const me=r.name===session.name;
            const medal=`${i+1}`;
            return (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{background:me?"#EAF7F0":"#fff"}}>
                <span className="w-6 text-center font-bold text-gray-500 text-sm">{medal}</span>
                <span className="flex-1 truncate font-semibold text-sm text-gray-700">{r.name}{me?" (you)":""}</span>
                <span className="text-xs font-bold flex items-center gap-1" style={{color:"#F59E0B"}}><Flame size={12}/>{r.streak}</span>
                <span className="text-xs font-bold" style={{color:GREEN}}>{r.points} pts</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ─────────────── Reminders ─────────────── */
function ReminderToggle({t}:{t:(k:keyof typeof STR)=>string}) {
  const [on,setOn]=useState<boolean>(()=>!!sget<boolean>("eatbc:reminders"));
  const supported=typeof window!=="undefined"&&"Notification"in window;
  async function enable(){
    if (!supported) return;
    const perm=await Notification.requestPermission();
    if (perm==="granted"){
      sset("eatbc:reminders",true); setOn(true);
      new Notification("EatBC reminders on",{body:"We'll gently nudge you to log your meals.",icon:"/icon.svg"});
    }
  }
  function disable(){ sset("eatbc:reminders",false); setOn(false); }
  if (!supported) return null;
  return (
    <Card className="p-5 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{background:"#FEF3C7"}}>
          <Bell size={18} style={{color:"#F59E0B"}}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-800 text-sm">Daily reminders</div>
          <div className="text-xs text-gray-400">Get a nudge to log your meals each day.</div>
        </div>
        <button onClick={on?disable:enable}
          className="text-xs font-bold px-4 py-2 rounded-xl shrink-0 transition"
          style={on?{background:"#fff",color:"#6b7280",border:"1.5px solid #e5e7eb"}:{background:GREEN,color:"#fff"}}>
          {on?"On ✓":"Turn on"}
        </button>
      </div>
    </Card>
  );
}

/* ─────────────── Workout tab + tracker ─────────────── */
function workoutStreak(workouts: Record<string,boolean>): number {
  let streak=0;
  for (let i=0;i<400;i++){
    const iso=isoShift(-i);
    if (workouts[iso]) streak++;
    else if (i===0) continue;     // today not done yet — keep counting back
    else break;
  }
  return streak;
}
const BURN_LABEL: Record<string,string> = {cardio:"Cardio",compound:"Compound",isolation:"Isolation",hold:"Isometric hold"};
const BURN_COLOR: Record<string,string> = {cardio:"#EF4444",compound:"#7C3AED",isolation:"#2563EB",hold:"#059669"};

function ExerciseGuideSheet({name,onClose}:{name:string;onClose:()=>void}) {
  const g = EXERCISE_GUIDE[name];
  if (!g) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{background:"rgba(0,0,0,0.55)"}}>
      <div className="flex-1" onClick={onClose}/>
      <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{g.emoji}</span>
            <div>
              <h2 className="font-black text-gray-900 text-lg leading-tight">{name}</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{background:BURN_COLOR[g.burnType]}}>{BURN_LABEL[g.burnType]}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"><X size={16}/></button>
        </div>
        <div className="px-5 pt-4 pb-8">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {g.muscles.map(m=>(
              <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold">{m}</span>
            ))}
          </div>
          <h3 className="font-black text-gray-800 mb-3 text-sm uppercase tracking-wide">How to do it</h3>
          <ol className="space-y-2.5 mb-5">
            {g.steps.map((s,i)=>(
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-black text-xs text-white" style={{background:"#7C3AED"}}>{i+1}</span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl p-4 flex gap-3" style={{background:"#F5F3FF"}}>
            <Lightbulb size={16} className="text-purple-600 shrink-0 mt-0.5"/>
            <p className="text-sm text-purple-900">{g.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipeSheet({name,onClose}:{name:string;onClose:()=>void}) {
  const r = RECIPE_DB[name];
  if (!r) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{background:"rgba(0,0,0,0.55)"}}>
      <div className="flex-1" onClick={onClose}/>
      <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900 text-lg leading-tight">{name}</h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock size={12}/> {r.time}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"><X size={16}/></button>
        </div>
        <div className="px-5 pt-4 pb-8">
          {r.ingredients&&(
            <>
              <h3 className="font-black text-gray-800 mb-3 text-sm uppercase tracking-wide">Ingredients</h3>
              <ul className="mb-5 space-y-1">
                {r.ingredients.map((ing,i)=>(
                  <li key={i} className="flex gap-2 text-sm text-gray-700"><span className="text-green-500 mt-0.5">•</span>{ing}</li>
                ))}
              </ul>
            </>
          )}
          <h3 className="font-black text-gray-800 mb-3 text-sm uppercase tracking-wide">Steps</h3>
          <ol className="space-y-2.5 mb-5">
            {r.steps.map((s,i)=>(
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-black text-xs text-white" style={{background:"#1DAA61"}}>{i+1}</span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
          {r.tip&&(
            <div className="rounded-2xl p-4 flex gap-3" style={{background:"#F0FDF4"}}>
              <Lightbulb size={16} className="text-green-600 shrink-0 mt-0.5"/>
              <p className="text-sm text-green-900">{r.tip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkoutTab({workout,tracking,onUpdate}:{
  workout:WorkoutPlan;tracking:Tracking;onUpdate:(t:Tracking)=>void;
}) {
  const todayIdx=(new Date().getDay()+6)%7;            // Mon=0
  const iso=isoDate();
  const dayIdx=workout.schedule[todayIdx];
  const isRest=dayIdx===null||dayIdx===undefined;
  const session=isRest?null:workout.days[dayIdx];
  const workouts=tracking.workouts||{};
  const sets=tracking.workoutSets||{};
  const doneIdx=sets[iso]||[];
  const completedToday=!!workouts[iso];
  const streak=workoutStreak(workouts);
  const weekDone=Array.from({length:7}).filter((_,i)=>workouts[isoShift(-i)]).length;

  const [guideEx,setGuideEx]=useState<string|null>(null);

  const toggleEx=(i:number)=>{
    const cur=sets[iso]||[];
    const next=cur.includes(i)?cur.filter(x=>x!==i):[...cur,i];
    onUpdate({...tracking,workoutSets:{...sets,[iso]:next}});
  };
  const markDone=()=>onUpdate({...tracking,workouts:{...workouts,[iso]:!completedToday}});

  const DOW=["M","T","W","T","F","S","S"];
  return (
    <>
      {/* streak header */}
      <div className="rounded-3xl p-5 mb-4 text-white shadow-lg"
        style={{background:"linear-gradient(135deg,#5B21B6 0%,#7C3AED 55%,#9333EA 100%)"}}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1"><Dumbbell size={18}/><span className="font-bold text-sm">Your Training</span></div>
            <div className="text-3xl font-black flex items-center gap-1.5"><Flame size={24}/>{streak}</div>
            <div className="text-white/70 text-xs">workout day streak</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{weekDone}<span className="text-base font-normal text-white/60">/{workout.daysPerWeek}</span></div>
            <div className="text-white/70 text-xs">sessions this week</div>
          </div>
        </div>
        <div className="text-white/80 text-xs mt-3">{workout.focus} · {workout.place} · {workout.daysPerWeek} days/week</div>
      </div>

      {/* weekly schedule strip */}
      <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-4 flex justify-between">
        {DOW.map((d,i)=>{
          const wi=workout.schedule[i];
          const rest=wi===null||wi===undefined;
          const isToday=i===todayIdx;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className={`text-[11px] font-bold ${isToday?"text-purple-600":"text-gray-400"}`}>{d}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold"
                style={rest?{background:"#F3F4F6",color:"#9CA3AF"}:{background:isToday?"#7C3AED":"#EDE9FE",color:isToday?"#fff":"#7C3AED"}}>
                {rest?"·":(workouts[isoShift(-(todayIdx-i))]&&i<=todayIdx?"✓":(wi as number)+1)}
              </div>
            </div>
          );
        })}
      </div>

      {/* today's session */}
      {isRest?(
        <div className="bg-white rounded-3xl border border-gray-100 p-7 text-center mb-4">
          <div className="text-5xl mb-3">😌</div>
          <h3 className="font-black text-gray-800 text-lg">Rest day</h3>
          <p className="text-gray-500 text-sm mt-1">Recovery is where progress happens. A light walk or stretch is perfect today.</p>
        </div>
      ):session&&(
        <div className="bg-white rounded-3xl border border-gray-100 p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-black text-gray-800 text-lg">{session.label}</h3>
            {completedToday&&<span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background:"#EDE9FE",color:"#7C3AED"}}>Done ✓</span>}
          </div>
          <p className="text-gray-400 text-sm mb-4">{session.focus}</p>
          <div className="space-y-2">
            {session.items.map((it,i)=>{
              const on=doneIdx.includes(i);
              const hasGuide=!!EXERCISE_GUIDE[it.name];
              return (
                <div key={i} className="flex gap-2 items-stretch">
                  <button onClick={()=>toggleEx(i)}
                    className="flex-1 flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition"
                    style={on?{background:"#F5F3FF",borderColor:"#C4B5FD"}:{borderColor:"#F3F4F6"}}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2"
                      style={on?{background:"#7C3AED",borderColor:"#7C3AED"}:{borderColor:"#D1D5DB"}}>
                      {on&&<Check size={14} color="#fff" strokeWidth={3}/>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-semibold text-sm ${on?"text-purple-900":"text-gray-800"}`}>{it.name}</div>
                      {it.note&&<div className="text-[11px] text-gray-400">{it.note}</div>}
                    </div>
                    <div className="text-xs font-bold text-gray-500 shrink-0 text-right">
                      {it.sets>1&&<span>{it.sets} × </span>}{it.reps}
                    </div>
                  </button>
                  {hasGuide&&(
                    <button onClick={()=>setGuideEx(it.name)}
                      className="w-10 rounded-2xl border-2 flex items-center justify-center transition hover:opacity-80"
                      style={{borderColor:"#EDE9FE",background:"#F5F3FF"}}
                      title="How to do this exercise">
                      <BookOpen size={15} className="text-purple-500"/>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={markDone}
            className="w-full mt-4 py-3 rounded-2xl font-black text-white transition active:scale-[0.98]"
            style={{background:completedToday?"#9CA3AF":"#7C3AED"}}>
            {completedToday?"Mark as not done":"Complete workout"}
          </button>
        </div>
      )}

      {/* full plan */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 mb-4">
        <div className="flex items-center gap-2 mb-3"><CalendarDays size={16} className="text-purple-600"/><h3 className="font-black text-gray-800">Full weekly plan</h3></div>
        <div className="space-y-3">
          {workout.days.map((d,i)=>(
            <details key={i} className="rounded-2xl border border-gray-100 overflow-hidden">
              <summary className="px-4 py-3 cursor-pointer font-semibold text-sm text-gray-800 flex items-center justify-between">
                <span>{d.label}</span><span className="text-xs text-gray-400">{d.items.length} exercises</span>
              </summary>
              <div className="px-4 pb-3 space-y-1.5">
                <p className="text-xs text-gray-400 mb-2">{d.focus}</p>
                {d.items.map((it,j)=>(
                  <div key={j} className="flex justify-between items-center text-sm">
                    <button onClick={()=>EXERCISE_GUIDE[it.name]&&setGuideEx(it.name)}
                      className={`text-left flex items-center gap-1 ${EXERCISE_GUIDE[it.name]?"text-purple-700 font-semibold hover:underline":"text-gray-700"}`}>
                      {it.name}{it.note?<span className="text-gray-400 font-normal"> · {it.note}</span>:""}
                      {EXERCISE_GUIDE[it.name]&&<BookOpen size={12} className="text-purple-400 shrink-0"/>}
                    </button>
                    <span className="text-gray-500 font-medium shrink-0 ml-2">{it.sets>1?`${it.sets} × `:""}{it.reps}</span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* coaching notes */}
      <div className="rounded-3xl p-5 mb-4" style={{background:"#F5F3FF"}}>
        <div className="flex items-center gap-2 mb-2"><Lightbulb size={16} className="text-purple-600"/><h3 className="font-black text-purple-900 text-sm">Training notes</h3></div>
        <ul className="space-y-1.5">
          {workout.notes.map((n,i)=>(
            <li key={i} className="text-xs text-purple-900/80 flex gap-2"><span className="text-purple-400">•</span>{n}</li>
          ))}
        </ul>
      </div>
      {guideEx&&<ExerciseGuideSheet name={guideEx} onClose={()=>setGuideEx(null)}/>}
    </>
  );
}

/* ─────────────── Dashboard ─────────────── */
/* ─────────────── Weekly Review Card (Monday first-open modal) ────────────── */
function WeeklyReviewCard({history,weights,onClose}:{history:Record<string,HistEntry>;weights:Record<string,number>;onClose:()=>void}) {
  const days=Object.entries(history).sort(([a],[b])=>a<b?1:-1).slice(0,7);
  const onTrackCount=days.filter(([,e])=>e.onTrack).length;
  const avgCal=days.length?Math.round(days.reduce((s,[,e])=>s+e.cal,0)/days.length):0;
  const avgPro=days.length?Math.round(days.reduce((s,[,e])=>s+e.protein,0)/days.length):0;
  const wEntries=Object.entries(weights).sort(([a],[b])=>a<b?1:-1);
  const wChange=wEntries.length>=2?(wEntries[0][1]-wEntries[wEntries.length-1][1]).toFixed(1):null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}}>
      <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl bg-white" style={{animation:"eFade .3s ease both"}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5"><Trophy size={18} style={{color:"#1DAA61"}}/><span className="font-black text-gray-800 text-lg">Week in review</span></div>
            <p className="text-xs text-gray-400 mt-0.5">Your last 7 days at a glance</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500"><X size={22}/></button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl p-4" style={{background:"#F0FAF4"}}>
            <div className="text-2xl font-black" style={{color:"#1DAA61"}}>{onTrackCount}/7</div>
            <div className="text-xs text-gray-500 mt-0.5">days on track</div>
          </div>
          <div className="rounded-2xl p-4" style={{background:"#FFF7ED"}}>
            <div className="text-2xl font-black text-orange-500">{avgCal}</div>
            <div className="text-xs text-gray-500 mt-0.5">avg kcal/day</div>
          </div>
          <div className="rounded-2xl p-4" style={{background:"#EFF6FF"}}>
            <div className="text-2xl font-black text-blue-500">{avgPro}g</div>
            <div className="text-xs text-gray-500 mt-0.5">avg protein/day</div>
          </div>
          <div className="rounded-2xl p-4" style={{background:wChange&&+wChange<0?"#F0FAF4":"#FFF7ED"}}>
            <div className="text-2xl font-black" style={{color:wChange&&+wChange<0?"#1DAA61":"#d97706"}}>{wChange?`${+wChange>0?"+":""}${wChange} kg`:"—"}</div>
            <div className="text-xs text-gray-500 mt-0.5">weight change</div>
          </div>
        </div>
        {onTrackCount>=5?(
          <p className="text-sm text-center font-semibold" style={{color:"#1DAA61"}}>Excellent week! You're in the zone.</p>
        ):onTrackCount>=3?(
          <p className="text-sm text-center text-gray-500">Solid effort — keep building those habits.</p>
        ):(
          <p className="text-sm text-center text-gray-400">Tough week — that's OK. Every day is a fresh start.</p>
        )}
        <button onClick={onClose}
          className="w-full mt-4 py-3 rounded-2xl text-white font-semibold"
          style={{background:"#1DAA61"}}>Let's make this week better</button>
      </div>
    </div>
  );
}

function AdaptiveRecalcBanner({weights, lastRecalcDate, lastRecalcWeight, goal, onRecalc}:{
  weights:Record<string,number>; lastRecalcDate?:string; lastRecalcWeight?:number;
  goal:string; onRecalc:(activity?:string,overrideWeight?:number)=>void;
}) {
  const wEntries = Object.entries(weights).sort();
  if (wEntries.length < 1) return null;
  const latest = wEntries[wEntries.length-1][1];
  const refWeight = lastRecalcWeight ?? (wEntries[0]?.[1] ?? latest);
  const diffKg = Math.abs(latest - refWeight);
  const daysSince = lastRecalcDate
    ? Math.floor((Date.now() - new Date(lastRecalcDate).getTime()) / 86400000)
    : 999;

  // plateau: last 7+ entries all within 0.4 kg and goal is weight loss
  const last7 = wEntries.slice(-7).map(([,w])=>w);
  const range = last7.length >= 7 ? Math.max(...last7) - Math.min(...last7) : 999;
  const plateau = range < 0.4 && last7.length >= 7 && goal === "Weight loss";

  const show = (diffKg >= 0.8 && daysSince >= 14) || plateau;
  if (!show) return null;

  return (
    <div className="rounded-2xl px-4 py-3 mb-3 flex items-center gap-3"
      style={{background:"#EFF6FF",border:"1px solid #BFDBFE"}}>
      <Zap size={18} className="text-blue-500 shrink-0"/>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-blue-800">
          {plateau ? "Weight plateau detected — let's adjust your plan." : `You've ${latest < refWeight ? "lost" : "gained"} ${diffKg.toFixed(1)} kg — update your target.`}
        </p>
        <p className="text-xs text-blue-500 mt-0.5">Your calorie target needs recalculation.</p>
      </div>
      <button onClick={onRecalc}
        className="shrink-0 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
        style={{background:"#3B82F6"}}>
        Update
      </button>
    </div>
  );
}

function EatingWindowCard({mealTimes, today}:{mealTimes:Record<string,Record<string,string>>; today:string}) {
  const todayTimes = Object.values(mealTimes[today] || {}).filter(Boolean).map(t=>new Date(t));
  if (todayTimes.length < 2) return null;
  todayTimes.sort((a,b)=>a.getTime()-b.getTime());
  const first = todayTimes[0];
  const last = todayTimes[todayTimes.length-1];
  const windowHrs = ((last.getTime()-first.getTime())/3600000).toFixed(1);
  const fmt = (d:Date) => d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  return (
    <div className="rounded-2xl px-4 py-3 mb-3 flex items-center gap-3"
      style={{background:"#FDF4FF",border:"1px solid #E9D5FF"}}>
      <Clock size={16} className="text-purple-500 shrink-0"/>
      <div className="flex gap-4">
        <div><div className="text-base font-black text-purple-800">{fmt(first)}</div><div className="text-xs text-purple-400">First meal</div></div>
        <div><div className="text-base font-black text-purple-800">{fmt(last)}</div><div className="text-xs text-purple-400">Last meal</div></div>
        <div><div className="text-base font-black text-purple-800">{windowHrs}h</div><div className="text-xs text-purple-400">Window</div></div>
      </div>
    </div>
  );
}

function ProgressionTracker({daysActive, t}:{daysActive:number; t:(k:keyof typeof STR)=>string}) {
  const levels = [
    {day:1,  label:"Meal tracking",   desc:"Tick off your planned meals",  icon:CheckCircle2, color:"#1DAA61"},
    {day:8,  label:"Food diary",      desc:"Log everything you eat",        icon:BookOpen,     color:"#0EA5E9"},
    {day:15, label:"Protein targets", desc:"Hit your daily protein goal",   icon:Target,       color:"#8B5CF6"},
    {day:22, label:"Advanced insights",desc:"Trends, streaks & leaderboard",icon:BarChart3,    color:"#F59E0B"},
  ];
  const [dismissed, setDismissed] = useState(()=>!!sget<boolean>(`eatbc:progressDismissed:${Math.floor(daysActive/7)}`));
  const newUnlock = levels.find(l=>daysActive>=l.day&&daysActive<l.day+2);
  if (newUnlock && !dismissed) {
    return (
      <div className="rounded-2xl px-4 py-3 mb-3 flex items-center gap-3"
        style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1px solid #FDE68A"}}>
        <Star size={18} className="text-amber-500 shrink-0"/>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-800">{t("weekUnlocked")}: {newUnlock.label}</p>
          <p className="text-xs text-amber-600 mt-0.5">{newUnlock.desc} is now active!</p>
        </div>
        <button onClick={()=>{sset(`eatbc:progressDismissed:${Math.floor(daysActive/7)}`,true);setDismissed(true);}}
          className="text-amber-400 hover:text-amber-600"><X size={15}/></button>
      </div>
    );
  }
  return (
    <div className="rounded-2xl p-4 mb-3" style={{background:"#FAFAFA",border:"1px solid #F0F0F0"}}>
      <div className="flex items-center gap-1.5 mb-3">
        <Zap size={14} style={{color:GREEN}}/>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your progress</span>
        <span className="ml-auto text-xs text-gray-400">Day {daysActive}</span>
      </div>
      <div className="flex gap-2">
        {levels.map((l,i)=>{
          const Icon=l.icon;
          const done=daysActive>=l.day;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center transition"
                style={{background:done?l.color:"#E5E7EB"}}>
                {done?<Icon size={14} color="#fff"/>:<Lock size={12} color="#9CA3AF"/>}
              </div>
              <div className="text-[9px] text-center leading-tight font-semibold" style={{color:done?l.color:"#9CA3AF"}}>{l.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DietitianCard({condition, t}:{condition:string; t:(k:keyof typeof STR)=>string}) {
  const SHOW_FOR = ["Diabetes / pre-diabetes","High BP (hypertension)","High cholesterol","Thyroid (hypothyroid)","PCOS / PCOD"];
  const [dismissed, setDismissed] = useState(()=>!!sget<boolean>("eatbc:dietitianDismissed"));
  if (!SHOW_FOR.includes(condition) || dismissed) return null;
  return (
    <div className="rounded-2xl px-4 py-3.5 mb-4" style={{background:"linear-gradient(135deg,#FFF0F5,#FCE7F3)",border:"1px solid #FBCFE8"}}>
      <div className="flex items-start gap-2.5">
        <HeartPulse size={18} className="text-pink-500 shrink-0 mt-0.5"/>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-pink-800">{t("dietitianCTA")}</p>
          <p className="text-xs text-pink-500 mt-0.5">You have {condition} — a dietician can personalise this further.</p>
          <a href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20a%20free%20diet%20plan%20review"
            target="_blank" rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
            style={{background:"#EC4899"}}>
            <Stethoscope size={12}/> {t("dietitianBook")}
          </a>
        </div>
        <button onClick={()=>{sset("eatbc:dietitianDismissed",true);setDismissed(true);}}
          className="text-pink-300 hover:text-pink-500"><X size={15}/></button>
      </div>
    </div>
  );
}

/* ─────────────── Veer — lifestyle coach AI bot ─────────────── */
function VeerIcon({size=40}:{size?:number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Head */}
      <ellipse cx="24" cy="27" rx="15" ry="17" fill="#F5CBA7"/>
      {/* Hair */}
      <path d="M11 25 C10 13 16 7 24 7 C32 7 38 13 37 25 C34 14 14 14 11 25Z" fill="#1C0F08"/>
      {/* Side burns */}
      <path d="M11 26 C11 29 12 32 13 33" stroke="#1C0F08" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M37 26 C37 29 36 32 35 33" stroke="#1C0F08" strokeWidth="2.2" strokeLinecap="round"/>
      {/* Eyes */}
      <ellipse cx="19" cy="25" rx="2.5" ry="3" fill="#1a1a1a"/>
      <ellipse cx="29" cy="25" rx="2.5" ry="3" fill="#1a1a1a"/>
      <circle cx="20" cy="24" r="0.9" fill="white"/>
      <circle cx="30" cy="24" r="0.9" fill="white"/>
      {/* Eyebrows */}
      <path d="M16 21 Q19 19.5 21.5 21" stroke="#1C0F08" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M26.5 21 Q29 19.5 32 21" stroke="#1C0F08" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* Nose */}
      <path d="M23 28 L22 31.5 Q24 33 26 31.5 L25 28" stroke="#C0825A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Smile */}
      <path d="M18.5 36 Q24 40.5 29.5 36" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Blush */}
      <ellipse cx="14.5" cy="33" rx="3.5" ry="2.5" fill="#FFB3BA" opacity="0.45"/>
      <ellipse cx="33.5" cy="33" rx="3.5" ry="2.5" fill="#FFB3BA" opacity="0.45"/>
      {/* V badge — brand mark */}
      <circle cx="39" cy="9" r="6.5" fill="#1DAA61"/>
      <path d="M35.5 6 L39 11.5 L42.5 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function VeerBot({session,planCondition}:{session:Session|null;planCondition:string}) {
  const [open,setOpen]=useState(false);
  const [phase,setPhase]=useState<"idle"|"listening"|"thinking"|"speaking">("idle");
  const [messages,setMessages]=useState<{role:"user"|"assistant";content:string}[]>([]);
  const [transcript,setTranscript]=useState("");
  const [promptsLeft,setPromptsLeft]=useState<number>(()=>10-Math.min(10,sget<number>("eatbc:veerUsed")||0));
  const [error,setError]=useState("");
  const hasIntroduced=useRef(false);
  const recogRef=useRef<any>(null);
  const audioRef=useRef<HTMLAudioElement|null>(null);
  const phaseRef=useRef(phase);
  phaseRef.current=phase;

  /* Sync prompt count from server on first open (fixes multi-device desync) */
  useEffect(()=>{
    if(!open) return;
    fetch("/api/veer",{method:"GET",headers:{...(session?.token?{Authorization:`Bearer ${session.token}`}:{})}})
      .then(r=>r.ok?r.json():null)
      .then((d:{promptsLeft?:number}|null)=>{
        if(d?.promptsLeft!=null){
          setPromptsLeft(d.promptsLeft);
          sset("eatbc:veerUsed",10-d.promptsLeft);
        }
      }).catch(()=>{});
    if(!hasIntroduced.current){
      hasIntroduced.current=true;
      handleVeer(null,true);
    }
    /* eslint-disable-next-line */
  },[open]);

  async function playTTS(text:string):Promise<void> {
    try {
      const r=await fetch("/api/veer-tts",{
        method:"POST",
        headers:{"Content-Type":"application/json",...(session?.token?{Authorization:`Bearer ${session.token}`}:{})},
        body:JSON.stringify({text}),
      });
      if(r.ok){
        const blob=await r.blob();
        const url=URL.createObjectURL(blob);
        await new Promise<void>(resolve=>{
          const audio=new Audio(url);
          audioRef.current=audio;
          audio.onended=()=>{URL.revokeObjectURL(url);resolve();};
          audio.onerror=()=>resolve();
          audio.play().catch(resolve);
        });
        return;
      }
    } catch {}
    /* Fallback: browser TTS */
    await new Promise<void>(resolve=>{
      const utt=new SpeechSynthesisUtterance(text);
      utt.lang="en-IN"; utt.rate=0.92;
      utt.onend=resolve; utt.onerror=resolve;
      window.speechSynthesis.speak(utt);
    });
  }

  async function handleVeer(userText:string|null,first=false) {
    setError("");
    setPhase("thinking");
    const newMessages=userText
      ?[...messages,{role:"user" as const,content:userText}]
      :messages;
    try {
      const body=first?{messages:[],isFirst:true}:{messages:newMessages};
      const r=await fetch("/api/veer",{
        method:"POST",
        headers:{"Content-Type":"application/json",...(session?.token?{Authorization:`Bearer ${session.token}`}:{})},
        body:JSON.stringify(body),
      });
      const data=await r.json() as {reply?:string;error?:string;promptsLeft?:number};
      if(!r.ok){
        setError(data.error||"Something went wrong.");
        setPhase("idle"); return;
      }
      const reply=data.reply||"";
      const left=data.promptsLeft??0;
      setPromptsLeft(left);
      sset("eatbc:veerUsed",10-left);
      const updated=[...newMessages,{role:"assistant" as const,content:reply}];
      setMessages(updated);
      setPhase("speaking");
      await playTTS(reply);
    } catch(e:any){
      setError("Couldn't reach Veer — check your connection.");
    } finally {
      setPhase("idle");
    }
  }

  function startListening() {
    if(promptsLeft<=0){setError("All 10 questions used! Sign up for unlimited access.");return;}
    const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
    if(!SR){setError("Voice not supported — try Chrome or Safari.");return;}
    audioRef.current?.pause();
    window.speechSynthesis.cancel();
    setTranscript(""); setError("");
    const recog=new SR();
    recog.lang="en-IN"; recog.interimResults=false; recog.maxAlternatives=1;
    recog.onresult=(e:any)=>{
      const text=e.results[0][0].transcript;
      setTranscript(text);
      handleVeer(text);
    };
    recog.onerror=()=>setPhase("idle");
    recog.onend=()=>{if(phaseRef.current==="listening")setPhase("idle");};
    recog.start();
    recogRef.current=recog;
    setPhase("listening");
  }

  function stopListening(){recogRef.current?.stop();setPhase("idle");}

  const lastReply=messages.findLast?.(m=>m.role==="assistant")?.content
    ??messages.filter(m=>m.role==="assistant").at(-1)?.content;

  return (
    <>
      <style>{`
        @keyframes veerSlide{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes veerRing{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.2);opacity:0}}
        @keyframes veerGlow{0%,100%{box-shadow:0 8px 32px rgba(29,170,97,.5)}50%{box-shadow:0 8px 48px rgba(29,170,97,.9)}}
        .veer-ring{animation:veerRing 1.4s ease-out infinite}
        .veer-glow{animation:veerGlow 2s ease-in-out infinite}
      `}</style>

      {/* Floating trigger */}
      <button onClick={()=>setOpen(true)} aria-label="Ask Veer"
        className="fixed z-40 flex items-center justify-center veer-glow active:scale-95 transition-transform"
        style={{bottom:24,right:20,width:64,height:64,borderRadius:"50%",
          background:"linear-gradient(135deg,#1DAA61,#0B6E40)",
          border:"3px solid rgba(255,255,255,0.35)"}}>
        <VeerIcon size={40}/>
      </button>

      {/* Full panel */}
      {open&&(
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{background:"rgba(0,0,0,0.55)",backdropFilter:"blur(6px)"}}>
          <div className="w-full max-w-sm rounded-t-3xl px-6 pt-6 pb-10"
            style={{background:"linear-gradient(175deg,#052e1b 0%,#0a5e34 55%,#0d7a45 100%)",
              animation:"veerSlide .35s cubic-bezier(.22,1,.36,1) both"}}>

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{background:"rgba(255,255,255,0.12)",border:"2px solid rgba(255,255,255,0.2)"}}>
                  <VeerIcon size={34}/>
                </div>
                <div>
                  <div className="text-white font-black text-lg leading-tight">Veer</div>
                  <div className="text-green-300 text-xs">Lifestyle Coach · {promptsLeft}/10 left</div>
                </div>
              </div>
              <button onClick={()=>{setOpen(false);window.speechSynthesis.cancel();audioRef.current?.pause();}}
                className="text-white/50 hover:text-white transition"><X size={22}/></button>
            </div>

            {/* Orb + phase indicator */}
            <div className="flex justify-center mb-5">
              <div className="relative flex items-center justify-center" style={{width:96,height:96}}>
                {phase!=="idle"&&[0,1,2].map(i=>(
                  <div key={i} className="absolute rounded-full veer-ring"
                    style={{width:96+i*32,height:96+i*32,
                      border:`1.5px solid rgba(29,170,97,${0.45-i*0.12})`,
                      animationDelay:`${i*0.35}s`,top:-(i*16),left:-(i*16)}}/>
                ))}
                <div className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background:phase==="listening"?"rgba(59,130,246,0.25)":
                      phase==="speaking"?"rgba(29,170,97,0.25)":"rgba(255,255,255,0.08)",
                    border:"2px solid rgba(255,255,255,0.18)",
                  }}>
                  {phase==="listening"&&<Mic size={32} className="text-blue-300"/>}
                  {phase==="thinking"&&<Loader2 size={32} className="animate-spin text-green-300"/>}
                  {phase==="speaking"&&<Volume2 size={32} className="text-green-300"/>}
                  {phase==="idle"&&<VeerIcon size={52}/>}
                </div>
              </div>
            </div>

            {/* Text display */}
            <div className="min-h-[72px] text-center mb-5 px-2">
              {transcript&&<p className="text-white/50 text-sm mb-1.5">"{transcript}"</p>}
              {lastReply&&phase!=="thinking"&&(
                <p className="text-white font-medium text-[0.95rem] leading-relaxed">{lastReply}</p>
              )}
              {phase==="thinking"&&<p className="text-green-300/70 text-sm">Thinking…</p>}
              {error&&<p className="text-red-400 text-sm">{error}</p>}
              {!lastReply&&!error&&phase==="idle"&&!transcript&&(
                <p className="text-green-300/60 text-sm">Tap the mic and ask me anything about diet or exercise!</p>
              )}
            </div>

            {/* Mic / Stop button */}
            <div className="flex justify-center mb-3">
              {phase==="listening"?(
                <button onClick={stopListening}
                  className="w-18 h-18 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                  style={{width:72,height:72,background:"linear-gradient(135deg,#EF4444,#DC2626)",
                    boxShadow:"0 6px 24px rgba(239,68,68,0.55)"}}>
                  <MicOff size={28} className="text-white"/>
                </button>
              ):(
                <button
                  disabled={phase==="thinking"||phase==="speaking"||promptsLeft<=0}
                  onClick={startListening}
                  className="rounded-full flex items-center justify-center active:scale-95 transition-all disabled:opacity-40"
                  style={{width:72,height:72,
                    background:promptsLeft<=0?"#374151":"linear-gradient(135deg,#2563EB,#1D4ED8)",
                    boxShadow:"0 6px 24px rgba(37,99,235,0.5)"}}>
                  <Mic size={28} className="text-white"/>
                </button>
              )}
            </div>

            {promptsLeft<=0&&(
              <p className="text-center text-white/40 text-xs">
                10/10 questions used. <span className="text-green-300 underline cursor-pointer">Sign up</span> for unlimited Veer access.
              </p>
            )}
            <p className="text-center text-white/25 text-[10px] mt-3">
              Only answers diet & exercise questions. Max 10 free questions.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Dash({session,plan,tracking,lang,onUpdate,onSwap,onLogout,onDeleteAccount,onRecalc}:{
  session:Session;plan:Plan|null;tracking:Tracking;lang:Lang;
  onUpdate:(t:Tracking)=>void;onSwap:(day:DayName,mealIdx:number)=>void;onLogout:()=>void;onDeleteAccount:()=>void;onRecalc:(activity?:string,overrideWeight?:number)=>void;
}) {
  const t=makeT(lang);
  const today=WEEK[(new Date().getDay()+6)%7];
  const [sel,setSel]=useState<DayName>(today);
  const [recipeFor,setRecipeFor]=useState<string|null>(null);
  const dd=(tracking[sel] as DayTracking)||{meals:{},water:0};
  const dp=plan?.days?.find(d=>d.day===sel);
  const cal=plan?.dailyCalories||0;
  const toggle=(i:number)=>{
    const nowTs=new Date().toISOString();
    const prevOn=!!dd.meals[i];
    const newMeals={...dd.meals,[i]:!prevOn};
    const prevTimes=((tracking.mealTimes||{})[sel]||{}) as Record<string,string>;
    const newTimes={...prevTimes,...(!prevOn?{[String(i)]:nowTs}:{})};
    onUpdate({...tracking,[sel]:{...dd,meals:newMeals},mealTimes:{...(tracking.mealTimes||{}),[sel]:newTimes}});
  };
  const setWater=(n:number)=>onUpdate({...tracking,[sel]:{...dd,water:n}});
  const logW=(w:number)=>{
    const newTracking={...tracking,weights:{...(tracking.weights||{}),[isoDate()]:w}} as Tracking;
    onUpdate(newTracking);
    onRecalc(undefined, w);  // pass weight directly — avoids React stale-closure bug
  };
  const planConsumed=dp?dp.meals.reduce((a,m,i)=>a+(dd.meals[i]?m.cal:0),0):0;
  const diaryTotal=(dd.log||[]).reduce((s,x)=>s+x.cal,0);
  const consumed=planConsumed+diaryTotal;
  const proteinFromPlan=dp?dp.meals.reduce((a,m,i)=>a+(dd.meals[i]?(m.p||0):0),0):0;
  const proteinFromDiary=(dd.log||[]).reduce((s,x)=>s+(x.p||0),0);
  const proteinConsumed=proteinFromPlan+proteinFromDiary;
  const proteinTarget=plan?.proteinTarget||0;
  const doneCount=dp?dp.meals.filter((_,i)=>dd.meals[i]).length:0;

  const history=tracking.history||{};
  const proteinTargetVal=proteinTarget;

  /* Compute TODAY's snapshot (date-keyed) and persist it for streaks/trends. */
  const todayPlan=plan?.days?.find(d=>d.day===today);
  const todayTrack=(tracking[today] as DayTracking)||{meals:{},water:0};
  const todayPlanCal=todayPlan?todayPlan.meals.reduce((a,m,i)=>a+(todayTrack.meals[i]?m.cal:0),0):0;
  const todayDiaryCal=(todayTrack.log||[]).reduce((s,x)=>s+x.cal,0);
  const todayCal=todayPlanCal+todayDiaryCal;
  const todayProtein=(todayPlan?todayPlan.meals.reduce((a,m,i)=>a+(todayTrack.meals[i]?(m.p||0):0),0):0)
    +(todayTrack.log||[]).reduce((s,x)=>s+(x.p||0),0);
  const todayMeals=todayPlan?todayPlan.meals.filter((_,i)=>todayTrack.meals[i]).length:0;
  const todayTotal=todayPlan?.meals.length||0;
  const todayOnTrack=dayOnTrack(todayMeals,todayTotal,todayDiaryCal);

  useEffect(()=>{
    const iso=isoDate();
    const entry:HistEntry={onTrack:todayOnTrack,cal:todayCal,protein:todayProtein,meals:todayMeals,total:todayTotal,water:todayTrack.water||0};
    const prev=history[iso];
    if (!prev||prev.onTrack!==entry.onTrack||prev.cal!==entry.cal||prev.protein!==entry.protein||prev.water!==entry.water){
      onUpdate({...tracking,history:{...history,[iso]:entry}});
    }
    /* eslint-disable-next-line */
  },[todayCal,todayProtein,todayOnTrack,todayTrack.water]);

  const streak=currentStreak({...history,[isoDate()]:{onTrack:todayOnTrack,cal:todayCal,protein:todayProtein,meals:todayMeals,total:todayTotal,water:todayTrack.water||0}});
  const points=totalPoints(history);

  const joined=tracking.joinedChallenges||[];
  const toggleChallenge=(id:string)=>onUpdate({...tracking,joinedChallenges:joined.includes(id)?joined.filter(x=>x!==id):[...joined,id]});
  const saveCustom=(f:LogFood)=>onUpdate({...tracking,customFoods:[...(tracking.customFoods||[]),f]});

  /* ── Set joinDate on first history entry ── */
  useEffect(()=>{
    if(!tracking.joinDate&&Object.keys(history).length>0){
      const earliest=Object.keys(history).sort()[0];
      onUpdate({...tracking,joinDate:earliest});
    }
    /* eslint-disable-next-line */
  },[Object.keys(history).length]);

  const joinDate=tracking.joinDate||isoDate();
  const daysActive=Math.max(1,Math.floor((Date.now()-new Date(joinDate).getTime())/86400000)+1);

  /* ── Nudge banner: show if nothing logged today and not dismissed ── */
  const nudgeDismissKey=`eatbc:nudgeDismissed:${isoDate()}`;
  const [nudgeDismissed,setNudgeDismissed]=useState(()=>!!sget<boolean>(nudgeDismissKey));
  const showNudge=!nudgeDismissed&&todayMeals===0&&todayDiaryCal===0;
  function dismissNudge(){sset(nudgeDismissKey,true);setNudgeDismissed(true);}

  /* ── Streak risk warning: streak > 0, nothing logged, hour >= 18 ── */
  const hour=new Date().getHours();
  const showStreakRisk=streak>0&&todayMeals===0&&todayDiaryCal===0&&hour>=18;

  /* ── Weekly review: show on Monday if not shown this week ── */
  const isMonday=new Date().getDay()===1;
  const weekKey=`eatbc:weekReview:${isoDate().slice(0,8)}`;
  const [showWeeklyReview,setShowWeeklyReview]=useState(()=>isMonday&&!sget<boolean>(weekKey)&&Object.keys(tracking.history||{}).length>=5);
  function closeWeeklyReview(){sset(weekKey,true);setShowWeeklyReview(false);}

  /* ── Retire toast from swap ── */
  const [retireToast,setRetireToast]=useState<string|null>(tracking.lastRetired||null);
  useEffect(()=>{
    if(tracking.lastRetired&&tracking.lastRetired!==retireToast){setRetireToast(tracking.lastRetired);}
    /* eslint-disable-next-line */
  },[tracking.lastRetired]);
  useEffect(()=>{
    if(retireToast){const tm=setTimeout(()=>setRetireToast(null),4000);return()=>clearTimeout(tm);}
    return undefined;
  },[retireToast]);

  /* ── Delete account state ── */
  const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);
  const [deleteLoading,setDeleteLoading]=useState(false);

  const [tab,setTab]=useState<"today"|"train"|"progress"|"community">("today");
  const hasWorkout=!!plan?.workout;
  const TABS:[typeof tab,string,React.ElementType][]=[
    ["today","Today",Utensils],
    ...(hasWorkout?[["train","Train",Dumbbell] as [typeof tab,string,React.ElementType]]:[]),
    ["progress","Progress",BarChart3],["community",t("community"),Users],
  ];

  return (
    <>
    <Shell wide>
      <div style={{animation:"eFade .4s ease both"}}>
        <div className="rounded-3xl p-6 text-white shadow-lg mb-4"
          style={{background:"linear-gradient(135deg,#1DAA61 0%,#0E8A4D 60%,#0B6E40 100%)"}}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3"><Logo size={26}/><span className="font-bold text-sm">EatBC</span></div>
              <h2 className="text-2xl font-black">Hi {session.name}</h2>
              <p className="text-white/70 text-sm">{session.id}</p>
              <div className="flex gap-4 mt-4">
                <div><div className="text-2xl font-bold flex items-center gap-1"><Flame size={20}/>{streak}</div><div className="text-white/70 text-xs">{t("perfectDays")}</div></div>
                <div><div className="text-2xl font-bold">{doneCount}/{dp?.meals.length||0}</div><div className="text-white/70 text-xs">{t("todaysMeals")}</div></div>
                {proteinTargetVal>0&&<div><div className="text-2xl font-bold">{proteinConsumed}<span className="text-base font-normal text-white/60">/{proteinTargetVal}g</span></div><div className="text-white/70 text-xs">{t("protein")}</div></div>}
              </div>
              {proteinTargetVal>0&&(
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>{t("proteinTarget")}</span><span>{Math.round(Math.min(proteinConsumed/proteinTargetVal,1)*100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{background:"rgba(255,255,255,0.2)"}}>
                    <div className="h-1.5 rounded-full transition-all duration-700" style={{width:`${Math.min(proteinConsumed/proteinTargetVal,1)*100}%`,background:"#86efac"}}/>
                  </div>
                </div>
              )}
            </div>
            <CalRing pct={cal?consumed/cal:0} big={consumed} small={`/ ${cal}`} size={104}/>
          </div>
          {showStreakRisk&&(
            <div className="mt-3 rounded-xl px-3 py-2 text-sm font-semibold flex items-center gap-2"
              style={{background:"rgba(251,191,36,0.2)",color:"#fef08a"}}>
              <Bell size={14}/> {t("streakRisk")}
            </div>
          )}
          <div className="flex items-center gap-4 mt-4">
            <button onClick={onLogout} className="text-white/80 inline-flex items-center gap-1 text-sm hover:text-white">
              <LogOut size={15}/> {t("logout")}
            </button>
            <button onClick={()=>setShowDeleteConfirm(true)} className="text-red-300/70 inline-flex items-center gap-1 text-xs hover:text-red-200">
              <X size={13}/> {t("deleteAccount")}
            </button>
          </div>
        </div>

        {/* Nudge banner */}
        {showNudge&&(
          <div className="rounded-2xl px-4 py-3 mb-3 flex items-center gap-3"
            style={{background:"#FFFBEB",border:"1px solid #FDE68A"}}>
            <Bell size={16} className="text-amber-500 shrink-0"/>
            <span className="text-sm text-amber-800 flex-1">{t("nudgeLog")}</span>
            <button onClick={dismissNudge} className="text-amber-400 hover:text-amber-600"><X size={16}/></button>
          </div>
        )}

        {/* Section tabs */}
        <div className="flex gap-2 mb-4 bg-white rounded-2xl p-1 border border-gray-100">
          {TABS.map(([id,label,Icon])=>(
            <button key={id} onClick={()=>setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition ${tab===id?"text-white shadow":"text-gray-500"}`}
              style={tab===id?{background:GREEN}:{}}>
              <Icon size={15}/> {label}
            </button>
          ))}
        </div>

        {tab==="today"&&(
          <>
            <AdaptiveRecalcBanner
              weights={tracking.weights||{}}
              lastRecalcDate={tracking.lastRecalcDate}
              lastRecalcWeight={tracking.lastRecalcWeight}
              goal={plan?.goal||""}
              onRecalc={onRecalc}
            />
            <DietitianCard condition={plan?.condition||""} t={t}/>
            <ProgressionTracker daysActive={daysActive} t={t}/>
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
                  <h3 className="font-bold text-gray-800 mb-3">{sel} — {t("tickOff")}</h3>
                  <div className="space-y-1">
                    {dp.meals.map((m,i)=>{
                      const ui=MEAL_UI[m.time]||MEAL_UI["Lunch"];
                      const on=!!dd.meals[i];
                      return (
                        <div key={i} className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition">
                          <button onClick={()=>toggle(i)} className="shrink-0"><CheckCircle2 size={24} style={{color:on?GREEN:"#E5E7EB"}}/></button>
                          <button onClick={()=>toggle(i)} className="flex-1 min-w-0 text-left">
                            <span className="text-xs font-semibold uppercase tracking-wide" style={{color:ui.col}}>{m.time}</span>
                            <div className={`text-sm font-medium truncate ${on?"line-through text-gray-300":"text-gray-700"}`}>{m.food}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Scale size={10} className="text-gray-400 shrink-0"/>
                              <span className="text-xs text-gray-400 truncate">{m.qty}</span>
                            </div>
                          </button>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-xs font-semibold" style={{color:GREEN}}>{m.cal}</span>
                            <div className="flex gap-1.5">
                              {RECIPE_DB[m.food]&&(
                                <button onClick={()=>setRecipeFor(m.food)} title="View recipe"
                                  className="text-gray-300 hover:text-green-600 transition"><ChefHat size={14}/></button>
                              )}
                              <button onClick={()=>onSwap(sel,i)} title={t("swap")}
                                className="text-gray-300 hover:text-green-600 transition"><RefreshCw size={14}/></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <FoodLogger
                  log={dd.log||[]}
                  customFoods={tracking.customFoods||[]}
                  onSaveCustom={saveCustom}
                  onUpdate={l=>onUpdate({...tracking,[sel]:{...dd,log:l}})}
                  t={t}
                  diet={plan?.diet}
                />
                <Card className="p-5 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Droplet size={18} style={{color:GREEN}}/> {t("water")}</h3>
                    <span className="text-sm text-gray-400">{dd.water}/8 glasses</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[...Array(8)].map((_,i)=>(
                      <button key={i} onClick={()=>setWater(i+1===dd.water?i:i+1)}
                        className="flex-1 h-9 rounded-lg transition" style={{background:i<dd.water?GREEN:"#E5E7EB"}}/>
                    ))}
                  </div>
                </Card>
              </>
            ):(
              <Card className="p-8 text-center text-gray-400">No plan loaded for this session.</Card>
            )}
          </>
        )}

        {tab==="train"&&plan?.workout&&(
          <WorkoutTab workout={plan.workout} tracking={tracking} onUpdate={onUpdate}/>
        )}

        {tab==="progress"&&(
          <>
            <TrendsCard history={history} calTarget={cal} proteinTarget={proteinTargetVal} weights={tracking.weights||{}} t={t}/>
            <EatingWindowCard mealTimes={tracking.mealTimes||{}} today={today}/>
            <InsightsCard history={history} proteinTarget={proteinTargetVal} t={t}/>
            <WeightLog t={tracking} onLog={logW}/>
            <div className="mb-4"/>
            <ReminderToggle t={t}/>
          </>
        )}

        {tab==="community"&&(
          <>
            <Leaderboard session={session} points={points} streak={streak} t={t}/>
            <ChallengesCard history={history} joined={joined} onToggle={toggleChallenge} t={t}/>
          </>
        )}
      </div>
      {recipeFor&&<RecipeSheet name={recipeFor} onClose={()=>setRecipeFor(null)}/>}

      {/* Weekly review modal */}
      {showWeeklyReview&&<WeeklyReviewCard history={history} weights={tracking.weights||{}} onClose={closeWeeklyReview}/>}

      {/* Retire toast */}
      {retireToast&&(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-5 py-3 shadow-lg text-sm font-semibold text-white flex items-center gap-2"
          style={{background:"#1DAA61",animation:"eFade .3s ease both"}}>
          <CheckCircle2 size={16}/> {t("retiredFood")}
        </div>
      )}

      {/* Delete confirm modal */}
      {showDeleteConfirm&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}}>
          <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl bg-white" style={{animation:"eFade .3s ease both"}}>
            <div className="flex items-center gap-2 mb-3"><AlertCircle size={22} className="text-red-500 shrink-0"/><h3 className="font-black text-gray-800">{t("deleteAccount")}</h3></div>
            <p className="text-sm text-gray-500 mb-5">{t("deleteConfirm")}</p>
            <div className="flex gap-3">
              <button onClick={()=>setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm">
                {t("deleteCancel")}
              </button>
              <button disabled={deleteLoading} onClick={async()=>{
                setDeleteLoading(true);
                await onDeleteAccount();
                setDeleteLoading(false);
                setShowDeleteConfirm(false);
              }} className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm disabled:opacity-50" style={{background:"#DC2626"}}>
                {deleteLoading?<Loader2 className="animate-spin mx-auto" size={18}/>:t("deleteYes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
    <VeerBot session={session} planCondition={plan?.condition||""}/>
    </>
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
  const [lang,setLang]=useState<Lang>(()=>(sget<Lang>("eatbc:lang")||"en"));
  const [qErr,setQErr]=useState("");
  const t=makeT(lang);
  const quoteRef=useRef(pickQuote());

  function changeLang(l:Lang){ setLang(l); sset("eatbc:lang",l); }

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

  /* Active question list respects conditional questions (workout branch). */
  const activeQ=Q.filter(q=>!q.showIf||q.showIf(profile));
  const stepClamped=Math.min(step,activeQ.length-1);
  const cur=activeQ[stepClamped];
  const setVal=(v:string|string[])=>{
    setQErr("");
    // region is stored as string[] but the quiz uses type:"pick" (returns string)
    const val = cur.k==="region" && typeof v==="string" ? [v] : v;
    setProfile(p=>({...p,[cur.k]:val}));
  };
  const toggleMulti=(o:string)=>setProfile(p=>{
    const a=(p[cur.k] as string[])||[];
    return {...p,[cur.k]:a.includes(o)?a.filter(x=>x!==o):[...a,o]};
  });
  const canNext=!cur?false
    :cur.type==="multi"?((profile[cur.k] as string[]|undefined)||[]).length>0
    :cur.type==="height"?(profile.heightFt??"")!==""
    :cur.k==="avoid"?true
    :(profile[cur.k]||"")!=="";

  function nextStep() {
    setQErr("");
    const v = profile[cur.k];
    if (cur.type === "number") {
      const n = Number(v);
      if (!v || isNaN(n) || String(v).trim()==="") { setQErr("Please enter a valid number."); return; }
      if (cur.k === "age") {
        if (n < 10)  { setQErr("EatBC is designed for ages 10 and above. Please enter your real age."); return; }
        if (n > 100) { setQErr("Please double-check — did you enter the right age? Max supported is 100."); return; }
      }
      if (cur.k === "weight") {
        if (n <= 0)  { setQErr("Weight must be a positive number in kg (e.g. 68)."); return; }
        if (n < 25)  {
          const lbsGuess = Math.round(n * 2.205);
          const kgGuess  = Math.round(n / 0.453592);
          setQErr(`${n} kg seems very low. If you meant ${lbsGuess} lbs, that's ${Math.round(n / 0.453592)} kg — but more likely you meant ${n} kg as ${lbsGuess} lbs. Enter in kg (e.g. ${kgGuess > 25 ? kgGuess : 65}).`);
          return;
        }
        if (n > 250) { setQErr(`${n} kg is higher than our supported range (max 250 kg). Please double-check — enter in kg, not pounds or grams.`); return; }
      }
      if (cur.k === "target") {
        if (n <= 0)  { setQErr("Target weight must be a positive number in kg."); return; }
        if (n < 30)  { setQErr("A healthy target weight is at least 30 kg. Please adjust your goal."); return; }
        if (n > 250) { setQErr("Target weight above 250 kg is not supported. Please enter a realistic goal."); return; }
        const cw = Number(profile.weight || 0);
        if (cw > 0 && Math.abs(n - cw) > 80) {
          const dir = n < cw ? "lose" : "gain";
          setQErr(`A ${Math.round(Math.abs(n-cw))} kg ${dir} target is very ambitious. Consider a closer milestone first — you can always update it later.`);
          return;
        }
      }
    }
    if (cur.type === "height") {
      const ft  = Number(profile.heightFt);
      const ins = Number(profile.heightIn ?? 0);
      if (!profile.heightFt || isNaN(ft)) { setQErr("Please enter your height in feet (e.g. 5)."); return; }
      if (ft < 4) { setQErr(`${ft} feet seems too short. Enter feet only — e.g. type "5" for 5 feet, not your height in cm.`); return; }
      if (ft > 7 || (ft === 7 && ins > 6)) { setQErr("Heights above 7'6\" are unusual. Please double-check your entry."); return; }
      if (isNaN(ins) || ins < 0 || ins > 11) { setQErr("Inches must be between 0 and 11."); return; }
    }
    setStep(stepClamped + 1);
  }

  /* Quiz done → play the food-picking game first, then build the plan. */
  function generate() {
    setErr(""); setScreen("foodgame");
  }
  function finishGame(picks:string[]) {
    const withPicks={...profile,foodPicks:picks};
    setProfile(withPicks);
    setLoading(true);
    setTimeout(()=>{
      try{setPlan(buildPlan(withPicks));setScreen("plan");}
      catch{setErr("Something went off — adjust an answer and retry.");setScreen("quiz");}
      setLoading(false);
    },500);
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

  /* Swap a meal; track counts — retire food after 3 swaps so it never returns. */
  function swapMeal(day:DayName,mealIdx:number) {
    if(!plan) return;
    const di=plan.days.findIndex(d=>d.day===day);
    if(di<0) return;
    const meal=plan.days[di].meals[mealIdx];
    const swapCounts={...(tracking.swapCounts||{})};
    swapCounts[meal.food]=(swapCounts[meal.food]||0)+1;
    /* Build avoid list: foods swapped 3+ times */
    const autoAvoid=[...new Set([...(profile.foodAvoid||[]),...Object.entries(swapCounts).filter(([,n])=>n>=3).map(([f])=>f)])];
    const retired=swapCounts[meal.food]>=3?meal.food:undefined;

    const code=LABEL2SLOT[meal.time]||"l";
    const cands=DB.filter(f=>
      f.slot.includes(code)&&dietOK(f,plan.diet)&&f.n!==meal.food&&!autoAvoid.includes(f.n)
    );
    if(!cands.length) return;
    cands.sort((a,b)=>Math.abs(a.c-meal.cal)-Math.abs(b.c-meal.cal));
    const pick=cands[Math.floor(Math.random()*Math.min(5,cands.length))];
    const newMeal:Meal={time:meal.time,food:pick.n,cal:pick.c,p:pick.p||0,qty:pick.q};
    const newDays=plan.days.map((d,idx)=>idx===di?{...d,meals:d.meals.map((m,j)=>j===mealIdx?newMeal:m)}:d);
    const newPlan={...plan,days:newDays};
    const newTracking:Tracking={...tracking,swapCounts,...(retired?{lastRetired:retired}:{})};
    setPlan(newPlan);
    setTracking(newTracking);
    setProfile(p=>({...p,foodAvoid:autoAvoid}));
    if(session?.token){
      apiPost("/api/plan",{plan:newPlan},session.token).catch(()=>{});
      apiPost("/api/tracking",{tracking:newTracking},session.token).catch(()=>{});
    }
  }

  async function deleteAccount() {
    const token=session?.token;
    if(token) await apiPost("/api/delete",{},token).catch(()=>{});
    ["eatbc:session","eatbc:onboarded","eatbc:lang"].forEach(k=>sdel(k));
    setSession(null); setScreen("welcome");
    setStep(0); setProfile({region:[]}); setPlan(null); setTracking({});
    quoteRef.current=pickQuote();
  }

  function recalcPlan(activity?: string, overrideWeight?: number) {
    if (!plan) return;
    let newWeight: number;
    if (overrideWeight !== undefined) {
      newWeight = overrideWeight;
    } else {
      const wEntries = Object.entries(tracking.weights||{}).sort();
      if (!wEntries.length) return;
      newWeight = wEntries[wEntries.length-1][1];
    }
    const effectiveActivity = activity || profile.activity;
    const newProfile = {...profile, weight: String(newWeight), ...(effectiveActivity ? {activity: effectiveActivity} : {})};
    try {
      const newPlan = buildPlan(newProfile);
      const newTracking:Tracking = {
        ...tracking,
        lastRecalcDate: isoDate(),
        lastRecalcWeight: newWeight,
      };
      setProfile(newProfile);
      setPlan(newPlan);
      setTracking(newTracking);
      if (session?.token) {
        apiPost("/api/plan", {plan:newPlan, profile:newProfile}, session.token).catch(()=>{});
        apiPost("/api/tracking", {tracking:newTracking}, session.token).catch(()=>{});
      }
    } catch {}
  }

  function doneOnboarding(){sset("eatbc:onboarded",true);setScreen("welcome");}

  /* ── screens ── */
  if (screen==="onboarding") return <Onboarding onDone={doneOnboarding}/>;
  if (screen==="welcome") return <Welcome lang={lang} onLang={changeLang} onNew={()=>setScreen("quiz")} onLogin={()=>setScreen("login")}/>;
  if (screen==="login")   return <Login onDone={doLogin} onBack={()=>setScreen("welcome")}/>;
  if (screen==="foodgame") return <FoodGame name={profile.name} onDone={finishGame}/>;

  if (screen==="quiz") return (
    <Shell>
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6"><Logo size={28}/><span className="font-bold text-gray-700">EatBC</span></div>
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{t("question")} {stepClamped+1} {t("of")} {activeQ.length}</span><span>{Math.round(((stepClamped+1)/activeQ.length)*100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 rounded-full transition-all" style={{width:`${((stepClamped+1)/activeQ.length)*100}%`,background:GREEN}}/>
          </div>
        </div>
        {stepClamped>=5&&<QuizTeaser profile={profile}/>}
        <h2 className="text-2xl font-bold text-gray-800">{cur.label}</h2>
        {(cur.subFn?.(profile)||cur.sub)&&<p className="text-sm text-gray-400 mt-1 mb-4">{cur.subFn?.(profile)||cur.sub}</p>}
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
                <input type="number" value={profile.heightFt||""} onChange={e=>{setQErr("");setProfile(p=>({...p,heightFt:e.target.value}));}}
                  placeholder="5" className="w-full mt-1 px-4 py-3.5 rounded-2xl border-2 border-gray-200 outline-none focus:border-green-500 text-lg" autoFocus/>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400">Inches</label>
                <input type="number" value={profile.heightIn||""} onChange={e=>{setQErr("");setProfile(p=>({...p,heightIn:e.target.value}));}}
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
        {(qErr||err)&&<div className="mt-4 flex items-center gap-2 text-red-500 text-sm"><AlertCircle size={16}/>{qErr||err}</div>}
        <div className="flex justify-between mt-8">
          <button onClick={()=>{setQErr("");stepClamped>0?setStep(stepClamped-1):setScreen("welcome");}}
            className="px-5 py-2.5 text-gray-500 font-medium">{t("back")}</button>
          {stepClamped<activeQ.length-1?(
            <button disabled={!canNext} onClick={nextStep}
              className="px-7 py-2.5 rounded-2xl text-white font-semibold disabled:opacity-40 inline-flex items-center gap-1 shadow-md"
              style={{background:GREEN}}>
              {t("next")} <ChevronRight size={16}/>
            </button>
          ):(
            <button disabled={loading||!canNext} onClick={generate}
              className="px-7 py-2.5 rounded-2xl text-white font-semibold disabled:opacity-60 inline-flex items-center gap-2 shadow-md"
              style={{background:GREEN}}>
              {loading?<><Loader2 className="animate-spin" size={16}/>{t("building")}</>:<>{t("buildPlan")} <Sparkles size={16}/></>}
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
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={plan.weeklyLoss.includes("gain") && plan.goal === "Weight loss"
                    ? {background:"#FFF7ED", color:"#C2410C"}
                    : {background:"rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.85)"}}>
                  <TrendingDown size={13}/>
                  <span>Expected: {plan.weeklyLoss}</span>
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
          <Chip label="Daily target" val={`${plan.dailyCalories} kcal`} accent/>
          <Chip label="Maintenance" val={`${plan.maintenanceCalories} kcal`}/>
          <Chip label="Diet" val={plan.diet}/>
        </div>

        <PlanWeek plan={plan}/>

        {plan.workout&&(
          <div className="rounded-3xl p-5 mb-5 text-white shadow-lg"
            style={{background:"linear-gradient(135deg,#5B21B6 0%,#7C3AED 60%,#9333EA 100%)"}}>
            <div className="flex items-center gap-2 mb-3"><Dumbbell size={18}/><h3 className="font-black">Your workout plan</h3></div>
            <p className="text-white/80 text-sm mb-3">{plan.workout.focus} · {plan.workout.place} · {plan.workout.daysPerWeek} days/week. Track it live on your dashboard.</p>
            <div className="grid grid-cols-2 gap-2">
              {plan.workout.days.slice(0,4).map((d,i)=>(
                <div key={i} className="bg-white/10 rounded-2xl px-3 py-2.5 border border-white/15">
                  <div className="font-bold text-sm">{d.label}</div>
                  <div className="text-white/70 text-[11px]">{d.items.length} exercises · {d.focus}</div>
                </div>
              ))}
            </div>
            {plan.workout.days.length>4&&<p className="text-white/60 text-xs mt-2">+ {plan.workout.days.length-4} more sessions inside</p>}
          </div>
        )}

        <div className="rounded-3xl p-5 mb-5" style={{background:"linear-gradient(135deg,#F0FAF4,#E7F7EF)"}}>
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{color:GREEN}}>
            <Sparkles size={18}/> {t("coachTips")}
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
            Accept the Challenge <ChevronRight size={20}/>
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
    <Dash session={session} plan={plan} tracking={tracking} lang={lang}
      onUpdate={(tr)=>{setTracking(tr);if(session?.token)apiPost("/api/tracking",{tracking:tr},session.token).catch(()=>{});}}
      onSwap={swapMeal}
      onLogout={logout}
      onDeleteAccount={deleteAccount}
      onRecalc={(activity?:string,w?:number)=>recalcPlan(activity,w)}/>
  );

  return <Shell><Card className="p-10 text-center text-gray-400">Loading…</Card></Shell>;
}
