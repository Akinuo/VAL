import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutrals
        cream:  '#FAF8F4',
        paper:  '#FFFFFF',
        ink:    '#1C1410',
        muted:  '#6B6560',
        border: '#E2DDD8',
        // Brand
        maroon: {
          DEFAULT: '#6E1A2C',
          deep:    '#4A0F1C',
          light:   '#F5EEF0',
        },
        // Accent — used for progress, selected states
        amber: {
          DEFAULT: '#C8860A',
          soft:    '#FDF3DC',
          border:  '#E8C96A',
        },
        // Semantic
        green: {
          DEFAULT: '#2D6A4F',
          soft:    '#EAF4EE',
          border:  '#A3C4B0',
        },
        red: {
          DEFAULT: '#B91C1C',
          soft:    '#FEF2F2',
          border:  '#FECACA',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans:  ['system-ui', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // Tighter scale — avoids oversized headings
        'xs':   ['0.75rem',  { lineHeight: '1.4' }],
        'sm':   ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem',     { lineHeight: '1.6' }],
        'lg':   ['1.125rem', { lineHeight: '1.55' }],
        'xl':   ['1.25rem',  { lineHeight: '1.45' }],
        '2xl':  ['1.5rem',   { lineHeight: '1.35' }],
        '3xl':  ['1.875rem', { lineHeight: '1.25' }],
        '4xl':  ['2.25rem',  { lineHeight: '1.2' }],
      },
      boxShadow: {
        sm:   '0 1px 2px rgba(28,20,16,0.06)',
        md:   '0 1px 3px rgba(28,20,16,0.08), 0 4px 12px -4px rgba(28,20,16,0.12)',
        nav:  '0 1px 0 rgba(28,20,16,0.10)',
      },
      borderRadius: {
        DEFAULT: '6px',
        sm:      '4px',
        lg:      '10px',
        full:    '9999px',
      },
      maxWidth: {
        prose: '66ch',
        app:   '800px',
      },
    },
  },
} satisfies Config
