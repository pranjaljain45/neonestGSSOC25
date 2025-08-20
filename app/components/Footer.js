"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Heart, Github, ExternalLink, BookOpen, MessageCircle } from "lucide-react";

export default function NeoNestFooter() {
  const { t } = useTranslation("common");

  const features = [
    { name: t("footer.featuresList.growth"), href: "/Growth" },
    { name: t("footer.featuresList.feeding"), href: "/Feeding" },
    { name: t("footer.featuresList.sleep"), href: "/Sleep" },
    { name: t("footer.featuresList.medical"), href: "/Medical" },
    { name: t("footer.featuresList.essentials"), href: "/Essentials" }
  ];

  const support = [
    { name: t("footer.supportList.about"), href: "/" },
    { name: t("footer.supportList.faq"), href: "/Faqs" },
    { name: t("footer.supportList.resources"), href: "/Resources" },
    { name: t("footer.supportList.ai"), href: "/NeonestAi" },
    { name: t("footer.supportList.memories"), href: "/Memories" }
  ];

  const projectLinks = [
    {
      name: t("footer.projectList.repo"),
      icon: Github,
      href: "https://github.com/AditiGupta-tech/neonest"
    },
    {
      name: t("footer.projectList.live"),
      icon: ExternalLink,
      href: "https://neonest-babycare.vercel.app/"
    },
    {
      name: t("footer.projectList.guide"),
      icon: BookOpen,
      href: "https://github.com/AditiGupta-tech/neonest/blob/main/Contributing.md"
    },
    {
      name: t("footer.projectList.discussions"),
      icon: MessageCircle,
      href: "https://github.com/AditiGupta-tech/neonest/discussions"
    }
  ];

  return (
    <div className="w-full md:mx-10 lg:mx-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] text-white flex flex-col justify-end">
      <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        <div className="max-w-6xl mx-auto px-2 py-12 relative">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo + Description */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-x-2">
                <Image
                  src="/logoFooter.png"
                  alt="NeoNest Logo"
                  width={40}
                  height={40}
                  className="object-contain -mt-1.5"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  NeoNest
                </span>
              </div>
              <p className="text-gray-300 text-base leading-relaxed max-w-md">
                {t("footer.tagline")}
              </p>
              <div className="flex items-center space-x-2 text-pink-400 font-medium text-sm">
                <span>{t("footer.happyBaby")}</span>
                <Heart className="w-4 h-4 fill-current animate-pulse" />
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <div className="w-2 h-5 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full mr-2"></div>
                {t("footer.features")}
              </h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="group">
                    <Link
                      href={feature.href}
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-200 flex items-center"
                    >
                      <span className="w-2 h-2 bg-pink-400/60 rounded-full mr-2 group-hover:bg-pink-400 transition-colors"></span>
                      {feature.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <div className="w-2 h-5 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-2"></div>
                {t("footer.support")}
              </h3>
              <ul className="space-y-2">
                {support.map((item, index) => (
                  <li key={index} className="group">
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                    >
                      <span className="w-2 h-2 bg-blue-400/60 rounded-full mr-2 group-hover:bg-blue-400 transition-colors"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Project Links */}
          <div className="border-t border-white/10 pt-6 mb-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center">
              <div className="w-2 h-4 bg-gradient-to-b from-green-400 to-blue-400 rounded-full mr-2"></div>
              {t("footer.projectLinks")}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {projectLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <link.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-4 text-center space-y-2">
            <div className="text-sm text-gray-300 flex items-center justify-center gap-1 flex-wrap">
              <span>{t("footer.copyright")}</span>
              <span className="font-semibold text-pink-300">Aditi Gupta</span>
              <span>• Released under the</span>
              <a
                href="https://github.com/AditiGupta-tech/neonest/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 font-semibold"
              >
                {t("footer.license")}
              </a>
            </div>
            <div className="text-sm text-gray-300 flex items-center justify-center gap-2">
              <span>{t("footer.madeWith")}</span>
              <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
              <span>{t("footer.forParents")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
