/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        // Добавляем "primary" цвет, чтобы он совпадал с темой
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Основной синий
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      container: {
        center: true,
        padding: '1rem', // Отступы по бокам на мобильных
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px', // Ограничим ширину контента на больших экранах
        },
      }
    },
  },
  plugins: [],
}
