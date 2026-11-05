function PerformanceChart({
  correct,
  incorrect,
  skipped,
  total,
}) {
  const bars = [
    {
      label: "Correct",
      value: correct,
      barClass: "bg-emerald-500",
      textClass: "text-emerald-600",
    },
    {
      label: "Incorrect",
      value: incorrect,
      barClass: "bg-red-500",
      textClass: "text-red-600",
    },
    {
      label: "Skipped",
      value: skipped,
      barClass: "bg-yellow-200 border-2 border-b-0 border-slate-200",
      textClass: "text-slate-500",
    },
  ];

  return (
    <div className="w-full">
      {/* Heading */}
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
        Performance
      </p>

      <h3 className="mt-2 text-xl font-black text-slate-950">
        Score Breakdown
      </h3>

      {/* Chart */}
      <div className="mt-8">

        {/* Chart area */}
        <div className="relative h-52 border-b border-slate-200">

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-center gap-8 px-6">

            {bars.map((bar) => {
              const height =
                total > 0
                  ? (bar.value / total) * 100
                  : 0;

              return (
                <div
                  key={bar.label}
                  className="flex h-full w-16 flex-col items-center justify-end"
                >

                  {/* Value */}
                  <span
                    className={`mb-2 text-sm font-black ${bar.textClass}`}
                  >
                    {bar.value}
                  </span>

                  {/* Bar */}
                  <div className="flex h-40 w-12 items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ${bar.barClass}`}
                      style={{
                        height:
                          bar.value > 0
                            ? `${height}%`
                            : "4px",
                      }}
                    />
                  </div>

                  {/* Label */}
                  <span className="mt-3 whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {bar.label}
                  </span>

                </div>
              );
            })}

          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 flex items-center justify-center gap-5">

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-slate-500">
              Correct
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-[10px] font-semibold text-slate-500">
              Incorrect
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-yellow-300" />
            <span className="text-[10px] font-semibold text-slate-300">
              Skipped
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default PerformanceChart;