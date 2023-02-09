import ReactSlider from "react-slider";
import { tw, css, theme } from "twind/css";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

const trackColors = css({
  '&:first-child': {
    marginRight: '1px',
    backgroundColor: theme('colors.black')
  },
})

const Slider = ({ min, max, value, onChange }: SliderProps) => {
  return <ReactSlider
    min={min}
    max={max}
    value={value}
    onChange={onChange}
    className={tw('h-2 rounded bg(gray.200)')}
    trackClassName={tw('h-2', trackColors)}
    thumbClassName={tw('h-5 w-5 focus:outline(none) bg(white) border border(2 black) rounded(full) -translate-y-1.5')}
  />
}

export { Slider }
