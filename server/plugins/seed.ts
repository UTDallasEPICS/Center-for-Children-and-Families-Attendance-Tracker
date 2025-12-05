import { db } from '../utils/db';

export default defineNitroPlugin(() => {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      checkIn TEXT,
      role TEXT NOT NULL,
      site TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      attendanceRate INTEGER NOT NULL,
      office TEXT,
      callOffReason TEXT
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workerId INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      checkIn TEXT,
      checkOut TEXT,
      hours REAL,
      FOREIGN KEY (workerId) REFERENCES workers(id)
    );
  `);

  try {
    // Check if data exists
    const workerCount = db.prepare('SELECT COUNT(*) as count FROM workers').get() as { count: number };

    if (workerCount.count === 0) {
      console.log('Seeding database with mock data...');

      const insertWorker = db.prepare(`
          INSERT INTO workers (name, status, checkIn, role, site, email, phone, attendanceRate, office, callOffReason)
          VALUES (@name, @status, @checkIn, @role, @site, @email, @phone, @attendanceRate, @office, @callOffReason)
        `);

      const insertAttendance = db.prepare(`
          INSERT INTO attendance (workerId, date, status, checkIn, checkOut, hours)
          VALUES (@workerId, @date, @status, @checkIn, @checkOut, @hours)
        `);

      const mockWorkers = [
        { name: 'Emily Rodriguez', status: 'present', checkIn: '9:02 AM', role: 'Intern', site: 'North Campus', email: 'emily.r@university.edu', phone: '(214) 555-0123', attendanceRate: 96, office: 'Building A - Room 201' },
        { name: 'Marcus Thompson', status: 'present', checkIn: '8:58 AM', role: 'Student Worker', site: 'North Campus', email: 'marcus.t@university.edu', phone: '(214) 555-0124', attendanceRate: 94 },
        { name: 'Sarah Chen', status: 'called-off', checkIn: null, role: 'Intern', site: 'North Campus', email: 'sarah.c@university.edu', phone: '(214) 555-0125', attendanceRate: 88, callOffReason: 'Medical appointment', office: 'Building A - Room 203' },
        { name: 'James Wilson', status: 'late', checkIn: '9:15 AM', role: 'Student Worker', site: 'North Campus', email: 'james.w@university.edu', phone: '(214) 555-0126', attendanceRate: 92 },
        { name: 'Olivia Martinez', status: 'present', checkIn: '9:00 AM', role: 'Intern', site: 'North Campus', email: 'olivia.m@university.edu', phone: '(214) 555-0127', attendanceRate: 98, office: 'Building B - Room 105' },
        { name: 'David Kim', status: 'absent', checkIn: null, role: 'Student Worker', site: 'North Campus', email: 'david.k@university.edu', phone: '(214) 555-0128', attendanceRate: 85 },
        { name: 'Isabella Garcia', status: 'present', checkIn: '8:55 AM', role: 'Intern', site: 'North Campus', email: 'isabella.g@university.edu', phone: '(214) 555-0129', attendanceRate: 97, office: 'Building A - Room 201' },
        { name: 'Ethan Brown', status: 'present', checkIn: '9:03 AM', role: 'Student Worker', site: 'North Campus', email: 'ethan.b@university.edu', phone: '(214) 555-0130', attendanceRate: 91 },
        { name: 'Sophia Patel', status: 'called-off', checkIn: null, role: 'Intern', site: 'North Campus', email: 'sophia.p@university.edu', phone: '(214) 555-0131', attendanceRate: 93, callOffReason: 'Family emergency', office: 'Building B - Room 107' },
        { name: 'Michael Lee', status: 'present', checkIn: '8:59 AM', role: 'Student Worker', site: 'North Campus', email: 'michael.l@university.edu', phone: '(214) 555-0132', attendanceRate: 95 },
      ];

      const transaction = db.transaction(() => {
        for (const worker of mockWorkers) {
          const result = insertWorker.run({
            ...worker,
            office: worker.office || null,
            callOffReason: worker.callOffReason || null
          });
          const workerId = result.lastInsertRowid;

          // Seed some history for each worker
          const history = [
            { date: '2025-10-14', status: 'present', checkIn: '9:00 AM', checkOut: '5:00 PM', hours: 8.0 },
            { date: '2025-10-13', status: 'present', checkIn: '9:05 AM', checkOut: '5:03 PM', hours: 7.97 },
            { date: '2025-10-12', status: 'present', checkIn: '8:58 AM', checkOut: '4:58 PM', hours: 8.0 },
            { date: '2025-10-11', status: 'present', checkIn: '9:02 AM', checkOut: '5:00 PM', hours: 7.97 },
            { date: '2025-10-10', status: 'late', checkIn: '9:20 AM', checkOut: '5:05 PM', hours: 7.75 },
          ];

          for (const record of history) {
            insertAttendance.run({ ...record, workerId });
          }
        }
      });

      transaction();
      console.log('Database seeded successfully.');
    }
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
});
