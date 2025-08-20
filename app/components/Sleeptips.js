"use client";

import React, { useState, useEffect } from "react";
import { Baby, Bed, Smile } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/Carousel";
import { useTranslation } from "react-i18next";

const Sleeptips = () => {
  const { t } = useTranslation("common");

  const sleepStages = [
    {
      key: "0_3",
      icon: Baby,
      color: "pink",
    },
    {
      key: "4_6",
      icon: Bed,
      color: "purple",
    },
    {
      key: "7_12",
      icon: Smile,
      color: "blue",
    },
  ];

  const [selectedAge, setSelectedAge] = useState("0_3");
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [selectedAge, api]);

  const selectedStage = sleepStages.find((stage) => stage.key === selectedAge);
  const tips = t(`sleeptips.sleepStages.${selectedAge}.tips`, { returnObjects: true });
  const title = t(`sleeptips.sleepStages.${selectedAge}.title`);

  return (
    <section id="sleep-tips" className="px-4 py-6 bg-white/50 rounded-lg">
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{t("sleeptips.heading")}</h2>
          <p className="text-lg text-gray-600">{t("sleeptips.subheading")}</p>
        </div>

        {/* Age selection radio buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {sleepStages.map((stage) => (
            <label
              key={stage.key}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition-all ${selectedAge === stage.key
                ? "bg-gradient-to-r from-pink-600 to-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 shadow-md"
                }`}
            >
              <input
                type="radio"
                name="age"
                value={stage.key}
                checked={selectedAge === stage.key}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="hidden"
              />
              <stage.icon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t(`sleeptips.sleepStages.${stage.key}.title`)}
              </span>
            </label>
          ))}
        </div>

        {/* Carousel for tips */}
        <div className="w-full px-4 sm:px-8 md:px-12 max-w-[95vw] sm:max-w-2xl mx-auto">
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
              {tips.map((tip, index) => (
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

                          {/* Tip content */}
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

            {/* Navigation buttons */}
            <div className="flex justify-center gap-8 mt-4">
              <CarouselPrevious className="static translate-y-0 bg-white hover:bg-gray-50" />
              <CarouselNext className="static translate-y-0 bg-white hover:bg-gray-50" />
            </div>
          </Carousel>
        </div>

        {/* Statement */}
        <div className="text-center text-gray-500 text-sm mt-6">
          {t("sleeptips.footer.pre")}{" "}
          <a href="/Resources" className="text-pink-600 hover:underline">
            {t("sleeptips.footer.resources")}
          </a>{" "}
          or{" "}
          <a href="/Faqs" className="text-pink-600 hover:underline">
            {t("sleeptips.footer.faqs")}
          </a>
          .
        </div>
      </div>
    </section>
  );
};

export default Sleeptips;
