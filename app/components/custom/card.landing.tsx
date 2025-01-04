import React from "react";

/**
 *
 */

interface LandingCardProps {
  subtitle: string;
  title: string;
  icon: React.ReactNode;
}
const LandingCard: React.FC<LandingCardProps> = ({ subtitle, title, icon }) => {
  return (
    <div className="flex space-x-4 items-center py-2 pl-2 pr-6 rounded-full bg-white/35 backdrop-blur-xl border border-white">
      <div className="bg-white p-6 rounded-full">{icon}</div>
      <div className="flex justify-between w-full items-center space-x-16">
        <div className="flex flex-col">
          <span className="text-sm">{subtitle}</span>
          <span className="text-lg font-semibold">{title}</span>
        </div>
        <svg
          width="15"
          height="15"
          className="size-10"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default LandingCard;
