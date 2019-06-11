import * as React from "react";
const NDAPI=require("NDAPI");

export interface RootDialogProps {
}

export interface RootDialogState {
    status: string|null;
}

export class RootDialog extends React.Component<RootDialogProps, RootDialogState> {

    state : RootDialogState = {
        status: null
    }


    componentWillMount(this:RootDialog) {
    }

    componentWillUnmount(this:RootDialog) {
    }
    

    render(this:RootDialog) {
        return <div style={{
            position: "fixed",
            width: 640,
            marginLeft:-320,
            height:50,
            marginTop:-25,
            left: "50%",
            top: "50%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textAlign: "center",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "12pt"}}>{this.state.status}</div>;
    }

}

