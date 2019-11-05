import { JackettResponse } from '../interfaces';
import { JackettCategory } from '../interfaces';
export declare class JackettService {
    private readonly host;
    private readonly apiKey;
    private readonly apiVersion;
    private indexer?;
    private baseUrl;
    constructor(host: string, apiKey: string, apiVersion?: string);
    useIndexer(indexer: string): JackettService;
    search(query: string, categories?: number[]): Promise<JackettResponse>;
    searchOn(indexer: string, query: string, categories?: number[]): Promise<JackettResponse>;
    getCategories(): Promise<JackettCategory>;
    private buildBaseUrl;
    private buildQueryParameters;
}
