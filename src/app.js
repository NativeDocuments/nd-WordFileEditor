import "@babel/polyfill";
import * as React from "react";
import * as NDAPI from "NDAPI";
import {ZoomDialog} from "./ui/ZoomDialog.tsx";
import {SearchDialog} from "./ui/SearchDialog.tsx";
import {PopupCanvas} from "./ui/PopupCanvas.tsx";
import {RootDialog} from "./ui/RootDialog.tsx";
import {WordCommentPostIt} from "./ui/WordCommentPostIt.tsx";
import {CustomPostIt} from "./ui/CustomPostIt.tsx";

const appArgs = NDAPI.app_args;
const queryArgs = NDAPI.parseFormEncodedArgs(window.location.search, true);

console.log("appArgs="+JSON.stringify(appArgs));
console.log("queryArgs=" + JSON.stringify(queryArgs));

const enableDocumentUpload=true;

function createPostIt(item, sidebar, pos, doc) {
    if ("DOC"===item.slot) {
        return React.createElement(WordCommentPostIt, {key:item.key+":"+item.slot, item:item, sidebar:sidebar, pos:pos, doc:doc});
    } else {
        return React.createElement(CustomPostIt, {key:item.key+":"+item.slot, item:item, sidebar:sidebar, pos:pos, doc:doc});
    }
}

NDAPI.app("root", {
    revid: queryArgs.revid || appArgs.revid || process.env.ND_API_VER,
    devid: queryArgs.devid || appArgs.devid || (process.env.ND_DEV_ID && "string"===typeof(process.env.ND_DEV_ID) && process.env.ND_DEV_ID.length>0?process.env.ND_DEV_ID:null) || localStorage.getItem("ND_DEV_ID") || null,
    tenantid: queryArgs.tenantid || appArgs.tenantid || process.env.ND_TENANT_ID,
    nid: queryArgs.nid || appArgs.nid || (queryArgs.url?{url:queryArgs.url}:undefined),
    author: queryArgs.author || appArgs.author,
    headerHidden: true,
    onDocumentLoaded: function (e) {
        console.log("onDocumentLoaded");
        const stlyeSheet=NDAPI.getStyleSheet(function(styleSheet) {
            //console.log(JSON.stringify(styleSheet));
        });
    },
    onError: function (e) {
        console.error(e);
    },
    onSync: function(msg) {
        switch(msg) {
            case "syncTimeout":
            case "syncError":
            case "syncLocked":
                break;
        }
    },
    onReadyState: function(readyStateEvent) {
        if (Array.isArray(readyStateEvent)) {
            var msg=null;
            switch(readyStateEvent[0]) {
                case "resources":
                    msg=["updating editor resources - may take some time...",
                    (readyStateEvent.length>=4 && "progress"===readyStateEvent[1]?(
                        null===readyStateEvent[3] || 0===readyStateEvent[3]
                        ?" ("+readyStateEvent[2]+")" // no total available
                        :" ("+Math.round(readyStateEvent[2]*100/readyStateEvent[3])+"%)"
                    ):"")].join("");
                break;
                case "wasm":
                    msg="starting WebAssembly engine...";
                break;
                case "stream":
                    msg=["streaming document...",
                        (readyStateEvent.length>=4 && "progress"===readyStateEvent[1]?(
                            null===readyStateEvent[3] || 0===readyStateEvent[3]
                            ?" ("+readyStateEvent[2]+")" // no total available
                            :" ("+Math.round(readyStateEvent[2]*100/readyStateEvent[3])+"%)"
                        ):"")].join("");
                break;
                case "error":
                    if (readyStateEvent.length>1 && readyStateEvent[1] instanceof Error) {
                        msg=readyStateEvent[1].name+": "+readyStateEvent[1].message;
                    } else {
                        msg="Unknown Error"; // should not happen!
                    }
                break;
                default:
                break;
            };
            //console.log("onReadyState "+readyStateEvent[0]+": "+msg);
        }
    },
    onRangesChanged: function (rangepool, changes) {
        const keys=rangepool.keys();
        console.log(keys);
    },
    onSelectionChanged: function(event) {
        console.log("onSelectionChanged "+JSON.stringify(event));
        if (true) {
            NDAPI.getStyle(event.rStyle, function(styleData) {
                console.log("onSelectionChanged:styleData "+JSON.stringify(styleData));
            });
            NDAPI.getStyle(event.pStyle, function(styleData) {
                console.log("onSelectionChanged:styleData "+JSON.stringify(styleData));
            });
        }
    },
    renderOverlayLayer: function (renderedOverlayLayer) {
        const showZoomDialog=true;
        const showSearchDialog=true;
        const isDocumentReady=NDAPI.isDocumentReady(); // search is only available if docucment is "ready", i.e. all pages are loaded
        const pagesCount=NDAPI.getPageCount();
        const pendingPages=NDAPI.getPendingPages();
        // try to re-use ZoomDialog or create new instance
        const existingZoomDialog=(null!==renderedOverlayLayer && renderedOverlayLayer.length>=2?renderedOverlayLayer[0]:null);
        const zoomDialog=(showZoomDialog?existingZoomDialog || React.createElement(ZoomDialog, { key: "zoom", onZoom: function(value) {
            this.zoom(value);
        }.bind(NDAPI) }):null);
        const existingSearchDialog=(null!==renderedOverlayLayer && renderedOverlayLayer.length>=2?renderedOverlayLayer[1]:null);
        // try to re-use SearchDialog or create new instance
        const searchDialog=(showSearchDialog?(!existingSearchDialog?React.createElement(SearchDialog, { key: "search", isDocumentReady:isDocumentReady, pagesCount: pagesCount, pendingPages: pendingPages, onSearch: function(value, resultCallback, statusCallback) {
            this.find(value, resultCallback, statusCallback);
        }.bind(NDAPI)}):(existingSearchDialog.props.isDocumentReady===isDocumentReady &&
                existingSearchDialog.props.pagesCount===pagesCount &&
                existingSearchDialog.props.pendingPages===pendingPages?existingSearchDialog
                :React.cloneElement(existingSearchDialog, { isDocumentReady:isDocumentReady, pagesCount: pagesCount, pendingPages: pendingPages }))):null);

        const existingPopupCanvas=(null!==renderedOverlayLayer && renderedOverlayLayer.length>=3?renderedOverlayLayer[2]:null);
        const popupCanvas=(true?existingPopupCanvas || React.createElement(PopupCanvas, { key: "pc" }):null);
        // if no changes, return existing layer, otherwhise create new one
        return (existingZoomDialog===zoomDialog && existingSearchDialog===searchDialog?renderedOverlayLayer:[zoomDialog, searchDialog, popupCanvas]);
    },
    customSidebar: {
        width: 300 + 5,
        background: "#FFF",
        outline: "1px solid #CCC",
        getHighlightClass: function(meta, ui, payloads) {
            return ["NDRG"];
        },
        sortItems: function(sortItemsEvent) {
            if (isNaN(sortItemsEvent.slotA) || isNaN(sortItemsEvent.slotB)) {
                return sortItemsEvent.cmp; // use default sorting
            } else { // custom compare for custom ranges
                // use an also use sortItemsEvent.payloadA and sortItemsEvent.payloadB
                var ret=sortItemsEvent.cmpAnchor;
                if (0===ret) { // anchor equal
                    ret=sortItemsEvent.slotA-sortItemsEvent.slotB; // sort by slot
                    if (0===ret) { // slots equal
                        ret=sortItemsEvent.keyA.localeCompare(sortItemsEvent.keyB); // fallback: compare keys
                    }
                }
                return ret;
            }
        },
        renderItems: function (items, renderedItems, sidebar) {
            const zoom = sidebar.zoom;
            return items.map(function (item, itemIndex) {
                const hasRenderedItem = (null != renderedItems && itemIndex < renderedItems.length);
                let pos = hasRenderedItem ? renderedItems[itemIndex].props.pos : undefined;
                if (-1 !== item.clientHeight && (!pos || pos.y !== item.y || pos.h !== item.clientHeight || pos.zoom !== zoom)) {
                    pos = {y: item.y, h: item.clientHeight, zoom: zoom};
                }
                return hasRenderedItem && renderedItems[itemIndex].props.item.payload === item.payload ?
                    (React.cloneElement(renderedItems[itemIndex], {item: item, sidebar: sidebar, pos: pos, doc: sidebar.doc})) :
                    createPostIt(item, sidebar, pos, sidebar.doc);
            })
        }
    },
    renderRoot: function(renderedRoot, arg) {
        if (null===renderedRoot || renderedRoot.props.arg!==arg) {
            console.log("renderRoot "+typeof arg);
            renderedRoot=React.createElement(RootDialog, {key:arg, arg:arg, documentUpload: enableDocumentUpload});
        }
        return renderedRoot;
    },
    onKeyDown: function(event) {
        return false;
    },
    onKeyUp: function(event) {
        return false;
    },
    getSessionCSS: function(so, session)  {
        /*
          The session object contains:
          session.author: the author from the author_token

          Below is a simple Microsoft Word-like styling. For every editing session
          a color is chosen from the color table.
        */
        const color=this.colors[(this.counter++)%this.colors.length];
        const style=[
            '.INS', so, '{',
                'text-decoration-line:underline;',
                'text-decoration-color:'+color+';',
                'text-decoration-style:solid;',
                'color:'+color,
            '}',
            '.DEL', so, '{',
                'text-decoration-line:line-through;',
                'text-decoration-color:'+color+';',
                'text-decoration-style:solid;',
                'color:'+color,
        '}',
        ].join('');
        return style;
    }.bind({
        counter: 0,
        colors: [
            "red",
            "blue",
            "green",
            "purple"
        ]
    })

});
