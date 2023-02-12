import { tw } from "twind";

interface WarningProps {
	message?: string;
}

const Warning = ({ message = 'Please refresh your browser.' }: WarningProps) => {
	return (
		<div className={tw('p-4 mx-4 mb-4 border(2 yellow.400)')}>
			<h3 className={tw('text-white text-lg')}>Something went wrong 👀</h3>
			<p className={tw('text-white')}>{message}</p>
		</div>
	);
}

export { Warning };
