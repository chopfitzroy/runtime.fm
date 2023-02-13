import logo from '../../assets/logo.png';

import { tw } from 'twind';
import { useContext } from 'preact/hooks';
import { Tracks } from '../context/tracks';
import { PlayerControls } from '../components/player/controls';
import { Warning } from '../components/core/warning';
import { playerSignal } from '../lib/audio-player-machine';
import { SideBar } from '../components/side-bar';
import { Header } from '../components/header';

export default function Home() {
	const tracks = useContext(Tracks);

	const showWarning = playerSignal.value.value === 'failed';
	const errorMessage = playerSignal.value.context.reason;

	return (
		<section className={tw('flex w-screen h-screen')}>
			<SideBar>
				<img src={logo} className={tw('w-full')} />
			</SideBar>
			<div className={tw('relative flex(grow) pt-4 bg-[#0d1116]')}>
				<Header>
					<h1 className={tw('text-white text-2xl')}>Latest episodes</h1>
				</Header>
				{showWarning && <Warning message={errorMessage} />}
				{tracks.map(track => (
					<div className={tw('border-b(1 gray.700)')}>
						<div className={tw('p-4')}>
							<p className={tw('text-gray-400 text-sm')}>{track.created}</p>
							<p className={tw('text(white) text-lg font-bold my-1')}>{track.title}</p>
							<p className={tw('text(white)')}>{track.description}</p>
							<div className={tw('flex items-center justify-between my-4')}>
								<div className={tw('flex items-center')}>
									<a href={track.url} target="_blank" onClick={track.select} className={tw('text(purple.400) text-sm font-bold')}>
										{track.state === 'waiting' && 'Listen'}
										{track.state === 'continue' && 'Continue'}
										{track.state === 'finished' && 'Listen again'}
									</a>
									<span className={tw('inline-block mx-2 text-gray-400')}>&#47;</span>
									<a href={`/show-notes/${track.id}`} className={tw('text(purple.400) text-sm font-bold')}>Show notes</a>
								</div>
								<div>
									{track.state === 'continue' && (
										<p className={tw('text-gray-400 text-sm')}>{Math.floor(track.progress)}%</p>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
				<PlayerControls />
			</div>
		</section>
	);
}
