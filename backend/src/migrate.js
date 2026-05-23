import bcrypt from 'bcryptjs';
import { pool, query } from './db.js';
import { config } from './config.js';

export async function runMigrationsAndSeed() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'DENTIST')),
      specialization VARCHAR(160),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(80) NOT NULL,
      last_name VARCHAR(80) NOT NULL,
      national_id VARCHAR(30),
      phone VARCHAR(40) NOT NULL,
      email VARCHAR(160),
      birth_date DATE,
      gender VARCHAR(20),
      address TEXT,
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      dentist_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      service VARCHAR(160) NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED'
        CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')),
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS treatment_records (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      appointment_id INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
      dentist_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      diagnosis TEXT NOT NULL,
      procedure TEXT NOT NULL,
      notes TEXT,
      treatment_date DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS appointment_requests (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(160) NOT NULL,
      phone VARCHAR(40) NOT NULL,
      email VARCHAR(160),
      service VARCHAR(160) NOT NULL,
      preferred_date DATE,
      preferred_time VARCHAR(60),
      message TEXT,
      status VARCHAR(30) NOT NULL DEFAULT 'NEW'
        CHECK (status IN ('NEW', 'CONTACTED', 'CLOSED')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await seedUsers();
  await seedDemoPatients();
}

async function seedUsers() {
  const adminHash = await bcrypt.hash(config.adminPassword, 10);
  const dentistHash = await bcrypt.hash(config.dentistPassword, 10);

  const users = [
    {
      name: 'Parla Reception',
      email: 'admin@parladental.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      specialization: 'Resepsiyon / Klinik Yönetimi'
    },
    {
      name: 'Dt. Gonca Görgülü',
      email: 'dentist@parladental.com',
      passwordHash: dentistHash,
      role: 'DENTIST',
      specialization: 'Estetik Diş Hekimliği ve Gülüş Tasarımı'
    },
    {
      name: 'Dt. Ahmet Yılmaz',
      email: 'dentist2@parladental.com',
      passwordHash: dentistHash,
      role: 'DENTIST',
      specialization: 'İmplant ve Cerrahi İşlemler'
    },
    {
      name: 'Dt. Elif Kaya',
      email: 'dentist3@parladental.com',
      passwordHash: dentistHash,
      role: 'DENTIST',
      specialization: 'Çocuk Diş Hekimliği'
    },
    {
      name: 'Dt. Murat Demir',
      email: 'dentist4@parladental.com',
      passwordHash: dentistHash,
      role: 'DENTIST',
      specialization: 'Protetik Tedaviler'
    },
    {
      name: 'Dt. Derya Şahin',
      email: 'dentist5@parladental.com',
      passwordHash: dentistHash,
      role: 'DENTIST',
      specialization: 'Ortodontik Uygulamalar'
    },
    {
      name: 'Dt. Can Arslan',
      email: 'dentist6@parladental.com',
      passwordHash: dentistHash,
      role: 'DENTIST',
      specialization: 'Koruyucu ve Restoratif Tedaviler'
    }
  ];

  for (const user of users) {
    await query(
      `
      INSERT INTO users (name, email, password_hash, role, specialization)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        specialization = EXCLUDED.specialization
      `,
      [
        user.name,
        user.email,
        user.passwordHash,
        user.role,
        user.specialization
      ]
    );
  }

  console.log('Seed users synchronized');
}



async function seedDemoPatients() {
  const existing = await query('SELECT COUNT(*)::int AS count FROM patients');
  if (existing.rows[0].count > 0) return;

  await query(
    `INSERT INTO patients
     (first_name, last_name, national_id, phone, email, birth_date, gender, address, notes)
     VALUES
     ($1,$2,$3,$4,$5,$6,$7,$8,$9),
     ($10,$11,$12,$13,$14,$15,$16,$17,$18)`,
    [
      'Selin', 'Kaya', '12345678910', '0555 111 22 33', 'selin@example.com', '1998-04-12', 'Female', 'Çankaya / Ankara', 'Diş temizliği için düzenli geliyor.',
      'Emre', 'Demir', '10987654321', '0555 444 55 66', 'emre@example.com', '1995-09-20', 'Male', 'Kızılay / Ankara', 'Ortodonti değerlendirmesi istiyor.'
    ]
  );

  const dentist = await query(`SELECT id FROM users WHERE role='DENTIST' ORDER BY id LIMIT 1`);
  const patients = await query(`SELECT id FROM patients ORDER BY id LIMIT 2`);

  if (dentist.rows[0] && patients.rows.length >= 2) {
    await query(
      `INSERT INTO appointments
       (patient_id, dentist_id, appointment_date, appointment_time, service, status, notes)
       VALUES
       ($1,$2,CURRENT_DATE + INTERVAL '1 day','10:00','Diş Temizliği','SCHEDULED','İlk kontrol'),
       ($3,$2,CURRENT_DATE + INTERVAL '2 day','14:30','Ortodonti','SCHEDULED','Şeffaf plak görüşmesi')`,
      [patients.rows[0].id, dentist.rows[0].id, patients.rows[1].id]
    );
  }

  console.log('Demo patients and appointments created');
}

export async function closeDatabase() {
  await pool.end();
}

if (process.argv[1]?.endsWith('migrate.js') || process.argv[1]?.endsWith('migrate.js'.replace('/', '\\'))) {
  runMigrationsAndSeed()
    .then(async () => {
      console.log(JSON.stringify({
        level: 'info',
        event: 'database.migration_completed'
      }));
      await closeDatabase();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(JSON.stringify({
        level: 'error',
        event: 'database.migration_failed',
        message: err.message,
        stack: err.stack
      }));
      await closeDatabase();
      process.exit(1);
    });
}
