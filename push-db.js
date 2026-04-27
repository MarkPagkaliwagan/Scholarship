const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5433,
  database: 'scholarship_db',
  user: 'scholarship_admin',
  password: '7Z6C0cYto0IGULtf697idsg5cUUnT4sx',
});

async function run() {
  await client.connect();
  console.log('Connected!');
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id serial PRIMARY KEY NOT NULL,
      application_id varchar(20) NOT NULL,
      first_name varchar(100) NOT NULL,
      last_name varchar(100) NOT NULL,
      email varchar(255) NOT NULL,
      phone varchar(20) NOT NULL,
      address text NOT NULL,
      school_name varchar(255) NOT NULL,
      course varchar(255) NOT NULL,
      year_level smallint NOT NULL,
      gwa numeric(5, 2) NOT NULL,
      status varchar(20) DEFAULT 'pending' NOT NULL,
      remarks text,
      submitted_at timestamp with time zone DEFAULT now() NOT NULL,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT applications_application_id_unique UNIQUE(application_id),
      CONSTRAINT status_check CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
      CONSTRAINT year_level_check CHECK (year_level BETWEEN 1 AND 5)
    )
  `);
  
  console.log('Table created!');
  await client.end();
}

run().catch(console.error);