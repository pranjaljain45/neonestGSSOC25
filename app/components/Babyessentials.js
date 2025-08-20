import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ShoppingCart, Plus } from "lucide-react";
import Badge from "./ui/Badge";
import { useTranslation } from "react-i18next";

const getCategoryBadgeProps = (category) => {
  switch (category) {
    case "clothing":
      return { className: "bg-purple-200 text-purple-800 hover:bg-purple-300" };
    case "health":
      return { className: "bg-green-200 text-green-800 hover:bg-green-300" };
    case "feeding":
      return { className: "bg-orange-200 text-orange-800 hover:bg-orange-300" };
    case "diapering":
      return { className: "bg-red-400 text-red-800 hover:bg-red-300" };
    case "bathing":
      return { className: "bg-cyan-200 text-cyan-800 hover:bg-cyan-300" };
    case "sleeping":
      return { className: "bg-indigo-200 text-indigo-800 hover:bg-indigo-300" };
    case "playtime":
      return { className: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300" };
    case "travel":
      return { className: "bg-teal-200 text-teal-800 hover:bg-teal-300" };
    case "traditional":
      return { className: "bg-rose-200 text-rose-800 hover:bg-rose-300" };
    case "cleaning":
      return { className: "bg-lime-200 text-lime-800 hover:bg-lime-300" };
    default:
      return { className: "bg-gray-200 text-gray-800 hover:bg-gray-300" };
  }
};

const Babyessentials = ({ onAddEssential }) => {
  const { t } = useTranslation("common");

  // Fetch baby essentials and categories from JSON
  const babyData = t("babyEssentials", { returnObjects: true });
  const essentials = babyData.items || [];
  const categories = babyData.categories || {};

  // Translate each essential
  const translateEssential = (essential) => ({
    name: essential.name,
    use: essential.use,
    category: categories[essential.category] || essential.category,
    categoryKey: essential.category
  });

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-green-600" />
          {t("babyEssentials.Title", "Common Baby Essentials")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2">
        {essentials.map((item, index) => {
          const { name, use, category, categoryKey } = translateEssential(item);
          const badgeProps = getCategoryBadgeProps(categoryKey);

          return (
            <div
              key={index}
              className="p-3 bg-pink-100 border border-blue-100 rounded-lg shadow-sm
                         hover:bg-pink-50 hover:border-blue-200 hover:shadow-md
                         transition-all duration-200 cursor-default flex flex-col justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800 mb-1">{name}</p>
                <p className="text-sm text-gray-600 mb-2">{use}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Badge className={`${badgeProps.className} capitalize`}>
                  {category}
                </Badge>
                <button
                  onClick={() => onAddEssential(name, categoryKey)}
                  className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors
                             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  title={t("addButtonTitle", { name })}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Babyessentials;
