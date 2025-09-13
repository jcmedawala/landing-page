"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WishlistFormProps {
  isActive: boolean
}

export default function WishlistForm({ isActive }: WishlistFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store in localStorage for now (replace with actual backend)
      const existingEmails = JSON.parse(localStorage.getItem("futurebankers-wishlist") || "[]")
      if (!existingEmails.includes(email)) {
        existingEmails.push(email)
        localStorage.setItem("futurebankers-wishlist", JSON.stringify(existingEmails))
      }

      setIsSubmitted(true)
      setEmail("")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 p-6 border border-green-500/20 bg-green-500/10 rounded-lg max-w-md"
      >
        <p className="text-green-400 font-medium">✓ You're on the list! We'll notify you when we launch.</p>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md"
    >
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent border-white/20 text-white placeholder:text-gray-400 focus:border-[#FF4D00]"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#FF4D00] text-black hover:bg-[#FF4D00]/90 transition-colors whitespace-nowrap"
      >
        {isSubmitting ? "Joining..." : "Join Waitlist"}
      </Button>
      {error && <p className="text-red-400 text-sm mt-2 col-span-full">{error}</p>}
    </motion.form>
  )
}
