import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="border-b border-black p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">LeetTrack</h1>
          <div className="space-x-4">
            <Link href="/auth/login" className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Structured LeetCode Learning</h1>
          <p className="text-xl text-black mb-8">
            Master coding interviews through admin-curated learning paths and personalized daily study plans
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-black text-white text-lg hover:bg-gray-800 transition-colors"
          >
            Get Started
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="border border-black p-6">
            <h3 className="text-xl font-bold mb-4">Curated Learning Paths</h3>
            <p className="text-black">
              Quality-controlled curriculum designed by experts for different topics and skill levels
            </p>
          </div>
          <div className="border border-black p-6">
            <h3 className="text-xl font-bold mb-4">Daily Planning</h3>
            <p className="text-black">
              Set custom daily quotas for new problems and reviews with intelligent recommendations
            </p>
          </div>
          <div className="border border-black p-6">
            <h3 className="text-xl font-bold mb-4">Progress Tracking</h3>
            <p className="text-black">
              Comprehensive analytics and spaced repetition system for optimal learning retention
            </p>
          </div>
        </div>

        <div className="border border-black p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start your coding journey?</h2>
          <p className="text-black mb-6">
            Join LeetTrack and transform your interview preparation with structured learning
          </p>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </main>
    </div>
  );
}
