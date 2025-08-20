"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import Chatbot from "./Chatbot";
import { useAuth } from "../context/AuthContext";
import { useChatStore } from "@/lib/store/chatStore";
import { Menu, X } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useAutoTask } from "../context/AutoTaskContext";
import AutoTask from "./AutoTask";

import { useTranslation } from "react-i18next";

import i18n from "../../utils/i18n"

const tabs = [
  { label: "home", path: "/" },
  { label: "growth", path: "/Growth" },
  { label: "feeding", path: "/Feeding" },
  { label: "sleep", path: "/Sleep" },
  { label: "medical", path: "/Medical" },
  { label: "essentials", path: "/Essentials" },
  { label: "memories", path: "/Memories" },
  { label: "resources", path: "/Resources" },
  { label: "faqs", path: "/Faqs" },
  { label: "lullaby", path: "/Lullaby" },
  // { label: "language", path: "#" },
];


const tabs1 = [
  { label: "home", path: "/" },
  { label: "growth", path: "/Growth" },
  { label: "feeding", path: "/Feeding" },
  { label: "sleep", path: "/Sleep" },
  { label: "medical", path: "/Medical" },
  { label: "essentials", path: "/Essentials" },
  { label: "memories", path: "/Memories" },
  { label: "resources", path: "/Resources" },
  { label: "faqs", path: "/Faqs" },
  { label: "lullaby", path: "/Lullaby" },
  { label: "language", path: "#" },
];

const languages = [
  { code: "en", label: "English - EN" },
  { code: "hi", label: "हिन्दी - HI" },
  { code: "ta", label: "தமிழ் - TA" },
  { code: "te", label: "తెలుగు - TE" },
  { code: "kn", label: "ಕನ್ನಡ - KN" },
  { code: "ml", label: "മലയാളം - ML" },
  { code: "bn", label: "বাংলা - BN" },
  { code: "gu", label: "ગુજરાતી - GU" },
  { code: "mr", label: "मराठी - MR" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuth, logout } = useAuth();
  const { setAutoTask, isAutoTask } = useAutoTask()

  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(100);
  const [menuOpen, setMenuOpen] = useState(false);

  const [mounted, setMounted] = React.useState(false);

  const [showLangPage, setShowLangPage] = useState(false);


  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { i18n, t } = useTranslation('common');
  const [lang, setLang] = useState(i18n.language);


  const [currentLangCode, setCurrentLangCode] = useState(i18n.language || "en");
  const currentLangLabel = languages.find((l) => l.code === currentLangCode)?.label || "English - EN";


  useEffect(() => {
    const onLanguageChanged = (lng) => {
      setLang(lng);
    };
    i18n.on("languageChanged", onLanguageChanged);
    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, [i18n]);

  // Update language and state when a new language is selected
  const changeLanguage = async (code) => {
    try {
      await i18n.changeLanguage(code);
      setCurrentLangCode(code);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };



  const handleLogout = () => {
    useChatStore.getState().clearChatHistory();
    logout();
    setShowModal(true);
    setProgress(100);

  };

  useEffect(() => {
    if (!showModal) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 3.33;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showModal]);

  useEffect(() => {
    if (progress <= 0 && showModal) {
      setShowModal(false);
      router.push("/");
    }
  }, [progress, showModal]);

  return (
    <>
      {/* Logout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] flex items-center justify-center transition-all duration-300">
          <div className="bg-white px-6 py-5 rounded-xl shadow-lg text-center w-[320px]">
            <p className="text-gray-800 mb-3">
              Logged out successfully.{" "}
              <Link href="/Login" onClick={() => setShowModal(false)} className="text-pink-600 font-normal no-underline">
                {t("navbar.login")}
              </Link>{" "}
              again!
            </p>
            <div className="w-full h-1 bg-pink-100 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 transition-all duration-100" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between xl:pr-4">
            {/* Logo */}
            {/* changed div tag to link tag so user can redirect to home page whenever they click on navbar logo */}
            <Link href="/" className="flex items-center">
              <Image src="/logo.jpg" alt="NeoNest" width={60} height={60} />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent ml-2">NeoNest</span>
            </Link>

            {/* Hamburger - Mobile */}
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-pink-600 focus:outline-none">
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Nav - Desktop */}


            <nav className="hidden xl:flex items-center gap-4">
              {tabs.map(({ label, path }) => {
                const isActive = mounted ? pathname === path : false;
                return (
                  <Link
                    key={label}
                    href={path}
                    className={`transition-colors capitalize ${isActive ? "text-pink-600" : "text-gray-600 hover:text-pink-600"
                      }`}
                  >
                    {mounted ? t(`navbar.${label}`) : label} {/* safe translation */}
                  </Link>
                );
              })}

              {/* Language selector */}
              <div className="relative group inline-block text-left">
                <div className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-pink-600 cursor-pointer">
                  {mounted ? currentLangLabel : currentLangCode} {/* safe */}
                  <svg
                    className="w-4 h-4 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <ul className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-300 rounded-md shadow-lg z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                  {languages.map(({ code, label }) => (
                    <li key={code}>
                      <button
                        onClick={() => changeLanguage(code)}
                        className={`block w-full text-left px-4 py-2 hover:bg-pink-50 ${code === currentLangCode
                          ? "font-semibold text-pink-600"
                          : "text-gray-700"
                          }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>

              </div>
            </nav>


            {/* CTA - Desktop */}

            <div className="hidden md:flex items-center space-x-2">
              {isAuth && <NotificationBell />}
              <Chatbot />
              <AutoTask setAutoTask={setAutoTask} isAutoTask={isAutoTask} />

              {!isAuth ? (
                <>
                  <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                    <Link href="/Login">{mounted ? t("navbar.login") : "Login"}</Link>
                  </Button>

                  <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                    <Link href="/Signup">{mounted ? t("navbar.signup") : "Signup"}</Link>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  {mounted ? t("navbar.logout") : "Logout"}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 space-y-3">
              <div className="flex flex-col gap-3">
                {tabs1.map(({ label, path }) => {
                  if (label === "language") {
                    return (

                      <button
                        key={label}
                        onClick={() => {
                          setShowLangPage(true);
                        }}
                        className="block capitalize px-3 py-2 text-left rounded-md text-sm text-gray-700 hover:text-pink-600"
                      >
                        {currentLangLabel}
                      </button>


                    );
                  }

                  return (
                    <Link
                      key={label}
                      href={path}
                      onClick={() => setMenuOpen(false)}
                      className={`block capitalize px-3 py-2 rounded-md text-sm ${pathname === path ? "text-pink-600 font-medium" : "text-gray-700 hover:text-pink-600"
                        }`}
                    >
                      {t(`navbar.${label}`)}
                    </Link>
                  );
                })}


              </div>

              {showLangPage && (
                <div className="fixed inset-0 z-[999] bg-white flex flex-col items-start p-6 overflow-y-auto">
                  <button
                    onClick={() => setShowLangPage(false)}
                    className="mb-4 text-pink-600 text-sm underline"
                  >
                    ← Back
                  </button>
                  <h2 className="text-lg font-semibold mb-4">Choose Language</h2>
                  <ul className="w-full">
                    {languages.map(({ code, label }) => (
                      <li key={code}>
                        <button
                          onClick={() => {
                            changeLanguage(code);
                            setShowLangPage(false);
                            router.push("/"); // redirect to home
                          }}
                          className="w-full text-left px-4 py-2 text-gray-800 hover:text-pink-600"
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}


              <div className="mt-3 flex flex-col gap-2">
                {!isAuth ? (
                  <>
                    <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                      <Link href="/Login" onClick={() => setMenuOpen(false)}>
                        {t("navbar.login")}
                      </Link>
                    </Button>
                    <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                      <Link href="/Signup" onClick={() => setMenuOpen(false)}>
                        {t("navbar.signup")}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleLogout} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                    {t("navbar.logout")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className=" md:hidden absolute right-0 flex justify-end top-[50vh] items-end">
          <div className="m-4 bg-[#8882] transition-all duration-200 rounded-full shadow-xl">
            {!(pathname === "/NeonestAi") &&
              <div className="m-1 mb-3  border-white rounded-full border-2">
                <Chatbot />
              </div>
            }
            <div className="m-1 border-white rounded-full border-2">
              <AutoTask setAutoTask={setAutoTask} isAutoTask={isAutoTask} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;