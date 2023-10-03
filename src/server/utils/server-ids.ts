export function generateRandomId(prefix: string): string {
  // 281474976710656 possible values.
  return prefix + Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
}

export const serverId = process.env.SERVER_ID || generateRandomId('');
export const statsId = process.env.STATS_ID || generateRandomId('');
export const runId = generateRandomId('r');
