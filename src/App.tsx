import GalleryBackground from './sections/GalleryBackground';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Practice from './sections/Practice';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  return (
    <>
      <GalleryBackground />
      <div className="relative" style={{ zIndex: 2 }}>
        <Navigation />
        <Hero />
        <About />
        <Practice />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
