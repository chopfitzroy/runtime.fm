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
			{tracks.map(track => <div>
				<p>{track.title}</p>
				<p><a href={track.url} target="_blank">Listen</a></p>
				<p><a href={`/show-notes/${track.id}`}>Show notes</a></p>
			</div>)}
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
