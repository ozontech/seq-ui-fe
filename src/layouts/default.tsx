import { MoonIcon, SunMedium } from 'lucide-vue-next'
import { defineComponent } from "vue"
import { useDark, useToggle } from "@vueuse/core"
import { Button } from '@/ui'
import { RouterLink } from 'vue-router'

export const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup(_props, { slots }) {
    const dark = useDark()
    const toggleTheme = useToggle(dark)

    return () => (
      <div class="w-full h-[100dvh] flex flex-col gap-[20px] p-[20px]">
        <div class="flex justify-between items-center border-1 rounded-md p-[4px] pl-[12px]">
          <RouterLink to="/">SeqUI</RouterLink>
          <Button
            variant={'ghost'}
            size={'icon'}
            whenClick={() => toggleTheme()}
            >{ dark.value ? <SunMedium/> : <MoonIcon/> }
          </Button>
          </div>
        { slots.default?.() }
      </div>
    )
  }
})
