
import { tw } from "twind";
import { pocketbase } from "../helpers/pocketbase";

const signin = async (email: string, password: string) => {
  console.log({ email, password });
  
  await pocketbase.collection("users").authWithPassword(
    email,
    password,
  );
};

const submitHandler = async (event: Event) => {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);
  const { email, password } = Object.fromEntries(formData);

  await signin(email as string, password as string);

  window.location.href = "/";
};

export default function Signin() {
  return (
    <div className={tw('flex items-center justify-center w-screen h-screen p-4 bg-[#161b22]')}>
      <div className={tw('p-4 rounded bg-[#0d1116]')}>
        <p className={tw('text-white')}>Don't have an account? <a href="/signup" className={tw('text-purple-400')}>Sign up</a>.</p>
        <form onSubmit={submitHandler}>
          <label for="email">Email</label>
          <input type="text" id="email" name="email" />
          <label for="password">Password</label>
          <input type="password" id="password" name="password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}