"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import {
  Bot,
  TrendingUp,
  GitCompare,
  Lightbulb,
  DollarSign,
  Trash2,
} from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hello! I'm your AffiliateIQ assistant. I can help you find the best affiliate products, analyze trends, optimize your campaigns, and maximize your earnings. What would you like to know?",
  timestamp: new Date(),
}

const quickActions = [
  { label: "Analyze Trends", icon: TrendingUp },
  { label: "Compare Products", icon: GitCompare },
  { label: "Campaign Ideas", icon: Lightbulb },
  { label: "Optimize Earnings", icon: DollarSign },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = {
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    }

    const history = messages.map((m) => ({ role: m.role, content: m.content }))

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMsg])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      })

      if (!res.ok) {
        let errorMsg = `Request failed with status ${res.status}`
        try {
          const errBody = await res.json()
          if (errBody.error) errorMsg = errBody.error
        } catch {
          // response wasn't JSON, keep default message
        }
        throw new Error(errorMsg)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const current = accumulated
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: current,
          }
          return updated
        })
      }
    } catch (error) {
      const errText =
        error instanceof Error ? error.message : "Something went wrong"
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: `Sorry, I encountered an error: ${errText}. Please try again.`,
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleClear() {
    setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }])
    setInput("")
  }

  function handleQuickAction(label: string) {
    sendMessage(label)
  }

  const showSuggestions = messages.length <= 1 && !isLoading

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Bot className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              AI Assistant
            </h1>
            <p className="text-xs text-gray-500">
              Your personal affiliate marketing advisor
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-500 hover:text-gray-700"
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Clear Chat
        </Button>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-6 py-3">
        {quickActions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => handleQuickAction(label)}
            disabled={isLoading}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mx-auto w-full max-w-3xl">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => sendMessage(input)}
          isLoading={isLoading}
          showSuggestions={showSuggestions}
          onSuggestionClick={(s) => sendMessage(s)}
        />
        <p className="bg-white px-4 pb-3 text-center text-xs text-gray-400">
          AI can make mistakes. Always verify important information.
        </p>
      </div>
    </div>
  )
}
