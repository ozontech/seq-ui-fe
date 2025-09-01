import { ref } from "vue"

export const useTheme = () => {
  const theme = ref('light')

  return {
    theme
  }
}
