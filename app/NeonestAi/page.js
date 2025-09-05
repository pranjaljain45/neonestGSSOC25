"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { Bot, Send, Loader2, Baby, Utensils, Clock, Heart, MessageSquare, ThumbsUp, Users, BarChart3, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip";
import { Button } from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import ReactMarkdown from "react-markdown";
import SpeechRecognition from "../components/SpeechRecognition";
import TextToSpeech from "../components/TextToSpeech";
import { fetchChatHistory, saveChatHistory } from "@/lib/chatService";
import { useAuth } from "../context/AuthContext";
import { useChatStore } from "@/lib/store/chatStore";
import { useTranslation } from "react-i18next";


const quickQuestions = [
  { icon: Baby, text: "when_should_baby_crawl", color: "pink" },
  { icon: Utensils, text: "how_to_introduce_solid_foods", color: "purple" },
  { icon: Clock, text: "good_sleep_schedule_6_months", color: "blue" },
  { icon: Heart, text: "is_babys_crying_normal", color: "green" },
];

const roles = [
  { label: "pediatrician", value: "pediatrician" },
  { label: "baby", value: "baby" },
  { label: "mother", value: "mother" },
];

export default function NeonestAi() {
  const { t, ready } = useTranslation("common");


  const [role, setRole] = useState("pediatrician");
  const {
    chatHistory = {},
    setChatHistory = () => { },
    historyLoaded = {},
    resetChatHistoryForRole = () => { },
  } = useChatStore((state) => state || {});
  const messages = useMemo(() => chatHistory[role] || [], [chatHistory, role]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState(null);

  const [analytics] = useState({
    totalChats: 1247,
    totalMessages: 5832,
    averageResponseTime: 1.2,
    satisfactionRate: 94.5,
    topQuestions: [
      { question: "when_should_baby_crawl", count: 156 },
      { question: "how_to_introduce_solid_foods", count: 134 },
      { question: "good_sleep_schedule_6_months", count: 98 },
      { question: "is_babys_crying_normal", count: 87 },
      { question: "when_do_babies_teeth", count: 76 },
    ],
  });

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { token } = useAuth();

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  const isUserNearBottom = () => {
    const el = chatContainerRef.current;
    if (el) {
      const threshold = 100;
      return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    }
    return true;
  };

  useEffect(() => {
    if (historyLoaded[role]) return;
    const loadHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const messages = await fetchChatHistory(role, token);
        setChatHistory(role, messages);
      } catch (error) {
        setChatHistory(role, []);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    if (token) loadHistory();
  }, [role, token, chatHistory, setChatHistory]);

  useEffect(() => {
    if (messages.length === 0 || isUserNearBottom()) {
      scrollToBottom();
      setShowNewMessageButton(false);
    } else {
      setShowNewMessageButton(true);
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      const el = chatContainerRef.current;
      if (!el) return;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      setShowNewMessageButton(!atBottom);
    };
    const el = chatContainerRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HANDLE ROLE SWITCH & AUTO-CLEAR CHAT ---
  const handleRoleChange = (newRole) => {
    resetChatHistoryForRole(newRole); // auto-clear chat for new role
    setRole(newRole);
    setInput("");
    setIsSending(false);
    // setTransitionMessage(`Switched to ${roles.find(r => r.value === newRole)?.label} mode`);
    setTransitionMessage(t("neochatbot.switched_to_role", { role: t(`neochatbot.${newRole}`) }));
    setTimeout(() => setTransitionMessage(null), 1500);
    scrollToBottom();
  };

  const handleSubmit = async (e = null, customInput = null) => {
    if (e) e.preventDefault();
    const finalInput = customInput !== null ? customInput : input;
    if (!finalInput.trim()) return;
    const newMessage = {
      id: Date.now(),
      role: "user",
      content: finalInput,
      createdAt: new Date().toISOString(),
    };
    const updatedMessages = [...messages, newMessage];
    setChatHistory(role, updatedMessages);
    setInput("");
    setIsSending(true);
    try {
      const res = await axios.post("/api/chat", {
        messages: updatedMessages,
        role,
      });
      const finalMessages = [...updatedMessages, res.data];
      setChatHistory(role, finalMessages);
      await saveChatHistory(role, finalMessages, token);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: "system",
        content: t("neochatbot.oops_something_wrong"),
        createdAt: new Date().toISOString(),
      };
      setChatHistory(role, [...updatedMessages, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    handleSubmit(null, question);
  };

  const handleSpeechTranscript = (transcript) => {
    setInput(transcript);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(t("neochatbot.copied_to_clipboard"));
    } catch {
      alert(t("neochatbot.failed_to_copy"));
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex justify-between items-center bg-pink-100 rounded-t-lg px-6 py-4">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-pink-500" />
            <CardTitle>{t("neochatbot.neonest_ai_chatbot")}</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="border px-3 py-1 rounded-md text-sm bg-white cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {t(`neochatbot.${r.label}`)}
                    </option>
                  ))}
                </select>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                {t("neochatbot.choose_role")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>

        <CardContent className="space-y-6 p-6 relative">
          {transitionMessage && (
            <div className="absolute top-0 left-0 right-0 flex justify-center z-20">
              <span className="bg-pink-200 text-pink-900 px-6 py-2 rounded-lg shadow-lg font-semibold text-base">
                {transitionMessage}
              </span>
            </div>
          )}

          {messages.length === 0 && (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-500 mt-2">
                {t("neochatbot.ai_advice_disclaimer")}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickQuestions.map((q, idx) => (
                  <Button key={idx} onClick={() => handleQuickQuestion(q.text)} variant="outline" className="text-left justify-start text-sm">
                    <q.icon className={`w-4 h-4 mr-2 text-${q.color}-500`} />
                    {t(`neochatbot.${q.text}`)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {isHistoryLoading ? (
            <div className="space-y-4 max-h-[600px] min-h-[500px] overflow-y-auto pr-2 py-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}>
                  <div className={`rounded-xl px-4 py-3 min-w-[60%] ${i % 2 === 0 ? "bg-gray-200" : "bg-gradient-to-r from-pink-300 to-purple-300"}`}>
                    <div className="h-4 bg-white/50 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-white/50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div ref={chatContainerRef} className="space-y-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
              {messages.map((m, index) => (
                <div key={`${m.id || index}-${index}`} className={`flex mt-3 group ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`relative rounded-xl px-4 py-3 max-w-[80%] ${m.role === "user" ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                    {/* Action icons */}
                    <div
                      className={`absolute bottom-full mb-2 flex gap-1 bg-white p-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10
                       ${m.role === "user" ? "right-0" : "left-0"}`}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(m.content)}>
                              <Copy className="w-4 h-4 text-gray-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("neochatbot.copy_to_clipboard")}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {m.role === "assistant" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <TextToSpeech text={m.content} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{t("neochatbot.listen_to_response")}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-full text-sm">
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => <h1 className={`text-2xl font-extrabold mb-2 mt-4 ${m.role === "pediatrician" ? "text-blue-700" : "text-pink-600"}`} {...props} />,
                          h2: ({ node, ...props }) => <h2 className={`text-xl font-semibold mb-2 mt-4 ${m.role === "baby" ? "text-purple-700" : "text-blue-600"}`} {...props} />,
                          h3: ({ node, ...props }) => <h3 className={`text-lg font-semibold mb-2 mt-4 ${m.role === "nani" ? "text-green-700" : "text-pink-500"}`} {...props} />,
                          h4: ({ node, ...props }) => <h4 className={`text-base font-semibold mb-2 mt-4 ${m.role === "general" ? "text-orange-700" : "text-purple-500"}`} {...props} />,
                          p: ({ node, ...props }) => <p className="text-sm leading-relaxed mb-2" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside text-sm mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="ml-4 mb-1" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                          em: ({ node, ...props }) => <em className="italic" {...props} />,
                          code: ({ node, ...props }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-pink-300 pl-4 italic text-sm text-gray-600 my-2" {...props} />,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                    <span className={`text-xs block mt-1 ${m.role === "user" ? "text-gray-300" : "text-pink-700"}`}>{formatTime(m.createdAt)}</span>
                  </div>
                  {m.role === "assistant" && (
                    <div className="flex justify-start mt-2">
                      <TextToSpeech text={m.content} />
                    </div>
                  )}
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start mt-3">
                  <div className="rounded-xl px-4 py-2 max-w-[80%] bg-gray-200 text-gray-800 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{t("neochatbot.ai_is_thinking")}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {showNewMessageButton && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  scrollToBottom();
                  setShowNewMessageButton(false);
                }}
                className="text-sm text-white bg-pink-600 px-4 py-1 rounded-full shadow-md hover:bg-pink-700 transition"
              >
                ⬇ {t("neochatbot.new_message")}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 pt-4 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening... Speak now..." : "Ask me about baby care..."}
              className={`flex-1 ${isListening ? "border-green-500 bg-green-50" : "border-pink-300"}`}
              disabled={isSending}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <SpeechRecognition
                      onTranscript={handleSpeechTranscript}
                      isListening={isListening}
                      setIsListening={setIsListening}
                      disabled={isSending}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {t("neochatbot.voice_input_tooltip")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button type="submit" disabled={isSending || !input.trim()} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t("neochatbot.chat_analytics")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <MessageSquare className="mx-auto text-pink-500" />
              <p className="font-bold">{analytics.totalChats}</p>
              <p className="text-xs text-gray-500">{t("neochatbot.total_conversations")}</p>
            </div>
            <div>
              <Users className="mx-auto text-purple-500" />
              <p className="font-bold">{analytics.totalMessages}</p>
              <p className="text-xs text-gray-500">{t("neochatbot.total_messages")}</p>
            </div>
            <div>
              <Clock className="mx-auto text-blue-500" />
              <p className="font-bold">{analytics.averageResponseTime}s</p>
              <p className="text-xs text-gray-500">{t("neochatbot.average_response_time")}</p>
            </div>
            <div>
              <ThumbsUp className="mx-auto text-green-500" />
              <p className="font-bold">{analytics.satisfactionRate}%</p>
              <p className="text-xs text-gray-500">{t("neochatbot.satisfaction_rate")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("neochatbot.top_questions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.topQuestions?.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q.question)}
                className="flex justify-between text-sm border-b pb-1 w-full text-left hover:bg-gray-100 px-2 py-1 rounded transition"
              >
                <span>{t(`neochatbot.${q.question}`)}</span>
                <Badge variant="secondary">{q.count}</Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
