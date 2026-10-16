import { About } from "@/components/About";
import { BookingModal } from "@/components/BookingModal";
import { ContactCta } from "@/components/ContactCta";
import { Experiences } from "@/components/Experiences";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MobileMenu } from "@/components/MobileMenu";
import { Packages } from "@/components/Packages";
import { SearchPanel } from "@/components/SearchPanel";
import { Testimonial } from "@/components/Testimonial";
import { KarvonProvider } from "@/lib/store";

/**
 * Today's date is resolved here rather than in the client store so the first
 * client render matches the server markup exactly. The short revalidate window
 * is what keeps the date picker's "today" from going stale on a statically
 * rendered page.
 */
export const revalidate = 600;

function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export default function Home() {
  return (
    <KarvonProvider today={todayISO()} startCity="rim">
      <Header />
      <MobileMenu />
      <main>
        <Hero />
        <SearchPanel />
        <Packages />
        <Experiences />
        <About />
        <Testimonial />
        <ContactCta />
      </main>
      <Footer />
      <BookingModal />
    </KarvonProvider>
  );
}
