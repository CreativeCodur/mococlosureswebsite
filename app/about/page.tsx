"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"
import Image from "next/image"
import { SubmitInfoModal } from "@/components/submit-info-modal"
import { RadarModal } from "@/components/radar-modal"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"

interface TeamMember {
  id: string
  name: string
  title: string
  bio: string
  image?: string
}

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
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

  const fetchTeamMembers = async () => {
    try {
      const sheetId = "1OkSQmsvacWLG5gCSNeVwBX8Aoyd093HaKp3IOxFdXSs"
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
      const parsedMembers: TeamMember[] = []

      rows.forEach((row, index) => {
        const columns = parseCSVLine(row)
        const name = columns[0] || ""
        const title = columns[1] || ""
        const bio = columns[2] || ""
        const image = columns[3] || ""

        if (name && name.trim()) {
          parsedMembers.push({
            id: `member-${index}`,
            name: name.trim(),
            title: title.trim(),
            bio: bio.trim(),
            image: image.trim() || undefined,
          })
        }
      })

      setTeamMembers(parsedMembers)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching team members:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
    const interval = setInterval(fetchTeamMembers, 30000)
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

      {/* Team Grid */}
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">About Us</h1>
          <p className="text-lg md:text-xl text-muted-foreground">Meet the team behind MocoClosures</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No team members available yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border overflow-hidden hover:scale-105"
                onClick={() => setSelectedMember(member)}
              >
                {member.image && (
                  <div className="h-48 overflow-hidden flex justify-center bg-white">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={200}
                      height={192}
                      className="h-full w-auto object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-sm text-primary font-medium">{member.title}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-background border border-border rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedMember(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            {selectedMember.image && (
              <div className="overflow-hidden flex justify-center bg-white py-6">
                <Image
                  src={selectedMember.image || "/placeholder.svg"}
                  alt={selectedMember.name}
                  width={400}
                  height={300}
                  className="h-64 w-auto object-cover rounded-lg border-2 border-border"
                />
              </div>
            )}

            <div className="p-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">{selectedMember.name}</h2>
              <p className="text-primary font-semibold mb-6">{selectedMember.title}</p>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedMember.bio}</p>
            </div>
          </div>
        </div>
      )}

      <Footer onSubmitClick={() => setShowSubmitModal(true)} />

      <SubmitInfoModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} />
      <RadarModal isOpen={showRadarModal} onClose={() => setShowRadarModal(false)} />
    </div>
  )
}
