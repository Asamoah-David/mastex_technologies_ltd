export default function MarketingLoading() {
  return (
    <div className="container-page py-24">
      <div className="mx-auto max-w-3xl animate-pulse space-y-6 text-center">
        <div className="mx-auto h-7 w-40 rounded-full bg-muted" />
        <div className="mx-auto h-12 w-3/4 rounded-lg bg-muted" />
        <div className="mx-auto h-12 w-2/3 rounded-lg bg-muted" />
        <div className="mx-auto h-5 w-1/2 rounded bg-muted" />
      </div>
      <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
