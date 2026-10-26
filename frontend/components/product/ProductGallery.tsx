"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  imageAlt?: string;
}

const fallbackImage = "/placeholders/product.svg";

export function ProductGallery({ images, productName, imageAlt }: ProductGalleryProps) {
  const availableImages = images.length > 0 ? images : [fallbackImage];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const image = availableImages[selectedIndex] ?? fallbackImage;
  const source = failedImages.includes(image) ? fallbackImage : image;

  function markImageUnavailable() {
    if (source !== fallbackImage) {
      setFailedImages((current) => current.includes(image) ? current : [...current, image]);
    }
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          alt={imageAlt ?? `${productName} product view ${selectedIndex + 1}`}
          className="object-contain p-6 transition-opacity duration-300 sm:p-10"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={source}
          onError={markImageUnavailable}
        />
      </div>
      {availableImages.length > 1 ? (
        <div aria-label={`${productName} image gallery`} className="mt-4 flex gap-3 overflow-x-auto pb-2" role="group">
          {availableImages.map((thumbnail, index) => (
            <button
              aria-label={`Show ${productName} image ${index + 1}`}
              aria-pressed={selectedIndex === index}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white p-2 transition hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                selectedIndex === index ? "border-accent ring-2 ring-accent/20" : "border-border"
              }`}
              key={`${thumbnail}-${index}`}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <Image
                alt=""
                className="object-contain"
                fill
                sizes="80px"
                src={failedImages.includes(thumbnail) ? fallbackImage : thumbnail}
                onError={() => {
                  if (thumbnail !== fallbackImage) {
                    setFailedImages((current) => current.includes(thumbnail) ? current : [...current, thumbnail]);
                  }
                }}
              />
            </button>
          ))}
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">Showing image {selectedIndex + 1} of {availableImages.length} for {productName}.</p>
    </div>
  );
}
