import React, { useState, useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import PromoCard from '../../../components/common/PromoCard';
import { themeColors } from '../../../../../theme';
import promo1 from '../../../../../assets/images/pages/Home/promo-carousel/1764052270908-bae94c.jpg';
import promo2 from '../../../../../assets/images/pages/Home/promo-carousel/1678450687690-81f922.jpg';
import promo3 from '../../../../../assets/images/pages/Home/promo-carousel/1745822547742-760034.jpg';
import promo4 from '../../../../../assets/images/pages/Home/promo-carousel/1711428209166-2d42c0.jpg';
import promo5 from '../../../../../assets/images/pages/Home/promo-carousel/1762785595543-540198.jpg';
import promo6 from '../../../../../assets/images/pages/Home/promo-carousel/1678454437383-aa4984.jpg';

const PromoCarousel = memo(({ promos, onPromoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const carouselRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);



  const promotionalCards = promos || [];

  // Simple auto-scroll functionality
  useEffect(() => {
    if (isHovered || promotionalCards.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth; // Scroll by one screen/card width

      // Calculate next scroll position
      let nextScrollLeft = container.scrollLeft + cardWidth;

      // If we reached the end, loop back (smoothly if possible, or instant)
      if (nextScrollLeft >= container.scrollWidth - 10) { // Tolerance
        nextScrollLeft = 0;
      }

      container.scrollTo({
        left: nextScrollLeft,
        behavior: 'smooth'
      });

    }, 5000); // 5 seconds interval

    return () => clearInterval(interval);
  }, [isHovered, promotionalCards.length]);

  // Entrance animation
  useEffect(() => {
    if (carouselRef.current) {
      gsap.fromTo(carouselRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  if (!promos || promos.length === 0) {
    return null;
  }

  return (
    <div
      ref={carouselRef}
      className=""
      style={{ opacity: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {promotionalCards.map((promo) => (
          <div key={promo.id} data-promo-card className="flex-shrink-0 snap-start">
            <PromoCard
              title={promo.title}
              subtitle={promo.subtitle}
              buttonText={promo.buttonText}
              image={promo.image}
              className={promo.className}
              onClick={() => onPromoClick?.(promo)}
            />
          </div>
        ))}
      </div>
      {/* Carousel indicator dots */}
      <div className="flex justify-center gap-1.5 mt-3 mb-4">
        {promotionalCards.map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6 h-1.5' : 'w-1.5 h-1.5'}`}
            style={{
              backgroundColor: index === currentIndex ? '#FACC15' : 'rgba(250, 204, 21, 0.4)',
              boxShadow: index === currentIndex ? '0 0 10px rgba(250, 204, 21, 0.4)' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
});

PromoCarousel.displayName = 'PromoCarousel';

export default PromoCarousel;

