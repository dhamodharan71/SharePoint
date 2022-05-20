"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDom = require("react-dom");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var strings = require("InnovationPageWebpartWebPartStrings");
var InnovationPageWebpart_1 = require("./components/InnovationPageWebpart");
var InnovationPageWebpartWebPart = /** @class */ (function (_super) {
    __extends(InnovationPageWebpartWebPart, _super);
    function InnovationPageWebpartWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InnovationPageWebpartWebPart.prototype.render = function () {
        var element = React.createElement(InnovationPageWebpart_1.default, {
            listName: this.properties.listName,
            spHttpClient: this.context.spHttpClient,
            siteUrl: this.context.pageContext.web.absoluteUrl,
            currentloginuser: this.context.pageContext.user.displayName,
            currentBrowser: window.navigator.userAgent,
        });
        ReactDom.render(element, this.domElement);
    };
    InnovationPageWebpartWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(InnovationPageWebpartWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse("1.0");
        },
        enumerable: true,
        configurable: true
    });
    InnovationPageWebpartWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField("listName", {
                                    label: strings.ListNameFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return InnovationPageWebpartWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = InnovationPageWebpartWebPart;
//# sourceMappingURL=InnovationPageWebpartWebPart.js.map