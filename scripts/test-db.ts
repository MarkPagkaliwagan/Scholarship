import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL!);
try {
  const result = await sql`SELECT 1`;
  console.log('DB connected:', result);
} catch (e) {
  console.error('DB connection failed:', e);
} finally {
  await sql.end();
}
