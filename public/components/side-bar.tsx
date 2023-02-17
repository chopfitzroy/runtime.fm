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
			{children ? children : (
				<div className={tw('flex items-center justify-center mt-12 mb-20')}>
				<h1 className={tw('text-center border-b(2 black) -rotate-2')}>
					<span className={tw('inline-block text-5xl font-mono')}>Runtime</span>
					<span className={tw('inline-block ml-2 text-6xl font-bold')}>FM</span>
				</h1>
		</div>
			)}
			<div className={tw('flex items-center mb-2')}>
				<InformationCircle />
				<p className={tw('ml-2 text-lg font-bold')}>About</p>
			</div>
			<div className={tw('mb-8')}>
				<p className={tw('font-mono')}>Runtime FM is a podcast for developers, designers, dev ops, dev rel, and more.</p>
				<p className={tw('font-mono')}>We talk about the latest in technology and have a strong focus on the web.</p>
				<p className={tw('font-mono')}>Start listening today to gain a better understanding of the latest trends in our industry.</p>
			</div>
			<div className={tw('flex items-center mb-2')}>
				<CursorArrowRipple />
				<p className={tw('ml-2 text-lg font-bold')}>Listen</p>
			</div>
			<div className={tw('mb-4')}>
				<ul>
					<li><a href="#" className={tw('font-bold font-mono')}>Apple Podcasts</a></li>
					<li><a href="#" className={tw('font-bold font-mono')}>Overcast</a></li>
					<li><a href="#" className={tw('font-bold font-mono')}>Spotify</a></li>
					<li><a href="#" className={tw('font-bold font-mono')}>RSS</a></li>
				</ul>
			</div>
		</aside>
	)
}

export { SideBar }
