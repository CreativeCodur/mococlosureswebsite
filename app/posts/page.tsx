"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Loader2, Smile, PartyPopper, ThumbsUp } from "lucide-react"
import Image from "next/image"
import { SubmitInfoModal } from "@/components/submit-info-modal"
import { RadarModal } from "@/components/radar-modal"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"

interface Post {
  id: string
  title: string
  date: string
  text: string
  image?: string
}

interface Reactions {
  [postId: string]: {
    smile: number
    party: number
    like: number
  }
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showRadarModal, setShowRadarModal] = useState(false)
  const [reactions, setReactions] = useState<Reactions>({})
  const [userReactions, setUserReactions] = useState<{ [postId: string]: string | null }>({})

  useEffect(() => {
    const savedReactions = localStorage.getItem("postReactions")
    const savedUserReactions = localStorage.getItem("userPostReactions")
    if (savedReactions) {
      setReactions(JSON.parse(savedReactions))
    }
    if (savedUserReactions) {
      setUserReactions(JSON.parse(savedUserReactions))
    }
  }, [])

  const handleReaction = (postId: string, reactionType: "smile" | "party" | "like") => {
    const currentUserReaction = userReactions[postId]

    setReactions((prev) => {
      const newReactions = { ...prev }
      if (!newReactions[postId]) {
        newReactions[postId] = { smile: 0, party: 0, like: 0 }
      }

      if (currentUserReaction === reactionType) {
        newReactions[postId][reactionType] = Math.max(0, newReactions[postId][reactionType] - 1)
      } else {
        if (currentUserReaction) {
          newReactions[postId][currentUserReaction as keyof (typeof newReactions)[typeof postId]] = Math.max(
            0,
            newReactions[postId][currentUserReaction as keyof (typeof newReactions)[typeof postId]] - 1,
          )
        }
        newReactions[postId][reactionType] += 1
      }

      localStorage.setItem("postReactions", JSON.stringify(newReactions))
      return newReactions
    })

    setUserReactions((prev) => {
      const newUserReactions = { ...prev }
      newUserReactions[postId] = currentUserReaction === reactionType ? null : reactionType
      localStorage.setItem("userPostReactions", JSON.stringify(newUserReactions))
      return newUserReactions
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchPosts = async () => {
    try {
      const sheetId = "1hmhjcRdSlhipy2gc68pSwMRxOXbxfmhDCCXVHeAPSL4"
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
      const parsedPosts: Post[] = []

      rows.forEach((row, index) => {
        const columns = parseCSVLine(row)
        const title = columns[0] || ""
        const date = columns[1] || ""
        const text = columns[2] || ""
        const image = columns[3] || ""

        if (title && title.trim()) {
          parsedPosts.push({
            id: `post-${index}`,
            title: title.trim(),
            date: date.trim(),
            text: text.trim(),
            image: image.trim() || undefined,
          })
        }
      })

      setPosts(parsedPosts)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (selectedPost) {
    const postReactions = reactions[selectedPost.id] || { smile: 0, party: 0, like: 0 }
    const userReaction = userReactions[selectedPost.id]

    return (
      <div className="min-h-screen bg-background">
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

        <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{selectedPost.date}</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-8 text-balance">{selectedPost.title}</h1>

          {selectedPost.image && (
            <div className="mb-8 rounded-lg overflow-hidden max-w-2xl mx-auto">
              <Image
                src={selectedPost.image || "/placeholder.svg"}
                alt={selectedPost.title}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{selectedPost.text}</p>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-border">
            <span className="text-sm text-muted-foreground font-medium">React:</span>
            <button
              onClick={() => handleReaction(selectedPost.id, "smile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                userReaction === "smile"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Smile className="h-5 w-5" strokeWidth={2} />
              <span className="font-mono text-sm font-semibold">{postReactions.smile}</span>
            </button>
            <button
              onClick={() => handleReaction(selectedPost.id, "party")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                userReaction === "party"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <PartyPopper className="h-5 w-5" strokeWidth={2} />
              <span className="font-mono text-sm font-semibold">{postReactions.party}</span>
            </button>
            <button
              onClick={() => handleReaction(selectedPost.id, "like")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                userReaction === "like"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <ThumbsUp className="h-5 w-5" strokeWidth={2} />
              <span className="font-mono text-sm font-semibold">{postReactions.like}</span>
            </button>
          </div>
        </div>

        <SubmitInfoModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} />
        <RadarModal isOpen={showRadarModal} onClose={() => setShowRadarModal(false)} />
        <Footer onSubmitClick={() => setShowSubmitModal(true)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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

      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Weather Updates</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Stay informed about current conditions and closures
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No posts available yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const postReactions = reactions[post.id] || { smile: 0, party: 0, like: 0 }
              const userReaction = userReactions[post.id]

              return (
                <Card key={post.id} className="border-border overflow-hidden flex flex-col">
                  <div className="cursor-pointer flex-1" onClick={() => setSelectedPost(post)}>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    {post.image && (
                      <div className="px-6 pb-4">
                        <div className="rounded-md overflow-hidden">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            width={600}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <CardContent>
                      <CardDescription className="line-clamp-3 leading-relaxed">{post.text}</CardDescription>
                    </CardContent>
                  </div>

                  <div className="px-6 pb-4 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReaction(post.id, "smile")
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 transition-all text-sm ${
                        userReaction === "smile"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Smile className="h-4 w-4" strokeWidth={2} />
                      <span className="font-mono text-xs font-semibold">{postReactions.smile}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReaction(post.id, "party")
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 transition-all text-sm ${
                        userReaction === "party"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <PartyPopper className="h-4 w-4" strokeWidth={2} />
                      <span className="font-mono text-xs font-semibold">{postReactions.party}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReaction(post.id, "like")
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 transition-all text-sm ${
                        userReaction === "like"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" strokeWidth={2} />
                      <span className="font-mono text-xs font-semibold">{postReactions.like}</span>
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <SubmitInfoModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} />
      <RadarModal isOpen={showRadarModal} onClose={() => setShowRadarModal(false)} />
      <Footer onSubmitClick={() => setShowSubmitModal(true)} />
    </div>
  )
}
