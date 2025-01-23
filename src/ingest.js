const Database = require('better-sqlite3');
const fs = require('fs');
const csv = require('csv-parser');

const filePath = './carpark.db';

if (fs.existsSync(filePath)) {
    const db = new Database(filePath, { verbose: console.log });

    const upsertStatements = {
        carparkType: db.prepare(`
        INSERT INTO carpark_type (type)
        VALUES (@type)
        ON CONFLICT(type) DO UPDATE SET
            type = @type
        RETURNING id
    `),
        parkingSystem: db.prepare(`
        INSERT INTO parking_system (type)
        VALUES (@type)
        ON CONFLICT(type) DO UPDATE SET
            type = @type
        RETURNING id
    `),
        freeParking: db.prepare(`
        INSERT INTO free_parking (type)
        VALUES (@type)
        ON CONFLICT(type) DO UPDATE SET
            type = @type
        RETURNING id
    `),
        carpark: db.prepare(`
        INSERT INTO carparks (
            cp_no, address, x_coord, y_coord, short_term_parking,
            night_parking, decks, gantry_height, has_basement,
            carpark_type_id, parking_system_id, free_parking_id
        ) VALUES (
            @cp_no, @address, @x_coord, @y_coord, @short_term_parking,
            @night_parking, @decks, @gantry_height, @has_basement,
            @carpark_type_id, @parking_system_id, @free_parking_id
        )
        ON CONFLICT(cp_no) DO UPDATE SET
            address = @address,
            x_coord = @x_coord,
            y_coord = @y_coord,
            short_term_parking = @short_term_parking,
            night_parking = @night_parking,
            decks = @decks,
            gantry_height = @gantry_height,
            has_basement = @has_basement,
            carpark_type_id = @carpark_type_id,
            parking_system_id = @parking_system_id,
            free_parking_id = @free_parking_id
    `)
    };

    const ingestData = db.transaction((records) => {
        for (const record of records) {
            // Insert/update lookup values and get IDs
            const carparkTypeId = upsertStatements.carparkType.get({ type: record.car_park_type }).id;
            const parkingSystemId = upsertStatements.parkingSystem.get({ type: record.type_of_parking_system }).id;
            const freeParkingId = upsertStatements.freeParking.get({ type: record.free_parking }).id;

            // Insert/update carpark with foreign keys
            upsertStatements.carpark.run({
                cp_no: record.car_park_no,
                address: record.address,
                x_coord: parseFloat(record.x_coord),
                y_coord: parseFloat(record.y_coord),
                short_term_parking: record.short_term_parking,
                night_parking: record.night_parking === 'YES' ? 1 : 0,
                decks: parseInt(record.car_park_decks),
                gantry_height: parseFloat(record.gantry_height),
                has_basement: record.car_park_basement === 'Y' ? 1 : 0,
                carpark_type_id: carparkTypeId,
                parking_system_id: parkingSystemId,
                free_parking_id: freeParkingId
            });
        }
    });

    const records = [];
    fs.createReadStream('carparks-data.csv')
        .pipe(csv())
        .on('data', (data) => records.push(data))
        .on('end', () => {
            // Single transaction for the entire CSV
            const transaction = db.transaction(() => {
                for (const record of records) {
                    const carparkTypeId = upsertStatements.carparkType.get({ type: record.car_park_type }).id;
                    const parkingSystemId = upsertStatements.parkingSystem.get({ type: record.type_of_parking_system }).id;
                    const freeParkingId = upsertStatements.freeParking.get({ type: record.free_parking }).id;

                    upsertStatements.carpark.run({
                        cp_no: record.car_park_no,
                        address: record.address,
                        x_coord: parseFloat(record.x_coord),
                        y_coord: parseFloat(record.y_coord),
                        short_term_parking: record.short_term_parking,
                        night_parking: record.night_parking === 'YES' ? 1 : 0,
                        decks: parseInt(record.car_park_decks),
                        gantry_height: parseFloat(record.gantry_height),
                        has_basement: record.car_park_basement === 'Y' ? 1 : 0,
                        carpark_type_id: carparkTypeId,
                        parking_system_id: parkingSystemId,
                        free_parking_id: freeParkingId
                    });
                }
            });

            try {
                transaction();
                console.log(`Successfully processed all ${records.length} records`);
            } catch (error) {
                console.error('There was an error processing the file, cancelling the insertion operation:', error);
                process.exit(1);
            } finally {
                db.close();
            }
        });


} else {
    console.error("DB file does not exist. Please run the seedData.js script first.");
}