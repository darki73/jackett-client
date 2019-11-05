export interface JackettCategory {
    ID: number;
    Name: string;
    SubCategories?: JackettCategory[];
}
