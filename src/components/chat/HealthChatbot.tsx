import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`;

const suggestedQuestions = [
  "I have a headache and fever, what should I do?",
  "How can I book a doctor for my elderly parent?",
  "What lab tests should I get for a routine checkup?",
  "I need help managing my medications",
];

// Service keywords mapped to their routes
const serviceLinks: { keywords: string[]; route: string; label: string }[] = [
  { keywords: ["doctor appointment", "book a doctor", "see a doctor", "doctor visit", "consult a doctor"], route: "/doctor-appointment", label: "Doctor Appointment" },
  { keywords: ["medicine delivery", "order medicine", "buy medicine", "medications", "pharmacy"], route: "/medicine-delivery", label: "Medicine Delivery" },
  { keywords: ["lab test", "blood test", "diagnostic", "checkup", "health test"], route: "/lab-tests", label: "Lab Tests" },
  { keywords: ["home visit", "doctor home visit", "doctor at home"], route: "/doctor-home-visit", label: "Doctor Home Visit" },
  { keywords: ["elderly care", "senior care", "old age care", "elderly parent"], route: "/elderly-care", label: "Elderly Care" },
  { keywords: ["nurse", "nursing", "part-time nurse", "home nurse"], route: "/part-time-nurse", label: "Part-Time Nurse" },
  { keywords: ["emergency", "sos", "urgent care", "ambulance"], route: "/emergency-sos", label: "Emergency SOS" },
];

// Component to render a clickable service link
function ServiceLink({ route, label, onClose }: { route: string; label: string; onClose: () => void }) {
  return (
    <Link
      to={route}
      onClick={onClose}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md font-medium transition-colors"
    >
      {label} →
    </Link>
  );
}

// Simple markdown-like formatting with clickable service links
function formatMessage(text: string, onClose: () => void): React.ReactNode[] {
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const bulletContent = isBullet ? line.trim().slice(2) : line;
    
    // Process bold text and service links
    const processText = (content: string): React.ReactNode[] => {
      const boldParts = content.split(/(\*\*[^*]+\*\*)/g);
      const result: React.ReactNode[] = [];
      
      boldParts.forEach((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          const service = serviceLinks.find(s => 
            s.keywords.some(k => boldText.toLowerCase().includes(k))
          );
          if (service) {
            result.push(<ServiceLink key={`link-${lineIndex}-${i}`} route={service.route} label={service.label} onClose={onClose} />);
          } else {
            result.push(<strong key={`bold-${lineIndex}-${i}`}>{boldText}</strong>);
          }
        } else if (part) {
          // Check for service mentions in plain text
          let hasMatch = false;
          for (const service of serviceLinks) {
            for (const keyword of service.keywords) {
              const lowerPart = part.toLowerCase();
              const lowerKeyword = keyword.toLowerCase();
              if (lowerPart.includes(lowerKeyword)) {
                const idx = lowerPart.indexOf(lowerKeyword);
                const before = part.slice(0, idx);
                const after = part.slice(idx + keyword.length);
                if (before) result.push(before);
                result.push(<ServiceLink key={`svc-${lineIndex}-${i}`} route={service.route} label={service.label} onClose={onClose} />);
                if (after) result.push(after);
                hasMatch = true;
                break;
              }
            }
            if (hasMatch) break;
          }
          if (!hasMatch) {
            result.push(part);
          }
        }
      });
      
      return result;
    };

    const formattedParts = processText(bulletContent);

    if (isBullet) {
      return (
        <li key={lineIndex} className="ml-4">
          {formattedParts}
        </li>
      );
    }
    
    if (line.trim() === '') {
      return <br key={lineIndex} />;
    }
    
    return (
      <p key={lineIndex} className="mb-1">
        {formattedParts}
      </p>
    );
  });
}

export function HealthChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to get response");
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get response");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 z-50 w-[360px] h-[500px] flex flex-col shadow-2xl border-2">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold text-sm">Health Assistant</h3>
            <p className="text-xs opacity-80">AI-powered symptom checker</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center text-muted-foreground text-sm">
              <Bot className="h-12 w-12 mx-auto mb-2 text-primary" />
              <p className="font-medium">How can I help you today?</p>
              <p className="text-xs mt-1">
                Describe your symptoms or ask health questions
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
              {suggestedQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto py-2 text-xs"
                  onClick={() => handleSend(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
{msg.role === "assistant" ? (
                    <div className="[&>p]:leading-relaxed [&>li]:leading-relaxed">
                      {formatMessage(msg.content, () => setIsOpen(false))}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2 justify-start">
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Not medical advice. Consult a healthcare professional.
        </p>
      </div>
    </Card>
  );
}
