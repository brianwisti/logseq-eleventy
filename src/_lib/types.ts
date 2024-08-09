type Properties = {
    public: boolean;
};

export type Block = {
    id: string;
    format: string;
    properties: Properties;
    content: string;
    children: Block[];
};

export type RawPage = Block & {
    "page-name": string;
};

export type Page = RawPage & {
    permalink: string;
};

export type Graph = {
    blocks: Page[];
    version: Number;
};