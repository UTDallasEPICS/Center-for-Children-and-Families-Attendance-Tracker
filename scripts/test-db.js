import Database from 'better-sqlite3';
import { resolve } from 'path';

console.log('Starting DB test...');

try {
    const dbPath = resolve(process.cwd(), 'test.db');
    console.log('Opening DB at', dbPath);
    const db = new Database(dbPath);

    console.log('Creating table...');
    db.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)');

    console.log('Inserting data...');
    const insert = db.prepare('INSERT INTO test (name) VALUES (?)');
    insert.run('Hello World');

    console.log('Reading data...');
    const row = db.prepare('SELECT * FROM test').get();
    console.log('Row:', row);

    console.log('Closing DB...');
    db.close();
    console.log('DB test passed!');
} catch (err) {
    console.error('DB test failed:', err);
}
