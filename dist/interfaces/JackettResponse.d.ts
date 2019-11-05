import { ResponseIndexer } from './response/indexer';
import { ResponseResult } from './response/result';
export interface JackettResponse {
    Results: [ResponseResult];
    Indexers: [ResponseIndexer];
}
