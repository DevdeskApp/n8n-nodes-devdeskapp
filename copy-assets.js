const fs = require('fs');
const path = require('path');

const srcIcon = path.join(__dirname, 'nodes', 'DevDeskApp', 'devdeskapp.svg');
const destDir = path.join(__dirname, 'dist', 'nodes', 'DevDeskApp');
const destIcon = path.join(destDir, 'devdeskapp.svg');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcIcon)) {
  fs.copyFileSync(srcIcon, destIcon);
  console.log('✓ Successfully copied devdeskapp.svg to dist/nodes/DevDeskApp/');
} else {
  console.warn('⚠ Source icon devdeskapp.svg not found!');
}
