const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  
  /**
   * Type representing the result of a fetch operation.
   * 
   * @property response The response object, if the fetch was successful
   * @property error The error object, if the fetch failed
   */
  type FetchResult = { response?: Response; error?: Error };
  
  /**
   * Fetches a URL with retries.
   * 
   * @param url The URL to fetch
   * @param retries The number of retries to attempt (default: 3)
   * @param delay The delay between retries in milliseconds (default: 500)
   * @param token The Bearer token to include in the request headers (optional)
   * @returns A promise that resolves with the fetch result
   */
  export const fetchWithRetry = async (
    url: string,
    retries: number = 3,
    delay: number = 500,
    token?: string
  ): Promise<FetchResult> => {
    // Attempt the fetch operation with retries
    for (let i = 0; i < retries; i++) {
      try {
        // Perform the fetch operation
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/x-www-form-urlencoded", 
          },
        });
        return { response };
      } catch (error) {
        // If this is not the last retry, wait and try again
        if (i < retries - 1) {
          console.log(`Retrying ${i + 1}...`);
          await sleep(delay);
        }
      }
    }
    // If all retries have been exhausted, return an error
    return { error: new Error("All retries exhausted") };
  };