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
      "Discover the top superfoods that can boost your immune system, improve energy levels, and support overall wellness. Learn how simple dietary changes can transform your health.",
  },
  {
    image: "/blog-2.png",
    category: "Wellness",
    date: "May 22, 2026",
    title: "The Importance of Mental Health in Daily Life",
    excerpt:
      "Mental health is just as important as physical health. Explore practical tips for managing stress, building resilience, and maintaining emotional balance in today's fast-paced world.",
  },
  {
    image: "/blog-3.png",
    category: "Telemedicine",
    date: "May 15, 2026",
    title: "How Telemedicine is Revolutionizing Healthcare Access",
    excerpt:
      "From rural communities to busy professionals, telemedicine is breaking down barriers to quality healthcare. Learn how virtual consultations are making medical care more accessible.",
  },
];

export default function Blog() {
  return (
    <section className="py-20 lg:py-28 bg-mint-light">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-teal font-semibold text-sm mb-3 tracking-wider uppercase">
            Our Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Health Tips & News
          </h2>
          <p className="text-gray-500 text-lg">
            Stay informed with the latest health insights, wellness tips, and
            medical advancements from our experts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article
              key={blog.title}
              className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="h-52 overflow-hidden relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 gradient-teal text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1">
                  <Tag size={12} />
                  {blog.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Calendar size={13} />
                  {blog.date}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {blog.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm group-hover:gap-2.5 transition-all"
                >
                  Read More <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
