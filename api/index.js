import { app, initDb } from '../server/app.js';
import serverless from 'serverless-http';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    try {
      await initDb();
      initialized = true;
    } catch (err) {
      console.error('Error during initDb in serverless:', err);
    }
  }
  const wrapped = serverless(app);
  return wrapped(req, res);
}
