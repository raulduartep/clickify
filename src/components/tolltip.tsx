import { PopperContentProps } from '@radix-ui/react-popover'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

type TProps = {
  children: React.ReactNode
  sideOffset?: number
  side?: PopperContentProps['side']
  align?: PopperContentProps['align']
  content?: string
  delay?: number
}

export const Tooltip = ({ children, sideOffset = 4, content, delay, side = 'bottom', align = 'center' }: TProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={delay}>
        <TooltipPrimitive.TooltipTrigger asChild>{children}</TooltipPrimitive.TooltipTrigger>

        {content && (
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            align={align}
            className="z-50 overflow-hidden max-w-xs font-medium rounded-md border-grey-600 bg-grey-900 px-3 py-1.5 text-sm text-grey-100 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            {content}
          </TooltipPrimitive.Content>
        )}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
