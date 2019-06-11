import * as React from "react";
const zoomIn=require("./zoomIn.svg");
const zoomOut=require("./zoomOut.svg");
const zoomWidth = require("./zoomWidth.svg");

export interface ZoomDialogProps { 
    onZoom: (value:number|string)=>void
}

export interface ZoomDialogState { 
}

export class ZoomDialog extends React.Component<ZoomDialogProps, ZoomDialogState> {
    state : ZoomDialogState = {
    }

    componentWillMount(this:ZoomDialog) {
    }

    componentWillUnmount(this:ZoomDialog) {
    }

    onSubmit=function(this:ZoomDialog, event:any) {
        event.preventDefault();
    }.bind(this);

    render(this:ZoomDialog) {
        return <form  onSubmit={this.onSubmit} style={{
            position: "fixed",
            right: 5,
            bottom: 5,
            width: "auto",
            height: "auto",
            border: "0px",
            borderStyle: "solid",
            background: "transparent",
            padding: 0,
            overflow: "hidden",
            userSelect: "none"
        }}><button id="fitWidth" type="button" tabIndex={-1} onClick={this.props.onZoom.bind(null, "fitWidth")} style={{                        
            padding: 5,
            userSelect: "none",
            backgroundColor: "transparent",
            border: "0px",
            outline: "0px"
        }}><img src={zoomWidth} width={30} height={30}/></button><button id="zoomOut" type="button" tabIndex={-1} onClick={this.props.onZoom.bind(null, "-1")} style={{                        
            padding: 5,
            userSelect: "none",
            backgroundColor: "transparent",
            border: "0px",
            outline: "0px"
        }}><img src={zoomOut} width={30} height={30}/></button><button id="zoomIn" type="button" tabIndex={-1} onClick={this.props.onZoom.bind(null, "+1")} style={{
            padding: 5,
            userSelect: "none",
            backgroundColor: "transparent",
            border: "0px",
            outline: "0px"
        }}><img src={zoomIn} width={30} height={30}/></button></form>
    }
}

