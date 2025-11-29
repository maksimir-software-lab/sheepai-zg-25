import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ConditionalLayout } from "@/components/organisms/ConditionalLayout";

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
		<html lang="en" className="dark">
			<body
				className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
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
