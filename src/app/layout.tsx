import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutIndex from "./components/layout/Index";
import RecoilRootProvider from "./utils/RecoilRootProvider";
import CommonTransaction from "./api/common/Index";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import AuthProvider from '@/lib/next-auth';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lola's Blog",
  description: "Lola's Blog",
  icons: {
    icon: "/lolathequeen.ico",
  },  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <RecoilRootProvider>
            <AuthProvider>
              {/* <PrimeReactProvider> */}
              {/* <PrimeReactProvider value={{ unstyled: true }}> */}
                <CommonTransaction> 
                  <LayoutIndex>        
                    {children}
                  </LayoutIndex>
                </CommonTransaction> 
              {/* </PrimeReactProvider> */}
            </AuthProvider>
          </RecoilRootProvider>
        </body>
    </html>
  );
}
