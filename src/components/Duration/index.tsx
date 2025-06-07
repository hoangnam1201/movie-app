import React from "react";
interface DurationProps {
  duration: string;
}
const Duration = (props: DurationProps) => {
  const { duration } = props;
  return (
    <div className="flex items-center gap-2 border-1 border-white rounded-md p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>

      <text>{duration}</text>
    </div>
  );
};

export default Duration;
