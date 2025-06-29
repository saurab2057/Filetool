import React from 'react';
import { Star } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/userReview';

export const AnimatedTestimonials = ({ testimonials }) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with slide-in animation */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Millions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our users say about their experience with our platform
          </p>
        </div>
        
        {/* Testimonials grid with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-xl hover:border-blue-300 hover:-translate-y-2 hover:scale-105 transition-all duration-500 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-12 scale-95'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 400}ms` : '0ms'
              }}
            >
              {/* Rating stars with individual animations */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 text-yellow-400 fill-current transition-all duration-300 hover:scale-110 ${
                      isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                    }`}
                    style={{ 
                      transitionDelay: isVisible ? `${(index * 400) + (i * 100)}ms` : '0ms'
                    }}
                  />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed relative">
                <span className="text-4xl text-blue-200 absolute -top-2 -left-2 select-none">"</span>
                <p className="relative z-10 italic">{testimonial.content}</p>
                <span className="text-4xl text-blue-200 absolute -bottom-4 -right-2 select-none">"</span>
              </blockquote>
              
              {/* Author info with slide animation */}
              <div className={`flex items-center space-x-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${(index * 400) + 300}ms` }}>
                {/* Avatar with gradient */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                  <div className="text-blue-600 font-medium">{testimonial.role}</div>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>
        
        {/* Floating decorative elements */}
        <div className="relative mt-16">
          <div className={`absolute top-0 left-1/4 w-20 h-20 bg-blue-100 rounded-full opacity-20 transition-all duration-1000 ${
            isVisible ? 'animate-bounce' : ''
          }`}></div>
          <div className={`absolute top-10 right-1/3 w-16 h-16 bg-indigo-100 rounded-full opacity-30 transition-all duration-1000 ${
            isVisible ? 'animate-pulse' : ''
          }`}></div>
        </div>
      </div>
    </section>
  );
};