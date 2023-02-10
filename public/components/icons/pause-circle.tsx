import { tw } from "twind";

interface PauseCircleProps {
	size?: string;
	color?: string;
}

const PauseCircle = ({ size = tw('h-6 w-6'), color = tw('text-white') }: PauseCircleProps) => (
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={tw(size, color)}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
)

export { PauseCircle };
