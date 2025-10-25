'use client';

import { useState, useRef, useEffect } from 'react';

export default function useAudioService() {
  const [audio] = useState(() => {
    if (typeof window !== 'undefined') {
      return new Audio();
    }
    return null;
  });
  const [volume, setVolume] = useState(0.5);
  const [paused, setPaused] = useState(true);
  const [error, setError] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackTitle, setTrackTitle] = useState(null);
  const [stationName, setStationName] = useState(null);

  useEffect(() => {
    if (!audio) return;

    // Volume handling
    audio.volume = volume;
    audio.onvolumechange = () => setVolume(audio.volume);

    // Waiting state
    audio.onwaiting = () => setWaiting(true);
    audio.oncanplaythrough = () => setWaiting(false);

    // Play/pause state
    audio.onpause = () => setPaused(true);
    audio.onplaying = () => {
      setPaused(false);
      setWaiting(false);
    };

    // Error handling
    audio.onerror = () => setError(audio.error);
    audio.onplay = () => setError(null);

    // Time updates
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onprogress = () => {
      if (audio.buffered.length > 0) {
        setDuration(audio.buffered.end(0));
      }
    };

    // Metadata handling
    audio.onloadedmetadata = () => {
      if (audio.metadata) {
        setTrackTitle(audio.metadata.title);
      }
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audio, volume]);

  const setSource = (url) => {
    if (audio) {
      audio.src = url;
      setError(null);
    }
  };

  const play = () => {
    if (audio) {
      audio.play().catch(err => setError(err));
    }
  };

  const pause = () => {
    if (audio) {
      audio.pause();
    }
  };

  const setVolumeLevel = (newVolume) => {
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const changeCurrentTime = (change) => {
    if (audio) {
      audio.currentTime += change;
    }
  };

  return {
    audio,
    volume,
    paused,
    error,
    waiting,
    currentTime,
    duration,
    trackTitle,
    stationName,
    setSource,
    play,
    pause,
    setVolumeLevel,
    changeCurrentTime,
    setTrackTitle,
    setStationName
  };
}
