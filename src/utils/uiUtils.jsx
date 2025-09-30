import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export const renderStars = (
  rating,
  interactive = false,
  onRatingChange = null,
) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => onRatingChange(star) : undefined}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          {star <= rating ? (
            <StarIconSolid className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarIcon className="h-5 w-5 text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
};
