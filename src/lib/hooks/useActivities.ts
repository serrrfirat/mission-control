'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function useActivities(limit?: number) {
  const activities = useQuery(api.activities.list, { limit: limit ?? 100 }) ?? [];
  return activities;
}
