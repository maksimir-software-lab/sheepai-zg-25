"use client";

import { useTranslations } from "next-intl";

export const MobileHeader: React.FC = () => {
	const t = useTranslations();

	return (
		<header className="md:hidden w-full h-14 bg-sidebar sticky top-0 z-10 border-b border-border overscroll-none">
			<div className="flex items-center justify-center px-4 h-full">
				<span className="text-lg font-semibold">{t("title")}</span>
			</div>
		</header>
	);
};
