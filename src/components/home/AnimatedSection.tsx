import { useEffect, useRef, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale";
  delay?: number;
  className?: string;
}

export const AnimatedSection = ({ 
  children, 
  animation = "fadeIn", 
  delay = 0,
  className = "" 
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionRef.current) {
            const element = sectionRef.current;
            element.style.transition = 'all 1s ease-out';
            element.style.transitionDelay = `${delay}ms`;
            
            switch(animation) {
              case 'fadeIn':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
              case 'slideUp':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
              case 'slideLeft':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
              case 'slideRight':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
              case 'scale':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      // Set initial state
      const element = sectionRef.current;
      element.style.opacity = '0';
      
      switch(animation) {
        case 'fadeIn':
          element.style.transform = 'translateY(30px)';
          break;
        case 'slideUp':
          element.style.transform = 'translateY(50px)';
          break;
        case 'slideLeft':
          element.style.transform = 'translateX(50px)';
          break;
        case 'slideRight':
          element.style.transform = 'translateX(-50px)';
          break;
        case 'scale':
          element.style.transform = 'scale(0.8)';
          break;
      }
      
      observer.observe(element);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [animation, delay]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};
