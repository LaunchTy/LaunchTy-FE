declare module '@splidejs/react-splide' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface SplideProps {
    options?: any;
    ref?: any;
    children?: ReactNode;
  }
  
  export interface SplideSlideProps {
    children?: ReactNode;
  }
  
  export interface Splide {
    splide: {
      go: (index: number | string) => void;
      on: (event: string, callback: (index: number) => void) => void;
      off: (event: string, callback: (index: number) => void) => void;
    };
  }
  
  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
} 