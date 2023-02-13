import { Record } from 'pocketbase';
import type { VNode } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { tw } from 'twind';
import { pocketbase } from '../helpers/pocketbase';

interface HeaderProps {
	children?: VNode | VNode[];
}

const signOut = () => {
  pocketbase.authStore.clear();
};

const Header = ({ children }: HeaderProps) => {
	const [loggedIn, setLoggedIn] = useState(pocketbase.authStore.model instanceof Record);

	useEffect(() => {
		const remove = pocketbase.authStore.onChange((_, model) => {
			setLoggedIn(model instanceof Record);
		});

		return remove;
	}, [])

	return (
		<div className={tw('flex items-center justify-between p-4 border-b(1 gray.700)')}>
			<div>{children}</div>
			<div>
				{loggedIn ? (
					<button onClick={signOut} className={tw('text-purple-400')}>Sign out</button>
				) : (
					<a href="/signin" className={tw('text-purple-400')}>Sign In</a>
				)}
			</div>
		</div>
	);
}

export { Header };
