import { converter } from 'culori';

const toOklch = converter('oklch');

// Radix Orange scale from the Figma image (Primary)
const radixOrangeLight = {
  1: '#fefcfb',
  2: '#fff7ed',
  3: '#ffefd6',
  4: '#ffdfb5',
  5: '#ffd19a',
  6: '#ffc182',
  7: '#f5ae73',
  8: '#ec9455',
  9: '#f76b15',
  10: '#ef5f00',
  11: '#cc4e00',
  12: '#582d1d'
};

const radixOrangeDark = {
  1: '#17120e',
  2: '#1e160f',
  3: '#331e0b',
  4: '#462100',
  5: '#562800',
  6: '#66350c',
  7: '#7e451d',
  8: '#a35829',
  9: '#f76b15',
  10: '#ff801f',
  11: '#ffa057',
  12: '#ffe0c2'
};

// Radix Green scale from the Figma image (Success)
const radixGreenLight = {
  1: '#fbfefb',
  2: '#f4fbf6',
  3: '#e6f6eb',
  4: '#d6f1df',
  5: '#c4e8d1',
  6: '#adddc0',
  7: '#8eceaa',
  8: '#5bb98b',
  9: '#30a46c',
  10: '#2b9a66',
  11: '#218358',
  12: '#193b2d'
};

const radixGreenDark = {
  1: '#0e1512',
  2: '#121b17',
  3: '#0f2e22',
  4: '#0b3b2c',
  5: '#114837',
  6: '#1b5745',
  7: '#246854',
  8: '#2a7e68',
  9: '#30a46c',
  10: '#33b074',
  11: '#3dd68c',
  12: '#b1f1cb'
};

// Radix Amber scale from the Figma image (Warning)
const radixAmberLight = {
  1: '#fefdfb',
  2: '#fffaed',
  3: '#fff4d5',
  4: '#ffecbc',
  5: '#ffe3a2',
  6: '#ffd386',
  7: '#f3ba63',
  8: '#ee9d2b',
  9: '#ffb224',
  10: '#ffa01c',
  11: '#ad5700',
  12: '#4e2009'
};

const radixAmberDark = {
  1: '#16120c',
  2: '#1d180f',
  3: '#302008',
  4: '#3f2700',
  5: '#4d3000',
  6: '#5c3d05',
  7: '#714f19',
  8: '#8f6424',
  9: '#ffb224',
  10: '#ffcb47',
  11: '#ffe072',
  12: '#fef3dd'
};

// Radix Blue scale from the Figma image (Info)
const radixBlueLight = {
  1: '#fbfdff',
  2: '#f4faff',
  3: '#e6f4fe',
  4: '#d5efff',
  5: '#c2e5ff',
  6: '#acd8fc',
  7: '#8ec8f6',
  8: '#5eb1ef',
  9: '#0090ff',
  10: '#0588f0',
  11: '#0d74ce',
  12: '#113264'
};

const radixBlueDark = {
  1: '#0d1520',
  2: '#111927',
  3: '#0d2847',
  4: '#003362',
  5: '#004074',
  6: '#104d87',
  7: '#205d9e',
  8: '#2870bd',
  9: '#0090ff',
  10: '#3b9eff',
  11: '#70b8ff',
  12: '#c2e6ff'
};

// Radix Sky scale from the Figma image (Tertiary)
const radixSkyLight = {
  1: '#f9feff',
  2: '#f1fcff',
  3: '#e4f9ff',
  4: '#d1f4fd',
  5: '#bbebf9',
  6: '#a1dff3',
  7: '#79ceea',
  8: '#2ebde5',
  9: '#0ea5e9',
  10: '#1096d5',
  11: '#0f7ebb',
  12: '#0d3d56'
};

const radixSkyDark = {
  1: '#0d141f',
  2: '#111a27',
  3: '#112840',
  4: '#113555',
  5: '#154268',
  6: '#1b537e',
  7: '#206796',
  8: '#2380b7',
  9: '#0ea5e9',
  10: '#2cc2ff',
  11: '#73d6ff',
  12: '#c1ebff'
};

// Radix Red scale from the Figma image (Error)
const radixRedLight = {
  1: '#fffcfc',
  2: '#fff7f7',
  3: '#feebec',
  4: '#ffdbdc',
  5: '#ffcdce',
  6: '#fdbdbe',
  7: '#f4a9aa',
  8: '#eb8e90',
  9: '#e5484d',
  10: '#dc3e42',
  11: '#ce2c31',
  12: '#641723'
};

const radixRedDark = {
  1: '#191111',
  2: '#201314',
  3: '#3b1219',
  4: '#500f1c',
  5: '#611623',
  6: '#72232d',
  7: '#8c333a',
  8: '#b54548',
  9: '#e5484d',
  10: '#f2555a',
  11: '#ff6369',
  12: '#feecee'
};

function hexToOklch(hex) {
  const oklch = toOklch(hex);
  
  // Round values for cleaner output
  return {
    l: Math.round(oklch.l * 1000) / 1000,
    c: Math.round(oklch.c * 1000) / 1000,
    h: oklch.h !== undefined ? Math.round(oklch.h * 10) / 10 : 0
  };
}

function formatOklchString(oklch) {
  // For grays with very low chroma, we can use 0 for hue
  const hue = oklch.c < 0.005 ? 0 : oklch.h;
  return `oklch(${oklch.l} ${oklch.c} ${hue})`;
}

console.log('// ==========================================');
console.log('// RADIX ORANGE (PRIMARY) - OKLCH CONVERSION');
console.log('// ==========================================\n');

console.log('// Orange Light Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixOrangeLight).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$orange-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// Orange Dark Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixOrangeDark).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$orange-dark-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// ==========================================');
console.log('// RADIX GREEN (SUCCESS) - OKLCH CONVERSION');
console.log('// ==========================================\n');

console.log('// Green Light Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixGreenLight).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$green-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// Green Dark Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixGreenDark).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$green-dark-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// ==========================================');
console.log('// RADIX AMBER (WARNING) - OKLCH CONVERSION');
console.log('// ==========================================\n');

console.log('// Amber Light Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixAmberLight).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$yellow-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// Amber Dark Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixAmberDark).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$yellow-dark-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// ==========================================');
console.log('// RADIX BLUE (INFO) - OKLCH CONVERSION');
console.log('// ==========================================\n');

console.log('// Blue Light Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixBlueLight).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$blue-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// Blue Dark Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixBlueDark).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$blue-dark-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// ==========================================');
console.log('// RADIX SKY (TERTIARY) - OKLCH CONVERSION');
console.log('// ==========================================\n');

console.log('// Sky Light Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixSkyLight).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$sky-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// Sky Dark Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixSkyDark).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$sky-dark-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// ==========================================');
console.log('// RADIX RED (ERROR) - OKLCH CONVERSION');
console.log('// ==========================================\n');

console.log('// Red Light Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixRedLight).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$red-${step}: ${oklchString}  // ${hex}`);
});

console.log('\n// Red Dark Mode - OKLCH Conversion');
console.log('// Original hex values from Radix UI\n');
Object.entries(radixRedDark).forEach(([step, hex]) => {
  const oklch = hexToOklch(hex);
  const oklchString = formatOklchString(oklch);
  console.log(`$red-dark-${step}: ${oklchString}  // ${hex}`);
});