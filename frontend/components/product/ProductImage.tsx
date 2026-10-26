"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  alt: string;
  className: string;
  fallbackOnError?: boolean;
  sizes: string;
  src: string;
}

const fallbackImage = "/placeholders/product.svg";

export function ProductImage({ alt, className, fallbackOnError = false, sizes, src }: ProductImageProps) {
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <Image
      alt={alt}
      className={className}
      fill
      sizes={sizes}
      src={hasFailed ? fallbackImage : src}
      onError={fallbackOnError ? () => setHasFailed(true) : undefined}
    />
  );
}
