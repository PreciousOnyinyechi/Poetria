
import { useState } from "react";
import { Calendar, Heart, Share2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const DailyPoetry = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  // Format date for database query
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Fetch daily featured poem
  const { data: dailyPoem, isLoading } = useQuery({
    queryKey: ["daily-poem", formatDate(selectedDate)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_featured_poems')
        .select('*')
        .eq('featured_date', formatDate(selectedDate))
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily poem:', error);
        return null;
      }
      
      return data;
    },
  });

  const sharePoem = async () => {
    if (!dailyPoem) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Daily Poetry: ${dailyPoem.title}`,
          text: `Check out today's featured poem: "${dailyPoem.title}" by ${dailyPoem.author}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `Daily Poetry: "${dailyPoem.title}" by ${dailyPoem.author} - ${dailyPoem.content.substring(0, 100)}...`
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

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const isToday = formatDate(selectedDate) === formatDate(new Date());
  const isFuture = selectedDate > new Date();

  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 border border-purple-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-purple-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">
              {isToday ? "Today's Poetry" : "Daily Poetry"}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="p-1 h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-gray-600 min-w-[100px] text-center">
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: selectedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('next')}
              className="p-1 h-8 w-8"
              disabled={isFuture}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {dailyPoem ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {dailyPoem.title}
                </h3>
                <p className="text-purple-600 font-medium mb-3">
                  by {dailyPoem.author}
                </p>
                {dailyPoem.theme && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 mb-3">
                    {dailyPoem.theme}
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm leading-relaxed font-serif whitespace-pre-wrap text-gray-800">
                {dailyPoem.content}
              </pre>
            </div>

            {dailyPoem.background_info && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Background</h4>
                <p className="text-sm text-blue-700">{dailyPoem.background_info}</p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Heart className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600" onClick={sharePoem}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No poem for this day</h3>
            <p className="text-gray-500 text-sm">
              {isFuture 
                ? "Check back on this date for the daily poem" 
                : "No featured poem was published for this date"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyPoetry;
