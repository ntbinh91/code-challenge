interface CustomFetchOptions<TRequestParam> extends RequestInit {
  params?: TRequestParam;
}
const customFetch = async <TResponseData, TRequestData>(url: string, options: CustomFetchOptions<TRequestData>) => {
  const params = options?.params;
  const urlWithParams = params ? `${url}?${new URLSearchParams(params).toString()}` : url;
  const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${urlWithParams}`;
  const response = await fetch(fullUrl, options).then(async (response) => {
    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.error || "Failed to fetch data");
    }
    return response.json() as TResponseData;
  });

  return response;
};

const apiInstance = {
  get: <TResponseData, TRequestData>(url: string, options?: CustomFetchOptions<TRequestData>) =>
    customFetch<TResponseData, TRequestData>(url, { method: "GET", ...options }),
  post: <TResponseData, TRequestData>(url: string, options?: CustomFetchOptions<TRequestData>) =>
    customFetch<TResponseData, TRequestData>(url, { method: "POST", ...options }),
  put: <TResponseData, TRequestData>(url: string, options?: CustomFetchOptions<TRequestData>) =>
    customFetch<TResponseData, TRequestData>(url, { method: "PUT", ...options }),
  delete: <TResponseData, TRequestData>(url: string, options?: CustomFetchOptions<TRequestData>) =>
    customFetch<TResponseData, TRequestData>(url, { method: "DELETE", ...options }),
};

export default apiInstance;
