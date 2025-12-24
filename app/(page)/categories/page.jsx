import Category from "../components/categories/categories";

async function getCategories() {
  // Use the environment variable for your base URL (e.g., http://localhost:3000)
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/categories`, {
      cache: 'no-store', // This forces SSR by disabling caching
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Return empty array to prevent page crash
  }
}

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Category initialCategories={categories} />
    </div>
  );
}