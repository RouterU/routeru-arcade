import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const allowedGames = [
  "quiz",
  "scenario",
  "data-challenge",
  "route-runner",
  "screen-sim",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ allowed: false, message: "Method not allowed." });
  }

  const { playerName, game } = req.body;

  const cleanPlayerName = String(playerName || "").trim();
  const playerNameKey = cleanPlayerName.toLowerCase();
  const cleanGame = String(game || "").trim();

  if (!cleanPlayerName) {
    return res.status(400).json({
      allowed: false,
      message: "Please enter your name before starting.",
    });
  }

  if (!allowedGames.includes(cleanGame)) {
    return res.status(400).json({
      allowed: false,
      message: "Invalid game selected.",
    });
  }

  try {
    const result = await sql`
      INSERT INTO daily_game_plays (
        player_name,
        player_name_key,
        game,
        play_date
      )
      VALUES (
        ${cleanPlayerName},
        ${playerNameKey},
        ${cleanGame},
        CURRENT_DATE
      )
      ON CONFLICT (player_name_key, game, play_date)
      DO NOTHING
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(403).json({
        allowed: false,
        message: "You already played this game today. It will unlock again tomorrow.",
      });
    }

    return res.status(200).json({
      allowed: true,
      message: "Game unlocked.",
    });
  } catch (error) {
    console.error("Daily play check failed:", error);
    return res.status(500).json({
      allowed: false,
      message: "Unable to check daily play limit.",
    });
  }
}
