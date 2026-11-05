function QuizLoading() {
  return (
    <div>
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-slate-200" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
          >
            <div className="h-5 w-28 rounded-full bg-slate-200" />

            <div className="mt-7 h-7 w-3/4 rounded bg-slate-200" />

            <div className="mt-4 h-4 w-full rounded bg-slate-200" />

            <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />

            <div className="mt-7 border-t border-slate-100 pt-5">
              <div className="flex gap-5">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-4 w-20 rounded bg-slate-200" />
              </div>
            </div>

            <div className="mt-6 h-11 rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizLoading;