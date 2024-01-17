<script>
import { VTextFieldMasked } from '../src'
import { masks } from '../src/mixin'

export default {
  components: {
    VTextFieldMasked
  },
  data: () => ({
    mask: 'phone',
    masks: Object.keys(masks),
    value: 1234567890
  })
}
</script>

<template>
  <VContainer
    class="fill-height"
    fluid
  >
    <VRow
      align="center"
      justify="center"
    >
      <VCol
        cols="12"
        sm="8"
        md="4"
      >
        <VCard>
          <VToolbar
            color="primary"
            dark
            flat
          >
            <VToolbarTitle>VTextFieldMasked</VToolbarTitle>
          </VToolbar>
          <VCardText>
            <VCombobox
              v-model="mask"
              :items="masks"
              class="mb-2"
              hide-details
              label="Available masks"
              outlined
            />
            <VTextFieldMasked
              v-model="value"
              class="mb-4"
              hide-details
              :mask="mask"
              outlined
            />
            <span>
              Value: {{ value }}
            </span>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style>
.v-application.theme--light {
  background: #FAFAFA;
}
</style>
