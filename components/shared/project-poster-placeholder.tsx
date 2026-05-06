type ProjectPosterPlaceholderProps = {
  title: string;
  year: string | null;
  type: string;
};

/**
 * Logo-styled placeholder for projects without poster images.
 * Dark background, gold border frame, Cinzel typography, separator line.
 */
export default function ProjectPosterPlaceholder({
  title,
  year,
  type,
}: ProjectPosterPlaceholderProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#1a1a1a]">
      {/* Gold border frame */}
      <div className="absolute inset-3 border border-gold/20 pointer-events-none" />

      {/* Title */}
      <h3 className="font-cinzel text-white text-sm md:text-base tracking-wide font-medium text-center leading-tight relative z-10">
        {title}
      </h3>

      {/* Separator */}
      <div className="flex items-center gap-2 mt-3 mb-3 relative z-10">
        <div className="w-6 h-[1px] bg-gold/40" />
        <div className="w-1 h-1 rounded-full bg-gold/60" />
        <div className="w-6 h-[1px] bg-gold/40" />
      </div>

      {/* Year + Type */}
      <p className="font-crimson text-gold/60 text-xs relative z-10">
        {year ?? '—'} &middot; {type}
      </p>
    </div>
  );
}
