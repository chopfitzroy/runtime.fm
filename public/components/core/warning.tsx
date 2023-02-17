import { tw } from "twind";

interface WarningProps {
	message?: string;
}

const Warning = ({ message = 'Please refresh your browser.' }: WarningProps) => {
	return (
		<div className={tw('p-4 mx-4 mb-4 border(2 black)')}>
			<p className={tw('text-lg font-mono')}>Something went wrong 👀</p>
			<p className={tw('font-mono')}>{message}</p>
		</div>
	);
}

export { Warning };
