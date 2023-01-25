import Header from './header.js';

import { Routes } from './routes';
import { LocationProvider, ErrorBoundary } from 'preact-iso';

export function App() {
	return (
		<LocationProvider>
			<div class="app">
				<Header />
				<ErrorBoundary>
          <Routes />
				</ErrorBoundary>
			</div>
		</LocationProvider>
	);
}
