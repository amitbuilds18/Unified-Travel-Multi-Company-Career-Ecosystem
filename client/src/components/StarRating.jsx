import React from "react";

export default function StarRating({ value = 0, max = 5, size = 16 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = max - full - (half ? 1 : 0);
  const stars = [];

  for (let i = 0; i < full; i++) stars.push("full");
  if (half) stars.push("half");
  for (let i = 0; i < empty; i++) stars.push("empty");

  return (
    <div className="flex items-center space-x-1">
      {stars.map((s, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={s === "full" ? "currentColor" : "none"}
          stroke="currentColor"
          className={`text-yellow-500 ${s !== "full" ? "text-yellow-400" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M11.048 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.285 3.966c.3.921-.755 1.688-1.54 1.118L12 17.347l-3.68 2.614c-.784.57-1.84-.197-1.54-1.118l1.285-3.966a1 1 0 00-.364-1.118L4.324 9.393c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69L11.048 2.927z"
          />
        </svg>
      ))}
    </div>
  );
}
