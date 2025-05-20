import Header from "../common/Header";
import LogoMarquee from "../common/LogoMarquee";
import HeroSection from "../layouts/HeroSection";
import CapabilitiesSection from "../layouts/CapabilitiesSection";
import WhyChooseUs from "../layouts/WhyChooseUs";
import Resources from "../layouts/Resources";
import Testimonial from "../layouts/Testimonial";
import ContactUs from "../layouts/ContactUs";


function Home() {

    return (
        <>
            {/* <Header /> */}
            <HeroSection />
            <LogoMarquee />
            <CapabilitiesSection />
            <WhyChooseUs />
            <Resources />
            <Testimonial />
            <ContactUs />
            {/* <Footer /> */}
        </>
    );
}

export default Home;