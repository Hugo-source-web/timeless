import { Auth } from "@auth/core";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  const res = await Auth(
    new Request("http://localhost/api/auth/session"), 
    authConfig
  );

  const json = await res.json();
  return json;
}
