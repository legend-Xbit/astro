/**
 * Icons adapted from https://phosphoricons.com/
 *
 * Want to add more?
 * 1. Find the icon you want on Phosphor Icons.
 * 2. Click “Copy SVG”.
 * 3. Paste the SVG code in your editor.
 * 4. Remove the `<svg>` wrapper so you only have elements like `<path>`, `<circle>`, `<rect>` etc.
 * 5. Remove any `stroke="#000000"` attributes
 * 6. Replace any `fill="#000000"` attributes with `stroke="none"`
 *    (or add `stroke="none"` on shapes with no `fill` or `stroke` specified).
 */
export const iconPaths = {
	wrench: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M245.7 42.3a56 56 0 0 0-79.2 0 55.7 55.7 0 0 0-5.2 6.7L84.5 125.8a111.4 111.4 0 0 0-50.9 14.1 8 8 0 0 0-1.2 12.8l71 71a8 8 0 0 0 12.8-1.2 111.4 111.4 0 0 0 14.1-50.9l76.8-76.8a55.7 55.7 0 0 0 6.7-5.2 56 56 0 0 0 0-79.2ZM48 168l40 40"/>`,
	gear: `<circle cx="128" cy="128" r="40" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M128 40V16m62.2 29.8 17-17M216 128h24m-29.8 62.2 17 17M128 216v24m-62.2-29.8-17 17M40 128H16m29.8-62.2-17-17"/>`,
	car: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M16 144h224M32 112l18.5-55.4A8 8 0 0 1 58 52h140a8 8 0 0 1 7.5 4.6L224 112"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M32 192v-16a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a16 16 0 0 1-16 16h0a16 16 0 0 1-16-16Zm160 0v-16a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a16 16 0 0 1-16 16h0a16 16 0 0 1-16-16Z"/>`,
	lightning: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M96 240 208 112h-88L160 16 48 144h88Z"/>`,
	drop: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M208 144c0-72-80-128-80-128S48 72 48 144a80 80 0 0 0 160 0Z"/>`,
	shield: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M40 56c40 16 56-8 88-8s48 24 88 8v80c0 52-56 80-88 96-32-16-88-44-88-96Z"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m96 136 24 24 48-48"/>`,
	phone: `<rect width="128" height="208" x="64" y="24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" rx="16"/><circle cx="128" cy="192" r="12" stroke="none"/>`,
	'map-pin': `<circle cx="128" cy="104" r="32" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M208 104c0 72-80 128-80 128S48 176 48 104a80 80 0 0 1 160 0Z"/>`,
	'paper-plane-tilt': `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M210.3 35.9 23.9 88.4a8 8 0 0 0-1.2 15l85.6 40.5a7.8 7.8 0 0 1 3.8 3.8l40.5 85.6a8 8 0 0 0 15-1.2l52.5-186.4a7.9 7.9 0 0 0-9.8-9.8Zm-99.4 109.2 45.2-45.2"/>`,
	'arrow-left': `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 128H40m72-72-72 72 72 72"/>`,
	'arrow-right': `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M40 128h176m-72-72 72 72-72 72"/>`,
	list: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M40 128h176M40 64h176M40 192h176"/>`,
	heart: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M128 216S28 160 28 92a52 52 0 0 1 100-20h0a52 52 0 0 1 100 20c0 68-100 124-100 124Z"/>`,
	'moon-stars': `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 112V64m24 24h-48m-24-64v32m16-16h-32m65 113A92 92 0 0 1 103 39h0a92 92 0 1 0 114 114Z"/>`,
	sun: `<circle cx="128" cy="128" r="60" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M128 36V16M63 63 49 49m-13 79H16m47 65-14 14m79 13v20m65-47 14 14m13-79h20m-47-65 14-14"/>`,
	instagram: `<circle cx="128" cy="128" r="40" fill="none" stroke-miterlimit="10" stroke-width="16"/><rect width="184" height="184" x="36" y="36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" rx="48"/><circle cx="180" cy="76" r="12" stroke="none" />`,
};
