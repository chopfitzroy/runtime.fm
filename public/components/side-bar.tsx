import type { VNode } from 'preact';

import { tw } from "twind";
import { CursorArrowRipple } from './icons/cursor-arrow-ripple';
import { InformationCircle } from './icons/information-circle';
import { Tracks } from '../context/tracks';
import { useContext } from 'preact/hooks';
import { MegaPhone } from './icons/mega-phone';

interface SidebarProps {
	children?: VNode | VNode[];
}

const SideBar = ({ children }: SidebarProps) => {
	const tracks = useContext(Tracks);

	const [latest] = tracks;

	return (
		<aside className={tw('w-full max-w-sm hidden px-4 overflow-auto border-r(2 black) md:block')}>
			{children ? children : (
				<img src={`/art/thumb/${latest.id}.png`} alt={latest.title} />
			)}
			<div className={tw('flex items-center my-2')}>
				<InformationCircle />
				<p className={tw('ml-2 text-lg font-bold')}>About</p>
			</div>
			<div className={tw('mb-8')}>
				<p className={tw('font-mono')}>Runtime FM is a podcast for software engineers interested in web development.</p>
				<p className={tw('font-mono')}>We talk about the latest in technology trends and share our thoughts on what these could mean for our industry.</p>
			</div>
			<div className={tw('flex items-center mb-2')}>
				<CursorArrowRipple />
				<p className={tw('ml-2 text-lg font-bold')}>Listen</p>
			</div>
			<div className={tw('mb-4')}>
				<ul>
					<li><a href="https://podcasts.google.com/feed/aHR0cHM6Ly9ydW50aW1lLmZtL3Jzcy54bWw" target="_blank" className={tw('font-bold font-mono')}>Google Podcasts</a></li>
					<li><a href="https://podcasts.apple.com/us/podcast/runtime-fm/id1687932747" target="_blank" className={tw('font-bold font-mono')}>Apple Podcasts</a></li>
					<li><a href="https://open.spotify.com/show/15z8cEpiTnbmmQy5EDt4Sy" target="_blank" className={tw('font-bold font-mono')}>Spotify</a></li>
					<li><a href="/rss.xml" target="_blank" className={tw('font-bold font-mono')}>RSS</a></li>
				</ul>
			</div>
			<div className={tw('flex items-center mb-2')}>
				<MegaPhone />
				<p className={tw('ml-2 text-lg font-bold')}>Want more</p>
			</div>
			<div className={tw('mb-4')}>
				<ul>
					<li><a href="https://discord.gg/nTajDw3HC5" target="_blank" className={tw('font-bold font-mono')}>Join the Discord</a></li>
				</ul>
			</div>
		</aside>
	)
}

export { SideBar }
