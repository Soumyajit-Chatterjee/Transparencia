const fs = require('fs');
const path = require('path');

const rootEnv = path.join(__dirname, '.env');
const frontendEnv = path.join(__dirname, 'frontend', '.env.local');

if (!fs.existsSync(rootEnv)) {
    console.error('❌ Error: Root .env file not found');
    process.exit(1);
}

const envContent = fs.readFileSync(rootEnv, 'utf8');
const reactEnv = envContent
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
        if (line.startsWith('CONTRACT_ADDRESS=')) return `REACT_APP_${line}`;
        if (line.startsWith('ALCHEMY_API_URL=')) return `REACT_APP_${line}`;
        return null;
    })
    .filter(Boolean)
    .join('\n');

fs.writeFileSync(frontendEnv, reactEnv);
console.log('✅ Env vars synced to frontend/.env.local');