import type { VNode } from 'preact';
import { tw } from 'twind';

interface HeaderProps {
	children?: VNode | VNode[];
}

const Header = ({ children }: HeaderProps) => {
	return (
		<div className={tw('flex items-center justify-between p-4 border-b(1 gray.700)')}>
			<div>{children}</div>
			<div>
				<a href="/signin" className={tw('text-yellow-400')}>Sign In</a>
			</div>
		</div>
	);
}

export { Header };
