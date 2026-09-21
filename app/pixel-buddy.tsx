type PixelBuddyProps = {
  variant: 'pink' | 'owlet' | 'dude';
  label?: string;
};

export function PixelBuddy({ variant, label }: PixelBuddyProps) {
  return (
    <span
      className={`pixel-buddy pixel-buddy-${variant}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
