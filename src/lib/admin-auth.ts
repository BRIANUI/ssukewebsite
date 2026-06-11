const KEY = "ssuke_admin_v1";
export const ADMIN_USERNAME = "ssukepizza";
export const ADMIN_PASSWORD = "ssukepizza26";

export function isAdminSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function signInAdmin(username: string, password: string): boolean {
  if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    window.localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function signOutAdmin() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}