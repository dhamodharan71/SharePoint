import { SPHttpClient } from "@microsoft/sp-http";
export interface IInnovationPageWebpartProps {
    listName: string;
    siteUrl: string;
    spHttpClient: SPHttpClient;
    currentloginuser: string;
    currentBrowser: string;
}
