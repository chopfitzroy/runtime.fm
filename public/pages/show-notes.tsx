import { useRoute } from "preact-iso";
import { useContext } from "preact/hooks";
import { tw } from "twind";
import { Warning } from "../components/core/warning";
import { Header } from "../components/header";
import { PlayCircle } from "../components/icons/play-circle";
import { PlayerControls } from "../components/player/controls";
import { SideBar } from "../components/side-bar";
import { Tracks } from "../context/tracks";
import { useAsset } from "use-asset";
import Markdown from "markdown-to-jsx";

const getContents = async (_: string) => {
	const contents = await fetch('/content/001-2023-Tech-Trends.md');
	return contents.text();
}

const ShowNotes = () => {
	const route = useRoute();
	const tracks = useContext(Tracks)
	const contents = useAsset(getContents, "showNotes");

	const current = tracks.find(track => track.id === route.params.id);

	if (current === undefined) {
		return null;
	}

	return (
		<section className={tw('flex w-screen h-screen')}>
			<SideBar>
				<img src={`https://art.runtime.fm/api/album-art?id=${current.id}&size=500`} alt={current.title} />
			</SideBar>
			<div className={tw('relative flex(grow) pt-4 overflow-auto')}>
				{current === undefined ? <Warning message={'Sorry, we were unable to find show notes 👀'} /> :  (
					<>
						<Header>
							<h1 className={tw('text-2xl')}>{current.title}</h1>
						</Header>
						<div className={tw('p-4')}>
							<p>
								<a href="/" className={tw('block mb-2 font-bold text-xs')}>Back</a>
							</p>
							<div className={tw('flex')}>
								<div>
									<a href={current.url} target="_blank" onClick={current.select}>
										<PlayCircle size={tw('w-12 h-12')} />
									</a>
								</div>
								<div className={tw('flex(grow) ml-2')}>
									<Markdown children={contents} />
								</div>
							</div>
						</div>
					</>
				)}
				<PlayerControls />
			</div>
		</section>
	);
}

export default ShowNotes;
