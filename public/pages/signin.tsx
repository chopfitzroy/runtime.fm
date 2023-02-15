
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
    <div className={tw('flex items-center justify-center w-screen h-screen p-4')}>
      <div className={tw('p-4 rounded border(2 black)')}>
        <p>Don't have an account? <a href="/signup" className={tw('font-bold')}>Sign up</a>.</p>
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