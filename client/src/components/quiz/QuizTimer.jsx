function QuizTimer({
  timeLeft,
  isTimeWarning,
  isTimeCritical,
  formatTime,
}) {
  return (
    <div
      className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 ${
        isTimeCritical
          ? "border-red-400/30 bg-red-500/10 text-red-300"
          : isTimeWarning
            ? "border-amber-400/30 bg-amber-500/10 text-amber-300"
            : "border-indigo-400/20 bg-indigo-500/10 text-indigo-300"
      }`}
    >
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
          isTimeCritical
            ? "bg-red-500/10"
            : isTimeWarning
              ? "bg-amber-500/10"
              : "bg-indigo-500/10"
        }`}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 1.5" />
          <path d="M9 3h6" />
        </svg>
      </div>

      <div>
        <p className="hidden text-[8px] font-bold uppercase tracking-wider opacity-60 sm:block">
          Time remaining
        </p>

        <p className="font-mono text-sm font-bold tabular-nums">
          {formatTime(timeLeft)}
        </p>
      </div>
    </div>
  );
}

export default QuizTimer;