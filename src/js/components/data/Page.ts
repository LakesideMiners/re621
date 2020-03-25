export class Page {

    private static instance: Page;

    private url: URL;

    private constructor() {
        this.url = new URL(window.location.toString());
    }

    /**
     * Checks if the url the user is currently on satisfies the filter
     * @param filter Pipe seperated list of filters the current location has to satisfy
     *               Matches are by default on a startsWith basis, but if the url must match
     *               you can prepend =
     * @returns true if at least on filter is fullfilled
     */
    public static matches(filter: RegExp | RegExp[]) {
        if (filter instanceof RegExp) filter = [filter];
        const pathname = this.getInstance().url.pathname.replace(/[\/?]$/g, "");
        let result = false;
        filter.forEach(function (constraint) {
            result = result || constraint.test(pathname);
        });
        return result;
    }

    /**
     * Returns the query parameter, or null if the key does not exist
     * @return string Query parameter
     */
    public static getQueryParameter(key: string): string {
        return this.getInstance().url.searchParams.get(key);
    }

    /**
     * Sets a query parameter in the current url  
     * If there is already one with the same key, it will get overridden
     * @param key 
     * @param value 
     */
    public static setQueryParameter(key: string, value: string) {
        this.getInstance().url.searchParams.set(key, value);
        this.refreshCurrentUrl();
    }

    /**
     * Removes a querystring from the url
     */
    public static removeQueryParameter(key: string) {
        this.getInstance().url.searchParams.delete(key);
        this.refreshCurrentUrl();
    }

    /**
     * Replaces the current url without reloading or pushing the old one to the history
     */
    private static refreshCurrentUrl() {
        let url = this.getInstance().url;
        const searchPrefix = url.searchParams.toString().length === 0 ? "" : "?"
        history.replaceState({}, "", url.origin + url.pathname + searchPrefix + url.searchParams.toString());
    }

    /**
     * Returns a singleton instance of the class
     * @returns Url instance
     */
    public static getInstance(): Page {
        if (this.instance === undefined) this.instance = new Page();
        return this.instance;
    }
}

export const PageDefintion = {
    search: /^$|^\/posts\/?$/,
    post: /^\/posts\/\d+\/?$/,
    forum: /^\/forum_topics\/?.*/,
}
