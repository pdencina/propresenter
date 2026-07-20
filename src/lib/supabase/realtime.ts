'use client';

import { createClient } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type SlideChangePayload = {
  slideId: string | null;
  serviceId: string;
  triggeredBy: string;
};

export type PresenceState = {
  userId: string;
  role: 'editor' | 'presenter' | 'remote';
  name: string;
};

/**
 * Creates a realtime channel for a live presentation session.
 * Used by Editor, Presenter, and Remote to stay in sync.
 */
export function createPresentationChannel(serviceId: string) {
  const supabase = createClient();
  const channelName = `presentation:${serviceId}`;

  const channel = supabase.channel(channelName, {
    config: {
      broadcast: { self: true },
      presence: { key: '' },
    },
  });

  return channel;
}

/**
 * Broadcasts a slide change to all connected clients
 */
export function broadcastSlideChange(
  channel: RealtimeChannel,
  payload: SlideChangePayload
) {
  return channel.send({
    type: 'broadcast',
    event: 'slide_change',
    payload,
  });
}

/**
 * Broadcasts a "go black" / clear screen event
 */
export function broadcastClearScreen(
  channel: RealtimeChannel,
  serviceId: string
) {
  return channel.send({
    type: 'broadcast',
    event: 'slide_change',
    payload: {
      slideId: null,
      serviceId,
      triggeredBy: 'clear',
    } satisfies SlideChangePayload,
  });
}

/**
 * Hook-friendly helper to subscribe to slide changes
 */
export function onSlideChange(
  channel: RealtimeChannel,
  callback: (payload: SlideChangePayload) => void
) {
  channel.on('broadcast', { event: 'slide_change' }, ({ payload }) => {
    callback(payload as SlideChangePayload);
  });
}

/**
 * Track presence in the channel
 */
export function trackPresence(
  channel: RealtimeChannel,
  state: PresenceState
) {
  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track(state);
    }
  });
}
