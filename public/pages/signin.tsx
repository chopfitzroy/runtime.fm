
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
      <div className={tw('p-4 w-full max-w-md rounded border(2 black)')}>
        <p className={tw('mb-4')}>Don't have an account? <a href="/signup" className={tw('font-bold')}>Sign up</a>.</p>
        <form onSubmit={submitHandler}>
          <label for="email">Email</label>
          <input type="text" id="email" name="email" className={tw('block w-full p-1 mb-4 border-b(2 black) outline-none')} />
          <label for="password">Password</label>
          <input type="password" id="password" name="password" className={tw('block w-full p-1 mb-4 border-b(2 black) outline-none')} />
          <div className={tw('flex items-center justify-end')}>
            <button type="submit" className={tw('px-2 py-1 border(2 black) rounded text-sm font-bold')}>Sign in</button>
          </div>
        </form>
      </div>
    </div>
  );
}