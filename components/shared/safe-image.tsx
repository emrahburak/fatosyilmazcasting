'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type SafeImageProps = Omit<ImageProps, 'onError'> & {
  fallbackSrc?: string;
  fallbackClassName?: string;
};

/**
 * Next.js Image wrapper with automatic fallback on load error.
 * Falls back to a solid color placeholder with optional text.
 */
export default function SafeImage({
  fallbackSrc,
  fallbackClassName,
  alt,
  className,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-muted/20 flex items-center justify-center ${fallbackClassName ?? ''}`}
        role="img"
        aria-label={alt as string}
      >
        <span className="text-muted text-xs font-cinzel tracking-wider">
          G&ouml;rsel yak&#305;nda
        </span>
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      {...props}
      onError={() => setError(true)}
    />
  );
}
