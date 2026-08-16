import type { Provider } from "@/lib/provider-schema";

export type WebSearchSupportSummary = {
	/** Connected (enabled) providers whose models can natively search the web. */
	readyProviderNames: string[];
	/** All catalog providers that offer native web search, connected or not. */
	supportedProviderNames: string[];
};

/**
 * The web-search toggle is global, but only providers with built-in web
 * search honor it (the runtime silently skips the tool everywhere else).
 * This summary drives the settings copy that tells the user whether the
 * toggle will actually do anything with their connected providers.
 */
export function summarizeWebSearchSupport(
	providers: Provider[],
): WebSearchSupportSummary {
	const supported = providers.filter(
		(provider) => provider.supportsWebSearch === true,
	);
	return {
		readyProviderNames: supported
			.filter((provider) => provider.enabled)
			.map((provider) => provider.name),
		supportedProviderNames: supported.map((provider) => provider.name),
	};
}

/** "A", "A and B", or "A, B, and C". */
export function formatProviderNameList(names: string[]): string {
	if (names.length <= 1) return names[0] ?? "";
	if (names.length === 2) return `${names[0]} and ${names[1]}`;
	return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
