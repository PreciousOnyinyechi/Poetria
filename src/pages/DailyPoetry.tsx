
import { useState, useEffect } from "react";
import { Calendar, BookOpen, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import LoginButton from "@/components/LoginButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

const DailyPoetry = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyPoemIndex, setDailyPoemIndex] = useState(0);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Collection of poems to cycle through each day
  const poemCollection = [
    {
      title: "Hope is the thing with feathers",
      author: "Emily Dickinson",
      category: "Classic",
      year: 1861,
      content: `Hope is the thing with feathers
That perches in the soul,
And sings the tune without the words,
And never stops at all,

And sweetest in the gale is heard;
And sore must be the storm
That could abash the little bird
That kept so many warm.

I've heard it in the chillest land,
And on the strangest sea;
Yet, never, in extremity,
It asked a crumb of me.`,
      theme: "Hope and resilience",
      background: "Written during a period of personal struggle, this poem captures Dickinson's profound understanding of hope as an enduring force.",
      likes: 2847,
      shares: 456
    },
    {
      title: "The Road Not Taken",
      author: "Robert Frost",
      category: "Classic",
      year: 1916,
      content: `Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear;
Though as for that the passing there
Had worn them really about the same,

And both that morning equally lay
In leaves no step had trodden black.
Oh, I kept the first for another day!
Yet knowing how way leads on to way,
I doubted if I should ever come back.

I shall be telling this with a sigh
Somewhere ages and ages hence:
Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.`,
      theme: "Choices and paths in life",
      background: "One of Frost's most famous works, this poem reflects on the consequences of life choices and the human tendency to assign meaning to decisions in retrospect.",
      likes: 3287,
      shares: 789
    },
    {
      title: "Still I Rise",
      author: "Maya Angelou",
      category: "Modern",
      year: 1978,
      content: `You may write me down in history
With your bitter, twisted lies,
You may trod me in the very dirt
But still, like dust, I'll rise.

Does my sassiness upset you?
Why are you beset with gloom?
'Cause I walk like I've got oil wells
Pumping in my living room.

Just like moons and like suns,
With the certainty of tides,
Just like hopes springing high,
Still I'll rise.`,
      theme: "Resilience and dignity",
      background: "A powerful anthem of resistance and self-affirmation in the face of oppression and prejudice, reflecting Angelou's strength and resilience.",
      likes: 4221,
      shares: 1245
    }
  ];
  
  // Get today's poem based on the date
  const dailyPoem = poemCollection[dailyPoemIndex];

  const weeklyPoems = [
    { day: "Mon", title: "The Road Not Taken", author: "Robert Frost" },
    { day: "Tue", title: "Still I Rise", author: "Maya Angelou" },
    { day: "Wed", title: "Hope is the thing...", author: "Emily Dickinson" },
    { day: "Thu", title: "If—", author: "Rudyard Kipling" },
    { day: "Fri", title: "The Guest House", author: "Rumi" },
    { day: "Sat", title: "Phenomenal Woman", author: "Maya Angelou" },
    { day: "Sun", title: "Do not go gentle...", author: "Dylan Thomas" }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
      setDailyPoemIndex((dailyPoemIndex - 1 + poemCollection.length) % poemCollection.length);
    } else {
      newDate.setDate(newDate.getDate() + 1);
      setDailyPoemIndex((dailyPoemIndex + 1) % poemCollection.length);
    }
    setCurrentDate(newDate);
    
    toast({
      title: "New daily poem loaded",
      description: `Showing poem for ${formatDate(newDate)}`,
    });
  };

  // Set index based on day of year to ensure consistent poem on page refresh
  useEffect(() => {
    const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setDailyPoemIndex(dayOfYear % poemCollection.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Daily Poetry
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs sm:text-sm font-medium px-2 sm:px-3 truncate max-w-[150px] sm:max-w-none">
                {formatDate(currentDate)}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="hidden sm:block ml-2">
                <LoginButton />
              </div>
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
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Poetry Content */}
          <div className="lg:col-span-2">
            {/* Featured Poem */}
            <Card className="mb-6 sm:mb-8 border-purple-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{dailyPoem.title}</CardTitle>
                    <p className="text-purple-100 text-base sm:text-lg">by {dailyPoem.author}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 w-fit">
                    Today's Pick
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-8">
                {/* Poem Text */}
                <div className="mb-6 sm:mb-8">
                  <pre className="font-serif text-base sm:text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {dailyPoem.content}
                  </pre>
                </div>

                {/* Poem Details */}
                <div className="bg-purple-50 p-4 sm:p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">About this poem</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Theme:</span>
                      <p className="text-gray-800">{dailyPoem.theme}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Year:</span>
                      <p className="text-gray-800">{dailyPoem.year}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="font-medium text-gray-600">Background:</span>
                    <p className="text-gray-800 mt-1">{dailyPoem.background}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      <span>{dailyPoem.likes}</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      <span>{dailyPoem.shares}</span>
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Read Aloud
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Save to Collection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Reflection */}
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Daily Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Today's Question</h3>
                  <p className="text-gray-700 mb-4">
                    How does {dailyPoem.author}'s perspective on {dailyPoem.theme.toLowerCase()} resonate with your own experiences?
                  </p>
                  <Button variant="outline" className="w-full">
                    Share Your Reflection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* This Week's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>This Week's Poetry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {weeklyPoems.map((poem, index) => (
                    <div
                      key={index}
                      className={`p-2 sm:p-3 rounded-lg border ${
                        index === 2 
                          ? "bg-purple-100 border-purple-200" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                          index === 2 
                            ? "bg-purple-600 text-white" 
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {poem.day}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs sm:text-sm truncate">{poem.title}</div>
                          <div className="text-xs text-gray-500">{poem.author}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Poetry Streak */}
            <Card>
              <CardHeader>
                <CardTitle>Your Reading Streak</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">7</div>
                <div className="text-xs sm:text-sm text-gray-500 mb-4">days in a row</div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <p className="text-xs sm:text-sm text-purple-800">
                    Keep it up! You're building a beautiful habit of daily poetry appreciation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mobile-friendly layout for smaller cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Personalization */}
              <Card className="col-span-2 sm:col-span-1">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-sm sm:text-base">Customize</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0 space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm py-1 px-2">
                    Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm py-1 px-2">
                    Notifications
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="col-span-2 sm:col-span-1">
                <CardContent className="p-4 pt-4 sm:pt-6">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">47</div>
                      <div className="text-xs text-gray-500">Poems Read</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">12</div>
                      <div className="text-xs text-gray-500">Favorites</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default DailyPoetry;
