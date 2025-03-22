import { ProviderJson } from "../../interface";

export default async function getVenues(): Promise<ProviderJson> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = await fetch("https://swp-backend.onrender.com/api/v1/providers");

    if (!response.ok) {
      throw new Error("Failed to fetch venues");
    }

    const data: ProviderJson = await response.json();
    return data;

}
