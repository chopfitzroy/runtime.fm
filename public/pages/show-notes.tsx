import Markdown from "markdown-to-jsx";

// @ts-expect-error
import files from 'dir:../content';

import { tw } from "twind";
import { useRoute } from "preact-iso";
import { useContext } from "preact/hooks";
import { Tracks } from "../context/tracks";
import { Header } from "../components/header";
import { SideBar } from "../components/side-bar";
import { Warning } from "../components/core/warning";
import { PlayCircle } from "../components/icons/play-circle";
import { PlayerControls } from "../components/player/controls";
import { usePromise } from "../hooks/use-promise";
import { useHead } from "hoofd";
import { createFileUrlFromRecord } from "../helpers/pocketbase";

const getContents = ( episode: number) => async () => {
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
		return 'Sorry, we were unable to find show notes 👀';
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
		throw new Error('Track not found, aborting.');
	}

	useHead({
    title: current.title,
    metas: [
			{ property: 'og:title', content: current.title },
			{ property: 'og:audio', content: createFileUrlFromRecord(current, 'audio') },
			{ property: 'og:image', content: `https://art.runtime.fm/api/album-art?id=${current.id}` },
			{ property: 'og:description', content: current.description },
		],
  });

	return (
		<section className={tw('flex w-screen h-screen')}>
			<SideBar>
				<img src={`https://art.runtime.fm/api/album-art?id=${current.id}&size=500`} alt={current.title} />
			</SideBar>
			<div className={tw('relative w-full flex flex(col) justify-between overflow-auto')}>
				{current === undefined ? <Warning message={'Sorry, we were unable to find show notes 👀'} /> :  (
					<div>
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
								{/* @NOTE The Twind typography plugin does not support custom config */}
								{/* As a result we hack past it with the blow classes */}
								<div className={tw('flex(grow) ml-2 prose font-mono h1:font-sans h2:font-sans h3:font-sans h4:font-sans h5:font-sans h6:font-sans')}>
									<Markdown children={contents} />
								</div>
							</div>
						</div>
					</div>
				)}
				<PlayerControls />
			</div>
		</section>
	);
}

export default ShowNotes;
