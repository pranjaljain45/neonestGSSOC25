"use client"

import React, { useState, useEffect } from "react";
import { Info, AlertTriangle, Baby, Utensils, Apple, Cookie } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/Carousel";
import { useTranslation } from "react-i18next";

const categoryIconMap = {
  "General Feeding Tips": Info,
  "Feeding Cautions & Notes": AlertTriangle,
};

const ageIconMap = {
  "0–3 Months": Baby,
  "4–6 Months": Utensils,
  "7–9 Months": Apple,
  "10–12 Months": Cookie,
};

const Feedingtips = () => {
  const { t } = useTranslation("common");

  const feedingCategories = t("feedingtips.categories", { returnObjects: true });
  const ageBasedTips = t("feedingtips.ageBasedTips", { returnObjects: true });

  const [selectedCategory, setSelectedCategory] = useState("General Feeding Tips");
  const [selectedAge, setSelectedAge] = useState("0–3 Months");
  const [categoryApi, setCategoryApi] = useState(null);
  const [ageApi, setAgeApi] = useState(null);


  // Reset carousels when selections change
  useEffect(() => {
    if (categoryApi) {
      categoryApi.scrollTo(0);
    }
  }, [selectedCategory, categoryApi]);

  useEffect(() => {
    if (ageApi) {
      ageApi.scrollTo(0);
    }
  }, [selectedAge, ageApi]);

  return (
    <section id="feeding-tips" className="px-4 py-6 bg-white/50 rounded-lg space-y-12">

      
      {/* General Tips Section */}
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{t("feedingtips.title")}</h2>
          <p className="text-lg text-gray-600">{t("feedingtips.subtitle")}</p>
        </div>

        {/* Category selection buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {feedingCategories.map((category) => {
            const Icon = categoryIconMap[category.title]; // Get icon by title
            return (
              <label
                key={category.title}
                className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition-all ${selectedCategory === category.title
                  ? "bg-gradient-to-r from-pink-600 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 shadow-md"
                  }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.title}
                  checked={selectedCategory === category.title}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="hidden"
                />
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium">{category.title}</span>
              </label>
            );
          })}

        </div>

        {/* Carousel for category tips */}
        <div className="w-full px-4 sm:px-8 md:px-12 max-w-[95vw] sm:max-w-2xl mx-auto">
          <Carousel className="w-full" setApi={setCategoryApi}>             
            <CarouselContent>
            {feedingCategories
              .find((category) => category.title === selectedCategory)
              ?.tips.map((tip, index) => (
                <CarouselItem key={index}>
                  <div className="p-0.5">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 to-blue-200/40" />
                      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-transparent rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-300/30 to-transparent rounded-full translate-x-16 translate-y-16 blur-2xl" />

                      <CardContent className="relative flex items-center justify-center min-h-[150px] p-4 sm:p-6">
                        <div className="relative w-full">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 blur" />

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

            <div className="flex justify-center gap-8 mt-4">
              <CarouselPrevious className="static translate-y-0 bg-white hover:bg-gray-50" />
              <CarouselNext className="static translate-y-0 bg-white hover:bg-gray-50" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Age-Based Tips Section */}
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">{t("feedingtips.ageTipsTitle")}</h2>
          <p className="text-lg text-gray-600">{t("feedingtips.ageTipsSubtitle")}</p>
        </div>


        {/* Age selection buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {ageBasedTips.map((age) => {
            const Icon = ageIconMap[age.title];
            return (
              <label
                key={age.title}
                className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition-all ${selectedAge === age.title
                  ? "bg-gradient-to-r from-pink-600 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 shadow-md"
                  }`}
              >
                <input
                  type="radio"
                  name="age"
                  value={age.title}
                  checked={selectedAge === age.title}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="hidden"
                />
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium">{age.title}</span>
              </label>
            );
          })}

        </div>

        {/* Carousel for age-based tips */}
        <div className="w-full px-4 sm:px-8 md:px-12 max-w-[95vw] sm:max-w-2xl mx-auto">
          <Carousel className="w-full" setApi={setAgeApi}>
            <CarouselContent>
              {ageBasedTips
                .find((age) => age.title === selectedAge)
                ?.tips.map((tip, index) => (
                  <CarouselItem key={index}>
                    <div className="p-0.5">
                      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 to-blue-200/40" />
                        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-transparent rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-300/30 to-transparent rounded-full translate-x-16 translate-y-16 blur-2xl" />

                        <CardContent className="relative flex items-center justify-center min-h-[150px] p-4 sm:p-6">
                          <div className="relative w-full">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 blur" />

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

            <div className="flex justify-center gap-8 mt-4">
              <CarouselPrevious className="static translate-y-0 bg-white hover:bg-gray-50" />
              <CarouselNext className="static translate-y-0 bg-white hover:bg-gray-50" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Statement */}
      <div className="text-center text-gray-500 text-sm mt-2">
        {t("feedingtips.moreInfo")}{" "}
        <a href="/Resources" className="text-pink-600 hover:underline">
          {t("feedingtips.resources")}
        </a>{" "}
        or{" "}
        <a href="/Faqs" className="text-pink-600 hover:underline">
          {t("feedingtips.faqs")}
        </a>
        .
      </div>
    </section>
  );
};

export default Feedingtips;

