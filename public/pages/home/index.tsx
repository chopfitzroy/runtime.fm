import { tw } from 'twind';

import { useContext, useState } from 'preact/hooks';
import { Tracks } from '../../context/tracks';

export default function Home() {
	const [count, setCount] = useState(0);

	const tracks = useContext(Tracks);

	return (
		<section>
			<h1 className={tw`text(blue-500)`}>Home</h1>
			<p>This is the home page.</p>
			{tracks.map(track => <a href={`/show-notes/${track.id}`}>{track.audio}</a>)}
			<button style={{ width: 30 }} onClick={() => setCount(count - 1)}>
				-
			</button>
			<output style={{ padding: 10 }}>Count: {count}</output>
			<button style={{ width: 30 }} onClick={() => setCount(count + 1)}>
				+
			</button>
		</section>
	);
}
