'use client'
import { LogIn } from "@/actions/log-in"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { logInSchema } from "@/actions/schemas"

const LogInForm = () => {
  const {register, handleSubmit} = useForm({
    resolver: zodResolver(logInSchema)
  })

  return (
    <form onSubmit={handleSubmit(values => LogIn(values))} className="flex flex-col">
      <fieldset>
        <label htmlFor="email">Enter your email</label>
        <input
          className="ml-2 mb-4 px-2" {...register("email")}
          id="email"
          name="email"
          placeholder="Enter your email..."
        />
      </fieldset>

      <fieldset>
        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          className="ml-2 mb-4 px-2" {...register("password")}
          id="password"
          name="password"
          placeholder="Enter your password..."
        />
      </fieldset>

      <button className="button-secondary w-1/2 m-auto mb-4">Log in!</button>
    </form>
  )
}

export default LogInForm
