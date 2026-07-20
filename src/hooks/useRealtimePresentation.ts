'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  createPresentationChannel,
  broadcastSlideChange,
  broadcastClearScreen,
  onSlideChange,
  trackPresence,
  type SlideChangePayload,
  type PresenceState,
} from '@/lib/supabase/realtime';

interface UseRealtimePresentationOptions {
  serviceId: string;
  role: PresenceState['role'];
  userName?: string;
  onSlideChanged?: (payload: SlideChangePayload) => void;
}

export function useRealtimePresentation({
  serviceId,
  role,
  userName = 'Usuario',
  onSlideChanged,
}: UseRealtimePresentationOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<PresenceState[]>([]);

  useEffect(() => {
    const channel = createPresentationChannel(serviceId);
    channelRef.current = channel;

    // Listen for slide changes
    onSlideChange(channel, (payload) => {
      setCurrentSlideId(payload.slideId);
      onSlideChanged?.(payload);
    });

    // Track presence
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const users: PresenceState[] = [];
      Object.values(state).forEach((presences) => {
        presences.forEach((p: any) => {
          users.push({
            userId: p.userId,
            role: p.role,
            name: p.name,
          });
        });
      });
      setConnectedUsers(users);
    });

    // Subscribe and track own presence
    trackPresence(channel, {
      userId: `${role}-${Date.now()}`,
      role,
      name: userName,
    });

    channel.subscribe((status) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [serviceId, role, userName, onSlideChanged]);

  const goToSlide = useCallback(
    (slideId: string) => {
      if (!channelRef.current) return;
      setCurrentSlideId(slideId);
      broadcastSlideChange(channelRef.current, {
        slideId,
        serviceId,
        triggeredBy: role,
      });
    },
    [serviceId, role]
  );

  const clearScreen = useCallback(() => {
    if (!channelRef.current) return;
    setCurrentSlideId(null);
    broadcastClearScreen(channelRef.current, serviceId);
  }, [serviceId]);

  return {
    isConnected,
    currentSlideId,
    connectedUsers,
    goToSlide,
    clearScreen,
  };
}
