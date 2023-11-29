import { LoginResult } from "./auth-social.ts";

export async function verifyFacebook(facebookClientAccessToken: string): Promise<LoginResult> {
  // const clientId = "1031031294173141";
  // const redirectUri = "https%3A%2F%2Flocahost%3A3000%2Flogin";
  // const clientSecret = "c3261def9c3505615af6540160196937";
  
  const resp = await fetch(`https://graph.facebook.com/me?fields=email,name,first_name,last_name,picture&access_token=${facebookClientAccessToken}`);
  const data = await resp.json();

  if (data.error) {
    return Promise.reject(data.error);  
  }

  const result = {
    email: data.email,
    givenName: data.first_name,
    familyName: data.last_name,
    name: data.name,
    picture: data.picture.data.url
  };
  return Promise.resolve(result);
}
