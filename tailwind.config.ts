import type {Config} from 'tailwindcss'
export default {content:['./src/**/*.{ts,tsx}'],theme:{extend:{
 colors:{
  cream:'#FAF1DF',
  paper:'#FFFAF0',
  maroon:{DEFAULT:'#6E1A2C',deep:'#4A0F1C'},
  terracotta:'#B8552F',
  mustard:{DEFAULT:'#D4A017',soft:'#F3DFA0'},
  sage:'#7C8F6E',
  ink:'#2B1A17'
 },
 fontFamily:{
  serif:['Fraunces','Georgia','Cambria','"Times New Roman"','serif'],
  sans:['system-ui','"Segoe UI"','Roboto','sans-serif']
 },
 boxShadow:{
  card:'0 1px 2px rgba(43,26,23,0.06), 0 10px 24px -16px rgba(74,15,28,0.35)',
  lift:'0 1px 2px rgba(43,26,23,0.07), 0 18px 32px -18px rgba(74,15,28,0.4)'
 },
 borderRadius:{swatch:'10px'}
}}} satisfies Config
