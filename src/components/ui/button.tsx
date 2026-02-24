import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth, 
    asChild = false, 
    loading, 
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
   const variantClass = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 border-0',
  secondary: 'btn-secondary',
  accent: 'bg-gradient-to-r from-accent to-orange-600 text-white border-0', 
  success: 'btn-success',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  link: 'btn-link',
  destructive: 'btn-destructive',
}[variant];
    
    const sizeClass = {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
      xl: 'btn-xl',
      icon: 'btn-icon',
    }[size];
    
    return (
      <Comp
        className={cn(
          'btn-base',
          variantClass,
          sizeClass,
          fullWidth && 'btn-full',
          loading && 'btn-loading',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="btn-loading-spinner" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };