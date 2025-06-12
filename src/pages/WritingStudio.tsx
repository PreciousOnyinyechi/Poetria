
import { useState, useEffect } from "react";
import { Save, Share2, Eye, PenTool, Type, Palette, BookOpen, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import LoginButton from "@/components/LoginButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const WritingStudio = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("free_verse");
  const [fontSize, setFontSize] = useState([16]);
  const [fontFamily, setFontFamily] = useState("serif");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Fetch user's saved poems
  const { data: savedPoems = [], refetch } = useQuery({
    queryKey: ["userPoems", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_audio', false)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching poems:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  const fontOptions = [
    { value: "serif", name: "Serif" },
    { value: "sans", name: "Sans Serif" },
    { value: "mono", name: "Monospace" },
    { value: "cursive", name: "Cursive" }
  ];

  const templates = [
    { name: "Sonnet", structure: "14 lines, ABAB CDCD EFEF GG rhyme scheme", category: "sonnet" },
    { name: "Haiku", structure: "3 lines, 5-7-5 syllable pattern", category: "haiku" },
    { name: "Free Verse", structure: "No formal constraints", category: "free_verse" },
    { name: "Limerick", structure: "5 lines, AABBA rhyme scheme", category: "limerick" }
  ];

  const handleSave = async (isDraft = true) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save poems.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing content",
        description: "Please add both a title and content to your poem.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        // Update existing poem
        const { error } = await supabase
          .from('poems')
          .update({
            title: title.trim(),
            content: content.trim(),
            category,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Poem updated!",
          description: "Your poem has been updated successfully.",
        });
      } else {
        // Create new poem
        const { error } = await supabase
          .from('poems')
          .insert({
            title: title.trim(),
            content: content.trim(),
            category,
            user_id: user.id,
            is_audio: false,
          });

        if (error) throw error;
        
        toast({
          title: "Poem saved!",
          description: isDraft ? "Your poem has been saved as a draft." : "Your poem has been published!",
        });
      }

      refetch();
      queryClient.invalidateQueries({ queryKey: ["poems"] });
      
    } catch (error: any) {
      console.error('Error saving poem:', error);
      toast({
        title: "Error saving poem",
        description: error.message || "There was an error saving your poem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    await handleSave(false);
  };

  const handleNew = () => {
    if (title.trim() || content.trim()) {
      if (confirm("Create a new poem? Your current work will be cleared.")) {
        setTitle("");
        setContent("");
        setCategory("free_verse");
        setEditingId(null);
      }
    } else {
      setTitle("");
      setContent("");
      setCategory("free_verse");
      setEditingId(null);
    }
  };

  const handleEdit = (poem: any) => {
    setTitle(poem.title);
    setContent(poem.content);
    setCategory(poem.category || "free_verse");
    setEditingId(poem.id);
  };

  const handleDelete = async (poemId: string) => {
    if (!confirm("Are you sure you want to delete this poem?")) return;

    try {
      const { error } = await supabase
        .from('poems')
        .delete()
        .eq('id', poemId);

      if (error) throw error;

      toast({
        title: "Poem deleted",
        description: "Your poem has been deleted successfully.",
      });

      refetch();
      
      // Clear editor if we were editing this poem
      if (editingId === poemId) {
        handleNew();
      }
    } catch (error: any) {
      toast({
        title: "Error deleting poem",
        description: error.message || "Failed to delete poem.",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setCategory(template.category);
    toast({
      title: `${template.name} template selected`,
      description: template.structure,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PenTool className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Writing Studio
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <LoginButton />
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4" />
                <span className="hidden lg:inline">Preview</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-sm"
                onClick={() => handleSave(true)}
                disabled={saving || publishing}
              >
                <Save className="w-4 h-4" />
                <span className="hidden lg:inline">{saving ? "Saving..." : "Save Draft"}</span>
              </Button>
              <Button 
                className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700"
                onClick={handlePublish}
                disabled={saving || publishing}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden lg:inline">{publishing ? "Publishing..." : "Publish"}</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleNew}
              >
                New
              </Button>
            </div>
          </div>
          {isMobile && (
            <div className="mt-2 flex justify-end">
              <LoginButton />
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Writing Area */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-3 sm:pb-4">
                <Input
                  placeholder="Enter your poem title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg sm:text-2xl font-bold border-none shadow-none p-0 focus-visible:ring-0"
                />
                {editingId && (
                  <div className="text-sm text-purple-600 font-medium">
                    Editing saved poem
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start writing your poem here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] sm:min-h-[500px] border-none shadow-none resize-none focus-visible:ring-0 text-sm sm:text-base"
                  style={{ 
                    fontSize: `${fontSize[0]}px`,
                    fontFamily: fontFamily === 'serif' ? 'serif' : 
                               fontFamily === 'sans' ? 'sans-serif' :
                               fontFamily === 'mono' ? 'monospace' : 'cursive'
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Mobile Action Buttons */}
            <div className="flex sm:hidden gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleSave(true)}
                disabled={saving || publishing}
              >
                <Save className="w-4 h-4 mr-1" />
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handlePublish}
                disabled={saving || publishing}
              >
                <Share2 className="w-4 h-4 mr-1" />
                {publishing ? "Publishing..." : "Publish"}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleNew}
              >
                New
              </Button>
            </div>

            {/* Saved Poems */}
            {user && savedPoems.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    My Poems ({savedPoems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {savedPoems.map((poem) => (
                      <div key={poem.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{poem.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(poem.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(poem)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(poem.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Writing Tools */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Type className="w-4 h-4 sm:w-5 sm:h-5" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Font Size</Label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    max={24}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{fontSize[0]}px</div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Font Family</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {fontOptions.map((font) => (
                      <Button
                        key={font.value}
                        variant={fontFamily === font.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFontFamily(font.value)}
                        className={`text-xs ${fontFamily === font.value ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                      >
                        {font.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {templates.map((template, index) => (
                    <Button
                      key={index}
                      variant={category === template.category ? "default" : "outline"}
                      className={`w-full text-left justify-start h-auto p-3 ${
                        category === template.category ? "bg-purple-600 hover:bg-purple-700" : ""
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div>
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{template.structure}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Word Count */}
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                      {content.split(/\s+/).filter(word => word.length > 0).length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">Words</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                      {content.split('\n').filter(line => line.trim().length > 0).length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">Lines</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default WritingStudio;
