import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Backend rating is 1-10. We display as 5 stars (rating/2).
export default function StarRating({ value = 0, outOf = 10, showNumber = true, size = "text-sm" }) {
  const stars5 = (Number(value) / outOf) * 5;
  const full = Math.floor(stars5);
  const hasHalf = stars5 - full >= 0.25 && stars5 - full < 0.75;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <span className={`inline-flex items-center gap-1 text-orange-500 ${size}`}>
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f${i}`} />
      ))}
      {hasHalf && <FaStarHalfAlt />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e${i}`} />
      ))}
      {showNumber && (
        <span className="text-slate-600 ml-1 text-xs">
          {Number(value).toFixed(1)}/{outOf}
        </span>
      )}
    </span>
  );
}
