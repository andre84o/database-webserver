
import Link from "next/link";
import SignUpForm from "./SignUpForm";

const SignUpPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-3xl px-4">
        <div className="bg-transparent">
          <h2 className="font-bold text-3xl mb-4 text-center">Sign Up</h2>
          <SignUpForm />

          <div className="mt-4 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link className="text-[#735BFD] font-medium" href="/auth/login">Log in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
