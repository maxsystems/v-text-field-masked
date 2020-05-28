import Vue from 'vue'
import { VTextField } from 'vuetify/lib'

import maskable from './mixin'

// @see https://github.com/vuetifyjs/vuetify/commit/0cecd4a5dc3aed38470ba2a5cf4ab6672d306ac1
export default Vue.extend({
  name: 'VTextFieldMasked',
  extends: VTextField,
  mixins: [maskable],
  computed: {
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        if (this.mask && val !== this.lazyValue) {
          this.lazyValue = this.unmaskText(this.maskText(this.unmaskText(val)))
          this.setSelectionRange()
          return
        }

        this.lazyValue = val
        this.$emit('input', this.lazyValue)
      }
    }
  },
  watch: {
    value (val) {
      if (!this.mask || this.internalChange) {
        this.lazyValue = val
        return
      }

      const masked = this.maskText(this.unmaskText(val))
      this.lazyValue = this.unmaskText(masked)

      // Emit when the externally set value was modified internally
      String(val) !== this.lazyValue && this.$nextTick(() => {
        this.$refs.input.value = masked
        this.$emit('input', this.lazyValue)
      })
    }
  },
  methods: {
    genInput () {
      const input = VTextField.options.methods.genInput.call(this)
      input.data.domProps.value = this.maskText(this.lazyValue)
      input.data.attrs.maxlength = this.mask ? this.masked.length : undefined

      return input
    },
    onInput (event) {
      VTextField.options.methods.onInput.call(this, event)
      this.mask && this.resetSelections(event.target)
    }
  }
})
