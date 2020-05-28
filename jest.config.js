module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  coverageReporters: ['html', 'lcovonly', 'text-summary'],
  moduleNameMapper: {
    '\\.(css|sc?ass)$': 'identity-obj-proxy'
  },
  transformIgnorePatterns: [
    'node_modules/(?!vuetify/lib/)'
  ]
}
