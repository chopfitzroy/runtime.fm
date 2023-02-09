import logo from '../../assets/logo.png';

import { tw } from 'twind';
import { useContext } from 'preact/hooks';
import { Tracks } from '../../context/tracks';
import { PlayerControls } from '../../components/player/controls';

export default function Home() {
	const tracks = useContext(Tracks);

	return (
		<section className={tw('flex w-screen h-screen')}>
			<div className={tw('w-full max-w-sm p-4 bg-[#161b22]')}>
				<img src={logo} className={tw('w-full')} />
				<h1 className={tw`text(white)`}>Runtime FM</h1>
				<p className={tw`text(white)`}>This will be where the podcast details are.</p>
			</div>
			<div className={tw('relative flex(grow) p-4 bg-[#0d1116]')}>
				{tracks.map(track => <div>
					<p className={tw`text(white)`}>{track.title}</p>
					<p className={tw`text(yellow.400)`}><a href={track.url} target="_blank" onClick={track.select}>Listen</a></p>
					<p className={tw`text(white)`}><a href={`/show-notes/${track.id}`}>Show notes</a></p>
				</div>)}
				<PlayerControls />
			</div>
		</section>
	);
}
