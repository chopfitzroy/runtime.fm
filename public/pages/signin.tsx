import { pocketbase } from "../helpers/pocketbase";

const login = async (username: string, password: string) => {
  await pocketbase.collection("users").authWithPassword(
    username,
    password,
  );
};

const submitHandler = async (event: Event) => {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);
  const { username, password } = Object.fromEntries(formData);

  await login(username as string, password as string);

  window.location.href = "/";
};

export default function Signup() {
  return (
    <div>
      <form onSubmit={submitHandler}>
        <label for="username">Username</label>
        <input type="text" id="username" name="username" />
        <label for="password">Password</label>
        <input type="password" id="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}