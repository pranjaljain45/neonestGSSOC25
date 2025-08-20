"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/Button"
import Input from "../components/ui/Input"
import {
  ChevronDown,
  ChevronUp,
  Search,
  Baby,
  Utensils,
  Moon,
  Shield,
} from "lucide-react"

export default function Page() {
  const { t } = useTranslation("common")

  useEffect(() => {
    document.title = t("faq.pagetitle");
  }, [])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  // Define categories with translations + icons
  const faqCategories = [
    { id: "feeding", title: t("faq.categories.feeding"), icon: Utensils, color: "pink" },
    { id: "sleep", title: t("faq.categories.sleep"), icon: Moon, color: "purple" },
    { id: "development", title: t("faq.categories.development"), icon: Baby, color: "blue" },
    { id: "health", title: t("faq.categories.health"), icon: Shield, color: "green" }
  ]

  // Get translated FAQs
  const faqs = t("faq.questions", { returnObjects: true })

  const filteredFAQs = faqCategories.filter((category) => {
    if (selectedCategory !== "all" && category.id !== selectedCategory) return false

    if (searchTerm) {
      return faqs[category.id]?.some(
        (faq) =>
          faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return true
  })

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">{t("faq.title")}</h2>
        <p className="text-xl text-gray-600 mb-8">{t("faq.subtitle")}</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("faq.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            size="sm"
          >
            All
          </Button>
          {faqCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
              className="flex items-center gap-2"
            >
              <category.icon className="w-4 h-4" />
              {category.title}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8">
        {filteredFAQs.map((category) => (
          <Card key={category.id} className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${category.color}-100`}>
                  <category.icon className={`w-5 h-5 text-${category.color}-600`} />
                </div>
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-4">
              {faqs[category.id]
                ?.filter(
                  (faq) =>
                    !searchTerm ||
                    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((faq, index) => {
                  const isExpanded = expandedFAQ === `${category.id}-${index}`
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg my-2">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setExpandedFAQ(isExpanded ? null : `${category.id}-${index}`)
                        }
                        className="w-full justify-between p-5 h-auto text-left"
                      >
                        <span className="font-medium">{faq.q}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      {isExpanded && (
                        <div className="px-5 pb-5 text-gray-600">{faq.a}</div>
                      )}
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
