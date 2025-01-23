const Database = require('better-sqlite3');

// Define database filename (it will be created if not exists)
const db = new Database('carpark.db', { verbose: console.log });

try {
  // Create a "users" table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Table "users" created successfully.');

  db.exec(`
        CREATE TABLE IF NOT EXISTS vehicles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          height REAL NOT NULL,
          user_id INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);

  console.log('Table "vehicles" created successfully.');

  db.exec(`
    CREATE TABLE IF NOT EXISTS carpark_type (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT UNIQUE NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS parking_system (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT UNIQUE NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS free_parking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT UNIQUE NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS carparks (
      cp_no TEXT PRIMARY KEY,
      address TEXT NOT NULL,
      x_coord REAL NOT NULL,
      y_coord REAL NOT NULL,
      short_term_parking TEXT NOT NULL,
      night_parking INTEGER NOT NULL, 
      decks INTEGER NOT NULL,
      gantry_height REAL NOT NULL,
      has_basement INTEGER NOT NULL,
      carpark_type_id INTEGER NOT NULL,
      parking_system_id INTEGER NOT NULL,
      free_parking_id INTEGER NOT NULL,
      FOREIGN KEY (carpark_type_id) REFERENCES carpark_type(id) ON DELETE CASCADE ON UPDATE CASCADE
      FOREIGN KEY (parking_system_id) REFERENCES parking_system(id) ON DELETE CASCADE ON UPDATE CASCADE
      FOREIGN KEY (free_parking_id) REFERENCES free_parking(id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS favourites (
      user_id INTEGER NOT NULL,
      cp_no TEXT NOT NULL,
      PRIMARY KEY (user_id, cp_no),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (cp_no) REFERENCES carparks(cp_no) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  // Prepare an INSERT statement
  const insertUser = db.prepare(`
    INSERT INTO users (name, email)
    VALUES (@name, @email)
  `);

  // Seed data
  const users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' }
  ];

  // Insert multiple users using a transaction
  const insertMany = db.transaction((records) => {
    let insertResults = [];
    for (const record of records) {
      insertResults.push(insertUser.run(record));
    }
    return insertResults;
  });

  const insertUsersResults = insertMany(users);

  // Insert an order linked to the user
  const insertVehicle = db.prepare('INSERT INTO vehicles (user_id, height) VALUES (?, ?)');
  const vehicleHeights = [2.0, 1.5, 3.0];
  insertUsersResults.forEach((userResult, index) => {
    insertVehicle.run(userResult.lastInsertRowid, vehicleHeights[index]);
  });

  console.log('Database seeded successfully with sample users and vehicles.');

} catch (error) {
  console.error('Error initializing the database:', error);
} finally {
  db.close(); // Close the database connection
}