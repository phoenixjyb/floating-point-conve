/**
 * Asset import utilities and type definitions
 * 
 * This file provides type-safe imports and utilities for working with assets
 * in the Data Conversion App.
 */

// Image asset types
export type ImageAsset = string;
export type VideoAsset = string;
export type AudioAsset = string;
export type DocumentAsset = string;

// Asset loading utilities
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const loadAudio = (src: string): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = reject;
    audio.src = src;
  });
};

// Asset optimization utilities
export const getOptimalImageFormat = (): 'webp' | 'png' | 'jpg' => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Check WebP support
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }
  
  return 'png';
};

// Samsung Galaxy S24 Ultra specific optimizations
export const getOptimalAssetSize = (): '1x' | '2x' | '3x' => {
  const dpr = window.devicePixelRatio;
  
  if (dpr >= 3) return '3x';
  if (dpr >= 2) return '2x';
  return '1x';
};

// Asset preloading for performance
export const preloadAssets = async (assets: string[]): Promise<void> => {
  const promises = assets.map(asset => {
    if (asset.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      return loadImage(asset);
    } else if (asset.match(/\.(mp3|wav|ogg)$/i)) {
      return loadAudio(asset);
    }
    return Promise.resolve();
  });
  
  await Promise.all(promises);
};

// Asset path helpers
export const getAssetPath = (category: 'images' | 'video' | 'audio' | 'documents', filename: string): string => {
  return `/src/assets/${category}/${filename}`;
};

// Example asset imports (uncomment when assets are added)
// import appIcon from '@/assets/images/app-icon.svg';
// import conversionSound from '@/assets/audio/conversion-complete.mp3';
// import tutorialVideo from '@/assets/video/floating-point-tutorial.mp4';
// import formatSpecs from '@/assets/documents/fp-format-specs.json';

// export {
//   appIcon,
//   conversionSound,
//   tutorialVideo,
//   formatSpecs
// };