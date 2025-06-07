import React from 'react'
import { Badge } from "@/components/ui/badge"

interface EyeBrowProps {
    text: string;
    color?: "default" | "secondary" | "destructive" | "outline" | undefined;
    variant?: "default" | "secondary" | "destructive" | "outline" | undefined;
    className?: string;
}   

const EyeBrow = (prop: EyeBrowProps) => {
    const { text, color = "default", variant = "default", className } = prop;
  return (
   <Badge className={className} color={color} variant={variant}>{text}</Badge>
  )
}

export default EyeBrow