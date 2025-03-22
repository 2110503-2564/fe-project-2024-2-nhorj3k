export default async function  getProvider(id:string) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = await fetch(`https://swp-backend.onrender.com/api/v1/providers/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch venue");
    }

    return await response.json();
}