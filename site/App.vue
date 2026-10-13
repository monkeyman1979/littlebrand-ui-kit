<template lang="pug">
#site
  a.skip-link(href="#main") Skip to reference
  header.site-header
    .container.header-inner
      a.brand(href="#top" aria-label="LittleBrand reference home") LittleBrand
      nav(aria-label="Page sections")
        a(href="#components") Components
        a(href="#tokens") Tokens
        a(href="#installation") Install
      span.release-pill Source preview · not published

  main#main
    section#top.hero(aria-labelledby="hero-title")
      .container.hero-inner
        span.eyebrow Verified slice / v{{ reference.schemaVersion }}
        h1#hero-title Good interfaces start with a known contract.
        p.lead A small, inspectable Vue reference. See the component working, read its API, then copy the same example the checks exercise.
        .hero-links
          a.jump(href="#components") Explore components →
          a(href="/reference/v1/ai-index.md") Compact AI index
        p.source-note The published npm 0.8.3 package has not been refreshed with this source work. This site is a local preview, not a release or an accessibility certification.

    section#components.catalog(aria-labelledby="catalog-title")
      .container
        .section-heading
          span.eyebrow 01 / choose by intent
          h2#catalog-title Six complete starting points.
          p Browse by what you need to do. SegmentButtonItem belongs inside SegmentButton; it is not a standalone example.
        .component-index(aria-label="Verified components")
          a.component-link(v-for="item in standalone" :key="item.id" :href="`#${item.id}`" :aria-current="active.id === item.id ? 'page' : undefined")
            span.index-name {{ item.name }}
            span.index-intent {{ item.purpose }}
            span.index-arrow(aria-hidden="true") ↗

    section.reference(:id="active.id" aria-labelledby="reference-title")
      .container.reference-body
        .reference-intro
          span.eyebrow 02 / source-checked details
          h2#reference-title(tabindex="-1") {{ active.name }}
          p {{ active.purpose }}
          .related(v-if="active.related.length")
            span Related
            a(v-for="id in active.related" :key="id" :href="idLink(id)") {{ id.replace(/^(component:|token:)/, '') }}
        .reference-columns
          .preview-column
            .preview-bar
              h3 Live preview
              span {{ active.id }}
            fieldset.preview-options(v-if="active.name === 'LbButton'")
              legend Try verified states
              label
                input(type="checkbox" v-model="buttonDisabled")
                | Disabled
              label
                input(type="checkbox" v-model="buttonLoading")
                | Loading
            fieldset.preview-options(v-else-if="active.name === 'LbInput'")
              legend Try verified states
              label
                input(type="checkbox" v-model="inputInvalid")
                | Invalid
              label
                input(type="checkbox" v-model="inputDisabled")
                | Disabled
            fieldset.preview-options(v-else-if="active.name === 'LbTextarea'")
              legend Try verified states
              label
                input(type="checkbox" v-model="textareaInvalid")
                | Invalid
              label
                input(type="checkbox" v-model="textareaDisabled")
                | Disabled
              label
                input(type="checkbox" v-model="textareaAutoResize")
                | Auto resize
            fieldset.preview-options(v-else-if="active.name === 'LbFormField'")
              legend Try verified states
              label
                input(type="checkbox" v-model="fieldRequired")
                | Required
            fieldset.preview-options(v-else-if="active.name === 'LbDialog'")
              legend Try verified states
              label
                input(type="checkbox" v-model="dialogFullscreen")
                | Fullscreen
            fieldset.preview-options(v-else)
              legend Try verified states
              label
                input(type="checkbox" v-model="segmentDisabled")
                | Disabled
            .preview-surface
              template(v-if="active.name === 'LbButton'")
                LbButton(:disabled="buttonDisabled" :loading="buttonLoading" @click="saved = true") Save changes
                p.preview-status(role="status" v-if="saved") Saved
              template(v-else-if="active.name === 'LbInput'")
                label(for="site-email") Email
                LbInput(id="site-email" v-model="email" type="email" name="email" autocomplete="email" required clearable :invalid="inputInvalid" :disabled="inputDisabled")
                p.preview-status(role="status") Value: {{ email || 'empty' }}
              template(v-else-if="active.name === 'LbTextarea'")
                label(for="site-notes") Notes
                LbTextarea(id="site-notes" v-model="notes" name="notes" aria-describedby="site-notes-help" :invalid="textareaInvalid" :disabled="textareaDisabled" :auto-resize="textareaAutoResize" :max-rows="5")
                p#site-notes-help Optional notes.
              template(v-else-if="active.name === 'LbFormField'")
                LbFormField(label="Biography" hint="Tell us a little about yourself." :error="fieldError" :required="fieldRequired")
                  LbTextarea(v-model="fieldValue" name="biography" :invalid="Boolean(fieldError)" :required="fieldRequired")
                LbButton(@click="fieldError = fieldValue.trim() ? '' : 'Biography is required'") Validate
              template(v-else-if="active.name === 'LbDialog'")
                LbButton(@click="dialogOpen = true") Open preferences
                LbDialog(v-model="dialogOpen" title="Preferences" :variant="dialogFullscreen ? 'fullscreen' : 'default'")
                  p Choose your preferences.
                  template(#footer)
                    LbButton(@click="dialogOpen = false") Done
              template(v-else)
                LbSegmentButton(v-model="choice" :allow-empty="false" :disabled="segmentDisabled" aria-label="Frequency")
                  LbSegmentButtonItem(value="daily") Daily
                  LbSegmentButtonItem(value="weekly") Weekly
                p.preview-status(role="status") Selected: {{ choice }}
            .guidance
              div
                h3 When to use
                p {{ active.use }}
              div
                h3 Avoid
                p {{ active.avoid }}
              div
                h3 Accessibility
                p {{ active.accessibility }}
            .states
              h3 States to check
              ul
                li(v-for="state in active.states" :key="state") {{ state }}
          .code-column
            .code-bar
              h3 Tested Vue example
              button.copy(type="button" @click="copyExample") {{ copyLabel }}
            pre
              code {{ active.usage }}
            p.copy-status(role="status" aria-live="polite") {{ copyStatus }}
            a.md-link(:href="`/reference/v1/components/${active.name}.md`") Read standalone Markdown →
        .api
          .api-heading
            h3 Props &amp; events
            p Derived from the verified implementation and declarations. Optional boolean defaults are false unless shown otherwise.
          .table-scroll
            table
              caption {{ active.name }} props
              thead
                tr
                  th(scope="col") Prop
                  th(scope="col") Type
                  th(scope="col") Default
              tbody
                tr(v-for="prop in active.props" :key="prop.name")
                  th(scope="row")
                    code {{ prop.name }}
                  td
                    code {{ prop.type }}
                  td {{ prop.required ? 'required' : prop.default ?? '—' }}
          p.api-meta Slots: {{ active.slots.join(', ') || 'none' }} · Events: {{ active.emits.join(', ') || 'none' }}
          p.api-meta(v-if="active.name === 'LbSegmentButton'") Compound child:
            a(href="/reference/v1/components/LbSegmentButtonItem.md") &nbsp;LbSegmentButtonItem API
            |  — must be nested inside the parent.

    section#tokens.token-section(aria-labelledby="tokens-title")
      .container
        .section-heading
          span.eyebrow 03 / semantic tokens
          h2#tokens-title Color has a job to do.
          p A selected set used by the verified slice. Light and dark values come from the same semantic names; a swatch is not a contrast guarantee.
        .theme-controls
          fieldset
            legend Preview color scheme
            button(v-for="mode in modes" :key="mode" type="button" :aria-pressed="scheme === mode" @click="setScheme(mode)") {{ mode }}
          fieldset
            legend Preview brand palette
            button(v-for="palette in palettes" :key="palette.name" type="button" :aria-pressed="brand === palette.name" @click="setBrand(palette)") {{ palette.name }}
        ul.token-list
          li(v-for="token in reference.tokens" :key="token.id" :id="token.id")
            span.swatch(:style="tokenStyle(token.name)" aria-hidden="true")
            .token-copy
              code {{ token.name }}
              p {{ token.purpose }}
            button.token-copy-button(type="button" :aria-label="`Copy ${token.name}`" @click="copyText(token.name, `Copied ${token.name}`)") Copy
        p.copy-status(role="status" aria-live="polite") {{ copyStatus }}
        a.md-link(href="/reference/v1/TOKENS.md") Token Markdown →

    section#installation.install(aria-labelledby="install-title")
      .container.install-inner
        span.eyebrow 04 / start here
        h2#install-title Keep installation ordinary.
        p npm is the primary distribution path. Use the package root for Vue components and import its CSS once in your host app; no deep imports or source registry are required.
        pre
          code npm install littlebrand-ui-kit
        pre
          code {{ installVue }}
        p.source-note These source examples are ahead of the published 0.8.3 artifact. Verify the exact future package before relying on its types, MCP server, or theme changes.
        a(href="/reference/v1/README.md") Human-readable reference index →
  footer.site-footer
    .container
      span LittleBrand · source reference {{ reference.packageVersion }}
      a(href="/reference/v1/ai-index.md") Agent index
      a(href="https://github.com/monkeyman1979/littlebrand-ui-kit") Source repository
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { LbButton, LbInput, LbTextarea, LbFormField, LbDialog, LbSegmentButton, LbSegmentButtonItem } from '../src/components'
import { applyTheme } from '../src/utils/color-generator.js'
import reference from '../reference/v1.json'

const standalone = reference.components.filter(item => !item.compoundOnly)
const currentId = ref('component:LbButton')
const active = computed(() => standalone.find(item => item.id === currentId.value) ?? standalone[0])
const saved = ref(false)
const buttonDisabled = ref(false)
const buttonLoading = ref(false)
const email = ref('')
const inputInvalid = ref(false)
const inputDisabled = ref(false)
const notes = ref('')
const textareaInvalid = ref(false)
const textareaDisabled = ref(false)
const textareaAutoResize = ref(false)
const fieldValue = ref('')
const fieldError = ref('')
const fieldRequired = ref(true)
const dialogOpen = ref(false)
const dialogFullscreen = ref(false)
const choice = ref<string | number>('daily')
const segmentDisabled = ref(false)
const scheme = ref('system')
const brand = ref('default')
const modes = ['system', 'light', 'dark']
const basePalette = {
  secondary: '#00bfa5', success: '#22c55e', warning: '#f59e0b',
  error: '#ef4444', info: '#3b82f6', neutral: '#6b7280'
}
const palettes = [
  { name: 'default', colors: { ...basePalette, primary: '#ff8800' } },
  { name: 'cobalt', colors: { ...basePalette, primary: '#405fe7' } },
  { name: 'berry', colors: { ...basePalette, primary: '#ac498e' } }
]
const installVue = "import { LbButton } from 'littlebrand-ui-kit'\nimport 'littlebrand-ui-kit/style.css'"
const copyStatus = ref('')
const copyLabel = computed(() => copyStatus.value === 'Example copied' ? 'Copied' : 'Copy example')
async function syncHash() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (!standalone.some(item => item.id === id)) return
  currentId.value = id
  await nextTick()
  document.getElementById(id)?.scrollIntoView()
  document.getElementById('reference-title')?.focus({ preventScroll: true })
}
function setScheme(mode: string) {
  scheme.value = mode
  if (mode === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = mode
}
function setBrand(palette: typeof palettes[number]) {
  brand.value = palette.name
  applyTheme(palette.colors)
}
function tokenStyle(name: string) { return { backgroundColor: `var(${name})` } }
function idLink(id: string) { return id.startsWith('component:') ? `#${id}` : '#tokens' }
async function copyText(text: string, success: string) {
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = success
  } catch {
    copyStatus.value = 'Clipboard unavailable. Select the text to copy it.'
  }
}
function copyExample() { return copyText(active.value.usage, 'Example copied') }
onMounted(() => { syncHash(); window.addEventListener('hashchange', syncHash) })
onUnmounted(() => window.removeEventListener('hashchange', syncHash))
</script>

<style lang="sass" scoped>
@use '../src/styles/base' as base

#site
  min-height: 100vh
  background: var(--lb-surface-base)
  color: var(--lb-text-neutral-normal)
  font-family: var(--lb-font-body)
  line-height: 1.5
  scroll-behavior: smooth

.container
  display: flex
  flex-direction: column
  width: min(100%, 76rem)
  gap: base.$space-lg

h1, h2, h3
  text-wrap: balance
  line-height: 1.18

p
  width: min(100%, 65ch)

button, a
  &:focus-visible
    outline: base.$focus-ring-width solid var(--lb-focus-ring-color)
    outline-offset: base.$focus-ring-offset

a
  color: var(--lb-text-primary-normal)

.site-header, .site-footer
  display: flex
  justify-content: center
  padding: base.$space-lg clamp(1rem, calc(.5rem + 2vw), 2rem)
  background: var(--lb-surface-subtle)
  border-bottom: base.$border-sm solid var(--lb-border-neutral-line)

.header-inner, .site-footer .container
  flex-direction: row
  flex-wrap: wrap
  align-items: center
  justify-content: space-between
  gap: base.$space-lg

.brand
  color: var(--lb-text-neutral-contrast-high)
  font-size: 1.2rem
  font-weight: 700
  text-decoration: none

nav, .hero-links, .related
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: base.$space-lg

.release-pill, .eyebrow
  font-size: .75rem
  font-weight: 700
  letter-spacing: .08em
  text-transform: uppercase

.release-pill
  padding: base.$space-xs base.$space-md
  border: base.$border-sm solid var(--lb-border-neutral-line)
  border-radius: base.$radius-full

section
  display: flex
  flex-direction: column
  align-items: center
  width: 100%
  padding: clamp(2rem, calc(1rem + 2vw), 4rem) clamp(1rem, calc(.5rem + 2vw), 2rem)

.hero
  padding-block: clamp(4rem, calc(3rem + 4vw), 8rem)
  background: var(--lb-surface-primary-subtle)

.hero-inner
  gap: base.$space-2xl

.hero h1
  width: min(100%, 18ch)
  font-size: clamp(2.5rem, calc(1.5rem + 3vw), 5rem)

.lead
  font-size: clamp(1.125rem, calc(1rem + .6vw), 1.5rem)

.source-note
  font-size: .875rem
  color: var(--lb-text-neutral-contrast-low)

.jump, .md-link
  display: inline-flex
  align-items: center
  padding: base.$space-sm base.$space-md
  border: base.$border-sm solid var(--lb-border-primary-normal)
  border-radius: base.$radius-sm
  text-decoration: none

.section-heading, .reference-intro, .guidance, .preview-column, .code-column, .api, .install-inner
  display: flex
  flex-direction: column
  gap: base.$space-lg

.section-heading h2, .reference-intro h2, .install h2
  font-size: clamp(1.8rem, calc(1.3rem + 1.5vw), 2.8rem)

.component-index
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr))
  gap: base.$space-md
  width: 100%

.component-link
  display: flex
  flex-direction: column
  gap: base.$space-sm
  padding: base.$space-xl
  border: base.$border-sm solid var(--lb-border-neutral-line)
  border-radius: base.$radius-md
  background: var(--lb-surface-subtle)
  color: var(--lb-text-neutral-normal)
  text-decoration: none

  &[aria-current='page']
    border-color: var(--lb-border-primary-active)
    background: var(--lb-surface-primary-subtle)

.index-name
  font-size: 1.25rem
  font-weight: 700

.index-intent
  width: min(100%, 36ch)

.index-arrow
  align-self: flex-end
  color: var(--lb-text-primary-normal)

.reference
  background: var(--lb-surface-subtle)

.reference-body
  gap: base.$space-3xl

.reference-columns
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 1fr))
  gap: base.$space-3xl

.preview-column, .code-column, .api
  min-width: 0

.preview-bar, .code-bar, .api-heading
  display: flex
  align-items: center
  justify-content: space-between
  flex-wrap: wrap
  gap: base.$space-md

.preview-bar span
  font-family: var(--lb-font-mono)
  font-size: .75rem

.preview-options label
  display: inline-flex
  align-items: center
  gap: base.$space-sm
  padding: base.$space-xs

.preview-surface
  display: flex
  flex-direction: column
  justify-content: center
  align-items: flex-start
  gap: base.$space-lg
  min-height: 13rem
  padding: clamp(1rem, calc(.7rem + 1vw), 2rem)
  border: base.$border-sm solid var(--lb-border-neutral-line)
  border-radius: base.$radius-md
  background: var(--lb-surface-base)

.preview-status, .copy-status
  min-height: 1.5rem
  font-size: .875rem

.guidance
  gap: base.$space-2xl

.guidance > div, .states
  display: flex
  flex-direction: column
  gap: base.$space-xs

.states ul
  display: flex
  flex-wrap: wrap
  gap: base.$space-sm
  padding: 0
  list-style: none

.states li
  padding: base.$space-xs base.$space-sm
  border-radius: base.$radius-sm
  background: var(--lb-surface-primary-normal)

.copy, .token-copy-button, .theme-controls button
  padding: base.$space-sm base.$space-md
  border: base.$border-sm solid var(--lb-border-neutral-normal)
  border-radius: base.$radius-sm
  background: var(--lb-surface-base)
  color: var(--lb-text-neutral-normal)
  cursor: pointer

pre
  width: 100%
  overflow-x: auto
  padding: base.$space-lg
  border-radius: base.$radius-sm
  background: var(--lb-surface-neutral-normal)
  color: var(--lb-text-neutral-contrast-high)
  font-family: var(--lb-font-mono)
  font-size: .875rem
  white-space: pre

.api
  border-top: base.$border-sm solid var(--lb-border-neutral-line)
  padding-top: base.$space-2xl

.table-scroll
  overflow-x: auto

table
  width: 100%
  border-collapse: collapse
  text-align: left

th, td
  padding: base.$space-sm base.$space-md
  border-bottom: base.$border-sm solid var(--lb-border-neutral-line)
  vertical-align: top

caption
  text-align: left
  font-weight: 700

.api-meta
  overflow-wrap: anywhere

.token-section .container
  gap: base.$space-2xl

.theme-controls
  display: flex
  flex-wrap: wrap
  gap: base.$space-2xl

fieldset
  display: flex
  flex-wrap: wrap
  gap: base.$space-xs
  padding: base.$space-md
  border: base.$border-sm solid var(--lb-border-neutral-line)
  border-radius: base.$radius-md

legend
  font-weight: 700

.theme-controls button[aria-pressed='true']
  background: var(--lb-surface-primary-active)
  border-color: var(--lb-border-primary-active)

.token-list
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 23rem), 1fr))
  gap: base.$space-md
  padding: 0
  list-style: none

.token-list li
  display: flex
  align-items: center
  gap: base.$space-md
  min-width: 0
  padding: base.$space-md
  border: base.$border-sm solid var(--lb-border-neutral-line)
  border-radius: base.$radius-sm

.swatch
  flex: none
  width: 2.5rem
  height: 2.5rem
  border-radius: base.$radius-sm
  border: base.$border-sm solid var(--lb-border-neutral-line)

.token-copy
  display: flex
  flex-direction: column
  gap: base.$space-xs
  min-width: 0

.token-copy code
  overflow-wrap: anywhere

.token-copy p
  font-size: .875rem

.token-copy-button
  flex: none

.install
  background: var(--lb-surface-primary-subtle)

.install-inner
  gap: base.$space-xl

.site-footer
  border-top: base.$border-sm solid var(--lb-border-neutral-line)

.skip-link
  position: fixed
  inset: base.$space-sm auto auto base.$space-sm
  padding: base.$space-sm
  background: var(--lb-surface-base)
  z-index: 50
  transform: translateY(-150%)

  &:focus
    transform: translateY(0)

@media (prefers-reduced-motion: reduce)
  #site
    scroll-behavior: auto
</style>
