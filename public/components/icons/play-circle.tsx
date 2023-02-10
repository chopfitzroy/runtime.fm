import { tw } from "twind";

interface PlayCircleProps {
	size?: string;
	color?: string;
}

const PlayCircle = ({ size = tw('h-6 w-6'), color = tw('text-white') }: PlayCircleProps) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={tw(size, color)}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
	</svg>
)

export { PlayCircle };
