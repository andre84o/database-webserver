import { SignUp } from "@/actions/sign-up";

const SignUpForm = () => {
  return (
    <form
      action={SignUp}
      className="border-1 rounded-xl p-4 flex flex-col w-3xl mx-auto"
    >
      <h2>Sign up</h2>

      <fieldset>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          className="border-1 rounded-md p-2 w-full"
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          className="border-1 rounded-md p-2 w-full"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="border-1 rounded-md p-2 w-full"
        />
      </fieldset>

      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md p-2 mt-4 w-full"
      >
        Sign up
      </button>
    </form>
  );
};

export default SignUpForm;
