import { describe, expect, it } from "vitest";
import type { Provider } from "@/lib/provider-schema";
import {
	formatProviderNameList,
	summarizeWebSearchSupport,
} from "@/lib/web-search-support";

function makeProvider(overrides: Partial<Provider>): Provider {
	return {
		id: "provider",
		name: "Provider",
		models: 1,
		color: "#000000",
		letter: "P",
		enabled: false,
		...overrides,
	};
}

describe("summarizeWebSearchSupport", () => {
	it("splits supported providers into connected and available", () => {
		const summary = summarizeWebSearchSupport([
			makeProvider({
				id: "anthropic",
				name: "Anthropic",
				enabled: true,
				supportsWebSearch: true,
			}),
			makeProvider({
				id: "gemini",
				name: "Google Gemini",
				enabled: false,
				supportsWebSearch: true,
			}),
			makeProvider({
				id: "openrouter",
				name: "OpenRouter",
				enabled: true,
				supportsWebSearch: false,
			}),
		]);

		expect(summary.readyProviderNames).toEqual(["Anthropic"]);
		expect(summary.supportedProviderNames).toEqual([
			"Anthropic",
			"Google Gemini",
		]);
	});

	it("treats a missing supportsWebSearch flag as unsupported", () => {
		const summary = summarizeWebSearchSupport([
			makeProvider({ id: "custom", name: "Custom", enabled: true }),
		]);

		expect(summary.readyProviderNames).toEqual([]);
		expect(summary.supportedProviderNames).toEqual([]);
	});
});

describe("formatProviderNameList", () => {
	it("formats zero, one, two, and many names", () => {
		expect(formatProviderNameList([])).toBe("");
		expect(formatProviderNameList(["Anthropic"])).toBe("Anthropic");
		expect(formatProviderNameList(["Anthropic", "OpenAI"])).toBe(
			"Anthropic and OpenAI",
		);
		expect(
			formatProviderNameList(["Anthropic", "OpenAI", "Google Gemini"]),
		).toBe("Anthropic, OpenAI, and Google Gemini");
	});
});
