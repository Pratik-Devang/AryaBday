import { RewardGallery } from '../reward-gallery';

const photos = Array.from({ length: 13 }, (_, index) => `/rewards/blanket-flight/photo-${String(index + 1).padStart(2, '0')}.jpeg`);

export default function BlanketFlightRewards() {
  return <RewardGallery eyebrow="LEVEL 01 REWARD" title="KHILKHILAATI HUI YAADEIN" storageKey="arya-flappy-complete" gameHref="/games/flappy" photos={photos} variant="pink" />;
}
