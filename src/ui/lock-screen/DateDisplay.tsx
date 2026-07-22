import "./DateDisplay.css";

const DateDisplay = () => {
  const today = new Date();

  const day = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="date-container">
      <p className="day">{day}</p>
      <p className="date">{date}</p>
    </div>
  );
};

export default DateDisplay;