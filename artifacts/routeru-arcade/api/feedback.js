import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const message = typeof body.message === "string" ? body.message.trim() : "";

      if (!message) {
        return res.status(400).json({ error: "Feedback message is required." });
      }

      if (message.length > 1000) {
        return res.status(400).json({ error: "Feedback must be 1000 characters or less." });
      }

      const rows = await sql`
        INSERT INTO feedback (message)
        VALUES (${message})
        RETURNING id, message, created_at
      `;

      const row = rows[0];

      return res.status(201).json({
        success: true,
        id: String(row.id),
        message: row.message,
        date: new Date(row.created_at).toISOString(),
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Feedback API error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error && error.message ? error.message : String(error),
    });
  }
}
