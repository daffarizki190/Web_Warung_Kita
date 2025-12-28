const { app, initDb } = require('./app');
const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 5000;

// Initialize DB and start server
initDb().then(() => {
  try {
    const distPath = path.join(__dirname, '..', 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  } catch {}

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
});
