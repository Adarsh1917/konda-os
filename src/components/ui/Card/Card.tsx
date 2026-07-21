import "./Card.css";
import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

function Card({
  title,
  children,
  className = "",
}: CardProps) {
  return (
    <div className={`k-card ${className}`}>
      {title && <h3 className="k-card-title">{title}</h3>}

      <div className="k-card-content">
        {children}
      </div>
    </div>
  );
}

export default Card;