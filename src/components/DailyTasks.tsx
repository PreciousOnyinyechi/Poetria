
import { useState, useEffect } from "react";
import { CheckCircle, Circle, BookOpen, PenTool, Mic, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const DailyTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const tasks = [
    {
      id: 'read_daily_poem',
      title: 'Read Daily Poem',
      description: 'Read today\'s featured poem',
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'write_poem',
      title: 'Write a Poem',
      description: 'Create a new poem',
      icon: PenTool,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'record_poem',
      title: 'Record a Poem',
      description: 'Record yourself reciting',
      icon: Mic,
      color: 'text-green-600 bg-green-100'
    }
  ];

  // Fetch today's tasks
  const { data: completedTasks = [], isLoading } = useQuery({
    queryKey: ["daily-tasks", today, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_date', today);

      if (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  // Mark task as completed
  const completeTaskMutation = useMutation({
    mutationFn: async (taskType: string) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('daily_tasks')
        .upsert({
          user_id: user.id,
          task_date: today,
          task_type: taskType,
          completed: true,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Update user streak
      await supabase.rpc('update_user_streak', { user_id_param: user.id });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast({
        title: "Task completed!",
        description: "Great job! Keep up your daily poetry practice.",
      });
    },
    onError: (error) => {
      console.error('Error completing task:', error);
      toast({
        title: "Failed to complete task",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const isTaskCompleted = (taskType: string) => {
    return completedTasks.some(task => task.task_type === taskType && task.completed);
  };

  const completedCount = tasks.filter(task => isTaskCompleted(task.id)).length;
  const progressPercentage = (completedCount / tasks.length) * 100;

  if (!user) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Daily Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-4">
            Sign in to track your daily poetry practice
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Daily Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-purple-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Daily Tasks
          </CardTitle>
          <span className="text-sm text-gray-600">
            {completedCount}/{tasks.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          const completed = isTaskCompleted(task.id);
          
          return (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${task.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${completed ? 'text-green-800' : 'text-gray-800'}`}>
                  {task.title}
                </h4>
                <p className={`text-sm ${completed ? 'text-green-600' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => !completed && completeTaskMutation.mutate(task.id)}
                disabled={completed || completeTaskMutation.isPending}
                className="p-2"
              >
                {completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </Button>
            </div>
          );
        })}
        
        {completedCount === tasks.length && (
          <div className="text-center py-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">🎉 All tasks completed!</p>
            <p className="text-green-600 text-sm">Great job on your daily poetry practice!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTasks;
