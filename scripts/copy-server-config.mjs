import fs from 'node:fs';
import path from 'node:path';

const serverFiles = [
  ['public/api/telegram-config.php', 'dist/api/telegram-config.php'],
  ['public/admin/auth-config.php', 'dist/admin/auth-config.php'],
];

for (const [sourceFile, targetFile] of serverFiles) {
  const sourcePath = path.resolve(sourceFile);
  const targetPath = path.resolve(targetFile);

  if (!fs.existsSync(sourcePath)) {
    continue;
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}
