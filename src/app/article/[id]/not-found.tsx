import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
			<div className="text-center space-y-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-12 shadow-2xl">
				<div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center backdrop-blur-sm border border-border/50">
					<svg
						className="w-12 h-12 text-muted-foreground/60"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-label="Not found"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>

				<h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
					Article Not Found
				</h1>

				<p className="text-lg text-muted-foreground max-w-md mx-auto">
					The article you're looking for doesn't exist or has been removed.
				</p>

				<Link href="/dashboard">
					<Button
						size="lg"
						className="mt-4 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
					>
						<svg
							className="w-5 h-5 mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-label="Back arrow"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M11 17l-5-5m0 0l5-5m-5 5h12"
							/>
						</svg>
						Back to Dashboard
					</Button>
				</Link>
			</div>
		</div>
	);
}
