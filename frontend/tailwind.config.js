/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
			sans: ['"Anek Latin"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			press: ['"Press Start 2P"', 'cursive'],
			bungee: ['"Bungee"', 'cursive'],
		},
  		colors: {
  			primary: {
  				DEFAULT: '#FFDBA6', // Light Orange
  				very_light: '#FFFCF7', 
				light: '#ffe7c6', 
  				dark: '#fe9900', // Vivid Orange
				foreground: 'hsl(var(--primary-foreground))'
			},
			secondary: {
				very_dark: '#00104E', // Navy Blue
				dark: '#00125B', // Deep Blue
				DEFAULT: '#223689', // Royal Blue
				light: '#BAC3DF', // Light Blue
				very_light: '#E7EEFF', // Pale Blue
				foreground: 'hsl(var(--secondary-foreground))'
			},
			dark: {
				DEFAULT: '#676767',
				dark: '#191111',
			},
			danger: {
				DEFAULT: '#ef4444',
				light: '#fca5a5',
				dark: '#b91c1c'
			},
			background: 'hsl(var(--background))',	
			foreground: 'hsl(var(--foreground))',
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
			},
			blue: {
				900: '#00104E', // Navy Blue
				800: '#00125B', // Deep Blue
				700: '#223689', // Royal Blue
				400: '#BAC3DF', // Light Blue
				100: '#E7EEFF', // Pale Blue
			},
			gray: {
				400: '#918586', // Warm Gray
				100: '#F4F4F4', // Light Gray
				200: '#F8F8F8', // Extra Light Gray
				700: '#676767', // Medium Gray
			},
			orange: {
				500: '#FF9900', // Vivid Orange
				100: '#FFDBA6', // Light Orange
				50 :' #FFFCF7', // Pale Orange
			},
			purple: {
				400: '#7D8BBD', // Soft Purple
			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}