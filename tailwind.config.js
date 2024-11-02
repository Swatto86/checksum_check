/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-red-900/50',
    'text-red-200',
    'bg-blue-900/50',
    'text-blue-200',
    'bg-gray-800',
    'text-gray-400',
    'text-blue-400',
    'text-green-400',
    'hover:bg-gray-700'
  ]
}