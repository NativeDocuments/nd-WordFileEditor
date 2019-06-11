import * as React from "react";

export interface SearchDialogProps { 
    onSearch: (value:string, resultCallback:(results:NDSearchResults)=>void, statusCallback?:()=>boolean)=>void;
    isDocumentReady: boolean;
    pagesCount: number;
    pendingPages: number;
}

export interface SearchDialogState { 
    result:NDSearchResults;
}

export class SearchDialog extends React.Component<SearchDialogProps, SearchDialogState> {
    state : SearchDialogState = {
        result: null
    }
    searchInputRef:any=null; // HTMLElement
    pendingSearchTerm:string|null=null;
    
    performPendingSearch=function(this:SearchDialog) {
        this.props.onSearch(this.pendingSearchTerm, this.onResult, this.onStatus.bind(null, this.pendingSearchTerm));
    }.bind(this)

    scheduleSearch(searchTerm:string) {
        if (this.pendingSearchTerm!==searchTerm) {
            this.pendingSearchTerm=searchTerm;
            setImmediate(this.performPendingSearch);
        }
    }

    componentWillMount(this:SearchDialog) {
    }

    componentWillUnmount(this:SearchDialog) {
    }

    onResult=function(this:SearchDialog, result:NDSearchResults) {
        this.setState({
            result: result
        }, ()=>{
            if (this.state.result && this.state.result.length>0) {
                this.state.result.selectIndex(this.state.result.index, {
                    highlight: true
                });
            } else if (null==this.state.result) {
                this.pendingSearchTerm=null;
            }
            this.forceUpdate();
        });
    }.bind(this);

    onStatus=function(this:SearchDialog, searchTerm:string):boolean {
        return (this.pendingSearchTerm===searchTerm);
    }.bind(this);

    onSubmit=function(this:SearchDialog, event:any) {
        try {
            var result:NDSearchResults=null;
            if (this.props.onSearch) {
                const value=this.searchInputRef?this.searchInputRef.value:null;
                this.scheduleSearch(value);
            }
        } finally {
            event.preventDefault();
        }
    }.bind(this);

    onChange=function(this:SearchDialog, event:any) {
    /* Disabled
        try {
            var result:NDSearchResults=null;
            if (this.props.onSearch) {
                const value=this.searchInputRef?this.searchInputRef.value:null;
                this.scheduleSearch(value);
            }
        } finally {
        }
    */
    }.bind(this);

    onPrev=function(this:SearchDialog, event:any) {
        try {
            if (this.state.result && this.state.result.length>0) {
                const index=(this.state.result.index>0?this.state.result.index-1:this.state.result.length-1);
                this.state.result.selectIndex(index, {
                    highlight: true
                });
                this.forceUpdate();
            }
        } finally {
            event.preventDefault();
        }
    }.bind(this);
    onNext=function(this:SearchDialog, event:any) {
        try {
            if (this.state.result && this.state.result.length>0) {
                const index=(this.state.result.index+1<this.state.result.length?this.state.result.index+1:0);
                this.state.result.selectIndex(index, {
                    highlight: true
                });
                this.forceUpdate();
            }
        } finally {
            event.preventDefault();
        }
    }.bind(this);
    onHide=function(this:SearchDialog, event:any) {
        try {
            if (this.props.onSearch) { // clear search
                this.props.onSearch(null, this.onResult);
            }
        } finally {
            event.preventDefault();
        }
    }.bind(this);

    render(this:SearchDialog) {
        const displayCount=Math.max(this.state.result?this.state.result.length:0, 0);
        const displayIndex=Math.max(Math.min(this.state.result?this.state.result.index+1:0, displayCount), 0);
        return <form onSubmit={this.onSubmit} style={{
            position: "fixed",
            boxSizing: "content-box",
            right: 5,
            top: 5,
            width: 200,
            height: 20,
            lineHeight: "20px",
            border: "1px solid gray",
            borderStyle: "solid",
            background: "white",
            padding: 2,
            overflow: "hidden"
        }}><input key="input" type="text" onChange={this.onChange} disabled={!this.props.isDocumentReady} placeholder={this.props.isDocumentReady?"Search...":"Waiting for pages "+(this.props.pagesCount-this.props.pendingPages)+"/"+this.props.pagesCount+"..."} spellCheck={false} style={{
            background: "white",
            padding: 0,
            margin: 0,
            border: 0,
            outline: 0,
            width: "inherit",
            height: "inherit",
            display: (null!==this.state.result?"none":undefined),
            lineHeight: "inherit"
        }} ref={function(this:SearchDialog, r:any){ this.searchInputRef=r; }.bind(this)}></input><div key="result" style={{
            float: "left",
            border: 0,
            outline: 0,
            width: 0,
            height: "100%",
            display: (null===this.state.result?"none":undefined),
            overflow: "visible",
            userSelect: "none",
            pointerEvents: "none",
            lineHeight: "inherit"
        }}>{displayIndex}/{displayCount}</div><button type="button" onClick={this.onHide} style={{
            float: "right",
            display: (null===this.state.result?"none":undefined)
        }}>Hide</button><button type="button" onClick={this.onNext} style={{
            float: "right",
            display: (null===this.state.result?"none":undefined)
        }}>Next</button><button type="button" onClick={this.onPrev} style={{
            float: "right",
            display: (null===this.state.result?"none":undefined)
        }}>Prev</button></form>
    }

}

