import Link from "next/link"
import LogInForm from "./LogInform"

const LogInPage = () => {
    return (
      <>
        <div className="border-1 rounded-xl p-4 w-[700px] mx-auto">
          <h2 className="font-bold text-3xl mb-4">Log In</h2>
          <LogInForm />
          <div>
            Dont have an account? Sign up
            <Link className="text-blue-500" href="/auth/signup">
              Sign up
            </Link>
          </div>
        </div>
      </>
    );
}

export default LogInPage
