import api from "@/utils/axios";

type RefreshResponse = {
  data?: {
    access_token?: string;
    refresh_token?: string;
  };
};

function getStoredUserId(): number | null {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return null;
    const user = JSON.parse(raw);
    
    return typeof user?.id === "number" ? user.id : null;
  } catch {
    return null;
  }
}

function getStoredRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export async function refreshTokenOnStart(): Promise<boolean> {
  const userId = getStoredUserId();
  const refreshToken = getStoredRefreshToken();

  if (!userId || !refreshToken) return true;

  try {
    // alert(userId)
    // Adjust the path if your backend uses a different endpoint
    const { data } = await api.post<RefreshResponse>("/refresh-token", {
      user_id: userId,
      refresh_token: refreshToken,
    });

    const newAccess = data?.data?.access_token;
    const newRefresh = data?.data?.refresh_token;

    if (newAccess) localStorage.setItem("access_token", newAccess);
    if (newRefresh) localStorage.setItem("refresh_token", newRefresh);
    return true;
  } catch (err: any) {
    const status = err?.response?.status;
    const message: string | undefined = err?.response?.data?.status?.message || err?.message;

    const shouldClear = status === 401 || status === 403 || status === 404 || /invalid/i.test(message || "");

    if (shouldClear) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userInfo");
    }

    console.warn("Refresh on start failed:", status, message);
    return !shouldClear;
  }
}
