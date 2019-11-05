export interface Indexer {
    id: string;
    name: string;
    description: string;
    type: 'public' | 'private' | 'semi-private';
    configured: boolean;
    site_link: string;
    alternativeLinks: [string];
    language: string;
    last_error: string;
    potatoenabled: boolean;
    caps: [IndexerCaps];
}

interface IndexerCaps {
    ID: string;
    Name: string;
}
