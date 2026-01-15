import CategoryList from "../components/categories/categories";

async function getCategories() {
  const API_URL = "http://localhost:8000/api/categories";

  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("FastAPI Error:", error);
    return [];
  }
}

export default async function CategoryPage() {
  const categories = await getCategories();
  return (
    <div className="max-w-4xl mx-auto p-6">
      <CategoryList initialCategories={categories} />
    </div>
  );
}