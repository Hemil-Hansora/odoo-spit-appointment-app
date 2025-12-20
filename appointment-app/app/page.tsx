import Link from "next/link";
import { appointmentTypes } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<div className="mx-auto max-w-5xl p-6">
			<h1 className="text-2xl font-semibold">Available Appointments</h1>
			<p className="text-muted-foreground">Discover services and book in real time</p>
			<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{appointmentTypes.map((a) => (
					<Card key={a.id}>
						<CardHeader>
							<CardTitle>{a.name}</CardTitle>
							<CardDescription>{a.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">Duration: {a.durationMinutes} min</p>
							{a.manageCapacity && (
								<p className="text-sm text-muted-foreground">Max per slot: {a.maxPerSlot}</p>
							)}
							{a.advancePayment && (
								<p className="text-sm text-muted-foreground">Advance payment required</p>
							)}
						</CardContent>
						<CardFooter>
							<Link href={`/book/${a.id}`}>
								<Button>Book Appointment</Button>
							</Link>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}