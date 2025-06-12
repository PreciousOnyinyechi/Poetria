
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ExternalLink, RefreshCw, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ExternalPoemSource } from "@/types/poems";

const ExternalSourcesManager = () => {
  const [newSource, setNewSource] = useState({
    name: "",
    url: "",
    api_endpoint: ""
  });
  const [isAddingSource, setIsAddingSource] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch external poem sources
  const { data: sources = [], isLoading } = useQuery({
    queryKey: ["external-poem-sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_poem_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sources:', error);
        return [];
      }

      return data as ExternalPoemSource[];
    },
  });

  // Add new source mutation
  const addSourceMutation = useMutation({
    mutationFn: async (sourceData: typeof newSource) => {
      const { data, error } = await supabase
        .from('external_poem_sources')
        .insert([{
          name: sourceData.name,
          url: sourceData.url,
          api_endpoint: sourceData.api_endpoint || null,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-poem-sources"] });
      setNewSource({ name: "", url: "", api_endpoint: "" });
      setIsAddingSource(false);
      toast({
        title: "Source added",
        description: "External poem source has been added successfully.",
      });
    },
    onError: (error) => {
      console.error('Error adding source:', error);
      toast({
        title: "Error",
        description: "Failed to add external poem source.",
        variant: "destructive",
      });
    },
  });

  // Toggle source active status
  const toggleSourceMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('external_poem_sources')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-poem-sources"] });
      toast({
        title: "Source updated",
        description: "Source status has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating source:', error);
      toast({
        title: "Error",
        description: "Failed to update source status.",
        variant: "destructive",
      });
    },
  });

  const handleAddSource = () => {
    if (!newSource.name || !newSource.url) {
      toast({
        title: "Missing fields",
        description: "Please provide both name and URL for the source.",
        variant: "destructive",
      });
      return;
    }

    addSourceMutation.mutate(newSource);
  };

  const handleToggleSource = (id: string, currentStatus: boolean) => {
    toggleSourceMutation.mutate({ id, is_active: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">External Poem Sources</h2>
        <Dialog open={isAddingSource} onOpenChange={setIsAddingSource}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add External Poem Source</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="source-name">Source Name</Label>
                <Input
                  id="source-name"
                  placeholder="e.g., Poetry Foundation"
                  value={newSource.name}
                  onChange={(e) => setNewSource(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="source-url">Website URL</Label>
                <Input
                  id="source-url"
                  placeholder="https://example.com"
                  value={newSource.url}
                  onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="api-endpoint">API Endpoint (Optional)</Label>
                <Textarea
                  id="api-endpoint"
                  placeholder="API endpoint for automated poem fetching"
                  value={newSource.api_endpoint}
                  onChange={(e) => setNewSource(prev => ({ ...prev, api_endpoint: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddSource}
                  disabled={addSourceMutation.isPending}
                  className="flex-1"
                >
                  {addSourceMutation.isPending ? "Adding..." : "Add Source"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingSource(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sources.map((source) => (
          <Card key={source.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                  <Badge variant={source.is_active ? "default" : "secondary"}>
                    {source.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`toggle-${source.id}`} className="text-sm">
                    Active
                  </Label>
                  <Switch
                    id={`toggle-${source.id}`}
                    checked={source.is_active}
                    onCheckedChange={() => handleToggleSource(source.id, source.is_active)}
                    disabled={toggleSourceMutation.isPending}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {source.url}
                  </a>
                </div>
                {source.api_endpoint && (
                  <div className="text-sm text-gray-600">
                    <strong>API:</strong> {source.api_endpoint}
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Created: {new Date(source.created_at).toLocaleDateString()}</span>
                  {source.last_sync && (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Last sync: {new Date(source.last_sync).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sources.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No external sources</h3>
          <p className="text-gray-500 mb-4">
            Add external poetry sources to expand your library collection.
          </p>
          <Button onClick={() => setIsAddingSource(true)}>
            Add Your First Source
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExternalSourcesManager;
