export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center">
        <h1 className="text-4xl font-bold mb-4">
          Yet Another Path Planner
        </h1>
        <p className="text-xl mb-8">
          A tool for finding, creating, and tracking flight tours for flight simulation careers
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Find Tours</h2>
            <p>Discover interesting flight routes and tour options</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Create Tours</h2>
            <p>Design your own multi-leg flight tours</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Track Progress</h2>
            <p>Monitor your career progression through planned tours</p>
          </div>
        </div>
      </div>
    </main>
  )
}
