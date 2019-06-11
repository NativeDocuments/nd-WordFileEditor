import * as React from "react";
import * as NDAPI from "NDAPI";

export interface WordCommentPostItProps { 
    item: any;
    sidebar:any;
    pos:any;
    doc:any;
}

export interface WordCommentPostItState { 
    commentSession: any;
}

export class WordCommentPostIt extends React.Component<WordCommentPostItProps, WordCommentPostItState> {

    richTextArea:any=null; // React.Component
    state : WordCommentPostItState = {
        commentSession: null
    }

    constructor(props:WordCommentPostItProps) {
        super(props);
    }

    shouldComponentUpdate(this:WordCommentPostIt, nextProps:WordCommentPostItProps, nextState:WordCommentPostItState) {
        return true;
    }

    componentDidMount(this:WordCommentPostIt) {
        this.richTextArea=NDAPI.createRichTextArea({
            so:this.props.item.payload.so,
            componentUpdated: function(this:WordCommentPostIt) {
                this.props.sidebar.scheduleLayout();
            }.bind(this)});
        NDAPI.getSession(this.props.item.payload.session, function(this:WordCommentPostIt, session:any, cached:boolean) {
            this.setState({
                commentSession:session
            }, cached?undefined:()=>{
                this.props.sidebar.scheduleLayout();
            });

        }.bind(this));
    }

    componentWillUnmount(this:WordCommentPostIt) {
        this.richTextArea=null;
    }

    render(this:WordCommentPostIt) {
        const itemPos = this.props.pos;
        const itemY = itemPos ? itemPos.y * itemPos.zoom : 0;
        const itemH = itemPos ? itemPos.h * itemPos.zoom : -1;
        const item = this.props.item;
        return <div key={item.key} style={{
            position: "absolute",
            left: 0,
            right: 5,
            top:itemY,
            border: "1px solid gray",
            background: "yellow",
            boxSizing: "border-box",
            display: item && item.payload && item.payload.hidden?"none":undefined,
            visibility: (-1===itemH?"hidden":"visible"),
            overflowWrap: "break-word",
            pointerEvents: "auto",
            userSelect: "none",
            minHeight: (1*this.props.sidebar.zoom)+"cm",
            overflow: "auto",
            fontFamily: "Arial, Helvetica, sans-serif"
        }}><div key="header" style={{
            background: "orange"
        }}>{this.state.commentSession?JSON.stringify(this.state.commentSession):JSON.stringify(this.props.item.payload)}</div>{this.richTextArea}</div>;
    }
}

