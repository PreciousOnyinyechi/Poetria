import { useState } from "react";
import { Mic, BookOpen, Users, Trophy, Search, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/BottomNavigation";
import LoginButton from "@/components/LoginButton";
import AudioRecorder from "@/components/AudioRecorder";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const RecitationStudio = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPoem, setSelectedPoem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("poems");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  // Fetch all poems for recitation
  const { data: allPoems = [], isLoading } = useQuery({
    queryKey: ["recitationPoems"],
    queryFn: async () => {
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
      
      return data || [];
    },
  });

  // Fetch user's recordings
  const { data: userRecordings = [] } = useQuery({
    queryKey: ["userRecordings", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .eq('user_id', user.id)
        .not('recording_url', 'is', null)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching recordings:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Save recording mutation
  const saveRecordingMutation = useMutation({
    mutationFn: async ({ poemId, audioBlob, duration }: { poemId: string; audioBlob: Blob; duration: number }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // For now, we'll store recording info in the poems table
      // In a real app, you'd upload the audioBlob to storage first
      const { error } = await supabase
        .from('poems')
        .upsert({
          id: poemId,
          user_id: user.id,
          title: selectedPoem?.title || "Recorded Poem",
          content: selectedPoem?.content || "",
          recording_duration: duration,
          is_recording_public: false,
          category: selectedPoem?.category || "recitation",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Recording saved",
        description: "Your recitation has been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["userRecordings"] });
      setSelectedPoem(null);
      setActiveTab("recordings");
    },
    onError: (error) => {
      console.error("Error saving recording:", error);
      toast({
        title: "Save failed",
        description: "Could not save your recording. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredPoems = allPoems.filter(poem =>
    poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (poem.external_author && poem.external_author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveRecording = (audioBlob: Blob, duration: number) => {
    if (selectedPoem) {
      saveRecordingMutation.mutate({
        poemId: selectedPoem.id,
        audioBlob,
        duration,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className={`container mx-auto ${isMobile ? 'px-4' : 'px-6'} py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-purple-600`} />
              <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
                Recitation Studio
              </h1>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      <div className={`container mx-auto ${isMobile ? 'px-4 py-4' : 'px-6 py-8'}`}>
        {selectedPoem ? (
          /* Recording Interface */
          <div className={`space-y-${isMobile ? '4' : '6'}`}>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => setSelectedPoem(null)}
              >
                ← Back to Poems
              </Button>
              <Badge variant="secondary">{selectedPoem.category}</Badge>
            </div>

            <Card>
              <CardHeader className={isMobile ? 'p-4' : ''}>
                <CardTitle className={isMobile ? 'text-lg' : ''}>{selectedPoem.title}</CardTitle>
                <p className={`text-purple-600 ${isMobile ? 'text-sm' : ''}`}>
                  by {selectedPoem.external_author || "Unknown Author"}
                </p>
              </CardHeader>
              <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
                <div className={`whitespace-pre-wrap text-gray-700 mb-6 ${isMobile ? 'max-h-48 text-sm' : 'max-h-64'} overflow-y-auto`}>
                  {selectedPoem.content}
                </div>
              </CardContent>
            </Card>

            <AudioRecorder
              poemTitle={selectedPoem.title}
              poemContent={selectedPoem.content}
              onSave={handleSaveRecording}
            />
          </div>
        ) : (
          /* Main Interface */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-3 ${isMobile ? 'h-auto' : ''}`}>
              <TabsTrigger value="poems" className={`flex items-center gap-2 ${isMobile ? 'text-xs px-2 py-2' : ''}`}>
                <BookOpen className="w-4 h-4" />
                {!isMobile && "Poems"}
              </TabsTrigger>
              <TabsTrigger value="recordings" className={`flex items-center gap-2 ${isMobile ? 'text-xs px-2 py-2' : ''}`}>
                <Mic className="w-4 h-4" />
                {!isMobile && "My Recordings"}
              </TabsTrigger>
              <TabsTrigger value="community" className={`flex items-center gap-2 ${isMobile ? 'text-xs px-2 py-2' : ''}`}>
                <Users className="w-4 h-4" />
                {!isMobile && "Community"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="poems" className={`space-y-${isMobile ? '4' : '6'}`}>
              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search poems to recite..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                  {filteredPoems.map((poem) => (
                    <Card key={poem.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardHeader className={isMobile ? 'p-4' : ''}>
                        <Badge variant="secondary" className="w-fit">
                          {poem.category || "general"}
                        </Badge>
                        <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>{poem.title}</CardTitle>
                        <p className={`text-purple-600 ${isMobile ? 'text-sm' : ''}`}>
                          by {poem.external_author || "Unknown Author"}
                        </p>
                      </CardHeader>
                      <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
                        <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-sm'} mb-4 line-clamp-3`}>
                          {poem.content}
                        </p>
                        <Button
                          onClick={() => setSelectedPoem(poem)}
                          className="w-full"
                          size={isMobile ? "sm" : "default"}
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recordings" className={`space-y-${isMobile ? '4' : '6'}`}>
              <div className="text-center">
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4`}>My Recordings</h2>
                <p className={`text-gray-600 mb-6 ${isMobile ? 'text-sm' : ''}`}>Listen to your recorded recitations</p>
              </div>

              {userRecordings.length === 0 ? (
                <div className="text-center py-12">
                  <Mic className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-600 mb-2`}>No Recordings Yet</h3>
                  <p className={`text-gray-500 mb-4 ${isMobile ? 'text-sm' : ''}`}>Start by recording your first poem recitation</p>
                  <Button onClick={() => setActiveTab("poems")} size={isMobile ? "sm" : "default"}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Poems
                  </Button>
                </div>
              ) : (
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                  {userRecordings.map((recording) => (
                    <Card key={recording.id} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader className={isMobile ? 'p-4' : ''}>
                        <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>{recording.title}</CardTitle>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                          Recorded on {new Date(recording.created_at).toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
                        <div className={`space-y-${isMobile ? '3' : '4'}`}>
                          <div className="flex items-center justify-between">
                            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                              Duration: {recording.recording_duration ? formatDuration(recording.recording_duration) : "Unknown"}
                            </span>
                            <Badge variant={recording.is_recording_public ? "default" : "secondary"}>
                              {recording.is_recording_public ? "Public" : "Private"}
                            </Badge>
                          </div>
                          <Button variant="outline" className="w-full" size={isMobile ? "sm" : "default"}>
                            <Play className="w-4 h-4 mr-2" />
                            Play Recording
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="community" className={`space-y-${isMobile ? '4' : '6'}`}>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-600 mb-2`}>Community Features Coming Soon</h3>
                <p className={`text-gray-500 ${isMobile ? 'text-sm' : ''}`}>Share your recordings and listen to others' recitations</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default RecitationStudio;
