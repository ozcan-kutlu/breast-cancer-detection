"use client";

/* eslint-disable @next/next/no-img-element -- Harici FastAPI PNG */

type Props = {
  src: string;
  alt: string;
  imageKey: string;
  onFail: () => void;
};

export function DecisionTreeImage({ src, alt, imageKey, onFail }: Props) {
  return (
    <img
      key={imageKey}
      src={src}
      alt={alt}
      className="tree-img"
      onError={onFail}
    />
  );
}
