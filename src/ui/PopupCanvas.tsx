import * as React from "react";

export interface PopupCanvasProps { 
}

export interface PopupCanvasState { 
    popup:any;
}

export class PopupCanvas extends React.Component<PopupCanvasProps, PopupCanvasState> {
    state : PopupCanvasState = {
        popup:null
    }

    private static _instance:PopupCanvas=null;
    
    static show(popup:any) {
        if (null!==PopupCanvas._instance) {
            PopupCanvas._instance.setState({
                popup:popup
            });
        }
    }

    componentWillMount(this:PopupCanvas) {
        if (null===PopupCanvas._instance) {
            PopupCanvas._instance=this;
        }
    }

    componentWillUnmount(this:PopupCanvas) {
        if (PopupCanvas._instance===this) {
            PopupCanvas._instance=null;
        }
    }

    render(this:PopupCanvas) {
        return <div style={{
            display: (this.state.popup?"block":"none"),
            position: "fixed",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: "gray",
            opacity: 0.5
            //zIndex: 5000 // needed?
        }}>{this.state.popup}</div>;
    }
}

