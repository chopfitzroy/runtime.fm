import { tw } from "twind";
import { Header } from "../components/header";
import { SideBar } from "../components/side-bar";
import { PlayerControls } from "../components/player/controls";
import { CursorArrowRipple } from "../components/icons/cursor-arrow-ripple";
import { InformationCircle } from "../components/icons/information-circle";
import { MegaPhone } from "../components/icons/mega-phone";


const About = () => {
	// @NOTE
	// - Should never get here on a non-mobile
	// - That being said we don't really mind if the page content is the same as the side bar
	return (
		<section className={tw('flex w-screen h-screen')}>
			<SideBar />
			<div className={tw('w-full relative flex flex(col) justify-between overflow-auto')}>
				<div>
					<Header>
						<h1 className={tw('text-2xl')}>About</h1>
					</Header>
					<div className={tw('p-4')}>
						<p>
							<a href="/" className={tw('block mb-3 font-bold text-xs')}>Back</a>
						</p>
						<div className={tw('flex items-center mb-2')}>
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
								<li><a href="#" target="_blank" className={tw('font-bold font-mono')}>Apple Podcasts</a></li>
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
					</div>
				</div>
				<PlayerControls />
			</div>
		</section>
	);
}

export default About;
