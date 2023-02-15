import type { VNode } from 'preact';

import { tw } from "twind";

interface SidebarProps {
	children?: VNode | VNode[];
}

const SideBar = ({ children }: SidebarProps) => {
	return (
		<aside className={tw('w-full max-w-sm p-4 bg-gray-100 border-r(1 gray.300)')}>
			{children}
			<h1>Runtime FM</h1>
			<p>This will be where the podcast details are.</p>
		</aside>
	)
}

export { SideBar }
