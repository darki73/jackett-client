import * as request from 'request-promise-native';
import { JackettResponse } from '../interfaces';
import { JackettCategory } from '../interfaces';
import { xml2js } from 'xml-js';

interface QueryParameters {
    [key: string]: any;
}

export class JackettService {
    private readonly host: string;
    private readonly apiKey: string;
    private readonly apiVersion: string;
    private indexer?: string;
    private baseUrl: string;

    /**
     * Service Constructor
     * @param host
     * @param apiKey
     * @param apiVersion
     */
    constructor(host: string, apiKey: string, apiVersion: string = 'v2.0') {
        this.host = host;
        this.apiKey = apiKey;
        this.apiVersion = apiVersion;
        this.buildBaseUrl();
    }

    /**
     * Specify which indexer we want to use
     * @param indexer
     * @return JackettService
     */
    public useIndexer(indexer: string): JackettService {
        this.indexer = indexer.toLowerCase();
        return this;
    }

    /**
     * Search for series
     * @param { string } query
     * @param { number[] } categories
     * @return { Promise<JackettResponse> }
     */
    public async search(query: string, categories?: number[]): Promise<JackettResponse> {
        const queryParameters: QueryParameters = {
            Query: query,
        };

        if (this.indexer !== null && this.indexer !== undefined) {
            queryParameters['Tracker[]'] = this.indexer;
        }

        if (categories !== null && categories !== undefined && categories.length > 0) {
            queryParameters['Category[]'] = categories.join(',');
        }

        const url = `${this.baseUrl}/indexers/all/results${this.buildQueryParameters(queryParameters)}`;
        return request({
            url,
            json: true,
        }).then(json => json as JackettResponse);
    }

    /**
     * Search for media on specified indexer
     * @param { string }indexer
     * @param { string }query
     * @param { number[] } categories
     * @return { Promise<JackettResponse> }
     */
    public async searchOn(indexer: string, query: string, categories?: number[]): Promise<JackettResponse> {
        return this.useIndexer(indexer).search(query, categories);
    }

    /**
     * Get list of categories for installed indexers
     * @return { Promise<JackettCategory> }
     */
    public async getCategories(): Promise<JackettCategory> {
        const queryParameters: QueryParameters = {
            t: 'caps',
        };
        const url = `${this.baseUrl}/indexers/all/results/torznab/api${this.buildQueryParameters(queryParameters)}`;
        return request(url)
            .then(xml => xml2js(xml, { compact: true, nativeType: true }))
            .then((json: any) => {
                return json.caps.categories.category.map((category: any) => {
                    let subcategories: JackettCategory[] = null;
                    if (category.subcat !== undefined) {
                        subcategories = category.subcat.map((subcategory: any) => {
                            return {
                                ID: subcategory._attributes.id,
                                Name: subcategory._attributes.name,
                            };
                        });
                    }
                    const result: JackettCategory = {
                        ID: category._attributes.id,
                        Name: category._attributes.name,
                    };
                    if (subcategories !== null) {
                        result.SubCategories = subcategories;
                    }
                    return result;
                });
            });
    }

    /**
     * Build base request Url
     * @return void
     */
    private buildBaseUrl(): void {
        const { host, apiVersion } = this;
        this.baseUrl = `${host}/api/${apiVersion}`;
    }

    /**
     * Build custom query parameters
     * @param customParameters
     * @return string
     */
    private buildQueryParameters(customParameters: QueryParameters): string {
        const queryArray: string[] = [];
        Object.keys(customParameters).forEach((key: string) => {
            queryArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(customParameters[key])}`);
        });
        return `?apikey=${this.apiKey}&` + queryArray.join('&');
    }

}
