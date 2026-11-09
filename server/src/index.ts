import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 MISSION OS Core API Engine Active`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔒 Environment: ${config.nodeEnv}`);
  console.log(`🎯 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});

