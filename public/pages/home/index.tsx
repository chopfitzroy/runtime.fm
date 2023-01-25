import styles from './style.module.css';

import { useContext, useState } from 'preact/hooks';
import { Tracks } from '../../routes';

export default function Home() {
	const [count, setCount] = useState(0);

	const tracks = useContext(Tracks);

	return (
		<>
			<section class={styles.home}>
				<h1>Home</h1>
				<p>This is the home page.</p>
				{tracks.map(track => <a href={`/show-notes/${track.id}`}>{track.audio}</a>)}
				<>
					<button style={{ width: 30 }} onClick={() => setCount(count - 1)}>
						-
					</button>
					<output style={{ padding: 10 }}>Count: {count}</output>
					<button style={{ width: 30 }} onClick={() => setCount(count + 1)}>
						+
					</button>
				</>
			</section>
		</>
	);
}
