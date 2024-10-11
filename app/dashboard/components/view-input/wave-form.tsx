import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioRecorderWithWaveform = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0); // Track duration
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const durationInterval = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    // Initialize WaveSurfer for real-time visualization
    waveSurferRef.current = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
    });

    return () => {
      waveSurferRef.current?.destroy();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Reset audio chunks and audio URL when a new recording starts
      audioChunks.current = [];
      setAudioUrl(null);
      setRecordingDuration(0);

      // Increment recording duration every second
      durationInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);

        // Load the recorded audio into WaveSurfer for visualization
        waveSurferRef.current?.load(audioUrl);

        // Stop duration interval
        if (durationInterval.current) {
          clearInterval(durationInterval.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      // Stop duration interval
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      // Stop waveform animation
      waveSurferRef.current?.pause();

      // Stop duration interval
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume waveform animation
      waveSurferRef.current?.play();

      // Resume duration interval
      durationInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div>
      <h1>Audio Recorder with Waveform</h1>

      {/* WaveSurfer Container */}
      <div id="waveform" style={{ width: '100%', height: '200px', background: '#f0f0f0' }}></div>

      {/* Recording Controls */}
      {!isRecording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <>
          <button onClick={stopRecording}>Stop Recording</button>
          {!isPaused ? (
            <button onClick={pauseRecording}>Pause Recording</button>
          ) : (
            <button onClick={resumeRecording}>Resume Recording</button>
          )}
        </>
      )}

      {/* Show recorded audio */}
      {audioUrl && (
        <div>
          <h2>Recorded Audio</h2>
          <audio controls src={audioUrl}></audio>
          <a href={audioUrl} download="recording.mp3">
            Download Recording
          </a>
        </div>
      )}

      {/* Recording Duration */}
      <div>
        <h3>Duration: {formatDuration(recordingDuration)}</h3>
      </div>
    </div>
  );
};

export default AudioRecorderWithWaveform;
