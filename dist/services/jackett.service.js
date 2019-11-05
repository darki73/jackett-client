"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const xml_js_1 = require("xml-js");
class JackettService {
    constructor(host, apiKey, apiVersion = 'v2.0') {
        this.host = host;
        this.apiKey = apiKey;
        this.apiVersion = apiVersion;
        this.buildBaseUrl();
    }
    useIndexer(indexer) {
        this.indexer = indexer.toLowerCase();
        return this;
    }
    async search(query, categories) {
        const queryParameters = {
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
        }).then(json => json);
    }
    async searchOn(indexer, query, categories) {
        return this.useIndexer(indexer).search(query, categories);
    }
    async getCategories() {
        const queryParameters = {
            t: 'caps',
        };
        const url = `${this.baseUrl}/indexers/all/results/torznab/api${this.buildQueryParameters(queryParameters)}`;
        return request(url)
            .then(xml => xml_js_1.xml2js(xml, { compact: true, nativeType: true }))
            .then((json) => {
            return json.caps.categories.category.map((category) => {
                let subcategories = null;
                if (category.subcat !== undefined) {
                    subcategories = category.subcat.map((subcategory) => {
                        return {
                            ID: subcategory._attributes.id,
                            Name: subcategory._attributes.name,
                        };
                    });
                }
                const result = {
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
    buildBaseUrl() {
        const { host, apiVersion } = this;
        this.baseUrl = `${host}/api/${apiVersion}`;
    }
    buildQueryParameters(customParameters) {
        const queryArray = [];
        Object.keys(customParameters).forEach((key) => {
            queryArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(customParameters[key])}`);
        });
        return `?apikey=${this.apiKey}&` + queryArray.join('&');
    }
}
exports.JackettService = JackettService;
//# sourceMappingURL=jackett.service.js.map