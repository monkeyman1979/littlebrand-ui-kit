import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import LbDialog from '../../src/components/Dialog/LbDialog.vue'
import LbButton from '../../src/components/Buttons/Button/LbButton.vue'
import { applyTheme } from '../../src/utils/color-generator.js'
import '../../src/styles/index.sass'

const mode = ref<'light' | 'dark'>('light')
const open = ref(true)
const rootOpen = ref(false)
const App = defineComponent({
  setup() {
    return () => h('div', { id: 'fixture-app' }, [
      h('section', { id: 'preview', 'data-theme': mode.value }, [
        h('div', { id: 'preview-probe' }, 'Preview'),
        h(LbButton, { id: 'focus-button', color: 'primary' }, () => 'Focus'),
        h(LbDialog, { modelValue: open.value, title: 'Theme test' }, {
          default: () => h('span', { id: 'dialog-probe' }, 'Dialog')
        })
      ]),
      h(LbDialog, { modelValue: rootOpen.value, title: 'Document theme' }, {
        default: () => h('span', { id: 'root-dialog-probe' }, 'Root dialog')
      })
    ])
  }
})
createApp(App).mount('#app')
Object.assign(window, { __themeFixture: { mode, open, rootOpen, applyTheme, nextTick } })
