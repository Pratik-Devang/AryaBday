import type { Metadata } from 'next';
import { FriendshipRoutes } from './friendship-routes';

export const metadata: Metadata = {
  title: "Friendship Routes | Arya's Birthday Adventure",
  description: 'Make five choices and discover a video message from one of your friends.',
};

export default function ChoicesPage() {
  return <FriendshipRoutes />;
}
