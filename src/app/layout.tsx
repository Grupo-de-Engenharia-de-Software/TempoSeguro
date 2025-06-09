import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ['latin','latin-ext']
});

export const metadata: Metadata = {
	title: "Tempo Seguro",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.className}`}>
				{children}
			</body>
		</html>
	);
}
