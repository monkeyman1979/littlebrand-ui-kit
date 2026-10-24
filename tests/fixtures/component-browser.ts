import { createApp, defineComponent, h, ref } from 'vue'
import LbDialog from '../../src/components/Dialog/LbDialog.vue'
import LbButton from '../../src/components/Buttons/Button/LbButton.vue'
import LbInput from '../../src/components/Inputs/Input/LbInput.vue'
import VerifiedSlice from './VerifiedSlice.vue'
import FormFieldExample from '../../reference/examples/form-field.vue'
import '../../src/styles/index.sass'

const emptyOpen = ref(false)
const savedBiographies = ref<string[]>([])
const App = defineComponent({
  setup() {
    return () =>
      h('main', [
        h(VerifiedSlice),
        h('section', { id: 'form-submit-example' }, [
          h(FormFieldExample, {
            onSave: (value: string) => {
              savedBiographies.value = [...savedBiographies.value, value]
            }
          }),
          h('output', { id: 'form-submit-count' }, String(savedBiographies.value.length))
        ]),
        h(
          'button',
          {
            id: 'empty-trigger',
            onClick: () => {
              emptyOpen.value = true
            }
          },
          'Open empty dialog'
        ),
        h(
          LbInput,
          { id: 'icon-input', modelValue: '', 'aria-label': 'Search' },
          {
            'icon-leading': () => h('span', { 'aria-hidden': 'true' }, '●')
          }
        ),
        h(LbButton, { id: 'loading-button', loading: true }, () => 'Saving'),
        h(LbButton, { id: 'warning-button', variant: 'tonal', color: 'warning' }, () => 'Warning'),
        h(
          LbDialog,
          {
            modelValue: emptyOpen.value,
            title: 'No controls',
            showClose: false,
            'onUpdate:modelValue': (value: boolean) => {
              emptyOpen.value = value
            }
          },
          { default: () => h('p', 'Nothing to choose') }
        )
      ])
  }
})
createApp(App).mount('#app')
