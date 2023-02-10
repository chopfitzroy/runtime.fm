import { tw } from "twind";
import { playerService, playerSignal } from "../../lib/audio-player-machine";
import { HorizontalSlider, VerticalSlider } from "../core/slider";

const visibleStates = ['paused', 'playing', 'resumed', 'loading'];

const updateVolume = (value: number) => {
  const volume = value / 100;
  playerService.send({
    type: 'VOLUME_SET',
    value: volume
  });
}

const PlayerControls = () => {
  if (!visibleStates.includes(playerSignal.value.value as string)) {
    return null;
  }

  const volume = playerSignal.value.context.volume * 100;
  const progress = playerSignal.value.context.playing.progress ?? 0;

  return (
    <div className={tw('absolute inset(x-0) bottom-0 p-4')}>
      <p className={tw('text(white)')}>{playerSignal.value.value}</p>
      <button className={tw('text(white)')} onClick={() => playerService.send('PLAY')}>
      </button>
      <button className={tw('text(white)')} onClick={() => playerService.send('PAUSE')}>Pause</button>
      <VerticalSlider min={0} max={100} value={volume} onChange={updateVolume} className={tw('h-24')} />
      <HorizontalSlider min={0} max={100} value={progress} />
    </div>
  );
};

export { PlayerControls };