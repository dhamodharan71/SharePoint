import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";

import * as strings from "InnovationPageWebpartWebPartStrings";
import InnovationPageWebpart from "./components/InnovationPageWebpart";
import { IInnovationPageWebpartProps } from "./components/IInnovationPageWebpartProps";
import { PageContext } from "@microsoft/sp-page-context";
import SPHttpClient from "@microsoft/sp-http/lib/spHttpClient/SPHttpClient";
import { IListItem } from "./components/IListItem";

export interface IInnovationPageWebpartWebPartProps {
  listName:string;
  siteUrl:string;
  currentloginuser:string;
  currentBrowser:string;
  clickHandler: () => void;
}

export default class InnovationPageWebpartWebPart extends BaseClientSideWebPart<IInnovationPageWebpartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IInnovationPageWebpartProps > = React.createElement(
      InnovationPageWebpart,
      {
        listName: this.properties.listName,
        spHttpClient: this.context.spHttpClient,
        siteUrl:this.context.pageContext.web.absoluteUrl,
        currentloginuser:this.context.pageContext.user.displayName,
        currentBrowser:window.navigator.userAgent,
      }
    );

    ReactDom.render(element, this.domElement);
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                PropertyPaneTextField("listName", {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
