import React from "react";

const projects = [
    {
        name: "Visiting Card",
        route: "/catalog/graphics/visiting-card-&-tag",
    },
    {
        name: "Wedding Card",
        route: "/catalog/graphics/wedding-cards",
    },
    {
        name: "Wedding Box",
        route: "/catalog/graphics/wedding-box",
    },
    {
        name: "Bill Book",
        route: "/catalog/graphics/bill-book-&-letterhead",
    },
    {
        name: "Board Banner",
        route: "/catalog/graphics/board-banner",
    },
];

const Resources = () => {
    return (
        <div className="py-10 text-gray-800 px-[8%] mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <a href={project.route}
                        key={index}
                        className="rounded-3xl overflow-hidden text-center hover:shadow-xl transition duration-300 cursor-pointer"
                    >
                        <img
                            src={`/assets/images/Resourse Photo/r${index + 1}.png`}
                            alt={project.name}
                            className="w-full h-auto max-h-48 object-cover md:max-h-[300px] sm:max-h-[200px]"
                        />
                    </a>
                ))}

                <div className="mt-12 pl-5">
                    <div className="text-sm text-orange-500 uppercase font-semibold mb-1">Products</div>
                    <div className="text-3xl font-bold mb-4 tracking-wide">Selected Works from Us</div>
                    <a href="/catalog" className="border border-Orange text-sm font-semibold text-black px-5 py-2 rounded-full hover:bg-Orange/20 transition">
                        See more
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Resources;
