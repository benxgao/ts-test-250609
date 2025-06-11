// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import { createTable } from "./tables/insights.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });

const dbExists = await Deno.stat(dbFilePath).then(() => true).catch(() =>
  false
);

if (dbExists) {
  console.log("Database file already exists");
} else {
  console.log("Database file does not exist, will be created");
}

const db = new Database(dbFilePath);

// Initialize database schema if it's a new database or tables don't exist
const initializeDatabase = () => {
  try {
    // Check if insights table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='insights'
    `).get();

    if (!tableExists) {
      console.log("Creating insights table...");
      db.exec(createTable);
      console.log("Database tables created successfully");
    } else {
      console.log("Database tables already exist");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Initialize the database
initializeDatabase();

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights", async (ctx) => {
  const body = await ctx.request.body.json();

  // Validate required fields
  if (!body.brand || !body.text) {
    ctx.response.body = { error: "Missing required fields: brand and text" };
    ctx.response.status = 400;
    return;
  }

  const result = createInsight({
    db,
    brand: Number(body.brand),
    text: String(body.text),
  });

  ctx.response.body = result;
  ctx.response.status = 201;
});

router.delete("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;

  if (!params.id) {
    ctx.response.body = { error: "Missing insight ID" };
    ctx.response.status = 400;
    return;
  }

  const result = deleteInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
