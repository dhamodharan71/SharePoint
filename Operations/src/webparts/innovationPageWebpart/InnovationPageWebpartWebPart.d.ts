import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from "@microsoft/sp-webpart-base";
export interface IInnovationPageWebpartWebPartProps {
    listName: string;
    siteUrl: string;
    currentloginuser: string;
    currentBrowser: string;
    clickHandler: () => void;
}
export default class InnovationPageWebpartWebPart extends BaseClientSideWebPart<IInnovationPageWebpartWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
