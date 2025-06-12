
import { useState } from "react";
import { Users, MessageCircle, Heart, Share2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const posts = [
    {
      id: 1,
      user: { name: "Sarah Chen", avatar: "/api/placeholder/40/40", username: "@sarahpoet" },
      type: "poem",
      title: "Morning Reflections",
      content: "Golden rays pierce through my window,\nWhispering secrets of the dawn...",
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: "2 hours ago",
      tags: ["nature", "morning", "original"]
    },
    {
      id: 2,
      user: { name: "Marcus Johnson", avatar: "/api/placeholder/40/40", username: "@mjpoetry" },
      type: "discussion",
      title: "What makes a poem timeless?",
      content: "I've been thinking about what separates poems that endure across generations from those that fade...",
      likes: 18,
      comments: 15,
      shares: 5,
      timestamp: "4 hours ago",
      tags: ["discussion", "literary analysis"]
    },
    {
      id: 3,
      user: { name: "Elena Rodriguez", avatar: "/api/placeholder/40/40", username: "@elenaverse" },
      type: "poem",
      title: "City Symphony",
      content: "Concrete rivers flow with hurried souls,\nEach step a note in urban songs...",
      likes: 31,
      comments: 12,
      shares: 7,
      timestamp: "6 hours ago",
      tags: ["urban", "contemporary", "original"]
    }
  ];

  const workshops = [
    {
      id: 1,
      title: "Sonnet Writing Workshop",
      instructor: "Dr. Amanda Foster",
      date: "March 15, 2024",
      time: "7:00 PM EST",
      participants: 24,
      maxParticipants: 30,
      level: "Intermediate"
    },
    {
      id: 2,
      title: "Free Verse Fundamentals",
      instructor: "James Rivera",
      date: "March 18, 2024",
      time: "6:00 PM EST",
      participants: 18,
      maxParticipants: 25,
      level: "Beginner"
    }
  ];

  const challenges = [
    {
      id: 1,
      title: "30-Day Haiku Challenge",
      description: "Write one haiku every day for 30 days",
      participants: 156,
      daysLeft: 12,
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Seasonal Poetry Sprint",
      description: "Capture the essence of spring in 5 poems",
      participants: 89,
      daysLeft: 5,
      difficulty: "Intermediate"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Community
              </h1>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>

            {/* Posts Feed */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.user.avatar} />
                          <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{post.user.name}</h3>
                            <span className="text-sm text-gray-500">{post.user.username}</span>
                          </div>
                          <p className="text-sm text-gray-500">{post.timestamp}</p>
                        </div>
                        <Badge variant={post.type === 'poem' ? 'default' : 'secondary'}>
                          {post.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold text-lg mb-3">{post.title}</h4>
                      <div className="mb-4">
                        {post.type === 'poem' ? (
                          <pre className="font-serif text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {post.content}
                          </pre>
                        ) : (
                          <p className="text-gray-700 leading-relaxed">{post.content}</p>
                        )}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            {post.shares}
                          </Button>
                        </div>
                        <Button size="sm" variant="outline">
                          View Full
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trending Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['#SpringPoetry', '#Haiku', '#LovePoems', '#ModernVerse', '#SonnetSunday'].map((topic) => (
                        <Button
                          key={topic}
                          variant="ghost"
                          className="w-full justify-start text-left"
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Poets */}
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Poets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Alexandra Stone", followers: "1.2k" },
                        { name: "David Park", followers: "980" },
                        { name: "Luna Martinez", followers: "756" }
                      ].map((poet) => (
                        <div key={poet.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {poet.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{poet.name}</div>
                              <div className="text-xs text-gray-500">{poet.followers} followers</div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Follow
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workshops" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {workshops.map((workshop) => (
                <Card key={workshop.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>{workshop.title}</CardTitle>
                    <p className="text-purple-600">with {workshop.instructor}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Date:</span>
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Time:</span>
                        <span>{workshop.time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Level:</span>
                        <Badge variant="outline">{workshop.level}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Participants:</span>
                        <span>{workshop.participants}/{workshop.maxParticipants}</span>
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Join Workshop
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>{challenge.title}</CardTitle>
                    <p className="text-gray-600">{challenge.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Participants:</span>
                        <span>{challenge.participants} poets</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Time left:</span>
                        <span>{challenge.daysLeft} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Difficulty:</span>
                        <Badge variant="outline">{challenge.difficulty}</Badge>
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Join Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Groups Coming Soon</h3>
              <p className="text-gray-500">
                Join poetry groups based on your interests and connect with like-minded poets.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
