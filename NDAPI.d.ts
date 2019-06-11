
declare module 'NDAPI';

interface NDSearchResultsSelectIndexOptions {
    highlight: boolean
}

interface NDSearchResults {
    index:number;
    length:number;
    highlighted: boolean;
    selectIndex(index:number, options?:NDSearchResultsSelectIndexOptions):void;
}

