import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown'; // Install via: npm install react-markdown
import remarkGfm from 'remark-gfm'; // Enables tables, strikethrough, etc.
interface Message {
  type: 'user' | 'bot';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

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
      const result = await response.text();
      setMessages(prev => [...prev, { type: 'bot', content: result }]);
    } catch (error) {
      alert("An error occurred, please try again later.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred, please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="flex h-screen w-screen flex-col bg-background overflow-hidden">
  {/* Fixed Header / App Name */}
  <div className="fixed text-left top-0 left-2 right-0 bg-primary text-primary-foreground py-3 px-6 text-lg font-bold shadow-md z-10">
    Chat Application
  </div>
  {/* Chat Messages Container */}
  <div className="flex-1 overflow-y-auto m-5 p-5 pb-10 flex flex-col items-start w-screen">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`w-full flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[80%] rounded-lg p-4 overflow-hidden ${
            message.type === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
        {/* Apply Markdown for bot messages */}
        {message.type === 'bot' ? (
          <div className="prose prose-sm text-left break-words">
          <ReactMarkdown remarkPlugins={[remarkGfm]} >
            {message.content}
          </ReactMarkdown>
          </div>
        ) : (
          message.content
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