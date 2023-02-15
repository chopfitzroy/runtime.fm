
import { tw } from "twind";
import { pocketbase } from "../helpers/pocketbase";

const login = async (data: FormData) => {
	await pocketbase.collection("users").create(data);
};

const submitHandler = async (event: Event) => {
	event.preventDefault();

	const formData = new FormData(event.target as HTMLFormElement);
	await login(formData);

	window.location.href = "/";
};

export default function Signup() {
	return (
		<div className={tw('flex items-center justify-center w-screen h-screen p-4')}>
			<div className={tw('p-4 rounded border(2 black)')}>
				<p>Already have an account? <a href="/signin" className={tw('font-bold')}>Sign in</a>.</p>
				<form onSubmit={submitHandler}>
					<label for="email">Email</label>
					<input type="text" id="email" name="email" />
					<label for="password">Password</label>
					<input type="password" id="password" name="password" />
					<label for="passwordConfirm">Confirm password</label>
					<input type="password" id="passwordConfirm" name="passwordConfirm" />
					<button type="submit">Sign up</button>
				</form>
			</div>
		</div>
	);
}