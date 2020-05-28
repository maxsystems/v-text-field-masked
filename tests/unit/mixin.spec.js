import { mount } from '@vue/test-utils'

import Maskable from '../../src/mixin'

const Mock = Maskable.extend({
  render: h => h('div')
})

describe('Maskable', () => {
  const mountFunction = options => mount(Mock, options)

  it('should reset selections', async () => {
    const wrapper = mountFunction({
      render (h) {
        return h('input', {
          domProps: {
            value: this.value
          }
        })
      },
      propsData: {
        mock: 'credit-card',
        value: '632'
      }
    })

    const input = wrapper.find('input')

    // no selection end
    wrapper.vm.resetSelections(input.element)
    expect(wrapper.vm.selection).toBe(0)
    expect(wrapper.vm.lazySelection).toBe(0)

    input.element.selectionEnd = 3

    wrapper.vm.resetSelections(input.element)

    expect(wrapper.vm.selection).toBe(3)
    expect(wrapper.vm.lazySelection).toBe(3)
  })

  it('should set selection range', async () => {
    const wrapper = mountFunction({
      propsData: {
        mask: 'credit-card',
        value: '4444'
      },
      render (h) {
        return h('input', {
          ref: 'input',
          domProps: {
            value: this.value
          }
        })
      }
    })

    const input = wrapper.vm.$refs.input
    wrapper.setData({ lazySelection: 4 })
    wrapper.vm.setSelectionRange()

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selection).toBe(4)
    expect(wrapper.vm.lazySelection).toBe(0)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(input.selectionStart).toBe(4)
    expect(input.selectionEnd).toBe(4)

    input.value = ''
    wrapper.vm.setSelectionRange()

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selection).toBe(0)
    expect(wrapper.vm.lazySelection).toBe(0)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(0)
  })
})
