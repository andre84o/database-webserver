import Link from "next/link";
import LogInForm from "./LogInform";

const LogInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 -mx-8 sm:mx-0 -translate-y-10">
      <div
        className="
          w-full
          max-w-lg
          sm:max-w-xl
          lg:max-w-2xl
          bg-white rounded-2xl shadow-2xl p-6 shadow-xl shadow-blue-500">
        <h2 className="font-bold text-2xl sm:text-3xl mb-4">Log In</h2>
        <LogInForm />
        <div className="mt-4 text-sm text-center text-neutral-600">
          Don't have an account?{" "}
          <Link className="text-blue-500 underline" href="/auth/signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
