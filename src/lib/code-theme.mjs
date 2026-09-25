// Syntax colors from the original template's code blocks, as a Shiki theme.
export const templateCode = {
  name: 'template-dark',
  type: 'dark',
  colors: { 'editor.background': '#1d1d1f', 'editor.foreground': '#f5f5f7' },
  tokenColors: [
    { scope: ['keyword.operator', 'punctuation'], settings: { foreground: '#f5f5f7' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#7f8c98' } },
    { scope: ['keyword', 'storage', 'constant.language', 'variable.language'], settings: { foreground: '#ff7ab2' } },
    { scope: ['string', 'punctuation.definition.string'], settings: { foreground: '#ff8170' } },
    { scope: ['constant.numeric'], settings: { foreground: '#d9c97c' } },
    { scope: ['entity.name.function', 'support.function'], settings: { foreground: '#67b7a4' } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'], settings: { foreground: '#dabaff' } }
  ]
};
