import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Star,
  Sparkles,
  Target,
  Award,
  Rocket,
} from "lucide-react";
import {
  features,
  gettingStartedSteps,
  stats,
  benefits,
  testimonials,
} from "@/data/home_data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Animate elements on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Cycle through features automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      {/* Hero Section with Advanced Design */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating Code Elements */}
        <div className="absolute top-20 left-10 opacity-10 animate-float">
          <div className="text-blue-400 text-sm font-mono bg-slate-800/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-blue-400/20">
            function analyze() {"{"}
          </div>
        </div>
        <div className="absolute top-40 right-16 opacity-10 animate-float animation-delay-1000">
          <div className="text-green-400 text-sm font-mono bg-slate-800/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-green-400/20">
            const ai = new AI();
          </div>
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-10 animate-float animation-delay-2000">
          <div className="text-purple-400 text-sm font-mono bg-slate-800/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-purple-400/20">
            reviewCode(file);
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div
            className={`text-center transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-center mb-6">
              <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group">
                <Sparkles className="w-4 h-4 mr-2 group-hover:animate-spin" />
                AI-Powered Platform
              </Badge>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your Code with
              <span className="text-blue-400 block mt-2 animate-pulse">
                AI Intelligence
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the future of code development with our AI-powered
              platform. Get instant reviews, security analysis, and intelligent
              suggestions that help you write{" "}
              <span className="font-semibold text-blue-400 animate-pulse">
                better
              </span>
              ,
              <span className="font-semibold text-green-400 animate-pulse animation-delay-500">
                {" "}
                safer
              </span>
              , and
              <span className="font-semibold text-purple-400 animate-pulse animation-delay-1000">
                {" "}
                more maintainable
              </span>{" "}
              code.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/chat">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/60 text-white hover:bg-white/20 hover:text-white px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-sm group"
                >
                  <MessageSquare className="mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                  Chat with AI
                </Button>
              </Link>
              <Link to="/review">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <FileText className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Start Code Review
                  <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div
                    className={`text-2xl sm:text-3xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                <Star className="w-4 h-4 mr-2 animate-pulse" />
                Powerful Features
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for
              <span className="text-purple-400 block mt-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Code Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools and AI-powered insights to elevate your
              development workflow with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br ${
                  feature.color
                } backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer overflow-hidden relative ${
                  activeFeature === index
                    ? "ring-4 ring-blue-400 ring-opacity-50 shadow-blue-500/20"
                    : ""
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full group-hover:from-white/10 transition-all duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                        {React.cloneElement(feature.icon, {
                          className: "h-10 w-10 text-white",
                        })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {feature.capabilities.map((capability, capIndex) => (
                      <div
                        key={capIndex}
                        className="flex items-center space-x-4 group/item hover:bg-white/5 rounded-xl p-3 transition-all duration-300"
                      >
                        <div className="p-2 rounded-full bg-green-500/20 group-hover:bg-green-400/30 transition-colors border border-green-400/50 group-hover:border-green-400/70">
                          <CheckCircle className="h-5 w-5 text-green-300 group-hover:text-green-200 transition-colors" />
                        </div>
                        <span className="text-gray-200 font-medium group/item-hover:text-white transition-colors flex-1">
                          {capability}
                        </span>
                        <ArrowRight className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 group/item-hover:text-blue-400 transition-all duration-300 transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redesigned Getting Started Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <Badge className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 text-sm font-medium shadow-lg">
                <Rocket className="w-4 h-4 mr-2" />
                Getting Started
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start Your Journey in
              <span className="text-yellow-400 block mt-2">
                Three Simple Steps
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Transform your development workflow with our intuitive platform
              designed for developers of all levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gettingStartedSteps.map((step, index) => (
              <Card
                key={index}
                className="bg-white/8 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl group shadow-xl hover:border-white/30"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-6">
                    <div
                      className={`relative p-6 ${step.bgColor} ${step.hoverColor} rounded-3xl transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl`}
                    >
                      {React.cloneElement(step.icon, {
                        className: `h-8 w-8 ${step.color}`,
                      })}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white mb-4 group-hover:text-yellow-200 transition-colors">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-200 leading-relaxed group-hover:text-gray-100">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 shadow-lg">
                <Target className="w-4 h-4 mr-2" />
                Why Choose Codify
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Accelerate Your
              <span className="text-green-400 block mt-2">
                Development Speed
              </span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Experience the transformative power of AI-assisted development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br ${benefit.color} backdrop-blur-xl border ${benefit.borderColor} rounded-2xl p-6 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gray-100 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <Badge className="bg-green-600 text-white px-6 py-3 shadow-lg">
                <Award className="w-4 h-4 mr-2" />
                Trusted by Developers
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Developers
              <span className="text-green-400 block mt-2">Are Saying</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Join thousands of developers who have transformed their coding
              experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/8 backdrop-blur-xl border border-white/20 hover:bg-white/12 transition-all duration-500 hover:scale-105 hover:shadow-2xl group shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/20 to-transparent rounded-bl-full"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-300">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-blue-400">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-200 leading-relaxed mb-4 italic">
                    {testimonial.review}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {testimonial.highlight}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
