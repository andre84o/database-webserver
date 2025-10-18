import Link from "next/link"
import LogInForm from "./LogInform"

const LogInPage = () => {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="font-bold text-2xl sm:text-3xl mb-4">Log In</h2>
          <LogInForm />
          <div className="mt-4 text-sm text-center text-neutral-600">
            Don't have an account?{' '}
            <Link className="text-blue-500 underline" href="/auth/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
}

export default LogInPage
