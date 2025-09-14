import { MoonIcon, SunMedium } from 'lucide-vue-next'
import { defineComponent } from "vue"
import { useDark, useToggle } from "@vueuse/core"
import { Button } from '~/ui'
import { RouterLink } from 'vue-router'

export const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup(_props, { slots }) {
    const dark = useDark()
    const toggleTheme = useToggle(dark)

    const renderLogo = () => (
      <div class='flex flex-row'>
        <img src='/images/tech.svg' class={'h-8'}/>
        <div class='py-1 flex flex-col'>
          <img src='/images/ozon.svg' class={'h-2'}/>
          <span class='font-bold text-xs'>&nbsp;seq-ui</span>
        </div>
      </div>
    )

    return () => (
      <div>
        <div class="flex justify-between items-center border-1 p-[4px] pl-[12px]">
          {renderLogo()}
          <Button
            variant={'ghost'}
            size={'icon'}
            whenClick={() => toggleTheme()}
            >{ dark.value ? <SunMedium/> : <MoonIcon/> }
          </Button>
        </div>
        <div class="w-full flex flex-col gap-[20px] p-[20px]">
          { slots.default?.() }
        </div>
      </div>
    )
  }
})
