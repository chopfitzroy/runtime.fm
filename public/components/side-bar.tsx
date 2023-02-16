import type { VNode } from 'preact';

import { tw } from "twind";
import { CursorArrowRipple } from './icons/cursor-arrow-ripple';
import { InformationCircle } from './icons/information-circle';

interface SidebarProps {
	children?: VNode | VNode[];
}

const SideBar = ({ children }: SidebarProps) => {
	return (
		<aside className={tw('w-full max-w-sm p-4 border-r(2 black)')}>
			<div className={tw('mb-4')}>
				{children}
			</div>
			<h1 className={tw('mb-2 text-2xl text-center font-bold')}>Runtime FM</h1>
			<div className={tw('flex items-center mb-2')}>
				<InformationCircle />
				<p className={tw('ml-2 text-lg font-bold')}>About</p>
			</div>
			<div className={tw('mb-4')}>
				<p>Runtime FM is a podcast for developers, designers, dev ops, dev rel, and more.</p>
				<p>We talk about the latest in technology and have a strong focus on the web.</p>
				<p>Start listening today to gain a better understanding of the latest trends in our industry.</p>
			</div>
			<div className={tw('flex items-center mb-2')}>
				<CursorArrowRipple />
				<p className={tw('ml-2 text-lg font-bold')}>Listen</p>
			</div>
			<div className={tw('mb-4')}>
				<ul>
					<li><a href="#" className={tw('font-bold')}>Apple Podcasts</a></li>
					<li><a href="#" className={tw('font-bold')}>Overcast</a></li>
					<li><a href="#" className={tw('font-bold')}>Spotify</a></li>
					<li><a href="#" className={tw('font-bold')}>RSS</a></li>
				</ul>
			</div>
		</aside>
	)
}

export { SideBar }
