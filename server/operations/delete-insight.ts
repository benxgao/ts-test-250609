import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: string | number;
};

export default (input: Input): { success: boolean; deletedId: number } => {
  const id = Number(input.id);

  console.log(`Deleting insight with id=${id}`);

  // Check if the insight exists before deleting
  const existingInsight = input.db.prepare(`
    SELECT id FROM insights WHERE id = ?
  `).get(id);

  if (!existingInsight) {
    throw new Error(`Insight with id ${id} not found`);
  }

  input.db.prepare(`
    DELETE FROM insights WHERE id = ?
  `).run(id);

  console.log(`Insight with id=${id} deleted successfully`);

  return {
    success: true,
    deletedId: id,
  };
};
