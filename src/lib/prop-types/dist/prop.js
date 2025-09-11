function prop(validator) {
  const withValidator = validator !== void 0 ? { validator } : {};
  function optional(value) {
    if (value !== void 0) {
      return {
        type: null,
        default: () => value,
        ...withValidator
      };
    }
    return {
      type: null,
      ...withValidator
    };
  }
  function required() {
    return {
      type: null,
      required: true,
      ...withValidator
    };
  }
  return {
    optional,
    required
  };
}
export {
  prop
};
