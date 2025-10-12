"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppNavigation } from "@/components/AppNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  conversationId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Conversation {
  conversationId: string;
  otherUser: any;
  lastMessage: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    loadConversations(userData.id);
    loadAllUsers();
  }, [router]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      const interval = setInterval(() => {
        loadMessages(selectedConversation);
      }, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async (userId: number) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        
        // Group messages by conversation
        const conversationMap = new Map<string, Message[]>();
        data.forEach((msg: Message) => {
          const convId = msg.conversationId;
          if (!conversationMap.has(convId)) {
            conversationMap.set(convId, []);
          }
          conversationMap.get(convId)!.push(msg);
        });

        // Create conversation objects
        const convs: Conversation[] = [];
        for (const [convId, msgs] of conversationMap.entries()) {
          const sortedMsgs = msgs.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          const lastMessage = sortedMsgs[0];
          const otherUserId = lastMessage.senderId === userId ? lastMessage.receiverId : lastMessage.senderId;
          
          // Fetch other user data
          const userRes = await fetch(`/api/users/${otherUserId}`);
          const otherUser = userRes.ok ? await userRes.json() : null;
          
          const unreadCount = msgs.filter(m => !m.read && m.receiverId === userId).length;
          
          convs.push({
            conversationId: convId,
            otherUser,
            lastMessage,
            unreadCount
          });
        }

        setConversations(convs.sort((a, b) => 
          new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/conversation/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.sort((a: Message, b: Message) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    try {
      const [_, otherUserId] = selectedConversation.split("-").map(Number);
      const receiverId = otherUserId === user.id ? 
        parseInt(selectedConversation.split("-")[0]) : otherUserId;

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        loadMessages(selectedConversation);
        loadConversations(user.id);
      } else {
        toast({
          title: "Failed to send",
          description: "Could not send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const startConversation = (otherUser: any) => {
    const convId = [user.id, otherUser.id].sort((a, b) => a - b).join("-");
    setSelectedConversation(convId);
    setNewChatDialogOpen(false);
    
    // Check if conversation already exists
    const existingConv = conversations.find(c => c.conversationId === convId);
    if (!existingConv) {
      // Add to conversations list
      setConversations([{
        conversationId: convId,
        otherUser,
        lastMessage: {} as Message,
        unreadCount: 0
      }, ...conversations]);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConvData = conversations.find(c => c.conversationId === selectedConversation);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">Connect with collaborators</p>
          </div>
          <Dialog open={newChatDialogOpen} onOpenChange={(open) => {
            setNewChatDialogOpen(open);
            if (open) {
              // Refresh users list when dialog opens
              loadAllUsers();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Conversation</DialogTitle>
                <DialogDescription>
                  Choose a user to start chatting with
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {allUsers
                    .filter(u => u.id !== user.id)
                    .map((u) => (
                      <Button
                        key={u.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => startConversation(u)}
                      >
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={u.avatar} alt={u.name} />
                          <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </Button>
                    ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No conversations yet</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setNewChatDialogOpen(true)}
                    >
                      Start a conversation
                    </Button>
                  </div>
                ) : (
                  <div>
                    {filteredConversations.map((conv) => (
                      <div key={conv.conversationId}>
                        <Button
                          variant={selectedConversation === conv.conversationId ? "secondary" : "ghost"}
                          className="w-full justify-start p-4 h-auto"
                          onClick={() => setSelectedConversation(conv.conversationId)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarImage src={conv.otherUser?.avatar} alt={conv.otherUser?.name} />
                              <AvatarFallback>{conv.otherUser?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium truncate">{conv.otherUser?.name}</p>
                                {conv.unreadCount > 0 && (
                                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 ml-2 shrink-0">
                                    {conv.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {conv.lastMessage?.content || "Start a conversation"}
                              </p>
                            </div>
                          </div>
                        </Button>
                        <Separator />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation && selectedConvData ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConvData.otherUser?.avatar} alt={selectedConvData.otherUser?.name} />
                      <AvatarFallback>{selectedConvData.otherUser?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedConvData.otherUser?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedConvData.otherUser?.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-4">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isOwn = msg.senderId === user.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwn
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a conversation or start a new one
                  </p>
                  <Button onClick={() => setNewChatDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Chat
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}