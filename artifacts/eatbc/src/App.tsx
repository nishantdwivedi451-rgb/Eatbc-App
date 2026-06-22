import { useState, useEffect, useRef } from "react";
import {
  ChevronRight, Utensils, Share2, Mail,
  CheckCircle2, Droplet, LogOut, TrendingDown, Loader2,
  AlertCircle, Sunrise, Apple, Cookie, Moon, HeartPulse,
  Sparkles, Stethoscope, User, UserPlus, ArrowRight, Scale,
  Flame, BarChart3, Trophy, Users, Bell, Plus, RefreshCw,
  Lightbulb, Globe, X, Check, Target, Dumbbell, CalendarDays,
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
  cooktime?: string; avoid?: string; weekend?: string; foodPicks?: string[];
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
interface Plan {
  summary: string; dailyCalories: number; proteinTarget: number; bmi: string; bmiCat: string;
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
  [day: string]: DayTracking | Record<string, number> | Record<string, HistEntry> | Record<string, boolean> | Record<string, number[]> | LogFood[] | string[] | string | undefined;
  weights?: Record<string, number>;
  history?: Record<string, HistEntry>;
  customFoods?: LogFood[];     // user-saved foods
  joinedChallenges?: string[]; // challenge ids the user opted into
  workouts?: Record<string, boolean>;   // date → workout session completed
  workoutSets?: Record<string, number[]>; // date → completed exercise indices
  lang?: string;
}
type Screen = "welcome" | "quiz" | "foodgame" | "plan" | "login" | "signup" | "dash" | "onboarding";

/* ─────────────── quiz questions ─────────────── */
interface Question {
  k: keyof Profile; label: string;
  type: "text" | "number" | "pick" | "multi" | "height";
  ph?: string; sub?: string; opts?: string[];
  showIf?: (p: Profile) => boolean;   // conditional questions (e.g. workout branch)
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
    opts:["None","Diabetes / pre-diabetes","High BP (hypertension)","High cholesterol","Thyroid (hypothyroid)","PCOS / PCOD","Pregnant","Breastfeeding","Other"] },
  { k:"diet",      label:"Your food preference",                        type:"pick",   opts:["Pure veg","Egg + veg","Non-veg","Vegan","Jain"] },
  { k:"region",    label:"Which cuisines do you enjoy?",                type:"multi",  sub:"Pick one or more — your plan mixes from these.", opts:["North Indian","South Indian","East Indian","West Indian","Punjabi","Gujarati","Rajasthani","Bengali","Goan","Coastal","Continental","East Asian"] },
  { k:"activity",  label:"Your daily activity level",                   type:"pick",   opts:["Mostly desk job","On feet / moderate","Physically active"] },
  { k:"exercise",  label:"Exercise routine",                            type:"pick",   opts:["None","Walks / light","Gym 3x week","Gym 5x+ / sports"] },
  { k:"wantWorkout", label:"Want a workout plan too?",                   type:"pick",
    sub:"We'll build a weekly training plan with a tracker, right alongside your diet.",
    opts:["Yes, build my workout 💪","No, just the diet"],
    showIf:(p)=>!!p.exercise&&p.exercise!=="None" },
  { k:"workoutPlace", label:"Where will you train?",                     type:"pick",
    opts:["Home — no equipment","Home — dumbbells / bands","Full gym","Outdoor / cardio"],
    showIf:(p)=>p.wantWorkout==="Yes, build my workout 💪" },
  { k:"workoutFocus", label:"What's your training focus?",               type:"pick",
    opts:["Build muscle","Get stronger","Burn fat","Stay fit & mobile"],
    showIf:(p)=>p.wantWorkout==="Yes, build my workout 💪" },
  { k:"workoutDays", label:"How many days a week can you train?",        type:"pick",
    opts:["2 days","3 days","4 days","5 days","6 days"],
    showIf:(p)=>p.wantWorkout==="Yes, build my workout 💪" },
  { k:"meals",     label:"Meals per day you prefer",                    type:"pick",   opts:["3 meals","3 meals + 2 snacks","5-6 small meals"] },
  { k:"cooktime",  label:"How do meals usually happen?",                type:"pick",   opts:["Minimal cooking (10-15 min)","Moderate (30 min)","I enjoy cooking","I get cooking help","I order online mostly"] },
  { k:"weekend",   label:"What are weekends like for food?",            type:"pick",
    sub:"Weekends often break routines — your plan adapts to your real life.",
    opts:["Same as weekdays","Usually order in / eat out","Big family meals or parties","Gym + meal prep mode"] },
  { k:"avoid",     label:"Allergies / foods to avoid",                  type:"text",   sub:"Optional — skip if none.", ph:"e.g. lactose, peanuts" },
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
const RMAP: Record<string,string> = {
  "North Indian":"n","South Indian":"s","East Indian":"e","West Indian":"w",
  "Punjabi":"n","Gujarati":"w","Rajasthani":"n","Bengali":"e",
  "Goan":"w","Coastal":"s","Continental":"all","East Asian":"all",
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
  const extra=p.cooktime==="I order online mostly"
    ?["When ordering, pick grilled, dal, roti, curd and salad over fried/creamy dishes."]
    :["Drink 2.5–3L water daily and aim for 7+ hours of sleep."];
  return [...g,...c,...extra].slice(0,5);
}

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
  const placeKey = PLACE_KEY[p.workoutPlace||""] || "home";
  const pool = EX[placeKey];
  const focus = p.workoutFocus || "Stay fit & mobile";
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

  return {place:p.workoutPlace||"Home",focus,daysPerWeek:days,schedule,days:dayObjs,notes};
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
    picks:profile.foodPicks||[],
  };
  const slots=SLOTSET[profile.meals||"3 meals"]||SLOTSET["3 meals"];
  const weekUsed=new Set<string>();
  const days: PlanDay[]=(WEEK as readonly string[]).map((dn,di)=>{
    let raw=slots.map(([code,frac,label])=>{
      const m=pickMeal(code,Math.round(cal*frac),di,weekUsed,ctx);
      weekUsed.add(m.n);
      return {time:label,food:m.n,cal:m.c,p:m.p||0,qty:m.q};
    });
    const total=raw.reduce((a,b)=>a+b.cal,0);
    let f=total?cal/total:1; f=Math.max(0.78,Math.min(2.5,f));
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

  const w=+(profile.weight||70);
  const proteinMultiplier: Record<string,number>={
    "Weight loss":1.8,"Muscle gain":2.2,"Maintain weight":1.4,"General fitness":1.4,
  };
  const proteinTarget=Math.round((proteinMultiplier[profile.goal||"General fitness"]??1.4)*w/5)*5;

  return {
    summary:`Here's a ${(profile.goal||"fitness").toLowerCase()} plan at about ${cal} kcal a day, built around ${regLabel} food you actually like.${condClause}`,
    dailyCalories:cal,proteinTarget,bmi:st.bmi,bmiCat:st.bmiCat,
    goal:profile.goal||"General fitness",diet:profile.diet||"Pure veg",
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
  newWarrior:{en:"I'm a New Warrior 🔥",hi:"मैं नया योद्धा हूँ 🔥"},
  alreadyHustle:{en:"I Already Hustle 💪",hi:"मैं पहले से जुटा हूँ 💪"},
  tagline:{en:"Eat Better. Count.",hi:"बेहतर खाओ। गिनो।"},
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
function Welcome({lang,onLang,onNew,onLogin}:{lang:Lang;onLang:(l:Lang)=>void;onNew:()=>void;onLogin:()=>void}) {
  const t=makeT(lang);
  const [quote]=useState(pickQuote);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const tm=setTimeout(()=>setVisible(true),80);return()=>clearTimeout(tm);},[]);
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
              <span className="text-green-200 text-xs font-semibold uppercase tracking-widest">{t("todaysSpark")}</span>
              <div className="h-px w-8 bg-white/30"/>
            </div>
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
const FOOD_GAME: {e:string;n:string}[] = [
  {e:"🫓",n:"Paratha"},{e:"🧀",n:"Paneer"},{e:"🍲",n:"Dal"},{e:"🫘",n:"Rajma"},
  {e:"🥘",n:"Chole"},{e:"🥞",n:"Dosa"},{e:"🍘",n:"Idli"},{e:"🍚",n:"Rice"},
  {e:"🍗",n:"Chicken"},{e:"🐟",n:"Fish"},{e:"🥚",n:"Egg"},{e:"🍛",n:"Khichdi"},
  {e:"🥣",n:"Poha"},{e:"🌾",n:"Oats"},{e:"🥗",n:"Salad"},{e:"🫛",n:"Sprouts"},
  {e:"🥛",n:"Milk"},{e:"☕",n:"Chai"},{e:"🍎",n:"Fruit"},{e:"🥜",n:"Peanuts"},
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
        <p className="text-gray-400 text-sm mt-1 mb-6">Sign in to track your progress 🏆</p>
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
          <p className="text-sm font-bold" style={{color:GREEN}}>🎉 Challenge accepted, {profile?.name||"champ"}!</p>
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
          {busy?<span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18}/>Creating…</span>:"Activate My Tracker 🏆"}
        </button>
        <button onClick={onBack} className="w-full text-center text-gray-400 text-sm mt-4">← Back to plan</button>
      </Card>
    </Shell>
  );
}

/* ─────────────── Food Logger ─────────────── */
function FoodLogger({log,customFoods,onSaveCustom,onUpdate,t}:{
  log:FoodLog[];customFoods:LogFood[];onSaveCustom:(f:LogFood)=>void;
  onUpdate:(l:FoodLog[])=>void;t:(k:keyof typeof STR)=>string;
}) {
  const [open,setOpen]=useState(false);
  const [search,setSearch]=useState("");
  const [pending,setPending]=useState<LogFood|null>(null);
  const [servings,setServings]=useState(1);
  const [cat,setCat]=useState("All");
  const [mode,setMode]=useState<"search"|"custom"|"barcode">("search");
  /* custom food form */
  const [cName,setCName]=useState(""); const [cQty,setCQty]=useState(""); const [cCal,setCCal]=useState(""); const [cProt,setCProt]=useState("");
  /* barcode lookup */
  const [bar,setBar]=useState(""); const [barBusy,setBarBusy]=useState(false); const [barErr,setBarErr]=useState("");

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
        <button onClick={()=>setOpen(true)}
          className="w-full py-2.5 rounded-2xl border-2 border-dashed text-sm font-bold transition hover:bg-green-50"
          style={{borderColor:GREEN,color:GREEN}}>
          {t("addFood")}
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
              <div className="flex gap-1.5 mb-3 bg-gray-50 rounded-xl p-1">
                {([["search","🔍 Search"],["custom","✏️ Custom"],["barcode","📷 Barcode"]] as [typeof mode,string][]).map(([m,label])=>(
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
                    {complete&&<span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{background:GREEN}}>Done 🎉</span>}
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

/* ─────────────── Reminders ─────────────── */
function ReminderToggle({t}:{t:(k:keyof typeof STR)=>string}) {
  const [on,setOn]=useState<boolean>(()=>!!sget<boolean>("eatbc:reminders"));
  const supported=typeof window!=="undefined"&&"Notification"in window;
  async function enable(){
    if (!supported) return;
    const perm=await Notification.requestPermission();
    if (perm==="granted"){
      sset("eatbc:reminders",true); setOn(true);
      new Notification("EatBC reminders on 🔔",{body:"We'll gently nudge you to log your meals.",icon:"/icon.svg"});
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
              return (
                <button key={i} onClick={()=>toggleEx(i)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition"
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
                  <div key={j} className="flex justify-between text-sm">
                    <span className="text-gray-700">{it.name}{it.note?<span className="text-gray-400"> · {it.note}</span>:""}</span>
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
    </>
  );
}

/* ─────────────── Dashboard ─────────────── */
function Dash({session,plan,tracking,lang,onUpdate,onSwap,onLogout}:{
  session:Session;plan:Plan|null;tracking:Tracking;lang:Lang;
  onUpdate:(t:Tracking)=>void;onSwap:(day:DayName,mealIdx:number)=>void;onLogout:()=>void;
}) {
  const t=makeT(lang);
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

  const [tab,setTab]=useState<"today"|"train"|"progress"|"community">("today");
  const hasWorkout=!!plan?.workout;
  const TABS:[typeof tab,string,React.ElementType][]=[
    ["today","Today",Utensils],
    ...(hasWorkout?[["train","Train",Dumbbell] as [typeof tab,string,React.ElementType]]:[]),
    ["progress","Progress",BarChart3],["community",t("community"),Users],
  ];

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
          <button onClick={onLogout} className="mt-4 text-white/80 inline-flex items-center gap-1 text-sm hover:text-white">
            <LogOut size={15}/> {t("logout")}
          </button>
        </div>

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
                            <button onClick={()=>onSwap(sel,i)} title={t("swap")}
                              className="text-gray-300 hover:text-green-600 transition"><RefreshCw size={14}/></button>
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
  const [lang,setLang]=useState<Lang>(()=>(sget<Lang>("eatbc:lang")||"en"));
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

  /* Swap a single planned meal for a fresh alternative in the same slot. */
  function swapMeal(day:DayName,mealIdx:number) {
    if(!plan) return;
    const di=plan.days.findIndex(d=>d.day===day);
    if(di<0) return;
    const meal=plan.days[di].meals[mealIdx];
    const code=LABEL2SLOT[meal.time]||"l";
    const cands=DB.filter(f=>f.slot.includes(code)&&dietOK(f,plan.diet)&&f.n!==meal.food);
    if(!cands.length) return;
    cands.sort((a,b)=>Math.abs(a.c-meal.cal)-Math.abs(b.c-meal.cal));
    const pick=cands[Math.floor(Math.random()*Math.min(5,cands.length))];
    const newMeal:Meal={time:meal.time,food:pick.n,cal:pick.c,p:pick.p||0,qty:pick.q};
    const newDays=plan.days.map((d,idx)=>idx===di?{...d,meals:d.meals.map((m,j)=>j===mealIdx?newMeal:m)}:d);
    const newPlan={...plan,days:newDays};
    setPlan(newPlan);
    if(session?.token) apiPost("/api/plan",{plan:newPlan},session.token).catch(()=>{});
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
          <button onClick={()=>stepClamped>0?setStep(stepClamped-1):setScreen("welcome")}
            className="px-5 py-2.5 text-gray-500 font-medium">{t("back")}</button>
          {stepClamped<activeQ.length-1?(
            <button disabled={!canNext} onClick={()=>setStep(stepClamped+1)}
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
    <Dash session={session} plan={plan} tracking={tracking} lang={lang}
      onUpdate={(tr)=>{setTracking(tr);if(session?.token)apiPost("/api/tracking",{tracking:tr},session.token).catch(()=>{});}}
      onSwap={swapMeal}
      onLogout={logout}/>
  );

  return <Shell><Card className="p-10 text-center text-gray-400">Loading…</Card></Shell>;
}
