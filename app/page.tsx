import Navbar from '@/components/shared/navbar';
import Hero from '@/components/sections/hero';
import About from '@/components/sections/about';
import Filmography from '@/components/sections/filmography';
import Education from '@/components/sections/education';
import Contact from '@/components/sections/contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Filmography />
        <Education />
        <Contact />
      </main>
    </>
  );
}
