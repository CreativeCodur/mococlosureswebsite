"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sanitizeInput, isValidEmail, isValidPhone } from "@/lib/sanitize"

const MAX_SUBMISSIONS_PER_DAY = 5

interface SubmitInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SubmitInfoModal({ isOpen, onClose }: SubmitInfoModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [issueType, setIssueType] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [submissionsToday, setSubmissionsToday] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // Check submission count
      const today = new Date().toDateString()
      const stored = localStorage.getItem("submissions")
      if (stored) {
        const data = JSON.parse(stored)
        if (data.date === today) {
          setSubmissionsToday(data.count)
        } else {
          setSubmissionsToday(0)
          localStorage.setItem("submissions", JSON.stringify({ date: today, count: 0 }))
        }
      } else {
        localStorage.setItem("submissions", JSON.stringify({ date: new Date().toDateString(), count: 0 }))
      }
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check rate limit
    if (submissionsToday >= MAX_SUBMISSIONS_PER_DAY) {
      setError(`You have reached the maximum of ${MAX_SUBMISSIONS_PER_DAY} submissions per day.`)
      return
    }

    if (!firstName || !lastName || !phone || !email || !address || !issueType) {
      setError("Please fill in all required fields.")
      return
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL

      if (!scriptUrl) {
        throw new Error(
          "Google Apps Script URL not configured. Please add NEXT_PUBLIC_GOOGLE_SCRIPT_URL to your environment variables.",
        )
      }

      const payload = {
        firstName: sanitizeInput(firstName),
        lastName: sanitizeInput(lastName),
        phone: sanitizeInput(phone),
        email: sanitizeInput(email),
        address: sanitizeInput(address),
        issueType: sanitizeInput(issueType),
        additionalInfo: sanitizeInput(additionalInfo),
      }

      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      // Update submission count
      const today = new Date().toDateString()
      const newCount = submissionsToday + 1
      localStorage.setItem("submissions", JSON.stringify({ date: today, count: newCount }))
      setSubmissionsToday(newCount)

      setSuccess(true)
      setSubmitting(false)

      // Reset form
      setTimeout(() => {
        setFirstName("")
        setLastName("")
        setPhone("")
        setEmail("")
        setAddress("")
        setIssueType("")
        setAdditionalInfo("")
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.")
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Submit Information</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submissionsToday >= MAX_SUBMISSIONS_PER_DAY && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive">Daily limit reached</p>
                <p className="text-sm text-destructive/80">
                  You have submitted {MAX_SUBMISSIONS_PER_DAY} times today. Please try again tomorrow.
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-600 dark:text-green-400">Submitted successfully!</p>
                <p className="text-sm text-green-600/80 dark:text-green-400/80">
                  Thank you for your submission. ({MAX_SUBMISSIONS_PER_DAY - submissionsToday} remaining today)
                </p>
              </div>
            </div>
          )}

          {error && !success && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={submitting || success || submissionsToday >= MAX_SUBMISSIONS_PER_DAY}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={submitting || success || submissionsToday >= MAX_SUBMISSIONS_PER_DAY}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={submitting || success || submissionsToday >= MAX_SUBMISSIONS_PER_DAY}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting || success || submissionsToday >= MAX_SUBMISSIONS_PER_DAY}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={submitting || success || submissionsToday >= MAX_SUBMISSIONS_PER_DAY}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueType">Issue Type *</Label>
            <Select
              value={issueType}
              onValueChange={setIssueType}
              disabled={submitting || success || submissionsToday >= MAX_SUBMISSIONS_PER_DAY}
            >
              <SelectTrigger id="issueType">
                <SelectValue placeholder="Select an issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                <SelectItem value="Weather Status Update">Weather Status Update</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              disabled={submitting || success || submissionsToday >= MAX_SUBMISSIONS_PER_DAY}
              rows={4}
              placeholder="Any additional details you'd like to share..."
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              {submissionsToday < MAX_SUBMISSIONS_PER_DAY
                ? `${MAX_SUBMISSIONS_PER_DAY - submissionsToday} submission${MAX_SUBMISSIONS_PER_DAY - submissionsToday !== 1 ? "s" : ""} remaining today`
                : ""}
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || success || submissionsToday >= MAX_SUBMISSIONS_PER_DAY}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
