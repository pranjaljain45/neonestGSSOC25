"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import { ExternalLink, Search, Filter, Clock } from "lucide-react";

const categories = ["all", "feeding", "sleep", "development", "health"];

export default function Resources() {
  const { t } = useTranslation("common");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // get articles from i18n
  const articles = t("resources.articles", { returnObjects: true });


  useEffect(() => {
    document.title = `${t("resources.title")} | NeoNest`;
  }, [t]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      !searchTerm ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-800">{t("resources.title")}</h2>
        <p className="text-lg text-gray-600">{t("resources.subtitle")}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 inset-y-0 flex items-center h-full text-gray-400 w-4" />
        <Input
          placeholder={t("resources.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 w-full"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">
            {t("categoryLabel")}
          </span>
        </div>
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            onClick={() => setSelectedCategory(category)}
            size="sm"
            className={`rounded-xl text-sm ${selectedCategory === category
              ? "bg-pink-100 text-pink-700 font-semibold border-pink-300"
              : "text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
          >
            {t(`resources.categories.${category}`)}
          </Button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg mt-2 hover:text-pink-600 transition-colors duration-200">
                {article.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-4 pb-6 pt-0">
              <p className="text-gray-600 text-sm mb-4">{article.description}</p>

              <div className="space-y-1 mb-4 text-sm text-gray-500">
                <div>By {article.author}</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                  <div>
                    {new Date(article.publishDate).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-600"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                className="w-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white font-medium rounded-xl transition-all duration-200"
                variant="ghost"
                onClick={() => window.open(article.url, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t("resources.buttons.readArticle")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <p className="text-gray-500 text-lg">{t("resources.noResults")}</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="rounded-xl"
          >
            {t("resources.buttons.clearFilters")}
          </Button>
        </div>
      )}
    </div>
  );
}
