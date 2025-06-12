
import { BookOpen, PenTool, Mic, Volume2, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import LoginButton from "@/components/LoginButton";
import DailyPoetry from "@/components/DailyPoetry";
import DailyTasks from "@/components/DailyTasks";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Explore Library",
      description: "Discover poems from various genres and authors",
      link: "/library",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: PenTool,
      title: "Write Poetry",
      description: "Create and share your own poems",
      link: "/write",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Volume2,
      title: "Audio Library",
      description: "Listen to beautifully narrated poems",
      link: "/audio",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Mic,
      title: "Recitation Studio",
      description: "Practice and record your poetry readings",
      link: "/recite",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Poetry Studio
              </h1>
            </div>
            <div className="hidden md:block">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Your Poetry Journey
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover, create, and share beautiful poetry. Join a community of poets and poetry lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
              <Link to="/library">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Library
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/write">
                <PenTool className="w-5 h-5 mr-2" />
                Start Writing
              </Link>
            </Button>
          </div>
        </div>

        {/* Daily Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <DailyPoetry />
          </div>
          <div>
            <DailyTasks />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-all duration-300 border-purple-100">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    {feature.description}
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={feature.link}>
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Poetry Journey?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of poetry enthusiasts. Write, share, and discover amazing poems every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/write">
                  <PenTool className="w-5 h-5 mr-2" />
                  Write Your First Poem
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600" asChild>
                <Link to="/library">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Poetry Library
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
