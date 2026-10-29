import type { QueryClient } from "@tanstack/react-query";

const channelName = "posyandu-session-change";
const storageKey = "posyandu-session-change";
const sessionChannel =
  typeof window === "undefined" || typeof BroadcastChannel === "undefined"
    ? null
    : new BroadcastChannel(channelName);

async function clearQueries(queryClient: QueryClient): Promise<void> {
  await queryClient.cancelQueries();
  queryClient.removeQueries();
}

export async function clearIdentityBoundQueryCache(
  queryClient: QueryClient
): Promise<void> {
  await clearQueries(queryClient);

  if (sessionChannel) {
    sessionChannel.postMessage("clear-private-query-cache");
  } else if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        storageKey,
        `${Date.now()}-${Math.random()}`
      );
    } catch {
      // In-memory query data is already cleared in this tab.
    }
  }
}

export function subscribeToIdentityChanges(
  queryClient: QueryClient
): () => void {
  const clearOnChange = () => {
    void clearQueries(queryClient);
  };

  if (sessionChannel) {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "clear-private-query-cache") clearOnChange();
    };
    sessionChannel.addEventListener("message", handleMessage);
    return () => sessionChannel.removeEventListener("message", handleMessage);
  }

  if (typeof window !== "undefined") {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) clearOnChange();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }

  return () => undefined;
}
