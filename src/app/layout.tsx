import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/main.scss";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ContentProvider } from "@/contexts/ContentContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ChurchUserProvider } from "@/contexts/ChurchUserContext";
import { I18nProvider } from "@/contexts/I18nContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <ContentProvider>
            <AuthProvider>
              <AdminProvider>
                <ChurchUserProvider>
                  <Navigation />
                  <main className="-mt-5 -pt-4">
                    {children}
                  </main>
                  <Footer />
                </ChurchUserProvider>
              </AdminProvider>
            </AuthProvider>
          </ContentProvider>
        </I18nProvider>
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
