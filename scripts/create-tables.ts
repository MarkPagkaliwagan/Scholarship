import { SQL } from "bun";

const db = new SQL({
  url: process.env.DATABASE_URL,
});

console.log("Connecting to database...");

await db.unsafe(`
  CREATE TABLE IF NOT EXISTS applications (
    id              SERIAL PRIMARY KEY,
    application_id  VARCHAR(20) UNIQUE NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    address         TEXT NOT NULL,
    school_name     VARCHAR(255) NOT NULL,
    course          VARCHAR(255) NOT NULL,
    year_level      SMALLINT NOT NULL CHECK (year_level BETWEEN 1 AND 5),
    gwa             NUMERIC(5, 2) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
    remarks         TEXT,
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

await db.unsafe(`CREATE INDEX IF NOT EXISTS idx_applications_application_id ON applications (application_id)`);
await db.unsafe(`CREATE INDEX IF NOT EXISTS idx_applications_email ON applications (email)`);
await db.unsafe(`CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status)`);

await db.unsafe(`
  CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql
`);

await db.unsafe(`DROP TRIGGER IF EXISTS applications_updated_at ON applications`);
await db.unsafe(`
  CREATE TRIGGER applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION set_updated_at()
`);

console.log("Tables created successfully.");
await db.end();
