"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";

const blogs = [
  {
    image: "/blog-1.png",
    category: "Nutrition",
    date: "May 28, 2026",
    title: "10 Superfoods You Should Add to Your Diet Today",
    excerpt:
      "Discover the top superfoods that can boost your immune system, improve energy levels, and support overall wellness.",
  },
  {
    image: "/blog-2.png",
    category: "Wellness",
    date: "May 22, 2026",
    title: "The Importance of Mental Health in Daily Life",
    excerpt:
      "Mental health is just as important as physical health. Explore practical tips for managing stress and building resilience.",
  },
  {
    image: "/blog-3.png",
    category: "Telemedicine",
    date: "May 15, 2026",
    title: "How Telemedicine is Revolutionizing Healthcare Access",
    excerpt:
      "From rural communities to busy professionals, telemedicine is breaking down barriers to quality healthcare access.",
  },
];

export default function Blog() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="py-10 sm:py-14 lg:py-20 bg-white"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <span className="inline-block text-teal font-semibold text-[10px] sm:text-[11px] tracking-widest uppercase">
              Our Blog
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              Health Tips &amp; News
            </h2>
          </div>
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-1.5 text-teal font-semibold text-sm hover:gap-2.5 transition-all"
          >
            View All Articles <ArrowRight size={16} />
          </a>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {blogs.map((blog) => (
            <article
              key={blog.title}
              className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="h-36 sm:h-44 overflow-hidden relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                {/* Category Badge */}
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-[9px] sm:text-[10px] font-semibold px-2 sm:px-2.5 py-1 rounded-md uppercase tracking-wider mb-2 sm:mb-3">
                  <Tag size={9} className="sm:hidden" />
                  <Tag size={10} className="hidden sm:block" />
                  {blog.category}
                </span>

                {/* Title */}
                <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 mb-1.5 sm:mb-2 leading-snug group-hover:text-teal transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-xs mb-2 sm:mb-3">
                  <Calendar size={11} className="sm:hidden" />
                  <Calendar size={12} className="hidden sm:block" />
                  {blog.date}
                </div>

                {/* Excerpt */}
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>

                {/* Read More Button */}
                <button className="inline-flex items-center gap-1.5 bg-teal text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-teal-dark transition-colors">
                  Read More
                  <ArrowRight size={12} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-5 sm:hidden">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm"
          >
            View All Articles <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </motion.section>
  );
}
