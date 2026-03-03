import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types"
import { TagsIcon } from "lucide-react";
import { CategoryForm } from "@/components/dashboard/category-form";


export default async function Categories() {

  const token = await getToken();
  const categories = await apiClient<Category[]>("/category", {
    token: token!,
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Categorias
          </h1>
          <p className="text-sm sm:text-base mt-1">
            Gerencie as categorias de produtos para organizar melhor seus itens.
          </p>
        </div>

        <CategoryForm />

      </div>

      {categories.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id}
            className="bg-app-card border-app-border trasition-shadow hover:shadow-md text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <TagsIcon className="w-5 h-5" />
                  <span>{category.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 text-sm">{category.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}