import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Botones v2 de Penpot: píldoras primary (degradado con brillo) y secondary
// (bg/raised con borde interior). Spec de motion: el primario sube el brillo
// un 20 % en 200 ms al pasar el mouse; al presionar, scale .97 en 120 ms.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-sans whitespace-nowrap outline-none select-none [transition:filter_200ms,scale_120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:not-aria-[haspopup]:scale-97 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-r/srgb from-blue to-cyan text-on-accent shadow-glow hover:brightness-120",
        secondary: "bg-raised text-fg ring-1 ring-line-strong ring-inset",
      },
      size: {
        default: "h-12 gap-2.5 px-6.5 text-button font-semibold",
        sm: "h-9.5 gap-2.5 px-4.5 text-button-sm font-medium",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
