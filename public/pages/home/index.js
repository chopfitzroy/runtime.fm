import styles from './style.module.css';
import { useState } from 'preact/hooks';
import { useContent } from '../../lib/use-fetch';

export default function Home() {
	const [count, setCount] = useState(0);
	const { items } = useContent('https://api.coffeeandcode.app/api/collections/tracks/records');

	
	return (
		<>
			<section class={styles.home}>
				<h1>Home</h1>
				<p>This is the home page.</p>
				{items.map(item => <p>{item.audio}</p>)}
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
