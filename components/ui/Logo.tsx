interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

export default function Logo({ className = "", size = "md", variant = "full" }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon: Schild mit Paragraph */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Schild */}
        <path
          d="M24 4L6 10V22C6 33.05 13.68 43.22 24 46C34.32 43.22 42 33.05 42 22V10L24 4Z"
          fill="#1e3a5f"
          stroke="#1e3a5f"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Innerer Schild-Akzent */}
        <path
          d="M24 8L10 13V22C10 30.84 16.16 38.94 24 41.5C31.84 38.94 38 30.84 38 22V13L24 8Z"
          fill="#152a45"
        />
        {/* Paragraph Symbol */}
        <text
          x="24"
          y="30"
          textAnchor="middle"
          fill="#c9a227"
          fontSize="20"
          fontWeight="bold"
          fontFamily="DM Sans, sans-serif"
        >
          §
        </text>
      </svg>

      {variant === "full" && (
        <div className={`font-bold ${text} leading-tight`}>
          <span className="text-primary">META</span>{" "}
          <span className="text-accent">Datenschutzklage</span>
        </div>
      )}
    </div>
  );
}

