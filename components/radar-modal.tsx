"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface RadarModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RadarModal({ isOpen, onClose }: RadarModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [radarTimestamp, setRadarTimestamp] = useState(Date.now())

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      const interval = setInterval(() => {
        setRadarTimestamp(Date.now())
      }, 120000) // 2 minutes

      return () => clearInterval(interval)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(onClose, 300)
  }

  if (!isOpen && !isAnimating) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating && isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden transition-all duration-300 ${
          isAnimating && isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Maryland Weather Radar</h2>
            <p className="text-sm text-muted-foreground mt-1">Sterling (LWX) - Live radar loop</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Radar Content */}
        <div className="relative bg-background flex items-center justify-center p-8">
          <img
            src={`https://radar.weather.gov/ridge/standard/KLWX_loop.gif?t=${radarTimestamp}`}
            alt="Maryland Weather Radar Loop"
            className="w-full h-auto rounded-lg"
            style={{ maxHeight: "500px", maxWidth: "700px", objectFit: "contain" }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-card border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Data provided by NOAA National Weather Service - Updates automatically every 2 minutes
          </p>
        </div>
      </div>
    </div>
  )
}
