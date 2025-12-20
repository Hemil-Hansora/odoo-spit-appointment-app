"use client";

import { Inter } from "next/font/google";
import Script from "next/script";
import { useEffect, useState } from "react";

type Tab = "customer" | "organizer" | "admin";

declare global {
	interface Window {
		lucide?: {
			createIcons: () => void;
		};
	}
}

const inter = Inter({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800"],
	display: "swap",
});

export default function Page() {
	const [activeTab, setActiveTab] = useState<Tab>("customer");

	const handleIconRender = () => {
		if (typeof window === "undefined") return;
		window.lucide?.createIcons();
	};

	useEffect(() => {
		document.title = "Appointment App – The Perfect Booking System";
		document.documentElement.classList.add("scroll-smooth");

		const revealElements = document.querySelectorAll<HTMLElement>(".reveal");
		const navbar = document.getElementById("navbar");

		const revealOnScroll = () => {
			const windowHeight = window.innerHeight;
			const elementVisible = 100;

			revealElements.forEach((element) => {
				const elementTop = element.getBoundingClientRect().top;
				if (elementTop < windowHeight - elementVisible) {
					element.classList.add("active");
				}
			});
		};

		const handleNavbar = () => {
			if (!navbar) return;
			if (window.scrollY > 50) {
				navbar.classList.add("shadow-sm", "bg-white/95");
			} else {
				navbar.classList.remove("shadow-sm", "bg-white/95");
			}
		};

		const handleScroll = () => {
			revealOnScroll();
			handleNavbar();
		};

		revealOnScroll();
		handleNavbar();

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		handleIconRender();
	}, [activeTab]);

	const tabButtonClasses = (tab: Tab) =>
		`tab-btn px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
			activeTab === tab
				? "text-slate-900 bg-white shadow-sm"
				: "text-slate-500 bg-transparent hover:text-slate-900"
		}`;

	const tabContentClasses = (tab: Tab) =>
		`${activeTab === tab ? "block animate-in fade-in slide-in-from-bottom-2" : "hidden"} tab-content`;

	return (
		<main
			className={`${inter.className} bg-slate-50 text-slate-800 antialiased overflow-x-hidden selection:bg-brand-100 selection:text-brand-900`}
		>
			<Script src="https://unpkg.com/lucide@latest" strategy="afterInteractive" onLoad={handleIconRender} />

			<nav
				className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300"
				id="navbar"
			>
				<div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
							<i data-lucide="calendar-check-2" className="w-5 h-5" />
						</div>
						<span className="font-bold text-xl tracking-tight text-slate-900">
							Appoint<span className="text-brand-600">.</span>
						</span>
					</div>

					<div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
						<a href="#use-cases" className="hover:text-brand-600 transition-colors">
							Use Cases
						</a>
						<a href="#features" className="hover:text-brand-600 transition-colors">
							Features
						</a>
						<a href="#how-it-works" className="hover:text-brand-600 transition-colors">
							How it Works
						</a>
						<a href="#pricing" className="hover:text-brand-600 transition-colors">
							Pricing
						</a>
					</div>

					<div className="flex items-center gap-4">
						<a href="#" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-slate-900">
							Log in
						</a>
						<a
							href="#"
							className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-slate-900/10"
						>
							Get Started
						</a>
					</div>
				</div>
			</nav>

			<section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
				<div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
					<div className="max-w-2xl reveal active">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-brand-600 mb-8">
							<span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
							v2.0 is now live
						</div>
						<h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
							The Perfect <br />
							<span className="text-slate-400">Appointment</span> <br />
							Booking System
						</h1>
						<p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
							Manage real-time availability, enforce flexible rules, and ensure zero double bookings. The
							enterprise-grade scheduling layer for modern professionals.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<a
								href="#"
								className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-600/20 transition-all transform hover:-translate-y-1 text-center"
							>
								Try Interactive Demo
							</a>
							<a
								href="#"
								className="px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all text-center"
							>
								Create a Service
							</a>
						</div>
						<div className="mt-8 flex items-center gap-4 text-sm text-slate-400">
							<div className="flex -space-x-2">
								<img
									src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"
									className="w-8 h-8 rounded-full border-2 border-slate-50"
									alt="Customer 1"
								/>
								<img
									src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64"
									className="w-8 h-8 rounded-full border-2 border-slate-50"
									alt="Customer 2"
								/>
								<img
									src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64"
									className="w-8 h-8 rounded-full border-2 border-slate-50"
									alt="Customer 3"
								/>
							</div>
							<p>Trusted by 10,000+ professionals</p>
						</div>
					</div>

					<div className="relative reveal delay-100">
						<div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-100/50 rounded-full blur-3xl" />

						<div className="relative bg-white rounded-2xl shadow-floating border border-slate-100 p-8 max-w-md mx-auto lg:ml-auto">
							<div className="flex items-start justify-between mb-8 border-b border-slate-100 pb-6">
								<div className="flex gap-4">
									<div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
										<i data-lucide="user" className="w-6 h-6" />
									</div>
									<div>
										<h3 className="font-bold text-slate-900">Discovery Call</h3>
										<p className="text-sm text-slate-500">30 min • Zoom Video</p>
									</div>
								</div>
							</div>

							<div className="mb-6">
								<h4 className="text-sm font-semibold text-slate-900 mb-3">Select a Date</h4>
								<div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
									<button className="p-1 hover:bg-white rounded">
										<i data-lucide="chevron-left" className="w-4 h-4 text-slate-400" />
									</button>
									<span className="text-sm font-medium text-slate-700">October 2023</span>
									<button className="p-1 hover:bg-white rounded">
										<i data-lucide="chevron-right" className="w-4 h-4 text-slate-400" />
									</button>
								</div>
								<div className="grid grid-cols-7 gap-1 mt-4 text-center text-xs">
									<span className="text-slate-400">M</span>
									<span className="text-slate-400">T</span>
									<span className="text-slate-400">W</span>
									<span className="text-slate-400">T</span>
									<span className="text-slate-400">F</span>
									<span className="text-slate-400">S</span>
									<span className="text-slate-400">S</span>
									<span className="p-2 text-slate-300">25</span>
									<span className="p-2 text-slate-300">26</span>
									<span className="p-2 text-slate-900 font-bold bg-brand-50 rounded-full text-brand-600">27</span>
									<span className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">28</span>
									<span className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">29</span>
									<span className="p-2 text-slate-300">30</span>
									<span className="p-2 text-slate-300">1</span>
								</div>
							</div>

							<div>
								<h4 className="text-sm font-semibold text-slate-900 mb-3">Available Times</h4>
								<div className="grid grid-cols-2 gap-3">
									<button className="slot-btn border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 transition-colors">
										09:00 AM
									</button>
									<button className="slot-btn border border-brand-600 bg-brand-50 rounded-lg py-2 text-sm font-medium text-brand-600 transition-colors">
										10:30 AM
									</button>
									<button className="slot-btn border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 transition-colors">
										01:00 PM
									</button>
									<button className="slot-btn border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 transition-colors">
										03:30 PM
									</button>
								</div>
							</div>

							<button className="w-full mt-8 bg-slate-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
								Confirm Booking <i data-lucide="arrow-right" className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</section>

			<section id="use-cases" className="py-24 bg-white border-y border-slate-100">
				<div className="max-w-[1440px] mx-auto px-6">
					<div className="text-center max-w-xl mx-auto mb-16 reveal">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">Built for every professional</h2>
						<p className="text-slate-500">
							Whether you are a solo consultant or a large enterprise, our system adapts to your unique scheduling
							needs.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-floating hover:bg-white transition-all duration-300 user-card reveal">
							<div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
								<i data-lucide="stethoscope" className="w-6 h-6" />
							</div>
							<h3 className="text-lg font-bold text-slate-900 mb-2">Healthcare</h3>
							<p className="text-sm text-slate-500 leading-relaxed">
								Streamline patient intake with HIPAA-compliant booking flows and automated reminders.
							</p>
						</div>

						<div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-floating hover:bg-white transition-all duration-300 user-card reveal delay-100">
							<div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
								<i data-lucide="briefcase" className="w-6 h-6" />
							</div>
							<h3 className="text-lg font-bold text-slate-900 mb-2">Consultants</h3>
							<p className="text-sm text-slate-500 leading-relaxed">
								Manage multiple client time zones and collect payments upfront effortlessly.
							</p>
						</div>

						<div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-floating hover:bg-white transition-all duration-300 user-card reveal delay-200">
							<div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
								<i data-lucide="users" className="w-6 h-6" />
							</div>
							<h3 className="text-lg font-bold text-slate-900 mb-2">Recruitment</h3>
							<p className="text-sm text-slate-500 leading-relaxed">
								Coordinate panel interviews with multi-organizer features and feedback loops.
							</p>
						</div>

						<div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-floating hover:bg-white transition-all duration-300 user-card reveal delay-300">
							<div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
								<i data-lucide="graduation-cap" className="w-6 h-6" />
							</div>
							<h3 className="text-lg font-bold text-slate-900 mb-2">Education</h3>
							<p className="text-sm text-slate-500 leading-relaxed">
								Simplify office hours and advisory sessions for students and faculty members.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section id="how-it-works" className="py-24 bg-slate-50">
				<div className="max-w-[1440px] mx-auto px-6">
					<h2 className="text-3xl font-bold text-slate-900 mb-16 text-center reveal">Workflow made simple</h2>

					<div className="relative grid md:grid-cols-3 gap-12">
						<div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-0.5 bg-slate-200 -z-0" />

						<div className="relative z-10 flex flex-col items-center text-center reveal">
							<div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center text-lg font-bold text-brand-600 shadow-sm mb-6">
								1
							</div>
							<h3 className="text-xl font-bold text-slate-900 mb-3">Create Service</h3>
							<p className="text-slate-500 max-w-xs">Define availability, buffers, and duration. Customize your booking link.</p>
						</div>

						<div className="relative z-10 flex flex-col items-center text-center reveal delay-100">
							<div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center text-lg font-bold text-brand-600 shadow-sm mb-6">
								2
							</div>
							<h3 className="text-xl font-bold text-slate-900 mb-3">Users Book</h3>
							<p className="text-slate-500 max-w-xs">Clients select a time that works for them via a beautiful self-serve interface.</p>
						</div>

						<div className="relative z-10 flex flex-col items-center text-center reveal delay-200">
							<div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center text-lg font-bold text-brand-600 shadow-sm mb-6">
								3
							</div>
							<h3 className="text-xl font-bold text-slate-900 mb-3">It Runs Smoothly</h3>
							<p className="text-slate-500 max-w-xs">Calendar syncs automatically, reminders are sent, and you just show up.</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-24 bg-white border-y border-slate-100 overflow-hidden">
				<div className="max-w-[1440px] mx-auto px-6">
					<div className="text-center mb-12 reveal">
						<h2 className="text-3xl font-bold text-slate-900">Tailored experiences for every role</h2>
					</div>

					<div className="flex justify-center mb-12 reveal">
						<div className="inline-flex bg-slate-100 p-1.5 rounded-xl">
							<button onClick={() => setActiveTab("customer")} id="tab-customer" className={tabButtonClasses("customer")}>
								Customer View
							</button>
							<button onClick={() => setActiveTab("organizer")} id="tab-organizer" className={tabButtonClasses("organizer")}>
								Organizer View
							</button>
							<button onClick={() => setActiveTab("admin")} id="tab-admin" className={tabButtonClasses("admin")}>
								Admin Dashboard
							</button>
						</div>
					</div>

					<div className="relative reveal delay-100">
						<div id="content-customer" className={tabContentClasses("customer")}>
							<div className="bg-slate-900 rounded-2xl p-2 md:p-4 shadow-2xl max-w-5xl mx-auto border border-slate-800">
								<div className="bg-white rounded-xl overflow-hidden aspect-[16/9] flex relative">
									<div className="w-1/3 bg-slate-50 border-r border-slate-100 p-8 hidden md:block">
										<div className="w-12 h-12 bg-indigo-100 rounded-full mb-4" />
										<div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
										<div className="h-3 bg-slate-200 rounded w-1/2 mb-8" />
										<div className="space-y-3">
											<div className="h-10 bg-white border border-slate-200 rounded-lg shadow-sm" />
											<div className="h-10 bg-white border border-slate-200 rounded-lg shadow-sm" />
										</div>
									</div>
									<div className="flex-1 p-8">
										<div className="flex justify-between items-center mb-6">
											<div className="h-6 bg-slate-200 rounded w-1/3" />
											<div className="flex gap-2">
												<div className="w-8 h-8 bg-slate-100 rounded" />
												<div className="w-8 h-8 bg-slate-100 rounded" />
											</div>
										</div>
										<div className="grid grid-cols-3 gap-4">
											<div className="h-24 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-600 font-medium">
												9:00 AM
											</div>
											<div className="h-24 bg-white border border-slate-200 rounded-xl" />
											<div className="h-24 bg-white border border-slate-200 rounded-xl" />
											<div className="h-24 bg-white border border-slate-200 rounded-xl" />
											<div className="h-24 bg-white border border-slate-200 rounded-xl" />
											<div className="h-24 bg-white border border-slate-200 rounded-xl" />
										</div>
									</div>
								</div>
							</div>
							<p className="text-center mt-6 text-slate-500">A frictionless, beautiful booking page for your end-users.</p>
						</div>

						<div id="content-organizer" className={tabContentClasses("organizer")}>
							<div className="bg-slate-900 rounded-2xl p-2 md:p-4 shadow-2xl max-w-5xl mx-auto border border-slate-800">
								<div className="bg-white rounded-xl overflow-hidden aspect-[16/9] flex flex-col p-6">
									<div className="flex justify-between border-b border-slate-100 pb-4 mb-4">
										<div className="h-6 bg-slate-900 rounded w-32" />
										<div className="h-8 bg-brand-600 rounded w-24" />
									</div>
									<div className="flex-1 grid grid-cols-4 gap-4">
										<div className="col-span-1 bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
											<div className="h-2 bg-slate-200 rounded w-full" />
											<div className="h-2 bg-slate-200 rounded w-2/3" />
											<div className="mt-4 h-20 bg-white rounded border border-slate-200" />
											<div className="h-20 bg-white rounded border border-slate-200" />
										</div>
										<div className="col-span-3 bg-white rounded-xl border border-slate-200 p-4">
											<div className="grid grid-cols-7 h-full gap-px bg-slate-100 border border-slate-200">
												<div className="bg-white p-2" />
												<div className="bg-white p-2" />
												<div className="bg-white p-2" />
												<div className="bg-white p-2 relative">
													<div className="absolute top-4 left-1 right-1 h-12 bg-brand-100 border-l-4 border-brand-600 rounded-r text-xs p-1 text-brand-700">
														Meeting
													</div>
												</div>
												<div className="bg-white p-2" />
												<div className="bg-white p-2" />
												<div className="bg-white p-2" />
											</div>
										</div>
									</div>
								</div>
							</div>
							<p className="text-center mt-6 text-slate-500">Powerful calendar management and availability settings for organizers.</p>
						</div>

						<div id="content-admin" className={tabContentClasses("admin")}>
							<div className="bg-slate-900 rounded-2xl p-2 md:p-4 shadow-2xl max-w-5xl mx-auto border border-slate-800">
								<div className="bg-slate-50 rounded-xl overflow-hidden aspect-[16/9] p-8">
									<h3 className="text-lg font-bold text-slate-900 mb-6">Organization Overview</h3>
									<div className="grid grid-cols-4 gap-4 mb-8">
										<div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
											<div className="text-xs text-slate-500 uppercase tracking-wide">Total Bookings</div>
											<div className="text-2xl font-bold text-slate-900 mt-1">1,240</div>
										</div>
										<div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
											<div className="text-xs text-slate-500 uppercase tracking-wide">Active Staff</div>
											<div className="text-2xl font-bold text-slate-900 mt-1">48</div>
										</div>
										<div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
											<div className="text-xs text-slate-500 uppercase tracking-wide">Revenue</div>
											<div className="text-2xl font-bold text-slate-900 mt-1">$42k</div>
										</div>
										<div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
											<div className="text-xs text-slate-500 uppercase tracking-wide">Efficiency</div>
											<div className="text-2xl font-bold text-green-600 mt-1">98%</div>
										</div>
									</div>
									<div className="bg-white p-6 rounded-xl border border-slate-200 h-1/2">
										<div className="flex items-center justify-between mb-4">
											<div className="h-4 bg-slate-200 rounded w-1/4" />
											<div className="h-8 bg-slate-100 rounded w-20" />
										</div>
										<div className="space-y-3">
											<div className="h-8 bg-slate-50 rounded w-full" />
											<div className="h-8 bg-slate-50 rounded w-full" />
											<div className="h-8 bg-slate-50 rounded w-full" />
										</div>
									</div>
								</div>
							</div>
							<p className="text-center mt-6 text-slate-500">Global controls, reporting, and user management for reporting.</p>
						</div>
					</div>
				</div>
			</section>

			<section id="features" className="py-24 bg-slate-50">
				<div className="max-w-[1440px] mx-auto px-6">
					<div className="grid lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 bg-white rounded-3xl p-10 border border-slate-100 shadow-soft overflow-hidden relative reveal">
							<div className="relative z-10">
								<div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6">
									<i data-lucide="bot" className="w-6 h-6" />
								</div>
								<h3 className="text-2xl font-bold text-slate-900 mb-3">AI & Automation</h3>
								<p className="text-slate-500 max-w-md mb-8">
									Let our AI handle the scheduling back-and-forth. Simply ask the bot to find a slot, and it syncs directly
									with Google Calendar.
								</p>
								<div className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 cursor-pointer hover:underline">
									Explore Automation <i data-lucide="arrow-right" className="w-4 h-4" />
								</div>
							</div>

							<div className="absolute right-0 bottom-0 w-2/3 h-4/5 bg-slate-50 rounded-tl-3xl border-t border-l border-slate-100 shadow-inner p-6">
								<div className="space-y-4">
									<div className="flex gap-3">
										<div className="w-8 h-8 rounded-full bg-slate-200" />
										<div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm text-sm text-slate-600">
											Book a meeting with Sarah for next Tuesday morning.
										</div>
									</div>
									<div className="flex gap-3 flex-row-reverse">
										<div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white">
											<i data-lucide="sparkles" className="w-4 h-4" />
										</div>
										<div className="bg-brand-600 text-white rounded-2xl rounded-tr-none p-3 shadow-md text-sm">
											Checking availability... checked. I have booked 10:00 AM on Tuesday, Oct 24th. Invite sent.
										</div>
									</div>
									<div className="absolute bottom-8 right-8 bg-white p-3 rounded-xl shadow-lg border border-slate-100 animate-bounce">
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
											className="w-8 h-8"
											alt="GCal"
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-soft reveal delay-100">
							<div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-brand-600 mb-6">
								<i data-lucide="bar-chart-3" className="w-6 h-6" />
							</div>
							<h3 className="text-xl font-bold text-slate-900 mb-3">Instant Reports</h3>
							<p className="text-slate-500 mb-6 text-sm">Track no-show rates, peak booking times, and team performance.</p>
							<div className="w-full h-32 bg-slate-50 rounded-lg flex items-end justify-between px-4 pb-0 overflow-hidden border border-slate-100">
								<div className="w-full flex items-end justify-between gap-2 h-full pt-8">
									<div className="w-1/5 bg-brand-200 rounded-t h-[40%]" />
									<div className="w-1/5 bg-brand-200 rounded-t h-[70%]" />
									<div className="w-1/5 bg-brand-600 rounded-t h-[55%] shadow-lg shadow-brand-500/30" />
									<div className="w-1/5 bg-brand-200 rounded-t h-[80%]" />
									<div className="w-1/5 bg-brand-200 rounded-t h-[60%]" />
								</div>
							</div>
						</div>

						<div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
							<div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft flex items-start gap-4 reveal">
								<div className="p-2 bg-slate-100 rounded-lg text-slate-700">
									<i data-lucide="globe" className="w-5 h-5" />
								</div>
								<div>
									<h4 className="font-bold text-slate-900">Time Zone Intel</h4>
									<p className="text-sm text-slate-500 mt-1">Auto-detection for seamless global scheduling.</p>
								</div>
							</div>
							<div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft flex items-start gap-4 reveal delay-100">
								<div className="p-2 bg-slate-100 rounded-lg text-slate-700">
									<i data-lucide="shield-check" className="w-5 h-5" />
								</div>
								<div>
									<h4 className="font-bold text-slate-900">Capacity Rules</h4>
									<p className="text-sm text-slate-500 mt-1">Cap meetings per day to avoid burnout.</p>
								</div>
							</div>
							<div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft flex items-start gap-4 reveal delay-200">
								<div className="p-2 bg-slate-100 rounded-lg text-slate-700">
									<i data-lucide="link" className="w-5 h-5" />
								</div>
								<div>
									<h4 className="font-bold text-slate-900">Personal Links</h4>
									<p className="text-sm text-slate-500 mt-1">Short, custom URLs for your booking profile.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-24 bg-slate-900 relative overflow-hidden">
				<div className="absolute inset-0 bg-brand-900/20" />
				<div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px]" />
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

				<div className="relative max-w-[1440px] mx-auto px-6 text-center">
					<h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">Start Scheduling Without Friction</h2>
					<p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
						Join thousands of professionals who have reclaimed their time. No credit card required for the 14-day trial.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="#"
							className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-glow transition-all"
						>
							Get Started Free
						</a>
						<a
							href="#"
							className="px-8 py-4 bg-transparent border border-slate-700 hover:border-slate-600 text-white font-medium rounded-xl transition-all"
						>
							Contact Sales
						</a>
					</div>
				</div>
			</section>

			<footer className="bg-white pt-16 pb-8 border-t border-slate-200">
				<div className="max-w-[1440px] mx-auto px-6">
					<div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
						<div className="col-span-2 lg:col-span-2">
							<div className="flex items-center gap-2 mb-6">
								<div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center text-white">
									<i data-lucide="calendar-check-2" className="w-3 h-3" />
								</div>
								<span className="font-bold text-lg text-slate-900">Appoint.</span>
							</div>
							<p className="text-slate-500 text-sm leading-relaxed max-w-sm">
								The enterprise standard for appointment scheduling. Secure, scalable, and beautifully designed for modern teams.
							</p>
						</div>
						<div>
							<h4 className="font-bold text-slate-900 mb-4">Product</h4>
							<ul className="space-y-2 text-sm text-slate-500">
								<li>
									<a href="#" className="hover:text-brand-600">
										Features
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-brand-600">
										Integration
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-brand-600">
										Pricing
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-brand-600">
										Changelog
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-bold text-slate-900 mb-4">Resources</h4>
							<ul className="space-y-2 text-sm text-slate-500">
								<li>
									<a href="#" className="hover:text-brand-600">
										Documentation
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-brand-600">
										API Reference
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-brand-600">
										Community
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-brand-600">
										Help Center
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-bold text-slate-900 mb-4">Company</h4>
							<ul className="space-y-2 text-sm text-slate-500">
								<li>
									<a href="#" className="hover:text-brand-600">
										About
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-brand-600">
										Careers
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-brand-600">
										Legal
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-brand-600">
										Contact
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
						<p>© 2023 Appointment App Inc. All rights reserved.</p>
						<div className="flex gap-6 mt-4 md:mt-0">
							<a href="#" className="hover:text-slate-600">
								<i data-lucide="twitter" className="w-4 h-4" />
							</a>
							<a href="#" className="hover:text-slate-600">
								<i data-lucide="github" className="w-4 h-4" />
							</a>
							<a href="#" className="hover:text-slate-600">
								<i data-lucide="linkedin" className="w-4 h-4" />
							</a>
						</div>
					</div>
				</div>
			</footer>

		</main>
	);
}