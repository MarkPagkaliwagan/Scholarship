import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  const migrationFile = path.join(__dirname, '..', 'drizzle', '0004_cloudy_dark_phoenix.sql');
  const content = fs.readFileSync(migrationFile, 'utf-8');
  
  // Split by statement-breakpoint and execute each statement
  const statements = content.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);
  
  for (const stmt of statements) {
    console.log(`Executing: ${stmt.substring(0, 60)}...`);
    await sql.unsafe(stmt);
  }
  
  console.log('Migration applied successfully!');
  await sql.end();
}

main().catch(console.error);
