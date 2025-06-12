import { useState } from "react";
import { Search, Filter, BookOpen, Heart, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BottomNavigation from "@/components/BottomNavigation";
import LoginButton from "@/components/LoginButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [likedPoems, setLikedPoems] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    "all", "classic", "modern", "romantic", "nature", "spiritual", "social", "free_verse", "external"
  ];

  const sources = [
    "all", "internal", "external"
  ];

  // Fetch all poems (internal and external)
  const { data: poems = [], isLoading } = useQuery({
    queryKey: ["all-poems", selectedCategory, selectedSource, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('all_poems')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (selectedSource !== "all") {
        query = query.eq('source_type', selectedSource);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%, content.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching poems:', error);
        return [];
      }
      
      return data || [];
    },
  });

  const sharePoem = async (poem: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: poem.title,
          text: `Check out this beautiful poem: "${poem.title}"`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(
          `Check out this beautiful poem: "${poem.title}" - ${poem.content.substring(0, 100)}...`
        );
        toast({
          title: "Link copied!",
          description: "Poem details copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Share failed",
        description: "Unable to share this poem",
        variant: "destructive",
      });
    }
  };

  const toggleLike = (poemId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like poems",
        variant: "destructive",
      });
      return;
    }

    setLikedPoems(prev => 
      prev.includes(poemId) 
        ? prev.filter(id => id !== poemId)
        : [...prev, poemId]
    );

    toast({
      title: likedPoems.includes(poemId) ? "Removed from favorites" : "Added to favorites",
      description: likedPoems.includes(poemId) ? "Poem removed from your favorites" : "Poem added to your favorites",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Poetry Library
              </h1>
            </div>
            <div className="hidden md:block">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search and Filter Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                placeholder="Search poems, authors..."
                className="pl-8 sm:pl-10 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 text-sm sm:text-base">
              <Filter className="w-4 h-4" />
              Advanced Filter
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-xs sm:text-sm ${selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Source Filter */}
          <div className="flex flex-wrap gap-2">
            {sources.map((source) => (
              <Button
                key={source}
                variant={selectedSource === source ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSource(source)}
                className={`text-xs sm:text-sm ${selectedSource === source ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              >
                {source.charAt(0).toUpperCase() + source.slice(1)} Poems
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm sm:text-base">
            {poems.length} poem{poems.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Poems Grid */}
        <div className="grid gap-4 sm:gap-6">
          {poems.map((poem) => (
            <Card key={poem.id} className="hover:shadow-lg transition-all duration-300 border-purple-100">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                      {poem.title}
                    </CardTitle>
                    <div className="flex flex-col gap-1">
                      {poem.external_author && (
                        <p className="text-blue-600 font-medium text-sm sm:text-base">
                          by {poem.external_author}
                        </p>
                      )}
                      <p className="text-purple-600 font-medium text-sm sm:text-base">
                        Created: {new Date(poem.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                      {poem.category}
                    </Badge>
                    <Badge variant={poem.source_type === 'external' ? "outline" : "default"} className="text-xs">
                      {poem.source_type === 'external' ? 'External' : 'Community'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                  {poem.content.substring(0, 150)}...
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`flex items-center gap-2 text-sm ${
                        likedPoems.includes(poem.id) ? "text-red-500" : "text-gray-600"
                      }`}
                      onClick={() => toggleLike(poem.id)}
                    >
                      <Heart 
                        className={`w-4 h-4 ${likedPoems.includes(poem.id) ? "fill-current" : ""}`}
                      />
                      Like
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 text-gray-600 text-sm"
                      onClick={() => sharePoem(poem)}
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-sm w-full sm:w-auto">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read Full Poem
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-purple-800">
                          {poem.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <div className="mb-4 flex gap-2">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {poem.category}
                          </Badge>
                          <Badge variant={poem.source_type === 'external' ? "outline" : "default"}>
                            {poem.source_type === 'external' ? 'External Source' : 'Community'}
                          </Badge>
                        </div>
                        {poem.external_author && (
                          <p className="text-blue-600 font-medium mb-4">by {poem.external_author}</p>
                        )}
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <pre className="text-base leading-relaxed font-serif whitespace-pre-wrap text-gray-800">
                            {poem.content}
                          </pre>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={`flex items-center gap-2 ${
                                likedPoems.includes(poem.id) ? "text-red-500 border-red-200" : ""
                              }`}
                              onClick={() => toggleLike(poem.id)}
                            >
                              <Heart 
                                className={`w-4 h-4 ${likedPoems.includes(poem.id) ? "fill-current" : ""}`}
                              />
                              {likedPoems.includes(poem.id) ? "Liked" : "Like"}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => sharePoem(poem)}
                            >
                              <Share2 className="w-4 h-4" />
                              Share
                            </Button>
                            {poem.original_url && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-2"
                                onClick={() => window.open(poem.original_url, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
                                Source
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(poem.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {poems.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No poems found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Be the first to add a poem to the library!"}
            </p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => window.location.href = "/write"}
            >
              Write a Poem
            </Button>
          </div>
        )}

        {/* Load More */}
        {poems.length > 0 && (
          <div className="text-center mt-6 sm:mt-8">
            <Button variant="outline" size="lg" className="text-sm sm:text-base">
              Load More Poems
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Library;
