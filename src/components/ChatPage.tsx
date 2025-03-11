import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

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
      // For testing, we'll simulate an API call with a dummy response
      const response = await fetch('http://localhost:3000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Simulated response for testing
      const data = { response: `This is a dummy response to: "${userMessage}"` };
      
      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
    } catch (error) {
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
  {/* Chat Messages Container */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-log flex flex-col items-start">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`w-full flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[80%] rounded-lg p-4 ${
            message.type === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          {message.content}
        </div>
      </div>
    ))}
  </div>

  {/* Chat Input Form */}
  <form 
    onSubmit={handleSubmit} 
    className="border-t p-4 fixed bottom-0 left-0 right-0 w-full chat-input bg-background"
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