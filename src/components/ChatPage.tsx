import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
// import ReactMarkdown from 'react-markdown'; // Install via: npm install react-markdown
// import remarkGfm from 'remark-gfm'; // Enables tables, strikethrough, etc.
import BotResponse from './BotResponse';
interface Message {
  type: 'user' | 'bot';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPopup, setIsLoadingPopup] = useState(false); // Popup state

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);
    setIsLoadingPopup(true); // Show loading popup
    try {
      const response = await fetch(`http://127.0.0.1:8000/query/${userMessage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Simulated response for testing
      const result = await response.json();
      setMessages(prev => [...prev, { type: 'bot', content: JSON.stringify(result) }]);
    } catch (error) {
      alert("An error occurred, please try again later.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred, please try again later.",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsLoadingPopup(false), 300); // Hide popup after 0.3s delay
    }
  };

  return (
<div className="flex h-screen w-screen flex-col bg-blue-200 overflow-hidden">
  {/* Fixed Header / App Name */}
  <div className="fixed text-left top-0 left-2 right-0 bg-primary text-primary-foreground py-3 px-6 text-lg font-bold shadow-md z-10">
    SQL AI
  </div>

      {/* Popup Loader */}
      {isLoadingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-lg flex flex-col items-center">
            <div className="animate-spin border-4 border-gray-300 border-t-primary-500 rounded-full w-10 h-10 mb-3"></div>
            <p className="text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      )}

  {/* Chat Messages Container */}
  <div className="flex-1 custom-scrollbar overflow-y-auto m-5 p-5 pb-10 flex flex-col items-start w-screen">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`w-full flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[80%] bg-gray-200 rounded-lg p-4 m-2 overflow-hidden ${
            message.type === 'user'
              ? 'bg-gray-200'
              : 'bg-gray-200'
          }`}
        >
        {/* Apply Markdown for bot messages */}
        {message.type === "bot" ? (
          <div className = "text-left">
  <BotResponse 
    message={JSON.parse(message.content)} // ✅ Parse JSON before passing to BotResponse
  />
  </div>
) : (
  <div className=" bg-gray-200 text-black rounded-lg">
    {message.content}
  </div>
)}

        </div>
      </div>
    ))}
  </div>

  {/* Chat Input Form */}
  <form 
    onSubmit={handleSubmit} 
    className="border-t p-4 fixed bottom-0 left-0 right-0 w-full bg-background"
  >
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your query..."
        disabled={isLoading}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        <SendHorizontal className="w-10" />
      </Button>
    </div>
  </form>
</div>

  );
}