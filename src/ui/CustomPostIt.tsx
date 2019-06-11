import * as React from "react";
import * as NDAPI from "NDAPI";

export interface CustomPostItProps { 
    item: any;
    sidebar:any;
    pos:any;
}

export interface CustomPostItState { 
    ui: any;
}

export class CustomPostIt extends React.Component<CustomPostItProps, CustomPostItState> {

    state : CustomPostItState = {
        ui: {}
    }

    constructor(props:CustomPostItProps) {
        super(props);
    }

    _onUIChanged=function(ui:any) {
        this.setState({
            ui: ui
        })
    }.bind(this);
    _registerId_UI=0;

    componentDidMount(this:CustomPostIt) {
        this._registerId_UI=NDAPI.registerUI(this._onUIChanged);
    }

    componentWillUnmount(this:CustomPostIt) {
        NDAPI.unregisterUI(this._registerId_UI);
        this._registerId_UI=0;
    }

    mouseUpHandler=function(this:CustomPostIt, event:any) {
        console.log("MOUSEUP: "+this.props.item.slotSID);
        //NDAPI.gotoSID(this.props.item.slotSID);
        //NDAPI.gotoSID(this.props.item.key+":"+this.props.item.slot);
    }.bind(this);

    render(this:CustomPostIt) {
        const itemPos = this.props.pos;
        const itemY = itemPos ? itemPos.y * itemPos.zoom : 0;
        const itemH = itemPos ? itemPos.h * itemPos.zoom : -1;
        const item = this.props.item;
        const divKey=item.key+":"+item.slot;
        return <div key={divKey} onMouseUp={this.mouseUpHandler} style={{
            position: "absolute",
            left: 0,
            right: 5,
            top:itemY,
            border: "1px solid gray",
            background: "green",
            boxSizing: "border-box",
            display: item && item.payload && item.payload.hidden?"none":undefined,
            visibility: (-1===itemH?"hidden":"visible"),
            overflowWrap: "break-word",
            pointerEvents: "auto",
            minHeight: (1*this.props.sidebar.zoom)+"cm",
            //maxHeight: item.maxHeight,
            overflow: "auto",
            userSelect: "text"
        }}>{JSON.stringify((Object as any).assign({
            key: this.props.item.key,
            slot: this.props.item.slot,
            slotSID: this.props.item.slotSID
        }, this.props.item.payload, this.state))}</div>;
    }
}

