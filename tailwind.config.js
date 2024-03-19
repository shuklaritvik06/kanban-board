/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{jsx,js,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#5030E5',
        secondary: '#FFA500',
        tertiary: '#8BC48A',
        lowText: '#D58D49',
        lowBg: '#DFA87433',
        highText: '#D8727D',
        highBg: '#D8727D1A',
        columnBg: '#F5F5F5',
        completedText: '#68B266',
        completedBg: '#83C29D33',
        taskText: '#787486',
      },
    },
  },
  plugins: [],
}
