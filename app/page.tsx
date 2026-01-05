"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CloudRain, AlertTriangle, Thermometer, Wind, Droplets, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { SubmitInfoModal } from "@/components/submit-info-modal"
import { RadarModal } from "@/components/radar-modal"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"

export default function HomePage() {
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

  return (
    <div className="min-h-screen flex flex-col">
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
              className={
                scrolled
                  ? "bg-black text-white hover:bg-black/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6 md:mb-8 text-balance">
            Real-Time Weather Updates for Montgomery County
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto text-pretty">
            Stay informed with instant weather alerts, closure notifications, and county-wide status updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto shadow-brutal"
              >
                View Updates
              </Button>
            </Link>
            <Link href="/county-codes">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto bg-transparent shadow-brutal"
              >
                County Status
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-accent">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-6">Real-Time Weather Intelligence</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitor conditions across the Maryland with live data from multiple weather stations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <Thermometer className="h-12 w-12 mb-6 text-primary" />
              <div className="text-6xl font-bold mb-4 text-foreground font-display">72°F</div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Current Temp</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time temperature readings updated every 5 minutes from local stations
              </p>
            </div>

            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <Wind className="h-12 w-12 mb-6 text-primary" />
              <div className="text-6xl font-bold mb-4 text-foreground font-display">12mph</div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Wind Speed</h3>
              <p className="text-muted-foreground leading-relaxed">
                Live wind conditions with gusts and direction tracking for safety alerts
              </p>
            </div>

            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <Droplets className="h-12 w-12 mb-6 text-primary" />
              <div className="text-6xl font-bold mb-4 text-foreground font-display">65%</div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">Humidity</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor moisture levels affecting comfort and severe weather development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-8 md:mb-16 text-center">
            Why Choose MocoClosures?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="p-10 bg-card rounded-md border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <div className="text-7xl font-bold mb-6 text-primary font-display">01</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Live Updates</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Real-time weather conditions and closures updated automatically throughout the day. Never miss an
                important alert or delay announcement.
              </p>
            </div>

            <div className="p-10 bg-card rounded-md border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <div className="text-7xl font-bold mb-6 text-primary font-display">02</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Accurate Forecasts</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Detailed forecasts and weather alerts for Maryland and surrounding areas. Powered by NOAA data for
                maximum accuracy.
              </p>
            </div>

            <div className="p-10 bg-card rounded-md border-4 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <div className="text-7xl font-bold mb-6 text-primary font-display">03</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Closure Alerts</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Stay informed about school closures, delays, and weather-related community updates. Get notifications
                before they're announced elsewhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* County Coverage Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-12 md:mb-16 text-center">
            Complete County Coverage
          </h2>
          <div className="flex flex-col gap-4 md:gap-6 max-w-2xl mx-auto">
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <div className="text-6xl font-bold mb-6 text-primary font-display">Rockville</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Area Coverage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time weather updates for Rockville and surrounding areas.
              </p>
            </div>
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <div className="text-6xl font-bold mb-6 text-primary font-display">Germantown</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Area Coverage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time weather updates for Germantown and surrounding areas.
              </p>
            </div>
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <div className="text-6xl font-bold mb-6 text-primary font-display">Silver Spring</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Area Coverage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time weather updates for Silver Spring and surrounding areas.
              </p>
            </div>
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <div className="text-6xl font-bold mb-6 text-primary font-display">Poolesville</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Area Coverage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time weather updates for Poolesville and surrounding areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <div className="text-6xl font-bold mb-6 text-primary font-display">15+</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Weather Stations</h3>
              <p className="text-muted-foreground leading-relaxed">
                We have over 15 weather monitoring stations across Montgomery County.
              </p>
            </div>
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <div className="text-6xl font-bold mb-6 text-primary font-display">24/7</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Real-Time Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our system provides real-time data updates 24 hours a day, 7 days a week.
              </p>
            </div>
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <div className="text-6xl font-bold mb-6 text-primary font-display">1M+</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Residents Served</h3>
              <p className="text-muted-foreground leading-relaxed">
                Over 1 million residents receive daily weather updates and alerts.
              </p>
            </div>
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <div className="text-6xl font-bold mb-6 text-primary font-display">5min</div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Average Response Time</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our system ensures that alerts are delivered within an average of 5 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 md:mb-6">
            Alert Types We Monitor
          </h2>
          <p className="text-lg md:text-xl mb-12 md:mb-16 text-center max-w-3xl mx-auto">
            Our comprehensive monitoring system tracks various weather events
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <CloudRain className="h-16 w-16 mb-6 text-primary" />
              <h3 className="text-3xl font-semibold mb-4 text-foreground">Severe Weather</h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Immediate notifications for thunderstorms, tornadoes, hurricanes, and other dangerous conditions with
                real-time tracking.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Tornado warnings and watches
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Severe thunderstorm alerts
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Flash flood warnings
                </li>
              </ul>
            </div>

            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <Sun className="h-16 w-16 mb-6 text-primary" />
              <h3 className="text-3xl font-semibold mb-4 text-foreground">Winter Weather</h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Stay ahead of snow, ice, and freezing conditions with advance notice for planning your day and ensuring
                safety.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Winter storm warnings
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Ice and sleet advisories
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  School delay predictions
                </li>
              </ul>
            </div>

            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <AlertTriangle className="h-16 w-16 mb-6 text-primary" />
              <h3 className="text-3xl font-semibold mb-4 text-foreground">Heat Advisories</h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Monitor dangerous heat conditions and air quality alerts to protect your health during extreme
                temperatures.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Excessive heat warnings
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Air quality index updates
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  UV index tracking
                </li>
              </ul>
            </div>

            <div className="p-10 bg-white rounded-md border-4 border-black shadow-brutal">
              <Wind className="h-16 w-16 mb-6 text-primary" />
              <h3 className="text-3xl font-semibold mb-4 text-foreground">Wind Alerts</h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Track high wind conditions that can affect power lines, trees, and safe driving conditions throughout
                the county.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  High wind warnings
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Gust speed tracking
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Power outage predictions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-12 md:mb-16 text-center">
            Join Our Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="p-10 bg-card rounded-md border-4 border-black shadow-brutal">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Submit Weather Updates</h3>
              <p className="text-muted-foreground leading-relaxed">
                Help us keep Montgomery County informed by submitting weather updates from your area.
              </p>
            </div>
            <div className="p-10 bg-card rounded-md border-4 border-black shadow-brutal">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Report Closures</h3>
              <p className="text-muted-foreground leading-relaxed">
                Notify us about school closures, delays, or other community updates to help keep everyone informed.
              </p>
            </div>
            <div className="p-10 bg-card rounded-md border-4 border-black shadow-brutal">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Share Local Conditions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Contribute local weather conditions and observations to enhance our data and alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 md:mb-6">
            Stay Prepared, Stay Safe
          </h2>
          <p className="text-lg md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto opacity-90">
            Never miss an important weather update. Get real-time alerts for Montgomery County.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowSubmitModal(true)}
            className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto"
          >
            Submit Your Report
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer onSubmitClick={() => setShowSubmitModal(true)} />

      {/* Submit Info Modal */}
      <SubmitInfoModal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} />
      {/* Radar Modal */}
      <RadarModal isOpen={showRadarModal} onClose={() => setShowRadarModal(false)} />
    </div>
  )
}
