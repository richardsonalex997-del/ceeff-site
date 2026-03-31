import fs from 'node:fs';
import path from 'node:path';

import aboutContent from '../src/data/aboutContent.js';
import blogContent from '../src/data/blogContent.js';
import contactsContent from '../src/data/contactsContent.js';
import consultingContent from '../src/data/consultingContent.js';
import faqContent from '../src/data/faqContent.js';
import homeContent from '../src/data/homeContent.js';
import licensesContent from '../src/data/licensesContent.js';
import maintenanceContent from '../src/data/maintenanceContent.js';
import priceContent from '../src/data/priceContent.js';
import projectsContent from '../src/data/projectsContent.js';
import reviewsContent from '../src/data/reviewsContent.js';
import servicesContent from '../src/data/servicesContent.js';
import siteContent from '../src/data/siteContent.js';

const rootDir = path.resolve();
const publicDir = path.join(rootDir, 'public');
const dataDir = path.join(publicDir, 'data');

function ensureDir(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function writeJson(relativePath, data) {
  const targetPath = path.join(publicDir, relativePath);
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(
    targetPath,
    `${JSON.stringify(data, null, 2)}\n`,
    'utf8',
  );
}

function copyFile(sourceRelativePath, targetRelativePath) {
  const sourcePath = path.join(rootDir, sourceRelativePath);
  const targetPath = path.join(publicDir, targetRelativePath);

  if (!fs.existsSync(sourcePath)) {
    return;
  }

  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
}

ensureDir(dataDir);

writeJson('data/projects.json', projectsContent);
writeJson('data/blog.json', blogContent);
writeJson('data/home.json', homeContent);
writeJson('data/about.json', aboutContent);
writeJson('data/licenses.json', licensesContent);
writeJson('data/site.json', siteContent);
writeJson('data/contacts.json', contactsContent);
writeJson('data/faq.json', faqContent);
writeJson('data/reviews.json', reviewsContent);
writeJson('data/services.json', servicesContent);
writeJson('data/maintenance.json', maintenanceContent);
writeJson('data/consulting.json', consultingContent);
writeJson('data/price.json', priceContent);

copyFile(
  'src/assets/blog/xlpe-vlf-photo-optimized.jpg',
  'media/blog/xlpe-vlf-photo.jpg',
);

copyFile(
  'src/assets/projects/codatacenter/photo_2026-03-12_09-26-03.jpg',
  'media/projects/data-center/data-center-1.jpg',
);
copyFile(
  'src/assets/projects/codatacenter/photo_2026-03-12_09-26-08.jpg',
  'media/projects/data-center/data-center-2.jpg',
);
copyFile(
  'src/assets/projects/codatacenter/photo_2026-03-23_09-13-13.jpg',
  'media/projects/data-center/data-center-3.jpg',
);

copyFile(
  'src/assets/certificates/iso-9001_1-optimized.jpg',
  'media/licenses/iso-9001-1.jpg',
);
copyFile(
  'src/assets/certificates/iso-9001_2-optimized.jpg',
  'media/licenses/iso-9001-2.jpg',
);
copyFile(
  'src/assets/certificates/iso-9001_3-optimized.jpg',
  'media/licenses/iso-9001-3.jpg',
);
copyFile(
  'src/assets/certificates/iso-9001_1-thumb.jpg',
  'media/licenses/iso-9001-1-thumb.jpg',
);
copyFile(
  'src/assets/certificates/iso-9001_2-thumb.jpg',
  'media/licenses/iso-9001-2-thumb.jpg',
);
copyFile(
  'src/assets/certificates/iso-9001_3-thumb.jpg',
  'media/licenses/iso-9001-3-thumb.jpg',
);
