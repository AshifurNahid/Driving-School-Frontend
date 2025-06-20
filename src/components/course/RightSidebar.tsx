
import { useState } from 'react';
import { 
  BookOpen, 
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const RightSidebar = () => {
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="discussion">Q&A</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                My Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Take notes about this lesson..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <Button className="w-full mt-3" variant="outline">
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discussion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground text-center py-8">
                  No questions yet. Be the first to ask!
                </div>
                <Button className="w-full" variant="outline">
                  Ask a Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;
