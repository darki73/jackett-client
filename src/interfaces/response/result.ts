export interface ResponseResult {
    FirstSeen: string;
    Tracker: string;
    TrackerId: string;
    CategoryDesc: string;
    Title: string;
    Guid: string;
    Link: string;
    Comments: string;
    PublishDate: string;
    Category: number[];
    Size: bigint;
    Files: any; // TODO: Replace with the real type
    Grabs: number;
    Description: any; // TODO: Replace with the real type
    RageID: any; // TODO: Replace with the real type
    TVDBId: any; // TODO: Replace with the real type
    Imdb: any; // TODO: Replace with the real type
    Seeders: number;
    Peers: number;
    BannerUrl?: string;
    InfoHash?: string;
    MagnetUri?: string;
    MinimumRatio: number;
    MinimumSeedTime: number;
    DownloadVolumeFactor: number;
    UploadVolumeFactor: number;
    Gain: number;
}
