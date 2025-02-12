export default function StarRating({ rating, numberOfReviews }) {
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const starPath =
    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

  return (
    <div className="flex items-end gap-x-2">
      <div className="flex items-center">
        {[...Array(maxStars)].map((_, index) => {
          if (index < fullStars) {
            return (
              <svg
                key={index}
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d={starPath}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </svg>
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <svg
                key={index}
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <defs>
                  <linearGradient id="halfStarGradient">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#E5E7EB" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#halfStarGradient)"
                  d={starPath}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </svg>
            );
          } else {
            return (
              <svg
                key={index}
                className="w-6 h-6 text-gray-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d={starPath}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </svg>
            );
          }
        })}
        <h3 className="ml-2 tracking-wide">{rating}/5 Stars</h3>
      </div>
      <p className="text-gray-500">({numberOfReviews} reviews)</p>
    </div>
  );
}
