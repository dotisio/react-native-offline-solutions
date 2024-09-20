
import * as SQLite from 'expo-sqlite';

interface TestSchema {
    id: number,
    value: string,
    intValue: number,
}

export const sqlitein = async () => {



    const db = await SQLite.openDatabaseAsync('databaseName');

// `execAsync()` is useful for bulk queries when you want to execute altogether.
// Please note that `execAsync()` does not escape parameters and may lead to SQL injection.
    await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
INSERT INTO test (value, intValue) VALUES ('test1', 123);
INSERT INTO test (value, intValue) VALUES ('test2', 456);
INSERT INTO test (value, intValue) VALUES ('test3', 789);
`);

// `runAsync()` is useful when you want to execute some write operations.
    const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'aaa', 100);
    console.log(result.lastInsertRowId, result.changes);
    await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', 999, 'aaa'); // Binding unnamed parameters from variadic arguments
    await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']); // Binding unnamed parameters from array
    await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' }); // Binding named parameters from object

// `getFirstAsync()` is useful when you want to get a single row from the database.
    const firstRow = await db.getFirstAsync<TestSchema>('SELECT * FROM test');
    console.log(firstRow?.id, firstRow?.value, firstRow?.intValue);

// `getAllAsync()` is useful when you want to get all results as an array of objects.
    const allRows = await db.getAllAsync<TestSchema>('SELECT * FROM test');
    for (const row of allRows) {
        console.log(row.id, row.value, row.intValue);
    }

// `getEachAsync()` is useful when you want to iterate SQLite query cursor.
    for await (const row of db.getEachAsync<TestSchema>('SELECT * FROM test')) {
        console.log(row.id, row.value, row.intValue);
    }

}

import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
                <Header />
                <Content />
            </SQLiteProvider>
        </View>
    );
}

export function Header() {
    const db = useSQLiteContext();
    const [version, setVersion] = useState('');
    useEffect(() => {
        async function setup() {
            const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
                'SELECT sqlite_version()'
            );
            setVersion(result['sqlite_version()']);
        }
        setup();
    }, []);
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>SQLite version: {version}</Text>
        </View>
    );
}

interface Todo {
    value: string;
    intValue: number;
}

export function Content() {
    const db = useSQLiteContext();
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        async function setup() {
            const result = await db.getAllAsync<Todo>('SELECT * FROM todos');
            setTodos(result);
        }
        setup();
    }, []);

    return (
        <View style={styles.contentContainer}>
            {todos.map((todo, index) => (
                <View style={styles.todoItemContainer} key={index}>
                    <Text>{`${todo.intValue} - ${todo.value}`}</Text>
                </View>
            ))}
        </View>
    );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );
    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }
    if (currentDbVersion === 0) {
        await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
`);
        await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
        await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
        currentDbVersion = 1;
    }
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const styles = StyleSheet.create({
    // Your styles...
});
