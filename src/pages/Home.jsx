import {
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LazyImage from "../components/LazyImage";
import { servicesAPI } from "../utils/api";

const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get fallback image based on service name
  const getFallbackImage = (serviceName) => {
    const serviceImages = {
      "House Cleaning": "/images/service_cleaning.png",
      "House Deep Cleaning": "/images/service_cleaning.png",
      "Bathroom Cleaning": "/images/service_cleaning.png",
      "Pipe Repair": "/images/service_plumbing.png",
      "Toilet Installation": "/images/service_plumbing.png",
      "Wiring Repair": "/images/service_electrical.png",
      "Garden Maintenance": "/images/service_plumbing.png",
      "Wall Painting": "/images/service_cleaning.png",
    };

    // Return specific image if service name matches, otherwise return a default image
    return serviceImages[serviceName] || "/images/service_cleaning.png";
  };

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const response = await servicesAPI.getServices({ limit: 4 });
        const services = response.data.results || response.data;
        setFeaturedServices(services.slice(0, 4)); // Get first 4 services
      } catch (error) {
        console.error("Error fetching featured services:", error);
        // Fallback to hardcoded services if API fails
        setFeaturedServices([
          {
            id: 1,
            image_url: "/images/service_cleaning.png",
            name: "House Cleaning",
            short_desc: "Professional deep cleaning services for your home",
            price: "2500",
          },
          {
            id: 2,
            image_url: "/images/service_plumbing.png",
            name: "Plumbing",
            short_desc: "Expert plumbing repair and installation services",
            price: "1200",
          },
          {
            id: 3,
            image_url: "/images/service_electrical.png",
            name: "Electrical Work",
            short_desc: "Safe and reliable electrical repair services",
            price: "1500",
          },
          {
            id: 4,
            name: "Garden Maintenance",
            short_desc: "Keep your garden beautiful and well-maintained",
            price: "2000",
            icon: ClockIcon,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Verified Professionals",
      description:
        "All our service providers are background-checked and verified",
    },
    {
      icon: ClockIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs",
    },
    {
      icon: StarIcon,
      title: "Quality Guaranteed",
      description: "We ensure high-quality service with satisfaction guarantee",
    },
    {
      icon: UserGroupIcon,
      title: "Trusted by Thousands",
      description: "Join thousands of satisfied customers across Bangladesh",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Ahmed",
      rating: 5,
      comment: "Excellent cleaning service! Very professional and thorough.",
      service: "House Cleaning",
    },
    {
      name: "Mohammad Rahman",
      rating: 5,
      comment: "Quick and efficient plumbing repair. Highly recommended!",
      service: "Plumbing",
    },
    {
      name: "Fatima Khan",
      rating: 4,
      comment: "Great electrical work. The technician was very knowledgeable.",
      service: "Electrical",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="hero-section py-20"
        style={{
          backgroundImage: `url('/images/hero_background.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-800/20 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 backdrop-blur-sm bg-black/20 text-white rounded-2xl p-6 inline-block drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              Your Home, Our{" "}
              <span className="text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                Expertise
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto backdrop-blur-sm bg-black/15 text-white rounded-xl p-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
              Professional household services at your doorstep. From cleaning to
              repairs, we've got you covered with trusted, verified
              professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="btn-primary backdrop-blur-sm bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]"
              >
                Browse Services
              </Link>
              <Link
                to="/register"
                className="btn-secondary backdrop-blur-sm bg-white/50 hover:bg-white/70 text-gray-900 drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Popular Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of professional household services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Show loading placeholders while fetching services
              <>
                <div
                  key="loading-placeholder-1"
                  className="card hover:shadow-lg transition-shadow animate-pulse"
                >
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-gray-200" />
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
                <div
                  key="loading-placeholder-2"
                  className="card hover:shadow-lg transition-shadow animate-pulse"
                >
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-gray-200" />
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
                <div
                  key="loading-placeholder-3"
                  className="card hover:shadow-lg transition-shadow animate-pulse"
                >
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-gray-200" />
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
                <div
                  key="loading-placeholder-4"
                  className="card hover:shadow-lg transition-shadow animate-pulse"
                >
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-gray-200" />
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              </>
            ) : (
              featuredServices.map((service) => (
                <div
                  key={service.id}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="text-center">
                    {service.image_url ? (
                      <LazyImage
                        src={service.image_url}
                        alt={service.name}
                        className="h-12 w-12 mx-auto mb-4 rounded-full"
                      />
                    ) : service.icon ? (
                      <service.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                    ) : (
                      <LazyImage
                        src={getFallbackImage(service.name)}
                        alt={service.name}
                        className="h-12 w-12 mx-auto mb-4 rounded-full"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.short_desc}</p>
                    <p className="text-primary-600 font-semibold">
                      Starting from ৳{service.price}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your household tasks done in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <LazyImage
                  src="/images/how_it_works_step1.png"
                  alt="Choose Service"
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Choose Service
              </h3>
              <p className="text-gray-600">
                Browse our services and select what you need for your home
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <LazyImage
                  src="/images/how_it_works_step2.png"
                  alt="Book & Pay"
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Book & Pay
              </h3>
              <p className="text-gray-600">
                Add to cart, provide details, and make secure payment
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <LazyImage
                  src="/images/how_it_works_step3.png"
                  alt="Get Service"
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get Service
              </h3>
              <p className="text-gray-600">
                Our verified professional will arrive and complete the job
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HomeSer?
            </h2>
            <p className="text-lg text-gray-600">
              We're committed to providing the best household service experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="text-center">
                <feature.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Real reviews from satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={`star-${testimonial.id}-${i}`}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-200">Verified Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-200">Service Types</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-primary-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative overflow-hidden py-16 text-white"
        style={{
          backgroundImage: `url('/images/cta_section_image.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-75"></div>{" "}
        {/* Overlay for text readability */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of satisfied customers and experience the best
            household services
          </p>
          <Link
            to="/services"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Book Your Service Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
