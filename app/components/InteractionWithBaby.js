"use client"

import React, { useState, useEffect } from "react";
import { Baby, Heart, Star, Music } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/Carousel";
import { useTranslation } from "react-i18next";

const stageIcons = {
  "0–3 Months": Baby,
  "4–6 Months": Heart,
  "7–9 Months": Music,
  "10–12 Months": Star,
};



const InteractionWithBaby = () => {
  const { t } = useTranslation("common");
  const [selectedAge, setSelectedAge] = useState("0–3 Months");
  const [api, setApi] = useState(null);

  const interactionStages = [
    {
      title: "0–3 Months",
      color: "pink",
      icon: Baby,
      tips: t("interaction.stages.0_3.tips", { returnObjects: true }),
    },
    {
      title: "4–6 Months",
      color: "purple",
      icon: Heart,
      tips: t("interaction.stages.4_6.tips", { returnObjects: true }),
    },
    {
      title: "7–9 Months",
      color: "blue",
      icon: Music,
      tips: t("interaction.stages.7_9.tips", { returnObjects: true }),
    },
    {
      title: "10–12 Months",
      color: "green",
      icon: Star,
      tips: t("interaction.stages.10_12.tips", { returnObjects: true }),
    },
  ];

  // Reset carousel to first slide when age changes
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [selectedAge, api]);

  return (
    <section id="interaction-tips" className="px-4 py-6 bg-white/50 rounded-lg">
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{t("interaction.heading")}</h2>
          <p className="text-lg text-gray-600"> {t("interaction.subheading")}</p>
        </div>

        {/* Age selection radio buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {interactionStages.map((stage) => (
            <label
              key={stage.title}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition-all ${selectedAge === stage.title
                ? "bg-gradient-to-r from-pink-600 to-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 shadow-md"
                }`}
            >
              <input
                type="radio"
                name="age"
                value={stage.title}
                checked={selectedAge === stage.title}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="hidden"
              />
              <stage.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{stage.title}</span>
            </label>
          ))}
        </div>

        {/* Carousel for tips */}
        <div className="w-full px-4 sm:px-8 md:px-12 max-w-[95vw] sm:max-w-2xl mx-auto">
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
              {interactionStages
                .find((stage) => stage.title === selectedAge)
                ?.tips.map((tip, index) => (
                  <CarouselItem key={index}>
                    <div className="p-0.5">
                      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 to-blue-200/40" />
                        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-transparent rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-300/30 to-transparent rounded-full translate-x-16 translate-y-16 blur-2xl" />

                        <CardContent className="relative flex items-center justify-center min-h-[150px] p-4 sm:p-6">
                          <div className="relative w-full">
                            {/* Border gradient */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 blur" />

                            {/* Tip content with enhanced styling */}
                            <div className="relative bg-white/80 rounded-lg p-3 sm:p-4 backdrop-blur-sm border border-pink-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                              <p className="text-base sm:text-lg text-center leading-relaxed font-medium bg-gradient-to-l from-pink-600 to-blue-600 bg-clip-text text-transparent">
                                {tip}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>

            {/* Navigation buttons - simple, always at the bottom */}
            <div className="flex justify-center gap-8 mt-4">
              <CarouselPrevious className="static translate-y-0 bg-white hover:bg-gray-50" />
              <CarouselNext className="static translate-y-0 bg-white hover:bg-gray-50" />
            </div>
          </Carousel>
        </div>

        {/* Statement */}

      </div>
    </section>
  );
};

export default InteractionWithBaby;