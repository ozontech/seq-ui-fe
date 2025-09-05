import { styleTags, tags } from '@lezer/highlight'

export const languageHighLight = styleTags({
  Key: tags.keyword,
  QuotedValue: tags.string,
  UnquotedValue: tags.variableName,
  Eq: tags.operator,
  Or: tags.operator,
  And: tags.operator,
  Not: tags.operator,
  In: tags.operator,
  Exists: tags.operator,
  DirtyOperator: tags.invalid,

  '( )': tags.paren,
  '[ ]': tags.squareBracket,
  '{ }': tags.brace,
  '⚠': tags.invalid,
})
