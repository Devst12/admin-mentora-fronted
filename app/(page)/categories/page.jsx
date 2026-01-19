import CategoryList from "../components/categories/categories";

async function getCategories() {
  const API_URL = "http://localhost:8000/api/categories";

  try {
    const res = await fetch(API_URL, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("FastAPI Fetch Error:", error);
    return [];
  }
}

export default async function CategoryPage() {
  const categories = await getCategories();
  
  return (
    <div className="min-h-screen bg-gray-50/30">
      <CategoryList initialCategories={categories} />
    </div>
  );
}