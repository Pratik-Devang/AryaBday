import { RewardGallery } from '../reward-gallery';

const photos = Array.from({ length: 12 }, (_, index) => `/rewards/face-dodge/photo-${String(index + 1).padStart(2, '0')}.jpeg`);

export default function FaceDodgeRewards() {
  return <RewardGallery eyebrow="LEVEL 02 REWARD" title="KHILKHILAATI HUI YAADEIN" storageKey="arya-dodger-complete" gameHref="/games/dodger" photos={photos} variant="gold" />;
}
