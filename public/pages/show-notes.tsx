import { useRoute } from "preact-iso";
import { useContext } from "preact/hooks";
import { tw } from "twind";
import { Warning } from "../components/core/warning";
import { PlayCircle } from "../components/icons/play-circle";
import { PlayerControls } from "../components/player/controls";
import { SideBar } from "../components/side-bar";
import { Tracks } from "../context/tracks";


const ShowNotes = () => {
	const route = useRoute();
	const tracks = useContext(Tracks)

	const current = tracks.find(track => track.id === route.params.id);

	return (
		<section className={tw('flex w-screen h-screen')}>
			<SideBar>
				<p>DYNAMIC IMAGE</p>
			</SideBar>
			<div className={tw('relative flex(grow) pt-4 bg-[#0d1116]')}>
				{current === undefined ? <Warning message={'Sorry, we were unable to find show notes 👀'} /> :  (
					<div className={tw('px-4')}>
						<div className={tw('mb-2')}>
							<a href="/" className={tw('text(purple.400) text-sm font-bold')}>Back</a>
						</div>
						<div className={tw('flex')}>
							<div>
								<a href={current.url} target="_blank" onClick={current.select}>
									<PlayCircle size={tw('w-12 h-12')} />
								</a>
							</div>
							<div className={tw('flex(grow) ml-2')}>
								<h1 className={tw('mb-1 text-white text-2xl')}>{current.title}</h1>
								<p className={tw('text-white')}>{current.description}</p>
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
