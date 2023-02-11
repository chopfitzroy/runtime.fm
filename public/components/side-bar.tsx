import type { VNode } from 'preact';

import { tw } from "twind";

interface SidebarProps {
	children?: VNode | VNode[];
}

const SideBar = ({ children }: SidebarProps) => {
	return (
		<aside className={tw('w-full max-w-sm p-4 bg-[#161b22] border-r(1 gray.700)')}>
			{children}
			<h1 className={tw`text(white)`}>Runtime FM</h1>
			<p className={tw`text(white)`}>This will be where the podcast details are.</p>
		</aside>
	)
}

export { SideBar }
