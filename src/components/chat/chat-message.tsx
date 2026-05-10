"use client"

import { cn } from "@/lib/utils"
import { Bot } from "lucide-react"
import { useState, useEffect } from "react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

function parseMarkdown(text: string): string {
  let html = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-50 border border-gray-200 rounded-lg p-3 my-2 overflow-x-auto text-sm text-gray-800"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-blue-600">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")

  html = html.replace(
    /((?:^|\n)[*-] .+(?:\n[*-] .+)*)/g,
    (match) => {
      const items = match
        .trim()
        .split("\n")
        .map((line) => `<li class="ml-4">${line.replace(/^[*-] /, "")}</li>`)
        .join("")
      return `<ul class="list-disc my-2 space-y-1">${items}</ul>`
    }
  )

  html = html.replace(/\n/g, "<br/>")

  return html
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user"
  const [timeStr, setTimeStr] = useState("")

  useEffect(() => {
    setTimeStr(timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }, [timestamp])

  return (
    <div
      className={cn(
        "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar - only for assistant */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <Bot className="h-4 w-4 text-blue-600" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div
            className="prose prose-sm max-w-none [&_strong]:text-gray-900 [&_em]:text-gray-600 [&_a]:text-blue-600"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        )}
        <p
          className={cn(
            "mt-1.5 text-[10px]",
            isUser ? "text-blue-200" : "text-gray-400"
          )}
        >
          {timeStr || "\u00A0"}
        </p>
      </div>
    </div>
  )
}
