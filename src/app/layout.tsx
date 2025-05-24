import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/main.scss";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ContentProvider } from "@/contexts/ContentContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Church of God of Prophecy",
  description: "A global, Christ-centered movement rooted in Scripture, steadfast in faith, passionate about people.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContentProvider>
          <Navigation />
          <main className="mt-5 pt-4">
        {children}
          </main>
          <Footer />
        </ContentProvider>
        
        {/* Bootstrap JavaScript */}
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          async
        ></script>
      </body>
    </html>
  );
}
