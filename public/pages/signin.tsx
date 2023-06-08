
import { tw } from "twind";
import { pocketbase } from "../helpers/pocketbase";
import { useContext } from "preact/hooks";
import { Tracks } from "../context/tracks";
import { useHead } from "hoofd";

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
	const tracks = useContext(Tracks);

	const [current] = tracks;

	useHead({
		title: 'Sign in to Runtime FM',
		metas: [
			{ property: 'og:title', content: 'Sign in to Runtime FM' },
			{ property: 'og:image', content: `https://runtime.fm/art/${current.id}.png` },
			{ property: 'og:description', content: 'Sing into your Runtime FM account and keep tack of your listening progress across multiple devices.' },
		],
	});

  return (
    <div className={tw('flex items-center justify-center w-screen h-screen p-4')}>
      <div className={tw('p-4 w-full max-w-md rounded border(2 black)')}>
				<p>
					<a href="/" className={tw('block mb-3 font-bold text-xs')}>Back</a>
				</p>
        <form onSubmit={submitHandler}>
          <label for="email" className={tw('font-mono')}>Email</label>
          <input type="text" id="email" name="email" className={tw('block w-full p-1 mb-4 border-b(2 black) outline-none font-mono')} />
          <label for="password" className={tw('font-mono')}>Password</label>
          <input type="password" id="password" name="password" className={tw('block w-full p-1 mb-4 border-b(2 black) outline-none font-mono')} />
          <div className={tw('flex items-center justify-end')}>
            <button type="submit" className={tw('px-2 py-1 border(2 black) rounded text-sm font-bold font-mono')}>Sign in</button>
          </div>
        </form>
        <p className={tw('mb-2 font-mono')}>Don't have an account? <a href="/signup" className={tw('font-bold font-mono')}>Sign up</a>.</p>
      </div>
    </div>
  );
}