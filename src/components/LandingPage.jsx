import React, { useEffect, useRef } from "react";
import { Check, ChevronRight, Package, BarChart, Zap, Cloud, Smartphone, RefreshCw, Mail, ShoppingCart } from 'lucide-react';


function LandingPage() {
  const featuresRef = useRef(null);
  const faqRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    // Hero section fade in animation
    if (heroRef.current) {
      heroRef.current.classList.add("animate-fade-in");
    }

    // Animate features when they come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const features = entry.target.querySelectorAll(".feature-item");
            features.forEach((feature, index) => {
              setTimeout(() => {
                feature.classList.add("animate-slide-up");
              }, index * 100); // Stagger the animations
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    // Animate FAQ items when they come into view
    const faqObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const faqItems = entry.target.querySelectorAll(".faq-item");
            faqItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add("animate-slide-in");
              }, index * 150); // Stagger the animations
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (faqRef.current) {
      faqObserver.observe(faqRef.current);
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    return () => {
      observer.disconnect();
      faqObserver.disconnect();
    };
  }, []);

  // Theme color - lime green
  const themeColor = "rgb(212, 255, 31)";

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            // style={{ backgroundColor: themeColor }}
          >
            <img src="/assets/Brickosys.png" alt="" className="h-8 w-8"/>
            {/* <Package className="h-5 w-5 text-gray-800" /> */}
          </div>
          <span className="font-bold text-2xl tracking-tight">Brickosys</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="hover:text-gray-900 transition-colors hover:scale-105 transition-transform relative group"
          >
            Features
            <span
              className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: themeColor }}
            ></span>
          </a>
          {/* <a
            href="#pricing"
            className="hover:text-gray-900 transition-colors hover:scale-105 transition-transform relative group"
          >
            Pricing
            <span
              className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: themeColor }}
            ></span>
          </a>
          <a
            href="#testimonials"
            className="hover:text-gray-900 transition-colors hover:scale-105 transition-transform relative group"
          >
            Testimonials
            <span
              className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: themeColor }}
            ></span>
          </a> */}
          <a
            href="#faqs"
            className="hover:text-gray-900 transition-colors hover:scale-105 transition-transform relative group"
          >
            FAQs
            <span
              className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: themeColor }}
            ></span>
          </a>
          <a
            href="#contactus"
            className="hover:text-gray-900 transition-colors hover:scale-105 transition-transform relative group"
          >
            Contact
            <span
              className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: themeColor }}
            ></span>
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          {/* <a
            href="/signin"
            className="text-gray-700 hover:text-gray-900 transition-colors hover:scale-105 transition-transform"
          >
            Sign in
          </a> */}
          <a
            href="/login"
            className="text-gray-900 px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 font-medium"
            style={{ backgroundColor: themeColor }}
          >
            Login / Sign up
          </a>
        </div>
      </header>

      {/* Hero Section - Redesigned */}
      <section
        ref={heroRef}
        className="relative py-20 overflow-hidden opacity-0 transition-opacity duration-1000"
        style={{ backgroundColor: "rgba(212, 255, 31, 0.1)" }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-20"
          style={{ backgroundColor: themeColor }}
        ></div>
        <div
          className="absolute bottom-10 left-10 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: themeColor }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Increased font size and adjusted styling to match preview */}
            <h1 className="hero-heading font-bold mb-8 leading-tight">
              <div className="text-gray-800 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                Manage Your <span style={{ color: "rgb(80, 90, 0)" }}>Brick</span> Inventory
              </div>
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-2" style={{ color: "rgb(120, 140, 0)" }}>
                Like Never Before
              </div>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
              The ultimate platform for Bricklink and Brick Owl store owners to synchronize, manage, and grow their
              business.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/login"
                className="text-gray-900 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#features"
                className="bg-white border border-gray-200 hover:border-gray-300 text-gray-800 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned */}
      <section className="py-24 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* Increased heading size */}
            <p className="text-5xl sm:text-6xl font-bold mb-6 section-heading">Everything You Need</p>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Our all-in-one platform gives you the tools to manage your brick inventory efficiently
            </p>
          </div>

          <div ref={featuresRef} className="grid md:grid-cols-3 gap-8">
            <div className="feature-item opacity-0 transform translate-y-4 bg-gray-50 rounded-2xl p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-2">
              <div
                className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: "rgba(212, 255, 31, 0.3)" }}
              >
                <RefreshCw className="h-7 w-7 text-gray-800" />
              </div>
              <p className="font-bold text-xl mb-3">Store Synchronisation</p>
              <p className="text-gray-600">Seamlessly synchronize your Bricklink and Brick Owl stores in real-time.</p>
            </div>

            <div className="feature-item opacity-0 transform translate-y-4 bg-gray-50 rounded-2xl p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-2">
              <div
                className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: "rgba(212, 255, 31, 0.3)" }}
              >
                <Cloud className="h-7 w-7 text-gray-800" />
              </div>
              <p className="font-bold text-xl mb-3">Cloud-Based</p>
              <p className="text-gray-600">Access your inventory from anywhere with our secure cloud infrastructure.</p>
            </div>

            <div className="feature-item opacity-0 transform translate-y-4 bg-gray-50 rounded-2xl p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-2">
              <div
                className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: "rgba(212, 255, 31, 0.3)" }}
              >
                <Smartphone className="h-7 w-7 text-gray-800" />
              </div>
              <p className="font-bold text-xl mb-3">Mobile Friendly</p>
              <p className="text-gray-600">Manage your inventory on the go with our responsive mobile interface.</p>
            </div>

            <div className="feature-item opacity-0 transform translate-y-4 bg-gray-50 rounded-2xl p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-2">
              <div
                className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: "rgba(212, 255, 31, 0.3)" }}
              >
                <Package className="h-7 w-7 text-gray-800" />
              </div>
              <p className="font-bold text-xl mb-3">Order Management</p>
              <p className="text-gray-600">Track and manage all your orders in one centralized dashboard.</p>
            </div>

            <div className="feature-item opacity-0 transform translate-y-4 bg-gray-50 rounded-2xl p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-2">
              <div
                className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: "rgba(212, 255, 31, 0.3)" }}
              >
                <BarChart className="h-7 w-7 text-gray-800" />
              </div>
              <p className="font-bold text-xl mb-3">Advanced Reports</p>
              <p className="text-gray-600">
                Gain insights with beautiful, detailed reports on your inventory and sales.
              </p>
            </div>

            <div className="feature-item opacity-0 transform translate-y-4 bg-gray-50 rounded-2xl p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-2">
              <div
                className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center"
                style={{ backgroundColor: "rgba(212, 255, 31, 0.3)" }}
              >
                <Zap className="h-7 w-7 text-gray-800" />
              </div>
              <p className="font-bold text-xl mb-3">Price Adjustment</p>
              <p className="text-gray-600">One-click solution to adjust your inventory prices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Redesigned */}
      <section id="faqs" className="py-20" style={{ backgroundColor: "rgba(212, 255, 31, 0.05)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* Increased heading size */}
            <p className="text-5xl sm:text-6xl font-bold mb-6 section-heading">Frequently Asked Questions</p>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">Everything you need to know about Brickosys</p>
          </div>

          <div ref={faqRef} className="max-w-3xl mx-auto">
            <div className="faq-item opacity-0 transform -translate-x-4 bg-white rounded-xl p-6 mb-6 shadow-sm">
              <p className="text-xl font-bold mb-3">How do I add Inventory?</p>
              <p className="text-gray-600">
                You can carry on adding inventory like you have done previously. Our system integrates seamlessly with
                your existing workflow.
              </p>
            </div>

            <div className="faq-item opacity-0 transform -translate-x-4 bg-white rounded-xl p-6 mb-6 shadow-sm">
              <p className="text-xl font-bold mb-3">How often do you check for Orders?</p>
              <p className="text-gray-600">
                Between every 5 - 15 minutes, this cannot be run manually. Our automated system ensures you never miss
                an order.
              </p>
            </div>

            <div className="faq-item opacity-0 transform -translate-x-4 bg-white rounded-xl p-6 mb-6 shadow-sm">
              <p className="text-xl font-bold mb-3">How often do you run Inventory Integrity Check?</p>
              <p className="text-gray-600">
                Once every 24 hours, but you can run this manually from your dashboard at any time to ensure your
                inventory is always accurate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section id='contactus' className="py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: themeColor }}
        ></div>
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: themeColor }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Increased heading size */}
            <p className="text-5xl sm:text-6xl font-bold mb-6 section-heading">Ready to start keeping track of your Store Inventory?</p>
            <div className="text-xl text-gray-600 mb-10">
              <p className="mb-6">Have more questions? Contact us directly:</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-2">
                <a
                  href="mailto:support@brickosys.com"
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white px-6 py-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex items-center"
                >
                  <div
                    className="absolute inset-0 w-3 bg-gradient-to-r from-transparent to-transparent group-hover:from-transparent group-hover:to-transparent"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <div className="flex items-center">
                    <div
                      className="mr-4 flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(212, 255, 31, 0.2)" }}
                    >
                      <Mail className="h-5 w-5 text-gray-800" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-500">Support</p>
                      <p className="font-semibold text-gray-800">support@brickosys.com</p>
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:sales@brickosys.com"
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white px-6 py-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex items-center"
                >
                  <div
                    className="absolute inset-0 w-3 bg-gradient-to-r from-transparent to-transparent group-hover:from-transparent group-hover:to-transparent"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <div className="flex items-center">
                    <div
                      className="mr-4 flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(212, 255, 31, 0.2)" }}
                    >
                      <ShoppingCart className="h-5 w-5 text-gray-800" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-500">Sales</p>
                      <p className="font-semibold text-gray-800">sales@brickosys.com</p>
                    </div>
                  </div>
                </a>
              </div>

              <p className="text-base text-gray-500 mt-4">We'll get back to you as soon as possible.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/login"
                className="text-gray-900 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                Sign Up Now <ChevronRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#features"
                className="bg-white border border-gray-200 hover:border-gray-300 text-gray-800 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer moved to global App component */}

      {/* CSS for animations */}
      <style>
        {`
        html {
          scroll-behavior: smooth;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Custom styles for hero heading to match preview */
        .hero-heading {
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        
        /* Custom styles for section headings */
        .section-heading {
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        `}
      </style>
    </div>
  );
}

export default LandingPage;