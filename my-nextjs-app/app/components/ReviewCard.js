"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-4 py-6 flex items-start gap-6">
      <div className="flex-shrink-0">
        <FontAwesomeIcon
          icon={faUserCircle}
          className="text-gray-300 text-4xl"
        />
      </div>
      <div
        className={`relative ${
          expanded ? "" : "line-clamp-5"
        } overflow-hidden text-left`}
      >
        <span className="text-gray-800">{review}</span>
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="absolute bottom-0 right-0 bg-beige-100 text-blue-500 px-1 hover:underline"
          >
            ...more
          </button>
        )}
      </div>
    </div>
  );
}
