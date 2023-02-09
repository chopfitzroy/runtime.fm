import { tw } from 'twind';

import { useContext } from 'preact/hooks';
import { Tracks } from '../../context/tracks';
import { PlayerControls } from '../../components/player/controls';

export default function Home() {
	const tracks = useContext(Tracks);

	return (
		<section>
			<h1 className={tw`text(blue-500)`}>Home</h1>
			<p>This is the home page.</p>
			{tracks.map(track => <div>
				<p>{track.title}</p>
				<p><a href={track.url} target="_blank" onClick={track.select}>Listen</a></p>
				<p><a href={`/show-notes/${track.id}`}>Show notes</a></p>
			</div>)}
			<PlayerControls />
		</section>
	);
}
