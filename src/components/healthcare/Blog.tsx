"use client";

import React from "react";
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
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="inline-block text-teal font-semibold text-[11px] tracking-widest uppercase">
              Our Blog
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
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

        {/* Blog Cards - 3 in a row */}
        <div className="grid md:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <article
              key={blog.title}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="h-44 overflow-hidden relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category Badge */}
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider mb-3">
                  <Tag size={10} />
                  {blog.category}
                </span>

                {/* Title */}
                <h3 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug group-hover:text-teal transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                  <Calendar size={12} />
                  {blog.date}
                </div>

                {/* Excerpt */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>

                {/* Read More Button */}
                <button className="inline-flex items-center gap-1.5 bg-teal text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-dark transition-colors group-hover:gap-2.5 transition-all">
                  Read More
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-6 sm:hidden">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm"
          >
            View All Articles <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
