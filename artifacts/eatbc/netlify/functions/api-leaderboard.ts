import { adapt } from "./_shim";
import leaderboardHandler from "../../api/leaderboard";
export const handler = adapt(leaderboardHandler);
