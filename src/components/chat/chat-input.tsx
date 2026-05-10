"use client"

import { useRef, useEffect, KeyboardEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isLoading: boolean
  showSuggestions: boolean
  onSuggestionClick: (prompt: string) => void
}

const suggestions = [
  "What's trending right now?",
  "Which niche should I focus on?",
  "How to optimize my Amazon links?",
  "Best commission rates this month?",
]

export function ChatInput({
  value,
  onChange,
  onSend,
  isLoading,
  showSuggestions,
  onSuggestionClick,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "0px"
    el.style.height = Math.min(el.scrollHeight, 120) + "px"
  }, [value])

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) onSend()
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Suggestions */}
      {showSuggestions && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSuggestionClick(s)}
              className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about affiliate marketing..."
          rows={1}
          disabled={isLoading}
          className={cn(
            "flex-1 resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800",
            "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "min-h-[44px] max-h-[120px]"
          )}
        />
        <Button
          size="icon"
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          className={cn(
            "h-11 w-11 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 text-white",
            "disabled:opacity-50"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
