const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src/assets');

const generateFrames = (dir) => {
  const results = {};
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results[file] = generateFrames(filePath);
    } else if (file.endsWith('.png')) {
      const relativePath = filePath.replace(__dirname, '');
      const key = path.basename(file, path.extname(file));
      results[key] = relativePath;
    }
  });
  return results;
};

const output = generateFrames(baseDir);

fs.writeFileSync(path.join(__dirname, 'src/animations.json'), JSON.stringify(output, null, 2));
console.log('Animations generated successfully.');
