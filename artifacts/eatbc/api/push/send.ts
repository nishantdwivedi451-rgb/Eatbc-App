import type { VercelRequest, VercelResponse } from "@vercel/node";
import webpush from "web-push";
import { sql, ensureDb } from "../_lib/db.js";

const NUDGE_MSGS = [
  // water
  { title: "Hydration check", body: "Your cells are screaming for water. They're tiny but very loud." },
  { title: "Plot twist", body: "You're 60% water. Time to top up the story." },
  { title: "H₂O o'clock", body: "Not optional. Well, technically it is. But also — it really isn't." },
  { title: "The plant on your desk is judging you", body: "Water. Now. Both of you need it." },
  { title: "Gentle hydration guilt", body: "You haven't had water in a while. Your skin has noticed." },
  // meal
  { title: "Food diary's feeling lonely", body: "Log something. It doesn't have to be impressive." },
  { title: "Calories don't log themselves", body: "You ate. Probably. Open the diary and confirm." },
  { title: "Just checking", body: "Did you eat? Great. Did you log it? Those are different questions." },
  { title: "The food wants to be counted", body: "It came all this way. Give it a line in the diary." },
  { title: "Meal tracker waving at you", body: "One tap. Thirty seconds. Tomorrow-you will be grateful." },
  // workout
  { title: "Workout log time", body: "Your body did something today. Even staying upright counts. Log it." },
  { title: "Streak is nervous", body: "Workout logged = streak thriving. Workout unlogged = streak sweating nervously." },
  { title: "Your muscles have feelings", body: "They made an effort. Acknowledge them. They're sensitive." },
  { title: "Post-workout window is open", body: "While the endorphins are still vibing — log that session." },
  // cheat
  { title: "No judgment zone", body: "If you enjoyed that samosa, it probably counts. Log it — zero drama." },
  { title: "Cheat meal happened?", body: "Noted, not judged. Log it so tomorrow-you has context." },
  { title: "Keeping it real", body: "Good food choices AND cheat meals are both data. Log both." },
];

function pick() {
  return NUDGE_MSGS[Math.floor(Math.random() * NUDGE_MSGS.length)];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel Cron requests include an Authorization header with CRON_SECRET
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return res.status(500).json({ error: "VAPID keys not configured" });
  }

  webpush.setVapidDetails(
    "mailto:hi@eatbc.in",
    publicKey,
    privateKey,
  );

  await ensureDb();

  const subs = await sql`SELECT id, endpoint, p256dh, auth FROM push_subscriptions` as {
    id: string; endpoint: string; p256dh: string; auth: string;
  }[];

  const msg = pick();
  const payload = JSON.stringify({ title: msg.title, body: msg.body, icon: "/icon.svg", url: "/" });

  let sent = 0, failed = 0;
  await Promise.all(subs.map(async (sub) => {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      );
      sent++;
    } catch (err: unknown) {
      // 404/410 = subscription expired — remove it
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await sql`DELETE FROM push_subscriptions WHERE id = ${sub.id}`;
      }
      failed++;
    }
  }));

  return res.status(200).json({ ok: true, sent, failed, total: subs.length });
}
