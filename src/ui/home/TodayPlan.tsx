import "./TodayPlan.css";

const tasks = [
  {
    title: "Complete React Dashboard",
    time: "10:00 AM",
  },
  {
    title: "Practice TypeScript",
    time: "2:00 PM",
  },
  {
    title: "Read AI Notes",
    time: "6:00 PM",
  },
];

const TodayPlan = () => {
  return (
    <section className="today-plan">
      <h2>Today's Plan</h2>

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-card" key={task.title}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.time}</p>
            </div>

            <span className="task-status"></span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TodayPlan;