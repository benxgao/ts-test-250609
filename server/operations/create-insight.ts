import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import { insertStatement } from "$tables/insights.ts";

type Input = HasDBClient & {
  brand: number;
  text: string;
};

export default (input: Input): Insight => {
  console.log(`Creating insight for brand=${input.brand}`);

  const createdAt = new Date().toISOString();

  const insertData = {
    brand: input.brand,
    createdAt,
    text: input.text,
  };

  // Insert the insight
  input.db.exec(insertStatement(insertData));

  // Get the last inserted row ID
  const lastInsertRowId = input.db.lastInsertRowId;

  const result: Insight = {
    id: lastInsertRowId,
    brand: input.brand,
    createdAt: new Date(createdAt),
    text: input.text,
  };

  console.log("Insight created successfully:", result);
  return result;
};
