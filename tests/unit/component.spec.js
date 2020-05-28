import { mount } from '@vue/test-utils'

import VTextFieldMasked from '../../src/component'

describe('VTextFieldMasked', () => {
  const mountFunction = (options) => mount(VTextFieldMasked, options)

  it('should emit input when externally set value was modified internally', async () => {
    let value = '33'
    const input = jest.fn()
    const wrapper = mountFunction({
      propsData: {
        value,
        mask: '##',
        returnMaskedValue: true
      }
    })

    wrapper.vm.$on('input', v => {
      value = v
    })
    wrapper.vm.$on('input', input)

    wrapper.setProps({ value: '4444' })
    await wrapper.vm.$nextTick()

    expect(value).toBe('44')
    expect(input).toHaveBeenCalled()
  })

  it('should not interfere with default behaviour if mask is unspecified', async () => {
    let value = '12345'
    const wrapper = mountFunction({ propsData: { value } })
    const onInput = jest.fn().mockImplementation(v => {
      value = v
    })
    wrapper.vm.$on('input', onInput)

    // Simulate changing the `:value` binding. Since there is no masking enabled
    // the internal value should change but no `@input` event triggered.
    wrapper.setProps({ value: '1234567' })
    await wrapper.vm.$nextTick()
    expect(onInput).not.toHaveBeenCalled()
    expect(wrapper.vm.internalValue).toBe('1234567')

    // Simulate changing the value on the input via user interaction. This should
    // respect the `v-model` binding and trigger `@input` but without masking.
    const input = wrapper.findAll('input').at(0)
    input.trigger('focus')
    await wrapper.vm.$nextTick()
    input.element.value = '1234567890'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    expect(onInput).toHaveBeenCalled()
    expect(wrapper.vm.internalValue).toBe('1234567890')
  })

  it('should mask value if return-masked-value is true', async () => {
    let value = '44'
    const component = {
      render (h) {
        return h(VTextFieldMasked, {
          on: {
            input (i) {
              value = i
            }
          },
          props: {
            value,
            returnMaskedValue: true,
            mask: '#-#'
          }
        })
      }
    }

    const wrapper = mount(component)
    const input = wrapper.findAll('input').at(0)

    expect(value).toBe('4-4')

    input.trigger('focus')
    await wrapper.vm.$nextTick()
    input.element.value = '33'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    expect(value).toBe('3-3')
  })

  it('should not mask value if return-masked-value is false', async () => {
    let value = '44'
    const component = {
      render (h) {
        return h(VTextFieldMasked, {
          on: {
            input (i) {
              value = i
            }
          },
          props: {
            value,
            returnMaskedValue: false,
            mask: '#-#'
          }
        })
      }
    }

    const wrapper = mount(component)
    const input = wrapper.findAll('input').at(0)

    expect(value).toBe('44')

    input.trigger('focus')
    await wrapper.vm.$nextTick()
    input.element.value = '33'
    input.trigger('input')
    await wrapper.vm.$nextTick()

    expect(value).toBe('33')
  })

  it('should use pre-defined mask if prop matches', async () => {
    let value = '12311999'
    const component = {
      render (h) {
        return h(VTextFieldMasked, {
          on: {
            input (i) {
              value = i
            }
          },
          props: {
            value,
            returnMaskedValue: true,
            mask: 'date'
          }
        })
      }
    }

    mount(component)

    expect(value).toBe('12/31/1999')
  })

  it('should allow switching mask', async () => {
    const wrapper = mountFunction({
      propsData: {
        mask: '#-#-#',
        value: '1-2-3'
      }
    })

    const input = wrapper.findAll('input').at(0)

    expect(input.element.value).toBe('1-2-3')

    wrapper.setProps({ mask: '#.#.#' })
    await wrapper.vm.$nextTick()

    expect(input.element.value).toBe('1.2.3')

    wrapper.setProps({ mask: '#,#' })
    await wrapper.vm.$nextTick()

    expect(input.element.value).toBe('1,2')
  })
})
