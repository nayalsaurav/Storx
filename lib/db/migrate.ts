import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL!;

if (!dbUrl) {
  throw new Error("❌ DATABASE_URL is not set in .env.local");
}

async function runMigration() {
  try {
    const sql = neon(dbUrl);
    const db = drizzle(sql);

    console.log("🚀 Starting migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ All migrations completed successfully.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
