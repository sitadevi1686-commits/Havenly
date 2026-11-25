/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        havenly: {
          dark: '#101313',        // Primary dark
          surface: '#191D1C',     // Secondary dark
          elevated: '#212625',    // Slightly raised dark surface
          border: 'rgba(198, 163, 106, 0.18)',
          borderMuted: 'rgba(255, 255, 255, 0.08)',
          ivory: '#F4F0E8',       // Warm ivory
          ivoryMuted: '#E8E2D5',  // Cream secondary
          ivoryDark: '#D8D0C0',   // Cream borders
          gold: '#C6A36A',        // Champagne gold
          goldMuted: '#9C8052',   // Muted gold
          goldLight: '#E8D5B5',   // Light champagne
          textMuted: '#A6AAA4',   // Muted text
          textLight: '#E2E5E0',   // Light readable text on dark
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Manrope"', '"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.45)',
        'gold-glow': '0 0 35px -5px rgba(198, 163, 106, 0.25)',
        'gold-subtle': '0 4px 20px -2px rgba(198, 163, 106, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #DFBE82 0%, #C6A36A 50%, #9C8052 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgba(16, 19, 19, 0.7) 0%, rgba(16, 19, 19, 0.98) 100%)',
      }
    },
  },
  plugins: [],
};

