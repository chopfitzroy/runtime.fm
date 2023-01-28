import { useRoute } from "preact-iso";
import { useContext } from "preact/hooks";
import { Tracks } from "../context/tracks";


const ShowNotes = () => {
	const route = useRoute();
	const tracks = useContext(Tracks)

	const current = tracks.find(track => track.id === route.params.id);

	if (current === undefined) {
		return <p>Sorry, we were unable to find show notes 👀</p>
	}

	return <p>{current.description}</p>
}

export default ShowNotes;
