import PocketBase from 'pocketbase';

import { useRoute } from "preact-iso";
import { usePromise } from "../lib/use-promise";

const PB = new PocketBase('https://api.coffeeandcode.app');

const getTrack = (id: string) => PB.collection('tracks').getFirstListItem(`id="${id}"`);

const ShowNotes = () => {
	const route = useRoute();
	// @TODO
	// - We can just pull this from the context
	// - But good to know a request will work and pre-render
	const details = usePromise(route.params.id, getTrack)

	return <p>{details.description}</p>
}

export default ShowNotes;
