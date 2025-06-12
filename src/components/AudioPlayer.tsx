
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface AudioPlayerProps {
  audioUrl?: string | null;
  title: string;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

const AudioPlayer = ({ audioUrl, title, onPlay, onPause, className = "" }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
        console.log("Audio duration loaded:", audio.duration);
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      console.log("Audio loading started");
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log("Audio can play");
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      onPause?.();
      console.log("Audio playback ended");
    };

    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsLoading(false);
      toast({
        title: "Audio Error",
        description: "Unable to play this audio file. The file may be corrupted or unavailable.",
        variant: "destructive",
      });
      setIsPlaying(false);
    };

    const handleLoadedData = () => {
      console.log("Audio data loaded");
      setIsLoading(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, onPause, toast, volume]);

  const togglePlay = async () => {
    if (!audioUrl) {
      toast({
        title: "No Audio Available",
        description: "This poem doesn't have an audio recording yet.",
        variant: "destructive",
      });
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        onPause?.();
        console.log("Audio paused");
      } else {
        setIsLoading(true);
        console.log("Attempting to play audio:", audioUrl);
        
        // Reset audio if at the end
        if (audio.ended) {
          audio.currentTime = 0;
        }
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          setIsLoading(false);
          onPlay?.();
          console.log("Audio playing successfully");
        }
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsLoading(false);
      toast({
        title: "Playback Error",
        description: "Failed to play audio. Please check your internet connection and try again.",
        variant: "destructive",
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / duration) * 100);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-gray-50 p-3 sm:p-4 rounded-lg ${className}`}>
      <div className={`flex items-center ${isMobile ? 'flex-col space-y-3' : 'justify-between mb-2'}`}>
        <div className={`flex items-center ${isMobile ? 'w-full' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-purple-600 hover:bg-purple-700 text-white flex-shrink-0 ${isLoading ? 'opacity-50' : ''}`}
            disabled={!audioUrl || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </Button>

          <div className={`flex-1 ${isMobile ? 'ml-3' : 'mx-4'} min-w-0`}>
            <div className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-800 truncate`}>
              {title}
            </div>
            <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500`}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="w-8 h-8"
              disabled={!audioUrl}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      <div 
        className="w-full cursor-pointer"
        onClick={handleProgressClick}
      >
        <Progress 
          value={progress} 
          className="w-full h-2 hover:h-3 transition-all duration-200" 
        />
      </div>

      {isMobile && (
        <div className="flex justify-center mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="w-8 h-8"
            disabled={!audioUrl}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          className="hidden"
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
};

export default AudioPlayer;
