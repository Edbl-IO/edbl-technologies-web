import {
  Children,
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCarouselProps = {
  label: string;
  slideClass?: string;
  className?: string;
  children: ReactNode;
};

export function FeatureCarousel({
  label,
  slideClass = "carousel-slide-thirds",
  className,
  children,
}: FeatureCarouselProps) {
  const [viewportRef, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [isNative, setIsNative] = useState(true);
  const [snapCount, setSnapCount] = useState(0);
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    setIsNative(false);
  }, []);

  useEffect(() => {
    if (!embla) return;
    const reinit = () => {
      setSnapCount(embla.scrollSnapList().length);
      sync();
    };
    reinit();
    embla.on("select", sync).on("reInit", reinit);
    return () => {
      embla.off("select", sync).off("reInit", reinit);
    };
  }, [embla, sync]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      embla?.scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      embla?.scrollNext();
    }
  };

  const slides = Children.toArray(children);

  return (
    <div
      className={cn("carousel", className)}
      role="region"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="carousel-viewport" ref={viewportRef} data-native={isNative ? "true" : undefined}>
        <div className="carousel-track">
          {slides.map((child, index) => (
            <div
              className={cn("carousel-slide", slideClass)}
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      {snapCount > 1 && (
        <div className="carousel-controls">
          <div className="carousel-dots">
            {Array.from({ length: snapCount }, (_, index) => (
              <button
                type="button"
                key={index}
                className="carousel-dot"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={selected === index}
                onClick={() => embla?.scrollTo(index)}
              />
            ))}
          </div>
          <div className="carousel-arrows">
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => embla?.scrollPrev()}
              disabled={!canPrev}
              aria-label={`Previous ${label}`}
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => embla?.scrollNext()}
              disabled={!canNext}
              aria-label={`Next ${label}`}
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
