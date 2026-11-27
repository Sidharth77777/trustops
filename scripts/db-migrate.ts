import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({
    path: resolve(process.cwd(), ".env"),
});

const migrate = async (): Promise<void> => {
    const path = await import("node:path");
    const fs = await import("node:fs");

    const { getPool, logger } = await import("@trustops/shared");

    const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

    const CREATE_MIGRATIONS_TABLE_SQL = `
        CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `;

    type MigrationRow = {
        name: string;
    };

    const getExecutedMigrations = async (): Promise<string[]> => {
        const result = await getPool().query<MigrationRow>(
            "SELECT name FROM migrations ORDER BY name;"
        );

        return result.rows.map((row) => row.name);
    };

    const getMigrationFiles = (): string[] => {
        return fs
            .readdirSync(MIGRATIONS_DIR)
            .filter((file) => file.endsWith(".sql"))
            .sort();
    };

    const runMigration = async (fileName: string): Promise<void> => {
        const sql = fs.readFileSync(
            path.join(MIGRATIONS_DIR, fileName),
            "utf-8"
        );

        const client = await getPool().connect();

        try {
            await client.query("BEGIN");
            await client.query(sql);

            await client.query(
                "INSERT INTO migrations (name) VALUES ($1)",
                [fileName]
            );

            await client.query("COMMIT");

            logger.info(`Migration completed: ${fileName}`);
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    };

    await getPool().query(CREATE_MIGRATIONS_TABLE_SQL);

    const executed = new Set(await getExecutedMigrations());

    const pending = getMigrationFiles().filter(
        (file) => !executed.has(file)
    );

    if (pending.length === 0) {
        logger.info("No pending migrations");
        return;
    }

    for (const fileName of pending) {
        await runMigration(fileName);
    }

    logger.info("All migrations completed");

    await getPool().end();
};

migrate().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});