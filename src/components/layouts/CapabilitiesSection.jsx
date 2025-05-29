import { FaChartLine, FaHandHoldingUsd, FaHeart, FaPalette, FaPiggyBank, FaUserTie } from "react-icons/fa";

const services = [
  {
    title: "Wedding Card",
    description: "A beautifully designed invitation to celebrate your special day with elegance and love.",
    icon: <img src="/assets/images/invitation.png" alt="invitation" />
  },
  {
    title: "Vevai card",
    description: "A special wedding card crafted to honor and invite the beloved વેવાઈ with love and respect.",
    icon: <img src="/assets/images/love.png" alt="love" />
  },
  {
    title: "Acrylic Board Banner",
    description:
      "A sleek, durable, and vibrant display solution perfect for weddings, events, and personalized décor.",
    icon: <img src="/assets/images/color-palette.png" alt="color-palette" />
  },
];

export default function CapabilitiesSection() {
  return (
    <section className="pt-20 pb-16 px-10 md:px-24 bg-white ">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-12 relative">

        <div className="max-w-64 relative hidden md:block">
          <p className="text-sm text-orange-500 font-semibold uppercase mb-2">Services</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Capabilities</h2>
          <p className="text-gray-500 mb-8">
            We will bring the breathe of our experience and industry knowledge to help you succeed
          </p>
          
          <img
            src="/assets/images/arrow.svg"
            className="absolute -bottom-6 left-[80%] top-full -translate-x-1/2 w-16 sm:w-20"
            alt="arrow"
          />
        </div>

        <div className="pl-0 md:pl-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          <div className="block md:hidden mb-4">
            <p className="text-sm text-orange-500 font-semibold uppercase mb-2">Services</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Capabilities</h2>
            <p className="text-gray-500 mb-8">
              We will bring the breathe of our experience and industry knowledge to help you succeed
            </p>
          </div>

          {/* Service Cards */}
          {services.map((service, idx) => (
            <div
              key={idx}
              className="px-5 py-10 shadow-sm rounded-xl transition hover:shadow-lg cursor-pointer"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-md mb-4">
                {service.icon}
              </div>
              <h4 className="text-base font-bold text-gray-900">{service.title}</h4>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{service.description}</p>
            </div>
          ))}

          {/* Arrow for Mobile view (always last) */}
          <div className="block md:hidden mt-4">
            <img
              src="/assets/images/arrow.svg"
              className="mx-auto w-16 sm:w-20"
              alt="arrow"
            />
          </div>
        </div>
      </div>
    </section>

  );
}

