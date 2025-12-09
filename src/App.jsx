import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import AdminPage from "./pages/adminPage";
import TestPage from "./pages/testPage";
import { Toaster } from "react-hot-toast";
import ClientWebPage from "./pages/client/clientPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPasswordPage from "./pages/client/forgetPassword";
import { init3DTyping } from "./utils/typing3d";
import Snowflakes from "./components/Snowflakes";
import { getChristmasStatus } from "./services/christmas";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
	const [christmasMode, setChristmasMode] = useState(false);

	useEffect(() => {
		const cleanup = init3DTyping();
		return cleanup;
	}, []);

	useEffect(() => {
		// Fetch Christmas mode status
		getChristmasStatus()
			.then(res => {
				setChristmasMode(res.data.enabled);
				// Store in localStorage for quick access
				localStorage.setItem('christmasMode', JSON.stringify(res.data));
			})
			.catch(err => console.log('Could not fetch Christmas status'));

		// Check every 30 seconds for updates
		const interval = setInterval(() => {
			getChristmasStatus()
				.then(res => {
					setChristmasMode(res.data.enabled);
					localStorage.setItem('christmasMode', JSON.stringify(res.data));
				})
				.catch(err => console.log('Could not fetch Christmas status'));
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	return (
		<GoogleOAuthProvider clientId={clientId}>
			{christmasMode && <Snowflakes />}
			<div className="w-full h-screen flex justify-center items-center bg-primary text-secondary">
				<Toaster position="top-right" />
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/test" element={<TestPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/admin/*" element={<AdminPage />} />
					<Route path="/forget" element={<ForgetPasswordPage/>}/>
					<Route path="/*" element={<ClientWebPage />} />
				</Routes>
			</div>
		</GoogleOAuthProvider>
	);
}

export default App;
