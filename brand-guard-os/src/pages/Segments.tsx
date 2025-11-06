import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Loader2 } from 'lucide-react';
import { useSegments } from '@/hooks/useSegments';

export default function Segments() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch segments using hook
  const { data: segments, isLoading } = useSegments();

  const filteredSegments = segments?.filter((segment) =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const segmentTypeColors = {
    DEMOGRAPHIC: 'bg-blue-100 text-blue-800 border-blue-200',
    INSTITUTIONAL: 'bg-purple-100 text-purple-800 border-purple-200',
    BEHAVIOURAL: 'bg-teal-100 text-teal-800 border-teal-200',
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Segments</h1>
          <p className="text-muted-foreground mt-1">Build and manage audience segments</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Segments</h1>
          <p className="text-muted-foreground mt-1">Build and manage audience segments</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Segment
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search segments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSegments.map((segment) => (
          <Card key={segment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                  <CardDescription className="mt-1">{segment.description}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={segmentTypeColors[segment.segmentType]}
                >
                  {segment.segmentType.toLowerCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{segment.estimatedCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Estimated count</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Query Criteria</p>
                <div className="space-y-1">
                  {Object.entries(segment.query).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Duplicate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSegments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No segments found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
