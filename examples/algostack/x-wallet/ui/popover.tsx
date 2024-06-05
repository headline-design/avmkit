'use client';

import { Dispatch, ReactNode, SetStateAction } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/dashboard/lib/utils';

export default function Popover({
  children,
  content,
  align = 'center',
  openPopover,
  setOpenPopover,
  className,
  side = 'bottom',
  sideOffset,
  alignOffset,
  modal = false,
  onOpenAutoFocus = () => {},
  triggerClassName,
  contentClassName,
  avoidCollisions = true,
  roundedXl,
  anchor,
  tabIndex,
  onWheel,
  container,
  onInteractOutside,
  onFocusOutside,
  onPointerDownOutside,
  style,
  unstyledPopover,
  slot,
}: {
  children: ReactNode;
  content: ReactNode | string;
  align?: 'center' | 'start' | 'end';
  openPopover: boolean;
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
  className?: string;
  mobileClassName?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  alignOffset?: number;
  modal?: boolean;
  onOpenAutoFocus?: any;
  triggerClassName?: string;
  contentClassName?: string;
  avoidCollisions?: boolean;
  roundedXl?: any;
  anchor?: any;
  tabIndex?: number;
  onWheel?: any;
  container?: any;
  onInteractOutside?: any;
  onFocusOutside?: any;
  onPointerDownOutside?: any;
  style?: any;
  unstyledPopover?: boolean;
  slot?: any;
}) {
  return (
    <PopoverPrimitive.Root open={openPopover} onOpenChange={setOpenPopover} modal={modal}>
      {anchor && <PopoverPrimitive.Anchor asChild>{anchor}</PopoverPrimitive.Anchor>}
      {slot}
      <PopoverPrimitive.Trigger
        className={cn('xwallet-ui', triggerClassName)}
        asChild
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
        }}
      >
        <div>{children}</div>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal container={container}>
        <PopoverPrimitive.Content
          tabIndex={tabIndex}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
          }}
          avoidCollisions={avoidCollisions}
          onOpenAutoFocus={onOpenAutoFocus}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onInteractOutside={onInteractOutside}
          onWheel={onWheel}
          sideOffset={sideOffset || 8}
          alignOffset={alignOffset}
          align={align}
          side={side}
          style={style}
          className={cn('xwallet-ui', contentClassName)}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
