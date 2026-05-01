import postgres from 'postgres';

const sql = postgres('postgresql://scholarship_admin:7Z6C0cYto0IGULtf697idsg5cUUnT4sx@localhost:5433/scholarship_db', { max: 1 });

async function main() {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  console.log('Tables in database:', tables);
  
  const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'documents' ORDER BY ordinal_position`;
  console.log('Documents table columns:', columns);
  
  await sql.end();
}

main().catch(console.error);
