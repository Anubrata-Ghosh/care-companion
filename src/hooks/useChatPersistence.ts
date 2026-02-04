import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export function useChatPersistence() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load user's conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .order("updated_at", { ascending: false });
    
    if (error) {
      console.error("Error loading conversations:", error);
      return;
    }
    
    setConversations(data || []);
  }, [user]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Error loading messages:", error);
      return [];
    }
    
    return (data || []).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));
  }, []);

  // Create a new conversation
  const createConversation = useCallback(async (firstMessage: string) => {
    if (!user) return null;
    
    // Generate a title from the first message (first 50 chars)
    const title = firstMessage.length > 50 
      ? firstMessage.substring(0, 47) + "..." 
      : firstMessage;
    
    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({ user_id: user.id, title })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
    
    setCurrentConversationId(data.id);
    setConversations((prev) => [data, ...prev]);
    return data.id;
  }, [user]);

  // Save a message to the database
  const saveMessage = useCallback(async (conversationId: string, role: "user" | "assistant", content: string) => {
    const { error } = await supabase
      .from("chat_messages")
      .insert({ conversation_id: conversationId, role, content });
    
    if (error) {
      console.error("Error saving message:", error);
    }
    
    // Update conversation's updated_at
    await supabase
      .from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  }, []);

  // Switch to a different conversation
  const switchConversation = useCallback(async (conversationId: string) => {
    setIsLoadingHistory(true);
    const loadedMessages = await loadMessages(conversationId);
    setMessages(loadedMessages);
    setCurrentConversationId(conversationId);
    setIsLoadingHistory(false);
  }, [loadMessages]);

  // Start a new conversation (clear current)
  const startNewConversation = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    const { error } = await supabase
      .from("chat_conversations")
      .delete()
      .eq("id", conversationId);
    
    if (error) {
      console.error("Error deleting conversation:", error);
      return false;
    }
    
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    
    if (currentConversationId === conversationId) {
      startNewConversation();
    }
    
    return true;
  }, [currentConversationId, startNewConversation]);

  // Load conversations when user logs in
  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      setConversations([]);
      setCurrentConversationId(null);
      setMessages([]);
    }
  }, [user, loadConversations]);

  return {
    user,
    conversations,
    currentConversationId,
    messages,
    setMessages,
    isLoadingHistory,
    createConversation,
    saveMessage,
    switchConversation,
    startNewConversation,
    deleteConversation,
    loadConversations,
  };
}
