import Markdown from "markdown-to-jsx";

// @ts-expect-error
import files from 'dir:../content';

import { tw } from "twind";
import { useHead } from "hoofd";
import { useRoute } from "preact-iso";
import { useContext } from "preact/hooks";
import { Tracks } from "../context/tracks";
import { Header } from "../components/header";
import { SideBar } from "../components/side-bar";
import { usePromise } from "../hooks/use-promise";
import { PlayCircle } from "../components/icons/play-circle";
import { PlayerControls } from "../components/player/controls";
import { createFileUrlFromRecord } from "../helpers/pocketbase";

const getContents = (episode: number) => async () => {
	const episodes = (files as string[]).map(file => {
		const [segment] = file.split('-');
		const episode = parseInt(segment);

		return {
			file,
			episode,
		}
	});

	const target = episodes.find(item => item.episode === episode);

	if (target === undefined) {
		return 'Show notes for this episode are still being uploaded, please try again later.';
	}

	const contents = await fetch(`/content/${target.file}`);

	return contents.text();
}

const ShowNotes = () => {
	const route = useRoute();
	const tracks = useContext(Tracks)
	const contents = usePromise(`showNotes-${route.params.episode}`, getContents(parseInt(route.params.episode)));

	const current = tracks.find(track => track.episode === parseInt(route.params.episode));

	if (current === undefined) {
		throw new Error(`Whoops! Something we couldn't find that episode!`);
	}

	useHead({
		title: current.title,
		metas: [
			{ property: 'og:title', content: current.title },
			{ property: 'og:audio', content: createFileUrlFromRecord(current, 'audio') },
			{ property: 'og:image', content: `https://runtime.fm/art/${current.id}.png` },
			{ property: 'og:description', content: current.description },
		],
	});

	return (
		<section className={tw('flex w-screen h-screen')}>
			<SideBar>
				<img src={`/art/thumb/${current.id}.png`} alt={current.title} />
			</SideBar>
			<div className={tw('relative w-full flex flex(col) justify-between overflow-auto')}>
				<div>
					<Header>
						<h1 className={tw('text-2xl')}>{current.title}</h1>
					</Header>
					<div className={tw('p-4')}>
						<p>
							<a href="/" className={tw('block mb-2 font-bold text-xs')}>Back</a>
						</p>
						<p>
							<a href={current.url} target="_blank" onClick={current.select} className={tw('flex items-center text-sm font-bold font-mono')}>
								<PlayCircle />
								<span className={tw('inline-block ml-2')}>
									Listen
								</span>
							</a>
						</p>
						<div className={tw('flex')}>
							<div className={tw('flex(grow) ml-2 prose font-mono text-black heading:font-sans')}>
								<Markdown children={contents} />
							</div>
						</div>
					</div>
				</div>
				<PlayerControls />
			</div>
		</section>
	);
}

export default ShowNotes;
