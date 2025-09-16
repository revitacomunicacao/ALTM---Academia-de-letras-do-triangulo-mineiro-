import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
  sticky?: boolean
  minHeight?: string
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export const Card = ({ 
  children, 
  className = "", 
  padding = "md",
  sticky = false,
  minHeight
}: CardProps) => {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  }

  const stickyClass = sticky ? "sticky top-8" : ""

  return (
    <div 
      className={`bg-white rounded-[30px] shadow-lg border-2 ${paddingClasses[padding]} ${stickyClass} ${className}`}
      style={{ 
        borderColor: '#c3a855',
        minHeight: minHeight
      }}
    >
      {children}
    </div>
  )
}

export const CardContent = ({ children, className = "" }: CardContentProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}