import { prop } from "@fe/prop-types"
import type {
  PrimitiveProps,
  PopoverContentProps,
  PointerDownOutsideEvent,
  FocusOutsideEvent,
  ListboxItemProps,
  ListboxItemEmits,
  ListboxFilterProps,
  PopoverAnchorProps,
  ListboxRootProps,
} from "reka-ui"
import type { HTMLAttributes } from "vue"

export const primitiveProps = {
  as: prop<PrimitiveProps['as']>().optional(),
  asChild: prop<PrimitiveProps['asChild']>().optional(),
  class: prop<HTMLAttributes['class']>().optional(),
}

export const popperContentProps = {
  ...primitiveProps,
  side: prop<PopoverContentProps['side']>().optional(),
  sideOffset: prop<PopoverContentProps['sideOffset']>().optional(),
  sideFlip: prop<PopoverContentProps['sideFlip']>().optional(),
  align: prop<PopoverContentProps['align']>().optional(),
  alignOffset: prop<PopoverContentProps['alignOffset']>().optional(),
  alignFlip: prop<PopoverContentProps['alignFlip']>().optional(),
  avoidCollisions: prop<PopoverContentProps['avoidCollisions']>().optional(),
  collisionBoundary: prop<PopoverContentProps['collisionBoundary']>().optional(),
  collisionPadding: prop<PopoverContentProps['collisionPadding']>().optional(),
  arrowPadding: prop<PopoverContentProps['arrowPadding']>().optional(),
  sticky: prop<PopoverContentProps['sticky']>().optional(),
  hideWhenDetached: prop<PopoverContentProps['hideWhenDetached']>().optional(),
  positionStrategy: prop<PopoverContentProps['positionStrategy']>().optional(),
  updatePositionStrategy: prop<PopoverContentProps['updatePositionStrategy']>().optional(),
  disableUpdateOnLayoutShift: prop<PopoverContentProps['disableUpdateOnLayoutShift']>().optional(),
  prioritizePosition: prop<PopoverContentProps['prioritizePosition']>().optional(),
  reference: prop<PopoverContentProps['reference']>().optional(),
}

export const dismissableLayerProps = {
  ...primitiveProps,
  disableOutsidePointerEvents: prop<boolean>().optional(),
  onEscapeKeyDown: prop<(event: KeyboardEvent) => void>().optional(),
  onPointerDownOutside: prop<(event: PointerDownOutsideEvent) => void>().optional(),
  onFocusOutside: prop<(event: FocusOutsideEvent) => void>().optional(),
  onInteractOutside: prop<(event: PointerDownOutsideEvent | FocusOutsideEvent) => void>().optional(),
}

export const listboxItemProps = {
  ...primitiveProps,
  value: prop<ListboxItemProps['value']>().required(),
  disabled: prop<ListboxItemProps['disabled']>().optional(),
  onSelect: prop<(event: ListboxItemEmits['select'][0]) => void>().optional(),
}

export const listboxFilterProps = {
  ...primitiveProps,
  value: prop<ListboxFilterProps['modelValue']>().optional(),
  autoFocus: prop<ListboxFilterProps['autoFocus']>().optional(),
  disabled: prop<ListboxFilterProps['disabled']>().optional(),
  onChange: prop<(value: string) => void>().optional(),
}

export const popperAnchorProps = {
  ...primitiveProps,
  reference: prop<PopoverAnchorProps['reference']>().optional(),
}

export const formFieldProps = {
  name: prop<string>().optional(),
  required: prop<boolean>().optional(),
}

export const listboxRootProps = {
  ...primitiveProps,
  ...formFieldProps,
  value: prop<ListboxRootProps['modelValue']>().required(),
  onChange: prop<(value: ListboxRootProps['modelValue']) => void>().required(),
  defaultValue: prop<ListboxRootProps['defaultValue']>().optional(),
  multiple: prop<ListboxRootProps['multiple']>().optional(),
  orientation: prop<ListboxRootProps['orientation']>().optional(),
  dir: prop<ListboxRootProps['dir']>().optional(),
  disabled: prop<ListboxRootProps['disabled']>().optional(),
  selectionBehavior: prop<ListboxRootProps['selectionBehavior']>().optional(),
  highlightOnHover: prop<ListboxRootProps['highlightOnHover']>().optional(),
  by: prop<ListboxRootProps['by']>().optional(),
  onHighlight: prop<(payload: { ref: HTMLElement, value: ListboxRootProps['modelValue'] }) => void>().optional(),
  onEntryFocus: prop<(event: CustomEvent) => void>().optional(),
  onLeave: prop<(event: Event) => void>().optional(),
}
