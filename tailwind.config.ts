import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      blue: '#0AA0EA',
      darkBlue: '#091926',
      deepBlue: '#1C3A4D',
      cadgetBlue: '#253742',
grey: '#707070',
lightGrey: '#cfccc9',
lighterGrey: '#F4F5F8',
dimGrey: '#d1d7db',
black: '#000',
white:'#fff',
dimBlue: '#0aa0ea70',
dimWhite: '#ffffffe6',
beige: '#FCF5EB',
carbon: '#111B21',
red: '#D14031',
green: '#054f31',
silver: '#d1d7db',
transparent: '#00000000'
    },
    screens: {
      '4xl': '1600px',
      '3xl': { max: '1535px' },
      
      '2xl': { max: '1400px' },
      xl: { max: '1279px' },
      

      lg: { max: '1023px' },
      

      md: { max: '767px' },
      

      sm: { max: '639px' },
      xs: { max: '575px' },
      dxs: { max: '500px' },
      '2xs': { max: '400px' },
      
  },
    extend: {},
  },
  plugins: [],
};
export default config;
