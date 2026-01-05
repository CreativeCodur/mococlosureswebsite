"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileNavProps {
  scrolled: boolean
  onRadarClick: () => void
  onSubmitClick: () => void
}

export function MobileNav({ scrolled, onRadarClick, onSubmitClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      <button
        onClick={toggleMenu}
        className={`lg:hidden p-2 border-4 rounded-full border-black bg-white transition-all ${
          scrolled ? "bg-white text-black" : "bg-primary text-black"
        }`}
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden" onClick={toggleMenu} />

          {/* Modal Content */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white border-4 border-black shadow-brutal-lg z-[60] rounded-md lg:hidden">
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-4 border-black">
                <span className="text-lg font-bold font-display">MENU</span>
                <button
                  onClick={toggleMenu}
                  className="p-2 hover:bg-muted rounded-md transition-colors border-4 border-black shadow-brutal"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="p-6">
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      onRadarClick()
                      toggleMenu()
                    }}
                    className="text-center px-4 py-3 text-lg font-medium bg-primary text-black border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-md transition-all"
                  >
                    Radar
                  </button>
                  <Link
                    href="/posts"
                    onClick={toggleMenu}
                    className="px-4 py-3 text-lg font-medium bg-card border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-md transition-all text-center"
                  >
                    Weather Updates
                  </Link>
                  <Link
                    href="/county-codes"
                    onClick={toggleMenu}
                    className="px-4 py-3 text-lg font-medium bg-card border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-md transition-all text-center"
                  >
                    County Codes
                  </Link>
                  <Link
                    href="/about"
                    onClick={toggleMenu}
                    className="px-4 py-3 text-lg font-medium bg-card border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-md transition-all text-center"
                  >
                    About Us
                  </Link>
                  <Button
                    onClick={() => {
                      onSubmitClick()
                      toggleMenu()
                    }}
                    className="mt-4 w-full bg-black text-white border-4 border-black shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    Submit Info
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  )
}
