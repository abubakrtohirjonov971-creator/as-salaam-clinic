import fs from 'fs';
import path from 'path';

function findFiles(dir, extList, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, extList, fileList);
    } else {
      if (extList.some(ext => file.endsWith(ext))) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const targetFiles = findFiles('/Users/user/Desktop/As-salaam clinic/src', ['.jsx', '.js']);

let count = 0;
for (const file of targetFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replaceAll('+998 90 266 03 83', '+998 90 544 77 07')
    .replaceAll('+998902660383', '+998905447707')
    .replaceAll('902660383', '905447707')
    .replaceAll('90 266 03 83', '90 544 77 07');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    count++;
    console.log(`Updated: ${file}`);
  }
}
console.log(`Successfully updated ${count} files.`);
