import { playerService, playerSignal } from "../../lib/audio-player-machine";
import { Slider } from "../core/slider";

const visibleStates = ['paused', 'playing', 'resumed'];

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

  return (
    <div>
      <p>{playerSignal.value.value}</p>
      <button onClick={() => playerService.send('PLAY')}>Play</button>
      <button onClick={() => playerService.send('PAUSE')}>Pause</button>
			<Slider min={0} max={100} value={volume} onChange={updateVolume} />
    </div>
  );
};

export { PlayerControls };