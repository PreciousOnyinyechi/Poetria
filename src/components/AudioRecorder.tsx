
import { useState, useRef, useCallback } from "react";
import { Mic, MicOff, Play, Pause, Square, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface AudioRecorderProps {
  poemTitle?: string;
  poemContent?: string;
  onSave?: (audioBlob: Blob, duration: number) => void;
}

const AudioRecorder = ({ poemTitle, poemContent, onSave }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordingDuration(recordingTime);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
      
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [recordingTime, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      toast({
        title: "Recording stopped",
        description: "Your recording is ready to play",
      });
    }
  }, [isRecording, toast]);

  const playRecording = useCallback(() => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [audioUrl, isPlaying]);

  const deleteRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    setRecordingTime(0);
    setIsPlaying(false);
    
    toast({
      title: "Recording deleted",
      description: "You can record a new version",
    });
  }, [audioUrl, toast]);

  const downloadRecording = useCallback(() => {
    if (audioBlob && audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `${poemTitle?.replace(/[^a-z0-9]/gi, '_') || 'recording'}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your recording is being downloaded",
      });
    }
  }, [audioBlob, audioUrl, poemTitle, toast]);

  const saveRecording = useCallback(() => {
    if (audioBlob && onSave) {
      onSave(audioBlob, recordingDuration);
      toast({
        title: "Recording saved",
        description: "Your recording has been saved successfully",
      });
    }
  }, [audioBlob, recordingDuration, onSave, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Audio Recorder
        </CardTitle>
        {poemTitle && (
          <p className="text-sm text-gray-600">Recording: {poemTitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recording Controls */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
                disabled={!!audioBlob}
              >
                <Mic className="w-6 h-6" />
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 animate-pulse"
              >
                <Square className="w-6 h-6" />
              </Button>
            )}
          </div>
          
          {/* Recording Timer */}
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-gray-800">
              {formatTime(recordingTime)}
            </div>
            {isRecording && (
              <p className="text-sm text-red-600 animate-pulse">Recording...</p>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        {audioUrl && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={playRecording}
                variant="outline"
                size="lg"
                className="w-12 h-12 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-1" />
                )}
              </Button>
              
              <div className="text-center">
                <div className="text-lg font-semibold">
                  Duration: {formatTime(recordingDuration)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                onClick={downloadRecording}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              {onSave && (
                <Button
                  onClick={saveRecording}
                  size="sm"
                >
                  Save Recording
                </Button>
              )}
              
              <Button
                onClick={deleteRecording}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Poem Content for Reference */}
        {poemContent && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Poem Content:</h4>
            <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
              {poemContent}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioRecorder;
