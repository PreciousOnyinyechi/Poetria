
import { useState } from "react";
import { Volume2, Download, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import LoginButton from "@/components/LoginButton";
import AudioPlayer from "@/components/AudioPlayer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const AudioLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fetch all poems (user poems, external poems, and daily featured poems)
  const { data: allPoems = [], isLoading } = useQuery({
    queryKey: ["allPoems"],
    queryFn: async () => {
      console.log("Fetching all poems...");
      const { data, error } = await supabase
        .from('all_poems')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching poems:", error);
        toast({
          title: "Error loading poems",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      console.log("Fetched poems:", data?.length);
      return data || [];
    },
  });

  // Transform poems for audio display
  const audioPoems = allPoems.map(poem => ({
    id: poem.id,
    title: poem.title,
    author: poem.external_author || (user?.user_metadata?.full_name) || "Unknown Author",
    narrator: poem.source_type === 'user' ? (user?.user_metadata?.full_name || "You") : "AI Narrator",
    category: poem.category || "general",
    likes: Math.floor(Math.random() * 1000),
    downloads: Math.floor(Math.random() * 500),
    content: poem.content,
    audio_url: poem.audio_url,
    source_type: poem.source_type
  }));

  const filteredAudio = audioPoems.filter(poem =>
    poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poem.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (poem.narrator && poem.narrator.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePlay = (id: string) => {
    setCurrentlyPlaying(id);
    console.log("Playing poem:", id);
  };

  const handlePause = () => {
    setCurrentlyPlaying(null);
    console.log("Paused playback");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-purple-600`} />
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
                Audio Library
              </h1>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search audio poems..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredAudio.length === 0 ? (
          <div className="text-center py-12">
            <Volume2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Audio Poems Found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later for new content.</p>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            <div className="mb-6 sm:mb-8">
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4 text-gray-800`}>Featured Narrations</h2>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAudio.slice(0, 3).map((poem) => (
                  <Card key={poem.id} className="hover:shadow-lg transition-all duration-300 border-purple-100">
                    <CardHeader className="pb-3">
                      <Badge variant="secondary" className="w-fit bg-purple-100 text-purple-700 text-xs">
                        {poem.category}
                      </Badge>
                      <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-800 leading-tight`}>
                        {poem.title}
                      </CardTitle>
                      <p className={`text-purple-600 font-medium ${isMobile ? 'text-sm' : ''}`}>by {poem.author}</p>
                      <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>Narrated by {poem.narrator}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Audio Player */}
                        <AudioPlayer
                          audioUrl={poem.audio_url}
                          title={poem.title}
                          onPlay={() => handlePlay(poem.id)}
                          onPause={handlePause}
                        />

                        {/* Stats and Actions */}
                        <div className={`flex items-center ${isMobile ? 'flex-col gap-2' : 'justify-between'}`}>
                          <div className={`flex items-center gap-4 ${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {poem.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {poem.downloads}
                            </span>
                          </div>
                          <Button size={isMobile ? "sm" : "sm"} variant="outline" disabled={!poem.audio_url}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* All Audio List */}
            <div>
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4 text-gray-800`}>All Audio Poems</h2>
              <div className="space-y-3 sm:space-y-4">
                {filteredAudio.map((poem) => (
                  <Card key={poem.id} className="hover:shadow-md transition-all duration-300">
                    <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                      <div className="space-y-3 sm:space-y-4">
                        <div className={`flex items-start ${isMobile ? 'flex-col gap-2' : 'justify-between'}`}>
                          <div className={isMobile ? 'w-full' : ''}>
                            <h3 className={`font-semibold text-gray-800 ${isMobile ? 'text-base' : ''}`}>{poem.title}</h3>
                            <p className={`text-purple-600 ${isMobile ? 'text-sm' : 'text-sm'}`}>by {poem.author}</p>
                            <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>Narrated by {poem.narrator}</p>
                          </div>
                          <div className={`flex items-center gap-4 ${isMobile ? 'text-xs w-full justify-between' : 'text-sm'} text-gray-500`}>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {poem.likes}
                            </span>
                            <Button size="sm" variant="ghost" disabled={!poem.audio_url}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <AudioPlayer
                          audioUrl={poem.audio_url}
                          title={poem.title}
                          onPlay={() => handlePlay(poem.id)}
                          onPause={handlePause}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Load More */}
            <div className="text-center mt-6 sm:mt-8">
              <Button variant="outline" size={isMobile ? "default" : "lg"}>
                Load More Audio
              </Button>
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default AudioLibrary;
