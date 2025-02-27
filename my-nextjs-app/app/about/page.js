"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStarHalfAlt,
  faBrain,
  faUserCheck,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function About() {
  const features = [
    {
      icon: faStarHalfAlt,
      title: "Beyond Star Ratings",
      description:
        "Instead of relying solely on ratings, BookSage breaks down what readers actually say about a book—its emotional impact, narrative style, and depth of ideas.",
    },
    {
      icon: faBrain,
      title: "AI-Powered Insights",
      description:
        "Our system analyzes thousands of reader reviews to highlight the most important themes and discussions around a book.",
    },
    {
      icon: faUserCheck,
      title: "Personalized Book Discovery",
      description:
        "Find books based on what truly resonates with you—whether it’s “Clever Political Commentary,” “Complex Character Arcs,” or “Heart-Wrenching Endings.”",
    },
    {
      icon: faLightbulb,
      title: "Smarter Recommendations",
      description:
        "Loved a book for its thought-provoking themes? BookSage connects you with similar books that match its essence, not just its genre.",
    },
  ];

  return (
    <div className="pb-8">
      <div className="flex items-center justify-center max-w-4xl mx-auto">
        <Image
          src="/BookSageLogo.png"
          alt="Book Sage Logo"
          width={288}
          height={96}
          className="w-72 object-cover rounded-lg hover:cursor-pointer"
        />
        <div className="flex flex-col gap-y-5">
          <h1>WELCOME TO BOOK SAGE</h1>
          <div>
            <p className="mb-4">
              BookSage is an intelligent book discovery and analysis platform
              designed to help you find books in a smarter, more meaningful way.
              Unlike traditional platforms that rely on star ratings and generic
              recommendations, BookSage goes deeper—analyzing reader sentiment,
              extracting key themes, and uncovering the unique storytelling
              elements that make each book special.
            </p>
            <p>
              At BookSage, we believe great books are more than just
              ratings—they're experiences. Whether you're looking for your next
              thought-provoking read or a hidden literary gem, let BookSage
              guide you to books that truly speak to you.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2 p-6 max-w-5xl mx-auto">
        <h2 className="mb-4 underline underline-offset-4 pb-1">
          What Makes BookSage Different?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 text-left">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="w-12 h-12 rounded-lg bg-black/10 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={feature.icon}
                  className="text-brown-700 text-2xl"
                />
              </div>
              <h3 className="font-bold text-lg mt-3">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
