import PocketBase from 'pocketbase';
import styles from './style.module.css';

import { useState } from 'preact/hooks';
import { usePromise } from '../../lib/use-promise';

const PB = new PocketBase('https://api.coffeeandcode.app');

const getTracks = () => PB.collection('tracks').getFullList<{ audio: string }>(200, {
	sort: '-created',
})

export default function Home() {
	const [count, setCount] = useState(0);
	const records = usePromise('tracks', getTracks);

	return (
		<>
			<section class={styles.home}>
				<h1>Home</h1>
				<p>This is the home page.</p>
				{records.map(record => <p>{record.audio}</p>)}
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
