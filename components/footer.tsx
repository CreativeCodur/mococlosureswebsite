"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface FooterProps {
  onSubmitClick: () => void
}

export function Footer({ onSubmitClick }: FooterProps) {
  return (
    <footer className="py-16 px-6 border-t-4 border-black bg-card">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-[#1e3a5f] border-4 border-black shadow-brutal">
                <Image
                  src="/images/moco-logo.png"
                  alt="MocoClosures Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-20 h-16 overflow-hidden flex-shrink-0">
                <Image
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEie6hoJTOy0w5TPoipqSF7ni8yBSOUqDZwaEFuQLM2miWwBwdSwhr-_dEG3No2yeu9Yl5m98NlHGYFMDMv9xorFRCzuFNI1S2I01yN5aVSiJy8dy_g8LBzg8D0R035K-6NG2ncIaWN5YBE/s0/Flag_of_Maryland.gif"
                  alt="Maryland Flag"
                  width={80}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            </div>
            <h3 className="font-display text-2xl font-bold mb-4">MocoClosures</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your trusted source for Maryland weather and closure information.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-sm hover:text-primary transition-colors">
                  Weather Updates
                </Link>
              </li>
              <li>
                <Link href="/county-codes" className="text-sm hover:text-primary transition-colors">
                  County Codes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Resources</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a
                  href="https://chart.maryland.gov/SevereWeatherInformation/GetSevereWeatherInformation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Weather Safety
                </a>
              </li>
              <li>
                <a
                  href="https://mdem.maryland.gov/pages/local-eoc.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Emergency Contacts
                </a>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Stay Connected</h4>
            <Button
              className="w-full bg-primary text-primary-foreground border-4 border-black shadow-brutal hover:bg-primary/90"
              onClick={onSubmitClick}
            >
              Submit Info
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-8 border-t-4 border-border text-sm text-muted-foreground flex-wrap gap-4">
          <p>© 2026 MocoClosures. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Developed by Hargun Malhotra</span>
            <a href="mailto:hargunmalhotra31@gmail.com" className="hover:opacity-70 transition-opacity">
              <Image
                src="/images/download-20-282-29.png"
                alt="Contact"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
