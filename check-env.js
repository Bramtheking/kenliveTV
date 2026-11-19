// Environment Variables Checker
// Run with: node check-env.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔍 Checking Environment Variables...\n');

// Read .env file
let envContent;
try {
  envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
} catch (error) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

// Parse .env
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
});

// Required variables
const requiredVars = {
  'Firebase Client Config': [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_MEASUREMENT_ID',
    'VITE_FIREBASE_VAPID_KEY'
  ],
  'Firebase Admin SDK (for push notifications)': [
    'GOOGLE_TYPE',
    'GOOGLE_PROJECT_ID',
    'GOOGLE_PRIVATE_KEY_ID',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_AUTH_URI',
    'GOOGLE_TOKEN_URI',
    'GOOGLE_AUTH_PROVIDER_X509_CERT_URL',
    'GOOGLE_CLIENT_X509_CERT_URL',
    'GOOGLE_UNIVERSE_DOMAIN'
  ]
};

let allValid = true;

Object.entries(requiredVars).forEach(([category, vars]) => {
  console.log(`\n📦 ${category}:`);
  
  vars.forEach(varName => {
    const value = envVars[varName];
    const isSet = value && value.length > 0;
    const isPlaceholder = value && (
      value.includes('YOUR_') || 
      value.includes('_HERE') ||
      value === 'service_account' ||
      value === 'kenlive-58327' ||
      value === 'googleapis.com' ||
      value.startsWith('https://accounts.google.com') ||
      value.startsWith('https://oauth2.googleapis.com') ||
      value.startsWith('https://www.googleapis.com')
    );
    
    // Special handling for known good values
    const knownGoodValues = [
      'GOOGLE_TYPE',
      'GOOGLE_PROJECT_ID', 
      'GOOGLE_AUTH_URI',
      'GOOGLE_TOKEN_URI',
      'GOOGLE_AUTH_PROVIDER_X509_CERT_URL',
      'GOOGLE_UNIVERSE_DOMAIN'
    ];
    
    if (isSet && !isPlaceholder) {
      console.log(`  ✅ ${varName}`);
    } else if (isSet && isPlaceholder && !knownGoodValues.includes(varName)) {
      console.log(`  ⚠️  ${varName} (placeholder - needs real value)`);
      allValid = false;
    } else if (isSet && knownGoodValues.includes(varName)) {
      console.log(`  ✅ ${varName}`);
    } else {
      console.log(`  ❌ ${varName} (missing)`);
      allValid = false;
    }
  });
});

// Check critical ones that need real values
console.log('\n\n🔑 Critical Variables (must have real values):');

const criticalVars = [
  'GOOGLE_PRIVATE_KEY_ID',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_X509_CERT_URL'
];

let criticalMissing = false;

criticalVars.forEach(varName => {
  const value = envVars[varName];
  const isPlaceholder = !value || value.includes('YOUR_') || value.includes('_HERE');
  
  if (isPlaceholder) {
    console.log(`  ❌ ${varName} - NEEDS REAL VALUE FROM FIREBASE`);
    criticalMissing = true;
  } else {
    console.log(`  ✅ ${varName}`);
  }
});

// Final verdict
console.log('\n' + '='.repeat(60));

if (criticalMissing) {
  console.log('\n❌ PUSH NOTIFICATIONS WILL NOT WORK!\n');
  console.log('📋 Next Steps:');
  console.log('1. Go to https://console.firebase.google.com/');
  console.log('2. Select project: kenlive-58327');
  console.log('3. Go to: ⚙️ Settings > Service Accounts');
  console.log('4. Click "Generate New Private Key"');
  console.log('5. Download the JSON file');
  console.log('6. Copy values from JSON to .env file');
  console.log('7. Run this script again to verify\n');
  process.exit(1);
} else if (!allValid) {
  console.log('\n⚠️  Some variables are missing but push notifications might work\n');
  process.exit(0);
} else {
  console.log('\n✅ ALL ENVIRONMENT VARIABLES ARE SET!\n');
  console.log('🚀 You can now run: npm run dev:netlify\n');
  process.exit(0);
}
