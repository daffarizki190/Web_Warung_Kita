import appModule from '../server/app.js';

const { app, initDb } = appModule;
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
  return app(req, res);
}
