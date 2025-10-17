const fs = require('fs');
const path = require('path');

// 確保 out 目錄存在
const outDir = path.join(__dirname, '..', 'out');
if (!fs.existsSync(outDir)) {
  console.log('創建 out 目錄...');
  fs.mkdirSync(outDir, { recursive: true });
}

// 創建 .nojekyll 文件
const noJekyllPath = path.join(outDir, '.nojekyll');
fs.writeFileSync(noJekyllPath, '');
console.log('.nojekyll 文件已創建');