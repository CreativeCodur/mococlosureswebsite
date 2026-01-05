"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"
import { SubmitInfoModal } from "@/components/submit-info-modal"
import { RadarModal } from "@/components/radar-modal"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"

interface County {
  id: string
  name: string
  color: string
  info: string
}

export default function CountyCodesPage() {
  const [counties, setCounties] = useState<County[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showRadarModal, setShowRadarModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchCounties = async () => {
    try {
      const sheetId = "1jQ65UsyYTiaYHEafGxvBZ4f1469UtoMrc6pvosFAH9o"
      const gid = "0"
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`

      const response = await fetch(csvUrl)
      const csvText = await response.text()

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = []
        let current = ""
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          const nextChar = line[i + 1]

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              current += '"'
              i++
            } else {
              inQuotes = !inQuotes
            }
          } else if (char === "," && !inQuotes) {
            result.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }

        result.push(current.trim())
        return result
      }

      const rows = csvText.split("\n").filter((row) => row.trim())
      const parsedCounties: County[] = []

      // Parse rows: row 1 = names, row 2 = colors, row 3 = info
      const row1 = rows[0] ? parseCSVLine(rows[0]) : []
      const row2 = rows[1] ? parseCSVLine(rows[1]) : []
      const row3 = rows[2] ? parseCSVLine(rows[2]) : []

      // Each column is a county
      for (let i = 0; i < row1.length; i++) {
        const name = row1[i] || ""
        const color = row2[i] || "#cccccc"
        const info = row3[i] || ""

        if (name && name.trim()) {
          parsedCounties.push({
            id: `county-${i}`,
            name: name.trim(),
            color: color.trim(),
            info: info.trim(),
          })
        }
      }

      setCounties(parsedCounties)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching counties:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounties()
    const interval = setInterval(fetchCounties, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-6">
        <div
          className={`container mx-auto px-4 md:px-6 py-2 flex items-center justify-between transition-all duration-300 rounded-full ${
            scrolled
              ? "bg-white text-black shadow-lg"
              : "bg-white/10 backdrop-blur-sm text-foreground border border-border"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#1e3a5f]">
              <Image
                src="/images/moco-logo.png"
                alt="MocoClosures Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-base md:text-lg font-bold tracking-tight">MoCoClosures</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setShowRadarModal(true)
              }}
              className={`text-sm transition-colors ${
                scrolled ? "text-black/70 hover:text-black" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Radar
            </Link>
            <span className={`text-sm ${scrolled ? "text-black/30" : "text-foreground/30"}`}>|</span>
            <Link
              href="/posts"
              className={`text-sm transition-colors ${
                scrolled ? "text-black/70 hover:text-black" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Weather Updates
            </Link>
            <span className={`text-sm ${scrolled ? "text-black/30" : "text-foreground/30"}`}>|</span>
            <Link
              href="/county-codes"
              className={`text-sm transition-colors ${
                scrolled ? "text-black/70 hover:text-black" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              County Codes
            </Link>
            <span className={`text-sm ${scrolled ? "text-black/30" : "text-foreground/30"}`}>|</span>
            <Link
              href="/about"
              className={`text-sm transition-colors ${
                scrolled ? "text-black/70 hover:text-black" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              About Us
            </Link>
            <Button
              variant={scrolled ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className={scrolled ? "bg-black text-white hover:bg-black/90" : ""}
            >
              Submit Info
            </Button>
          </div>
          <MobileNav
            scrolled={scrolled}
            onRadarClick={() => setShowRadarModal(true)}
            onSubmitClick={() => setShowSubmitModal(true)}
          />
        </div>
      </nav>

      {/* Counties Grid */}
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">County Status Codes</h1>
          <p className="text-lg md:text-xl text-muted-foreground">Real-time status for all Montgomery County areas</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : counties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No county data available yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {counties.map((county) => (
              <Card
                key={county.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border overflow-hidden hover:scale-105"
                onClick={() => setSelectedCounty(county)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <CardTitle className="text-lg flex-1">{county.name}</CardTitle>
                    <div
                      className="w-12 h-12 rounded-full border-2 border-border shadow-sm"
                      style={{ backgroundColor: county.color }}
                    />
                  </div>
                  <CardDescription className="line-clamp-2 text-sm">
                    {county.info || "No additional info"}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedCounty && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedCounty(null)}
        >
          <div
            className="bg-background border border-border rounded-lg shadow-2xl max-w-lg w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setSelectedCounty(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="flex items-start gap-6 mb-6">
              <div
                className="w-20 h-20 rounded-full border-2 border-border shadow-md flex-shrink-0"
                style={{ backgroundColor: selectedCounty.color }}
              />
              <div className="flex-1 pt-2">
                <h2 className="text-3xl font-bold tracking-tight mb-2">{selectedCounty.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Status:</span>
                  <span
                    className="px-2 py-1 rounded text-white text-xs font-medium"
                    style={{ backgroundColor: selectedCounty.color }}
                  >
                    {selectedCounty.color}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Additional Information</h3>
                <p className="text-foreground leading-relaxed">
                  {selectedCounty.info || "No additional information available at this time."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Info Modal */}
      <SubmitInfoModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} />
      {/* Radar Modal */}
      <RadarModal isOpen={showRadarModal} onClose={() => setShowRadarModal(false)} />
      {/* Footer Component */}
      <Footer onSubmitClick={() => setShowSubmitModal(true)} />
    </div>
  )
}
