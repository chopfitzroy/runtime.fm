import { tw } from "twind";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  onInput?: (event: unknown) => void
}

const Slider = ({ min, max, value, onInput }: SliderProps) => (
  <input type="range" min={min} max={max} value={value} onInput={onInput} className={tw('w-full h-2 bg(gray-200) rounded-lg appearance-none cursor-pointer')} />

);

export { Slider }
