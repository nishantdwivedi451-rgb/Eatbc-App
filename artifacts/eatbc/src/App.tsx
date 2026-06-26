import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Utensils, Share2, Mail,
  CheckCircle2, Droplet, LogOut, TrendingDown, Loader2,
  AlertCircle, Sunrise, Apple, Cookie, Moon, HeartPulse,
  Sparkles, Stethoscope, User, UserPlus, ArrowRight, Scale,
  Flame, BarChart3, Trophy, Users, Bell, Plus, RefreshCw,
  Lightbulb, Globe, X, Check, Target, Dumbbell, CalendarDays, Clock, BookOpen, ChefHat,
  Camera, Lock, Zap, Star,
  Search, ClipboardList, ChevronLeft,
  Paperclip, Send, FileText,
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
interface ExerciseLog { n: string; sets: number; reps: string; cat: string; ts: string; weight?: number; weightLabel?: string; cal?: number; }
interface DayTracking { meals: Record<number, boolean>; water: number; log?: FoodLog[]; cheatLog?: FoodLog[]; }
/* Date-keyed daily snapshot — powers real streaks, trends and insights. */
interface HistEntry { onTrack: boolean; cal: number; protein: number; meals: number; total: number; water: number; }
interface Tracking {
  [day: string]: DayTracking | Record<string, number> | Record<string, HistEntry> | Record<string, boolean> | Record<string, number[]> | Record<string, Record<string, string>> | Record<string, ExerciseLog[]> | LogFood[] | string[] | string | number | undefined;
  weights?: Record<string, number>;
  history?: Record<string, HistEntry>;
  customFoods?: LogFood[];     // user-saved foods
  joinedChallenges?: string[]; // challenge ids the user opted into
  workouts?: Record<string, boolean>;   // date → workout session completed
  workoutSets?: Record<string, number[]>; // date → completed exercise indices
  workoutLog?: Record<string, ExerciseLog[]>; // date → manually logged exercises
  lang?: string;
  swapCounts?: Record<string, number>;  // food name → times swapped out
  lastRetired?: string;                 // last food name retired from plan
  mealTimes?: Record<string, Record<string, string>>;  // day -> "mealIdx" -> ISO timestamp
  joinDate?: string;            // ISO date of first tracked day
  lastRecalcDate?: string;      // ISO date when plan was last recalculated
  lastRecalcWeight?: number;    // weight (kg) at last recalc
}
type Screen = "welcome" | "quiz" | "foodgame" | "plan" | "login" | "signup" | "dash" | "onboarding" | "intro" | "quote";

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
  { k:"sex",       label:"Gender",                                      type:"pick",   opts:["Male","Female","Non-binary","Transgender","Gender fluid","Prefer not to say"] },
  { k:"heightFt",  label:"Your height",                                 type:"height" },
  { k:"goal",      label:"Your primary goal",                           type:"pick",   opts:["Weight loss","Muscle gain","Weight gain","Maintain weight","General fitness"] },
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
  { k:"condition", label:"Any health condition we should know about?",  type:"pick",
    opts:["None","Diabetes / pre-diabetes","High BP (hypertension)","High cholesterol","Thyroid (hypothyroid)","PCOS / PCOD","Pregnant","Breastfeeding","Other"] },
  { k:"diet",      label:"Your food preference",                        type:"pick",   opts:["Pure veg","Egg + veg","Non-veg","Vegan","Jain"] },
  { k:"activity",  label:"How active is your daily life?",              type:"pick",
    sub:"Think work, commute and chores — not gym or sport.",
    opts:["Mostly desk job","On feet / moderate","Physically active"] },
  { k:"weekend",   label:"What's your typical weekend like?",           type:"multi",
    sub:"Pick all that apply — we'll adjust your weekend calorie targets to match.",
    opts:["Rest & recovery","Run club / group fitness","Coffee rave / morning run","Hiking / outdoor sports","Social eating out","Travel / exploring","Home cooking & meal prep","Houseparty / clubbing / drinking"] },
  { k:"region",    label:"Which cuisines do you enjoy?",                type:"multi",
    sub:"Pick all that apply — we'll mix these into your meal plan.",
    opts:["North Indian","South Indian","Continental","Mediterranean","East Asian","Middle Eastern","Mexican","Keto","High-Protein","Plant-Based","Intermittent Fasting"] },
  { k:"wantWorkout", label:"Want a workout plan with your diet?",        type:"pick",
    sub:"We'll build a weekly training schedule with a tracker.",
    opts:["Yes, build my workout plan","No thanks, just the diet"] },
  { k:"exercise",  label:"How do you like to exercise?",                type:"pick",
    sub:"Pick whatever fits your lifestyle — we'll build around it.",
    opts:["Running / jogging","HYROX","Gym (weights)","Home workouts","Yoga","Pilates","Cycling","Swimming","Sports / games","HIIT / CrossFit"],
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
  {n:"Nimbu pani (lemonade)",p:0, c:60, q:"1 glass (250ml)",cat:"Beverages"},
  {n:"Aam panna",p:0, c:90, q:"1 glass (250ml)",cat:"Beverages"},
  {n:"Jaljeera",p:0, c:40, q:"1 glass (200ml)",cat:"Beverages"},
  {n:"Coconut milk",p:2, c:140,q:"½ cup (100ml)",cat:"Beverages"},
  {n:"Turmeric latte (golden milk)",p:4, c:120,q:"1 cup (250ml)",cat:"Beverages"},
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
  /* Western Staples */
  {n:"Pasta (cooked)",p:7, c:220,q:"1 cup (140g)",cat:"Western Staples"},
  {n:"Spaghetti bolognese",p:20,c:420,q:"1 plate (300g)",cat:"Western Staples"},
  {n:"Mac and cheese",p:14,c:480,q:"1 cup (250g)",cat:"Western Staples"},
  {n:"Quinoa (cooked)",p:8, c:222,q:"1 cup (185g)",cat:"Western Staples"},
  {n:"White bread (2 slices)",p:4, c:140,q:"2 slices (60g)",cat:"Western Staples"},
  {n:"Sourdough bread (1 slice)",p:4, c:100,q:"1 slice (50g)",cat:"Western Staples"},
  {n:"Bagel (plain)",p:10,c:270,q:"1 medium (105g)",cat:"Western Staples"},
  {n:"Granola (dry)",p:5, c:230,q:"½ cup (60g)",cat:"Western Staples"},
  {n:"Corn flakes",p:3, c:150,q:"1 cup (30g)",cat:"Western Staples"},
  {n:"Muesli",p:6, c:200,q:"½ cup (60g)",cat:"Western Staples"},
  {n:"Pancakes (plain, 2)",p:7, c:320,q:"2 medium pancakes (100g)",cat:"Western Staples"},
  {n:"Waffles (2)",p:7, c:310,q:"2 waffles (130g)",cat:"Western Staples"},
  {n:"Croissant",p:6, c:270,q:"1 medium (60g)",cat:"Western Staples"},
  /* International Proteins */
  {n:"Salmon — baked/grilled",p:25,c:208,q:"100g",cat:"International Proteins"},
  {n:"Tuna — canned in water",p:25,c:116,q:"100g",cat:"International Proteins"},
  {n:"Beef steak (grilled)",p:26,c:250,q:"100g lean",cat:"International Proteins"},
  {n:"Ground beef (cooked)",p:26,c:218,q:"100g",cat:"International Proteins"},
  {n:"Turkey breast (grilled)",p:29,c:135,q:"100g",cat:"International Proteins"},
  {n:"Pork tenderloin",p:26,c:143,q:"100g",cat:"International Proteins"},
  {n:"Lamb chop",p:25,c:294,q:"100g",cat:"International Proteins"},
  {n:"Shrimp / prawns (boiled)",p:24,c:99,q:"100g",cat:"International Proteins"},
  {n:"Crab meat",p:19,c:97,q:"100g",cat:"International Proteins"},
  {n:"Tempeh",p:19,c:193,q:"100g",cat:"International Proteins"},
  {n:"Edamame",p:12,c:122,q:"½ cup (75g)",cat:"International Proteins"},
  {n:"Black beans (cooked)",p:15,c:227,q:"1 cup (172g)",cat:"International Proteins"},
  {n:"Lentils (cooked)",p:18,c:230,q:"1 cup (198g)",cat:"International Proteins"},
  /* Global Fruits */
  {n:"Strawberries",p:1, c:50,q:"1 cup (150g)",cat:"Global Fruits"},
  {n:"Blueberries",p:1, c:85,q:"1 cup (148g)",cat:"Global Fruits"},
  {n:"Mango (international variety)",p:1, c:100,q:"1 cup chunks (165g)",cat:"Global Fruits"},
  {n:"Avocado (half)",p:2, c:160,q:"½ medium avocado (100g)",cat:"Global Fruits"},
  {n:"Kiwi",p:1, c:61,q:"2 medium kiwis (150g)",cat:"Global Fruits"},
  {n:"Peach",p:1, c:59,q:"1 medium (150g)",cat:"Global Fruits"},
  {n:"Pear",p:0, c:101,q:"1 medium (178g)",cat:"Global Fruits"},
  {n:"Cherries",p:1, c:90,q:"1 cup (155g)",cat:"Global Fruits"},
  {n:"Raspberries",p:1, c:65,q:"1 cup (123g)",cat:"Global Fruits"},
  {n:"Mango (dried)",p:1, c:170,q:"¼ cup (40g)",cat:"Global Fruits"},
  {n:"Coconut flesh (fresh)",p:2, c:185,q:"½ cup (40g)",cat:"Global Fruits"},
  /* Beverages — Global */
  {n:"Espresso",p:0, c:5,q:"1 shot (30ml)",cat:"Beverages"},
  {n:"Cappuccino (whole milk)",p:5, c:120,q:"1 cup (240ml)",cat:"Beverages"},
  {n:"Latte (whole milk)",p:8, c:190,q:"1 cup (355ml)",cat:"Beverages"},
  {n:"Matcha latte (oat milk)",p:3, c:130,q:"1 cup (240ml)",cat:"Beverages"},
  {n:"Kombucha",p:0, c:60,q:"1 bottle (350ml)",cat:"Beverages"},
  {n:"Oat milk",p:3, c:120,q:"1 cup (240ml)",cat:"Beverages"},
  {n:"Almond milk (unsweetened)",p:1, c:30,q:"1 cup (240ml)",cat:"Beverages"},
  {n:"Energy drink (Red Bull can)",p:0, c:110,q:"250ml can",cat:"Beverages"},
  {n:"Energy drink (Monster 500ml)",p:1, c:225,q:"500ml can",cat:"Beverages"},
  {n:"Orange juice (fresh)",p:2, c:112,q:"1 cup (240ml)",cat:"Beverages"},
  {n:"Sports drink (Gatorade)",p:0, c:140,q:"1 bottle (500ml)",cat:"Beverages"},
  {n:"Cold brew coffee (black)",p:1, c:5,q:"1 cup (240ml)",cat:"Beverages"},
  {n:"Sparkling water",p:0, c:0,q:"1 bottle (500ml)",cat:"Beverages"},
  {n:"Iced tea (sweetened)",p:0, c:120,q:"1 cup (240ml)",cat:"Beverages"},
  /* World Cuisines */
  {n:"Sushi (salmon nigiri, 2 pcs)",p:12,c:130,q:"2 pieces (80g)",cat:"World Cuisines"},
  {n:"California roll (6 pcs)",p:9, c:255,q:"6 pieces (150g)",cat:"World Cuisines"},
  {n:"Ramen (chicken, bowl)",p:22,c:490,q:"1 bowl (450g)",cat:"World Cuisines"},
  {n:"Pho (beef, bowl)",p:25,c:350,q:"1 bowl (450ml)",cat:"World Cuisines"},
  {n:"Pad Thai (chicken)",p:20,c:400,q:"1 plate (300g)",cat:"World Cuisines"},
  {n:"Fried rice (Chinese, chicken)",p:18,c:380,q:"1 cup (200g)",cat:"World Cuisines"},
  {n:"Dim sum (har gau, 3 pcs)",p:9, c:120,q:"3 dumplings (90g)",cat:"World Cuisines"},
  {n:"Taco (beef, corn tortilla)",p:14,c:210,q:"1 taco (120g)",cat:"World Cuisines"},
  {n:"Burrito (chicken, full)",p:30,c:490,q:"1 burrito (350g)",cat:"World Cuisines"},
  {n:"Shawarma (chicken, wrap)",p:28,c:420,q:"1 wrap (280g)",cat:"World Cuisines"},
  {n:"Falafel (3 pcs)",p:8, c:190,q:"3 pieces (90g)",cat:"World Cuisines"},
  {n:"Hummus",p:5, c:110,q:"¼ cup (60g)",cat:"World Cuisines"},
  {n:"Greek salad",p:4, c:180,q:"1 bowl (200g)",cat:"World Cuisines"},
  {n:"Moussaka (1 serving)",p:18,c:430,q:"1 serving (300g)",cat:"World Cuisines"},
  {n:"Paella (seafood, 1 serving)",p:22,c:380,q:"1 serving (250g)",cat:"World Cuisines"},
  {n:"Tom yum soup",p:10,c:150,q:"1 bowl (300ml)",cat:"World Cuisines"},
  {n:"Bibimbap (Korean rice bowl)",p:20,c:430,q:"1 bowl (400g)",cat:"World Cuisines"},
  {n:"Kimchi",p:2, c:23,q:"½ cup (75g)",cat:"World Cuisines"},
  /* Fast Food */
  {n:"Big Mac",p:25,c:550,q:"1 burger",cat:"Fast Food"},
  {n:"McChicken",p:20,c:400,q:"1 burger",cat:"Fast Food"},
  {n:"Quarter Pounder with cheese",p:30,c:520,q:"1 burger",cat:"Fast Food"},
  {n:"KFC Original (1 pc)",p:22,c:290,q:"1 drumstick+thigh",cat:"Fast Food"},
  {n:"KFC Zinger Burger",p:26,c:450,q:"1 burger",cat:"Fast Food"},
  {n:"Subway 6\" Chicken (wheat)",p:23,c:310,q:"6-inch sub",cat:"Fast Food"},
  {n:"Subway 6\" Veggie Delite",p:9, c:230,q:"6-inch sub",cat:"Fast Food"},
  {n:"Domino's Pizza (2 slices, veg)",p:14,c:400,q:"2 medium slices",cat:"Fast Food"},
  {n:"Domino's Pizza (2 slices, chicken)",p:22,c:460,q:"2 medium slices",cat:"Fast Food"},
  {n:"Burger King Whopper",p:28,c:650,q:"1 burger",cat:"Fast Food"},
  {n:"Hot dog (bun + frank)",p:12,c:290,q:"1 standard hot dog",cat:"Fast Food"},
  {n:"Nachos with cheese",p:8, c:380,q:"1 serving (120g)",cat:"Fast Food"},
  /* Condiments & Sauces */
  {n:"Tomato ketchup",p:0, c:20,q:"1 tbsp (17g)",cat:"Condiments"},
  {n:"Mayonnaise",p:0, c:90,q:"1 tbsp (14g)",cat:"Condiments"},
  {n:"Mustard",p:0, c:9,q:"1 tsp (5g)",cat:"Condiments"},
  {n:"Hot sauce (Tabasco)",p:0, c:1,q:"1 tsp (5ml)",cat:"Condiments"},
  {n:"Soy sauce",p:1, c:10,q:"1 tbsp (16ml)",cat:"Condiments"},
  {n:"Olive oil",p:0, c:119,q:"1 tbsp (14ml)",cat:"Condiments"},
  {n:"Butter (salted)",p:0, c:102,q:"1 tbsp (14g)",cat:"Condiments"},
  {n:"Cream cheese",p:2, c:100,q:"2 tbsp (30g)",cat:"Condiments"},
  {n:"Hummus (dip)",p:2, c:50,q:"2 tbsp (30g)",cat:"Condiments"},
  {n:"Ranch dressing",p:1, c:130,q:"2 tbsp (30ml)",cat:"Condiments"},
  {n:"Balsamic vinegar",p:0, c:14,q:"1 tbsp (15ml)",cat:"Condiments"},
  {n:"Tahini",p:3, c:89,q:"1 tbsp (15g)",cat:"Condiments"},
  /* International Dairy & Cheese */
  {n:"Cheddar cheese",p:7, c:113,q:"1 slice (30g)",cat:"International Dairy"},
  {n:"Mozzarella",p:7, c:85,q:"1 slice (30g)",cat:"International Dairy"},
  {n:"Feta cheese",p:4, c:75,q:"30g",cat:"International Dairy"},
  {n:"Cottage cheese (low-fat)",p:14,c:100,q:"½ cup (113g)",cat:"International Dairy"},
  {n:"Parmesan (grated)",p:4, c:80,q:"2 tbsp (10g)",cat:"International Dairy"},
  {n:"Whipping cream",p:0, c:88,q:"2 tbsp (30ml)",cat:"International Dairy"},
  {n:"Sour cream",p:1, c:60,q:"2 tbsp (30g)",cat:"International Dairy"},
  /* International Desserts */
  {n:"Cheesecake (1 slice)",p:6, c:400,q:"1 slice (120g)",cat:"International Desserts"},
  {n:"Brownie",p:3, c:240,q:"1 medium piece (60g)",cat:"International Desserts"},
  {n:"Tiramisu",p:5, c:310,q:"1 serving (100g)",cat:"International Desserts"},
  {n:"Mochi ice cream (1 pc)",p:2, c:100,q:"1 piece (44g)",cat:"International Desserts"},
  {n:"Croissant (pain au chocolat)",p:6, c:310,q:"1 piece (65g)",cat:"International Desserts"},
  {n:"Doughnut (glazed)",p:3, c:250,q:"1 doughnut (55g)",cat:"International Desserts"},
  {n:"Waffle cone ice cream",p:4, c:290,q:"1 medium cone",cat:"International Desserts"},
  {n:"Oreo cookies (3)",p:2, c:160,q:"3 cookies (34g)",cat:"International Desserts"},
  {n:"Protein bar (Quest / similar)",p:21,c:200,q:"1 bar (60g)",cat:"International Desserts"},
  /* ── More Indian Regional ── */
  {n:"Chole bhature (restaurant)",p:18,c:680,q:"2 bhature + chole",cat:"Indian Regional"},
  {n:"Rajasthani dal baati churma",p:14,c:720,q:"2 baati + dal + churma",cat:"Indian Regional"},
  {n:"Pav bhaji",p:10,c:450,q:"2 pav + bhaji",cat:"Indian Regional"},
  {n:"Misal pav",p:12,c:380,q:"1 plate",cat:"Indian Regional"},
  {n:"Kanda bhaji",p:5,c:220,q:"6 pieces (100g)",cat:"Indian Regional"},
  {n:"Batata vada",p:3,c:180,q:"1 piece (70g)",cat:"Indian Regional"},
  {n:"Thalipeeth",p:7,c:280,q:"2 pieces (120g)",cat:"Indian Regional"},
  {n:"Pitla bhakri",p:10,c:350,q:"1 plate",cat:"Indian Regional"},
  {n:"Puran poli",p:6,c:320,q:"1 piece (90g)",cat:"Indian Regional"},
  {n:"Modak (steamed)",p:3,c:140,q:"2 pieces (80g)",cat:"Indian Regional"},
  {n:"Shrikhand",p:8,c:280,q:"½ cup (100g)",cat:"Indian Regional"},
  {n:"Mysore pak",p:3,c:200,q:"1 piece (40g)",cat:"Indian Regional"},
  {n:"Rava kesari",p:3,c:250,q:"1 cup (120g)",cat:"Indian Regional"},
  {n:"Curd rice",p:6,c:240,q:"1 cup (200g)",cat:"Indian Regional"},
  {n:"Lemon rice",p:4,c:230,q:"1 cup (200g)",cat:"Indian Regional"},
  {n:"Tamarind rice / puliyogare",p:4,c:250,q:"1 cup (200g)",cat:"Indian Regional"},
  {n:"Ven pongal",p:8,c:300,q:"1 cup (200g)",cat:"Indian Regional"},
  {n:"Kozhukattai",p:3,c:120,q:"2 pieces (80g)",cat:"Indian Regional"},
  {n:"Kerala prawn curry",p:22,c:280,q:"1 cup (200g)",cat:"Indian Regional"},
  {n:"Kerala fish curry",p:24,c:260,q:"1 cup (200g)",cat:"Indian Regional"},
  {n:"Appam with stew",p:8,c:310,q:"2 appam + cup stew",cat:"Indian Regional"},
  {n:"Puttu with kadala",p:12,c:340,q:"1 cylinder puttu + curry",cat:"Indian Regional"},
  {n:"Malabar parotta",p:6,c:320,q:"2 parottas (120g)",cat:"Indian Regional"},
  {n:"Kosha mangsho",p:28,c:380,q:"1 cup (200g)",cat:"Indian Regional"},
  {n:"Mishti doi",p:6,c:180,q:"1 cup (150g)",cat:"Indian Regional"},
  {n:"Sandesh",p:5,c:160,q:"2 pieces (60g)",cat:"Indian Regional"},
  {n:"Luchi with aloo dum",p:7,c:420,q:"3 luchi + curry",cat:"Indian Regional"},
  {n:"Kachori",p:5,c:250,q:"2 pieces (80g)",cat:"Indian Regional"},
  {n:"Dahi vada",p:8,c:250,q:"2 pieces in curd",cat:"Indian Regional"},
  {n:"Aloo tikki",p:4,c:200,q:"2 pieces (100g)",cat:"Indian Regional"},
  {n:"Gol gappe / pani puri (8 pcs)",p:4,c:200,q:"8 pieces",cat:"Indian Regional"},
  {n:"Dahi puri (6 pcs)",p:6,c:240,q:"6 pieces",cat:"Indian Regional"},
  {n:"Sev puri",p:5,c:200,q:"1 plate",cat:"Indian Regional"},
  {n:"Dum aloo (Kashmiri)",p:4,c:280,q:"1 cup",cat:"Indian Regional"},
  {n:"Rogan josh",p:26,c:350,q:"1 cup (200g)",cat:"Indian Regional"},
  {n:"Yakhni pulao",p:20,c:420,q:"1 plate (300g)",cat:"Indian Regional"},
  {n:"Gushtaba",p:22,c:340,q:"2 pieces in gravy",cat:"Indian Regional"},
  {n:"Sarson ka saag with makki roti",p:10,c:380,q:"1 bowl + 2 roti",cat:"Indian Regional"},
  {n:"Makki ki roti",p:4,c:150,q:"1 roti (60g)",cat:"Indian Regional"},
  {n:"Langar dal (amritsari)",p:12,c:220,q:"1 cup",cat:"Indian Regional"},
  {n:"Amritsari kulcha",p:8,c:300,q:"1 kulcha (100g)",cat:"Indian Regional"},
  {n:"Makhani gravy base",p:5,c:180,q:"½ cup (100g)",cat:"Indian Regional"},
  /* ── Chinese ── */
  {n:"Kung pao chicken",p:24,c:350,q:"1 cup (200g)",cat:"Chinese"},
  {n:"Mapo tofu",p:14,c:280,q:"1 cup (200g)",cat:"Chinese"},
  {n:"Peking duck (2 wraps)",p:20,c:400,q:"2 pancake wraps",cat:"Chinese"},
  {n:"Dim sum — siu mai (3)",p:9,c:130,q:"3 pieces",cat:"Chinese"},
  {n:"Dim sum — char siu bao",p:7,c:160,q:"1 bun (60g)",cat:"Chinese"},
  {n:"Wonton soup",p:14,c:200,q:"1 bowl (300ml)",cat:"Chinese"},
  {n:"Sweet & sour pork",p:18,c:380,q:"1 cup (200g)",cat:"Chinese"},
  {n:"Beef with broccoli",p:22,c:300,q:"1 cup (200g)",cat:"Chinese"},
  {n:"Shrimp fried rice",p:18,c:380,q:"1 cup (200g)",cat:"Chinese"},
  {n:"Egg fried rice",p:10,c:330,q:"1 cup (200g)",cat:"Chinese"},
  {n:"Chow mein (chicken)",p:18,c:400,q:"1 plate (250g)",cat:"Chinese"},
  {n:"Lo mein (vegetable)",p:8,c:310,q:"1 plate (250g)",cat:"Chinese"},
  {n:"Moo shu pork",p:18,c:320,q:"1 cup",cat:"Chinese"},
  {n:"General Tso's chicken",p:22,c:430,q:"1 cup (200g)",cat:"Chinese"},
  {n:"Egg drop soup",p:6,c:80,q:"1 bowl (250ml)",cat:"Chinese"},
  {n:"Hot and sour soup",p:8,c:120,q:"1 bowl (250ml)",cat:"Chinese"},
  {n:"Spring roll (fried)",p:4,c:170,q:"1 roll (75g)",cat:"Chinese"},
  {n:"Scallion pancake",p:5,c:220,q:"1 pancake (100g)",cat:"Chinese"},
  {n:"Braised pork belly (dongpo)",p:20,c:480,q:"1 piece (150g)",cat:"Chinese"},
  {n:"Dan dan noodles",p:18,c:420,q:"1 bowl (300g)",cat:"Chinese"},
  {n:"Congee (plain)",p:3,c:110,q:"1 bowl (300ml)",cat:"Chinese"},
  {n:"Congee with egg & ginger",p:8,c:160,q:"1 bowl (300ml)",cat:"Chinese"},
  /* ── Japanese ── */
  {n:"Chicken teriyaki",p:28,c:290,q:"100g + sauce",cat:"Japanese"},
  {n:"Tonkatsu (pork cutlet)",p:26,c:400,q:"1 cutlet (150g)",cat:"Japanese"},
  {n:"Chicken katsu curry",p:28,c:620,q:"1 plate",cat:"Japanese"},
  {n:"Gyoza (4 pcs, pan-fried)",p:10,c:200,q:"4 pieces",cat:"Japanese"},
  {n:"Edamame (shelled)",p:12,c:122,q:"½ cup (75g)",cat:"Japanese"},
  {n:"Miso ramen",p:18,c:430,q:"1 bowl",cat:"Japanese"},
  {n:"Shoyu ramen",p:20,c:420,q:"1 bowl",cat:"Japanese"},
  {n:"Tonkotsu ramen",p:22,c:490,q:"1 bowl",cat:"Japanese"},
  {n:"Udon noodles (broth)",p:12,c:310,q:"1 bowl (400g)",cat:"Japanese"},
  {n:"Soba noodles (cold, zaru)",p:10,c:220,q:"1 serving (200g)",cat:"Japanese"},
  {n:"Onigiri (salmon)",p:8,c:190,q:"1 rice ball (120g)",cat:"Japanese"},
  {n:"Onigiri (umeboshi)",p:3,c:160,q:"1 rice ball (110g)",cat:"Japanese"},
  {n:"Yakitori chicken (3 skewers)",p:21,c:240,q:"3 skewers",cat:"Japanese"},
  {n:"Takoyaki (6 pcs)",p:10,c:280,q:"6 pieces",cat:"Japanese"},
  {n:"Okonomiyaki",p:16,c:380,q:"1 pancake (250g)",cat:"Japanese"},
  {n:"Tempura prawn (4 pcs)",p:14,c:260,q:"4 pieces",cat:"Japanese"},
  {n:"Tempura vegetable (6 pcs)",p:4,c:210,q:"6 pieces",cat:"Japanese"},
  {n:"Salmon sashimi (6 pcs)",p:20,c:160,q:"6 pieces (120g)",cat:"Japanese"},
  {n:"Tuna sashimi (6 pcs)",p:22,c:130,q:"6 pieces (120g)",cat:"Japanese"},
  {n:"Maki roll — tuna (6 pcs)",p:10,c:180,q:"6 pieces",cat:"Japanese"},
  {n:"Mochi (plain)",p:2,c:110,q:"1 piece (40g)",cat:"Japanese"},
  {n:"Japanese curry rice",p:16,c:520,q:"1 plate",cat:"Japanese"},
  /* ── Korean ── */
  {n:"Japchae (glass noodles)",p:8,c:290,q:"1 cup (200g)",cat:"Korean"},
  {n:"Tteokbokki",p:6,c:280,q:"1 cup (200g)",cat:"Korean"},
  {n:"Korean fried chicken (4 pcs)",p:28,c:420,q:"4 pieces (200g)",cat:"Korean"},
  {n:"Samgyeopsal (pork belly BBQ)",p:22,c:400,q:"200g cooked",cat:"Korean"},
  {n:"Doenjang jjigae",p:12,c:180,q:"1 bowl (300ml)",cat:"Korean"},
  {n:"Sundubu jjigae (soft tofu stew)",p:16,c:220,q:"1 bowl",cat:"Korean"},
  {n:"Jjajangmyeon",p:14,c:480,q:"1 bowl (350g)",cat:"Korean"},
  {n:"Haemul pajeon (seafood pancake)",p:14,c:300,q:"1 pancake",cat:"Korean"},
  {n:"Kimbap (6 pcs)",p:8,c:220,q:"6 pieces",cat:"Korean"},
  {n:"Bulgogi beef",p:24,c:310,q:"150g",cat:"Korean"},
  /* ── Thai ── */
  {n:"Green curry (chicken)",p:22,c:380,q:"1 cup (250g)",cat:"Thai"},
  {n:"Red curry (beef)",p:24,c:420,q:"1 cup (250g)",cat:"Thai"},
  {n:"Massaman curry (chicken)",p:20,c:400,q:"1 cup (250g)",cat:"Thai"},
  {n:"Thai basil chicken (pad krapow)",p:26,c:350,q:"1 plate (250g)",cat:"Thai"},
  {n:"Som tam (green papaya salad)",p:2,c:90,q:"1 bowl (200g)",cat:"Thai"},
  {n:"Larb gai (minced chicken salad)",p:22,c:280,q:"1 bowl",cat:"Thai"},
  {n:"Khao man gai (poached chicken rice)",p:28,c:460,q:"1 plate",cat:"Thai"},
  {n:"Mango sticky rice",p:4,c:380,q:"1 serving",cat:"Thai"},
  {n:"Tom kha gai (coconut soup)",p:18,c:280,q:"1 bowl (300ml)",cat:"Thai"},
  {n:"Thai spring roll (fresh, 2 pcs)",p:6,c:160,q:"2 rolls",cat:"Thai"},
  {n:"Satay chicken (4 skewers + peanut sauce)",p:24,c:320,q:"4 skewers",cat:"Thai"},
  /* ── Italian ── */
  {n:"Spaghetti carbonara",p:22,c:580,q:"1 plate (300g)",cat:"Italian"},
  {n:"Spaghetti aglio e olio",p:12,c:480,q:"1 plate (280g)",cat:"Italian"},
  {n:"Penne arrabbiata",p:12,c:420,q:"1 plate (280g)",cat:"Italian"},
  {n:"Lasagna (meat)",p:24,c:560,q:"1 portion (300g)",cat:"Italian"},
  {n:"Lasagna (vegetable)",p:14,c:480,q:"1 portion (300g)",cat:"Italian"},
  {n:"Risotto (mushroom)",p:10,c:480,q:"1 bowl (300g)",cat:"Italian"},
  {n:"Risotto (seafood)",p:20,c:460,q:"1 bowl (300g)",cat:"Italian"},
  {n:"Pizza Margherita (2 slices)",p:16,c:420,q:"2 medium slices",cat:"Italian"},
  {n:"Pizza pepperoni (2 slices)",p:22,c:520,q:"2 medium slices",cat:"Italian"},
  {n:"Gnocchi in tomato sauce",p:8,c:420,q:"1 plate (280g)",cat:"Italian"},
  {n:"Bruschetta (2 pcs)",p:5,c:180,q:"2 pieces",cat:"Italian"},
  {n:"Caprese salad",p:14,c:220,q:"1 bowl",cat:"Italian"},
  {n:"Minestrone soup",p:6,c:150,q:"1 bowl (300ml)",cat:"Italian"},
  {n:"Tiramisu",p:5,c:310,q:"1 portion (100g)",cat:"Italian"},
  {n:"Panna cotta",p:4,c:280,q:"1 serving (120g)",cat:"Italian"},
  {n:"Gelato (2 scoops)",p:4,c:220,q:"2 scoops (120g)",cat:"Italian"},
  /* ── Mexican / Latin ── */
  {n:"Tacos al pastor (2)",p:18,c:340,q:"2 tacos",cat:"Mexican"},
  {n:"Chicken quesadilla",p:24,c:460,q:"1 quesadilla (220g)",cat:"Mexican"},
  {n:"Beef enchiladas (2)",p:22,c:480,q:"2 enchiladas",cat:"Mexican"},
  {n:"Guacamole",p:2,c:150,q:"¼ cup (60g)",cat:"Mexican"},
  {n:"Tortilla chips",p:2,c:140,q:"1 oz (28g)",cat:"Mexican"},
  {n:"Black bean burrito bowl",p:20,c:520,q:"1 bowl",cat:"Mexican"},
  {n:"Chicken fajitas",p:28,c:420,q:"2 wraps",cat:"Mexican"},
  {n:"Churros (4 pcs)",p:4,c:310,q:"4 pieces (80g)",cat:"Mexican"},
  {n:"Empanada (beef)",p:12,c:290,q:"1 piece (100g)",cat:"Mexican"},
  {n:"Ceviche",p:22,c:180,q:"1 cup (200g)",cat:"Mexican"},
  {n:"Tamale (pork)",p:14,c:320,q:"1 tamale (130g)",cat:"Mexican"},
  {n:"Arepas with cheese",p:10,c:300,q:"1 arepa (130g)",cat:"Mexican"},
  {n:"Açaí bowl (medium)",p:5,c:380,q:"1 bowl (300g)",cat:"Mexican"},
  /* ── Mediterranean / Middle Eastern ── */
  {n:"Grilled halloumi",p:16,c:280,q:"100g",cat:"Mediterranean"},
  {n:"Spanakopita (1 piece)",p:7,c:260,q:"1 piece (100g)",cat:"Mediterranean"},
  {n:"Tabouli salad",p:3,c:120,q:"1 cup (150g)",cat:"Mediterranean"},
  {n:"Fattoush salad",p:3,c:130,q:"1 bowl (200g)",cat:"Mediterranean"},
  {n:"Labneh (strained yogurt)",p:5,c:80,q:"¼ cup (60g)",cat:"Mediterranean"},
  {n:"Pita bread",p:5,c:165,q:"1 medium (60g)",cat:"Mediterranean"},
  {n:"Chicken kofte kebab (3)",p:24,c:300,q:"3 skewers (180g)",cat:"Mediterranean"},
  {n:"Lamb kofta (3)",p:22,c:350,q:"3 pieces (180g)",cat:"Mediterranean"},
  {n:"Tagine (lamb & prune)",p:26,c:420,q:"1 portion (300g)",cat:"Mediterranean"},
  {n:"Couscous (cooked)",p:6,c:176,q:"1 cup (157g)",cat:"Mediterranean"},
  {n:"Lentil soup (Middle Eastern)",p:12,c:200,q:"1 bowl (300ml)",cat:"Mediterranean"},
  {n:"Baba ganoush",p:2,c:80,q:"¼ cup (60g)",cat:"Mediterranean"},
  {n:"Shakshuka (2 eggs)",p:14,c:260,q:"1 serving",cat:"Mediterranean"},
  {n:"Dolma / stuffed grape leaves (4)",p:5,c:180,q:"4 pieces (120g)",cat:"Mediterranean"},
  /* ── American Comfort & BBQ ── */
  {n:"Mac and cheese (homemade)",p:16,c:500,q:"1 cup (250g)",cat:"American"},
  {n:"BBQ pulled pork sandwich",p:32,c:580,q:"1 sandwich",cat:"American"},
  {n:"BBQ ribs (3 ribs)",p:36,c:620,q:"3 ribs (250g)",cat:"American"},
  {n:"Beef brisket (smoked)",p:30,c:350,q:"150g slice",cat:"American"},
  {n:"Coleslaw",p:1,c:120,q:"½ cup (120g)",cat:"American"},
  {n:"Corn on the cob (buttered)",p:4,c:180,q:"1 ear + 1 tsp butter",cat:"American"},
  {n:"Mashed potatoes (with butter)",p:4,c:240,q:"1 cup (240g)",cat:"American"},
  {n:"Clam chowder",p:10,c:300,q:"1 cup (240ml)",cat:"American"},
  {n:"BLT sandwich",p:18,c:380,q:"1 sandwich",cat:"American"},
  {n:"Club sandwich",p:24,c:460,q:"1 sandwich",cat:"American"},
  {n:"Pancakes with maple syrup (3)",p:9,c:480,q:"3 pancakes + 2 tbsp syrup",cat:"American"},
  {n:"French toast (2 slices)",p:10,c:330,q:"2 slices",cat:"American"},
  {n:"Eggs Benedict",p:22,c:500,q:"2 eggs on muffin",cat:"American"},
  {n:"Avocado toast with egg",p:12,c:300,q:"1 slice bread + ½ avo + egg",cat:"American"},
  {n:"Chicken & waffles",p:30,c:680,q:"1 serving",cat:"American"},
  {n:"Philly cheesesteak",p:30,c:560,q:"6-inch sub",cat:"American"},
  {n:"New England lobster roll",p:24,c:420,q:"1 roll",cat:"American"},
  {n:"Buffalo wings (6)",p:28,c:480,q:"6 wings",cat:"American"},
  {n:"Onion rings (serving)",p:4,c:280,q:"8 rings (100g)",cat:"American"},
  /* ── More Fast Food ── */
  {n:"McDonald's McFlurry",p:8,c:340,q:"1 regular",cat:"Fast Food"},
  {n:"McDonald's Big Breakfast",p:28,c:780,q:"1 full set",cat:"Fast Food"},
  {n:"KFC Popcorn Chicken (regular)",p:18,c:390,q:"regular serving",cat:"Fast Food"},
  {n:"Domino's Garlic Bread (4 pcs)",p:6,c:300,q:"4 pieces",cat:"Fast Food"},
  {n:"Pizza Hut Personal Pan Pizza",p:22,c:560,q:"1 personal pizza",cat:"Fast Food"},
  {n:"Subway footlong Chicken (wheat)",p:46,c:620,q:"12-inch sub",cat:"Fast Food"},
  {n:"Starbucks Frappuccino (grande)",p:6,c:380,q:"1 grande (473ml)",cat:"Fast Food"},
  {n:"Starbucks Caramel Macchiato",p:10,c:250,q:"1 grande (355ml)",cat:"Fast Food"},
  {n:"Dunkin' glazed doughnut",p:3,c:260,q:"1 doughnut (59g)",cat:"Fast Food"},
  {n:"McDonald's Chicken McNuggets (10)",p:24,c:430,q:"10 pieces",cat:"Fast Food"},
  {n:"Burger King Impossible Whopper",p:25,c:630,q:"1 burger",cat:"Fast Food"},
  {n:"Taco Bell Chalupa",p:16,c:370,q:"1 chalupa",cat:"Fast Food"},
  {n:"Chipotle chicken bowl",p:36,c:620,q:"1 bowl (no chips)",cat:"Fast Food"},
  {n:"Five Guys burger (little burger)",p:26,c:550,q:"1 burger",cat:"Fast Food"},
  /* ── Smoothies & Healthy Drinks ── */
  {n:"Banana mango smoothie",p:4,c:280,q:"1 cup (300ml)",cat:"Smoothies"},
  {n:"Green smoothie (spinach, apple, ginger)",p:3,c:180,q:"1 cup (300ml)",cat:"Smoothies"},
  {n:"Protein smoothie (whey + banana + milk)",p:30,c:380,q:"1 shake (400ml)",cat:"Smoothies"},
  {n:"Açaí smoothie bowl",p:5,c:360,q:"1 bowl (300g)",cat:"Smoothies"},
  {n:"Mango lassi",p:7,c:250,q:"1 glass (300ml)",cat:"Smoothies"},
  {n:"Avocado smoothie",p:4,c:310,q:"1 cup (300ml)",cat:"Smoothies"},
  {n:"Berry smoothie (mixed berries + yogurt)",p:8,c:220,q:"1 cup (300ml)",cat:"Smoothies"},
  {n:"Orange carrot ginger juice",p:2,c:120,q:"1 glass (250ml)",cat:"Smoothies"},
  {n:"Wheatgrass shot",p:1,c:15,q:"1 shot (30ml)",cat:"Smoothies"},
  {n:"Cold-pressed green juice",p:2,c:100,q:"1 bottle (250ml)",cat:"Smoothies"},
  {n:"Turmeric ginger shot",p:0,c:25,q:"1 shot (30ml)",cat:"Smoothies"},
  {n:"Bone broth",p:10,c:45,q:"1 cup (240ml)",cat:"Smoothies"},
  /* ── Breakfast Cereals & Bars ── */
  {n:"Granola with milk",p:8,c:340,q:"½ cup granola + 100ml milk",cat:"Breakfast"},
  {n:"Overnight oats with chia & fruit",p:12,c:320,q:"1 jar (300g)",cat:"Breakfast"},
  {n:"Weetabix (2 biscuits + milk)",p:9,c:210,q:"2 biscuits + 150ml milk",cat:"Breakfast"},
  {n:"Corn flakes with milk",p:6,c:200,q:"1 cup + 150ml milk",cat:"Breakfast"},
  {n:"Muesli with milk",p:9,c:280,q:"½ cup + 150ml milk",cat:"Breakfast"},
  {n:"Porridge (oats, water)",p:5,c:130,q:"1 bowl (250g cooked)",cat:"Breakfast"},
  {n:"Scrambled eggs (2) on toast",p:16,c:310,q:"2 eggs + 1 slice toast",cat:"Breakfast"},
  {n:"Boiled egg (2) with soldiers",p:14,c:230,q:"2 eggs + 1 slice toast",cat:"Breakfast"},
  {n:"Greek yogurt with granola & honey",p:14,c:320,q:"150g yogurt + 30g granola + 1 tsp honey",cat:"Breakfast"},
  {n:"Smoothie bowl (banana, berries)",p:6,c:340,q:"1 bowl (300g)",cat:"Breakfast"},
  {n:"Pancakes (American, plain, 3)",p:8,c:300,q:"3 medium pancakes",cat:"Breakfast"},
  {n:"French crepe (plain)",p:5,c:140,q:"1 crepe (70g)",cat:"Breakfast"},
  /* ── Baked Goods ── */
  {n:"Muffin (blueberry)",p:4,c:340,q:"1 large muffin (120g)",cat:"Baked Goods"},
  {n:"Muffin (chocolate chip)",p:5,c:360,q:"1 large muffin (120g)",cat:"Baked Goods"},
  {n:"Banana bread slice",p:4,c:220,q:"1 slice (70g)",cat:"Baked Goods"},
  {n:"Cinnamon roll",p:6,c:390,q:"1 roll (120g)",cat:"Baked Goods"},
  {n:"Scone (plain)",p:5,c:218,q:"1 scone (65g)",cat:"Baked Goods"},
  {n:"Baguette (half)",p:8,c:260,q:"½ baguette (100g)",cat:"Baked Goods"},
  {n:"Focaccia",p:7,c:290,q:"1 slice (100g)",cat:"Baked Goods"},
  {n:"Rye bread (2 slices)",p:6,c:170,q:"2 slices (80g)",cat:"Baked Goods"},
  {n:"Ciabatta",p:6,c:270,q:"1 roll (100g)",cat:"Baked Goods"},
  {n:"Pretzels (soft, large)",p:8,c:340,q:"1 large pretzel (120g)",cat:"Baked Goods"},
  /* ── More Proteins ── */
  {n:"Sardines in oil (100g)",p:25,c:208,q:"100g",cat:"Proteins Global"},
  {n:"Mackerel (grilled)",p:24,c:239,q:"100g",cat:"Proteins Global"},
  {n:"Cod fillet (baked)",p:23,c:105,q:"100g",cat:"Proteins Global"},
  {n:"Duck breast (cooked)",p:28,c:201,q:"100g",cat:"Proteins Global"},
  {n:"Venison (cooked)",p:30,c:158,q:"100g",cat:"Proteins Global"},
  {n:"Bison patty (100g)",p:28,c:218,q:"100g",cat:"Proteins Global"},
  {n:"Pork sausage (2 links)",p:10,c:250,q:"2 sausages (80g)",cat:"Proteins Global"},
  {n:"Beef jerky",p:22,c:166,q:"1 oz (28g)",cat:"Proteins Global"},
  {n:"Canned chickpeas (drained)",p:9,c:164,q:"½ cup (120g)",cat:"Proteins Global"},
  {n:"Seitan (wheat protein)",p:25,c:160,q:"100g",cat:"Proteins Global"},
  {n:"Cottage cheese (full fat)",p:11,c:120,q:"½ cup (113g)",cat:"Proteins Global"},
  {n:"Hard boiled egg white",p:11,c:52,q:"2 egg whites",cat:"Proteins Global"},
  {n:"Smoked salmon",p:20,c:160,q:"100g (3.5oz)",cat:"Proteins Global"},
  {n:"Tuna steak (grilled)",p:30,c:180,q:"100g",cat:"Proteins Global"},
  {n:"Lobster (boiled)",p:19,c:98,q:"100g meat",cat:"Proteins Global"},
  {n:"Scallops (seared)",p:17,c:111,q:"100g",cat:"Proteins Global"},
  /* ── More Vegetables ── */
  {n:"Kale (raw)",p:3,c:49,q:"1 cup (67g)",cat:"Vegetables Global"},
  {n:"Sweet potato (baked)",p:2,c:130,q:"1 medium (130g)",cat:"Vegetables Global"},
  {n:"Zucchini (cooked)",p:2,c:27,q:"1 cup (180g)",cat:"Vegetables Global"},
  {n:"Asparagus (steamed, 6 spears)",p:3,c:27,q:"6 spears (90g)",cat:"Vegetables Global"},
  {n:"Brussels sprouts (roasted)",p:4,c:80,q:"1 cup (150g)",cat:"Vegetables Global"},
  {n:"Cauliflower rice (1 cup)",p:3,c:28,q:"1 cup (100g)",cat:"Vegetables Global"},
  {n:"Edamame (in shell)",p:8,c:100,q:"1 cup (155g)",cat:"Vegetables Global"},
  {n:"Beet (roasted)",p:2,c:74,q:"1 medium beet (82g)",cat:"Vegetables Global"},
  {n:"Artichoke heart",p:4,c:60,q:"½ cup (84g)",cat:"Vegetables Global"},
  {n:"Corn (sweet, boiled)",p:5,c:177,q:"1 ear (154g)",cat:"Vegetables Global"},
  {n:"Peas (green, cooked)",p:8,c:134,q:"1 cup (160g)",cat:"Vegetables Global"},
  {n:"Celery stick (4)",p:1,c:14,q:"4 stalks (64g)",cat:"Vegetables Global"},
  {n:"Cucumber (1 medium)",p:1,c:24,q:"1 medium (201g)",cat:"Vegetables Global"},
  {n:"Tomato (1 medium)",p:1,c:22,q:"1 medium (123g)",cat:"Vegetables Global"},
  {n:"Mushrooms (sautéed)",p:3,c:80,q:"1 cup (150g)",cat:"Vegetables Global"},
  /* ── More Fruits ── */
  {n:"Grapefruit (half)",p:1,c:52,q:"½ medium",cat:"Fruits Global"},
  {n:"Lychee (10 fruits)",p:1,c:66,q:"10 fruits (100g)",cat:"Fruits Global"},
  {n:"Dragon fruit",p:3,c:102,q:"1 medium (200g)",cat:"Fruits Global"},
  {n:"Jackfruit (100g)",p:2,c:98,q:"100g chunks",cat:"Fruits Global"},
  {n:"Passion fruit (2)",p:2,c:35,q:"2 fruits (40g)",cat:"Fruits Global"},
  {n:"Plum (2 medium)",p:1,c:76,q:"2 medium plums",cat:"Fruits Global"},
  {n:"Nectarine",p:1,c:63,q:"1 medium (142g)",cat:"Fruits Global"},
  {n:"Fig (2 fresh)",p:1,c:74,q:"2 medium figs",cat:"Fruits Global"},
  {n:"Cantaloupe melon (1 cup)",p:1,c:60,q:"1 cup cubed (160g)",cat:"Fruits Global"},
  {n:"Honeydew melon (1 cup)",p:1,c:64,q:"1 cup cubed (170g)",cat:"Fruits Global"},
  {n:"Prunes (5)",p:1,c:114,q:"5 prunes (42g)",cat:"Fruits Global"},
  {n:"Raisins",p:1,c:130,q:"¼ cup (41g)",cat:"Fruits Global"},
  /* ── More Nuts & Seeds ── */
  {n:"Sunflower seeds (roasted)",p:6,c:165,q:"¼ cup (35g)",cat:"Nuts & Seeds"},
  {n:"Pumpkin seeds (pepitas)",p:9,c:180,q:"¼ cup (35g)",cat:"Nuts & Seeds"},
  {n:"Chia seeds",p:5,c:138,q:"2 tbsp (28g)",cat:"Nuts & Seeds"},
  {n:"Flax seeds (ground)",p:3,c:74,q:"2 tbsp (14g)",cat:"Nuts & Seeds"},
  {n:"Hemp seeds",p:10,c:166,q:"3 tbsp (30g)",cat:"Nuts & Seeds"},
  {n:"Brazil nuts (3)",p:4,c:99,q:"3 nuts (21g)",cat:"Nuts & Seeds"},
  {n:"Macadamia nuts (6)",p:2,c:120,q:"6 nuts (19g)",cat:"Nuts & Seeds"},
  {n:"Pistachio (30 kernels)",p:6,c:160,q:"30 kernels (28g)",cat:"Nuts & Seeds"},
  {n:"Hazelnut (15 nuts)",p:3,c:104,q:"15 nuts (20g)",cat:"Nuts & Seeds"},
  {n:"Almond butter",p:7,c:198,q:"2 tbsp (32g)",cat:"Nuts & Seeds"},
  /* ── Supplements & Sports ── */
  {n:"Casein protein shake (1 scoop)",p:24,c:120,q:"30g scoop in water",cat:"Supplements"},
  {n:"BCAA drink (1 serving)",p:5,c:25,q:"10g in water",cat:"Supplements"},
  {n:"Creatine (plain, 5g)",p:0,c:0,q:"5g",cat:"Supplements"},
  {n:"Mass gainer shake (1 serving)",p:50,c:1250,q:"3 scoops (300g) in milk",cat:"Supplements"},
  {n:"Pre-workout drink",p:0,c:20,q:"1 scoop (10g) in water",cat:"Supplements"},
  {n:"Electrolyte drink",p:0,c:50,q:"1 sachet in 500ml water",cat:"Supplements"},
  {n:"Meal replacement shake",p:20,c:200,q:"2 scoops (50g) in water",cat:"Supplements"},
  /* ── More Herbal Teas & Functional ── */
  {n:"Chamomile tea",p:0,c:2,q:"1 cup (240ml)",cat:"Herbal & Functional"},
  {n:"Peppermint tea",p:0,c:2,q:"1 cup (240ml)",cat:"Herbal & Functional"},
  {n:"Ginger lemon tea",p:0,c:10,q:"1 cup (240ml)",cat:"Herbal & Functional"},
  {n:"Hibiscus tea",p:0,c:5,q:"1 cup (240ml)",cat:"Herbal & Functional"},
  {n:"Ashwagandha latte",p:3,c:80,q:"1 cup (240ml)",cat:"Herbal & Functional"},
  {n:"Masala chai with oat milk",p:3,c:90,q:"1 cup (240ml)",cat:"Herbal & Functional"},
  {n:"Kefir",p:9,c:110,q:"1 cup (240ml)",cat:"Herbal & Functional"},
  {n:"Yakult probiotic",p:1,c:50,q:"1 bottle (65ml)",cat:"Herbal & Functional"},
  {n:"Apple cider vinegar drink",p:0,c:15,q:"1 tbsp in 200ml water",cat:"Herbal & Functional"},
  {n:"Coconut kefir",p:2,c:60,q:"½ cup (120ml)",cat:"Herbal & Functional"},
];

/* ─────────────── Cheat Day Zone data ─────────────── */
const CHEAT_PACKS: Record<string, LogFood[]> = {
  "🎉 Party": [
    {n:"Birthday cake slice",c:350,p:4,q:"1 slice (120g)",cat:"Cheat"},
    {n:"Cocktail (mojito / margarita)",c:200,p:0,q:"1 drink (200ml)",cat:"Cheat"},
    {n:"Nachos with cheese dip",c:380,p:8,q:"1 plate (150g)",cat:"Cheat"},
    {n:"Party pizza (2 slices)",c:500,p:20,q:"2 slices",cat:"Cheat"},
    {n:"Loaded potato skins (4)",c:360,p:12,q:"4 pieces",cat:"Cheat"},
    {n:"Chocolate fountain dip",c:290,p:3,q:"50g chocolate + fruit",cat:"Cheat"},
    {n:"Spring rolls fried (4)",c:340,p:8,q:"4 pieces",cat:"Cheat"},
    {n:"Ice cream sundae",c:440,p:7,q:"1 large serving",cat:"Cheat"},
  ],
  "🍽️ Dine Out": [
    {n:"Butter chicken (restaurant-style)",c:480,p:30,q:"1 bowl (250g)",cat:"Cheat"},
    {n:"Paneer tikka starter",c:320,p:18,q:"6 pieces",cat:"Cheat"},
    {n:"Garlic naan",c:280,p:8,q:"1 naan",cat:"Cheat"},
    {n:"Dal makhani (restaurant)",c:380,p:14,q:"1 cup (200g)",cat:"Cheat"},
    {n:"Pasta Alfredo",c:600,p:18,q:"1 plate (300g)",cat:"Cheat"},
    {n:"Fish & chips",c:800,p:30,q:"1 full portion",cat:"Cheat"},
    {n:"Ribeye steak (200g)",c:540,p:40,q:"200g cooked",cat:"Cheat"},
    {n:"Creamy risotto",c:520,p:12,q:"1 bowl (280g)",cat:"Cheat"},
    {n:"Seafood platter",c:680,p:48,q:"full platter",cat:"Cheat"},
    {n:"Dessert platter (shared)",c:600,p:8,q:"shared 3-item dessert",cat:"Cheat"},
  ],
  "📦 Order In": [
    {n:"Large pizza (3 slices)",c:750,p:30,q:"3 slices (pepperoni)",cat:"Cheat"},
    {n:"Chicken burger meal (burger+fries+drink)",c:900,p:40,q:"full meal deal",cat:"Cheat"},
    {n:"Biryani (order-in, large)",c:650,p:30,q:"1 plate (350g)",cat:"Cheat"},
    {n:"Pad Thai (takeout box)",c:500,p:20,q:"1 box (300g)",cat:"Cheat"},
    {n:"Sushi platter (12 pcs)",c:480,p:22,q:"12 pieces assorted",cat:"Cheat"},
    {n:"Shawarma platter with sides",c:680,p:35,q:"1 platter",cat:"Cheat"},
    {n:"Fried chicken bucket (3 pcs + sides)",c:900,p:55,q:"3 pcs + fries + coleslaw",cat:"Cheat"},
    {n:"Chinese noodles (takeout box)",c:580,p:18,q:"1 box (300g)",cat:"Cheat"},
    {n:"Burger + loaded fries",c:850,p:36,q:"1 burger + large fries",cat:"Cheat"},
  ],
  "🍺 Drinks": [
    {n:"Beer — pint (500ml)",c:215,p:2,q:"500ml pint",cat:"Cheat"},
    {n:"Whisky — 2 pegs (60ml)",c:130,p:0,q:"60ml neat/on rocks",cat:"Cheat"},
    {n:"Red wine — 2 glasses (300ml)",c:250,p:0,q:"2 × 150ml glass",cat:"Cheat"},
    {n:"Rum & cola — 2 drinks",c:360,p:0,q:"2 × 300ml",cat:"Cheat"},
    {n:"Cocktails — 2 rounds",c:400,p:0,q:"2 standard cocktails",cat:"Cheat"},
    {n:"Shots — 3 tequilas",c:195,p:0,q:"3 × 30ml",cat:"Cheat"},
    {n:"Milkshake (large, thick)",c:550,p:10,q:"500ml",cat:"Cheat"},
    {n:"Frappuccino (large)",c:380,p:5,q:"500ml",cat:"Cheat"},
    {n:"Breezer / alcopop (2 bottles)",c:360,p:0,q:"2 × 275ml",cat:"Cheat"},
  ],
  "🍰 Treats": [
    {n:"Cheesecake (large slice)",c:480,p:7,q:"1 large slice (150g)",cat:"Cheat"},
    {n:"Ice cream — 3 scoops",c:390,p:6,q:"3 scoops (195g)",cat:"Cheat"},
    {n:"Chocolate lava cake",c:450,p:7,q:"1 piece (150g)",cat:"Cheat"},
    {n:"Brownie + ice cream",c:560,p:7,q:"1 brownie + 1 scoop",cat:"Cheat"},
    {n:"Gulab jamun (3 pcs)",c:375,p:6,q:"3 pieces in syrup",cat:"Cheat"},
    {n:"Doughnut glazed (2)",c:500,p:6,q:"2 glazed doughnuts",cat:"Cheat"},
    {n:"Waffles with syrup + cream",c:530,p:8,q:"2 waffles loaded",cat:"Cheat"},
    {n:"Cinnamon roll (large)",c:390,p:6,q:"1 large roll (120g)",cat:"Cheat"},
    {n:"Mango kulfi (2 pcs)",c:280,p:5,q:"2 pieces (120g)",cat:"Cheat"},
  ],
};

function cheatRecoveryPlan(surplus: number, plan?: Plan | null): {meals: string; workout: string; emoji: string} {
  if (surplus < 200) return {meals:"You're within range — no change needed.",workout:"Optional: 15 min walk.",emoji:"😊"};
  if (surplus < 500) return {meals:`Lighten tomorrow's dinner by ~${Math.round(surplus*0.5)} kcal — skip the carb, add salad.`,workout:"Add 25 min brisk walk or light cardio.",emoji:"💪"};
  if (surplus < 900) return {meals:`Drop ~${Math.round(surplus*0.45)} kcal from tomorrow's lunch + dinner. Skip evening snack.`,workout:"40–50 min cardio tomorrow (run, cycle, or HIIT).",emoji:"🔥"};
  return {meals:`2-day recovery: cut ~${Math.round(surplus*0.3)} kcal/day. Focus on protein + veggies, skip heavy carbs.`,workout:"2 × 45 min cardio over next 2 days.",emoji:"⚡"};
}

function CheatDayZone({dd, plan, dayCalTarget, onUpdate}: {
  dd: DayTracking; plan?: Plan|null; dayCalTarget: number;
  onUpdate: (dd: DayTracking) => void;
}) {
  const GREEN="#1DAA61";
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(Object.keys(CHEAT_PACKS)[0]);
  const cheatLog = dd.cheatLog || [];
  const cheatTotal = cheatLog.reduce((s, x) => s + x.cal, 0);
  const recovery = cheatRecoveryPlan(cheatTotal, plan);

  function addCheat(f: LogFood) {
    onUpdate({...dd, cheatLog: [...cheatLog, {n:f.n, cal:f.c, p:f.p||0, qty:f.q, servings:1}]});
  }
  function removeCheat(i: number) {
    onUpdate({...dd, cheatLog: cheatLog.filter((_,idx)=>idx!==i)});
  }

  return (
    <div className="mb-4 rounded-2xl overflow-hidden" style={{border:"1px solid rgba(255,160,0,0.30)",background:"linear-gradient(135deg,#1a0e00 0%,#251500 100%)"}}>
      {/* Header */}
      <button className="w-full flex items-center justify-between px-4 py-3.5"
        onClick={()=>setOpen(o=>!o)}>
        <div className="flex items-center gap-2.5">
          <span style={{fontSize:22}}>🎉</span>
          <div className="text-left">
            <div className="font-black text-sm" style={{color:"#FFB347"}}>Cheat Day Zone</div>
            <div className="text-xs" style={{color:"rgba(255,179,71,0.55)"}}>
              {cheatTotal>0?`${cheatTotal} kcal logged · tap to ${open?"close":"edit"}`:"Log treats, drinks & splurge meals"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {cheatTotal>0&&(
            <span className="font-black text-sm px-2.5 py-0.5 rounded-full" style={{background:"rgba(255,179,71,0.18)",color:"#FFB347"}}>+{cheatTotal} kcal</span>
          )}
          <span style={{color:"rgba(255,179,71,0.5)",fontSize:18,transform:open?"rotate(180deg)":"none",transition:"transform 0.25s"}}>⌄</span>
        </div>
      </button>

      {open&&(
        <div className="px-4 pb-4">
          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
            {Object.keys(CHEAT_PACKS).map(k=>(
              <button key={k} onClick={()=>setTab(k)}
                className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={tab===k?{background:"#FFB347",color:"#1a0e00"}:{background:"rgba(255,179,71,0.12)",color:"rgba(255,179,71,0.70)"}}>
                {k}
              </button>
            ))}
          </div>

          {/* Food grid */}
          <div className="grid grid-cols-1 gap-1.5 mb-3">
            {CHEAT_PACKS[tab].map((f,i)=>(
              <button key={i} onClick={()=>addCheat(f)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all active:scale-[0.98]"
                style={{background:"rgba(255,179,71,0.08)",border:"1px solid rgba(255,179,71,0.14)"}}>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">{f.n}</div>
                  <div className="text-xs" style={{color:"rgba(255,255,255,0.38)"}}>{f.q}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-black text-sm" style={{color:"#FFB347"}}>{f.c}</span>
                  <span className="text-xs" style={{color:"rgba(255,179,71,0.5)"}}>kcal</span>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{background:"rgba(255,179,71,0.20)",color:"#FFB347"}}>+</span>
                </div>
              </button>
            ))}
          </div>

          {/* Logged items */}
          {cheatLog.length>0&&(
            <div className="rounded-2xl p-3 mb-3" style={{background:"rgba(0,0,0,0.3)"}}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{color:"rgba(255,179,71,0.5)"}}>Logged today</p>
              {cheatLog.map((x,i)=>(
                <div key={i} className="flex items-center justify-between py-1.5 border-b" style={{borderColor:"rgba(255,179,71,0.10)"}}>
                  <span className="text-sm text-white/80">{x.n}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{color:"#FFB347"}}>{x.cal} kcal</span>
                    <button onClick={()=>removeCheat(i)} className="text-red-400/60 hover:text-red-400 text-xs">✕</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between mt-2 pt-1">
                <span className="text-xs font-black" style={{color:"#FFB347"}}>Total</span>
                <span className="text-sm font-black" style={{color:"#FFB347"}}>{cheatTotal} kcal</span>
              </div>
            </div>
          )}

          {/* Recovery plan */}
          {cheatTotal>200&&(
            <div className="rounded-2xl px-4 py-3" style={{background:"rgba(255,179,71,0.08)",border:"1px solid rgba(255,179,71,0.20)"}}>
              <p className="font-black text-sm mb-2" style={{color:"#FFB347"}}>{recovery.emoji} Recovery plan</p>
              <div className="space-y-1.5">
                <div className="flex gap-2 text-xs" style={{color:"rgba(255,255,255,0.65)"}}>
                  <span>🍽️</span><span>{recovery.meals}</span>
                </div>
                <div className="flex gap-2 text-xs" style={{color:"rgba(255,255,255,0.65)"}}>
                  <span>🏃</span><span>{recovery.workout}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
    "Yoga":                      "Walks / light",
    "Pilates":                   "Walks / light",
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
  /* Use male formula only for "Male"; all other genders use female formula
     (more conservative estimate, lower calorie floor — medically safer)     */
  const isFemale = d.sex !== "Male";

  /* Adjusted Body Weight for obesity (ASPEN clinical guidelines):
     Adipose tissue has ~40% of lean metabolic activity. IBW uses BMI-22
     target for South Asian adults per WHO Asia-Pacific 2004.            */
  const bmiRaw = cm > 0 ? w / ((cm / 100) ** 2) : 22;
  const ibwKg   = 22 * (cm / 100) ** 2;
  const calcW    = bmiRaw > 30 ? ibwKg + 0.4 * (w - ibwKg) : w;

  /* Mifflin-St Jeor BMR (1990) — most validated formula for general adults */
  const bmr = isFemale
    ? 10 * calcW + 6.25 * cm - 5 * age - 161
    : 10 * calcW + 6.25 * cm - 5 * age + 5;

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
  } else if (effectiveGoal === "Muscle gain" || effectiveGoal === "Weight gain") {
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

function pickMeal(slot: string, target: number, di: number, used: Set<string>, dayUsed: Set<string>, ctx: MealCtx): FoodItem {
  let list: FoodItem[]=[];
  for (let r=0;r<3&&!list.length;r++) list=cands(slot,ctx,r);
  if (!list.length) return {n:"Seasonal fruit & nuts",c:target,q:"1 serving",slot:[slot],reg:["all"],t:[]};
  const scored=list.map(f=>{
    let s=-Math.abs(f.c-target)/Math.max(target,1);
    if ((ctx.goal==="Muscle gain"||ctx.goal==="Weight gain")&&f.t.includes("protein")) s+=0.45;
    if ((ctx.goal==="Weight loss"||ctx.cond==="Diabetes / pre-diabetes"||ctx.cond==="PCOS / PCOD")&&(f.t.includes("lowgi")||f.t.includes("fiber"))) s+=0.3;
    if (ctx.cond==="PCOS / PCOD"&&f.t.includes("protein")) s+=0.3;
    if (ctx.cond==="High cholesterol"&&f.t.includes("fiber")) s+=0.2;
    if (["Pregnant","Breastfeeding"].includes(ctx.cond)&&f.t.includes("protein")) s+=0.35;
    if (ctx.simplePref&&f.simple) s+=0.25;
    if (picksMatch(f,ctx.picks)) s+=0.6;
    if (dayUsed.has(f.n)) s-=100;  // hard ban: never same dish twice in one day
    else if (used.has(f.n)) s-=4.0;  // strong cross-day penalty
    s+=(hashNum(f.n+di)%100)/900;
    return {f,s};
  }).sort((a,b)=>b.s-a.s);
  return scored[0].f;
}

function makeTips(p: Profile, _cal: number): string[] {
  const goalTips: Record<string,string[]>={
    "Weight loss":    ["Put protein in every meal — it keeps you full and protects muscle.","Finish dinner 2-3 hours before bed."],
    "Muscle gain":    ["Hit protein at every single meal — aim for a palm-sized source.","Eat your post-workout meal within 45 minutes of training."],
    "Weight gain":    ["Eat 4-5 meals/day — more frequent eating helps you hit your calorie surplus naturally.","Go for calorie-dense whole foods: nuts, banana, ghee, whole milk, avocado, peanut butter.","Pair every meal with a protein source so the weight you gain includes lean mass."],
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
  /* HYROX stations */
  "Ski erg":{muscles:["Lats","Triceps","Core","Shoulders","Cardio"],steps:["Stand facing the ski erg handle; grab both handles above your head","Drive arms down and back in a powerful sweeping motion, bending your knees slightly","Follow through until arms pass your hips; use hip hinge to add power","Reset arms overhead with control and immediately repeat","Keep a steady rhythm — smooth strokes beat frantic ones"],tip:"Hinge at the hip every stroke — it's more like a deadlift than an arm exercise. That's where the power comes from.",emoji:"🎿",burnType:"cardio"},
  "Sled push":{muscles:["Quads","Glutes","Calves","Shoulders","Core"],steps:["Load the sled with appropriate weight; place hands on the uprights at hip height","Drive one foot back and push powerfully off the ground, like a sprint start","Keep hips low and back flat — don't stand upright during the push","Take short, powerful steps and drive through your whole foot","Push continuously until the distance is complete"],tip:"Low hips = more power. The moment you stand up tall, the sled slows down — stay aggressive and low.",emoji:"🛷",burnType:"compound"},
  "Sled pull":{muscles:["Back","Biceps","Hamstrings","Core","Glutes"],steps:["Attach a harness or rope to the sled; face away from the sled","Hold the rope at arm's length and lean forward slightly at the hip","Drive your feet into the ground, taking short powerful backward steps","Pull the rope hand over hand, keeping tension throughout","Stay low and maintain a powerful hip position — don't bend over too far"],tip:"Think of it as a reverse sled push — keep that same low, powerful hip position for maximum drive.",emoji:"⛓️",burnType:"compound"},
  "Burpee broad jumps":{muscles:["Full body","Glutes","Quads","Chest","Cardio"],steps:["Stand with feet shoulder-width apart","Drop your hands to the floor and jump feet back into a plank (no push-up in HYROX)","Jump feet back toward hands","Explode forward with a powerful broad jump — aim for maximum distance","Land softly in a quarter-squat and immediately flow into the next rep"],tip:"The broad jump is the scoring distance — spend energy on the jump, not the plank. Keep the floor portion brisk and efficient.",emoji:"🦘",burnType:"cardio"},
  "Rowing (erg)":{muscles:["Back","Legs","Core","Biceps","Cardio"],steps:["Sit on the erg, feet strapped in, knees bent, shins vertical","Hinge forward from the hip and grip the handle","Drive powerfully through your legs first — legs, then lean back, then pull arms","Pull the handle to your lower chest, elbows driving past your torso","Return in reverse: arms out, lean forward, slide in — stay fluid"],tip:"It's 60% legs, 20% back, 20% arms. Most beginners over-arm-pull — focus on the leg drive as the primary power source.",emoji:"🚣",burnType:"cardio"},
  "Farmers carry":{muscles:["Grip","Trapezius","Core","Glutes","Legs"],steps:["Pick up two heavy dumbbells or kettlebells at your sides — hip hinge, neutral back","Stand tall, shoulders back and down, core braced tight","Walk with purpose — short, controlled steps; don't let the weights sway","Keep your gaze forward and breathe steadily throughout","Set weights down under control and pick back up for the next rep"],tip:"If your grip fails before your legs and core, use chalk. But let grip be your training signal — it's the first thing to give out in a race.",emoji:"🧺",burnType:"compound"},
  "Sandbag lunges":{muscles:["Quads","Glutes","Core","Balance","Shoulders"],steps:["Hoist a sandbag onto one shoulder or hold it in a bear hug at chest height","Step forward with one foot; lower the back knee toward the floor","Keep torso upright — the sandbag will try to pull you forward; resist","Push through the front heel to return to standing","Alternate legs each step, covering the required distance"],tip:"Shoulder carry is harder than bear hug but better training for race day. Keep the bag high and tight — a drooping bag kills your balance.",emoji:"💼",burnType:"compound"},
  "Wall balls":{muscles:["Quads","Glutes","Shoulders","Core","Cardio"],steps:["Hold a 6–9 kg medicine ball at your chest; stand 30 cm from the wall","Squat down to at least parallel, keeping the ball at chest and chest up","Drive up explosively and press the ball at the wall target (3 m up)","Catch the ball as it falls, absorbing into a squat immediately","Cycle continuously — squat, throw, catch forms one fluid movement"],tip:"The catch drives you into the next squat — don't fight it. Let gravity load the next rep. Rhythm beats power every time.",emoji:"🏐",burnType:"compound"},
  /* ── Dumbbell extras ── */
  "DB shrug":{muscles:["Upper trapezius","Neck"],steps:["Hold dumbbells at sides, arms straight","Shrug shoulders straight up toward your ears as high as possible","Hold the peak contraction for 1 second","Lower slowly — don't roll your shoulders, just straight up and down","Keep your neck neutral throughout"],tip:"Think of trying to touch your ears with your shoulders — no rolling, just pure elevation.",emoji:"🤷",burnType:"isolation"},
  "DB step-ups":{muscles:["Quads","Glutes","Hamstrings","Balance"],steps:["Hold dumbbells at sides; stand facing a bench or box (40–50 cm)","Step one foot fully onto the bench; drive through that heel to stand on top","Bring the other foot up to meet it","Step back down with the leading foot, then the other","Complete all reps on one side before switching"],tip:"Drive through the heel of the elevated foot — this activates your glute, not just your quad.",emoji:"🪜",burnType:"compound"},
  "DB Russian twist":{muscles:["Obliques","Core","Hip flexors"],steps:["Sit on the floor, knees bent, feet flat (or raised for harder)","Lean back to ~45°, holding one dumbbell with both hands at your chest","Rotate your torso to the right, bringing the dumbbell beside your hip","Return to centre, then rotate to the left — that's one rep","Keep your lower back rounded slightly — this is core work, not a back exercise"],tip:"Move slowly and breathe — fast twisting with a weight builds momentum, not muscle.",emoji:"🌀",burnType:"isolation"},
  "DB thrusters":{muscles:["Full body","Quads","Glutes","Shoulders","Triceps"],steps:["Hold dumbbells at shoulder height, feet shoulder-width apart","Drop into a full squat — thighs at least parallel to the floor","As you stand, use the momentum to press both dumbbells overhead","Arms fully extended at the top; lower weights back to shoulders as you descend","Each rep is a continuous squat-to-press in one fluid movement"],tip:"The power comes from your legs — think of your arms catching the bar, not pressing it. The squat drives the press.",emoji:"🚀",burnType:"compound"},
  /* ── Gym push ── */
  "Barbell bench press":{muscles:["Chest","Triceps","Front shoulders"],steps:["Lie on the bench, eyes under the bar; grip slightly wider than shoulder-width","Unrack the bar and hold it directly over your lower chest","Lower the bar with control, touching your chest lightly","Drive your feet into the floor and press the bar back up to the start","Keep shoulder blades retracted and lower back slightly arched throughout"],tip:"The bar path isn't straight up — it travels in a slight arc toward your head at the top. Follow that arc.",emoji:"🏋️",burnType:"compound"},
  "Incline DB press":{muscles:["Upper chest","Front shoulders","Triceps"],steps:["Set bench to 30–45°; hold dumbbells at chest level, elbows flared 45°","Press both weights up and slightly inward — they nearly touch at the top","Lower under control until upper arms are slightly below bench level","Keep wrists straight and core braced throughout","Breathe in on the way down, forcefully out on the press"],tip:"30° incline targets upper chest better than 45° — the higher the angle, the more it becomes a shoulder press.",emoji:"📐",burnType:"compound"},
  "Seated shoulder press":{muscles:["Front deltoids","Side deltoids","Triceps"],steps:["Sit upright on a bench, dumbbells at shoulder height, palms forward","Press both weights straight overhead until arms are nearly locked","Don't let the weights drift forward — keep them over your shoulders","Lower slowly back to shoulder height","Keep your core tight and lower back against the pad"],tip:"Seated reduces cheating with leg drive — harder than standing, better shoulder isolation.",emoji:"🏆",burnType:"compound"},
  "Cable fly":{muscles:["Chest","Front shoulders"],steps:["Set cables to shoulder height; hold one handle in each hand, step forward","Start with arms wide, slight bend in elbows — feel the chest stretch","Bring hands together in an arc in front of your chest, squeezing pecs hard","Hold the contracted position for 1 second","Return slowly and controlled — feel the stretch on the way back"],tip:"The peak contraction at the centre is everything — don't rush through it. Slow the movement down.",emoji:"🦋",burnType:"isolation"},
  "Triceps pushdown":{muscles:["Triceps"],steps:["Attach a rope or bar to the high cable; stand facing the machine","Grip the handle with both hands, elbows pinned to your sides at 90°","Push the handle down until arms are fully extended — elbows stay fixed","Squeeze the triceps hard at the bottom","Let the cable raise your hands back to 90° — feel the stretch"],tip:"Keep elbows locked at your sides throughout. If they flare out, you're using chest and shoulders, not triceps.",emoji:"💪",burnType:"isolation"},
  /* ── Gym pull ── */
  "Lat pulldown":{muscles:["Latissimus dorsi","Biceps","Rear shoulders"],steps:["Sit facing the machine; grip the bar slightly wider than shoulder-width, palms forward","Lean back 5–10° and pull the bar down to your upper chest","Squeeze your lats at the bottom — imagine bending the bar into an arc","Return the bar slowly under control — full extension at the top","Don't shrug your shoulders; keep them down and back throughout"],tip:"Think of driving your elbows down to your back pockets — this fires the lats instead of the biceps.",emoji:"🏋️",burnType:"compound"},
  "Seated cable row":{muscles:["Middle back","Lats","Biceps","Rear shoulders"],steps:["Sit at the cable row machine, feet on the foot rests, slight knee bend","Hold the V-bar handle with both hands, arms extended, back upright","Pull the handle to your lower chest/upper stomach, driving elbows back","Squeeze your shoulder blades together at the end of the row","Extend arms slowly — don't round your back as you return"],tip:"Keep your torso upright throughout — lean forward on the extension, not on the pull.",emoji:"🚣",burnType:"compound"},
  "Barbell / machine row":{muscles:["Back (thickness)","Biceps","Rear shoulders","Core"],steps:["For barbell: hinge at hips to 45°, grip bar slightly wider than shoulder-width","Let the bar hang at arm's length","Pull bar to your lower stomach, keeping elbows close to your body","Squeeze shoulder blades at the top; hold briefly","Lower with control — full extension each rep"],tip:"Imagine pinching a pencil between your shoulder blades at the top of every rep — that's how you know you're hitting the mid-back.",emoji:"🏋️",burnType:"compound"},
  "Face pulls":{muscles:["Rear deltoids","External rotators","Trapezius"],steps:["Set cable to head height with a rope attachment","Grab the rope with both hands, step back until there's tension","Pull the rope toward your face, spreading the ends apart (hands go to your ears)","Keep elbows high — parallel to the floor — at all times","Return slowly under control"],tip:"High elbows are non-negotiable here. If your elbows drop, you've turned it into a row — keep them level with your head.",emoji:"😤",burnType:"isolation"},
  "Barbell / DB curl":{muscles:["Biceps","Forearms"],steps:["Stand holding a barbell or dumbbells, arms extended, palms up","Keep elbows pinned to your sides — they don't move","Curl the weight up toward your shoulders by bending your elbows","Squeeze biceps hard at the top for 1 second","Lower slowly — 3 seconds — to full extension"],tip:"Full extension at the bottom is crucial — many people cut the range short, missing the stretch that drives growth.",emoji:"💪",burnType:"isolation"},
  /* ── Gym legs ── */
  "Barbell squat":{muscles:["Quads","Glutes","Hamstrings","Core","Back"],steps:["Position bar on your upper traps (not your neck); step back from the rack","Feet shoulder-width apart, toes out 15–30°","Brace core and break at the hips and knees simultaneously","Squat until thighs are at least parallel — lower is better if your mobility allows","Drive through your heels and mid-foot to stand, knees tracking over toes"],tip:"Before you unrack, take a huge breath and brace like you're about to take a punch — that intra-abdominal pressure protects your spine.",emoji:"🏋️",burnType:"compound"},
  "Leg press":{muscles:["Quads","Glutes","Hamstrings"],steps:["Sit in the machine, feet on the platform hip-width, toes slightly out","Lower the platform by bending knees to 90° or deeper","Push through your full foot to extend legs — don't lock knees hard","Keep your lower back flat against the seat throughout","Control the descent — don't let the weight drop"],tip:"Foot placement changes emphasis: high = more hamstrings/glutes; low = more quads. Start mid-platform and experiment.",emoji:"🦵",burnType:"compound"},
  "Romanian deadlift":{muscles:["Hamstrings","Glutes","Lower back"],steps:["Hold a barbell or dumbbells at hip height, feet hip-width apart","Push your hips back and hinge forward, keeping the bar close to your legs","Maintain a flat back — don't round — and feel a deep hamstring stretch","Lower the bar to mid-shin (or wherever your hamstring flexibility stops you)","Drive hips forward to stand, squeezing glutes hard at the top"],tip:"It's a hip hinge, not a squat or a deadlift. If your knees are bending a lot, you're squatting. Think 'push hips back, not knees down'.",emoji:"🏋️",burnType:"compound"},
  "Leg curl":{muscles:["Hamstrings","Calves"],steps:["Lie face down on the leg curl machine, pad resting just above your heels","Curl your legs toward your glutes in a smooth arc","Squeeze hamstrings hard at the top — hold 1 second","Lower slowly to full extension — don't let the weight slam","Keep hips pressed down into the pad throughout"],tip:"Go slower on the way down — the eccentric (lowering) phase is where hamstring strength is really built.",emoji:"🦵",burnType:"isolation"},
  "Leg extension":{muscles:["Quadriceps"],steps:["Sit in the machine, pad resting on the front of your lower shin","Extend legs until straight, squeezing quads hard at the top","Hold peak contraction 1 second","Lower slowly — 3 seconds — back to starting position","Keep your back against the seat and don't swing"],tip:"Leg extensions are an isolation exercise — go lighter than you think and feel the quad working, don't just throw the weight up.",emoji:"🦵",burnType:"isolation"},
  "Standing calf raise":{muscles:["Gastrocnemius","Soleus"],steps:["Stand on the calf raise machine or edge of a step, shoulder pads on","Rise as high onto your toes as possible — full plantar flexion","Hold the peak for 1 full second","Lower slowly until heels are below the step for a full stretch","Repeat — avoid bouncing between reps"],tip:"Slow eccentrics (3-second lower) build far more calf mass than quick bouncing reps. Most people train calves too fast.",emoji:"🦶",burnType:"isolation"},
  /* ── Gym core ── */
  "Hanging leg raise":{muscles:["Lower abs","Hip flexors","Core"],steps:["Hang from a pull-up bar with an overhand grip, arms extended","Keep your legs straight (or bent for beginner) and brace your core","Raise legs until they're at least parallel to the floor — higher if you can","Lower slowly under control — don't swing","Use abs to initiate the movement, not momentum"],tip:"If you can't stop swinging, pause at the bottom on every rep before going again. Momentum makes this a hip flexor exercise, not core.",emoji:"🏃",burnType:"isolation"},
  "Cable crunch":{muscles:["Rectus abdominis","Obliques"],steps:["Attach a rope to the high cable; kneel facing the machine","Hold the rope at your temples or behind your head","Crunch down, driving your elbows toward your knees","Focus on rounding your lumbar spine — your hips should stay relatively still","Slowly return — don't let the cable snap you back up"],tip:"You're crunching your spine, not doing a hip hinge. Most people hinge at the hips — that works hip flexors, not abs.",emoji:"⚡",burnType:"isolation"},
  "Cable woodchopper":{muscles:["Obliques","Core","Shoulders"],steps:["Set the cable to shoulder height; stand side-on to the machine","Grab the handle with both hands and arms extended","Rotate and pull the cable diagonally downward — like chopping wood","Follow through until hands pass your opposite hip","Return slowly under control, keeping core braced throughout"],tip:"The power comes from rotating your torso, not your arms. Initiate the movement from your core, not your shoulders.",emoji:"🪓",burnType:"compound"},
  /* ── Gym cardio ── */
  "Treadmill incline walk":{muscles:["Glutes","Hamstrings","Calves","Cardio"],steps:["Set treadmill to 10–12% incline and 5–6 km/h walking speed","Hold the sides lightly for balance — don't lean on the rails","Walk for 20–30 min at steady pace","Keep your torso upright; don't hunch over the display","Cool down last 3 min by lowering incline gradually"],tip:"No holding the handrails — that eliminates the calorie burn and glute activation. Use them only for balance.",emoji:"⛰️",burnType:"cardio"},
  "Rowing machine":{muscles:["Back","Legs","Core","Biceps","Cardio"],steps:["Sit on the erg, feet strapped in, shins vertical","Hinge forward, grip the handle and keep arms straight","Drive powerfully through your legs first","As legs straighten, lean back slightly and pull handle to your lower chest","Return: arms out → lean forward → slide in. Stay fluid"],tip:"It's 60% legs, 20% back, 20% arms — the leg drive is everything. If your arms are tired before your legs, you're using the wrong muscles.",emoji:"🚣",burnType:"cardio"},
  "Cycling intervals":{muscles:["Quads","Glutes","Hamstrings","Calves","Cardio"],steps:["Set up the stationary bike at a comfortable saddle height","Warm up 3 min at easy resistance","Sprint at high resistance for 30 seconds — push hard","Active recovery for 90 seconds at easy resistance","Repeat for 8–12 rounds; cool down 3 min"],tip:"During the sprint, stand on the pedals for the last 10 seconds to recruit glutes and hamstrings on top of quads.",emoji:"🚴",burnType:"cardio"},
  /* ── Outdoor ── */
  "Brisk walk / jog":{muscles:["Legs","Cardio","Core"],steps:["Start with a 3–5 min easy walk to warm up","Increase pace to where you can talk but are breathing noticeably","Maintain steady pace for the target duration (25–30 min)","Keep arms bent at 90°, swinging naturally in sync with legs","Cool down last 3 min with a slow walk"],tip:"If you can recite a full paragraph without pausing, speed up. If you can't say a single word, slow down — aim for the middle.",emoji:"🚶",burnType:"cardio"},
  "Run intervals":{muscles:["Full body","Cardio","Legs","Core"],steps:["Warm up 5 min at easy jog pace","Sprint at 80–90% effort for 1 minute","Jog or walk for 2 minutes to recover","Repeat the hard/easy cycle 6–8 times","Cool down 5 min at easy walk"],tip:"Your sprint pace should feel uncomfortable enough that you're genuinely happy when the minute is up. Easy run pace means you could hold a short conversation.",emoji:"🏃",burnType:"cardio"},
  "Stair climbs":{muscles:["Glutes","Quads","Calves","Cardio"],steps:["Find a staircase with 3+ flights; stand at the bottom","Climb at a brisk pace, pushing through the full foot","At the top, walk back down — don't skip down the stairs","Continue climbing for 10–15 min total","Rest 1–2 min between rounds if needed"],tip:"Take two steps at a time on alternate rounds — it dramatically increases glute and hamstring activation.",emoji:"🪜",burnType:"cardio"},
  "Skipping rope":{muscles:["Calves","Shoulders","Core","Cardio"],steps:["Hold rope handles at hip height, elbows close to body","Swing the rope overhead and jump — stay on the balls of your feet","Keep jumps small — just enough to clear the rope","Start with 30 sec on / 30 sec rest; build up","Keep your core tight and posture upright throughout"],tip:"The jump should be tiny — 1–2 cm off the ground. Beginners jump too high and tire out quickly. Light, fast feet beat big jumps.",emoji:"🪃",burnType:"cardio"},
  "Cycling":{muscles:["Quads","Glutes","Hamstrings","Calves","Cardio"],steps:["Check saddle height — knee should be slightly bent at the lowest pedal position","Start at an easy gear for 3 min to warm up","Build to a pace where you're breathing hard but can still hold form","Maintain a cadence of 70–90 RPM (pedalling rhythm)","Cool down last 5 min in an easy gear"],tip:"High cadence in a lower gear is much easier on your knees than grinding a big gear slowly — spin, don't grind.",emoji:"🚴",burnType:"cardio"},
  "Walking lunges":{muscles:["Quads","Glutes","Hamstrings","Balance"],steps:["Stand tall, hands at sides or on hips","Step forward with one leg and lower until back knee nearly touches the ground","Front shin should be vertical; front knee over ankle","Push through the front heel and step the back foot forward to lunge on the other side","Continue alternating, covering distance with each lunge"],tip:"Keep your torso completely upright — a forward lean means you're losing the glute activation and putting stress on your knee.",emoji:"🚶",burnType:"compound"},
  "Bench step-ups":{muscles:["Quads","Glutes","Hamstrings","Balance"],steps:["Stand facing a park bench or low wall (40–50 cm)","Step one foot fully onto the surface","Drive through that heel to bring your full body up","Step back down with the same foot leading","Complete all reps on one side, then switch"],tip:"The key is stepping back down with control — the eccentric (lowering) phase is where most of the glute work happens.",emoji:"🪑",burnType:"compound"},
  "Park bar rows":{muscles:["Back","Biceps","Rear shoulders","Core"],steps:["Find a horizontal bar at a park (waist to chest height works best)","Grip the bar with both hands and walk your feet forward until you're hanging at an angle","Pull your chest up to the bar, keeping elbows close","Squeeze shoulder blades together at the top","Lower with control — your body is the resistance"],tip:"The more horizontal your body (feet further forward), the harder it gets. Start at 45° and work toward flat.",emoji:"🌳",burnType:"compound"},
  /* ── Yoga poses ── */
  "Sun salutation":{muscles:["Full body","Spine","Shoulders","Legs","Core"],steps:["Stand tall at the front of your mat (Tadasana)","Inhale: raise arms overhead (Urdhva Hastasana)","Exhale: fold forward, hands to floor (Uttanasana)","Inhale: step or jump back to plank; exhale: lower to low push-up (Chaturanga)","Inhale: Upward dog; exhale: Downward dog — hold 5 breaths then flow forward"],tip:"Move with your breath — each transition is one breath. When the breath leads, the flow becomes meditation.",emoji:"☀️",burnType:"compound"},
  "Warrior I":{muscles:["Quads","Glutes","Hip flexors","Shoulders","Core"],steps:["From Downward dog, step one foot between your hands","Back foot flat, angled 45° outward; front knee directly over ankle","Rise up, raising arms overhead and squaring your hips to the front","Hold for 5–8 deep breaths — feel the hip flexor stretch in the back leg","Exhale to Downward dog and switch sides"],tip:"Square your hips fully forward — most people let the back hip flare out. Draw the back hip forward to get the full stretch.",emoji:"⚔️",burnType:"hold"},
  "Warrior II":{muscles:["Quads","Glutes","Hip abductors","Shoulders","Core"],steps:["Stand with feet wide (about 1 leg's length apart)","Front foot points forward; back foot points out 90°","Bend front knee directly over the front ankle — thigh parallel to floor","Arms extend straight out to the sides at shoulder height","Gaze over the front hand — hold 5–8 breaths, then switch sides"],tip:"Sink deeper into the front leg bend on each exhale. Keep your front knee from collapsing inward — push it out over your pinky toe.",emoji:"⚔️",burnType:"hold"},
  "Tree pose":{muscles:["Glutes","Core","Ankles","Balance"],steps:["Stand on one foot; place the sole of the other foot on your inner thigh or calf (not knee)","Bring hands to prayer position at your chest","Fix your gaze (drishti) on one unmoving point ahead of you","Hold for 5–8 breaths; grow taller on each inhale","Release and switch sides"],tip:"Press your standing foot into the floor and your raised foot into your thigh — the mutual resistance creates stability.",emoji:"🌳",burnType:"hold"},
  "Chair pose":{muscles:["Quads","Glutes","Core","Shoulders"],steps:["Stand with feet together or hip-width","Inhale and raise arms overhead, palms facing each other","Exhale and sit back as if sitting in a chair — knees over ankles, not past toes","Keep chest lifted and torso long — don't collapse forward","Hold 5–8 breaths; feel the quad and glute burn"],tip:"Sit back, not down — weight on your heels, not your toes. If you lift your toes off the floor, you're in the right position.",emoji:"🪑",burnType:"hold"},
  "Cobra pose":{muscles:["Spine extensors","Chest","Shoulders","Glutes"],steps:["Lie face-down, hands under your shoulders, elbows close to your ribs","Press the tops of your feet and thighs into the floor","Inhale: slowly lift your chest using your back muscles — straighten arms only as far as your back allows","Keep your shoulders down and away from your ears","Hold 3–5 breaths; exhale to lower slowly"],tip:"Use your back muscles to lift, not just your arms. If you remove your hands from the floor, your back strength should hold you up.",emoji:"🐍",burnType:"hold"},
  "Downward dog":{muscles:["Hamstrings","Calves","Shoulders","Spine","Core"],steps:["Start on hands and knees; tuck toes and push hips up and back","Form an inverted V — hands shoulder-width, feet hip-width","Press the floor away with straight arms; drop your heels toward the mat","Draw your belly button toward your spine and breathe deeply","Hold 5–8 breaths; pedal feet alternately to warm calves"],tip:"If your hamstrings are tight, bend your knees generously. A flat back matters more than straight legs.",emoji:"🐕",burnType:"hold"},
  "Child's pose":{muscles:["Lower back","Hips","Shoulders","Spine"],steps:["Kneel with big toes touching; sit your hips back onto your heels","Walk hands forward and lower your forehead to the mat","Arms can extend forward (active) or rest alongside your body (passive)","Breathe deeply into your lower back — let it expand on each inhale","Hold as long as needed — this is a rest pose"],tip:"This is the recovery pose — use it whenever you need to rest between challenging poses. There's no wrong amount of time to hold it.",emoji:"🧘",burnType:"hold"},
  "Pigeon pose":{muscles:["Hip flexors","Piriformis","Glutes","IT band"],steps:["From Downward dog, bring one knee forward behind your same-side wrist","Extend the other leg straight behind you; lower hips toward the mat","Walk hands forward and fold over the front shin","Breathe into the deep outer hip stretch","Hold 8–10 breaths; push back to Downward dog and switch sides"],tip:"Place a folded blanket under your hip if your hip doesn't reach the floor — forcing the stretch creates injury, not progress.",emoji:"🕊️",burnType:"hold"},
  "Supine twist":{muscles:["Spine","Obliques","Glutes","IT band"],steps:["Lie on your back; draw one knee to your chest","Let that knee fall across your body while your arms extend out in a T-shape","Your gaze can go to the opposite side of the knee for a deeper neck release","Keep both shoulders on the floor — let gravity do the work","Hold 5–8 breaths and switch sides"],tip:"Exhale into the twist — each exhale allows you to rotate a little deeper. Never force it; gravity and time do the work.",emoji:"🌀",burnType:"hold"},
  "Boat pose":{muscles:["Rectus abdominis","Hip flexors","Lower back"],steps:["Sit with knees bent, hands on the floor behind you for support","Lean back slightly until your torso and thighs form a V-shape","Lift your feet off the floor — shins parallel to the floor is the starting point","For harder version: extend legs straight, arms forward parallel to floor","Hold 5–8 breaths; lower and repeat"],tip:"Keep your chest open and lifted — the moment you round your upper back, you lose the core engagement and strain your lower back.",emoji:"⛵",burnType:"hold"},
  "Warrior flow":{muscles:["Full body","Quads","Shoulders","Core","Balance"],steps:["Start in Warrior I — front knee bent, arms overhead, hips square","Exhale to Warrior II — arms open to the sides, hips open","Inhale to Reverse Warrior — back hand slides down back leg, front arm sweeps up","Exhale to Extended Side Angle — front forearm on front thigh, top arm reaches forward","Flow back through the sequence with each breath for 5 full rounds"],tip:"Flow at breath speed, not at fast speed. Each position should be held for exactly one full breath cycle — no rushing.",emoji:"🌊",burnType:"compound"},
  "Pranayama":{muscles:["Respiratory muscles","Diaphragm","Core"],steps:["Sit comfortably — cross-legged or in a chair with spine tall","Alternate nostril breathing: block right nostril, inhale left; block left, exhale right; inhale right; block right, exhale left — that's one cycle","Do 5–10 cycles slowly","Or try 4-7-8 breathing: inhale 4 counts, hold 7, exhale 8","Practice for 5–10 minutes before or after your yoga session"],tip:"The exhale is your parasympathetic trigger — making it twice as long as the inhale activates your rest-and-digest system.",emoji:"🌬️",burnType:"hold"},
  "Upward-facing dog":{muscles:["Chest","Spine extensors","Shoulders","Core"],steps:["Lie face-down; place hands under your shoulders, elbows close in","Press through your hands and the tops of your feet","Lift your chest, hips and thighs completely off the floor","Roll your shoulders back and open your chest wide","Keep legs active — squeeze thighs and push the floor away"],tip:"Unlike Cobra, your hips lift off the floor in Up-Dog. Only the tops of your feet and your hands touch the mat.",emoji:"☀️",burnType:"hold"},
  "Dolphin pose":{muscles:["Shoulders","Upper back","Core","Hamstrings"],steps:["Start on hands and knees; lower forearms to the floor (like a plank on forearms)","Tuck toes and lift hips up — similar to Downward Dog but on forearms","Press forearms firmly into the floor and push hips high","Drop your head between your arms; gaze toward your feet","Hold 5–8 breaths"],tip:"This is a shoulder-strengthener and inversion preparation — if full inversions feel too intense, Dolphin gives you many of the same benefits.",emoji:"🐬",burnType:"hold"},
  "Seated forward bend":{muscles:["Hamstrings","Lower back","Calves","Spine"],steps:["Sit with legs extended straight ahead; sit tall on your sit bones","Inhale to lengthen your spine; exhale and hinge forward from your hips","Reach for your feet, ankles or shins — wherever you reach without rounding your lower back badly","On each exhale, fold a little deeper","Hold 8–10 breaths; slowly rise on an inhale"],tip:"Bend your knees if needed to keep your back flat — a flat-backed fold with bent knees is far more effective than a rounded-back 'reach'.",emoji:"🧘",burnType:"hold"},
  "Bow pose":{muscles:["Spine","Chest","Shoulders","Hip flexors","Quads"],steps:["Lie face-down, arms at sides","Bend your knees and reach back with both hands to grab your ankles","Inhale and kick your feet up and back — this lifts your chest off the floor","Balance on your abdomen; roll your shoulders back and open your chest","Hold 3–5 breaths; release slowly and rest in Child's pose"],tip:"The kicking action of your feet does the work — you don't need to pull hard with your arms. Let your legs drive the backbend.",emoji:"🏹",burnType:"hold"},
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
  hyrox: {
    cardio:[{n:"Ski erg",note:"1000m / 4 min"},{n:"Rowing (erg)",note:"1000m / 4 min"},{n:"Run intervals",note:"1 km at race pace"}],
    push:  [{n:"Sled push",note:"2×25m"},{n:"Wall balls",note:"20 reps per set"},{n:"Burpee broad jumps",note:"4×20m"}],
    pull:  [{n:"Sled pull",note:"2×25m"},{n:"Farmers carry",note:"2×50m"},{n:"Sandbag lunges",note:"2×25m each leg"}],
    legs:  [{n:"Bodyweight squats"},{n:"Reverse lunges",note:"each leg"},{n:"Glute bridges"},{n:"Bulgarian split squat",note:"each leg"}],
    core:  [{n:"Plank",hold:true},{n:"Dead bug"},{n:"Mountain climbers"},{n:"Leg raises"}],
  },
  yoga: {
    cardio:[{n:"Sun salutation",note:"10 rounds"},{n:"Warrior flow",note:"5 breaths each side"}],
    push:  [{n:"Cobra pose",hold:true},{n:"Upward-facing dog",hold:true},{n:"Dolphin pose",hold:true}],
    pull:  [{n:"Downward dog",hold:true,note:"30 sec"},{n:"Seated forward bend",hold:true},{n:"Bow pose",hold:true}],
    legs:  [{n:"Warrior I",hold:true,note:"each side"},{n:"Warrior II",hold:true,note:"each side"},{n:"Chair pose",hold:true},{n:"Tree pose",hold:true,note:"each side"}],
    core:  [{n:"Boat pose",hold:true},{n:"Plank",hold:true},{n:"Side plank",hold:true,note:"each side"}],
    restore:[{n:"Child's pose",hold:true,note:"rest pose"},{n:"Pigeon pose",hold:true,note:"each side"},{n:"Supine twist",hold:true,note:"each side"}],
  },
};
const PLACE_KEY: Record<string,string> = {
  "Home — no equipment":"home","Home — dumbbells / bands":"dumbbell",
  "Full gym":"gym","Outdoor / cardio":"outdoor","HYROX Gym":"hyrox","Yoga Studio":"yoga",
};
/* Infer workout location from exercise type when workoutPlace not asked */
const EXERCISE_TO_PLACE: Record<string,string> = {
  "Running / jogging":  "Outdoor / cardio",
  "Cycling":            "Outdoor / cardio",
  "Swimming":           "Outdoor / cardio",
  "Yoga":               "Yoga Studio",
  "Pilates":            "Home — no equipment",
  "Yoga / Pilates":     "Home — no equipment",
  "Home workouts":      "Home — no equipment",
  "Gym (weights)":      "Full gym",
  "Sports / games":     "Outdoor / cardio",
  "HIIT / CrossFit":    "Home — dumbbells / bands",
  "HYROX":              "HYROX Gym",
};
/* Infer training focus from diet goal when workoutFocus not asked */
const GOAL_TO_FOCUS: Record<string,string> = {
  "Weight loss":    "Burn fat",
  "Muscle gain":    "Build muscle",
  "Weight gain":    "Build mass",
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
  const isHyrox = placeKey==="hyrox";
  const isYoga = placeKey==="yoga";

  type Slot = { cat: string; n: number };
  const FB=(label:string):{label:string;focus:string;cats:Slot[]}=>(
    {label,focus:"Full body",cats:[{cat:"legs",n:1},{cat:"push",n:1},{cat:"pull",n:1},{cat:"core",n:1}]});
  const push={label:"Push",focus:"Chest · shoulders · triceps",cats:[{cat:"push",n:3},{cat:"core",n:1}]};
  const pull={label:"Pull",focus:"Back · biceps",cats:[{cat:"pull",n:3},{cat:"core",n:1}]};
  const legs={label:"Legs",focus:"Quads · hamstrings · glutes",cats:[{cat:"legs",n:3},{cat:"core",n:1}]};
  const upper={label:"Upper Body",focus:"Chest · back · arms",cats:[{cat:"push",n:2},{cat:"pull",n:2},{cat:"core",n:1}]};
  const lower={label:"Lower Body",focus:"Legs · core",cats:[{cat:"legs",n:3},{cat:"core",n:1}]};

  /* HYROX-specific 5-day rotation: machine aerobic → sled/push → carry/pull → simulation → recovery */
  const hyroxTemplates:{label:string;focus:string;cats:Slot[]}[]=[
    {label:"Machine Endurance",focus:"Ski erg · rowing · run",cats:[{cat:"cardio",n:2},{cat:"core",n:1}]},
    {label:"Sled & Push",focus:"Sled push · wall balls · burpee broad jumps",cats:[{cat:"push",n:2},{cat:"legs",n:1},{cat:"core",n:1}]},
    {label:"Carry & Pull",focus:"Sled pull · farmers carry · sandbag lunges",cats:[{cat:"pull",n:3},{cat:"core",n:1}]},
    {label:"Race Simulation",focus:"All 8 HYROX stations at reduced volume",cats:[{cat:"cardio",n:1},{cat:"push",n:1},{cat:"pull",n:1},{cat:"legs",n:1},{cat:"core",n:1}]},
    {label:"Run & Recovery",focus:"Easy run + mobility",cats:[{cat:"cardio",n:1},{cat:"legs",n:2},{cat:"core",n:1}]},
  ];

  /* Yoga-specific sessions: flow → standing → restore */
  const yogaTemplates:{label:string;focus:string;cats:Slot[]}[]=[
    {label:"Sun Flow",focus:"Full body warm-up · strength",cats:[{cat:"cardio",n:1},{cat:"legs",n:2},{cat:"core",n:1}]},
    {label:"Standing Power",focus:"Warrior series · balance",cats:[{cat:"legs",n:2},{cat:"push",n:1},{cat:"core",n:1}]},
    {label:"Back & Core",focus:"Backbends · abdominal work",cats:[{cat:"push",n:2},{cat:"pull",n:1},{cat:"core",n:1}]},
    {label:"Restore & Stretch",focus:"Hip openers · deep stretch",cats:[{cat:"restore",n:2},{cat:"core",n:1}]},
    {label:"Balance & Breath",focus:"Balance poses · pranayama",cats:[{cat:"legs",n:2},{cat:"cardio",n:1},{cat:"core",n:1}]},
  ];

  let templates:{label:string;focus:string;cats:Slot[]}[];
  if (isHyrox) {
    templates = hyroxTemplates.slice(0, Math.min(days, 5));
  } else if (cardioPlace) {
    templates = Array.from({length:Math.min(days,6)},(_,i)=>(
      {label:`Session ${i+1}`,focus:"Cardio + circuit",
       cats:[{cat:"cardio",n:1},{cat:"legs",n:1},{cat:"core",n:1},{cat:"push",n:1}]}));
  } else if (isYoga) {
    templates = yogaTemplates.slice(0, Math.min(days, 5));
  } else if (days<=2) templates=[FB("Full Body A"),FB("Full Body B")];
  else if (days===3) templates=muscle?[push,pull,legs]:[FB("Full Body A"),FB("Full Body B"),FB("Full Body C")];
  else if (days===4) templates=[upper,lower,upper,lower];
  else if (days===5) templates=[push,pull,legs,upper,lower];
  else templates=[push,pull,legs,push,pull,legs];

  const mkItem=(e:ExDef,cat:string):WorkoutItem=>{
    const each = !!e.note && e.note.includes("each");
    const tip = e.note && !each ? e.note : undefined;
    if (cat==="cardio"||cat==="restore") return {name:e.n,sets:1,reps:e.note||"10–12 min"};
    if (e.hold) return {name:e.n,sets:isYoga?1:rep.sets,reps:isYoga?`5–8 breaths${each?" each side":""}`:`30–45 sec${each?" each side":""}`,note:tip};
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
  const notes= isHyrox ? [
    "Warm up 10 min: 500m easy row + dynamic leg swings and hip circles.",
    "HYROX race order: 1 km run → ski erg → 1 km run → sled push → 1 km run → sled pull → 1 km run → burpee broad jumps → 1 km run → rowing → 1 km run → farmers carry → 1 km run → sandbag lunges → 1 km run → wall balls.",
    "In training: prioritise your weakest station — spend 10 extra minutes on it after each session.",
    "Race simulation day: do all stations at 50% volume with 1-min easy jogs between — build the rhythm.",
    "Recovery is critical: HYROX training is very high load. Sleep 8 hrs, eat your protein target, and never skip rest days.",
  ] : isYoga ? [
    "Begin each session with 3 rounds of Cat-Cow to warm the spine.",
    "Hold each pose for 5–8 slow, deep breaths — quality over quantity.",
    "Never force a stretch; ease to your edge and breathe into it.",
    "End every session with at least 3 min of Savasana (corpse pose) for nervous system recovery.",
    restNote,
  ] : [
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
    const dayUsed=new Set<string>();
    let raw=slots.map(([code,frac,label])=>{
      const slotCap=SLOT_CAL_CAP[code]||700;
      const targetCal=Math.min(Math.round(dayCal*frac),slotCap);
      const m=pickMeal(code,targetCal,di,weekUsed,dayUsed,ctx);
      dayUsed.add(m.n);
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
  const _cm2=((+(profile.heightFt||5))*12+(+(profile.heightIn||5)))*2.54;
  const _bmi2=_cm2>0?w/((_cm2/100)**2):22;
  const _ibw2=22*(_cm2/100)**2;
  /* ASPEN: for obese patients dose protein on Adjusted Body Weight, not actual */
  const proteinW=_bmi2>30?_ibw2+0.4*(w-_ibw2):w;
  const _age2=+(profile.age||25);

  /* ISSN Position Stand (2017) + ESPEN elderly guidelines (Bauer et al. 2013):
     Weight loss 2.0 g/kg preserves LBM; muscle gain 2.2 g/kg is the evidence ceiling;
     elderly 65+ need +20% to offset anabolic resistance.                              */
  const proteinMultiplier: Record<string,number>={
    "Weight loss":2.0,"Muscle gain":2.2,"Weight gain":1.8,"Maintain weight":1.4,"General fitness":1.6,
    "Breastfeeding":1.4,"Pregnant":1.4,
  };
  const elderlyBoost=_age2>=65?0.20:0;
  // ICMR: +25 g/day for breastfeeding/pregnancy
  const proteinExtra=["Breastfeeding","Pregnant"].includes(cond)?25:0;
  const proteinBase=(proteinMultiplier[st.effectiveGoal]??1.4)*(1+elderlyBoost)*proteinW;
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

  /* Actual daily calories = average of what the meals genuinely add up to.
     This accounts for SLOT_CAL_CAP limits and rounding — keeps the ring
     in sync with what users actually eat from their plan.              */
  const avgActualCal = Math.round(
    days.reduce((s,d)=>s+d.meals.reduce((ms,m)=>ms+m.cal,0),0)/days.length/10
  )*10;

  const deficitAmt = maintenance - avgActualCal;
  const deficitNote = deficitAmt > 50
    ? ` Your body burns ~${maintenance} kcal/day — eating ${avgActualCal} kcal creates a ${deficitAmt} kcal daily deficit.`
    : deficitAmt < -50
    ? ` Your body burns ~${maintenance} kcal/day — eating ${avgActualCal} kcal adds ${Math.abs(deficitAmt)} kcal above maintenance for muscle growth.`
    : "";

  return {
    summary:`Here's a ${goalLabel} plan at about ${avgActualCal} kcal a day, built around ${regLabel} food you actually like.${deficitNote}${condNote}${bfNote}${pregnantNote}`,
    dailyCalories:avgActualCal,maintenanceCalories:maintenance,proteinTarget,bmi:st.bmi,bmiCat:st.bmiCat,
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
function WeightSparkline({entries}:{entries:[string,number][]}) {
  if (entries.length < 2) return null;
  const vals = entries.map(([,w])=>w);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = Math.max(max - min, 0.5);
  const W=100, H=30, pad=3;
  const pts = vals.map((v,i)=>{
    const x = pad+(i/(vals.length-1))*(W-pad*2);
    const y = pad+(1-(v-min)/range)*(H-pad*2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const trending = vals[vals.length-1] <= vals[0];
  const col = trending ? "#1DAA61" : "#EA580C";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block",overflow:"visible"}}>
      <polyline points={pts} fill="none" stroke={col} strokeWidth={1.5} strokeLinejoin="round"/>
      {vals.map((v,i)=>{
        const x = pad+(i/(vals.length-1))*(W-pad*2);
        const y = pad+(1-(v-min)/range)*(H-pad*2);
        return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={2.5} fill={col}/>;
      })}
    </svg>
  );
}

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
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-gray-500">
            Latest: <b className="text-gray-700">{latest} kg</b>
            {diff!=null&&(
              <span style={{color:+diff<=0?GREEN:"#EA580C"}}>
                {" "}({+diff>0?"+":""}{diff} kg since start)
              </span>
            )}
          </div>
          {entries.length>=2&&(
            <WeightSparkline entries={entries.slice(-7)}/>
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
function ha(hex:string,a:number){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
/* ── Emil Kowalski animation standards ── */
const EASE_OUT=[0.23,1,0.32,1] as const;
const SPRING_ENTRY={type:"spring",duration:0.55,bounce:0.20} as const;
const SPRING_CRISP={type:"spring",duration:0.45,bounce:0.10} as const;
/* Stagger container variants — children declare their own show variant */
const staggerContainer={hidden:{},show:{transition:{staggerChildren:0.07,delayChildren:0.06}}};
const slideUp={
  hidden:{opacity:0,y:16,scale:0.96},
  show:{opacity:1,y:0,scale:1,transition:SPRING_ENTRY},
};

function waterTarget(weight?:string|number,age?:string|number):number {
  const w=+(weight||70),a=+(age||30);
  return Math.max(6,Math.min(14,Math.round((w*33+(a<25?200:a>60?300:0))/250)));
}
/* Animated atom illustration — 3 elliptical orbits + nucleus */
function AtomOrb({accent}:{accent:string}) {
  return (
    <motion.div className="relative flex items-center justify-center" style={{width:110,height:110}}
      animate={{scale:[1,1.05,1]}} transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}>
      <div className="absolute inset-0 rounded-full" style={{background:accent,filter:"blur(26px)",opacity:0.22}}/>
      <svg width="110" height="110" viewBox="0 0 110 110" style={{position:"absolute",inset:0,overflow:"visible"}}>
        {/* 3 orbiting ellipses at different angles */}
        {([0,60,120] as number[]).map((angle,i)=>(
          <motion.ellipse key={i} cx="55" cy="55" rx="50" ry="19"
            fill="none" stroke={ha(accent,0.45-i*0.08)} strokeWidth={1.8-i*0.3}
            style={{transformOrigin:"55px 55px",transform:`rotate(${angle}deg)`}}
            animate={{rotate:[angle,angle+360]}}
            transition={{duration:5+i*2.2,repeat:Infinity,ease:"linear"}}
          />
        ))}
        {/* 3 orbiting electron dots */}
        {([0,1,2] as number[]).map(i=>(
          <motion.circle key={`e${i}`} cx="55" cy="6" r="5.5" fill={accent}
            style={{transformOrigin:"55px 55px",filter:`drop-shadow(0 0 4px ${accent})`}}
            animate={{rotate:[i*120,i*120+360]}}
            transition={{duration:4.5,repeat:Infinity,ease:"linear",delay:-i*1.5}}
          />
        ))}
        {/* Nucleus glow */}
        <circle cx="55" cy="55" r="16" fill={accent} opacity="0.25"/>
        <circle cx="55" cy="55" r="11" fill={accent} opacity="0.85"/>
      </svg>
    </motion.div>
  );
}

function OnbSlide1({accent}:{accent:string}) {
  const [ct,setCt]=useState(0);
  useEffect(()=>{
    const iv=setInterval(()=>setCt(c=>c>=2000?2000:c+50),22);
    return()=>clearInterval(iv);
  },[]);
  return(
    <motion.div className="flex flex-col items-center text-center"
      variants={staggerContainer} initial="hidden" animate="show">
      <motion.div variants={slideUp} className="mb-4">
        <AtomOrb accent={accent}/>
      </motion.div>
      <motion.div variants={slideUp} className="font-black leading-none mb-1 tabular-nums"
        style={{fontSize:86,color:accent,textShadow:`0 0 48px ${ha(accent,0.4)}`,letterSpacing:"-3px"}}>
        {ct.toLocaleString()}+
      </motion.div>
      <motion.p variants={slideUp} className="font-black mb-4"
        style={{fontSize:20,color:"rgba(255,255,255,0.9)",letterSpacing:"-0.3px"}}>
        Nutrition Studies
      </motion.p>
      <motion.p variants={slideUp}
        style={{color:"rgba(255,255,255,0.48)",fontSize:14,maxWidth:250,lineHeight:1.7}}>
        Real science behind every meal. Peer-reviewed nutrition research — not influencer guesswork.
      </motion.p>
    </motion.div>
  );
}
/* Animated shield with self-drawing path + checkmark reveal */
function ShieldCheck({accent}:{accent:string}) {
  return (
    <svg width="96" height="108" viewBox="0 0 96 108" style={{overflow:"visible"}}>
      {/* Ground glow */}
      <motion.ellipse cx="48" cy="100" rx="28" ry="7" fill={accent}
        animate={{opacity:[0.18,0.32,0.18],rx:[28,32,28]}}
        transition={{duration:2.5,repeat:Infinity,ease:"easeInOut"}}/>
      {/* Shield body draws itself */}
      <motion.path
        d="M48 4 L88 20 L88 52 C88 78 48 104 48 104 C48 104 8 78 8 52 L8 20 Z"
        fill={ha(accent,0.18)} stroke={accent} strokeWidth="2.5"
        initial={{pathLength:0,opacity:0}}
        animate={{pathLength:1,opacity:1}}
        transition={{duration:0.72,ease:EASE_OUT}}
      />
      {/* Inner highlight */}
      <motion.path
        d="M48 14 L80 27 L80 52 C80 72 48 96 48 96 C48 96 16 72 16 52 L16 27 Z"
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1"
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
      />
      {/* Checkmark draws after shield */}
      <motion.path
        d="M30 55 L43 68 L66 40"
        fill="none" stroke={accent} strokeWidth="5.5"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{pathLength:0,opacity:0}}
        animate={{pathLength:1,opacity:1}}
        transition={{duration:0.42,delay:0.82,ease:EASE_OUT}}
      />
    </svg>
  );
}

function OnbSlide2({accent}:{accent:string}) {
  return(
    <motion.div className="flex flex-col items-center text-center"
      variants={staggerContainer} initial="hidden" animate="show">
      <motion.div variants={slideUp} className="mb-5">
        <ShieldCheck accent={accent}/>
      </motion.div>
      <motion.div variants={slideUp}
        className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 mb-5"
        style={{background:ha(accent,0.14),border:`1px solid ${ha(accent,0.28)}`}}>
        <span style={{color:accent,fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>No spam calls guaranteed</span>
      </motion.div>
      <motion.h2 variants={slideUp} className="font-black text-white mb-4"
        style={{fontSize:52,lineHeight:0.95,letterSpacing:"-2px"}}>
        We don't sell<br/>your data.
      </motion.h2>
      <motion.p variants={slideUp}
        style={{color:"rgba(255,255,255,0.48)",fontSize:14,maxWidth:260,lineHeight:1.7}}>
        We do not sell your data to Bajaj Finance or anyone else. Your health information stays yours — always.
      </motion.p>
    </motion.div>
  );
}
/* ── Veer knowledge-absorption avatar ── */
function VeerKnowledgeAvatar({accent,onDone}:{accent:string;onDone?:()=>void}) {
  const [absorbed,setAbsorbed]=useState(0);
  const [phase,setPhase]=useState<0|1|2>(0);

  useEffect(()=>{
    const t=setTimeout(()=>setPhase(1),480);
    return()=>clearTimeout(t);
  },[]);

  useEffect(()=>{
    if(phase!==1) return;
    let n=0;
    const iv=setInterval(()=>{
      n++; setAbsorbed(n);
      if(n>=8){clearInterval(iv);setTimeout(()=>{setPhase(2);onDone?.();},120);}
    },310);
    return()=>clearInterval(iv);
  },[phase]);

  const BOOKS=[
    {tx:-78,ty:-52,r:28},{tx:80,ty:-58,r:-24},
    {tx:-88,ty:12,r:16},{tx:90,ty:16,r:-30},
    {tx:-52,ty:-94,r:36},{tx:54,ty:-92,r:-32},
    {tx:4,ty:-108,r:6},{tx:-22,ty:78,r:-14},
  ];
  const NEURAL=[
    "M60 60 L49 51","M60 60 L73 49","M60 60 L53 73",
    "M60 60 L71 69","M60 60 L60 37","M60 60 L41 61",
    "M60 60 L79 61","M49 51 L41 61","M73 49 L79 61","M53 73 L71 69",
  ];
  const NODES=[
    {cx:49,cy:51},{cx:73,cy:49},{cx:53,cy:73},{cx:71,cy:69},
    {cx:60,cy:37},{cx:41,cy:61},{cx:79,cy:61},{cx:60,cy:60},
  ];

  return(
    <div className="relative flex items-center justify-center" style={{width:188,height:210}}>
      {/* Flying books */}
      {BOOKS.map((b,i)=>(
        <motion.div key={i} style={{position:"absolute",top:"43%",left:"50%",
          width:22,height:30,marginLeft:-11,marginTop:-15,zIndex:10,pointerEvents:"none"}}
          initial={{x:b.tx,y:b.ty,opacity:0,scale:0.8,rotate:b.r}}
          animate={phase===1&&i<absorbed
            ?{x:0,y:0,opacity:[0,0.95,0.95,0],scale:[0.85,1.1,0.12],rotate:0}
            :phase===0||(phase===1&&i>=absorbed)
            ?{x:b.tx,y:b.ty,opacity:i<3?0.38:0,scale:0.8,rotate:b.r}
            :{opacity:0,x:0,y:0}}
          transition={{duration:0.50,ease:[0.23,1,0.32,1]}}>
          <svg width="22" height="30" viewBox="0 0 22 30" style={{overflow:"visible"}}>
            <rect x="1" y="1" width="20" height="28" rx="2"
              fill={ha(accent,0.90)} stroke={accent} strokeWidth="1.5"
              style={{filter:`drop-shadow(0 0 5px ${ha(accent,0.7)})`}}/>
            <rect x="1" y="1" width="4" height="28" rx="1" fill={ha(accent,0.42)}/>
            {[7,12,17,22].map(y=><line key={y} x1="7" y1={y} x2="18" y2={y}
              stroke="rgba(0,0,0,0.30)" strokeWidth="1"/>)}
          </svg>
        </motion.div>
      ))}

      {/* Avatar SVG */}
      <svg width="158" height="195" viewBox="0 0 120 148" style={{position:"relative",zIndex:2,overflow:"visible"}}>
        {/* Outer breathing aura */}
        <motion.circle cx="60" cy="61" r="56" fill="none" stroke={ha(accent,0.09)} strokeWidth="1.5"
          animate={{scale:[1,1.055,1],opacity:[0.09,0.20,0.09]}}
          transition={{duration:3.4,repeat:Infinity,ease:"easeInOut"}}/>

        {/* Body silhouette */}
        <motion.path d="M15 145 C21 117 39 109 60 107 C81 109 99 117 105 145"
          fill={ha(accent,0.07)} stroke={ha(accent,0.30)} strokeWidth="3.5" strokeLinecap="round"
          initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
          transition={{delay:0.28,duration:0.52}}/>

        {/* Neck */}
        <motion.rect x="52" y="95" width="16" height="17" rx="8"
          fill={ha(accent,0.12)} stroke={ha(accent,0.28)} strokeWidth="1.5"
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}/>

        {/* Head outer power ring — only phase 2 */}
        {phase===2&&(
          <motion.circle cx="60" cy="61" r="42" fill={ha(accent,0.05)}
            stroke={ha(accent,0.45)} strokeWidth="1.5"
            animate={{scale:[1,1.05,1],opacity:[0.45,0.80,0.45]}}
            transition={{duration:2.1,repeat:Infinity,ease:"easeInOut"}}/>
        )}

        {/* Head main circle */}
        <motion.circle cx="60" cy="61" r="37"
          fill="rgba(7,5,17,0.98)" stroke={accent} strokeWidth="2.5"
          style={{filter:`drop-shadow(0 0 14px ${ha(accent,0.28)})`}}
          initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
          transition={{type:"spring",duration:0.68,bounce:0.26,delay:0.08}}/>

        {/* Skull inner ring */}
        <motion.circle cx="60" cy="61" r="31" fill="none" stroke={ha(accent,0.15)} strokeWidth="0.8"
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}}/>

        {/* Neural pathways */}
        {NEURAL.map((d,i)=>(
          <motion.path key={i} d={d} fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round"
            initial={{pathLength:0,opacity:0}}
            animate={absorbed>Math.floor(i*0.72)?{pathLength:1,opacity:0.62}:{pathLength:0,opacity:0}}
            transition={{duration:0.26,ease:"easeOut"}}/>
        ))}

        {/* Neural nodes */}
        {NODES.map(({cx,cy},i)=>(
          <motion.circle key={i} cx={cx} cy={cy} r={i===7?5.8:2.6} fill={accent}
            style={{filter:`drop-shadow(0 0 ${i===7?9:5}px ${ha(accent,0.9)})`}}
            initial={{scale:0,opacity:0}}
            animate={absorbed>i?{scale:1,opacity:0.92}:{scale:0,opacity:0}}
            transition={{type:"spring",duration:0.30,bounce:0.35}}/>
        ))}

        {/* Brow lines */}
        <motion.path d="M44 54 Q49 51 54 54" fill="none" stroke={ha(accent,0.55)} strokeWidth="2" strokeLinecap="round"
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}/>
        <motion.path d="M66 54 Q71 51 76 54" fill="none" stroke={ha(accent,0.55)} strokeWidth="2" strokeLinecap="round"
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}/>

        {/* Eyes */}
        <motion.ellipse cx="50" cy="62" rx={phase>=2?6.5:5.5} ry={phase>=2?5.5:5}
          fill={phase>=2?accent:"rgba(255,255,255,0.72)"}
          style={{filter:`drop-shadow(0 0 ${phase>=2?11:5}px ${accent})`}}
          animate={phase>=2?{opacity:[0.72,1,0.72]}:{opacity:1}}
          transition={{duration:1.8,repeat:phase>=2?Infinity:0}}/>
        <motion.ellipse cx="70" cy="62" rx={phase>=2?6.5:5.5} ry={phase>=2?5.5:5}
          fill={phase>=2?accent:"rgba(255,255,255,0.72)"}
          style={{filter:`drop-shadow(0 0 ${phase>=2?11:5}px ${accent})`}}
          animate={phase>=2?{opacity:[0.72,1,0.72]}:{opacity:1}}
          transition={{duration:1.8,repeat:phase>=2?Infinity:0,delay:0.22}}/>

        {/* Mouth — slight smile */}
        <motion.path d="M52 75 Q60 80 68 75" fill="none" stroke={ha(accent,0.45)} strokeWidth="2" strokeLinecap="round"
          initial={{opacity:0,pathLength:0}} animate={{opacity:1,pathLength:1}} transition={{delay:0.7,duration:0.4}}/>

        {/* Power burst rings on completion */}
        {phase===2&&[0,1,2].map(i=>(
          <motion.circle key={i} cx="60" cy="61" r="42"
            fill="none" stroke={ha(accent,0.52-i*0.13)} strokeWidth={2.8-i*0.6}
            initial={{scale:0.82,opacity:0.75}}
            animate={{scale:1.75+i*0.22,opacity:0}}
            transition={{duration:0.92+i*0.16,delay:i*0.17,ease:"easeOut"}}/>
        ))}

        {/* Crown sparks on completion */}
        {phase===2&&([-26,-13,0,13,26] as number[]).map((dx,i)=>(
          <motion.circle key={i} cx={60+dx} cy={26} r="3.2" fill={accent}
            style={{filter:`drop-shadow(0 0 6px ${accent})`}}
            initial={{scale:0,opacity:0,y:0}}
            animate={{scale:[0,1.5,0],opacity:[0,1,0],y:[-4,-18,-34]}}
            transition={{duration:0.72,delay:0.06+i*0.07,ease:"easeOut"}}/>
        ))}

        {/* Data-stream particles flying into head during absorption */}
        {phase===1&&[0,1,2,3].map(i=>(
          <motion.circle key={`p${i}`} cx={60+[-18,20,-12,15][i]} cy={20+i*6} r="2" fill={accent}
            opacity="0.6"
            animate={{cy:[20+i*6,61],opacity:[0.6,0]}}
            transition={{duration:0.4,delay:absorbed>i?0:99,repeat:Infinity,repeatDelay:1.2}}/>
        ))}
      </svg>
    </div>
  );
}

function OnbSlide3({accent}:{accent:string}) {
  const [count,setCount]=useState(0);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    if(!loaded) return;
    const iv=setInterval(()=>setCount(c=>{const n=c+9;return n>=200?200:n;}),22);
    return()=>clearInterval(iv);
  },[loaded]);

  return(
    <motion.div className="flex flex-col items-center text-center"
      variants={staggerContainer} initial="hidden" animate="show">
      <motion.div variants={slideUp} className="mb-1">
        <VeerKnowledgeAvatar accent={accent} onDone={()=>setLoaded(true)}/>
      </motion.div>
      <motion.h2 variants={slideUp} className="font-black mb-2"
        style={{fontSize:26,letterSpacing:"-0.5px",color:accent}}>
        Meet Veer AI
      </motion.h2>
      {loaded?(
        <motion.div className="mb-2" initial={{opacity:0,scale:0.82}} animate={{opacity:1,scale:1}} transition={SPRING_ENTRY}>
          <span className="font-black tabular-nums"
            style={{fontSize:62,color:accent,letterSpacing:"-3px",lineHeight:1,
              textShadow:`0 0 40px ${ha(accent,0.6)},0 0 80px ${ha(accent,0.28)}`}}>
            {count}+
          </span>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.50)",marginTop:3,
            letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:700}}>
            ebooks fed into Veer
          </p>
        </motion.div>
      ):(
        <p style={{fontSize:11,color:"rgba(255,255,255,0.32)",marginBottom:8,
          letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:600}}>
          Absorbing knowledge…
        </p>
      )}
      <motion.p variants={slideUp} style={{color:"rgba(255,255,255,0.42)",fontSize:13,maxWidth:252,lineHeight:1.75}}>
        Nutrition, dietetics &amp; fitness research — baked into every answer. Hindi &amp; English, 24/7, free.
      </motion.p>
    </motion.div>
  );
}
function MacroRingIllus({accent}:{accent:string}) {
  const macros=[
    {pct:0.82,color:accent,r:44},
    {pct:0.67,color:"rgba(255,255,255,0.65)",r:31},
    {pct:0.54,color:ha(accent,0.62),r:18},
  ];
  return(
    /* Hologram spin-in: rotates from -90° on Y axis like a disc being revealed */
    <motion.div
      initial={{rotateY:-90,scale:0.80,opacity:0}}
      animate={{rotateY:0,scale:1,opacity:1}}
      transition={{type:"spring",duration:0.80,bounce:0.18}}>
      <svg width="130" height="130" viewBox="0 0 130 130" style={{overflow:"visible"}}>
        {/* Ground shadow halo */}
        <motion.ellipse cx="65" cy="122" rx="30" ry="8" fill={accent}
          initial={{opacity:0}} animate={{opacity:[0.15,0.32,0.15]}}
          transition={{duration:2.4,repeat:Infinity,ease:"easeInOut",delay:0.9}}/>
        {/* Three concentric rings */}
        {macros.map((m,i)=>{
          const ci=2*Math.PI*m.r;
          return(
            <g key={i}>
              <circle cx="65" cy="65" r={m.r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
              <motion.circle cx="65" cy="65" r={m.r}
                fill="none" stroke={m.color} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={ci}
                style={{transformOrigin:"65px 65px",rotate:-90}}
                initial={{strokeDashoffset:ci}}
                animate={{strokeDashoffset:ci*(1-m.pct)}}
                transition={{duration:1.1,ease:EASE_OUT,delay:0.20+i*0.14}}/>
            </g>
          );
        })}
        {/* Micro sparks pop at first orbit completion */}
        {([[-30,-30],[30,-30],[30,30],[-30,30]] as [number,number][]).map(([dx,dy],i)=>(
          <motion.circle key={i} cx={65+dx} cy={65+dy} r="3"
            fill={accent} opacity={0.7}
            initial={{scale:0,opacity:0}}
            animate={{scale:[0,1.4,0.8],opacity:[0,0.85,0]}}
            transition={{duration:0.55,delay:1.36+i*0.07,ease:EASE_OUT}}/>
        ))}
      </svg>
    </motion.div>
  );
}
function OnbSlide4({accent}:{accent:string}) {
  return(
    <motion.div className="flex flex-col items-center text-center"
      variants={staggerContainer} initial="hidden" animate="show">
      <motion.div variants={slideUp} className="mb-5">
        <MacroRingIllus accent={accent}/>
      </motion.div>
      <motion.div variants={slideUp}
        style={{fontSize:46,fontWeight:900,color:"#ffffff",lineHeight:1.1,letterSpacing:"-2px"}}>
        Eat Better
      </motion.div>
      <motion.div variants={slideUp}
        style={{fontSize:38,fontWeight:900,color:accent,lineHeight:1.1,letterSpacing:"-1.5px",
          textShadow:`0 0 28px ${ha(accent,0.6)}`}}>
        &amp; Count
      </motion.div>
      <motion.p variants={slideUp}
        style={{fontSize:13,color:"rgba(255,255,255,0.42)",marginTop:16,letterSpacing:"0.06em"}}>
        Your nutrition. Your rules.
      </motion.p>
    </motion.div>
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
    "linear-gradient(155deg,#180826 0%,#250c3b 45%,#370854 100%)",
    "linear-gradient(155deg,#1a0929 0%,#270d40 45%,#370854 100%)",
    "linear-gradient(155deg,#150625 0%,#1f0934 45%,#2d0c48 100%)",
    "linear-gradient(155deg,#12041e 0%,#1f0730 45%,#32094a 100%)",
  ];

  const ACCENT=["#FFFA66","#FFFA66","#FFFA66","#FFFA66"];
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
            {slide===0&&<OnbSlide1 accent={ACCENT[slide]}/>}
            {slide===1&&<OnbSlide2 accent={ACCENT[slide]}/>}
            {slide===2&&<OnbSlide3 accent={ACCENT[slide]}/>}
            {slide===3&&<OnbSlide4 accent={ACCENT[slide]}/>}
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

/* ─────────────── Login Intro (shown on every explicit login / signup) ─────────────── */
function LISlide0({accent}:{accent:string}) {
  const [phase,setPhase]=useState(0);
  const [ct,setCt]=useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),900);
    const t2=setTimeout(()=>setPhase(2),1750);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);
  useEffect(()=>{
    if(phase<2)return;
    const iv=setInterval(()=>setCt(c=>{const n=c+44;return n>=2500?2500:n;}),14);
    return()=>clearInterval(iv);
  },[phase]);
  return(
    <div className="flex flex-col items-center text-center">
      <div className="mb-4" style={{fontSize:62,animation:"onbPulse 2.5s ease-in-out infinite",filter:`drop-shadow(0 0 28px ${ha(accent,0.55)})`}}>📚</div>
      <div className="flex flex-col items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="relative inline-block">
            <span className="font-black tabular-nums" style={{fontSize:44,color:"rgba(255,255,255,0.30)",letterSpacing:"-2px"}}>150</span>
            {phase>=1&&<div style={{position:"absolute",top:"50%",left:0,height:3,background:"#EF4444",borderRadius:2,animation:"liStrike 0.38s ease-out both"}}/>}
          </div>
          <span style={{fontSize:13,color:"rgba(255,255,255,0.28)",fontWeight:600}}>books max</span>
        </div>
        {phase>=2&&(
          <div className="flex flex-col items-center" style={{animation:"liCounter 0.58s cubic-bezier(0.22,1,0.36,1) both"}}>
            <span className="font-black tabular-nums leading-none" style={{fontSize:90,color:accent,letterSpacing:"-4px",textShadow:`0 0 50px ${ha(accent,0.6)}`}}>
              {ct.toLocaleString()}+
            </span>
            <span className="font-bold mt-1" style={{fontSize:15,color:"rgba(255,255,255,0.88)"}}>ebooks globally sourced</span>
          </div>
        )}
      </div>
      <p style={{color:"rgba(255,255,255,0.42)",fontSize:13,maxWidth:250,lineHeight:1.75}}>
        Science-backed plans from the world's best nutrition research — not influencer guesswork.
      </p>
    </div>
  );
}
function LISlide1({accent}:{accent:string}) {
  const [rows,setRows]=useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setRows(1),650);
    const t2=setTimeout(()=>setRows(2),1380);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);
  return(
    <div className="flex flex-col items-center text-center">
      <div className="mb-3" style={{fontSize:58,animation:"onbPulse 2.5s ease-in-out infinite",filter:`drop-shadow(0 0 28px ${ha(accent,0.55)})`}}>🔒</div>
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
        style={{background:ha(accent,0.14),border:`1px solid ${ha(accent,0.30)}`}}>
        <Lock size={11} color={accent}/>
        <span style={{color:accent,fontSize:11,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>No spam calls guaranteed</span>
      </div>
      <div className="w-full flex flex-col gap-2.5 mb-5">
        {rows>=1&&(
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.22)",animation:"liRowIn 0.5s cubic-bezier(0.22,1,0.36,1) both"}}>
            <span style={{fontSize:22}}>❌</span>
            <div className="text-left">
              <div className="font-bold text-sm" style={{color:"rgba(255,255,255,0.60)"}}>Other apps</div>
              <div style={{fontSize:12,color:"rgba(248,113,113,0.9)"}}>Sell your data to Bajaj Finance &amp; co.</div>
            </div>
          </div>
        )}
        {rows>=2&&(
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{background:ha(accent,0.10),border:`1px solid ${ha(accent,0.35)}`,animation:"liRowIn 0.5s cubic-bezier(0.22,1,0.36,1) both"}}>
            <span style={{fontSize:22}}>✅</span>
            <div className="text-left">
              <div className="font-bold text-sm text-white">EatBC</div>
              <div style={{fontSize:12,color:accent}}>Zero spam. We never sell your data.</div>
            </div>
          </div>
        )}
      </div>
      <p style={{color:"rgba(255,255,255,0.42)",fontSize:13,maxWidth:250,lineHeight:1.75}}>
        No spam calls. No data selling. Your health information is yours alone.
      </p>
    </div>
  );
}
function LISlide2({accent}:{accent:string}) {
  const [showChat,setShowChat]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setShowChat(true),1350);return()=>clearTimeout(t);},[]);
  return(
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center mb-4" style={{width:114,height:114}}>
        {[0,1,2].map(i=>(
          <div key={i} className="absolute inset-0 rounded-full" style={{
            border:`1.5px solid ${ha(accent,0.45)}`,
            animation:`liVeerRing 2.2s ease-out ${i*0.65}s infinite`,
          }}/>
        ))}
        <div className="relative z-10"><VeerIcon size={88}/></div>
      </div>
      {showChat&&(
        <div className="rounded-[20px] px-5 py-3 mb-4" style={{
          maxWidth:224,background:ha(accent,0.14),border:`1px solid ${ha(accent,0.32)}`,
          borderBottomLeftRadius:4,animation:"liChatIn 0.5s cubic-bezier(0.22,1,0.36,1) both",
        }}>
          <p style={{color:"rgba(255,255,255,0.92)",fontSize:13,lineHeight:1.55}}>
            "Namaste! Main yahan hoon aapke liye. Kya poochna chahte ho? 😊"
          </p>
        </div>
      )}
      <h2 className="font-black mb-2" style={{fontSize:26,letterSpacing:"-0.5px",color:accent}}>Your AI Coach</h2>
      <p style={{color:"rgba(255,255,255,0.42)",fontSize:13,maxWidth:250,lineHeight:1.75}}>
        Veer guides you in Hindi &amp; English — workouts, recipes, motivation. 24/7.
      </p>
    </div>
  );
}
/* ── Achievement ring illustration for LoginIntro ── */
function StreakOrb({accent}:{accent:string}) {
  const r=38, c=2*Math.PI*r;
  return(
    <motion.svg width="112" height="112" viewBox="0 0 112 112" style={{overflow:"visible"}}
      initial={{scale:0.90,opacity:0}} animate={{scale:1,opacity:1}} transition={SPRING_ENTRY}>
      {/* Shadow halo */}
      <motion.ellipse cx="56" cy="106" rx="26" ry="7" fill={accent}
        animate={{opacity:[0.14,0.26,0.14],rx:[26,30,26]}}
        transition={{duration:2.6,repeat:Infinity,ease:"easeInOut"}}/>
      {/* Track */}
      <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="7.5"/>
      {/* Progress — fills to 100% */}
      <motion.circle cx="56" cy="56" r={r}
        fill="none" stroke={accent} strokeWidth="7.5" strokeLinecap="round"
        strokeDasharray={c}
        style={{transformOrigin:"56px 56px",rotate:-90}}
        initial={{strokeDashoffset:c}}
        animate={{strokeDashoffset:0}}
        transition={{duration:1.1,ease:EASE_OUT,delay:0.28}}/>
      {/* Checkmark draws in after ring completes */}
      <motion.path d="M36 56 L48 70 L76 40" fill="none" stroke={accent} strokeWidth="6"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{pathLength:0,opacity:0}}
        animate={{pathLength:1,opacity:1}}
        transition={{duration:0.40,delay:1.18,ease:EASE_OUT}}/>
      {/* Orbiting spark after ring */}
      <motion.circle r="5.5" fill={accent}
        style={{filter:`drop-shadow(0 0 5px ${accent})`,transformOrigin:"56px 56px"}}
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.3}}>
        <animateMotion dur="3.8s" repeatCount="indefinite" begin="1.3s"
          path={`M ${56+r} 56 A ${r} ${r} 0 1 1 ${56+r-0.001} 56`}/>
      </motion.circle>
      {/* Four corner micro-sparks that pop out when check appears */}
      {([[-30,-30],[30,-30],[30,30],[-30,30]] as [number,number][]).map(([dx,dy],i)=>(
        <motion.circle key={i} cx={56+dx} cy={56+dy} r="3"
          fill={accent} opacity={0.65}
          initial={{scale:0,opacity:0}}
          animate={{scale:[0,1.3,0.8],opacity:[0,0.8,0]}}
          transition={{duration:0.55,delay:1.22+i*0.06,ease:EASE_OUT}}/>
      ))}
    </motion.svg>
  );
}

function LIFinal({accent}:{accent:string}) {
  const FLOATS=[
    {t:"−500 kcal",x:"6%",delay:0.6},{t:"150g protein",x:"58%",delay:1.0},
    {t:"Day 1 ✓",x:"10%",delay:1.3},{t:"2,100 kcal",x:"52%",delay:0.8},
  ];
  const eatLetters="Eat Better".split("");
  return(
    <div className="relative flex flex-col items-center justify-center" style={{height:340}}>
      {/* Floating stat chips */}
      {FLOATS.map((f,i)=>(
        <motion.span key={i}
          style={{position:"absolute",bottom:"11%",left:f.x,fontSize:11,fontWeight:700,
            color:ha(accent,0.34),letterSpacing:"0.3px",pointerEvents:"none"}}
          initial={{opacity:0,y:0}}
          animate={{opacity:[0,0.38,0.42,0.30,0],y:[0,-62,-62,-65,-95]}}
          transition={{duration:3.6,delay:f.delay,repeat:Infinity,ease:"easeOut",repeatDelay:1.2}}>
          {f.t}
        </motion.span>
      ))}

      {/* StreakOrb */}
      <motion.div className="mb-5"
        initial={{opacity:0,scale:0.88,y:22}}
        animate={{opacity:1,scale:1,y:0}}
        transition={{...SPRING_ENTRY,delay:0.06}}>
        <StreakOrb accent={accent}/>
      </motion.div>

      {/* "Eat Better" — each letter gravity-falls from above with spring bounce */}
      <div style={{fontSize:52,fontWeight:900,lineHeight:1.1,letterSpacing:"-2px",color:"#fff",
        textShadow:"0 2px 24px rgba(255,255,255,0.14)"}}>
        {eatLetters.map((ch,i)=>(
          <motion.span key={i} style={{display:"inline-block"}}
            initial={{y:-65,opacity:0,rotateZ:i%3===0?-15:i%3===1?11:-9}}
            animate={{y:0,opacity:1,rotateZ:0}}
            transition={{type:"spring",duration:0.50,bounce:0.42,delay:0.24+i*0.042}}>
            {ch===" "?" ":ch}
          </motion.span>
        ))}
      </div>

      {/* "& Count" — neon sign flicker-on effect */}
      <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:0.01,delay:0.80}}
        style={{fontSize:44,fontWeight:900,color:accent,lineHeight:1.1,letterSpacing:"-1.5px"}}>
        <motion.span
          style={{display:"inline-block"}}
          initial={{textShadow:"0 0 0px transparent"}}
          animate={{textShadow:[
            "0 0 0px transparent",
            `0 0 24px ${accent}`,
            "0 0 0px transparent",
            `0 0 40px ${accent}`,
            "0 0 0px transparent",
            `0 0 18px ${accent}, 0 0 55px ${ha(accent,0.55)}, 0 0 95px ${ha(accent,0.28)}`,
          ]}}
          transition={{duration:0.54,delay:0.86,times:[0,0.18,0.34,0.52,0.70,1]}}>
          &amp; Count
        </motion.span>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:0.55,delay:1.35}}
        style={{fontSize:13,color:"rgba(255,255,255,0.38)",letterSpacing:"0.06em",marginTop:14}}>
        Eat Better. Count Smarter.
      </motion.p>
    </div>
  );
}
/* Twinkling star field SVG for LoginIntro */
function StarField() {
  const stars=useMemo(()=>Array.from({length:70},(_,i)=>({
    x:Math.random()*100,y:Math.random()*100,
    r:Math.random()*1.1+0.3,
    delay:Math.random()*5,
    dur:2.8+Math.random()*5,
  })),[]);
  return(
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}>
      {stars.map((s,i)=>(
        <motion.circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
          fill="rgba(255,255,255,0.75)"
          animate={{opacity:[0,s.r>1?0.80:0.45,0.08,s.r>0.8?0.60:0.28,0]}}
          transition={{duration:s.dur,delay:s.delay,repeat:Infinity,ease:"easeInOut"}}/>
      ))}
    </svg>
  );
}

function LoginIntro({onDone}:{onDone:()=>void;diet?:string}) {
  const ACCENT="#FFFA66";
  const tilt=use3DParallax();
  const layer=(depth:number)=>({
    transform:`translate3d(${tilt.y*depth}px,${tilt.x*depth}px,0)`,
    transition:"transform 0.18s ease-out",
  });
  useEffect(()=>{
    const t=setTimeout(onDone,5600);
    return()=>clearTimeout(t);
  },[]);

  return(
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{background:"linear-gradient(155deg,#0e0418 0%,#1a0830 48%,#280642 100%)",perspective:"1100px"}}
      onClick={onDone}>

      {/* Star field */}
      <StarField/>

      {/* Aurora orbs — layered parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute rounded-full"
          style={{width:420,height:420,top:"4%",left:"-20%",
            background:`radial-gradient(circle,${ACCENT}44,transparent 68%)`,
            filter:"blur(55px)",...layer(46)}}
          animate={{scale:[1,1.14,0.92,1.08,1]}}
          transition={{duration:11,repeat:Infinity,ease:"easeInOut"}}/>
        <motion.div className="absolute rounded-full"
          style={{width:320,height:320,bottom:"8%",right:"-16%",
            background:`radial-gradient(circle,${ACCENT}32,transparent 68%)`,
            filter:"blur(48px)",...layer(62)}}
          animate={{scale:[1,1.18,0.88,1.12,1]}}
          transition={{duration:14,repeat:Infinity,ease:"easeInOut",delay:2}}/>
        <motion.div className="absolute rounded-full"
          style={{width:180,height:180,top:"42%",right:"16%",
            background:`radial-gradient(circle,${ACCENT}22,transparent 70%)`,
            filter:"blur(30px)",...layer(80)}}
          animate={{scale:[1,1.20,0.90,1.10,1],x:[0,10,-8,5,0]}}
          transition={{duration:9,repeat:Infinity,ease:"easeInOut",delay:4}}/>
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`linear-gradient(${ACCENT}10 1px,transparent 1px),linear-gradient(90deg,${ACCENT}10 1px,transparent 1px)`,
        backgroundSize:"44px 44px",
        maskImage:"radial-gradient(circle at 50% 42%,black,transparent 72%)",
        WebkitMaskImage:"radial-gradient(circle at 50% 42%,black,transparent 72%)",
        ...layer(20),
      }}/>

      {/* Card — flips up from below like a spotlight landing */}
      <div className="flex-1 flex items-center justify-center px-6 pt-16 pb-10 relative z-10">
        <motion.div
          style={layer(-26)}
          initial={{opacity:0,scale:0.86,rotateX:-40,y:70}}
          animate={{opacity:1,scale:1,rotateX:0,y:0}}
          transition={{type:"spring",duration:0.78,bounce:0.22}}>

          <div className="relative rounded-[34px] px-8 py-10 flex items-center justify-center" style={{
            minWidth:300,minHeight:400,
            background:"linear-gradient(160deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))",
            border:"1px solid rgba(255,255,255,0.16)",
            boxShadow:`0 30px 80px -20px ${ACCENT}48, inset 0 1px 0 rgba(255,255,255,0.18)`,
            backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
            transform:`rotateX(${tilt.x*-5}deg) rotateY(${tilt.y*5}deg)`,
            transition:"transform 0.18s ease-out,box-shadow 0.6s ease",
          }}>
            {/* Arrival glow flash */}
            <motion.div style={{
              position:"absolute",inset:-18,borderRadius:50,
              background:`radial-gradient(ellipse at 50% 50%,${ha(ACCENT,0.30)} 0%,transparent 68%)`,
              pointerEvents:"none",zIndex:-1,
            }}
              initial={{opacity:0,scale:0.88}}
              animate={{opacity:[0,0.95,0.18],scale:[0.88,1.10,1.02]}}
              transition={{duration:0.95,ease:[0.23,1,0.32,1]}}/>

            <LIFinal accent={ACCENT}/>
          </div>
        </motion.div>
      </div>

      <div className="pb-9 flex justify-center relative z-10">
        <span className="text-[11px] tracking-widest uppercase font-semibold" style={{color:"rgba(255,255,255,0.28)"}}>tap to continue</span>
      </div>
    </div>
  );
}

/* ─────────────── Welcome ─────────────── */
interface FoodPopup { name:string; cal:string; benefit:string; tip:string; }
const FOOD_POPUP_INFO: Record<string,FoodPopup> = {
  "🥗":{name:"Green Salad",   cal:"~50 kcal / cup", benefit:"High fibre, antioxidants, keeps you full.",      tip:"Add olive oil + lemon for better iron absorption."},
  "🫓":{name:"Whole Grain Bread",cal:"~130 kcal / 2 slices",benefit:"Complex carbs for sustained energy.",     tip:"Pair with peanut butter for a protein boost."},
  "🥑":{name:"Avocado",        cal:"~160 kcal / half",benefit:"Heart-healthy fats & potassium.",               tip:"Great with eggs — healthy fat helps absorb vitamins."},
  "🍎":{name:"Apple",          cal:"~80 kcal / medium",benefit:"Rich in quercetin, fibre & vitamin C.",        tip:"Eat the skin — most nutrients live there."},
  "🥦":{name:"Broccoli",       cal:"~55 kcal / cup",benefit:"Cancer-fighting sulforaphane + vitamin K.",       tip:"Light steaming preserves 90 % of its nutrients."},
  "🍚":{name:"Brown Rice",     cal:"~215 kcal / cup",benefit:"Whole grain, lower GI than white rice.",         tip:"Cook with less water for a firmer, lower-GI result."},
  "🥛":{name:"Milk",           cal:"~120 kcal / glass",benefit:"Calcium + vitamin D for strong bones.",        tip:"Warm milk before bed boosts sleep via tryptophan."},
  "🫐":{name:"Blueberries",    cal:"~85 kcal / cup",benefit:"Highest antioxidant load of any fruit.",          tip:"Frozen blueberries retain all the antioxidants."},
  "🍊":{name:"Orange",         cal:"~62 kcal / medium",benefit:"Vitamin C triples iron absorption from food.", tip:"Eat whole fruit — juicing removes most of the fibre."},
  "🥚":{name:"Egg",            cal:"~78 kcal / large",benefit:"Complete protein with all 9 essential amino acids.",tip:"Boiled > fried — saves ~90 kcal per egg."},
  "🌾":{name:"Oats",           cal:"~150 kcal / cup cooked",benefit:"Beta-glucan fibre lowers LDL cholesterol.",tip:"Overnight oats are just as nutritious as cooked."},
  "🥜":{name:"Peanuts",        cal:"~160 kcal / ¼ cup",benefit:"Plant protein + niacin + resveratrol.",        tip:"Unsalted roasted peanuts are the healthiest form."},
  "🍋":{name:"Lemon",          cal:"~17 kcal / medium",benefit:"Vitamin C + citric acid aids digestion.",      tip:"Squeeze on veggies to enhance non-heme iron uptake."},
  "🥕":{name:"Carrot",         cal:"~52 kcal / medium",benefit:"Beta-carotene converts to vitamin A for vision.",tip:"Cooked carrots release 40 % more beta-carotene."},
  "🫑":{name:"Bell Pepper",    cal:"~31 kcal / medium",benefit:"3× more vitamin C than an orange.",            tip:"Red peppers are ripest and most nutrient-dense."},
};
const FLOAT_FOODS = ["🥗","🫓","🥑","🍎","🥦","🍚","🥛","🫐","🍊","🥚","🌾","🥜","🍋","🥕","🫑"];
/* ─────────────── Quiz teaser (mid-quiz TDEE/BMI sneak peek) ─────────────── */
function QuizTeaser({profile}:{profile:Profile}) {
  const hasData = profile.weight && profile.age && profile.heightFt;
  if (!hasData) return null;
  const w = +(profile.weight||0);
  const cm = ((+(profile.heightFt||5))*12+(+(profile.heightIn||5)))*2.54;
  const bmi = cm>0 ? w/((cm/100)**2) : 0;
  const bmiCat = bmi<18.5?"Underweight":bmi<23?"Normal":bmi<27.5?"Overweight":"Obese";
  const tIbw=22*(cm/100)**2;
  const tCalcW=bmi>30?tIbw+0.4*(w-tIbw):w;
  const bmr = (profile.sex!=="Male"
    ? 10*tCalcW+6.25*cm-5*(+(profile.age||25))-161
    : 10*tCalcW+6.25*cm-5*(+(profile.age||25))+5);
  const teaserPalMatrix: Record<string,Record<string,number>> = {
    "Mostly desk job":    {"None":1.2,"Walks / light":1.375,"Gym 3x week":1.55,"Gym 5x+ / sports":1.65},
    "On feet / moderate": {"None":1.375,"Walks / light":1.475,"Gym 3x week":1.60,"Gym 5x+ / sports":1.75},
    "Physically active":  {"None":1.55,"Walks / light":1.65,"Gym 3x week":1.75,"Gym 5x+ / sports":1.90},
  };
  const teaserNormEx: Record<string,string> = {
    "Running / jogging":"Gym 3x week","Cycling":"Gym 3x week","Swimming":"Gym 3x week",
    "Yoga / Pilates":"Walks / light","Home workouts":"Gym 3x week","Gym (weights)":"Gym 3x week",
    "Sports / games":"Gym 5x+ / sports","HIIT / CrossFit":"Gym 5x+ / sports","HYROX":"Gym 5x+ / sports",
  };
  const teaserExKey = teaserNormEx[profile.exercise||""] || "None";
  const teaserPalRow = teaserPalMatrix[profile.activity||"Mostly desk job"] || teaserPalMatrix["Mostly desk job"];
  const teaserPal = teaserPalRow[teaserExKey] ?? 1.375;
  const roughTdee = Math.round(bmr*teaserPal/50)*50;
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
  const [popup,setPopup]=useState<FoodPopup|null>(null);
  const items = useRef(FLOAT_FOODS.map((emoji,i)=>({
    emoji, left:`${6+i*6.2}%`, delay:`${i*0.7}s`, duration:`${8+i%4*1.5}s`, size: 22+i%3*4,
  }))).current;
  return(
    <>
    <div className="absolute inset-0 overflow-hidden" style={{zIndex:2,pointerEvents:"none"}}>
      {items.map((f,i)=>(
        <button key={i} className="absolute select-none cursor-pointer"
          style={{left:f.left,bottom:"-10%",fontSize:f.size,pointerEvents:"auto",background:"none",border:"none",padding:0,
            animation:`floatFood ${f.duration} ${f.delay} ease-in infinite`,
            opacity:0.65,filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.18))"}}
          onClick={e=>{e.stopPropagation();setPopup(FOOD_POPUP_INFO[f.emoji]||null);}}>
          {f.emoji}
        </button>
      ))}
    </div>
    {popup&&(
      <div className="fixed inset-0 flex items-center justify-center" style={{zIndex:50,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}}
        onClick={()=>setPopup(null)}>
        <div className="rounded-3xl px-6 py-7 max-w-xs w-full mx-4 relative" style={{background:"#111",border:"1px solid rgba(255,255,255,0.14)",boxShadow:"0 24px 64px rgba(0,0,0,0.6)",animation:"popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both"}}
          onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setPopup(null)} className="absolute top-4 right-4 rounded-full w-7 h-7 flex items-center justify-center" style={{background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)"}}>×</button>
          <div className="text-5xl mb-3 text-center">{Object.entries(FOOD_POPUP_INFO).find(([,v])=>v===popup)?.[0]}</div>
          <h3 className="font-black text-white text-xl mb-1 text-center">{popup.name}</h3>
          <p className="text-center text-xs font-bold mb-4" style={{color:"#FFFA66"}}>{popup.cal}</p>
          <div className="rounded-2xl px-4 py-3 mb-3" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)"}}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color:"rgba(255,255,255,0.35)"}}>Benefits</p>
            <p className="text-sm text-white/80">{popup.benefit}</p>
          </div>
          <div className="rounded-2xl px-4 py-3" style={{background:"rgba(255,250,102,0.08)",border:"1px solid rgba(255,250,102,0.18)"}}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color:"rgba(255,250,102,0.5)"}}>Pro tip</p>
            <p className="text-sm" style={{color:"rgba(255,250,102,0.85)"}}>{popup.tip}</p>
          </div>
        </div>
      </div>
    )}
    </>
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

/* ─────────────── Daily motivation quote ─────────────── */
interface MQuote { text:string; author?:string; theme:string; }
const MOTIVATION_QUOTES:MQuote[]=[
  // Fitness & movement
  {text:"The only bad workout is the one that didn't happen.",theme:"runner"},
  {text:"Your body can stand almost anything. It's your mind you have to convince.",theme:"lightning"},
  {text:"Push yourself because no one else is going to do it for you.",theme:"fire"},
  {text:"The pain you feel today will be the strength you feel tomorrow.",theme:"mountain"},
  {text:"Don't stop when you're tired. Stop when you're done.",theme:"fire"},
  {text:"Train like a beast. Eat like a champion.",theme:"runner"},
  {text:"Results don't care about your excuses.",theme:"lightning"},
  {text:"Your future self is watching you right now through memories.",theme:"star"},
  {text:"Consistency beats intensity every single time.",theme:"water"},
  {text:"Every rep. Every meal. Every night's sleep. It all adds up.",theme:"fire"},
  // Nutrition wisdom
  {text:"Let food be thy medicine and medicine be thy food.",author:"Hippocrates",theme:"leaf"},
  {text:"You are what you eat. Don't be fast, cheap, easy, or fake.",theme:"leaf"},
  {text:"Take care of your body. It's the only place you have to live.",author:"Jim Rohn",theme:"heart"},
  {text:"Eat to nourish your body, not to punish or reward it.",theme:"lotus"},
  {text:"A healthy outside starts from the inside.",theme:"heart"},
  {text:"One meal at a time. One day at a time.",theme:"sunrise"},
  {text:"Your plate is a canvas. Make it colorful.",theme:"leaf"},
  {text:"Eating well is a form of self-respect.",theme:"lotus"},
  {text:"What you eat in private, you wear in public.",theme:"fire"},
  {text:"When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.",author:"Ayurvedic wisdom",theme:"lotus"},
  {text:"Food is not the enemy. Ultra-processing is.",theme:"leaf"},
  // Mindset
  {text:"The mind is everything. What you think, you become.",author:"Buddha",theme:"lotus"},
  {text:"You don't have to be great to start, but you have to start to be great.",author:"Zig Ziglar",theme:"sunrise"},
  {text:"Discipline is choosing between what you want now and what you want most.",theme:"mountain"},
  {text:"Fall seven times, stand up eight.",author:"Japanese proverb",theme:"lightning"},
  {text:"One day or day one. You decide.",theme:"star"},
  {text:"Motivation gets you started. Habit keeps you going.",theme:"water"},
  {text:"You are stronger than you think, braver than you believe.",theme:"heart"},
  {text:"Energy flows where attention goes.",theme:"fire"},
  {text:"It always seems impossible until it's done.",author:"Nelson Mandela",theme:"lightning"},
  {text:"The secret to getting ahead is getting started.",author:"Mark Twain",theme:"runner"},
  {text:"Strong is the new skinny.",theme:"lightning"},
  {text:"You have exactly one body. Treat it accordingly.",theme:"heart"},
  // Goals & progress
  {text:"Every accomplishment starts with the decision to try.",theme:"star"},
  {text:"Progress, not perfection.",theme:"sunrise"},
  {text:"A year from now you may wish you had started today.",theme:"mountain"},
  {text:"Success is the sum of small efforts, repeated day in and day out.",author:"Robert Collier",theme:"water"},
  {text:"Don't compare your chapter 1 to someone else's chapter 20.",theme:"star"},
  {text:"The difference between ordinary and extraordinary is that little extra.",theme:"lightning"},
  {text:"Dream big. Start small. Act now.",theme:"sunrise"},
  {text:"You're not behind. You're on your own path.",theme:"leaf"},
  {text:"Track your progress, not your comparison.",theme:"runner"},
  {text:"It's not about perfect. It's about effort.",author:"Jillian Michaels",theme:"fire"},
  {text:"Small steps every day — that's how mountains are climbed.",theme:"mountain"},
  // Indian & ancient wisdom
  {text:"As is the food, so is the mind. As is the mind, so is the man.",author:"Sivananda",theme:"lotus"},
  {text:"Health is wealth. Peace of mind is happiness.",author:"Swami Vishnu-devananda",theme:"heart"},
  {text:"Arogya eva sarvaartha saadhanam — Good health is the means to achieve all goals.",author:"Ancient wisdom",theme:"lotus"},
  {text:"Eat breakfast like a king, lunch like a prince, dinner like a pauper.",author:"Ayurvedic wisdom",theme:"sunrise"},
  {text:"Balance is not something you find, it's something you create.",theme:"water"},
  {text:"Nourish your body, calm your mind, and let your spirit soar.",theme:"leaf"},
  {text:"The groundwork for all happiness is good health.",author:"Leigh Hunt",theme:"heart"},
  {text:"A fit body, a calm mind, a house full of love.",theme:"lotus"},
  {text:"To keep the body in good health is a duty — otherwise we shall not be able to keep our mind strong.",author:"Buddha",theme:"star"},
  {text:"Rest when you're weary. Refresh and renew yourself.",author:"Ralph Marston",theme:"water"},
  {text:"Your health is an investment, not an expense.",theme:"heart"},
  {text:"Abs are made in the kitchen.",theme:"leaf"},
  {text:"Be the energy you want to attract.",theme:"star"},
  {text:"Silence the doubt. Trust the process.",theme:"mountain"},
  {text:"The body achieves what the mind believes.",theme:"fire"},
];
const THEME_ACCENT:Record<string,string>={
  fire:"#FF6B35",mountain:"#7C9EB2",sunrise:"#FFB347",
  runner:"#52B788",lotus:"#C77DFF",lightning:"#FFFA66",
  leaf:"#74C69D",heart:"#FF6B9D",star:"#A8DADC",water:"#4CC9F0",
};

function QuoteIllustration({theme,accent}:{theme:string;accent:string}) {
  const a=accent;
  switch(theme){
    case "fire":return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        <ellipse cx="50" cy="80" rx="26" ry="9" fill={ha(a,0.20)}/>
        <path d="M50,16 C63,32 74,44 69,62 C66,72 57,77 50,77 C43,77 34,72 31,62 C26,44 37,32 50,16 Z" fill={a}/>
        <path d="M50,30 C57,42 61,52 58,62 C56,67 50,70 50,70 C50,70 44,67 42,62 C39,52 43,42 50,30 Z" fill="rgba(255,255,255,0.32)"/>
        <path d="M50,42 C53,48 54,54 52,60 C51,63 50,65 50,65 C50,65 49,63 48,60 C46,54 47,48 50,42 Z" fill="rgba(255,255,255,0.5)"/>
        <circle cx="38" cy="60" r="4" fill={ha(a,0.45)} style={{filter:"blur(3px)"}}/>
        <circle cx="62" cy="55" r="3" fill={ha(a,0.35)} style={{filter:"blur(2px)"}}/>
      </svg>);
    case "mountain":return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        <polygon points="50,14 20,75 80,75" fill={a}/>
        <polygon points="74,30 54,75 94,75" fill={ha(a,0.50)}/>
        <polygon points="26,42 6,75 46,75" fill={ha(a,0.38)}/>
        <polygon points="38,44 50,14 62,44" fill="rgba(255,255,255,0.28)"/>
        <circle cx="14" cy="24" r="2.5" fill={a}/>
        <circle cx="82" cy="18" r="2" fill={a}/>
        <circle cx="90" cy="30" r="1.5" fill={ha(a,0.6)}/>
        <line x1="6" y1="75" x2="94" y2="75" stroke={ha(a,0.25)} strokeWidth="1.5"/>
      </svg>);
    case "sunrise":return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        <circle cx="50" cy="65" r="20" fill={a}/>
        {[0,30,60,90,120,150,210,240,270,300,330].map((deg,i)=>{
          const rad=deg*Math.PI/180,inn=26,out=34;
          return <line key={i} x1={50+inn*Math.cos(rad)} y1={65+inn*Math.sin(rad)}
            x2={50+out*Math.cos(rad)} y2={65+out*Math.sin(rad)}
            stroke={a} strokeWidth="2.2" strokeLinecap="round"/>;
        })}
        <rect x="5" y="65" width="34" height="2.5" rx="1.25" fill={ha(a,0.5)}/>
        <rect x="61" y="65" width="34" height="2.5" rx="1.25" fill={ha(a,0.5)}/>
        <rect x="14" y="73" width="72" height="2" rx="1" fill={ha(a,0.30)}/>
        <rect x="22" y="80" width="56" height="1.5" rx="0.75" fill={ha(a,0.18)}/>
      </svg>);
    case "runner":return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        <circle cx="50" cy="18" r="8" fill={a}/>
        <path d="M50,26 L44,48 L30,62" stroke={a} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M44,48 L52,68" stroke={a} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M50,26 L60,44 L72,55" stroke={a} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M44,38 L36,50 L30,62 L24,72" stroke={a} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M60,44 L68,55 L72,55 L78,65" stroke={a} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <ellipse cx="50" cy="85" rx="34" ry="3" fill={ha(a,0.15)}/>
        {[0,1,2,3,4].map(i=>(
          <circle key={i} cx={20+i*15} cy={85} r="1.5" fill={ha(a,0.4)}/>
        ))}
      </svg>);
    case "lotus":return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        <path d="M50,75 C50,75 28,58 28,42 C28,32 36,26 44,30 C40,20 50,15 50,15 C50,15 60,20 56,30 C64,26 72,32 72,42 C72,58 50,75 50,75 Z" fill={a}/>
        <path d="M50,75 C50,75 36,62 36,50 C36,44 42,40 47,42 C44,36 50,32 50,32 C50,32 56,36 53,42 C58,40 64,44 64,50 C64,62 50,75 50,75 Z" fill="rgba(255,255,255,0.3)"/>
        <ellipse cx="50" cy="78" rx="22" ry="5" fill={ha(a,0.18)}/>
        <line x1="50" y1="75" x2="50" y2="85" stroke={ha(a,0.5)} strokeWidth="2"/>
        <path d="M38,54 C32,48 30,40 34,36" stroke={ha(a,0.4)} strokeWidth="1.5" fill="none"/>
        <path d="M62,54 C68,48 70,40 66,36" stroke={ha(a,0.4)} strokeWidth="1.5" fill="none"/>
      </svg>);
    case "lightning":return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        <path d="M58,10 L36,52 L50,52 L42,90 L64,48 L50,48 Z" fill={a}/>
        <path d="M58,10 L50,52 L56,52 L50,72" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none"/>
        <ellipse cx="50" cy="90" rx="22" ry="5" fill={ha(a,0.15)}/>
        {[[-18,-8],[-26,18],[18,12],[24,-4]].map(([x,y],i)=>(
          <circle key={i} cx={50+x} cy={50+y} r={2-i*0.3} fill={ha(a,0.45)}/>
        ))}
      </svg>);
    case "leaf":return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        <path d="M50,20 C70,20 85,35 85,55 C85,70 70,80 50,80 C50,80 15,72 15,50 C15,30 30,20 50,20 Z" fill={a}/>
        <path d="M50,80 L50,25" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
        <path d="M50,45 C60,40 72,38 82,42" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none"/>
        <path d="M50,55 C62,52 74,52 84,55" stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" fill="none"/>
        <path d="M50,65 C58,65 66,67 74,70" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" fill="none"/>
        <ellipse cx="50" cy="85" rx="18" ry="4" fill={ha(a,0.20)}/>
      </svg>);
    case "heart":return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        <path d="M50,80 C50,80 18,60 18,38 C18,26 28,20 38,24 C44,26 48,30 50,34 C52,30 56,26 62,24 C72,20 82,26 82,38 C82,60 50,80 50,80 Z" fill={a}/>
        <path d="M50,80 C50,80 28,65 24,48 C28,54 36,56 42,52 C38,58 42,68 50,74 C58,68 62,58 58,52 C64,56 72,54 76,48 C72,65 50,80 50,80 Z" fill="rgba(255,255,255,0.18)"/>
        <path d="M22,48 L30,48 L34,42 L38,56 L42,44 L46,52 L50,48 L78,48" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="50" cy="84" rx="20" ry="4" fill={ha(a,0.18)}/>
      </svg>);
    case "star":return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        <polygon points="50,12 56,34 80,34 60,50 68,72 50,58 32,72 40,50 20,34 44,34" fill={a}/>
        <polygon points="50,20 54,32 68,32 57,42 61,56 50,47 39,56 43,42 32,32 46,32" fill="rgba(255,255,255,0.28)"/>
        <circle cx="22" cy="22" r="2.5" fill={ha(a,0.7)}/>
        <circle cx="80" cy="18" r="2" fill={ha(a,0.6)}/>
        <circle cx="88" cy="68" r="1.5" fill={ha(a,0.5)}/>
        <circle cx="14" cy="72" r="2" fill={ha(a,0.5)}/>
        <circle cx="76" cy="82" r="1.5" fill={ha(a,0.4)}/>
      </svg>);
    case "water":default:return(
      <svg width="130" height="130" viewBox="0 0 100 100">
        {[0,1,2,3].map(i=>(
          <path key={i} d={`M8,${42+i*13} C22,${36+i*13} 38,${48+i*13} 50,${42+i*13} C62,${36+i*13} 78,${48+i*13} 92,${42+i*13}`}
            stroke={i===0?a:ha(a,0.65-i*0.15)} strokeWidth={3-i*0.5} fill="none" strokeLinecap="round"/>
        ))}
        <circle cx="50" cy="26" r="12" fill={ha(a,0.30)} style={{filter:"blur(4px)"}}/>
        <path d="M44,18 C44,22 42,28 50,28 C58,28 56,22 56,18 C56,14 50,10 50,10 C50,10 44,14 44,18 Z" fill={a}/>
        <ellipse cx="50" cy="90" rx="28" ry="4" fill={ha(a,0.15)}/>
      </svg>);
  }
}

function DailyQuote({onDone}:{onDone:()=>void}) {
  const [q]=useState(()=>MOTIVATION_QUOTES[Math.floor(Math.random()*MOTIVATION_QUOTES.length)]);
  const accent=THEME_ACCENT[q.theme]||"#FFFA66";
  const [show,setShow]=useState(false);
  useEffect(()=>{
    const t=setTimeout(()=>setShow(true),1050);
    return()=>clearTimeout(t);
  },[]);
  const words=q.text.split(" ");
  const wordDelay=(i:number)=>0.18+i*0.042;
  const ctaDelay=0.28+words.length*0.042;
  return(
    <motion.div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{background:"#070312"}} onClick={show?onDone:undefined}>

      {/* ── Aurora background blobs (breathe + drift) ── */}
      <motion.div style={{position:"absolute",width:620,height:620,borderRadius:"50%",
        top:-200,left:-220,filter:"blur(64px)",pointerEvents:"none",
        background:`radial-gradient(circle,${ha(accent,0.24)} 0%,transparent 65%)`}}
        animate={{scale:[1,1.20,0.93,1.14,1],x:[0,32,-22,16,0],y:[0,-28,20,-12,0]}}
        transition={{duration:15,repeat:Infinity,ease:"easeInOut"}}/>
      <motion.div style={{position:"absolute",width:520,height:520,borderRadius:"50%",
        bottom:-180,right:-160,filter:"blur(58px)",pointerEvents:"none",
        background:"radial-gradient(circle,rgba(139,92,246,0.32) 0%,transparent 65%)"}}
        animate={{scale:[1,0.86,1.16,0.94,1],x:[0,-24,16,-20,0],y:[0,22,-16,24,0]}}
        transition={{duration:19,repeat:Infinity,ease:"easeInOut",delay:2.5}}/>
      <motion.div style={{position:"absolute",width:360,height:360,borderRadius:"50%",
        top:"38%",right:-110,filter:"blur(48px)",pointerEvents:"none",
        background:"radial-gradient(circle,rgba(56,189,248,0.20) 0%,transparent 65%)"}}
        animate={{scale:[1,1.24,0.90,1.12,1],x:[0,18,-28,12,0],y:[0,-20,28,-14,0]}}
        transition={{duration:24,repeat:Infinity,ease:"easeInOut",delay:6}}/>

      {/* Dot grid */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        backgroundImage:"radial-gradient(rgba(255,255,255,0.048) 1.2px,transparent 1.2px)",
        backgroundSize:"24px 24px"}}/>

      {/* ── Nova burst rings (fire once on mount) ── */}
      {[0,1,2,3].map(ring=>(
        <motion.div key={ring} style={{
          position:"absolute",width:14,height:14,borderRadius:"50%",
          border:`${2.4-ring*0.45}px solid ${ring===0?accent:`rgba(255,255,255,${0.62-ring*0.12})`}`,
          pointerEvents:"none",
        }}
          initial={{scale:0,opacity:0}}
          animate={{scale:[0,10+ring*3.5,10+ring*3.5],opacity:[0,ring===0?0.92:0.68,0]}}
          transition={{duration:1.5+ring*0.24,delay:ring*0.14,ease:[0.23,1,0.32,1],times:[0,0.28,1]}}/>
      ))}

      {/* Center star point — flash then fade */}
      <motion.div style={{
        position:"absolute",width:10,height:10,borderRadius:"50%",
        background:"#fff",pointerEvents:"none",
        boxShadow:`0 0 22px 8px ${accent}, 0 0 70px 24px ${ha(accent,0.44)}`,
      }}
        initial={{scale:0,opacity:0}}
        animate={{scale:[0,3.2,0.7,1.4,0],opacity:[0,1,0.88,0.55,0]}}
        transition={{duration:1.15,times:[0,0.16,0.46,0.72,1],ease:[0.23,1,0.32,1]}}/>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm mx-auto w-full">

        {/* Chip */}
        <motion.div className="mb-5"
          initial={{opacity:0,y:-20,scale:0.82}}
          animate={show?{opacity:1,y:0,scale:1}:{}}
          transition={{...SPRING_ENTRY,delay:0}}>
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{background:ha(accent,0.16),border:`1px solid ${ha(accent,0.40)}`,letterSpacing:"0.12em"}}>
            <span style={{fontSize:12}}>⚡</span>
            <span className="font-black text-[10px] uppercase tracking-widest" style={{color:accent}}>Today's fuel</span>
          </div>
        </motion.div>

        {/* Illustration — materialises blur → sharp, then floats */}
        <motion.div className="mb-5"
          initial={{opacity:0,scale:0.70,filter:"blur(20px)"}}
          animate={show?{opacity:1,scale:1,filter:"blur(0px)"}:{}}
          transition={{type:"spring",duration:0.92,bounce:0.12,delay:0.06}}>
          <motion.div
            animate={show?{y:[0,-10,0]}:{}}
            transition={{duration:3.8,repeat:Infinity,ease:"easeInOut",delay:1.4}}>
            <QuoteIllustration theme={q.theme} accent={accent}/>
          </motion.div>
        </motion.div>

        {/* Opening quote marks — SVG path draw */}
        <motion.div style={{marginBottom:8,alignSelf:"flex-start"}}
          initial={{opacity:0}}
          animate={show?{opacity:1}:{}}
          transition={{duration:0.20,delay:0.14}}>
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
            <motion.path d="M4 24 C4 14 10 6 20 4" stroke={accent} strokeWidth="3.5"
              strokeLinecap="round"
              initial={{pathLength:0,opacity:0}}
              animate={show?{pathLength:1,opacity:0.55}:{}}
              transition={{duration:0.40,delay:0.20,ease:EASE_OUT}}/>
            <motion.path d="M22 24 C22 14 28 6 38 4" stroke={accent} strokeWidth="3.5"
              strokeLinecap="round"
              initial={{pathLength:0,opacity:0}}
              animate={show?{pathLength:1,opacity:0.40}:{}}
              transition={{duration:0.40,delay:0.32,ease:EASE_OUT}}/>
          </svg>
        </motion.div>

        {/* Quote words — 3D fold-in stagger */}
        <div className="mb-5" style={{minHeight:90,perspective:600}}>
          {words.map((word,i)=>(
            <motion.span key={i}
              style={{display:"inline-block",marginRight:"0.28em",fontWeight:900,
                fontSize:22,lineHeight:1.25,letterSpacing:"-0.4px",color:"#fff",
                transformOrigin:"50% 0%"}}
              initial={{opacity:0,y:22,rotateX:-55}}
              animate={show?{opacity:1,y:0,rotateX:0}:{}}
              transition={{type:"spring",duration:0.54,bounce:0.14,delay:wordDelay(i)}}>
              {word}
            </motion.span>
          ))}
        </div>

        {/* Author */}
        <motion.div style={{marginBottom:28}}
          initial={{opacity:0,y:10}}
          animate={show?{opacity:1,y:0}:{}}
          transition={{...SPRING_ENTRY,delay:wordDelay(words.length)}}>
          {q.author&&(
            <span className="text-xs font-bold px-3 py-1 rounded-full"
              style={{background:ha(accent,0.14),color:ha(accent,0.90),
                border:`1px solid ${ha(accent,0.26)}`}}>
              — {q.author}
            </span>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{opacity:0,scale:0.86,y:20}}
          animate={show?{opacity:1,scale:1,y:0}:{}}
          transition={{...SPRING_ENTRY,delay:ctaDelay}}>
          <motion.button onClick={e=>{e.stopPropagation();onDone();}}
            className="px-10 py-4 rounded-2xl font-black text-base tracking-wide"
            style={{background:accent,color:"#070312",
              boxShadow:`0 14px 44px ${ha(accent,0.42)}`}}
            whileTap={{scale:0.96}}
            animate={{boxShadow:[
              `0 14px 44px ${ha(accent,0.38)}`,
              `0 14px 62px ${ha(accent,0.60)}`,
              `0 14px 44px ${ha(accent,0.38)}`,
            ]}}
            transition={{duration:2.4,repeat:Infinity,ease:"easeInOut",delay:1.4}}>
            Let's crush it →
          </motion.button>
          <p className="mt-3 text-xs" style={{color:"rgba(255,255,255,0.20)"}}>tap anywhere to continue</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Welcome({lang,onLang,onNew,onLogin}:{lang:Lang;onLang:(l:Lang)=>void;onNew:()=>void;onLogin:()=>void}) {
  const t=makeT(lang);
  const Y="#FFFA66";
  const wq=useMemo(()=>MOTIVATION_QUOTES[Math.floor(Math.random()*MOTIVATION_QUOTES.length)],[]);
  const wa=THEME_ACCENT[wq.theme]||Y;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16 relative overflow-hidden"
      style={{background:"#0A0A0A"}}>
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute rounded-full"
          style={{width:520,height:520,background:"radial-gradient(circle,rgba(255,250,102,0.18) 0%,transparent 68%)",top:-180,left:-180,filter:"blur(28px)"}}
          animate={{scale:[1,1.18,0.94,1.12,1],x:[0,28,-18,14,0],y:[0,-22,16,-10,0],borderRadius:["50%","48% 52% 54% 46%","52% 48% 46% 54%","50%"]}}
          transition={{duration:13,repeat:Infinity,ease:"easeInOut"}}/>
        <motion.div className="absolute rounded-full"
          style={{width:460,height:460,background:"radial-gradient(circle,rgba(55,8,84,0.68) 0%,transparent 68%)",bottom:-130,right:-130,filter:"blur(32px)"}}
          animate={{scale:[1,0.86,1.18,0.92,1],x:[0,-22,14,-18,0],y:[0,20,-14,22,0],borderRadius:["50%","54% 46% 48% 52%","46% 54% 52% 48%","50%"]}}
          transition={{duration:17,repeat:Infinity,ease:"easeInOut",delay:3}}/>
        <motion.div className="absolute rounded-full"
          style={{width:300,height:300,background:"radial-gradient(circle,rgba(139,92,246,0.22) 0%,transparent 68%)",top:"35%",right:-80,filter:"blur(36px)"}}
          animate={{scale:[1,1.26,0.88,1.14,1],x:[0,16,-24,10,0],y:[0,-18,22,-12,0]}}
          transition={{duration:21,repeat:Infinity,ease:"easeInOut",delay:8}}/>
        <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(rgba(255,255,255,0.05) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
      </div>
      <FloatingFoods/>

      <motion.div className="relative z-10 w-full max-w-sm"
        variants={staggerContainer} initial="hidden" animate="show">

        {/* Hero highlight */}
        <motion.div variants={slideUp} className="flex flex-col items-center mb-10">
          <motion.div className="relative flex flex-col items-center px-10 py-7 rounded-3xl mb-1"
            style={{
              background:"linear-gradient(135deg,rgba(255,250,102,0.13) 0%,rgba(255,250,102,0.05) 100%)",
              border:"1.5px solid rgba(255,250,102,0.28)",
              boxShadow:"0 0 48px rgba(255,250,102,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
            animate={{boxShadow:["0 0 48px rgba(255,250,102,0.18), inset 0 1px 0 rgba(255,255,255,0.08)","0 0 72px rgba(255,250,102,0.30), inset 0 1px 0 rgba(255,255,255,0.10)","0 0 48px rgba(255,250,102,0.18), inset 0 1px 0 rgba(255,255,255,0.08)"]}}
            transition={{duration:3.2,repeat:Infinity,ease:"easeInOut"}}>
            <div className="absolute -top-px left-1/2 -translate-x-1/2 h-px rounded-full"
              style={{width:"60%",background:"linear-gradient(90deg,transparent,rgba(255,250,102,0.7),transparent)"}}/>
            <h1 className="font-black text-white leading-none mb-2 text-center"
              style={{fontSize:58,letterSpacing:"-3px",filter:`drop-shadow(0 0 24px rgba(255,250,102,0.7))`}}>EatBC</h1>
            <p className="font-bold text-center tracking-widest uppercase"
              style={{color:Y,fontSize:11,letterSpacing:"0.18em",opacity:0.85}}>
              Eat Better &amp; Count
            </p>
          </motion.div>
        </motion.div>

        {/* Daily quote */}
        <motion.div variants={slideUp}
          className="px-5 py-5 rounded-2xl mb-8"
          style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${ha(wa,0.25)}`}}>
          <p className="font-semibold leading-snug" style={{color:"rgba(255,255,255,0.85)",fontSize:14,textAlign:"center"}}>"{wq.text}"</p>
          {wq.author&&<p className="mt-2.5 font-bold text-xs" style={{color:ha(wa,0.7),textAlign:"center"}}>— {wq.author}</p>}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={slideUp} className="space-y-4">
          <motion.button onClick={onNew}
            className="group relative w-full py-4 px-5 rounded-2xl font-black text-[1.05rem]"
            style={{background:Y,color:"#0A0A0A",boxShadow:"0 8px 32px rgba(255,250,102,0.25)"}}
            whileTap={{scale:0.97}} transition={SPRING_CRISP}>
            <span className="absolute left-5 top-1/2 -translate-y-1/2"><UserPlus size={21}/></span>
            <span className="block text-center">{t("newWarrior")}</span>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"><ArrowRight size={19}/></span>
          </motion.button>
          <motion.button onClick={onLogin}
            className="group relative w-full py-4 px-5 rounded-2xl font-black text-[1.05rem]"
            style={{background:"transparent",border:"1.5px solid rgba(255,255,255,0.20)",color:"rgba(255,255,255,0.82)"}}
            whileTap={{scale:0.97}} transition={SPRING_CRISP}>
            <span className="absolute left-5 top-1/2 -translate-y-1/2"><User size={21}/></span>
            <span className="block text-center">{t("alreadyHustle")}</span>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"><ArrowRight size={19}/></span>
          </motion.button>
        </motion.div>
      </motion.div>
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
  {e:"🍌",n:"Banana"},{e:"🍠",n:"Sweet Potato"},{e:"🌰",n:"Almonds"},{e:"🥑",n:"Avocado"},
  {e:"🍄",n:"Mushroom"},{e:"🥬",n:"Spinach"},{e:"🫕",n:"Tofu"},{e:"🐠",n:"Salmon"},
  {e:"🌱",n:"Soya Chunks"},{e:"🥕",n:"Carrot"},{e:"🥥",n:"Coconut"},{e:"🫙",n:"Flaxseed"},
  {e:"🌿",n:"Methi"},{e:"🧄",n:"Garlic"},{e:"🌽",n:"Corn"},{e:"🍇",n:"Berries"},
  {e:"🫐",n:"Amla"},{e:"🥝",n:"Kiwi"},{e:"🍋",n:"Lemon"},{e:"🌻",n:"Sunflower Seeds"},
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
        <span className="font-black text-white tracking-tight mb-6 block">EatBC</span>
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3"
          style={{background:"rgba(0,255,157,0.14)",border:"1px solid rgba(0,255,157,0.3)"}}>
          <Sparkles size={12} style={{color:"#00FF9D"}}/>
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{color:"#00FF9D"}}>Know your fuel</span>
        </div>
        <h2 className="text-white font-black leading-tight" style={{fontSize:30,letterSpacing:"-1px"}}>
          {name?`${name}, pick`:"Pick"} <span style={{color:"#7CFFC4"}}>5 foods</span> that fuel you
        </h2>
        <p className="text-white/55 text-sm mt-1.5">You've seen what each food does. Now pick your team — your plan gets handcrafted around what actually makes it to your plate.</p>

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
          {done?<>Lock in my plan <Sparkles size={18}/></>:`${NEED-picks.length} more to unlock your plan`}
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
        <span className="font-bold text-gray-700 mb-2 block">EatBC</span>
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
function Signup({profile,plan,onDone,onBack,onLogin}:{profile:Profile;plan:Plan|null;onDone:(sess:Session)=>void;onBack:()=>void;onLogin:()=>void}) {
  const [id,setId]=useState(""); const [pw,setPw]=useState(""); const [pw2,setPw2]=useState("");
  const [consent,setConsent]=useState(false);
  const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
  const [alreadyExists,setAlreadyExists]=useState(false);
  async function submit() {
    setErr(""); setAlreadyExists(false);
    if (!id.trim()||!pw){setErr("Enter both fields");return;}
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
      if (msg==="Username already taken") { setAlreadyExists(true); setErr(msg); }
      else setErr(msg||(navigator.onLine?"Registration is temporarily unavailable. Please try again shortly.":"No internet connection."));
    } finally { setBusy(false); }
  }
  return (
    <Shell>
      <Card className="p-6 md:p-8">
        <span className="font-bold text-gray-700 mb-2 block">EatBC</span>
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
        {err&&(
          <div className="mb-3 rounded-2xl px-4 py-3" style={{background:"#FEF2F2",border:"1px solid #FECACA"}}>
            <div className="flex items-center gap-2 text-red-600 text-sm font-semibold"><AlertCircle size={16}/>{err}</div>
            {alreadyExists&&(
              <button onClick={onLogin}
                className="mt-2 w-full py-2.5 rounded-xl text-white font-bold text-sm"
                style={{background:"#1D1D1F"}}>
                Already have an account? Log in →
              </button>
            )}
          </div>
        )}
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
  /* online search (Open Food Facts) */
  const [onlineResults,setOnlineResults]=useState<LogFood[]>([]);
  const [onlineBusy,setOnlineBusy]=useState(false);
  const onlineTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null);

  const total=log.reduce((s,x)=>s+x.cal,0);
  const ALL_FOODS=[...customFoods,...LOG_DB];
  const CATS=["All",...Array.from(new Set(ALL_FOODS.map(f=>f.cat)))];
  const localFiltered=ALL_FOODS.filter(f=>{
    const matchSearch=!search||f.n.toLowerCase().includes(search.toLowerCase());
    const matchCat=cat==="All"||f.cat===cat;
    return matchSearch&&matchCat;
  }).slice(0,40);
  const filtered=onlineResults.length>0&&search.length>2?[...localFiltered,...onlineResults]:localFiltered;

  useEffect(()=>{
    if(search.length<3){setOnlineResults([]);return;}
    if(onlineTimerRef.current) clearTimeout(onlineTimerRef.current);
    onlineTimerRef.current=setTimeout(async()=>{
      if(localFiltered.length>=8){return;}  // enough local results, skip API
      setOnlineBusy(true);
      try{
        const r=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(search)}&search_simple=1&action=process&json=1&page_size=12&fields=product_name,nutriments,serving_size,brands&lc=en`,{signal:AbortSignal.timeout(5000)});
        const d=await r.json() as {products?:Record<string,unknown>[]};
        const results:LogFood[]=(d.products||[])
          .filter((p)=>p.product_name&&(p.nutriments as Record<string,number>|undefined)?.["energy-kcal_serving"])
          .slice(0,8)
          .map((p)=>{
            const nm=p.product_name as string;
            const brand=p.brands as string|undefined;
            const nu=p.nutriments as Record<string,number>;
            return {
              n:brand?`${nm} (${(brand).split(",")[0].trim()})`:nm,
              c:Math.round(nu["energy-kcal_serving"]||nu["energy-kcal_100g"]||0),
              p:Math.round(nu["proteins_serving"]||nu["proteins_100g"]||0),
              q:(p.serving_size as string)||"per serving",
              cat:"🌐 Online",
            };
          })
          .filter(f=>f.c>0);
        setOnlineResults(results);
      }catch{setOnlineResults([]);}
      setOnlineBusy(false);
    },600);
    return()=>{if(onlineTimerRef.current)clearTimeout(onlineTimerRef.current);};
  },[search]);

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
    {label:"On-track rate",val:`${rate}%`,emoji:"🎯"},
    {label:"Best streak",val:`${best} days`,emoji:"🔥"},
    {label:"Avg protein",val:`${avgProtein}g`,emoji:"💪"},
    {label:"Days tracked",val:`${tracked}`,emoji:"📅"},
  ];
  let nudge="You're building a real habit — keep showing up.";
  if (rate>=80) nudge="Outstanding consistency! You're in the top tier of EatBC warriors. 🏆";
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
          {busy?"Joining…":"Join the board with my streak 🔥"}
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
            const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`;
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

/* ─────────────── Month Performance Calendar ─────────────── */
const FULL_MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];
const SHORT_MONTH_NAMES=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CAL_DAY_HDRS=["S","M","T","W","T","F","S"];

function calScoreColor(score:number, hasData:boolean):string {
  if (!hasData) return "#F3F4F6";
  if (score>=85) return "#1DAA61";
  if (score>=65) return "#4ADE80";
  if (score>=40) return "#FBBF24";
  if (score>=15) return "#FCA5A5";
  return "#FEE2E2";
}
function calScoreLabel(score:number, hasData:boolean):string {
  if (!hasData) return "No data";
  if (score>=85) return "Crushed it";
  if (score>=65) return "Good day";
  if (score>=40) return "Partial";
  return "Rough one";
}

function MonthCalendar({
  history, workoutLog, lastRecalcWeight, onClose
}: {
  history: Record<string,HistEntry>;
  workoutLog: Record<string,ExerciseLog[]>;
  lastRecalcWeight?: number;
  onClose: ()=>void;
}) {
  const now=new Date();
  const [view,setView]=useState({y:now.getFullYear(),m:now.getMonth()});
  const [picked,setPicked]=useState<string|null>(null);

  const todayISO=isoDate();
  const daysInMonth=new Date(view.y,view.m+1,0).getDate();
  const startDOW=new Date(view.y,view.m,1).getDay();
  const isCurrentMonth=view.y===now.getFullYear()&&view.m===now.getMonth();

  function toISO(day:number):string {
    return `${view.y}-${String(view.m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  }

  function getDayScore(iso:string):{score:number;hasData:boolean;mealFrac:number;waterFrac:number;workout:boolean} {
    const e=history[iso];
    const workout=(workoutLog[iso]||[]).length>0;
    if (!e) return {score:0,hasData:false,mealFrac:0,waterFrac:0,workout};
    const wt=waterTarget(lastRecalcWeight);
    const mealFrac=e.total>0?e.meals/e.total:0;
    const waterFrac=wt>0?Math.min(e.water/wt,1):0;
    const score=Math.round(mealFrac*65+waterFrac*20+(workout?15:0));
    return {score,hasData:true,mealFrac,waterFrac,workout};
  }

  // Grid cells: nulls for offset, then 1..daysInMonth
  const cells:(number|null)[]=[
    ...Array(startDOW).fill(null),
    ...Array.from({length:daysInMonth},(_,i)=>i+1),
  ];
  while(cells.length%7!==0) cells.push(null);

  // Monthly totals
  let perfectCount=0, goodCount=0, workoutCount=0;
  for(let d=1;d<=daysInMonth;d++){
    const iso=toISO(d);
    if(iso>todayISO) continue;
    const {score,hasData,workout}=getDayScore(iso);
    if(hasData&&score>=85) perfectCount++;
    else if(hasData&&score>=65) goodCount++;
    if(workout) workoutCount++;
  }

  const pickedScore=picked?getDayScore(picked):null;
  const pickedEntry=picked?history[picked]:null;
  const pickedWorkouts=picked?(workoutLog[picked]||[]):[];
  const pickedDay=picked?parseInt(picked.split("-")[2]):0;

  function prevMonth(){
    const d=new Date(view.y,view.m-1,1);
    setView({y:d.getFullYear(),m:d.getMonth()});
    setPicked(null);
  }
  function nextMonth(){
    const d=new Date(view.y,view.m+1,1);
    setView({y:d.getFullYear(),m:d.getMonth()});
    setPicked(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{background:"rgba(0,0,0,0.55)"}}>
      <div className="flex-1" onClick={onClose}/>
      <div className="bg-white rounded-t-3xl overflow-y-auto" style={{maxHeight:"90vh"}}>
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-0.5">
          <div className="w-10 h-1 rounded-full bg-gray-200"/>
        </div>

        {/* month navigation */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <button onClick={prevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{background:"#F3F4F6"}}>
            <ChevronLeft size={18} className="text-gray-600"/>
          </button>
          <div className="text-center">
            <h2 className="font-black text-gray-900 text-base leading-tight">{FULL_MONTH_NAMES[view.m]} {view.y}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Tap a day to inspect</p>
          </div>
          <button onClick={nextMonth} disabled={isCurrentMonth}
            className="w-9 h-9 flex items-center justify-center rounded-full transition"
            style={{background:"#F3F4F6",opacity:isCurrentMonth?0.25:1}}>
            <ChevronRight size={18} className="text-gray-600"/>
          </button>
        </div>

        {/* day-of-week headers */}
        <div className="grid grid-cols-7 px-4 mb-1">
          {CAL_DAY_HDRS.map((h,i)=>(
            <div key={i} className="text-center text-[11px] font-bold text-gray-400 py-1">{h}</div>
          ))}
        </div>

        {/* heatmap grid */}
        <div className="grid grid-cols-7 gap-1.5 px-4">
          {cells.map((day,i)=>{
            if(!day) return <div key={`x${i}`}/>;
            const iso=toISO(day);
            const isFuture=iso>todayISO;
            const isToday=iso===todayISO;
            const isPicked=picked===iso;
            const {score,hasData,mealFrac,waterFrac,workout}=getDayScore(iso);
            const bg=isFuture?"transparent":calScoreColor(score,hasData);
            const textCol=(!isFuture&&hasData&&score>=40)?"#fff":isToday?"#1DAA61":"#9CA3AF";

            return (
              <button key={iso} disabled={isFuture}
                onClick={()=>setPicked(isPicked?null:iso)}
                className="relative flex flex-col items-center justify-center rounded-[14px] transition-all duration-150"
                style={{
                  aspectRatio:"1",background:bg,opacity:isFuture?0.22:1,
                  border:isToday?"2.5px solid #1DAA61":isPicked?"2px solid #6366F1":"1.5px solid transparent",
                  boxShadow:isToday?"0 0 0 3px rgba(29,170,97,0.15)":isPicked?"0 0 0 3px rgba(99,102,241,0.12)":"none",
                  transform:isPicked?"scale(1.1)":"scale(1)",
                }}>
                <span style={{fontSize:12,fontWeight:700,lineHeight:1,color:textCol}}>{day}</span>
                {!isFuture&&hasData&&(
                  <div className="flex gap-[3px] mt-[3px]">
                    <div style={{width:4,height:4,borderRadius:"50%",background:mealFrac>=0.6?"rgba(255,255,255,0.92)":"rgba(255,255,255,0.28)"}}/>
                    <div style={{width:4,height:4,borderRadius:"50%",background:waterFrac>=0.6?"rgba(255,255,255,0.92)":"rgba(255,255,255,0.28)"}}/>
                    <div style={{width:4,height:4,borderRadius:"50%",background:workout?"rgba(255,255,255,0.92)":"rgba(255,255,255,0.28)"}}/>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* dot legend */}
        <div className="flex items-center justify-center gap-5 px-4 mt-3">
          {[["Meals","#1DAA61"],["Water","#38BDF8"],["Workout","#A78BFA"]].map(([label,col])=>(
            <div key={label} className="flex items-center gap-1.5">
              <div style={{width:7,height:7,borderRadius:"50%",background:col}}/>
              <span style={{fontSize:10,color:"#9CA3AF",fontWeight:600}}>{label}</span>
            </div>
          ))}
        </div>

        {/* color scale legend */}
        <div className="flex items-center justify-center gap-3 mt-2 mb-4 flex-wrap px-4">
          {[["#1DAA61","Crushed it"],["#4ADE80","Good"],["#FBBF24","Partial"],["#FCA5A5","Rough"],["#F3F4F6","No data"]].map(([col,label])=>(
            <div key={label} className="flex items-center gap-1">
              <div style={{width:12,height:12,borderRadius:3,background:col,border:col==="#F3F4F6"?"1px solid #E5E7EB":"none"}}/>
              <span style={{fontSize:10,color:"#6B7280"}}>{label}</span>
            </div>
          ))}
        </div>

        {/* selected day detail */}
        {picked&&pickedScore&&(
          <div className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{border:"1.5px solid #E5E7EB"}}>
            {/* header bar */}
            <div className="px-4 py-3 flex items-center justify-between"
              style={{background:calScoreColor(pickedScore.score,pickedScore.hasData)}}>
              <div>
                <div style={{fontWeight:900,color:"#fff",fontSize:14}}>
                  {FULL_MONTH_NAMES[view.m]} {pickedDay}{picked===todayISO?" · Today":""}
                </div>
                <div style={{color:"rgba(255,255,255,0.80)",fontSize:12,marginTop:2}}>
                  {calScoreLabel(pickedScore.score,pickedScore.hasData)}
                  {pickedScore.hasData?` · ${pickedScore.score}/100`:""}
                </div>
              </div>
              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{background:"rgba(255,255,255,0.22)"}}>
                <span style={{fontWeight:900,color:"#fff",fontSize:17}}>{pickedScore.score}</span>
              </div>
            </div>
            {/* stats row */}
            {pickedEntry?(
              <div className="px-4 py-3 bg-white grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div style={{fontSize:18,fontWeight:900,color:"#1F2937"}}>{pickedEntry.meals}/{pickedEntry.total}</div>
                  <div style={{fontSize:11,color:"#9CA3AF",fontWeight:600}}>Meals</div>
                </div>
                <div className="text-center" style={{borderLeft:"1px solid #F3F4F6",borderRight:"1px solid #F3F4F6"}}>
                  <div style={{fontSize:18,fontWeight:900,color:"#1F2937"}}>{pickedEntry.water}</div>
                  <div style={{fontSize:11,color:"#9CA3AF",fontWeight:600}}>Glasses</div>
                </div>
                <div className="text-center">
                  <div style={{fontSize:18,fontWeight:900,color:"#1F2937"}}>{pickedEntry.cal}</div>
                  <div style={{fontSize:11,color:"#9CA3AF",fontWeight:600}}>kcal</div>
                </div>
              </div>
            ):(
              <div className="px-4 py-4 bg-white text-center" style={{color:"#9CA3AF",fontSize:13}}>
                No activity recorded for this day.
              </div>
            )}
            {/* workout tags */}
            {pickedWorkouts.length>0&&(
              <div className="px-4 pb-3 pt-1 bg-white border-t border-gray-50">
                <div style={{fontSize:11,color:"#9CA3AF",fontWeight:600,marginBottom:6}}>Exercises</div>
                <div className="flex flex-wrap gap-1.5">
                  {pickedWorkouts.map((ex,idx)=>(
                    <span key={idx} style={{
                      fontSize:11,fontWeight:700,
                      padding:"3px 10px",borderRadius:999,
                      background:"#EDE9FE",color:"#7C3AED",
                    }}>{ex.n}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* monthly summary */}
        <div className="px-4 pb-8">
          <p style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:12}}>
            {isCurrentMonth?"This month so far":`${SHORT_MONTH_NAMES[view.m]} ${view.y} summary`}
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl p-3.5 text-center" style={{background:"#F0FDF4"}}>
              <div style={{fontSize:26,fontWeight:900,color:"#16A34A",lineHeight:1}}>{perfectCount}</div>
              <div style={{fontSize:11,fontWeight:600,color:"#4ADE80",marginTop:4}}>Perfect</div>
            </div>
            <div className="rounded-2xl p-3.5 text-center" style={{background:"#FEFCE8"}}>
              <div style={{fontSize:26,fontWeight:900,color:"#CA8A04",lineHeight:1}}>{goodCount}</div>
              <div style={{fontSize:11,fontWeight:600,color:"#FBBF24",marginTop:4}}>Good days</div>
            </div>
            <div className="rounded-2xl p-3.5 text-center" style={{background:"#F5F3FF"}}>
              <div style={{fontSize:26,fontWeight:900,color:"#7C3AED",lineHeight:1}}>{workoutCount}</div>
              <div style={{fontSize:11,fontWeight:600,color:"#A78BFA",marginTop:4}}>Workouts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Reminders / nudge system ─────────────── */
const NUDGE_MSGS: {cat:string; title:string; body:string}[] = [
  // water
  {cat:"water", title:"Hydration check", body:"Your cells are screaming for water. They're tiny but very loud."},
  {cat:"water", title:"Plot twist", body:"You're 60% water. Time to top up the story."},
  {cat:"water", title:"H₂O o'clock", body:"Not optional. Well, technically it is. But also — it really isn't."},
  {cat:"water", title:"The plant on your desk is judging you", body:"Water. Now. Both of you need it."},
  {cat:"water", title:"Friendly reminder", body:"Water before that next snack? Your kidneys would give you a standing ovation."},
  {cat:"water", title:"Gentle hydration guilt", body:"You haven't had water in a while. Your skin has noticed."},
  // meal
  {cat:"meal", title:"Food diary's feeling lonely", body:"Log something. It doesn't have to be impressive."},
  {cat:"meal", title:"Calories don't log themselves", body:"You ate. Probably. Open the diary and confirm."},
  {cat:"meal", title:"Identity check", body:"Your dinner looks suspicious from here. Log it before evidence disappears."},
  {cat:"meal", title:"Just checking", body:"Did you eat? Great. Did you log it? Those are different questions."},
  {cat:"meal", title:"The food wants to be counted", body:"It came all this way. Give it a line in the diary."},
  {cat:"meal", title:"Meal tracker waving at you", body:"One tap. Thirty seconds. Tomorrow-you will be grateful."},
  // workout
  {cat:"workout", title:"Workout log time", body:"Your body did something today. Even staying upright counts. Log it."},
  {cat:"workout", title:"Streak is nervous", body:"Workout logged = streak thriving. Workout unlogged = streak sweating nervously."},
  {cat:"workout", title:"Your muscles have feelings", body:"They made an effort. Acknowledge them. They're sensitive."},
  {cat:"workout", title:"Steps don't count themselves", body:"10,000 steps want to exist on record. Open the tracker."},
  {cat:"workout", title:"Rest day? Totally valid.", body:"Log it anyway. Even rest is data. The streak respects honesty."},
  {cat:"workout", title:"Post-workout window is open", body:"While the endorphins are still vibing — log that session."},
  // cheat
  {cat:"cheat", title:"No judgment zone", body:"If you enjoyed that samosa, it probably counts. Log it — zero drama."},
  {cat:"cheat", title:"Cheat meal happened?", body:"Noted, not judged. Log it so tomorrow-you has context."},
  {cat:"cheat", title:"That 'one bite' situation", body:"Totally fine. Just an FYI for the diary. It won't tell anyone."},
  {cat:"cheat", title:"Keeping it real", body:"Good food choices AND cheat meals are both data. Log both."},
];

const VAPID_PUBLIC_KEY = "BHc0QeYwUE28jHcubioSQfcXy8lZOLjbl0-o3TOQi1AgEBkQeQhTiAoIDnoBNBVJfHL6jCUsNh3Jrohg3NSXuqs";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

async function subscribePush(token?: string): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as ArrayBuffer,
      });
    }
    const j = sub.toJSON();
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ endpoint: j.endpoint, p256dh: j.keys?.p256dh, auth: j.keys?.auth }),
    });
    return true;
  } catch { return false; }
}

async function unsubscribePush(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
    }
  } catch {}
}

/* Fallback in-tab nudge for browsers that don't support Push API */
function scheduleNextNudge() {
  sset("eatbc:nextNudge", Date.now() + 3 * 60 * 60 * 1000);
}
async function fireNudge() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (!sget<boolean>("eatbc:reminders")) return;
  const h = new Date().getHours();
  if (h < 8 || h >= 22) { scheduleNextNudge(); return; }
  let cats: string[];
  if (h < 10)      cats = ["water","meal"];
  else if (h < 12) cats = ["water","workout"];
  else if (h < 14) cats = ["meal","water"];
  else if (h < 17) cats = ["water","workout"];
  else if (h < 20) cats = ["meal","water"];
  else             cats = ["meal","cheat"];
  const pool = NUDGE_MSGS.filter(m=>cats.includes(m.cat));
  const pick = pool[Math.floor(Math.random()*pool.length)];
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(pick.title, {body:pick.body,icon:"/icon.svg",tag:"eatbc-nudge",renotify:true} as NotificationOptions);
  } catch {
    try { new Notification(pick.title, {body:pick.body,icon:"/icon.svg"}); } catch {}
  }
  scheduleNextNudge();
}

function ReminderToggle({t, compact, token, label, sublabel}:{t:(k:keyof typeof STR)=>string; compact?:boolean; token?:string; label?:string; sublabel?:string}) {
  const [on,setOn]=useState<boolean>(()=>!!sget<boolean>("eatbc:reminders"));
  const [loading,setLoading]=useState(false);
  const supported=typeof window!=="undefined"&&("Notification"in window||"PushManager"in window);

  async function enable(){
    if (!supported||loading) return;
    // requestPermission MUST be the first await — some browsers drop the
    // user-gesture context if any state update or async op precedes it.
    let perm: NotificationPermission;
    try { perm = await Notification.requestPermission(); }
    catch { return; }
    if (perm !== "granted") return;
    setLoading(true);
    try {
      sset("eatbc:reminders",true); setOn(true);
      scheduleNextNudge();
      subscribePush(token); // fire-and-forget — failure is non-blocking
      // Welcome notification via new Notification() — avoids serviceWorker.ready hang
      try { new Notification("EatBC nudges are on 🎉",{
        body:"You'll get water, meal & workout nudges every 3 hours.",icon:"/icon.svg",
      }); } catch {}
    } finally { setLoading(false); }
  }

  async function disable(){
    sset("eatbc:reminders",false); setOn(false);
    await unsubscribePush();
  }

  if (!supported) return null;
  if (compact) return (
    <button onClick={on?disable:enable} disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0"
      style={on
        ?{background:"#F0FDF4",color:"#16A34A",border:"1.5px solid #BBF7D0"}
        :{background:"#FFFBEB",color:"#92400E",border:"1.5px solid #FDE68A"}}>
      <Bell size={12}/>{loading?"…":on?"Nudges on":"Enable nudges"}
    </button>
  );
  return (
    <Card className="p-5 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{background:"#FEF3C7"}}>
          <Bell size={18} style={{color:"#F59E0B"}}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-800 text-sm">{label||"Smart nudges"}</div>
          <div className="text-xs text-gray-400">{sublabel||"Water, meals & workouts — every 3 hours, even when the app is closed."}</div>
        </div>
        <button onClick={on?disable:enable} disabled={loading}
          className="text-xs font-bold px-4 py-2 rounded-xl shrink-0 transition"
          style={on?{background:"#fff",color:"#6b7280",border:"1.5px solid #e5e7eb"}:{background:GREEN,color:"#fff"}}>
          {loading?"…":on?"On ✓":"Turn on"}
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

/* ─────────────── Workout Diary ─────────────── */
const CAT_LABELS:Record<string,string>={All:"All",cardio:"Cardio",push:"Push",pull:"Pull",legs:"Legs",core:"Core",restore:"Yoga / Hold"};
const WEIGHT_PRESETS=["BW","5","7.5","10","12.5","15","20","25","30","40","50","60","70","80","100"];
const WEIGHT_CATS=new Set(["push","pull","legs","core"]);
function parseRepsNum(r:string):number{const m=r.match(/(\d+)/);return m?parseInt(m[1]):10;}
function calcWorkoutCal(weightKg:number,sets:number,repsStr:string):number{
  const reps=parseRepsNum(repsStr);
  if(weightKg===0) return Math.round(sets*reps*0.5);
  return Math.round(weightKg*sets*reps*0.05);
}
const REPS_OPTS=["5 reps","8 reps","10 reps","12 reps","15 reps","20 reps","25 reps","30 reps","30 sec","45 sec","60 sec","2 min","5 min","10 min","5–8 breaths","Each side"];

function WorkoutLogger({log,onUpdate}:{log:ExerciseLog[];onUpdate:(l:ExerciseLog[])=>void}) {
  const [open,setOpen]=useState(false);
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("All");
  const [pending,setPending]=useState<string|null>(null);
  const [pendingCat,setPendingCat]=useState("");
  const [sets,setSets]=useState(3);
  const [reps,setReps]=useState("10 reps");
  const [customReps,setCustomReps]=useState("");
  const [useCustom,setUseCustom]=useState(false);
  const [weightPreset,setWeightPreset]=useState("BW");
  const [freeWeight,setFreeWeight]=useState("");

  const allEx=useMemo(()=>{
    const seen=new Set<string>();
    const res:{n:string;cat:string}[]=[];
    Object.values(EX).forEach(pool=>{
      Object.entries(pool).forEach(([c,items])=>{
        (items as ExDef[]).forEach(e=>{if(!seen.has(e.n)){seen.add(e.n);res.push({n:e.n,cat:c});}});
      });
    });
    return res;
  },[]);

  const CATS=["All","cardio","push","pull","legs","core","restore"];

  const filtered=allEx.filter(e=>
    (cat==="All"||e.cat===cat)&&(!search||e.n.toLowerCase().includes(search.toLowerCase()))
  );

  const close=()=>{setOpen(false);setPending(null);setSearch("");setCat("All");setWeightPreset("BW");setFreeWeight("");};

  const showWeight=WEIGHT_CATS.has(pendingCat);
  const effectiveWeight=freeWeight?parseFloat(freeWeight)||(weightPreset==="BW"?0:parseFloat(weightPreset)):weightPreset==="BW"?0:parseFloat(weightPreset);
  const finalRepsStr=useCustom&&customReps?customReps:reps;
  const previewCal=showWeight?calcWorkoutCal(effectiveWeight,sets,finalRepsStr):0;

  const addLog=()=>{
    if(!pending) return;
    const weightLabel=showWeight?(freeWeight?`${freeWeight}kg`:weightPreset==="BW"?"BW":`${weightPreset}kg`):undefined;
    const cal=showWeight?calcWorkoutCal(effectiveWeight,sets,finalRepsStr):undefined;
    onUpdate([...log,{n:pending,sets,reps:finalRepsStr,cat:pendingCat,ts:new Date().toISOString(),weight:showWeight?effectiveWeight:undefined,weightLabel,cal}]);
    setPending(null);setSets(3);setReps("10 reps");setUseCustom(false);setCustomReps("");setWeightPreset("BW");setFreeWeight("");
  };

  const remove=(i:number)=>onUpdate(log.filter((_,j)=>j!==i));
  const totalCal=log.reduce((s,e)=>s+(e.cal||0),0);
  const PUR="#7C3AED";const PURLT="#F5F3FF";const PURBG="#EDE9FE";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ClipboardList size={16} style={{color:PUR}}/>
          <h3 className="font-black text-gray-800">Workout Diary</h3>
        </div>
        <button onClick={()=>setOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
          style={{background:PUR}}>
          <Plus size={13}/> Log exercise
        </button>
      </div>

      {log.length===0?(
        <p className="text-sm text-gray-400 text-center py-4">Nothing logged yet.<br/>Tap "Log exercise" to record what you actually did.</p>
      ):(
        <div className="space-y-2">
          {log.map((e,i)=>(
            <div key={i} className="flex items-center gap-2 p-3 rounded-2xl" style={{background:PURLT}}>
              <span className="text-xl shrink-0">{EXERCISE_GUIDE[e.n]?.emoji||"💪"}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-purple-900 leading-tight">{e.n}</div>
                <div className="text-xs font-medium" style={{color:"rgba(109,40,217,0.65)"}}>
                  {e.sets} set{e.sets!==1?"s":""} × {e.reps}
                  {e.weightLabel&&<> · {e.weightLabel}</>}
                  {e.cal&&<span className="ml-1 inline-flex items-center gap-0.5" style={{color:"#D97706"}}>· ~{e.cal} kcal</span>}
                </div>
              </div>
              <button onClick={()=>remove(i)} className="p-1 rounded-lg text-gray-400 hover:text-red-400"><X size={14}/></button>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400">
            <span>{log.length} exercise{log.length!==1?"s":""} logged</span>
            {totalCal>0&&<span style={{color:PUR}} className="flex items-center gap-1"><Flame size={11}/>~{totalCal} kcal burned</span>}
          </div>
        </div>
      )}

      {open&&(
        <div className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}}
          onClick={close}>
          <div className="bg-white rounded-t-3xl max-h-[88vh] flex flex-col"
            style={{animation:"eFade .22s ease both"}}
            onClick={e=>e.stopPropagation()}>

            {pending?(
              <div className="p-5 overflow-y-auto">
                {/* back + exercise title */}
                <div className="flex items-start gap-3 mb-5">
                  <button onClick={()=>setPending(null)} className="mt-0.5 p-2 rounded-xl shrink-0" style={{background:"#F3F4F6"}}>
                    <ChevronLeft size={16}/>
                  </button>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400">{EXERCISE_GUIDE[pending]?.emoji||"💪"} Logging</div>
                    <h3 className="font-black text-gray-800 text-xl leading-tight">{pending}</h3>
                    {EXERCISE_GUIDE[pending]?.muscles&&<p className="text-xs text-gray-400 mt-0.5">{EXERCISE_GUIDE[pending].muscles.join(" · ")}</p>}
                  </div>
                </div>

                {/* Sets */}
                <div className="mb-5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Sets</label>
                  <div className="flex gap-2 mt-2">
                    {[1,2,3,4,5,6].map(n=>(
                      <button key={n} onClick={()=>setSets(n)}
                        className="w-11 h-11 rounded-xl font-bold text-sm transition"
                        style={sets===n?{background:PUR,color:"#fff"}:{background:"#F3F4F6",color:"#374151"}}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reps */}
                <div className="mb-5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Reps / Duration</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {REPS_OPTS.map(r=>(
                      <button key={r} onClick={()=>{setReps(r);setUseCustom(false);}}
                        className="px-3 py-1.5 rounded-xl font-semibold text-xs transition"
                        style={!useCustom&&reps===r?{background:PUR,color:"#fff"}:{background:"#F3F4F6",color:"#374151"}}>
                        {r}
                      </button>
                    ))}
                  </div>
                  <input type="text" placeholder="Custom e.g. 400m run, 1 km walk…"
                    value={customReps} onChange={e=>{setCustomReps(e.target.value);setUseCustom(!!e.target.value);}}
                    className="w-full mt-3 px-4 py-2.5 rounded-2xl border-2 text-sm outline-none"
                    style={{borderColor:useCustom?"#7C3AED":"#E5E7EB"}}/>
                </div>

                {/* Weight picker — only for strength categories */}
                {showWeight&&(
                  <div className="mb-5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Weight lifted</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {WEIGHT_PRESETS.map(w=>(
                        <button key={w} onClick={()=>{setWeightPreset(w);setFreeWeight("");}}
                          className="px-3 py-1.5 rounded-xl font-semibold text-xs transition"
                          style={!freeWeight&&weightPreset===w?{background:PUR,color:"#fff"}:{background:"#F3F4F6",color:"#374151"}}>
                          {w==="BW"?"Bodyweight":`${w} kg`}
                        </button>
                      ))}
                    </div>
                    <input type="number" placeholder="Or type custom kg e.g. 22.5"
                      value={freeWeight} onChange={e=>setFreeWeight(e.target.value)}
                      className="w-full mt-3 px-4 py-2.5 rounded-2xl border-2 text-sm outline-none"
                      style={{borderColor:freeWeight?"#7C3AED":"#E5E7EB"}}/>
                    {previewCal>0&&(
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{color:"#D97706"}}>
                        <Flame size={13}/> ~{previewCal} kcal estimated burn
                      </div>
                    )}
                  </div>
                )}

                <button onClick={addLog}
                  className="w-full py-3.5 rounded-2xl font-black text-white"
                  style={{background:PUR}}>
                  Log this exercise ✓
                </button>
              </div>
            ):(
              <>
                {/* picker header */}
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-gray-800 text-lg">Log an exercise</h3>
                    <button onClick={close} className="p-2 rounded-xl" style={{background:"#F3F4F6"}}><X size={16}/></button>
                  </div>
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Search exercise…" value={search}
                      onChange={e=>setSearch(e.target.value)} autoFocus
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-gray-200 text-sm outline-none focus:border-purple-400"/>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-2" style={{scrollbarWidth:"none"}}>
                    {CATS.map(c=>(
                      <button key={c} onClick={()=>setCat(c)}
                        className="px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition shrink-0"
                        style={cat===c?{background:PUR,color:"#fff"}:{background:"#F3F4F6",color:"#374151"}}>
                        {CAT_LABELS[c]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* exercise list */}
                <div className="overflow-y-auto flex-1 p-4 pt-2 space-y-1.5">
                  {filtered.map((e,i)=>(
                    <button key={i} onClick={()=>{setPending(e.n);setPendingCat(e.cat);}}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gray-100 text-left transition"
                      style={{}}>
                      <span className="text-2xl shrink-0 leading-none">{EXERCISE_GUIDE[e.n]?.emoji||"💪"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-800 leading-tight">{e.n}</div>
                        {EXERCISE_GUIDE[e.n]?.muscles&&
                          <div className="text-xs text-gray-400 truncate">{EXERCISE_GUIDE[e.n].muscles.join(", ")}</div>}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{background:PURBG,color:PUR}}>
                        {CAT_LABELS[e.cat]||e.cat}
                      </span>
                    </button>
                  ))}
                  {filtered.length===0&&(
                    <p className="text-center text-sm text-gray-400 py-8">No exercises found</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
            {completedToday?"Mark as not done":"Complete workout 💪"}
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

      {/* workout diary */}
      <WorkoutLogger
        log={(tracking.workoutLog||{})[iso]||[]}
        onUpdate={l=>onUpdate({...tracking,workoutLog:{...(tracking.workoutLog||{}),[iso]:l}})}
      />

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
      <button onClick={()=>onRecalc()}
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
          <a href="https://wa.me/917000639366?text=Hi%2C%20I%20want%20a%20free%20diet%20plan%20review"
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
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#111111"/>
      <circle cx="20" cy="20" r="16.5" stroke="#FFFA66" strokeWidth="1.5" fill="none" opacity="0.45"/>
      <path d="M12 14 L20 27 L28 14" stroke="#FFFA66" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function VeerBot({session,planCondition,plan,tracking,profile}:{
  session:Session|null;planCondition:string;
  plan:Plan|null;tracking:Tracking;profile:Profile;
}) {
  type Attachment={type:"image"|"doc";name:string;url?:string;size?:string};
  type ChatMsg={role:"user"|"assistant";content:string;time:string;attachment?:Attachment};

  const G="#1DAA61";
  const [open,setOpen]=useState(false);
  const [thinking,setThinking]=useState(false);
  const [messages,setMessages]=useState<ChatMsg[]>([]);
  const [error,setError]=useState("");
  const [textInput,setTextInput]=useState("");
  const [pendingAttach,setPendingAttach]=useState<Attachment|null>(null);
  const [showAttachMenu,setShowAttachMenu]=useState(false);
  const hasIntroduced=useRef(false);
  const bottomRef=useRef<HTMLDivElement|null>(null);
  const docRef=useRef<HTMLInputElement|null>(null);
  const imgRef=useRef<HTMLInputElement|null>(null);
  const taRef=useRef<HTMLTextAreaElement|null>(null);
  const objectUrls=useRef<string[]>([]);

  function ts(){return new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});}

  useEffect(()=>{
    if(!open) return;
    if(!hasIntroduced.current){
      hasIntroduced.current=true;
      setMessages([{role:"assistant",content:"Namaste! I am Veer, your AI lifestyle coach. Kaise help kar sakta hoon aapki? 😊",time:ts()}]);
    }
  },[open]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,thinking]);

  useEffect(()=>{
    const urls=objectUrls.current;
    return()=>{ urls.forEach(u=>URL.revokeObjectURL(u)); };
  },[]);

  function buildUserContext():string {
    const lines:string[]=[];
    if(profile.name) lines.push(`User: ${profile.name}`);
    if(profile.sex||profile.age) lines.push(`${profile.sex||""}${profile.age?`, age ${profile.age}`:""}${profile.weight?`, ${profile.weight}kg`:""}${profile.heightFt?`, ${profile.heightFt}'${profile.heightIn||0}"`:""}`.trim());
    if(profile.goal) lines.push(`Goal: ${profile.goal}`);
    if(profile.activity) lines.push(`Activity: ${profile.activity}${profile.exercise?` / ${profile.exercise}`:""}`);
    if(profile.diet) lines.push(`Diet: ${profile.diet}`);
    if(profile.condition) lines.push(`Health condition: ${profile.condition}`);
    if(plan){lines.push(`Daily calories: ${plan.dailyCalories} kcal`);if(plan.weeklyLoss)lines.push(`Target: ${plan.weeklyLoss}`);}
    const wLog=Object.entries(tracking.weights||{}).sort();
    if(wLog.length){
      const [ld,lw]=wLog[wLog.length-1];
      lines.push(`Last logged weight: ${lw}kg (${ld})`);
      if(wLog.length>1){const fw=wLog[0][1];const d=(lw-fw).toFixed(1);lines.push(`Weight change: ${+d>0?"+":""}${d}kg over ${wLog.length} entries`);}
    }
    const ml=Object.values(tracking).filter(v=>typeof v==="object"&&v&&"meals" in v).length;
    if(ml) lines.push(`Days with meals logged: ${ml}`);
    return lines.join("\n");
  }

  async function sendMsg(text:string,att?:Attachment){
    if(!text.trim()&&!att) return;
    setError(""); setShowAttachMenu(false);
    const display=text.trim()||(att?.type==="image"?"📷 Photo":(att?.name||"Attachment"));
    const userMsg:ChatMsg={role:"user",content:display,time:ts(),...(att?{attachment:att}:{})};
    const next=[...messages,userMsg];
    setMessages(next);
    setThinking(true);
    const apiMsgs=next.map(m=>({
      role:m.role,
      content:m.content+(m.attachment?`\n[Attached: ${m.attachment.name}${m.attachment.size?` (${m.attachment.size})`:""}`+"]":""),
    }));
    try {
      const r=await fetch("/api/veer",{
        method:"POST",
        headers:{"Content-Type":"application/json",...(session?.token?{Authorization:`Bearer ${session.token}`}:{})},
        body:JSON.stringify({messages:apiMsgs,userContext:buildUserContext()}),
      });
      const data=await r.json() as {reply?:string;error?:string};
      if(!r.ok){setError(data.error||"Something went wrong.");return;}
      setMessages([...next,{role:"assistant",content:data.reply||"",time:ts()}]);
    } catch {setError("Couldn't reach Veer — check your connection.");}
    finally {setThinking(false);}
  }

  function onDocChange(e:React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0]; if(!f) return;
    const sz=f.size>1048576?`${(f.size/1048576).toFixed(1)} MB`:`${Math.round(f.size/1024)} KB`;
    setPendingAttach({type:"doc",name:f.name,size:sz});
    e.target.value="";
  }
  function onImgChange(e:React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0]; if(!f) return;
    const url=URL.createObjectURL(f);
    objectUrls.current.push(url);
    setPendingAttach({type:"image",name:f.name,url});
    e.target.value="";
  }
  function submit(){
    const q=textInput.trim();
    if(!q&&!pendingAttach) return;
    sendMsg(q,pendingAttach||undefined);
    setTextInput(""); setPendingAttach(null);
    if(taRef.current){taRef.current.style.height="auto";}
  }

  return(
    <>
      <style>{`
        @keyframes vWaSlide{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes vGlowBtn{0%,100%{box-shadow:0 4px 20px rgba(255,250,102,.22)}50%{box-shadow:0 6px 34px rgba(255,250,102,.52)}}
        @keyframes vBubbleIn{from{opacity:0;transform:translateY(5px) scale(0.97)}to{opacity:1;transform:none}}
        @keyframes waDot{0%,70%,100%{transform:translateY(0);opacity:.35}35%{transform:translateY(-5px);opacity:1}}
      `}</style>

      {/* Hidden file inputs */}
      <input ref={docRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{display:"none"}} onChange={onDocChange}/>
      <input ref={imgRef} type="file" accept="image/*" style={{display:"none"}} onChange={onImgChange}/>

      {/* Floating trigger */}
      <button onClick={()=>setOpen(true)} aria-label="Ask Veer"
        className="fixed z-40 flex items-center justify-center active:scale-95 transition-transform"
        style={{bottom:84,right:18,width:54,height:54,borderRadius:"50%",
          background:"#111",border:"2px solid rgba(255,250,102,0.55)",
          animation:"vGlowBtn 2.5s ease-in-out infinite"}}>
        <VeerIcon size={32}/>
      </button>

      {open&&(
        <div className="fixed inset-0 z-50 flex flex-col"
          style={{background:"#0B1418",animation:"vWaSlide .26s cubic-bezier(.22,1,.36,1) both"}}>

          {/* Header — WhatsApp dark style */}
          <div className="flex items-center gap-2.5 px-2 py-2"
            style={{background:"#1F2C34",paddingTop:"max(env(safe-area-inset-top,0px) + 8px, 12px)"}}>
            <button onClick={()=>setOpen(false)}
              className="p-1.5 rounded-full active:bg-white/10 flex-shrink-0">
              <ChevronLeft size={24} color="rgba(255,255,255,0.85)"/>
            </button>
            <div style={{width:42,height:42,borderRadius:"50%",flexShrink:0,
              background:"rgba(255,250,102,0.10)",border:"2px solid rgba(255,250,102,0.4)",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <VeerIcon size={25}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white leading-tight" style={{fontSize:16.5}}>Veer AI</p>
              <p style={{fontSize:12.5,color:thinking?"#FFFA66":G,fontWeight:500,marginTop:1}}>
                {thinking?"typing…":"online · lifestyle coach"}
              </p>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto px-3 py-3"
            style={{
              background:"#0B1418",
              backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.018'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
            onClick={()=>setShowAttachMenu(false)}>

            {messages.map((m,i)=>{
              const isVeer=m.role==="assistant";
              const showTail=i===0||messages[i-1]?.role!==m.role;
              return(
                <div key={i} className={`flex mb-1 ${isVeer?"justify-start":"justify-end"}`}
                  style={{animation:"vBubbleIn .2s ease both",animationDelay:`${Math.min(i*0.04,0.18)}s`}}>
                  <div className="relative" style={{
                    maxWidth:"78%",
                    background:isVeer?"#1F2C34":"#005C4B",
                    borderRadius:isVeer
                      ?(showTail?"2px 12px 12px 12px":"12px 12px 12px 12px")
                      :(showTail?"12px 2px 12px 12px":"12px 12px 12px 12px"),
                    padding:"7px 10px 5px 10px",
                    boxShadow:"0 1px 2px rgba(0,0,0,0.4)",
                    marginTop:showTail&&i>0?"6px":"1px",
                  }}>
                    {/* Bubble tail */}
                    {showTail&&isVeer&&(
                      <div style={{position:"absolute",top:0,left:-7,width:0,height:0,
                        borderTop:"8px solid #1F2C34",borderLeft:"8px solid transparent"}}/>
                    )}
                    {showTail&&!isVeer&&(
                      <div style={{position:"absolute",top:0,right:-7,width:0,height:0,
                        borderTop:"8px solid #005C4B",borderRight:"8px solid transparent"}}/>
                    )}

                    {/* Attachment bubble */}
                    {m.attachment&&(
                      <div className="mb-1.5">
                        {m.attachment.type==="image"&&m.attachment.url?(
                          <img src={m.attachment.url} alt={m.attachment.name}
                            className="rounded-lg block" style={{maxWidth:220,maxHeight:200,objectFit:"cover"}}/>
                        ):(
                          <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                            style={{background:"rgba(0,0,0,0.25)",minWidth:180}}>
                            <div className="flex-shrink-0 w-9 h-11 rounded-lg flex items-center justify-center"
                              style={{background:m.attachment.name.toLowerCase().endsWith(".pdf")
                                ?"rgba(239,68,68,0.25)":"rgba(59,130,246,0.25)"}}>
                              <FileText size={20} color={m.attachment.name.toLowerCase().endsWith(".pdf")?"#F87171":"#93C5FD"}/>
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-semibold truncate" style={{fontSize:12.5,maxWidth:140}}>{m.attachment.name}</p>
                              <p style={{fontSize:11,color:"rgba(255,255,255,0.42)"}}>{m.attachment.size||"Document"}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message text */}
                    {m.content&&(
                      <p style={{fontSize:14.5,color:"rgba(255,255,255,0.93)",
                        lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                        {m.content}
                      </p>
                    )}

                    {/* Time + tick */}
                    <div className={`flex items-center gap-1 mt-0.5 ${isVeer?"justify-start":"justify-end"}`}>
                      <span style={{fontSize:10,color:"rgba(255,255,255,0.38)",lineHeight:1}}>{m.time}</span>
                      {!isVeer&&<Check size={13} color="rgba(134,239,172,0.8)"/>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {thinking&&(
              <div className="flex justify-start mb-1 mt-1">
                <div style={{background:"#1F2C34",borderRadius:"2px 12px 12px 12px",
                  padding:"10px 14px",boxShadow:"0 1px 2px rgba(0,0,0,0.4)"}}>
                  <div style={{position:"absolute",top:0,left:-7,width:0,height:0,
                    borderTop:"8px solid #1F2C34",borderLeft:"8px solid transparent"}}/>
                  <div className="flex items-center gap-1.5">
                    {[0,1,2].map(i=>(
                      <span key={i} style={{width:8,height:8,borderRadius:"50%",display:"block",
                        background:"rgba(255,255,255,0.5)",
                        animation:`waDot 1.1s ease-in-out ${i*0.22}s infinite`}}/>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error&&(
              <div className="flex justify-center my-2">
                <span style={{fontSize:11.5,color:"#F87171",background:"rgba(248,113,113,0.10)",
                  border:"1px solid rgba(248,113,113,0.22)",padding:"5px 12px",borderRadius:20}}>
                  {error}
                </span>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Attach menu */}
          <AnimatePresence>
            {showAttachMenu&&(
              <motion.div
                initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:12}}
                transition={{duration:0.18,ease:[0.23,1,0.32,1]}}
                style={{background:"#1F2C34",borderTop:"1px solid rgba(255,255,255,0.07)",
                  padding:"12px 16px"}}>
                <div className="flex gap-4">
                  <button onClick={()=>{setShowAttachMenu(false);docRef.current?.click();}}
                    className="flex flex-col items-center gap-2 flex-1 py-3 rounded-2xl active:scale-95 transition-transform"
                    style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)"}}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{background:"rgba(239,68,68,0.15)"}}>
                      <FileText size={22} color="#F87171"/>
                    </div>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.70)",fontWeight:600}}>Document</span>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.30)"}}>PDF · Word · TXT</span>
                  </button>
                  <button onClick={()=>{setShowAttachMenu(false);imgRef.current?.click();}}
                    className="flex flex-col items-center gap-2 flex-1 py-3 rounded-2xl active:scale-95 transition-transform"
                    style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)"}}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{background:"rgba(29,170,97,0.15)"}}>
                      <Camera size={22} color={G}/>
                    </div>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.70)",fontWeight:600}}>Camera</span>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.30)"}}>Photo · Gallery</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pending attachment preview */}
          {pendingAttach&&(
            <div className="flex items-center gap-2.5 px-3 py-2"
              style={{background:"rgba(255,255,255,0.04)",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
              {pendingAttach.type==="image"&&pendingAttach.url?(
                <img src={pendingAttach.url} alt="" style={{width:40,height:40,borderRadius:8,objectFit:"cover",flexShrink:0}}/>
              ):(
                <div style={{width:40,height:40,borderRadius:8,background:"rgba(239,68,68,0.18)",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <FileText size={20} color="#F87171"/>
                </div>
              )}
              <p className="flex-1 text-white truncate" style={{fontSize:13}}>{pendingAttach.name}</p>
              <button onClick={()=>setPendingAttach(null)} className="p-1 rounded-full hover:bg-white/10">
                <X size={16} color="rgba(255,255,255,0.45)"/>
              </button>
            </div>
          )}

          {/* Input bar */}
          <div className="flex items-end gap-2 px-3 py-2"
            style={{background:"#1F2C34",paddingBottom:"max(env(safe-area-inset-bottom,0px) + 8px, 12px)"}}>
            <button
              onClick={()=>setShowAttachMenu(v=>!v)}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mb-0.5 active:scale-90 transition-all"
              style={{background:showAttachMenu?"#FFFA66":"rgba(255,255,255,0.10)"}}>
              <Paperclip size={19} color={showAttachMenu?"#111":"rgba(255,255,255,0.65)"}/>
            </button>

            <div className="flex-1 flex items-end rounded-[24px] overflow-hidden"
              style={{background:"rgba(255,255,255,0.09)",border:"1px solid rgba(255,255,255,0.11)"}}>
              <textarea
                ref={taRef} rows={1}
                value={textInput}
                onChange={e=>{
                  setTextInput(e.target.value);
                  e.target.style.height="auto";
                  e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";
                }}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit();}}}
                placeholder="Message"
                disabled={thinking}
                style={{
                  flex:1,background:"transparent",outline:"none",resize:"none",
                  paddingLeft:14,paddingRight:10,paddingTop:10,paddingBottom:10,
                  fontSize:15,color:"rgba(255,255,255,0.93)",lineHeight:1.45,
                  maxHeight:120,display:"block",width:"100%",
                  fontFamily:"inherit",
                }}/>
            </div>

            <button
              onClick={submit}
              disabled={thinking&&!textInput.trim()&&!pendingAttach}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mb-0.5 active:scale-90 transition-transform disabled:opacity-40"
              style={{background:G}}>
              <Send size={17} color="white" style={{marginLeft:2}}/>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Dash({session,plan,tracking,profile,lang,onLang,onUpdate,onSwap,onLogout,onDeleteAccount,onRecalc}:{
  session:Session;plan:Plan|null;tracking:Tracking;profile:Profile;lang:Lang;onLang:(l:Lang)=>void;
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
  const cheatTotal=(dd.cheatLog||[]).reduce((s,x)=>s+x.cal,0);
  const consumed=planConsumed+diaryTotal+cheatTotal;
  const workoutBurned=((tracking.workoutLog||{})[sel]||[]).reduce((s,e)=>s+(e.cal||0),0);
  const netConsumed=consumed-workoutBurned;
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

  const [slide,setSlide]=useState<0|1|2>(0);
  const [showCalendar,setShowCalendar]=useState(false);
  const hasWorkout=!!plan?.workout;

  return (
    <>
    <Shell wide>
      <div style={{animation:"eFade .4s ease both"}}>
        <div className="rounded-3xl p-6 text-white shadow-lg mb-4"
          style={{background:"linear-gradient(135deg,#1DAA61 0%,#0E8A4D 60%,#0B6E40 100%)"}}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-sm">EatBC</span>
                <button onClick={()=>setShowCalendar(true)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full transition active:scale-95"
                  style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)"}}>
                  <CalendarDays size={12} style={{color:"rgba(255,255,255,0.85)"}}/>
                  <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.85)"}}>Month</span>
                </button>
              </div>
              <h2 className="text-2xl font-black">Hi {session.name}</h2>
              <p className="text-white/70 text-sm">{session.id}</p>
              <div className="flex gap-4 mt-4">
                <div><div className="text-2xl font-bold flex items-center gap-1"><Flame size={20}/>{streak}</div><div className="text-white/70 text-xs">{t("perfectDays")}</div></div>
                <div><div className="text-2xl font-bold">{doneCount}/{dp?.meals.length||0}</div><div className="text-white/70 text-xs">{t("todaysMeals")}</div></div>
                {proteinTargetVal>0&&<div><div className="text-2xl font-bold">{proteinConsumed}<span className="text-base font-normal text-white/60">/{proteinTargetVal}g</span></div><div className="text-white/70 text-xs">{t("protein")}</div></div>}
                <div><div className="text-2xl font-bold flex items-center gap-1"><Dumbbell size={18}/>{workoutBurned}</div><div className="text-white/70 text-xs">kcal burned</div></div>
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

        {/* Carousel slide indicators */}
        <div className="flex gap-2 mb-4">
          {(["🏠 Main","🔥 Calories","👤 Account"] as const).map((label,i)=>(
            <button key={i} onClick={()=>setSlide(i as 0|1|2)}
              className="flex-1 py-2.5 rounded-2xl text-xs font-bold transition active:scale-95"
              style={slide===i
                ?{background:GREEN,color:"white",boxShadow:"0 2px 12px rgba(29,170,97,0.35)"}
                :{background:"#F3F4F6",color:"#9CA3AF"}}>
              {label}
            </button>
          ))}
        </div>

        {/* Slide 1: Main */}
        {slide===0&&(
          <div style={{animation:"eFade .3s ease both"}}>
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
                {cal>0&&(
                  <div className="rounded-2xl px-4 py-3 mb-3"
                    style={{
                      background:netConsumed>=cal?"#FEF2F2":netConsumed/cal>0.85?"#FFFBEB":"#F0FDF4",
                      border:`1px solid ${netConsumed>=cal?"#FECACA":netConsumed/cal>0.85?"#FDE68A":"#BBF7D0"}`,
                    }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold"
                          style={{color:netConsumed>=cal?"#DC2626":netConsumed/cal>0.85?"#D97706":"#16A34A"}}>
                          {netConsumed>=cal?`${netConsumed-cal} kcal surplus`:`${cal-netConsumed} kcal deficit`}
                        </div>
                        <div className="text-xs text-gray-400">
                          {workoutBurned>0?`${consumed} eaten · ${workoutBurned} burned · ${cal} target`:`${consumed} / ${cal} kcal for ${sel}`}
                        </div>
                      </div>
                      <div className="w-20 h-2 rounded-full overflow-hidden" style={{background:"#E5E7EB"}}>
                        <div className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width:`${Math.min(netConsumed/cal,1)*100}%`,
                            background:netConsumed>=cal?"#EF4444":netConsumed/cal>0.85?"#F59E0B":"#22C55E",
                          }}/>
                      </div>
                    </div>
                    {workoutBurned>0&&(
                      <div className="flex items-center gap-3 pt-2 border-t" style={{borderColor:"rgba(0,0,0,0.06)"}}>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500"><Utensils size={11}/><span>{consumed} eaten</span></div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{color:"#7C3AED"}}><Dumbbell size={11}/><span>−{workoutBurned} burned</span></div>
                        <div className="ml-auto text-xs font-bold" style={{color:netConsumed>=cal?"#DC2626":"#16A34A"}}>{netConsumed} net</div>
                      </div>
                    )}
                  </div>
                )}
                <FoodLogger
                  log={dd.log||[]}
                  customFoods={tracking.customFoods||[]}
                  onSaveCustom={saveCustom}
                  onUpdate={l=>onUpdate({...tracking,[sel]:{...dd,log:l}})}
                  t={t}
                  diet={plan?.diet}
                />
                <CheatDayZone
                  dd={dd}
                  plan={plan}
                  dayCalTarget={cal}
                  onUpdate={updated=>onUpdate({...tracking,[sel]:updated})}
                />
                <div className="flex items-center justify-between mb-2 mt-1 px-1">
                  <span className="text-xs text-gray-400">Stay on track with reminders</span>
                  <ReminderToggle t={t} compact token={session.token}/>
                </div>
                <Card className="p-5 mb-4">
                  {(()=>{const wt=waterTarget(tracking.lastRecalcWeight);return(<>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Droplet size={18} style={{color:GREEN}}/> {t("water")}</h3>
                    <span className="text-sm text-gray-400">{dd.water}/{wt} glasses</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[...Array(wt)].map((_,i)=>(
                      <button key={i} onClick={()=>setWater(i+1===dd.water?i:i+1)}
                        className="flex-1 h-9 rounded-lg transition" style={{background:i<dd.water?GREEN:"#E5E7EB"}}/>
                    ))}
                  </div>
                  </>);})()}
                </Card>
              </>
            ):(
              <Card className="p-8 text-center text-gray-400">No plan loaded for this session.</Card>
            )}
            {hasWorkout&&plan?.workout&&<WorkoutTab workout={plan.workout} tracking={tracking} onUpdate={onUpdate}/>}
          </div>
        )}

        {/* Slide 2: Calories */}
        {slide===1&&(
          <div style={{animation:"eFade .3s ease both"}}>
            <Card className="p-6 mb-4">
              <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Flame size={18} style={{color:GREEN}}/> Calorie Breakdown
              </h3>
              <div className="flex items-center justify-center mb-5">
                <CalRing pct={cal?consumed/cal:0} big={consumed} small={`/ ${cal} kcal`} size={160}
                  color={GREEN} track="rgba(29,170,97,0.12)"/>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="p-3 rounded-2xl" style={{background:"#F0FDF4"}}>
                  <div className="font-black text-lg" style={{color:GREEN}}>{consumed}</div>
                  <div className="text-xs text-gray-500">eaten</div>
                </div>
                <div className="p-3 rounded-2xl" style={{background:"#FEF3C7"}}>
                  <div className="font-black text-lg text-amber-600">{workoutBurned}</div>
                  <div className="text-xs text-gray-500">burned</div>
                </div>
                <div className="p-3 rounded-2xl" style={{background:netConsumed>cal&&cal>0?"#FEF2F2":"#F0FDF4"}}>
                  <div className="font-black text-lg" style={{color:netConsumed>cal&&cal>0?"#DC2626":GREEN}}>{netConsumed}</div>
                  <div className="text-xs text-gray-500">net</div>
                </div>
              </div>
              {proteinTarget>0&&(
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span className="font-semibold">Protein</span>
                    <span>{proteinConsumed}g / {proteinTarget}g</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{background:"#E5E7EB"}}>
                    <div className="h-2 rounded-full transition-all duration-700"
                      style={{width:`${Math.min(proteinConsumed/proteinTarget,1)*100}%`,background:"#22C55E"}}/>
                  </div>
                </div>
              )}
            </Card>
            <TrendsCard history={history} calTarget={cal} proteinTarget={proteinTargetVal} weights={tracking.weights||{}} t={t}/>
            <EatingWindowCard mealTimes={tracking.mealTimes||{}} today={today}/>
            <InsightsCard history={history} proteinTarget={proteinTargetVal} t={t}/>
            <WeightLog t={tracking} onLog={logW}/>
            <div className="mb-4"/>
          </div>
        )}

        {/* Slide 3: Account */}
        {slide===2&&(
          <div style={{animation:"eFade .3s ease both"}}>
            <Card className="p-5 mb-4">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl text-white"
                  style={{background:GREEN}}>{(session.name||"?")[0].toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-gray-900 text-lg leading-tight truncate">{session.name}</div>
                  <div className="text-xs text-gray-400 truncate">{session.id}</div>
                  {plan?.goal&&<div className="text-xs font-bold mt-0.5" style={{color:GREEN}}>{plan.goal}</div>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl" style={{background:"#FFF7ED"}}>
                  <div className="font-black text-xl flex items-center justify-center gap-0.5" style={{color:"#EA580C"}}>
                    <Flame size={16}/>{streak}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">day streak</div>
                </div>
                <div className="p-3 rounded-2xl" style={{background:"#F5F3FF"}}>
                  <div className="font-black text-xl" style={{color:"#7C3AED"}}>{points}</div>
                  <div className="text-xs text-gray-500 mt-0.5">points</div>
                </div>
                <div className="p-3 rounded-2xl" style={{background:"#EFF6FF"}}>
                  <div className="font-black text-xl" style={{color:"#2563EB"}}>{daysActive}</div>
                  <div className="text-xs text-gray-500 mt-0.5">days active</div>
                </div>
              </div>
            </Card>
            <ReminderToggle t={t} token={session.token}
              label="Boss me around 🔔"
              sublabel="Poke me when I go AWOL from my diet plan"/>
            <Card className="p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-800">Language</div>
                  <div className="text-xs text-gray-400 mt-0.5">Display language</div>
                </div>
                <div className="flex gap-2">
                  {(["en","hi"] as const).map(l=>(
                    <button key={l} onClick={()=>onLang(l)}
                      className="px-4 py-1.5 rounded-xl text-sm font-bold transition"
                      style={lang===l?{background:GREEN,color:"white"}:{background:"#F3F4F6",color:"#6B7280"}}>
                      {l==="en"?"EN":"हि"}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
            <Leaderboard session={session} points={points} streak={streak} t={t}/>
            <ChallengesCard history={history} joined={joined} onToggle={toggleChallenge} t={t}/>
            <Card className="p-4 mb-6">
              <div className="flex gap-3">
                <button onClick={onLogout}
                  className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition active:scale-95"
                  style={{background:"#F0FDF4",color:"#16A34A",border:"1.5px solid #BBF7D0"}}>
                  <LogOut size={16}/> {t("logout")}
                </button>
                <button onClick={()=>setShowDeleteConfirm(true)}
                  className="flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition active:scale-95"
                  style={{background:"#FEF2F2",color:"#DC2626",border:"1.5px solid #FECACA"}}>
                  <X size={16}/> {t("deleteAccount")}
                </button>
              </div>
            </Card>
          </div>
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
      {showCalendar&&(
        <MonthCalendar
          history={history}
          workoutLog={tracking.workoutLog||{}}
          lastRecalcWeight={tracking.lastRecalcWeight as number|undefined}
          onClose={()=>setShowCalendar(false)}
        />
      )}
    </Shell>
    <VeerBot session={session} planCondition={plan?.condition||""} plan={plan} tracking={tracking} profile={profile} />
    </>
  );
}

/* ─────────────── Root App ─────────────── */
export default function App() {
  const [screen,setScreen]=useState<Screen>(()=>{
    if(!sget<boolean>("eatbc:onboarded")) return "onboarding";
    const saved=sget<Screen>("eatbc:screen");
    const safe:Screen[]=["welcome","quiz","plan","signup","login"];
    return (saved&&safe.includes(saved))?saved:"welcome";
  });
  const [step,setStep]=useState(()=>sget<number>("eatbc:quiz:step")||0);
  const [profile,setProfile]=useState<Profile>(()=>sget<Profile>("eatbc:quiz:profile")||{region:[]});
  const [plan,setPlan]=useState<Plan|null>(()=>sget<Plan>("eatbc:plan"));
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [session,setSession]=useState<Session|null>(null);
  const [tracking,setTracking]=useState<Tracking>({});
  const [lang,setLang]=useState<Lang>(()=>(sget<Lang>("eatbc:lang")||"en"));
  const [qErr,setQErr]=useState("");
  const t=makeT(lang);
  const quoteRef=useRef(pickQuote());

  function changeLang(l:Lang){ setLang(l); sset("eatbc:lang",l); }

  useEffect(()=>{ sset("eatbc:screen",screen); },[screen]);
  useEffect(()=>{ sset("eatbc:quiz:step",step); },[step]);
  useEffect(()=>{ sset("eatbc:quiz:profile",profile); },[profile]);
  useEffect(()=>{ if(plan) sset("eatbc:plan",plan); else sdel("eatbc:plan"); },[plan]);

  /* Nudge scheduler — checks every minute whether it's time to fire */
  useEffect(()=>{
    const id=setInterval(()=>{
      if (!sget<boolean>("eatbc:reminders")) return;
      const next=sget<number>("eatbc:nextNudge");
      if (!next || Date.now()>=next) fireNudge();
    }, 60_000);
    return ()=>clearInterval(id);
  },[]);

  /* Notification click → dash: SW postMessage (app open) */
  useEffect(()=>{
    if (!("serviceWorker" in navigator)) return;
    const handler=(e:MessageEvent)=>{
      if (e.data?.type==="EATBC_NOTIF_CLICK" && sget<Session>("eatbc:session")?.token) {
        setScreen("dash");
      }
    };
    navigator.serviceWorker.addEventListener("message",handler);
    return ()=>navigator.serviceWorker.removeEventListener("message",handler);
  },[]);

  /* Notification click → dash: URL param (app was closed) */
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if (params.get("from")==="notif" && sget<Session>("eatbc:session")?.token) {
      window.history.replaceState({},"","/");
      setScreen("dash");
    }
    /* Custom event fallback for page-context notifications */
    const handler=()=>{ if (sget<Session>("eatbc:session")?.token) setScreen("dash"); };
    window.addEventListener("eatbc:goto-dash",handler);
    return ()=>window.removeEventListener("eatbc:goto-dash",handler);
  },[]);

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
    setProfile(p=>({...p,[cur.k]:v}));
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
    const nextIdx = stepClamped + 1;
    setStep(nextIdx);
  }

  /* Quiz done → go to food game first, then build plan. */
  function generate() {
    setErr("");
    setScreen("foodgame");
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
    setScreen("quote");
  }
  async function doSignup(sess:Session) {
    setSession(sess); sset<Session>("eatbc:session",sess);
    if(plan) await apiPost("/api/plan",{plan,profile},sess.token).catch(()=>{});
    setTracking({});
    setScreen("quote");
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
  if (screen==="intro")   return <LoginIntro diet={plan?.diet} onDone={()=>setScreen("quote")}/>;
  if (screen==="quote")   return <DailyQuote onDone={()=>setScreen("dash")}/>;
  if (screen==="foodgame") return <FoodGame name={profile.name} onDone={finishGame}/>;

  if (screen==="quiz") return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden" style={{background:"#0A0A0A"}}>
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
      <FloatingFoods/>
      <div className="mx-auto max-w-md relative z-10">
      <Card className="p-6 md:p-8">
        <span className="font-bold text-gray-700 mb-6 block">EatBC</span>
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
      {stepClamped>=5&&(
        <p className="text-center text-xs mt-4 flex items-center justify-center gap-1.5"
          style={{color:"rgba(255,255,255,0.45)",animation:"eFade 0.5s ease both"}}>
          ✦ tap any floating food to discover its nutrition secrets
        </p>
      )}
      </div>
    </div>
  );

  if (screen==="plan"&&plan) return (
    <Shell wide>
      <div style={{animation:"eFade .5s ease both"}}>
        <div className="rounded-3xl p-6 md:p-7 text-white shadow-lg mb-4"
          style={{background:"linear-gradient(135deg,#1DAA61 0%,#0E8A4D 55%,#0B6E40 100%)"}}>
          <span className="font-bold mb-4 block">EatBC</span>
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
      </div>
    </Shell>
  );

  if (screen==="signup") return <Signup profile={profile} plan={plan} onDone={doSignup} onBack={()=>setScreen("plan")} onLogin={()=>setScreen("login")}/>;

  if (screen==="dash"&&session) return (
    <Dash session={session} plan={plan} tracking={tracking} profile={profile} lang={lang} onLang={changeLang}
      onUpdate={(tr)=>{setTracking(tr);if(session?.token)apiPost("/api/tracking",{tracking:tr},session.token).catch(()=>{});}}
      onSwap={swapMeal}
      onLogout={logout}
      onDeleteAccount={deleteAccount}
      onRecalc={(activity?:string,w?:number)=>recalcPlan(activity,w)}/>
  );

  return <Shell><Card className="p-10 text-center text-gray-400">Loading…</Card></Shell>;
}
