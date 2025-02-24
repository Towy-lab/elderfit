// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white rounded-lg overflow-hidden shadow-xl mb-12">
        <div className="container mx-auto px-6 py-16 md:flex md:items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fitness Designed for Seniors
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Gentle exercises, personalized routines, and senior-focused workouts that help you stay active and independent.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100">
                Get Started
              </Link>
              <Link to="/exercises" className="btn bg-transparent border-2 border-white hover:bg-blue-700">
                Explore Exercises
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://via.placeholder.com/600x400" 
              alt="Senior couple exercising" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose ElderFit?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Safe & Low-Impact</h3>
            <p className="text-gray-600">
              All exercises are designed with senior safety in mind, focusing on gentle movements and proper form.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
            <p className="text-gray-600">
              Developed by physical therapists and fitness professionals specializing in senior health.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
              <Clock size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">At Your Own Pace</h3>
            <p className="text-gray-600">
              Flexible routines that adapt to your needs, allowing you to progress at a comfortable rate.
            </p>
          </div>
        </div>
      </section>

      {/* Workout Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Explore Workout Categories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Flexibility', 'Balance', 'Strength', 'Low Impact'].map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={`https://via.placeholder.com/300x200?text=${category}`} 
                alt={category} 
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <p className="text-gray-600 mb-4">
                  {`Exercises focused on improving your ${category.toLowerCase()}.`}
                </p>
                <Link to={`/category/${category.toLowerCase()}`} className="text-blue-600 hover:underline">
                  View Exercises →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-12 px-4 rounded-lg mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Margaret, 72",
              text: "ElderFit has helped me regain my confidence in staying active. The exercises are perfect for my needs."
            },
            {
              name: "Robert, 68",
              text: "After my knee surgery, I wasn't sure how to stay fit. The personalized programs have been a game changer."
            },
            {
              name: "Eleanor, 75",
              text: "I love how everything is explained clearly. It's like having a personal trainer who understands senior fitness."
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <h3 className="font-semibold">{testimonial.name}</h3>
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
        <p className="text-xl mb-6">Join thousands of seniors improving their health and mobility with ElderFit.</p>
        <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default Home;