import fs from 'fs';
import path from 'path'
import type { Plugin } from 'vite';

export function emptySourcemapFix(): Plugin {
  let currentInterval: NodeJS.Timeout | undefined;

  return {
    name: 'empty-sourcemap-fix',
    enforce: 'post',
    transform(source) {
      if (currentInterval !== undefined) return;
      currentInterval = setInterval(() => {
        const nodeModulesPath = path.join(__dirname, 'node_modules', '.vite', 'deps');
        if (!fs.existsSync(nodeModulesPath)) return;
        clearInterval(currentInterval);
        currentInterval = undefined;
        const files = fs.readdirSync(nodeModulesPath);
        files.forEach(file => {
          const mapFile = file + '.map';
          const mapPath = path.join(nodeModulesPath, mapFile);
          if (!fs.existsSync(mapPath)) return;
          let mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
          if (!mapData.sources || mapData.sources.length === 0) {
            mapData.sources = [path.relative(mapPath, path.join(nodeModulesPath, file))];
            fs.writeFileSync(mapPath, JSON.stringify(mapData), 'utf8');
          }
        });
      }, 100);
      return source;
    }
  };
};