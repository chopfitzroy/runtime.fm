import ReactSlider from "react-slider";
import { tw, css, theme } from "twind/css";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const trackColors = css({
  '&:first-child': {
    marginRight: '1px',
    backgroundColor: theme('colors.yellow.400'),
  },
})

const HorizontalSlider = ({ min, max, value, onChange, className = '' }: SliderProps) => {
  return <ReactSlider
    min={min}
    max={max}
    value={value}
    onChange={onChange}
    className={tw(`h-2 rounded bg(gray.700) ${className}`)}
    trackClassName={tw('h-2 rounded(full)', trackColors)}
    thumbClassName={tw('h-5 w-5 focus:outline(none) bg(white) border-[#161b22] border(2) rounded(full) -translate-y-1.5')}
  />
}

const VerticalSlider = ({ min, max, value, onChange, className = '' }: SliderProps) => {
  return <ReactSlider
    min={min}
    max={max}
    value={value}
    invert
    orientation="vertical"
    onChange={onChange}
    className={tw(`w-2 rounded bg(gray.700) ${className}`)}
    trackClassName={tw('w-2 rounded(full)', trackColors)}
    thumbClassName={tw('h-5 w-5 focus:outline(none) bg(white) border-[#161b22] border(2) rounded(full) -translate-x-1.5')}
  />
}


export { VerticalSlider, HorizontalSlider }
