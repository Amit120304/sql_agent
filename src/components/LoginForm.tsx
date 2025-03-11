import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DatabaseIcon, KeyIcon, ServerIcon, UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  user: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  host: z.string().min(1, 'Host is required'),
  port: z.string().regex(/^\d+$/, 'Port must be a number'),
  database: z.string().min(1, 'Database name is required'),
  databasetype: z.enum(['Postgres', 'SQLlite', 'MongoDB']),
});
export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: '',
      password: '',
      host: '',
      port: '',
      database: '',
      databasetype: 'Postgres',
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("s");
    try {
      // For testing, we'll simulate an API call
      const response = await fetch('http://127.0.0.1:8000/database/createconnection ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
console.log(response);
      if (!response.ok) {
        throw new Error('Login failed');
      }
console.log(values);
      const data = await response.json();
console.log(data);
      // Store any necessary data in localStorage or state management
      localStorage.setItem('userCredentials', JSON.stringify(data));//earlies values was used
      
      navigate('/chat');
    } catch (error) {
      console.log("here");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred, please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
<div className="flex min-h-[95vh] w-full items-center justify-center">
  <div className="w-full max-w-md space-y-3 bg-white p-5 shadow-lg sm:rounded-lg">
    <div className="text-center">
      <h1 className="text-2xl font-semibold">Database Connection</h1>
      <p className="text-sm text-muted-foreground">
        Enter your database credentials to connect
      </p>
    </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <UserIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="username" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="password" className="pl-8" placeholder="••••••••" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host</FormLabel>
              <FormControl>
                <div className="relative">
                  <ServerIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="localhost" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5432" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="database"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Database</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DatabaseIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8" placeholder="mydatabase" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="databasetype"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Postgres">Postgres</SelectItem>
                  <SelectItem value="SQLlite">SQLlite</SelectItem>
                  <SelectItem value="MongoDB">MongoDB</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect"}
        </Button>
      </form>
    </Form>
  </div>
</div>


  );
}