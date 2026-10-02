import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabaseSync('miapp.db');

const init = async () => {
    // Creamos las tablas necesarias
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS configuracion (
            id INTEGER PRIMARY KEY,
            salario REAL DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS gastos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            monto REAL NOT NULL
        );
    `);

    // Asegurarnos de que exista un registro de configuración inicial
    const result = await db.getAllAsync('SELECT * FROM configuracion WHERE id = 1');
    if (result.length === 0) {
        await db.runAsync('INSERT INTO configuracion (id, salario) VALUES (1, 0)');
    }
};

// --- FINANZAS ---

const guardarSalario = async (monto) => {
    await db.runAsync('UPDATE configuracion SET salario = ? WHERE id = 1', [monto]);
};

const obtenerSalario = async () => {
    const row = await db.getFirstAsync('SELECT salario FROM configuracion WHERE id = 1');
    return row ? row.salario : 0;
};

const agregarGasto = async (nombre, monto) => {
    const result = await db.runAsync('INSERT INTO gastos (nombre, monto) VALUES (?, ?)', [nombre, monto]);
    // Devolvemos el ID generado por la base de datos para usarlo en el estado de React
    return result.lastInsertRowId;
};

const obtenerGastos = async () => {
    const allRows = await db.getAllAsync('SELECT * FROM gastos ORDER BY id DESC');
    return allRows;
};

const eliminarGasto = async (id) => {
    await db.runAsync('DELETE FROM gastos WHERE id = ?', [id]);
};

export default {
    init,
    guardarSalario,
    obtenerSalario,
    agregarGasto,
    obtenerGastos,
    eliminarGasto
};