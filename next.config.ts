import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	reactCompiler: true,
	output: "standalone",
	experimental: {
		serverActions: {
		bodySizeLimit: '10mb',
		},
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
