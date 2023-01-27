import Header from './components/header';

import { Routes } from './routes';
import { TracksProvider } from './context/tracks';
import { LocationProvider, ErrorBoundary } from 'preact-iso';
import { ErrorInterface } from './components/error-interface';

export function App() {
	return (
		<LocationProvider>
			<div>
				<Header />
				<ErrorBoundary>
					<TracksProvider>
						<ErrorInterface>
							<Routes />
						</ErrorInterface>
					</TracksProvider>
				</ErrorBoundary>
			</div>
		</LocationProvider>
	);
}
