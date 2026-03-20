const palettes = {
  base: ['primary', 'success', 'warning', 'danger', 'error', 'info']
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-mode="dark"]'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...getColors(palettes),
        // primary 100 - 900
        'primary-100': 'color-mix(in srgb, var(--color-primary), white 40%)',
        'primary-200': 'color-mix(in srgb, var(--color-primary), white 20%)',
        'primary-300': 'color-mix(in srgb, var(--color-primary), white 10%)',
        'primary-400': 'var(--color-primary)',
        'primary': 'var(--color-primary)',
        'primary-500': 'color-mix(in srgb, var(--color-primary), black 10%)',
        'primary-600': 'color-mix(in srgb, var(--color-primary), black 20%)',
        'primary-700': 'color-mix(in srgb, var(--color-primary), black 40%)',
        'primary-800': 'color-mix(in srgb, var(--color-primary), black 70%)'
      }
    }
  },
  plugins: []
};

function baseColor(group) {
  const colors = {};
  group.forEach((name) => {
    colors[`el-${name}`] = `var(--el-color-${name})`;
    colors[`el-${name}-light-3`] = `var(--el-color-${name}-light-3)`;
    colors[`el-${name}-light-5`] = `var(--el-color-${name}-light-5)`;
    colors[`el-${name}-light-7`] = `var(--el-color-${name}-light-7)`;
    colors[`el-${name}-light-8`] = `var(--el-color-${name}-light-8)`;
    colors[`el-${name}-light-9`] = `var(--el-color-${name}-light-9)`;
    colors[`el-${name}-dark-2`] = `var(--el-color-${name}-dark-2)`;
  });
  return colors;
}

function getColors(palettes) {
  const colors = {};
  for (const key in palettes) {
    const group = palettes[key];
    if (key === 'base') {
      Object.assign(colors, baseColor(group));
    }
  }
  return colors;
}
