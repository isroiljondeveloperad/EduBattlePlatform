"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, Crown, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface ChatMessage {
  id: string
  team_id: string
  user_id: string
  user_name: string
  is_premium: boolean
  message: string
  created_at: string
}

export function TeamChat({ teamId }: { teamId: string }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isConnected] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [teamId])

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const loadMessages = () => {
    try {
      const stored = localStorage.getItem(`team_chat_${teamId}`)
      if (stored) {
        const allMessages = JSON.parse(stored) as ChatMessage[]
        setMessages(allMessages)
      } else {
        // Add some demo messages
        const demoMessages: ChatMessage[] = [
          {
            id: "1",
            team_id: teamId,
            user_id: "demo1",
            user_name: "Admin",
            is_premium: true,
            message: "Xush kelibsiz! Bu jamoa chati.",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "2",
            team_id: teamId,
            user_id: "demo2",
            user_name: "O'quvchi",
            is_premium: false,
            message: "Salom! Turnirga tayyormiz!",
            created_at: new Date(Date.now() - 1800000).toISOString(),
          },
        ]
        setMessages(demoMessages)
        localStorage.setItem(`team_chat_${teamId}`, JSON.stringify(demoMessages))
      }
    } catch (error) {
      console.error("[v0] Error loading messages:", error)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return

    try {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        team_id: teamId,
        user_id: user.id,
        user_name: user.name || "Foydalanuvchi",
        is_premium: user.isPremium || false,
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
      }

      const updatedMessages = [...messages, newMsg]
      setMessages(updatedMessages)
      localStorage.setItem(`team_chat_${teamId}`, JSON.stringify(updatedMessages))
      setNewMessage("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-battle-green" />
            Jamoa Chati
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-battle-green" : "bg-red-500"}`} />
            <span className="text-sm text-muted-foreground">{isConnected ? "Ulangan" : "Ulanmagan"}</span>
            <Badge variant="outline" className="text-xs">
              {messages.length} xabar
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-battle-blue/10 text-battle-blue text-xs">
                    {message.user_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{message.user_name || "Unknown"}</span>
                    {message.is_premium && <Crown className="w-3 h-3 text-battle-purple" />}
                    <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                  </div>

                  <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm">{message.message}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Xabar yozing..."
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-battle-green hover:bg-battle-green/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Star className="w-3 h-3" />
            <span>Barcha xabarlar saqlanib qoladi</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
