const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				rwthBlue: '#003399'
			}
		}
	},

	plugins: [require('@tailwindcss/typography')],

	darkMode: 'class'
};

module.exports = config;
