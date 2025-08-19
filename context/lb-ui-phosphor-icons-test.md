# LittleBrand UI Kit - Phosphor Icons Integration Test

This guide provides complete step-by-step instructions to test your locally built UI kit with Phosphor Icons integration.

## Prerequisites
- Node.js and npm installed
- Git repository cloned: `/Users/ianmadrigal/Documents/GitHub/littlebrand-ui-kit`
- Terminal/command line access

## Complete Setup Instructions

### Step 1: Build Your UI Kit
First, in your LittleBrand UI Kit directory:
```bash
cd /Users/ianmadrigal/Documents/GitHub/littlebrand-ui-kit
npm run build
npm link
```

### Step 2: Create Test Project Directory
Open a new terminal and create the test project:
```bash
# Go to your preferred directory (e.g., Desktop or Documents)
cd ~/Desktop

# Create and enter test project
mkdir littlebrand-phosphor-test
cd littlebrand-phosphor-test
```

### Step 3: Initialize the Test Project
```bash
npm init -y
```

### Step 4: Install Dependencies
```bash
# Install Vue 3 (required peer dependency)
npm install vue@3

# Link your local UI kit
npm link littlebrand-ui-kit

# Install Phosphor Icons
npm install @phosphor-icons/vue

# Install Vite for development
npm install -D vite @vitejs/plugin-vue
```

### Step 5: Create Project Structure
Create the following files and folders:
```bash
# Create src directory
mkdir src

# Create the necessary files
touch vite.config.js
touch index.html
touch src/main.js
touch src/App.vue
```

Your structure should look like:
```
littlebrand-phosphor-test/
├── src/
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
└── node_modules/
```

### Step 6: Add Configuration and Code Files

Now copy and paste the following code into each file:

## File Contents

### 1. vite.config.js
Copy this into `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

### 2. index.html
Copy this into `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LittleBrand + Phosphor Icons Test</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

### 3. src/main.js
Copy this into `src/main.js`:
```javascript
import { createApp } from 'vue'
import App from './App.vue'

// Import LittleBrand UI styles
import 'littlebrand-ui-kit/style.css'

// Import and use the UI kit plugin
import LittleBrandUI from 'littlebrand-ui-kit'

const app = createApp(App)
app.use(LittleBrandUI)
app.mount('#app')
```

### 4. src/App.vue
Copy this into `src/App.vue`:
```vue
<template>
  <div class="test-container">
    <header class="test-header">
      <h1>LittleBrand UI + Phosphor Icons Test</h1>
      <LbButton 
        variant="tonal" 
        :color="isDark ? 'warning' : 'info'"
        @click="toggleTheme"
      >
        <template #icon-leading>
          <PhSun v-if="isDark" :size="20" />
          <PhMoon v-else :size="20" />
        </template>
        {{ isDark ? 'Light Mode' : 'Dark Mode' }}
      </LbButton>
    </header>
    
    <!-- Test 1: Button with Icons -->
    <section>
      <h2>Buttons with Icons</h2>
      <p>Testing different button variants with icon slots</p>
      
      <div class="button-group">
        <LbButton variant="filled" color="primary">
          <template #icon-leading>
            <PhDownload :size="20" />
          </template>
          Download
        </LbButton>
        
        <LbButton variant="outline" color="secondary">
          Settings
          <template #icon-trailing>
            <PhGear :size="20" />
          </template>
        </LbButton>
        
        <LbButton variant="ghost" color="error">
          <template #icon-leading>
            <PhTrash :size="20" />
          </template>
          Delete
        </LbButton>
        
        <LbButton variant="tonal" color="success">
          <template #icon-leading>
            <PhCheck :size="20" />
          </template>
          Save
        </LbButton>
      </div>
    </section>

    <!-- Test 2: Input with Icons -->
    <section>
      <h2>Inputs with Icons</h2>
      <p>Form inputs with leading and trailing icon slots</p>
      
      <div class="form-group">
        <LbFormField>
          <LbLabel for="search">Search</LbLabel>
          <LbInput 
            id="search" 
            v-model="searchValue" 
            placeholder="Search..."
          >
            <template #icon-leading>
              <PhMagnifyingGlass :size="20" />
            </template>
          </LbInput>
        </LbFormField>
        
        <LbFormField>
          <LbLabel for="email">Email</LbLabel>
          <LbInput 
            id="email" 
            v-model="emailValue" 
            type="email"
            placeholder="Enter email"
          >
            <template #icon-leading>
              <PhEnvelope :size="20" />
            </template>
            <template #icon-trailing>
              <PhCheck v-if="emailValid" :size="20" color="var(--color-success)" />
            </template>
          </LbInput>
          <LbHintText v-if="emailValue && !emailValid" error>
            Please enter a valid email address
          </LbHintText>
        </LbFormField>
      </div>
    </section>

    <!-- Test 3: Select with Icons -->
    <section>
      <h2>Select Components</h2>
      <p>Select dropdowns with custom and default icons</p>
      
      <div class="form-group">
        <!-- Select with custom dropdown icon -->
        <LbFormField>
          <LbLabel for="country">Country (Custom Icon)</LbLabel>
          <LbSelect 
            id="country" 
            v-model="selectedCountry"
            placeholder="Choose a country"
          >
            <template #icon>
              <PhCaretDown :size="20" />
            </template>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
          </LbSelect>
          <LbHintText>The icon slot replaces the default dropdown arrow</LbHintText>
        </LbFormField>
        
        <!-- Select with default icon -->
        <LbFormField>
          <LbLabel for="language">Language (Default Icon)</LbLabel>
          <LbSelect 
            id="language" 
            v-model="selectedLanguage"
            placeholder="Select language"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </LbSelect>
          <LbHintText>This uses the built-in CSS dropdown arrow</LbHintText>
        </LbFormField>
      </div>
    </section>

    <!-- Test 4: FormField Component -->
    <section>
      <h2>FormField Component Examples</h2>
      <p>Using the FormField wrapper for consistent form layouts</p>
      
      <div class="form-group">
        <!-- Basic FormField with Input -->
        <LbFormField 
          label="Username" 
          hint="Choose a unique username"
          required
        >
          <template #default="{ id, 'aria-describedby': ariaDescribedby }">
            <LbInput 
              :id="id"
              v-model="username"
              placeholder="Enter username"
              :aria-describedby="ariaDescribedby"
            />
          </template>
        </LbFormField>
        
        <!-- FormField with validation states -->
        <LbFormField 
          label="Password" 
          :error="passwordError"
          :hint="!passwordError ? 'Must be at least 8 characters' : ''"
        >
          <template #default="{ id, 'aria-describedby': ariaDescribedby }">
            <LbInput 
              :id="id"
              v-model="password"
              type="password"
              placeholder="Enter password"
              :aria-describedby="ariaDescribedby"
              :invalid="!!passwordError"
              @input="validatePassword"
            />
          </template>
        </LbFormField>
        
        <!-- FormField with Textarea -->
        <LbFormField 
          label="Comments" 
          hint="Share your thoughts"
        >
          <template #default="{ id, 'aria-describedby': ariaDescribedby }">
            <LbTextarea 
              :id="id"
              v-model="comments"
              placeholder="Type your message here..."
              :rows="4"
              :aria-describedby="ariaDescribedby"
            />
          </template>
        </LbFormField>
      </div>
    </section>

    <!-- Test 5: HintText with Icons -->
    <section>
      <h2>Hint Text with Status Icons</h2>
      <p>Helper text components with different states</p>
      
      <div class="hint-group">
        <LbHintText error>
          <template #icon-leading>
            <PhWarningCircle :size="16" />
          </template>
          This field is required
        </LbHintText>
        
        <LbHintText success>
          <template #icon-leading>
            <PhCheckCircle :size="16" />
          </template>
          Email verified successfully
        </LbHintText>
        
        <LbHintText warning>
          <template #icon-leading>
            <PhWarning :size="16" />
          </template>
          Password strength: weak
        </LbHintText>
        
        <LbHintText>
          <template #icon-leading>
            <PhInfo :size="16" />
          </template>
          Default hint text with info icon
        </LbHintText>
      </div>
    </section>

    <!-- Test 6: Dialog with Icons -->
    <section>
      <h2>Dialog with Icons</h2>
      <p>Modal dialog with icon integration</p>
      
      <LbButton variant="filled" color="info" @click="showDialog = true">
        <template #icon-leading>
          <PhInfo :size="20" />
        </template>
        Show Dialog
      </LbButton>
      
      <LbDialog v-model="showDialog" title="Confirm Action">
        <template #close>
          <PhX :size="24" />
        </template>
        
        <div class="dialog-content">
          <PhWarningCircle :size="48" color="var(--color-warning)" />
          <p>Are you sure you want to delete this item?</p>
        </div>
        
        <template #footer>
          <LbButton variant="ghost" color="secondary" @click="showDialog = false">
            Cancel
          </LbButton>
          <LbButton variant="filled" color="error" @click="handleDelete">
            <template #icon-leading>
              <PhTrash :size="20" />
            </template>
            Delete
          </LbButton>
        </template>
      </LbDialog>
    </section>

    <!-- Test 7: Icon Sizing -->
    <section>
      <h2>Icon Size Tests</h2>
      <p>Icons should scale appropriately with button sizes</p>
      
      <div class="button-group">
        <LbButton size="small" variant="filled" color="primary">
          <template #icon-leading>
            <PhHeart :size="16" />
          </template>
          Small
        </LbButton>
        
        <LbButton size="medium" variant="filled" color="primary">
          <template #icon-leading>
            <PhHeart :size="20" />
          </template>
          Medium
        </LbButton>
        
        <LbButton size="large" variant="filled" color="primary">
          <template #icon-leading>
            <PhHeart :size="24" />
          </template>
          Large
        </LbButton>
      </div>
    </section>

    <!-- Test 8: Theme Color Inheritance -->
    <section>
      <h2>Theme Color Tests</h2>
      <p>Icons inherit colors from their parent components</p>
      
      <div class="theme-demo">
        <div class="theme-group">
          <h3>Default Theme</h3>
          <p>Icons automatically use the button's text color</p>
          <LbButton variant="filled" color="primary">
            <template #icon-leading>
              <PhSun :size="20" weight="fill" />
            </template>
            Icons inherit colors
          </LbButton>
        </div>
        
        <div class="theme-group custom-theme">
          <h3>Custom CSS Variables</h3>
          <p>The custom-theme class overrides color variables</p>
          <LbButton variant="filled" color="primary">
            <template #icon-leading>
              <PhMoon :size="20" weight="duotone" />
            </template>
            Custom theme colors
          </LbButton>
          <LbButton variant="outline" color="secondary">
            <template #icon-leading>
              <PhStar :size="20" />
            </template>
            Custom secondary
          </LbButton>
        </div>
      </div>
    </section>

    <!-- Test 9: Dark Mode Support -->
    <section>
      <h2>Dark Mode Behavior</h2>
      <p>Components automatically adapt to light/dark themes</p>
      
      <div class="dark-mode-demo">
        <p>Current theme: <strong>{{ isDark ? 'Dark' : 'Light' }}</strong></p>
        
        <div class="demo-group">
          <h3>Form Elements</h3>
          <LbFormField>
            <LbLabel for="theme-input">Example Input</LbLabel>
            <LbInput 
              id="theme-input" 
              placeholder="Notice background and border colors"
            />
          </LbFormField>
          
          <LbFormField>
            <LbLabel for="theme-select">Example Select</LbLabel>
            <LbSelect 
              id="theme-select" 
              v-model="themeSelectValue"
              placeholder="Select an option"
            >
              <option value="auto">Auto (System)</option>
              <option value="light">Always Light</option>
              <option value="dark">Always Dark</option>
              <option value="custom">Custom Theme</option>
            </LbSelect>
          </LbFormField>
        </div>
        
        <div class="demo-group">
          <h3>Color Variants</h3>
          <div class="button-group">
            <LbButton variant="filled" color="primary">Primary</LbButton>
            <LbButton variant="tonal" color="secondary">Secondary</LbButton>
            <LbButton variant="outline" color="success">Success</LbButton>
            <LbButton variant="ghost" color="warning">Warning</LbButton>
          </div>
        </div>
        
        <div class="demo-group">
          <h3>Surface Elements</h3>
          <div class="surface-demo">
            <p>This box uses var(--color-surface) which changes in dark mode</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Import all needed Phosphor icons
import { 
  PhDownload,
  PhGear,
  PhTrash,
  PhMagnifyingGlass,
  PhEnvelope,
  PhCheck,
  PhCaretDown,
  PhWarningCircle,
  PhCheckCircle,
  PhWarning,
  PhInfo,
  PhX,
  PhHeart,
  PhSun,
  PhMoon,
  PhStar
} from '@phosphor-icons/vue'

// Dark mode state
const isDark = ref(false)

// Component state
const searchValue = ref('')
const emailValue = ref('')
const selectedCountry = ref('')
const selectedLanguage = ref('')
const showDialog = ref(false)
const username = ref('')
const password = ref('')
const comments = ref('')
const passwordError = ref('')
const themeSelectValue = ref('auto')

// Computed
const emailValid = computed(() => {
  return emailValue.value.includes('@') && emailValue.value.includes('.')
})

// Methods
const handleDelete = () => {
  console.log('Delete confirmed')
  showDialog.value = false
}

const validatePassword = () => {
  if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters'
  } else {
    passwordError.value = ''
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

// Initialize theme on mount
onMounted(() => {
  // Check for user's system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})
</script>

<style scoped>
.test-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: var(--color-background);
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

section {
  margin-bottom: 3rem;
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
}

h1 {
  color: var(--color-text);
  margin: 0;
}

h2 {
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

h3 {
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

p {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

/* Layout helpers */
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hint-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.theme-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.theme-group {
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

/* Custom theme override example */
.custom-theme {
  --color-primary: #8b5cf6;
  --color-primary-hover: #7c3aed;
  --color-secondary: #ec4899;
  --color-secondary-hover: #db2777;
}

/* Dialog content styling */
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 2rem 0;
}

/* Dark mode demo styles */
.dark-mode-demo {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.demo-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.surface-demo {
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.surface-demo p {
  margin: 0;
  color: var(--color-text-secondary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .theme-demo {
    grid-template-columns: 1fr;
  }
  
  .test-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .test-header h1 {
    margin-bottom: 0.5rem;
  }
}
</style>
```

### Step 7: Add NPM Script and Run

First, add a dev script to your package.json:
```bash
# Open package.json and add this to the "scripts" section:
# "dev": "vite"

# Or use this command to add it automatically:
npm pkg set scripts.dev="vite"
```

Now run the test application:
```bash
# Start the development server
npm run dev
```

This will start Vite and show you a URL (usually http://localhost:5173). Open this in your browser to see your test application.

### Step 8: Verify Everything Works

You should see:
1. Various buttons with Phosphor icons
2. Form inputs with icon slots
3. Interactive components
4. All styles from LittleBrand UI Kit applied

If you see errors:
- Check that you ran `npm run build` in the UI kit directory
- Verify `npm link` was successful in both directories
- Make sure all dependencies installed correctly

## What to Test

### 1. Icon Slot Integration
- ✅ Icons render correctly in slots
- ✅ Icons align properly with text
- ✅ Icon colors inherit from parent component

### 2. Sizing & Alignment
- ✅ Icons scale appropriately with component sizes
- ✅ CSS Grid maintains proper spacing
- ✅ No layout shifts when adding/removing icons

### 3. Accessibility
- ✅ Icons don't interfere with keyboard navigation
- ✅ Screen readers ignore decorative icons
- ✅ Interactive icons have proper labels

### 4. Performance
- ✅ Tree-shaking works (only imported icons included)
- ✅ No style conflicts
- ✅ Smooth animations/transitions

### 5. Dark Mode
- ✅ Icons adapt to theme changes
- ✅ Icon colors remain visible in all themes

## Expected Results

If the UI kit is well-designed, you should see:

1. **Easy Integration**: Icons work immediately in slots without additional configuration
2. **Consistent Styling**: Icons automatically match component colors and themes
3. **Flexible Sizing**: Icons can be sized independently while maintaining alignment
4. **No CSS Conflicts**: Phosphor's styles don't interfere with component styles
5. **Good Performance**: Only used icons are bundled

## Common Integration Patterns

### Icon-Only Button
```vue
<LbButton variant="ghost" aria-label="Settings">
  <PhGear :size="24" />
</LbButton>
```

### Loading State
```vue
<LbButton :loading="isLoading">
  <template #icon-leading v-if="!isLoading">
    <PhCloudArrowUp :size="20" />
  </template>
  Upload
</LbButton>
```

### Dynamic Icons
```vue
<LbHintText :error="hasError" :success="!hasError">
  <template #icon-leading>
    <component 
      :is="hasError ? PhXCircle : PhCheckCircle" 
      :size="16" 
    />
  </template>
  {{ message }}
</LbHintText>
```

## Troubleshooting

### Icons Not Showing
- Check if Phosphor Icons is installed
- Verify icon imports are correct
- Ensure slot names match component specs

### Alignment Issues
- Use consistent icon sizes for each component size
- Check CSS Grid gap values
- Verify icon vertical alignment

### Color Problems
- Icons should use `currentColor` by default
- Check CSS custom properties are inherited
- Use `color` prop for specific colors

## Conclusion

This test validates that LittleBrand UI Kit:
- Has flexible slot-based architecture
- Works seamlessly with third-party icon libraries
- Maintains consistent styling and alignment
- Provides good developer experience

Save test results and feedback for future improvements!