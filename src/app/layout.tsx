import { IBM_Plex_Serif, Inter } from "next/font/google";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ConditionalLayout } from "@/components/organisms/ConditionalLayout";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-ibm-plex-serif",
	display: "swap",
});

const isAuthDisabled = process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const content = (
		<html lang="en" className="light">
			<body
				className={`${inter.variable} ${ibmPlexSerif.variable} antialiased`}
			>
				<NextIntlClientProvider>
					<ConditionalLayout>{children}</ConditionalLayout>
				</NextIntlClientProvider>
			</body>
		</html>
	);

	if (isAuthDisabled) {
		return content;
	}

	return <ClerkProvider>{content}</ClerkProvider>;
}
