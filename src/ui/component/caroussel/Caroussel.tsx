import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.css';

import { Navigation, Pagination } from "swiper/modules";

import Button from "../../design_system/button/button";
import Typography from "../../design_system/typography/typography";
import Electricite from "/images/electricite.jpg";
import Plomberie from "/images/plomberie.jpg";
import Peinture from "/images/peinture.jpg";
import Maconnerie from "/images/maçonerie.jpg";


export default function Carousel() {
    const metiers = [
        {
            titre: "Electricité",
            description:
                "Travaux d’installation, de maintenance et de réparation des équipements électriques dans les habitations, bureaux et industries.",
            image: Electricite,
        },
        
        {
            titre: "Plomberie",
            description:
                "Installation, réparation et entretien des systèmes de plomberie dans les maisons et entreprises.",
            image: Plomberie,
        },
        {
            titre: "Peinture",
            description:
                "Travaux de peinture intérieure et extérieure pour tous types de bâtiments.",
            image: Peinture,
        },
         {
            titre: "Maçonnerie",
            description:
                "Travaux de peinture intérieure et extérieure pour tous types de bâtiments.",
            image: Maconnerie,
        },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                loop={true}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    0: {
                        slidesPerView: 1, // mobile
                    },
                    768: {
                        slidesPerView: 2, // tablette
                    },
                    1024: {
                        slidesPerView: 4, // desktop
                    },
                }}
            >
                {metiers.map((metier, index) => (
                    <SwiperSlide key={index}>
                        <div className="flex flex-col w-full h-100 border border-gray-200 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow">
                            <img
                                src={metier.image}
                                alt={metier.titre}
                                className="w-full h-48 object-cover rounded-t-2xl"
                            />
                            <div className="p-4  gap-2">
                                <Typography variant="h5" weight="medium" className="text-lg md:text-xl">
                                    {metier.titre}
                                </Typography>
                                <Typography variant="body-sm" weight="regular" className="text-gray-600">
                                    {metier.description}
                                </Typography>
                                <Button size="small">Voir plus</Button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
