import { DrawerRoot, type DrawerRootProps } from "vaul-vue"
import { defineComponent } from "vue"
import { prop } from "@/lib/prop"

const props = {
  activeSnapPoint: prop<DrawerRootProps['activeSnapPoint']>().optional(),
  closeThreshold: prop<DrawerRootProps['closeThreshold']>().optional(),
  defaultOpen: prop<DrawerRootProps['defaultOpen']>().optional(),
  direction: prop<DrawerRootProps['direction']>().optional(),
  dismissible: prop<DrawerRootProps['dismissible']>().optional(),
  fadeFromIndex: prop<DrawerRootProps['fadeFromIndex']>().optional(),
  fixed: prop<DrawerRootProps['fixed']>().optional(),
  handleOnly: prop<DrawerRootProps['handleOnly']>().optional(),
  modal: prop<DrawerRootProps['modal']>().optional(),
  nested: prop<DrawerRootProps['nested']>().optional(),
  noBodyStyles: prop<DrawerRootProps['noBodyStyles']>().optional(),
  open: prop<DrawerRootProps['open']>().optional(),
  preventScrollRestoration: prop<DrawerRootProps['preventScrollRestoration']>().optional(),
  scrollLockTimeout: prop<DrawerRootProps['scrollLockTimeout']>().optional(),
  setBackgroundColorOnScale: prop<DrawerRootProps['setBackgroundColorOnScale']>().optional(),
  shouldScaleBackground: prop<DrawerRootProps['shouldScaleBackground']>().optional(true),
  snapPoints: prop<DrawerRootProps['snapPoints']>().optional(),
  whenAnimationEnd: prop<(open: boolean) => void>().optional(),
  whenClose: prop<() => void>().optional(),
  whenDrag: prop<(percentageDragged: number) => void>().optional(),
  whenRelease: prop<(open: boolean) => void>().optional(),
  whenActiveSnapPointChange: prop<(val: string | number) => void>().optional(),
  whenOpenChange: prop<(open: boolean) => void>().optional(),
}

export const Drawer = defineComponent({
  name: 'BaseDrawer',
  props,
  setup(props, { slots }) {
    return () => (
      <DrawerRoot
        activeSnapPoint={props.activeSnapPoint}
        closeThreshold={props.closeThreshold}
        defaultOpen={props.defaultOpen}
        direction={props.direction}
        dismissible={props.dismissible}
        fadeFromIndex={props.fadeFromIndex}
        fixed={props.fixed}
        handleOnly={props.handleOnly}
        modal={props.modal}
        nested={props.nested}
        noBodyStyles={props.noBodyStyles}
        open={props.open}
        preventScrollRestoration={props.preventScrollRestoration}
        scrollLockTimeout={props.scrollLockTimeout}
        setBackgroundColorOnScale={props.setBackgroundColorOnScale}
        shouldScaleBackground={props.shouldScaleBackground}
        snapPoints={props.snapPoints}
        onAnimationEnd={props.whenAnimationEnd}
        onClose={props.whenClose}
        onDrag={props.whenDrag}
        onRelease={props.whenRelease}
        onUpdate:activeSnapPoint={props.whenActiveSnapPointChange}
        onUpdate:open={props.whenOpenChange}
      >
        {slots.default?.()}
      </DrawerRoot>
    )
  }
})
