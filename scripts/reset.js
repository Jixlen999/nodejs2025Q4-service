const { execSync } = require('child_process');
const { rmSync, existsSync } = require('fs');

console.log('🧹 Очищаем Docker...');
try {
  execSync('docker-compose down -v --remove-orphans', { stdio: 'inherit' });
  execSync('docker system prune -a --volumes -f', { stdio: 'inherit' });
} catch (e) {
  console.log('⚠️ Docker не установлен или ошибка очистки');
}

console.log('🗑️ Удаляем временные файлы...');
const dirsToRemove = ['generated', 'prisma/migrations', 'node_modules'];

dirsToRemove.forEach((dir) => {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`✓ Удалено: ${dir}`);
  }
});

console.log(
  '📦 Восстанавливаем зависимости (используем существующий package-lock.json)...',
);
execSync('npm ci', { stdio: 'inherit' });

console.log('⚙️ Генерируем Prisma клиент...');
execSync('npx prisma generate', { stdio: 'inherit' });

console.log('🚀 Запускаем Docker...');
execSync('docker-compose up --build -d', { stdio: 'inherit' });

console.log('✅ Готово! Приложение запускается...');
