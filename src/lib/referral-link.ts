const DEFAULT_REGISTER_URL = "https://lawyer.legardy.com/register-lawyer";

const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_LAWYER_REGISTER_URL?.trim();
  return envUrl && envUrl.length > 0 ? envUrl : DEFAULT_REGISTER_URL;
};

const buildUrlFallback = (baseUrl: string, query: string) => {
  if (!query) return baseUrl;
  const hasQuery = baseUrl.includes("?");
  const separator = hasQuery ? "&" : "?";
  return `${baseUrl}${separator}${query}`;
};

export const getReferralLink = (
  referralId: number | string | null | undefined,
  referrerType: string = "user",
) => {
  const baseUrl = getBaseUrl();

  try {
    const url = new URL(baseUrl);

    if (referralId !== null && referralId !== undefined && String(referralId).length > 0) {
      url.searchParams.set("referralId", String(referralId));
    }

    if (referrerType) {
      url.searchParams.set("referrerType", referrerType);
    }

    return url.toString();
  } catch (error) {
    const params = new URLSearchParams();

    if (referralId !== null && referralId !== undefined && String(referralId).length > 0) {
      params.set("referralId", String(referralId));
    }

    if (referrerType) {
      params.set("referrerType", referrerType);
    }

    return buildUrlFallback(baseUrl, params.toString());
  }
};

