export type APIRequest =
  | "take-users-informations"
  | "take-posts-informations"
  | "take-post-recommandation"
  | "add-like-post"
  | "delete-like-post";

const instructionMap: Record<APIRequest, number> = {
  "take-users-informations": 1,
  "take-posts-informations": 2,
  "take-post-recommandation": 3,
  "add-like-post": 4,
  "delete-like-post": 5,
};

export async function API(request: APIRequest, data: any): Promise<any> {
  const action = instructionMap[request];
  if (!action) return null;

  try {
    switch (action) {
      case 1: {
        const response = await fetch("http://192.168.1.2:8000/database/user.json");
        const json = await response.json();
        return json[data];
      }
      case 2: {
        const response = await fetch("http://192.168.1.2:8000/database/post.json");
        const json = await response.json();
        const tableau = Array.isArray(json) ? json : Object.values(json);
        return tableau[0];
      }
      case 3: {
        const response = await fetch("http://192.168.1.2:8000/database/post.json");
        const json = await response.json();
        const tableau = Array.isArray(json) ? json : Object.values(json);
        return tableau;
      }
      case 4:
        console.log("Add like");
        return null;
      case 5:
        console.log("Delete like");
        return null;
      default:
        return null;
    }
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}