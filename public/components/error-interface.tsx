
import { VNode } from "preact";
import { useErrorBoundary } from "preact/hooks";

interface ErrorInterfaceProps {
	children?: VNode | VNode[]
}

export function ErrorInterface({ children }: ErrorInterfaceProps) {
	const [error, reset] = useErrorBoundary();

	if (error) {
		return (
			<div>
				<p>{error.message}</p>
				<button onClick={reset}>Reset</button>
			</div>
		)
	}


	return <>{children}</>;
}