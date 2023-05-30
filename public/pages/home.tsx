import { tw } from 'twind';
import { useContext } from 'preact/hooks';
import { Tracks } from '../context/tracks';
import { PlayerControls } from '../components/player/controls';
import { Warning } from '../components/core/warning';
import { playerSignal } from '../lib/audio-player-machine';
import { SideBar } from '../components/side-bar';
import { Header } from '../components/header';
import { PlayCircle } from '../components/icons/play-circle';

export default function Home() {
	const tracks = useContext(Tracks);

	const showWarning = playerSignal.value.value === 'failed';
	const errorMessage = playerSignal.value.context.reason;

	return (
		<section className={tw('flex w-screen h-screen')}>
			<SideBar />
			<div className={tw('relative w-full flex flex(col) justify-between overflow-auto')}>
				<div>
					<Header>
						<h1 className={tw('text-2xl')}>Latest episodes</h1>
					</Header>
					{showWarning && <Warning message={errorMessage} />}
					<div className={tw('pb-2')}>
						{tracks.map(track => (
							<div className={tw('border-b(2 black)')}>
								<div className={tw('p-4')}>
									<p className={tw('text-gray-500 text-sm font-mono')}>{track.created}</p>
									<p className={tw('text-lg font-bold my-1 font-mono')}>{track.title}</p>
									<p className={tw('font-mono')}>{track.description}</p>
									<div className={tw('flex items-center justify-between my-4')}>
										<div className={tw('flex items-center')}>
											<a href={track.url} target="_blank" onClick={track.select} className={tw('flex items-center text-sm font-bold font-mono')}>
												<PlayCircle />
												<span className={tw('inline-block ml-2')}>
													{track.state === 'waiting' && 'Listen'}
													{track.state === 'continue' && 'Continue'}
													{track.state === 'finished' && 'Listen again'}
												</span>
											</a>
											<span className={tw('hidden')}>
												<span className={tw('inline-block mx-2 text-gray-300')}>&#47;</span>
												<a href={`/show-notes/${track.id}`} className={tw('text-sm font-bold font-mono')}>Show notes</a>
											</span>
										</div>
										<div>
											{track.state === 'continue' && (
												<p className={tw('text-gray-500 text-sm font-mono')}>{Math.floor(track.progress)}%</p>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<PlayerControls />
			</div>
		</section>
	);
}
