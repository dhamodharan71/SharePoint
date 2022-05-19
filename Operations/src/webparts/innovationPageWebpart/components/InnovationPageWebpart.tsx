import * as React from "react";
import styles from "./InnovationPageWebpart.module.scss";
import { IInnovationPageWebpartProps } from "./IInnovationPageWebpartProps";
import { escape } from "@microsoft/sp-lodash-subset";
import * as jquery from "jquery";
import { IListItem } from "./IListItem";
import { IInnovationPageWebpartState } from "./IInnovationPageWebpartState";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { render } from "react-dom";

export default class InnovationPageWebpart extends React.Component<IInnovationPageWebpartProps, IInnovationPageWebpartState> {
  [x: string]: any;
  constructor(props: IInnovationPageWebpartProps, state: IInnovationPageWebpartState) {
    super(props);
    this.state = {
      status: "Ready",
      items: [],
      currentItems: [],
      fileInput: []
    };
  }
  public componentDidMount(): void {
    var reactHandler: any = this;
    let leaders: any = "";
    jquery.ajax({
      url: `${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items` +
        `?$top=5000&$select=Title,IdeaStatus,Author/Title,Created,IdeaDescription,MainIdeaCategory,BusinessImpact,ROIImpact,YourOrganization,` +
        `YourGEO,Vote,View,Id,ViewedUsers,IdeaID,InnovationCoachAssigned,VotedUsers,Panelpresentation,CommentedUsers,` +
        `Loophasbeenclosed,Reasoning,Manager,Commented&$Expand=Author&$orderby=Id desc`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose;" },
      success: function (resultData: any): void {
        reactHandler.setState({
          items: resultData.d.results
        });
      },
      error: function (jqXHR: any): void {
        console.log("error");
      }
    });
    jquery.ajax({
      url: `${this.props.siteUrl}/_api/sp.userprofiles.peoplemanager/GetMyProperties`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose;" },
      success: function (userresultData: any): void {
        var userinfoId: any = userresultData.d.DisplayName;
        var userproperties: any = userresultData.d.UserProfileProperties.results;
        var rmName: any= userresultData.d.UserProfileProperties.results[15].Value;
        var logedinRMname: any = jquery("." + styles.loggedinRMId);
        var logedinRMname1: any = logedinRMname[0].innerText.substring(18,(logedinRMname[0].innerText).length).replace("@autodesk.com","").replace("."," ");
        jquery("." + styles.loggedinuserGeo).append(yourGEO);
        for (var i: any = 0; i < userproperties.length; i++) {
          var property: any = userproperties[i];
          if (property.Key === "GEO") {
            var yourGEO: any = property.Value;
            jquery("." + styles.loggedinuserGeo).append(yourGEO);
          }
          if (property.Key === "Department") {
            var yourOrg: any = property.Value;
            jquery("." + styles.loggedinuserOrg).append(yourOrg);
          }
          if (property.Key === "Manager") {
            var yourRM: any = property.Value;
            jquery("." + styles.loggedinRMId).append(yourRM);
          }
        }
        
        jquery("." + styles.loggedinuserId).append(userinfoId);
        
      },
      error: function (jqXHR: any): void {
        console.log("error");
      }
    });
    jquery.ajax({
      url: `${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/fields`,
      type: "GET",
      headers: { "Accept": "application/json; odata=verbose;" },
      success: function (resultData: any): void {
        var allcolumns: any = resultData.d.results;
        var options: any;
        for (var i: any = 0; i < allcolumns.length; i++) {
          if (allcolumns[i].TypeDisplayName === "Choice") {
            if (allcolumns[i].StaticName === "MainIdeaCategory") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#mainideaCategory").append(jquery(option));
              });
            }
            if (allcolumns[i].StaticName === "roiCategory") {
                options = allcolumns[i].Choices.results;
                options.forEach((element: string) => {
                  var option: any = new Option(element, element);
                  jquery("#roiCategory").append(jquery(option));
                });
              }
            if (allcolumns[i].StaticName === "TeamsAffectedbythisIdea") {
              options = allcolumns[i].Choices.results;
              for (var cb: any = 0; cb < options.length; cb++) {
                var cbox: any = "<div className=" + styles.CheckBoxDiv + ">" +
                  "<input type=checkbox name=Teamsoptions value='" + options[cb] + "'>" + options[cb] + "</input><div>";
                jquery("#teamsAffectedbyIdeaId").append(jquery(cbox));
              }
            }
            if (allcolumns[i].StaticName === "IdeaStatus") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#ideaStatusId").append(jquery(option));
              });
            }
            if (allcolumns[i].StaticName === "Loophasbeenclosed") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#loopclosedId").append(jquery(option));
              });
            }
            if (allcolumns[i].StaticName === "Panelpresentation") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#PanelpresentationId").append(jquery(option));
              });
            }
          }
        }
      },
      error: function (jqXHR: any): void {
        console.log("error");
      }
    });
    document.getElementById("NewIdeas").style.display = "block";
  }
  public closepopup(): void {
    var modal: any = document.getElementById("IdeaNewForm");
    modal.style.display = "none";
  }
  public closeLikespopup(): void {
    var modal: any = document.getElementById("IdeaLikesForm");
    modal.style.display = "none";
  }
  public closesearchpopup(): void {
    var modal: any = document.getElementById("IdeaSearchForm");
    modal.style.display = "none";
  }
  public closecommentspopup(): void {
    var modal: any = document.getElementById("IdeaCommentsForm");
    modal.style.display = "none";
  }
  public closecommentspopup1(): void {
    var modal: any = document.getElementById("IdeaAckForm");
    modal.style.display = "none";
  }
  public submitform(): void {
    var userGeo: any = jquery("." + styles.loggedinuserGeo)[0].innerText;
    var userOrg: any = jquery("." + styles.loggedinuserOrg)[0].innerText;
    var logedinRMname: any = jquery("." + styles.loggedinRMId);
    var logedinRMname1: any = logedinRMname[0].innerText.substring(18,(logedinRMname[0].innerText).length).replace("@autodesk.com","").replace("."," ");
    jquery("#mainideaCategory").find(":selected").attr("selected", false);
    jquery("#roiCategory").find(":selected").attr("selected", false);
    jquery("#budgetItemId").find(":selected").attr("selected", false);
    jquery("#idearProceedsId").find(":selected").attr("selected", false);
    jquery("#fastTrackid").find(":selected").attr("selected", false);
    jquery("#ideaStatusId").find(":selected").attr("selected", false);
    jquery("#loopclosedId").find(":selected").attr("selected", false);
    jquery("input[name='Teamsoptions']").prop("checked", false);
    jquery("#PanelpresentationId").find(":selected").attr("selected", false);
    jquery("#yourorg")[0].value = "";
    jquery("#yourgeo")[0].value = "";
    jquery("#yourRM")[0].value = "";
    jquery("#ideaTitleid")[0].value = "";
    jquery("#ideaDescid")[0].value = "";
    jquery("#businessImpactid")[0].value = "";
    jquery("#roiImpactid")[0].value = "";
    jquery("#otherstakeholdersid")[0].value = "";
    jquery("#resourceNeededId")[0].value = "";
    jquery("#roughItemId")[0].value = "";
    jquery("#reasoningId")[0].value = "";
    jquery("#innovationCoachId")[0].value = "";
    jquery("#ActionsCompletedId")[0].value = "";
    jquery("#RoadblocksId")[0].value = "";
    jquery("#NextstepsId")[0].value = "";
    jquery("#EstimatedcompletionId")[0].value = "";
    jquery("#NotesCommentsId")[0].value = "";
    jquery("#PresentationDate")[0].value = "";

    jquery("#yourorg")[0].value = userOrg;
    jquery("#yourgeo")[0].value = userGeo;
    jquery("#yourRM")[0].value = logedinRMname1;
    jquery("." + styles.existingFiles).empty();

    jquery("." + styles.editDataButton).css("display", "none");
    jquery("." + styles.Editcontrols).css("display", "none");
    jquery("." + styles.leadersControls).css("display", "none");
    jquery("." + styles.submitDataButton).css("display", "block");
    jquery("." + styles.UserControls).css("pointer-events", "visible");
    jquery("textarea").css("pointer-events", "visible");
    jquery("textarea").removeAttr("disabled");
    jquery("." + styles.currentitemId).empty();

    var modal: any = document.getElementById("IdeaAckForm");
    modal.style.display = "none";

    var modal: any = document.getElementById("IdeaNewForm");
    window.document.getElementById("IdeaNewForm").style.display = "block";
  }

  public ackForm(): void {
    jquery("." + styles.UserControls).css("pointer-events", "visible");
    var modal: any = document.getElementById("IdeaAckForm");
    window.document.getElementById("IdeaAckForm").style.display = "block";
  }
  public searchBar(authorevt: any): void {
    var reactHandler: any = this;
    var searchbox: any = jquery("." + styles.searchBar);
    var searchKey: any = searchbox[0].value;
    if (searchKey !== "") {
      if(((searchKey.search('Idea #'))=="0")||((searchKey.search('Idea#'))=="0")){
        searchKey = searchKey.substring(6, searchKey.length);
      }
      
      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')` +
      `/items?$top=5000&&$expand=Author&$filter=(substringof('${searchKey}',Title) or substringof('${searchKey}',Author/Title) or substringof('${searchKey}',IdeaID) or (IdeaStatus eq '${searchKey}') or` +
      ` substringof('${searchKey}',MainIdeaCategory) or substringof('${searchKey}',YourOrganization) or` +
      ` substringof('${searchKey}',YourGEO))&$select=Title,` +
      `IdeaStatus,IdeaID,Author/Title,Created,IdeaDescription,MainIdeaCategory,BusinessImpact,ROIImpact,YourOrganization,YourGEO,` +
      `Vote,View,Id,ViewedUsers,VotedUsers,CommentedUsers,Commented&$Expand=Author&$orderby=Id desc`,

        SPHttpClient.configurations.v1,
        {
          headers: {
            "Accept": "application/json;odata=nometadata",
            "odata-version": ""
          }
        })
        .then((response: SPHttpClientResponse): Promise<IListItem> => {
          return response.json();
        }).then((item: any): void => {
          reactHandler.setState({
            currentItems: item.value
          });
          window.document.getElementById("IdeaSearchForm").style.display = "block";
        }, (error: any): void => {
          console.log("views not updated ");
        });
    } else {
      alert("Please enter some keywords");
    }
  }
  public htmlDecode(input: any): any {
    var e: any = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
  public opencontentItems(evt: any): any {
    var i: any, tabcontent: any, tablinks: any;
    var cityName: any = evt.target.textContent.replace(/ /g, "");
    tabcontent = jquery("." + styles.tabcontent);
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = jquery("." + styles.tablinks);
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" " + styles.active, "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " " + styles.active;
  }
  public sortbyVoting(voteevt: any): any {
    var voteclassNames: any = voteevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var ttt: any = jquery(a).find("." + styles.ideaViewDiv).find("." + styles.ideaitemTitle);
      console.log(jquery(a).find("." + styles.ideaViewDiv).find("." + styles.ideaitemTitle)[0].innerText);
      var textA: any = +jquery(a).find("." + styles.ideaVoteDiv).find("." + styles.ideaitemTitle)[0].innerText;
      var textB: any = +jquery(b).find("." + styles.ideaVoteDiv).find("." + styles.ideaitemTitle)[0].innerText;
      if (textA < textB) { return 1; }
      if (textA > textB) { return -1; }
      return 0;
    });
    if (voteclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      voteevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      voteevt.target.classList.remove("descending");
    }
  }
  public sortbyViews(voteevt: any): any {
    var voteclassNames: any = voteevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var textA: any = +jquery(a).find("." + styles.ideaViewDiv).find("." + styles.ideaitemTitle).text();
      var textB: any = +jquery(b).find("." + styles.ideaViewDiv).find("." + styles.ideaitemTitle).text();
      if (textA < textB) { return 1; }
      if (textA > textB) { return -1; }
      return 0;
    });
    if (voteclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      voteevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      voteevt.target.classList.remove("descending");
    }
  }
//Edited By Damu
  public sortbyideanumber(numberevt: any): any {
    var authorclassNames: any = numberevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
  //  var firstText: any = (jquery(a).find("." + styles.ideaNumberDiv)[0].innerText).substring(6, (jquery(a).find("." + styles.ideaNumberDiv)[0].innerText).length);
    //  var secondText: any = (jquery(b).find("." + styles.ideaNumberDiv)[1].innerText).substring(6, (jquery(a).find("." + styles.ideaNumberDiv)[1].innerText).length);
  
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
     // var textA: any = +jquery(a).find("." + styles.ideaNumberDiv).find("." + styles.ideaNumberDiv).text();
     // var textB: any = +jquery(b).find("." + styles.ideaNumberDiv).find("." + styles.ideaNumberDiv).text();

      var textA: any = (jquery(a).find("." + styles.ideaNumberDiv).find("." + styles.ideaNumberDiv).text()).substring(6, (jquery(a).find("." + styles.ideaNumberDiv).text()).length);
      var textB: any = (jquery(b).find("." + styles.ideaNumberDiv).find("." + styles.ideaNumberDiv).text()).substring(6, (jquery(b).find("." + styles.ideaNumberDiv).text()).length);
  
      if (textA < textB) { return 1; }
      if (textA > textB) { return -1; }
      return 0;
    });
    if (authorclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      numberevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      numberevt.target.classList.remove("descending");
    }
  }
  //
  public sortbycomments(voteevt: any): any {
    var voteclassNames: any = voteevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var textA: any = +jquery(a).find("." + styles.ideaCommentDiv).find("." + styles.ideaitemTitle).text();
      var textB: any = +jquery(b).find("." + styles.ideaCommentDiv).find("." + styles.ideaitemTitle).text();
      if (textA < textB) { return 1; }
      if (textA > textB) { return -1; }
      return 0;
    });
    if (voteclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      voteevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      voteevt.target.classList.remove("descending");
    }
  }
  public parseDate(input: any): any {
    var parts: any = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]); //     months are 0-based
  }
  public sortbyDate(dateevt: any): any {
    var dateclassNames: any = dateevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var firstDate: any = jquery(a).find("." + styles.ideaDateDiv).text();
      var secondDate: any = jquery(b).find("." + styles.ideaDateDiv).text();
      return firstDate > secondDate ? -1 : firstDate < secondDate ? 1 : 0;
    });
    if (dateclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      dateevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      dateevt.target.classList.remove("descending");
    }
  }
  public sortbyAuthor(authorevt: any): any {
    var authorclassNames: any = authorevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var firstText: any = jquery(a).find("." + styles.ideaAuthorDiv)[0].innerText;
      var secondText: any = jquery(b).find("." + styles.ideaAuthorDiv)[0].innerText;
      return firstText.localeCompare(secondText.toUpperCase());
    });
    if (authorclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      authorevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      authorevt.target.classList.remove("descending");
    }
  }
  public sortbyCoach(coachevt: any): any {
    var authorclassNames: any = coachevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var firstText: any = jquery(a).find("." + styles.ideaCoachDiv)[0].innerText;
      var secondText: any = jquery(b).find("." + styles.ideaCoachDiv)[0].innerText;
      return firstText.localeCompare(secondText.toUpperCase());
    });
    if (authorclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      coachevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      coachevt.target.classList.remove("descending");
    }
  }
  public sortbyideanumber1(numberevt: any): any {
    var authorclassNames: any = numberevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var firstText: any = (jquery(a).find("." + styles.ideaNumberDiv)[0].innerText).substring(6, (jquery(a).find("." + styles.ideaNumberDiv)[0].innerText).length);
      var secondText: any = (jquery(b).find("." + styles.ideaNumberDiv)[1].innerText).substring(6, (jquery(a).find("." + styles.ideaNumberDiv)[1].innerText).length);
      return firstText.localeCompare(secondText.toUpperCase());
    });
    if (authorclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      numberevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      numberevt.target.classList.remove("descending");
    }
  }
  public sortbyOrg(authorevt: any): any {
    var authorclassNames: any = authorevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var firstText: any = jquery(a).find("." + styles.ideaOrgDiv)[0].innerText;
      var secondText: any = jquery(b).find("." + styles.ideaOrgDiv)[0].innerText;
      return firstText.localeCompare(secondText.toUpperCase());
    });
    if (authorclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      authorevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      authorevt.target.classList.remove("descending");
    }
  }
  public sortbyGEO(authorevt: any): any {
    var authorclassNames: any = authorevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var firstText: any = jquery(a).find("." + styles.ideaGeoDiv)[0].innerText;
      var secondText: any = jquery(b).find("." + styles.ideaGeoDiv)[0].innerText;
      return firstText.localeCompare(secondText.toUpperCase());
    });
    if (authorclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      authorevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      authorevt.target.classList.remove("descending");
    }
  }
  public comparer(index: any): any {
    return function (a: any, b: any): any {
      var valA: any = this.getCellValue(a, index), valB: any = this.getCellValue(b, index);
      return jquery.isNumeric(valA) && jquery.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
    };
  }
  public getCellValue(row: any, index: any): any {
    return jquery(row).children("td").eq(index).text();
  }
  private updateIdealikes(likeEvt: any): any {
    var currentItemIdvalue: any = likeEvt.target.parentElement.parentElement.parentElement.firstElementChild.innerText;
    var currentlogedinuser: any = jquery("." + styles.loggedinuserId)[0].innerText;
    var finalusersarray: any = "";
    var isuserVoted: boolean = false;
    var itemResult: any = ""; var dispVotes: any = "";
    var existingvotes: any = "";
    var allVotes: any = "";
    var allusers: any = "";
    var allusersComments: any = "";
    var finalusers: any = "";
    var userarray: any = "";
    var body: any = "";
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')` +
      `/items('${currentItemIdvalue}')`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "Accept": "application/json;odata=nometadata",
          "odata-version": ""
        }
      })
      .then((response: SPHttpClientResponse): Promise<IListItem> => {
        return response.json();
      }).then((item: any): void => {
        if (item.VotedUsers !== null) {
          var votedusers: any = item.VotedUsers.split(",");
          finalusersarray = this.uniqueItems(votedusers);
          for (var i: any = 0; i < finalusersarray.length; i++) {
            if (finalusersarray[i] === currentlogedinuser) {
              isuserVoted = true;
            }
          }
          if (isuserVoted) {
            dispVotes = item.Vote;
            if (dispVotes === null) {
              dispVotes = 0;
            }
            existingvotes = parseInt(dispVotes, 10);
            allVotes = existingvotes - 1;
            var index: any = finalusersarray.indexOf(currentlogedinuser);
            if (index > -1) {
              finalusersarray.splice(index, 1);
            }
            body = JSON.stringify({
              "Vote": `${allVotes}`,
              "VotedUsers": `${finalusersarray}`
            });
            this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/` +
              `items(${currentItemIdvalue})`,
              SPHttpClient.configurations.v1,
              {
                headers: {
                  "Accept": "application/json;odata=nometadata",
                  "Content-type": "application/json;odata=nometadata",
                  "odata-version": "",
                  "IF-MATCH": "*",
                  "X-HTTP-Method": "MERGE"
                },
                body: body
              })
              .then((response: SPHttpClientResponse): void => {
                alert("You have successfully removed your vote for this idea.");
                document.location.reload(true);
              }, (error: any): void => {
                console.log("votes not updated " + allVotes);
              });
            jquery("." + styles.currentLikesitemId).empty();
            jquery("." + styles.currentLikesitemId).append(currentItemIdvalue);
          } else {
            itemResult = item;
            dispVotes = itemResult.Vote;
            if (dispVotes === null) {
              dispVotes = 0;
            }
            existingvotes = parseInt(dispVotes, 10);
            allVotes = existingvotes + 1;
            allusers = itemResult.VotedUsers;
            if (allusers === null) {
              allusers = "";
            }
            allusersComments = itemResult.Comments;
            if (allusersComments === null) {
              allusersComments = "";
            }
            finalusers = currentlogedinuser + "," + allusers;
            userarray = finalusers.split(",");
            finalusersarray = this.uniqueItems(userarray);
            body = JSON.stringify({
              "Vote": `${allVotes}`,
              "VotedUsers": `${finalusersarray}`
            });
            this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/` +
              `items(${currentItemIdvalue})`,
              SPHttpClient.configurations.v1,
              {
                headers: {
                  "Accept": "application/json;odata=nometadata",
                  "Content-type": "application/json;odata=nometadata",
                  "odata-version": "",
                  "IF-MATCH": "*",
                  "X-HTTP-Method": "MERGE"
                },
                body: body
              })
              .then((response: SPHttpClientResponse): void => {
                alert("Thank you for casting your vote on this idea.");
                document.location.reload(true);
              }, (error: any): void => {
                console.log("views not updated " + allVotes);
              });
            jquery("." + styles.currentLikesitemId).empty();
            jquery("." + styles.currentLikesitemId).append(currentItemIdvalue);
          }
        } else {
          itemResult = item;
          dispVotes = itemResult.Vote;
          if (dispVotes === null) {
            dispVotes = 0;
          }
          existingvotes = parseInt(dispVotes, 10);
          allVotes = existingvotes + 1;
          allusers = itemResult.VotedUsers;
          if (allusers === null) {
            allusers = "";
          }
          allusersComments = itemResult.Comments;
          if (allusersComments === null) {
            allusersComments = "";
          }
          finalusers = currentlogedinuser + "," + allusers;
          userarray = finalusers.split(",");
          finalusersarray = this.uniqueItems(userarray);
          body = JSON.stringify({
            "Vote": `${allVotes}`,
            "VotedUsers": `${finalusersarray}`
          });
          this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/` +
            `items(${currentItemIdvalue})`,
            SPHttpClient.configurations.v1,
            {
              headers: {
                "Accept": "application/json;odata=nometadata",
                "Content-type": "application/json;odata=nometadata",
                "odata-version": "",
                "IF-MATCH": "*",
                "X-HTTP-Method": "MERGE"
              },
              body: body
            })
            .then((response: SPHttpClientResponse): void => {
              alert("Thank you for casting your vote on this idea.");
              document.location.reload(true);
            }, (error: any): void => {
              console.log("views not updated " + allVotes);
            });
          jquery("." + styles.currentLikesitemId).empty();
          jquery("." + styles.currentLikesitemId).append(currentItemIdvalue);
        }
      }, (error: any): void => {
        console.log("Likes not updated ");
      });
  }
  private openIdeacomments(chatEvt: any): any {
    var currentItemIdvalue: any = chatEvt.target.parentElement.parentElement.parentElement.firstElementChild.innerText;
    jquery("." + styles.currentcommentsitemId).empty();
    jquery("#userComments")[0].value = "";
    jquery("." + styles.currentcommentsitemId).append(currentItemIdvalue);
    var modal: any = document.getElementById("IdeaCommentsForm");
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')` +
      `/items('${currentItemIdvalue}')`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "Accept": "application/json;odata=nometadata",
          "odata-version": ""
        }
      })
      .then((response: SPHttpClientResponse): Promise<IListItem> => {
        return response.json();
      }).then((item: any): void => {
        var alluserscomments: any = item.Comments;
        jquery("." + styles.allComments)[0].innerHTML = alluserscomments;
        jquery("." + styles.currentLikesitemId).append(currentItemIdvalue);
        window.document.getElementById("IdeaCommentsForm").style.display = "block";
      }, (error: any): void => {
        console.log("views not updated ");
      });
  }
  private openideaItem(itmEvt: any): any {
    var currentItemIdvalue: any = itmEvt.target.parentElement.previousElementSibling.innerText;
    var itemOwner: any = itmEvt.target.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
    jquery("." + styles.allComments)[0].innerHTML = "";
    var presentTag: any = itmEvt.target.parentElement.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
    return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')` +
      `/items('${currentItemIdvalue}')?$select=Title,IdeaStatus,AttachmentFiles,Author/Title,IdeaDescription,TeamsAffected,` +
      `MainIdeaCategory,ResourcesNeeded,OtherStakeholderscurrentlyinvolv,RoughTimeIndication,Roadblocks,EstimatedCompletion,` +
      `OwnerComments,Fasttrack,Ideaproceedstonextstage,presentationDate,expiryDate,implementationDate,BudgetItem,` +
      `YourGEO,Vote,View,Id,ViewedUsers,IdeaID,InnovationCoachAssigned,VotedUsers,Panelpresentation,Created,Modified,CommentedUsers,` +
      `Loophasbeenclosed,BusinessImpact,ROIImpact,YourOrganization,Nextsteps,Reasoning,ActionsCompleted,Manager,Commented&$Expand=Author,AttachmentFiles`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "Accept": "application/json;odata=nometadata",
          "odata-version": ""
        }
      })
      .then((response: SPHttpClientResponse): Promise<IListItem> => {
        return response.json();
      })
      .then((item: any): void => {
        var itemResult: any = item;
        var dispTitle: any = itemResult.Title;
        var dispOrg: any = itemResult.YourOrganization;
        var dispGeo: any = itemResult.YourGEO;
        var dispDesc: any = itemResult.IdeaDescription;
        var dispBImpact: any = itemResult.BusinessImpact;
        var dispROIImpact: any = itemResult.ROIImpact;
        var dispMIC: any = itemResult.MainIdeaCategory;
        var dispROIC: any = itemResult.roiCategory;
        var dispOSCI: any = itemResult.OtherStakeholderscurrentlyinvolv;
        var dispTABTI: any = itemResult.TeamsAffected;
        var dispresorcesNeeded: any = itemResult.ResourcesNeeded;
        var dispBitem: any = itemResult.BudgetItem;
        var dispRTI: any = itemResult.RoughTimeIndication;
        var dispIPTNS: any = itemResult.Ideaproceedstonextstage;
        var dispReasoning: any = itemResult.Reasoning;
        var dispICA: any = itemResult.InnovationCoachAssigned;
        var dispFastTrack: any = itemResult.Fasttrack;
        var dispIdeaStatus: any = itemResult.IdeaStatus;
        var LoophasbeenclosedStatus: any = itemResult.Loophasbeenclosed;
        var panelpresentaion: any = itemResult.Panelpresentation;
        var prvviews: any = itemResult.View;
        var dispActionscompleted: any = itemResult.ActionsCompleted;
        var dispRoadblocks: any = itemResult.Roadblocks;
        var dispNextsteps: any = itemResult.Nextsteps;
        var dispEstimatedCompletion: any = itemResult.EstimatedCompletion;
        var dispOwnerComments: any = itemResult.OwnerComments;
        var dispResolved: any = itemResult.Resolved;
        var dispManager: any = itemResult.Manager;
        var currentpresentationDate: any = itemResult.presentationDate;
        var currentExpiryDate: any = itemResult.expiryDate;
        var currentImplementationDate: any = itemResult.implementationDate;
        var lasteditedDate: any = itemResult.Modified.split("T")[0];
        var existfiles: any = itemResult.AttachmentFiles;
        jquery("." + styles.existingFiles).empty();
        existfiles.forEach(existfile => {
          var exifilename: any = existfile.FileName;
          var exisfileurl: any = existfile.ServerRelativeUrl;
          var filehtml: any = `<a href='${exisfileurl}' download>${exifilename}</a><br/>`;
          jquery("." + styles.existingFiles).append(filehtml);
          // <div dangerouslySetInnerHTML={{ __html: uniqueVoters }} />
        });
        if (prvviews === null) {
          prvviews = 0;
        }
        var presentViews: any = parseInt(prvviews, 10);
        var allviews: any = presentViews + 1;
        var allusers: any = itemResult.ViewedUsers;
        if (allusers === null) {
          allusers = "";
        }
        var logedinuser: any = jquery("." + styles.loggedinuserId)[0].innerText;
        var finalusers: any = allusers + logedinuser + ",";
        if (panelpresentaion === "Completed" || panelpresentaion === "Scheduled") {
          jquery("#PresentationDate").css("display", "block");
        } else {
          jquery("#PresentationDate").css("display", "none");
        }
        jquery("input[name='Resolved']").prop("checked", false);
        jquery("input[name='Teamsoptions']").prop("checked", false);
        jquery("#mainideaCategory").find(":selected").attr("selected", false);
        jquery("#roiCategory").find(":selected").attr("selected", false);
        jquery("#budgetItemId").find(":selected").attr("selected", false);
        jquery("#idearProceedsId").find(":selected").attr("selected", false);
        jquery("#fastTrackid").find(":selected").attr("selected", false);
        jquery("#ideaStatusId").find(":selected").attr("selected", false);
        jquery("#loopclosedId").find(":selected").attr("selected", false);
        jquery("#PanelpresentationId").find(":selected").attr("selected", false);
        jquery("#yourorg").find("option[value='" + dispOrg + "']").attr("selected", "selected");
        jquery("#yourgeo").find("option[value='" + dispGeo + "']").attr("selected", "selected");
        jquery("#mainideaCategory").find("option[value='" + dispMIC + "']").attr("selected", "selected");
        jquery("#roiCategory").find("option[value='" + dispROIC + "']").attr("selected", "selected");
        jquery("#budgetItemId").find("option[value='" + dispBitem + "']").attr("selected", "selected");
        jquery("#idearProceedsId").find("option[value='" + dispIPTNS + "']").attr("selected", "selected");
        jquery("#fastTrackid").find("option[value='" + dispFastTrack + "']").attr("selected", "selected");
        jquery("#ideaStatusId").find("option[value='" + dispIdeaStatus + "']").attr("selected", "selected");
        jquery("#loopclosedId").find("option[value='" + LoophasbeenclosedStatus + "']").attr("selected", "selected");
        jquery("#PanelpresentationId").find("option[value='" + panelpresentaion + "']").attr("selected", "selected");
        jquery("." + styles.submittedDate).empty();

        jquery("#yourorg")[0].value = "";
        jquery("#yourgeo")[0].value = "";
        jquery("#ideaTitleid")[0].value = "";
        jquery("#ideaDescid")[0].value = "";
        jquery("#businessImpactid")[0].value = "";
        jquery("#roiImpactid")[0].value = "";
        jquery("#otherstakeholdersid")[0].value = "";
        jquery("#resourceNeededId")[0].value = "";
        jquery("#roughItemId")[0].value = "";
        jquery("#reasoningId")[0].value = "";
        jquery("#innovationCoachId")[0].value = "";
        jquery("#ActionsCompletedId")[0].value = "";
        jquery("#RoadblocksId")[0].value = "";
        jquery("#NextstepsId")[0].value = "";
        jquery("#EstimatedcompletionId")[0].value = "";
        jquery("#NotesCommentsId")[0].value = "";
        jquery("#PresentationDate")[0].value = "";
        jquery("#yourRM")[0].value = "";

        jquery("#yourorg")[0].value = dispOrg;
        jquery("#yourgeo")[0].value = dispGeo;
        jquery("#yourRM")[0].value = dispManager;
        jquery("#ideaTitleid")[0].value = dispTitle;
        jquery("#ideaDescid")[0].value = dispDesc;
        jquery("#businessImpactid")[0].value = dispBImpact;
        jquery("#roiImpactid")[0].value = dispROIImpact;
        jquery("#otherstakeholdersid")[0].value = dispOSCI;
        jquery("#resourceNeededId")[0].value = dispresorcesNeeded;
        jquery("#roughItemId")[0].value = dispRTI;
        jquery("#reasoningId")[0].value = dispReasoning;
        jquery("#innovationCoachId")[0].value = dispICA;
        jquery("#ActionsCompletedId")[0].value = dispActionscompleted;
        jquery("#RoadblocksId")[0].value = dispRoadblocks;
        jquery("#NextstepsId")[0].value = dispNextsteps;
        jquery("#EstimatedcompletionId")[0].value = dispEstimatedCompletion;
        jquery("#NotesCommentsId")[0].value = dispOwnerComments;
        jquery("#PresentationDate")[0].value = currentpresentationDate;
        jquery("#expiryDate")[0].value = currentExpiryDate;
        jquery("#implementationDate")[0].value = currentImplementationDate;
        
        jquery("." + styles.submittedDate).append(lasteditedDate);
        if (dispTABTI !== null) {
          var checkteamsEffected: any = dispTABTI.split(";");
          checkteamsEffected.forEach(element => {
            var val: any = element;
            jquery("input[value='" + val + "']").prop("checked", true);
          });
        }
        if (dispResolved === "Yes") {
          jquery("input[name='Resolved']").prop("checked", true);
        }
        jquery("." + styles.currentitemId).empty();
        jquery("." + styles.currentitemId).append(currentItemIdvalue);
        jquery("." + styles.currentitemOwner).empty();
        jquery("." + styles.currentitemOwner).append(itemOwner);
        
        jquery("." + styles.submitDataButton).css("display", "none");
        jquery("." + styles.editDataButton).css("display", "block");
        jquery("." + styles.Editcontrols).css("display", "block");
        jquery("." + styles.existingFiles).css("display", "block");
        jquery("." + styles.leadersControls).css("display", "block");
        jquery("." + styles.UserControls).css("pointer-events", "none");
        jquery("textarea").css("pointer-events", "visible");
        jquery("textarea").prop("disabled", "disabled");
        jquery("." + styles.Editcontrols).css("pointer-events", "none");
        jquery("." + styles.leadersControls).css("pointer-events", "none");
        jquery("." + styles.leadersControls).css("opacity", 0.5);
        var modal: any = document.getElementById("IdeaNewForm");
        window.document.getElementById("IdeaNewForm").style.display = "block";
        var userarray: any = finalusers.split(",");
        var finalusersarray: any = this.uniqueItems(userarray);
        jquery("." + styles.editDataButton).prop("disabled", true).css("opacity", 0.5);
        if (logedinuser === itemOwner) {
          jquery("." + styles.editDataButton).prop("disabled", false).css("opacity", "");
          //jquery("." + styles.UserControls).css("pointer-events", "block");

        }
        this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('InnovationLeaders')` +
          `/items?$select=Leader/Title&$Expand=Leader&$top=5000`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              "Accept": "application/json;odata=nometadata",
              "odata-version": ""
            }
          })
          .then((response: SPHttpClientResponse): Promise<IListItem> => {
            return response.json();
          })
          .then((item: any): void => {
            for (var i: any = 0; i < item.value.length; i++) {
              if (item.value[i].Leader.Title === logedinuser) {
                jquery("." + styles.editDataButton).prop("disabled", false).css("opacity", "");
              }
            }
          });
        //var ideaViewed: any =0;
        var body: any = JSON.stringify({
          "View": `${allviews}`,
          "ViewedUsers": `${finalusersarray}`
          //"ideaEdited": `${ideaViewed}`
        });
        this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.Id})`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              "Accept": "application/json;odata=nometadata",
              "Content-type": "application/json;odata=nometadata",
              "odata-version": "",
              "IF-MATCH": "*",
              "X-HTTP-Method": "MERGE"
            },
            body: body
          })
          .then((response: SPHttpClientResponse): void => {
            console.log("views updated " + allviews);
            presentTag.children[1].innerText = allviews;
          }, (error: any): void => {
            console.log("views not updated " + allviews);
          });
      });
  }
  private uniqueItems(list: any): any {
    var result: any = [];
    jquery.each(list, function (i: any, e: any): any {
      if (jquery.inArray(e, result) === -1) {
        result.push(e);
      }
    });
    return result;
  }
  private editItemData(editevt: any): any {
    jquery("#PanelpresentationId").on("change", function (): any {
      if (this.value === "Completed" || this.value === "Scheduled") {
        jquery("#PresentationDate").css("display", "block");
      } else {
        jquery("#PresentationDate").css("display", "none");
      }
    });
    jquery("." + styles.UserControls).css("pointer-events", "none");
    var logedinuser: any = jquery("." + styles.loggedinuserId)[0].innerText;
    var currentItemOwner: any = jquery("." + styles.currentitemOwner)[0].innerText;
    if (logedinuser === currentItemOwner) {
      jquery("." + styles.UserControls).css("display", "block");
      jquery("." + styles.UserControls).css("pointer-events", "visible");
      jquery("." + styles.editDataButton).css("display", "block");
      jquery("." + styles.submitDataButton).css("display", "none");
      jquery("." + styles.Editcontrols).css("pointer-events", "visible");
      jquery("." + styles.existingFiles).css("pointer-events", "visible");
      jquery("#businessImpactid").removeAttr("disabled");
      jquery("#roiImpactid").removeAttr("disabled");
      jquery("#mainideaCategory").prop('disabled', true);
      jquery("#roiCategory").prop('disabled', true);
      jquery("#yourgeo").removeAttr("disabled");
      jquery("#resourceNeededId").removeAttr("disabled");
      jquery("#ActionsCompletedId").removeAttr("disabled");
      jquery("#EstimatedcompletionId").removeAttr("disabled");
      jquery("#PanelpresentationId").removeAttr("disabled");
      jquery("#RoadblocksId").removeAttr("disabled");
      jquery("#reasoningId").removeAttr("disabled");
      jquery("#NextstepsId").removeAttr("disabled");
      jquery("#NotesCommentsId").removeAttr("disabled");
      jquery("." + styles.leadersControls).css("display", "none");
      jquery("." + styles.leadersControls).css("pointer-events", "none");
      jquery("." + styles.leadersControls).css("opacity", 0.5);
      jquery("." + styles.editDataButton).css("display", "none");
      jquery("." + styles.submitDataButton).css("display", "block");
      jquery("#yourorg").prop('disabled', true);
      jquery("#ideaTitleid").prop('disabled', true);
      
      // jquery("." + styles.editDataButton).css("display", "none");
      // jquery("." + styles.submitDataButton).css("display", "block");
      // jquery("." + styles.Editcontrols).css("pointer-events", "visible");
      // jquery("." + styles.existingFiles).css("pointer-events", "visible");
      // jquery("#ActionsCompletedId").removeAttr("disabled");
      // jquery("#RoadblocksId").removeAttr("disabled");
      // jquery("#reasoningId").removeAttr("disabled");
      // jquery("#NextstepsId").removeAttr("disabled");
      // jquery("#NotesCommentsId").removeAttr("disabled");
      // jquery("." + styles.leadersControls).css("display", "block");
      // jquery("." + styles.leadersControls).css("pointer-events", "none");
      // jquery("." + styles.leadersControls).css("opacity", 0.5);
    }
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('InnovationLeaders')` +
      `/items?$select=Leader/Title&$Expand=Leader&$top=5000`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "Accept": "application/json;odata=nometadata",
          "odata-version": ""
        }
      })
      .then((response: SPHttpClientResponse): Promise<IListItem> => {
        return response.json();
      })
      .then((item: any): void => {
        for (var i: any = 0; i < item.value.length; i++) {
          if (item.value[i].Leader.Title === logedinuser) {
           
            jquery("." + styles.UserControls).css("display", "block");
            jquery("." + styles.UserControls).css("pointer-events", "visible");
            jquery("." + styles.editDataButton).css("display", "none");
            jquery("." + styles.submitDataButton).css("display", "block");
            jquery("." + styles.Editcontrols).css("pointer-events", "visible");
            jquery("." + styles.existingFiles).css("pointer-events", "visible");
            jquery("#businessImpactid").removeAttr("disabled");
            jquery("#roiImpactid").removeAttr("disabled");
            jquery("#yourgeo").removeAttr("disabled");
            jquery("#reasoningId").removeAttr("disabled");
            jquery("#resourceNeededId").removeAttr("disabled");
            jquery("#NextstepsId").removeAttr("disabled");
            jquery("#NotesCommentsId").removeAttr("disabled");
            jquery("." + styles.leadersControls).css("display", "block");
            jquery("." + styles.leadersControls).css("pointer-events", "visible");
            jquery("." + styles.leadersControls).css("opacity", "");
            jquery("#RoadblocksId").removeAttr("disabled");
            jquery("#ActionsCompletedId").removeAttr("disabled");
            jquery("#resourceNeededId").removeAttr("disabled");
            jquery("#businessImpactid").removeAttr("disabled");
            jquery("#roiImpactid").removeAttr("disabled");
            jquery("#mainideaCategory").prop('disabled', true);
            jquery("#roiCategory").prop('disabled', true);
            jquery("#EstimatedcompletionId").removeAttr("disabled");
            jquery("#PanelpresentationId").removeAttr("disabled");
            jquery("#NotesCommentsId").removeAttr("disabled");
            jquery("#yourorg").prop('disabled', true);
            jquery("#ideaTitleid").prop('disabled', true);
          }
        }
      });
  }
  private submitData(): void {
    var logedinuser: any = jquery("." + styles.loggedinuserId)[0].innerText;
    var logedinRMname: any = jquery("." + styles.loggedinRMId);
    var logedinRMname1: any = logedinRMname[0].innerText.substring(18,(logedinRMname[0].innerText).length).replace("@autodesk.com","").replace("."," ");
    var fileInput: any = jquery("#ideafile");
    var fileName: any = jquery("#ideafile")[0].value.split("\\").pop();
    var isFileAttached: any = fileInput[0].value.length;
    var isitemid: any = jquery("." + styles.currentitemId).text();
    var yourorganization: any = jquery("#yourorg")[0].value;
    var yourGeo: any = jquery("#yourgeo")[0].value;
    var ideaTitle: string = jquery("#ideaTitleid")[0].value;
    var ideaDesc: string = jquery("#ideaDescid")[0].value;
    var businessImpact: any = jquery("#businessImpactid")[0].value;
    var roiImpact: any = jquery("#roiImpactid")[0].value;
    var mainIdeaCategory: any = jquery("#mainideaCategory").find(":selected").text();
    var roiCategory: any = jquery("#roiCategory").find(":selected").text();
    var otherStakeholders: any = jquery("#otherstakeholdersid")[0].value;
    var TeamsAffected: any = [];
    jquery.each(jquery("input[name='Teamsoptions']:checked"), function (): any {
      TeamsAffected.push(jquery(this).val());
    });
    TeamsAffected = TeamsAffected.join(";");
    var resourceNeeded: any = jquery("#resourceNeededId")[0].value;
    var budgetItem: any = jquery("#budgetItemId").find(":selected").text();
    var roughTimeIndication: any = jquery("#roughItemId")[0].value;
    var ideaProceeds: any = jquery("#idearProceedsId").find(":selected").text();
    var reasoning: any = jquery("#reasoningId")[0].value;
    var innovationCoach: any = jquery("#innovationCoachId")[0].value;
    var fastTrack: any = jquery("#fastTrackid").find(":selected").text();
    var ideaStaus: any = jquery("#ideaStatusId").find(":selected").text();
    var loopclosed: any = jquery("#loopclosedId").find(":selected").text();
    var panelPresentation: any = jquery("#PanelpresentationId").find(":selected").text();
    var actionsCompleted: any = jquery("#ActionsCompletedId")[0].value;
    var roadblocks: any = jquery("#RoadblocksId")[0].value;
    var nextSteps: any = jquery("#NextstepsId")[0].value;
    var estimatedCompletion: any = jquery("#EstimatedcompletionId")[0].value;
    var notesComments: any = jquery("#NotesCommentsId")[0].value;
    var resolved: any = jquery("input[name='Resolved']:checked").val();
    var presentationDate: any = jquery("#PresentationDate")[0].value;
    var expiryDate: any = jquery("#expiryDate")[0].value;
    var implementationDate: any = jquery("#implementationDate")[0].value;
    var ideaViewed: any =1;
    if (yourorganization === "" || yourGeo === "" || ideaTitle === "" || ideaDesc === "" ||
      mainIdeaCategory === "" || roiCategory === "" || roiImpact ==="" || businessImpact === "" || TeamsAffected === "" ||
      roughTimeIndication === "" || resourceNeeded === "" || budgetItem === ""|| otherStakeholders ==="") {
      alert("Please fill in all mandatory fields.");
    } else {
      var body: any = JSON.stringify({
        "YourOrganization": `${yourorganization}`,
        "Title": `${ideaTitle}`,
        "IdeaDescription": `${ideaDesc}`,
        "YourGEO": `${yourGeo}`,
        "BusinessImpact": `${businessImpact}`,
        "ROIImpact": `${roiImpact}`,
        "MainIdeaCategory": `${mainIdeaCategory}`,
        "roiCategory": `${roiCategory}`,
        "OtherStakeholderscurrentlyinvolv": `${otherStakeholders}`,
        "TeamsAffected": `${TeamsAffected}`,
        "ResourcesNeeded": `${resourceNeeded}`,
        "BudgetItem": `${budgetItem}`,
        "RoughTimeIndication": `${roughTimeIndication}`,
        "Ideaproceedstonextstage": `${ideaProceeds}`,
        "Reasoning": `${reasoning}`,
        "InnovationCoachAssigned": `${innovationCoach}`,
        "Fasttrack": `${fastTrack}`,
        "IdeaStatus": `${ideaStaus}`,
        "ActionsCompleted": `${actionsCompleted}`,
        "Roadblocks": `${roadblocks}`,
        "Nextsteps": `${nextSteps}`,
        "EstimatedCompletion": `${estimatedCompletion}`,
        "OwnerComments": `${notesComments}`,
        "Resolved": `${resolved}`,
        "Loophasbeenclosed": `${loopclosed}`,
        "Panelpresentation": `${panelPresentation}`,
        "presentationDate": `${presentationDate}`,
        "expiryDate": `${expiryDate}`,
        "implementationDate": `${implementationDate}`,
        "ideaEdited": `${ideaViewed}`,
        "ideaEditedBy":`${logedinuser}`,
        "Manager" : `${logedinRMname1}`
        

      });
      if (isitemid !== "") {
        this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${isitemid})`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              "Accept": "application/json;odata=nometadata",
              "Content-type": "application/json;odata=nometadata",
              "odata-version": "",
              "IF-MATCH": "*",
              "X-HTTP-Method": "MERGE"
            },
            body: body
          })
          .then((response: SPHttpClientResponse): void => {
            var newitemurl: any = response.url;
            console.log(newitemurl);
            if (isFileAttached !== 0) {
              var getFile: any = this.getFileBuffer(fileInput);
              getFile.done((arrayBuffer: any): any => {
                var addFile: any = this.addFileToFolder(arrayBuffer, newitemurl, fileInput);
              });
            } else {
              var modal: any = document.getElementById("IdeaNewForm");
              modal.style.display = "none";
              document.location.reload(true);
            }
          }, (error: any): void => {
            alert("Error updating item : " + error);
          });
      } else {
        this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              "Accept": "application/json;odata=nometadata",
              "Content-type": "application/json;odata=nometadata",
              "odata-version": ""
            },
            body: body
          })
          .then((response: SPHttpClientResponse): Promise<IListItem> => {
            return response.json();
          })
          .then((item: any): void => {
            var newitemurl: any = `${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.Id})`;
            console.log(newitemurl);
            if (isFileAttached !== 0) {
              var getFile: any = this.getFileBuffer(fileInput);
              getFile.done((arrayBuffer: any): any => {
                var addFile: any = this.addFileToFolder(arrayBuffer, newitemurl, fileInput);
              });
            } else {
              var modal: any = document.getElementById("IdeaNewForm");
              modal.style.display = "none";
              document.location.reload(true);
            }
          }, (error: any): void => {
            console.log("Item Not created" + error);
          });
      }
    }
  }

  private submitData1(): void {
    var chb1: any =  jquery("input[name='chk1']:checked");
    var chb2: any =  jquery("input[name='chk2']:checked");
    var chb3: any =  jquery("input[name='chk3']:checked");
    var chb4: any =  jquery("input[name='chk4']:checked");
if(chb1.length === 1 && chb2.length === 1 && chb3.length === 1 && chb4.length === 1){
  var userGeo: any = jquery("." + styles.loggedinuserGeo)[0].innerText;
  var userOrg: any = jquery("." + styles.loggedinuserOrg)[0].innerText;
  var logedinRMname: any = jquery("." + styles.loggedinRMId);
  var userRM: any = logedinRMname[0].innerText.substring(18,(logedinRMname[0].innerText).length).replace("@autodesk.com","").replace("."," ");
  jquery("#mainideaCategory").find(":selected").attr("selected", false);
  jquery("#roiCategory").find(":selected").attr("selected", false);
  jquery("#budgetItemId").find(":selected").attr("selected", false);
  jquery("#idearProceedsId").find(":selected").attr("selected", false);
  jquery("#fastTrackid").find(":selected").attr("selected", false);
  jquery("#ideaStatusId").find(":selected").attr("selected", false);
  jquery("#loopclosedId").find(":selected").attr("selected", false);
  jquery("input[name='Teamsoptions']").prop("checked", false);
  jquery("#PanelpresentationId").find(":selected").attr("selected", false);
  jquery("#yourorg")[0].value = "";
  jquery("#yourgeo")[0].value = "";
  jquery("#ideaTitleid")[0].value = "";
  jquery("#ideaDescid")[0].value = "";
  jquery("#businessImpactid")[0].value = "";
  jquery("#otherstakeholdersid")[0].value = "";
  jquery("#resourceNeededId")[0].value = "";
  jquery("#roughItemId")[0].value = "";
  jquery("#reasoningId")[0].value = "";
  jquery("#innovationCoachId")[0].value = "";
  jquery("#ActionsCompletedId")[0].value = "";
  jquery("#RoadblocksId")[0].value = "";
  jquery("#NextstepsId")[0].value = "";
  jquery("#EstimatedcompletionId")[0].value = "";
  jquery("#NotesCommentsId")[0].value = "";
  jquery("#PresentationDate")[0].value = "";
  jquery("#yourorg")[0].value = userOrg;
  jquery("#yourgeo")[0].value = userGeo;
  jquery("#yourRM")[0].value = userRM;
  jquery("." + styles.existingFiles).empty();
  jquery("." + styles.editDataButton).css("display", "none");
  jquery("." + styles.Editcontrols).css("display", "none");
  jquery("." + styles.leadersControls).css("display", "none");
  jquery("." + styles.submitDataButton).css("display", "block");
  jquery("." + styles.UserControls).css("pointer-events", "visible");
  jquery("textarea").css("pointer-events", "visible");
  jquery("textarea").removeAttr("disabled");
  jquery("." + styles.currentitemId).empty();
  var modal: any = document.getElementById("IdeaAckForm");
  modal.style.display = "none";
  var modal: any = document.getElementById("IdeaNewForm");
  window.document.getElementById("IdeaNewForm").style.display = "block";
}
else{
  alert("Please select check boxes.");
}
 }
  private submitcomments(): any {
    var isitemid: any = jquery("." + styles.currentcommentsitemId).text();
    return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')` +
      `/items('${isitemid}')`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "Accept": "application/json;odata=nometadata",
          "odata-version": ""
        }
      })
      .then((response: SPHttpClientResponse): Promise<IListItem> => {
        return response.json();
      })
      .then((item: any): void => {
        var itemResult: any = item;
        var dispVotes: any = itemResult.Commented;
        if (dispVotes === null) {
          dispVotes = 0;
        }
        var existingvotes: any = parseInt(dispVotes, 10);
        var allVotes: any = existingvotes + 1;
        var allusersComments: any = itemResult.Comments;
        var allcommentedusers: any = itemResult.CommentedUsers;
        if (allusersComments === null) {
          allusersComments = "";
        }
        if (allcommentedusers === null) {
          allcommentedusers = "";
        }
        var logedinuser: any = jquery("." + styles.loggedinuserId)[0].innerText;
        var presentDate: any = new Date();
        var commentingDate: any = presentDate.getFullYear() + "/" + (presentDate.getMonth() + 1) + "/" + presentDate.getDate();
        var userComments: any = logedinuser + " &#58; " + commentingDate + " &#58; " +
          jquery("#userComments")[0].value + "</br>" + allusersComments;
        var commentedUsers: any = logedinuser + "," + allcommentedusers;
        var userarray: any = commentedUsers.split(",");
        var finalusersarray: any = this.uniqueItems(userarray);
        var body: any = JSON.stringify({
          "Commented": `${allVotes}`,
          "Comments": `${userComments}`,
          "CommentedUsers": `${finalusersarray}`
        });
        this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.Id})`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              "Accept": "application/json;odata=nometadata",
              "Content-type": "application/json;odata=nometadata",
              "odata-version": "",
              "IF-MATCH": "*",
              "X-HTTP-Method": "MERGE"
            },
            body: body
          })
          .then((response: SPHttpClientResponse): void => {
            console.log("comments updated " + allVotes);
            document.location.reload(true);
          }, (error: any): void => {
            console.log("comments not updated " + allVotes);
          });
      });
  }
  private ExporttoExcel(editevt: any): any {
    var table: any = "<table class='new_tab_table' cellspacing= '3 ' cellpadding= '3 ' border= '2 '>" +
      "<tr><th>IdeaID</th><th>Vote</th><th>Created By</th><th> Geo </th><th> Organization </th>" +
      "<th> IdeaCategory </th><th> Title </th><th> IdeaDescription </th><th> BusinessImpact </th>" +
      "<th>  Quantifiable ROI Justification </th><th>ROI Category</th><th> Innovation Coach assigned </th><th> Next Steps </th><th> Action Taken </th>" +
      "<th> Current Status </th><th>Reporting Manager</th></tr>";
    var reactHandler: any = this;
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')` +
      `/items?$top=5000&$filter=IdeaStatus eq 'New'&$select=Title,IdeaStatus,Author/Title,Created,IdeaDescription,MainIdeaCategory,` +
      `YourGEO,Vote,View,Id,ViewedUsers,IdeaID,InnovationCoachAssigned,VotedUsers,Panelpresentation,CommentedUsers,` +
      `Loophasbeenclosed,BusinessImpact,ROIImpact,roiCategory,YourOrganization,Nextsteps,Reasoning,ActionsCompleted,Commented,Manager&$Expand=Author&$orderby=Id desc`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "Accept": "application/json;odata=nometadata",
          "odata-version": ""
        }
      })
      .then((response: SPHttpClientResponse): Promise<IListItem> => {
        return response.json();
      }).then((newitems: any): void => {
        newitems.value.forEach(newitem => {
          table = table + "<tr><td>" + newitem.IdeaID + "</td><td>" + newitem.Vote + "</td><td>" + newitem.Author.Title + "</td>" +
            "<td>" + newitem.YourGEO + "</td><td>" + newitem.YourOrganization + "</td><td>" + newitem.MainIdeaCategory + "</td>" +
            "<td>" + newitem.Title + "</td><td>" + newitem.IdeaDescription + "</td><td>" + newitem.BusinessImpact + "</td>" +
            "<td>" + newitem.ROIImpact + "</td><td>" + newitem.roiCategory + "</td><td>" + newitem.InnovationCoachAssigned + "</td>" +
            "<td>" + newitem.Nextsteps + "</td><td>" + newitem.ActionsCompleted + "</td><td>" + newitem.Reasoning + "</td><td>"+ newitem.Manager +"</td></tr>";
        });
        table = table + "</table>";
        var ua: any = this.props.currentBrowser;
        var msie: any = ua.indexOf("MSIE ");
        var newideasDiv: any = "";
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { // if Internet Explorer
          if (window.navigator.msSaveBlob) {
            var blob: any = new Blob([table], {
              type: "application/csv;charset=utf-8;"
            });
            navigator.msSaveBlob(blob, "Test file.xls");
          }
        } else {
          var a: any = document.createElement("a");
          var result: any = "data:application/vnd.ms-excel," + encodeURIComponent(table);// $('#NewIdeas')

          a.href = result;
          // setting the file name
          a.download = "newideas.xls";
          // triggering the function
          a.click();
          // just in case, prevent default behaviour
          // e.preventDefault();
          // window.open('data:application/vnd.ms-excel,JustOneThingReport' + encodeURIComponent($('#assessmentTable').html()));
        }
      }, (error: any): void => {
        console.log("views not updated ");
      });
  }
  public getFileBuffer(fileInput: any): any {
    var deferred: any = jquery.Deferred();
    var reader: any = new FileReader();
    reader.onloadend = function (e: any): any {
      deferred.resolve(e.target.result);
    };
    reader.onerror = function (e: any): any {
      deferred.reject(e.target.error);
    };
    reader.readAsArrayBuffer(fileInput[0].files[0]);
    return deferred.promise();
  }
  public addFileToFolder(arrayBuffer: any, executeUpdateUrl: any, fileInput: any): any {
    // get the file name from the file input control on the page.
    var parts: any = fileInput[0].value.split("\\");
    var fileName: any = parts[parts.length - 1];

    this.props.spHttpClient.post(`${executeUpdateUrl}/AttachmentFiles/add(FileName='${fileName}')`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          "Accept": "application/json;odata=nometadata",
          "Content-type": "application/json;odata=nometadata",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE"
        },
        body: arrayBuffer
      })
      .then((response: SPHttpClientResponse): void => {
        console.log("uploaded");
        document.location.reload(true);
      }, (error: any): void => {
        console.log("done");
      });
  }

  public render(): React.ReactElement<IInnovationPageWebpartProps> {
 
    return (
      <div className={styles.innovationPageWebpart}>
        <div className={styles.instructions}>
          <div className={styles.instructionsRightDiv}>
            <div className={styles.GotAnIdea} onClick={this.ackForm}>Have an idea? Click here to share it!</div>
            <div className={styles.ideaSearchBar} >
              <input type="text" className={styles.searchBar} name="ideasearchbar" placeholder="Search Ideas"></input>
              <img onClick={(authorevt: any) => this.searchBar(authorevt)} src="../SiteAssets/Search.png" className={styles.searchIcon}>
              </img></div>
          </div>
          <div className={styles.loggedinuserId}></div>
          <div className={styles.loggedinuserGeo}></div>
          <div className={styles.loggedinuserOrg}></div>
          <div className={styles.loggedinRMId}></div>
          
        </div>
        <div className={styles.exportnewidea}>
          <iframe id="txtArea1" className={styles.NewIdeaiframe} ></iframe>
          <input className={styles.ExportDataButton} type="submit" value="Export New Ideas"
            onClick={(editevt: any) => this.ExporttoExcel(editevt)}></input>
        </div>
        <div id="IdeaSearchForm" className={styles.modal}>
          <div className={styles.modalcontent}>
            <div className={styles.SubmitformHeader}>
              <span className={styles.close} onClick={this.closesearchpopup}>&times;</span>
            </div>
            <div className={styles.ideacontainer}>
             <div className={styles.ideaTabsID}>Idea #<span>
              </span></div>
              <div className={styles.ideaTabsTitle}>Description</div>
              <div className={styles.ideaTabsDate}>Date<span>
              </span></div>
              <div className={styles.ideaTabsAuthor}>Innovator<span>
              </span></div>
              <div className={styles.ideaTabsOrg}>Org <span>
              </span></div>
              <div className={styles.ideaTabs}>Geo <span>
              </span></div>
              <div className={styles.ideaTabs}>Views <span>
              </span></div>
              <div className={styles.ideaTabs} >Vote<span>
              </span></div>
              <div className={styles.ideaTabs}>Comment<span>
              </span></div>
              <div className={styles.ideaTabs}>Idea Status<span>
              </span></div>
            </div>
            {this.state.currentItems.map((item: any, key: any): any => {
              if (item.VotedUsers !== null) {
                var uniqueVoters: any = "";
                var isuservoted: any = "";
                item.VotedUsers.split(",").forEach(element => {
                  if (element === this.props.currentloginuser) {
                    isuservoted = styles.votedIdea;
                  }
                  uniqueVoters = uniqueVoters + element + "<br/>";
                });
              }
              if (item.CommentedUsers !== null) {
                var isuserCommented: any = "";
                item.CommentedUsers.split(",").forEach(commented => {
                  if (commented === this.props.currentloginuser) {
                    isuserCommented = styles.commentedIdea;
                  }
                });
              }
              return (
                <div className={styles.Newides}>
                 <div className={styles.ideaIdeaIDDiv} >{item.IdeaID}</div>
                  <div className={styles.ideaTitleDiv}>
                    <a className={styles.TitleHover} href="#" onClick={(itmEvt: any) => this.openideaItem(itmEvt)}>{item.Title}
                      <span className={styles.tooltiptext}>
                        <p>
                          <b>Business Case</b>  : {item.BusinessImpact}<br />
                          <b>Idea Category&nbsp;&nbsp;&nbsp;&nbsp;</b>: {item.MainIdeaCategory}<br />
                          <b>Describe your Idea</b>  : {item.IdeaDescription}
                        </p></span></a> </div>
                  <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                  <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                  <div className={styles.ideaOrgDiv} >{item.YourOrganization}</div>
                  <div className={styles.ideaGeoDiv} >{item.YourGEO}</div>
                  <div className={styles.ideaRMDiv} >{item.YourGEO}</div>
                  <div className={styles.ideaViewDiv} ><span ><img className={styles.ideaitemimage}
                    src="../SiteAssets/visited.png" /></span>
                    <span className={styles.ideaitemTitle}>{item.View}</span>
                  </div>
                  <div className={styles.ideaVoteDiv} ><span ><img onClick={(likeEvt: any) => this.updateIdealikes(likeEvt)}
                    className={styles.ideaitemimage + " " + isuservoted} src="../SiteAssets/thumpsup.png" /></span>
                    <span className={styles.ideaitemTitle + " " + styles.voteHover}
                    >{item.Vote}
                      <span className={styles.voteduserDetails}>
                        <p> <b>Voted unique users</b>  :<br />
                          {/* <div dangerouslySetInnerHTML={{ __html: uniqueVoters }} /> */}
                        </p></span>
                    </span>
                  </div>
                  <div className={styles.ideaCommentDiv}>
                    <span ><img onClick={(chatEvt: any) => this.openIdeacomments(chatEvt)}
                      className={styles.ideaitemimage + " " + isuserCommented} src="../SiteAssets/Comments.png" /></span>
                    <span className={styles.ideaitemTitle}>{item.Commented}</span>
                  </div>
                  <div className={styles.ideaCommentDiv}>
                    <span className={styles.ideaitemTitle}>{item.IdeaStatus}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div id="IdeaCommentsForm" className={styles.modal}>
          <div className={styles.modalcontent}>
            <div className={styles.SubmitformHeader}>Please add your comments.
              <span className={styles.close} onClick={this.closecommentspopup}>&times;</span>
              <div className={styles.currentcommentsitemId}></div>
            </div>
            <div className={styles.submitform}>
              <div className={styles.ColumnTitle}>Comments : </div>
              <div className={styles.ColumnTypes}><textarea id="userComments"></textarea></div>
            </div>
            <div className={styles.submitform}>
              <input className={styles.submitcommentsButton} type="submit" value="Submit" onClick={() => this.submitcomments()}></input>
            </div>
            <div className={styles.submitform}>
              <div className={styles.ColumnTitle}>Comments : </div>
              <div className={styles.ColumnTypes}><div className={styles.allComments}></div></div>
            </div>
          </div>
        </div>
        <div id="IdeaAckForm" className={styles.modal}>
          <div className={styles.modalcontent}>
            <div className={styles.SubmitformHeader}>Hello, Innovator,<span className={styles.close} onClick={this.closecommentspopup1}>&times;</span><br/><br/>
We are excited to learn about your idea but before you share your details, let’s do a quick due diligence check. A great I2O idea is both in-scope and has been researched:<br/>
<br/>IN SCOPE<br/><br/>
1)	Is a clearly defined suggestion with distinct purpose<br/>
2)	Has a tangible, longer-term benefit for one or more groups within Operations<br/>
3)	Improves one or more of the following areas:<br/><br/>

<div className={styles.AckRow}>a.	The ways we work (workstreams, metrics, etc.)</div><br/>
<div className={styles.AckRow}>b.	Cross-team collaboration with other groups</div><br/>
<div className={styles.AckRow}>c.	Rewards & Recognition</div><br/>
<div className={styles.AckRow}>d.	System Changes / Enhancements / Automations</div><br/>
<div className={styles.AckRow}>e.	Ops-related Policy and Process</div><br/><br/>
RESEARCH<br/><br/>
<div className={styles.submitform}>
  <input type="checkbox" id="chk1" name="chk1"></input> <div className={styles.ColumnTitle1}>Have you discussed this idea with your manager?</div> 
</div> 
<div className={styles.submitform}>
  <input type="checkbox" id="chk2" name="chk2"></input>	 <div className={styles.ColumnTitle1}>Have you searched for duplicate/similar ideas on the I2O platform?</div>
</div> 
<div className={styles.submitform}>
  <input type="checkbox" id="chk3" name="chk3"></input>  <div className={styles.ColumnTitle1}>Have you checked with relevant teams and stakeholders to ensure the idea does not yet exist, is not yet in the pipeline, or otherwise not feasible?</div>
</div> 
<br/>
<div className={styles.submitform}>
<div className={styles.ColumnTitle3}> <input type="checkbox" id="chk4" name="chk4"></input> I confirm my idea fulfills these I2O criteria and is ready to be submitted.</div>
</div>
 </div>
      <div className={styles.submitform}>
        <input className={styles.submitcommentsButton1} type="submit" value="Proceed" onClick={() => this.submitData1()}></input>
      </div>
          </div>
        </div>
        <div id="IdeaNewForm" className={styles.modal}>
          <div className={styles.modalcontent}>
            <div className={styles.SubmitformHeader}>Please share your idea with us by completing the fields below.
              <span className={styles.close} onClick={this.closepopup}>&times;</span>
              <div className={styles.currentitemId}></div>
              <div className={styles.currentitemOwner}></div>
              <div className={styles.loggedinRMId}></div>
            </div>
            <div className={styles.UserControls}>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Your Organization <span className={styles.mandatory}>*</span> : </div>
                <div className={styles.ColumnTypes}><input type="text" id="yourorg" name="Organization"></input></div>
              </div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Your GEO <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><input type="text" id="yourgeo" name="Organization"></input></div>
              </div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Reporting Manager<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><input type="text" className={styles.Test}  id="yourRM" name="Organization"></input></div>
              </div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Main Idea Category <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="mainideaCategory"></select></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Idea Title <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <input type="text" placeholder="1 sentence summary of your idea" id="ideaTitleid" name="ideatitle"></input></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Describe your Idea <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <textarea id="ideaDescid" placeholder="Please add more details" name="ideaDescription"></textarea > </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Business Case <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <textarea id="businessImpactid" placeholder="How will this affect your work and ADSK?" name="businessImpact">
                  </textarea > </div></div>
           
              <div className={styles.submitform}>
              <div className={styles.ColumnTitle}>ROI Category <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="roiCategory"></select></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Quantifiable ROI justification or Other Success Measurements<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <textarea id="roiImpactid" className={styles.roiImpactclass} placeholder="Please provide approximate numbers here like time savings per month or case reduced per month etc. Which ever is applicable based on your ROI catergory. You can use the ROI calculator as a guide or use your own data analysis. If you do not put a detailed data or numbers here, your idea will be archive." name="roiImpact">
                  </textarea > <br/> <a href="https://share.autodesk.com/sites/OperationsI2O/Shared%20Documents/ROI%20Documents/ROI%20Calculator.xlsx">ROI Calculator link</a></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Other Stakeholders name currently involved (if any) <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <input type="text" id="otherstakeholdersid"
                    placeholder="Who is currently involved in this idea other than yourself?" name="OtherStakeHolders"></input>
                </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Who or which Stakeholders would benefit the idea? (Tick all that apply) <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <div id="teamsAffectedbyIdeaId" ></div></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Resources Needed <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <input type="text" id="resourceNeededId" placeholder="What is needed to implement your idea?" name="ResourcesNeeded">
                  </input></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Budget Item <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="budgetItemId">
                  <option value="Select">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option></select></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Rough Time Indication <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <input type="text" id="roughItemId" placeholder="What is the urgency level and timeline?" name="RoughItemIndication">
                  </input></div></div>
            </div>
            <div className={styles.Editcontrols}>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Actions Completed :</div>
                <div className={styles.ColumnTypes}>
                  <textarea id="ActionsCompletedId"
                    placeholder="What actions have been taken so far to drive this idea forward?" name="ActionsCompleted">
                  </textarea >
                </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Roadblocks <span>Resolved </span>
                  <span><input type="checkbox" id="Resolved" name="Resolved" value="Yes"></input></span> :</div>
                <div className={styles.ColumnTypes}>
                  <textarea id="RoadblocksId"
                    placeholder="What roadblocks have been uncovered. Has the issue been resolved?" name="Roadblocks"></textarea >
                </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Next steps :</div>
                <div className={styles.ColumnTypes}>
                  <textarea id="NextstepsId"
                    placeholder="What are the next action items to implement the idea?" name="Nextsteps">
                  </textarea >
                </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Estimated completion :</div>
                <div className={styles.ColumnTypes}>
                  <input type="text" id="EstimatedcompletionId"
                    placeholder="When is the idea expected to be implemented? What’s the target roll out date?" name="Estimatedcompletion">
                  </input>
                </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Panel presentation :</div>
                <div className={styles.ColumnTypes}>
                  <select id="PanelpresentationId"></select>
                  <input type="date" id="PresentationDate" name="bday"></input>
                </div>
              </div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Notes/Comments :</div>
                <div className={styles.ColumnTypes}>
                  <textarea id="NotesCommentsId"
                    placeholder="Provide any additional noteworthy thoughts" name="NotesComments"></textarea >
                </div></div>
            </div>
            <div className={styles.FileControl}>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>File Attachments :</div>
                <div className={styles.ColumnTypes}><input type="file" id="ideafile" name="ideafile" ></input>
                </div>
              </div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Attached files :</div>
                <div className={styles.ColumnTypes}>
                  <div className={styles.existingFiles}></div>
                </div></div>
            </div>
            <div className={styles.leadersControls}>
              <div className={styles.InnovationpanelHeader}><b>This section is only for Innovation panel to fill in.</b></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Idea proceeds to next stage :</div>
                <div className={styles.ColumnTypes}><select id="idearProceedsId">
                  <option value="Select">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option></select></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Panel feedback :</div>
                <div className={styles.ColumnTypes}><textarea id="reasoningId" name="Reasoning"></textarea></div>
              </div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Loop has been closed :</div>
                <div className={styles.ColumnTypes}><select id="loopclosedId"></select></div>
              </div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Innovation Coach Assigned :</div>
                <div className={styles.ColumnTypes}><input type="text" id="innovationCoachId" name="InnovationCoach"></input>
                </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Fast track :</div>
                <div className={styles.ColumnTypes}><select id="fastTrackid">
                  <option value="Select">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option></select>
                </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Idea Status :</div>
                <div className={styles.ColumnTypes}><select id="ideaStatusId"></select></div></div>
             <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Expiry for no update/progress :</div>
                <div className={styles.ColumnTypes}>
                  <input type="date" id="expiryDate" name="expiryDate"></input></div></div>  
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Implementation Date :</div>
                <div className={styles.ColumnTypes}>
                  <input type="date" id="implementationDate" name="implementationDate"></input></div></div>  
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Last edited/saved on. :</div>
                <div className={styles.ColumnTypes}>
                  <div className={styles.submittedDate}></div></div></div>
            </div>

            <div className={styles.submitformButton}>
              <input className={styles.submitDataButton} type="submit" value="SHARE IDEA" onClick={() => this.submitData()}></input>
              <input className={styles.editDataButton} type="submit" value="Edit"
                onClick={(editevt: any) => this.editItemData(editevt)}></input>
            </div>
          </div>
        </div>
        <div className={styles.tab}>
          <div className={styles.tablinks + " " + styles.active} onClick={(evt: any) => this.opencontentItems(evt)}>New Ideas</div>
          <div className={styles.tablinks} onClick={(evt: any) => this.opencontentItems(evt)}>FastTrack</div>          
          <div className={styles.tablinks} onClick={(evt: any) => this.opencontentItems(evt)}>Standard</div>
          <div className={styles.tablinks} onClick={(evt: any) => this.opencontentItems(evt)}>Archived</div>
          <div className={styles.tablinks} onClick={(evt: any) => this.opencontentItems(evt)}>Presented</div>
          <div className={styles.tablinks} onClick={(evt: any) => this.opencontentItems(evt)}>Implemented</div>
        </div>
        <div className={styles.ideacontainer}>
          <div className={styles.ideaTabsTitle}>Idea</div>
          <div className={styles.ideaTabs}>Idea#<span>
            <img onClick={(numberevt: any) => this.sortbyideanumber(numberevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabsDate}>Date<span>
            <img onClick={(dateevt: any) => this.sortbyDate(dateevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabsAuthor}>Innovator<span>
            <img onClick={(authorevt: any) => this.sortbyAuthor(authorevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabsAuthor}>Coach Name<span>
            <img onClick={(coachevt: any) => this.sortbyCoach(coachevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabsOrg}>Org <span>
            <img onClick={(authorevt: any) => this.sortbyOrg(authorevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabs}>Geo <span>
            <img onClick={(authorevt: any) => this.sortbyGEO(authorevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabs}>Views <span>
            <img onClick={(voteevt: any) => this.sortbyViews(voteevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabs} >Vote<span>
            <img onClick={(voteevt: any) => this.sortbyVoting(voteevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabs}>Comment<span>
            <img onClick={(voteevt: any) => this.sortbycomments(voteevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
        </div>
        <div id="NewIdeas" className={styles.tabcontent}>
          {this.state.items.map((item: any, key: any): any => {
            if (item.IdeaStatus === "New") {
              if (item.VotedUsers !== null) {
                var uniqueVoters: any = "";
                var isuservoted: any = "";
                item.VotedUsers.split(",").forEach(element => {
                  if (element === this.props.currentloginuser) {
                    isuservoted = styles.votedIdea;
                  }
                  uniqueVoters = uniqueVoters + element + "<br/>";
                });
              }
              if (item.CommentedUsers !== null) {
                var isuserCommented: any = "";
                item.CommentedUsers.split(",").forEach(commented => {
                  if (commented === this.props.currentloginuser) {
                    isuserCommented = styles.commentedIdea;
                  }
                });
              }
              return (<div className={styles.Newides}>
                <div className={styles.itemId}>{item.Id}</div>
                <div className={styles.ideaTitleDiv}>
                  <a className={styles.TitleHover} href="#" onClick={(itmEvt: any) => this.openideaItem(itmEvt)}>{item.Title}
                    <span className={styles.tooltiptext}>
                      <p>
                        <div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Describe your Idea :</div>
                            <div className={styles.tooltipdesc}> {item.IdeaDescription}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Business Case :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                        </div>
                      </p>
                    </span></a> </div>
                <div className={styles.ideaNumberDiv} >{item.IdeaID}</div>
                <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                <div className={styles.ideaCoachDiv} >{item.InnovationCoachAssigned}</div>
                <div className={styles.ideaOrgDiv} >{item.YourOrganization}</div>
                <div className={styles.ideaGeoDiv} >{item.YourGEO}</div>
                <div className={styles.ideaViewDiv} ><span ><img className={styles.ideaitemimage} src="../SiteAssets/visited.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.View}</span>
                </div>
                <div className={styles.ideaVoteDiv} ><span ><img onClick={(likeEvt: any) => this.updateIdealikes(likeEvt)}
                  className={styles.ideaitemimage + " " + isuservoted} src="../SiteAssets/thumpsup.png" /></span>
                  <span className={styles.ideaitemTitle + " " + styles.voteHover}>{item.Vote}
                    <span className={styles.voteduserDetails}>
                      <p> <b>Voted unique users</b>  :<br />
                        <div dangerouslySetInnerHTML={{ __html: uniqueVoters }} />
                      </p></span>
                  </span>
                </div>
                <div className={styles.ideaCommentDiv}>
                  <span ><img onClick={(chatEvt: any) => this.openIdeacomments(chatEvt)}
                    className={styles.ideaitemimage + " " + isuserCommented} src="../SiteAssets/Comments.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.Commented}</span>
                </div>
              </div>
              );
            }
          })}
        </div>
        <div id="FastTrack" className={styles.tabcontent}>
          {this.state.items.map((item: any, key: any): any => {
            if (item.IdeaStatus === "Fast-Track WIP") {
              if (item.VotedUsers !== null) {
                var uniqueVoters: any = "";
                var isuservoted: any = "";
                item.VotedUsers.split(",").forEach(element => {
                  if (element === this.props.currentloginuser) {
                    isuservoted = styles.votedIdea;
                  }
                  uniqueVoters = uniqueVoters + element + "<br/>";
                });
              }
              if (item.CommentedUsers !== null) {
                var isuserCommented: any = "";
                item.CommentedUsers.split(",").forEach(commented => {
                  if (commented === this.props.currentloginuser) {
                    isuserCommented = styles.commentedIdea;
                  }
                });
              }
              return (<div className={styles.Newides}>
                <div className={styles.itemId}>{item.Id}</div>
                <div className={styles.ideaTitleDiv}>
                  <a className={styles.TitleHover} href="#" onClick={(itmEvt: any) => this.openideaItem(itmEvt)}>{item.Title}
                    <span className={styles.tooltiptext}>
                      <p>
                        <div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Describe your Idea :</div>
                            <div className={styles.tooltipdesc}> {item.IdeaDescription}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Business Case :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                        </div>
                      </p>
                    </span></a> </div>
                <div className={styles.ideaNumberDiv} >{item.IdeaID}</div>
                <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                <div className={styles.ideaCoachDiv} >{item.InnovationCoachAssigned}</div>
                <div className={styles.ideaOrgDiv} >{item.YourOrganization}</div>
                <div className={styles.ideaGeoDiv} >{item.YourGEO}</div>
                <div className={styles.ideaViewDiv} ><span ><img className={styles.ideaitemimage} src="../SiteAssets/visited.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.View}</span>
                </div>
                <div className={styles.ideaVoteDiv} ><span ><img onClick={(likeEvt: any) => this.updateIdealikes(likeEvt)}
                  className={styles.ideaitemimage + " " + isuservoted} src="../SiteAssets/thumpsup.png" /></span>
                  <span className={styles.ideaitemTitle + " " + styles.voteHover}>{item.Vote}
                    <span className={styles.voteduserDetails}>
                      <p> <b>Voted unique users</b>  :<br />
                        <div dangerouslySetInnerHTML={{ __html: uniqueVoters }} />
                      </p></span>
                  </span>
                </div>
                <div className={styles.ideaCommentDiv}>
                  <span ><img onClick={(chatEvt: any) => this.openIdeacomments(chatEvt)}
                    className={styles.ideaitemimage + " " + isuserCommented} src="../SiteAssets/Comments.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.Commented}</span>
                </div>
              </div>
              );
            }
          })}
        </div>

        <div id="Standard" className={styles.tabcontent}>
          {this.state.items.map((item: any, key: any): any => {
            if (item.IdeaStatus === "Standard Track WIP") {
              if (item.VotedUsers !== null) {
                var uniqueVoters: any = "";
                var isuservoted: any = "";
                item.VotedUsers.split(",").forEach(element => {
                  if (element === this.props.currentloginuser) {
                    isuservoted = styles.votedIdea;
                  }
                  uniqueVoters = uniqueVoters + element + "<br/>";
                });
              }
              if (item.CommentedUsers !== null) {
                var uniqueCommentors: any = "";
                var isuserCommented: any = "";
                item.CommentedUsers.split(",").forEach(commented => {
                  if (commented === this.props.currentloginuser) {
                    isuserCommented = styles.commentedIdea;
                  }
                });
              }
              return (<div className={styles.Newides}>
                <div className={styles.itemId}>{item.Id}</div>
                <div className={styles.ideaTitleDiv}>
                  <a className={styles.TitleHover} href="#" onClick={(itmEvt: any) => this.openideaItem(itmEvt)}>{item.Title}
                    <span className={styles.tooltiptext}>
                      <p>
                        <div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Business Case :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Describe your Idea :</div>
                            <div className={styles.tooltipdesc}> {item.IdeaDescription}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Panel feedback :</div>
                            <div className={styles.tooltipdesc}> {item.Reasoning}</div>
                          </div>
                        </div>
                      </p>
                    </span></a> </div>
                <div className={styles.ideaNumberDiv} >{item.IdeaID}</div>
                <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                <div className={styles.ideaCoachDiv} >{item.InnovationCoachAssigned}</div>
                <div className={styles.ideaOrgDiv} >{item.YourOrganization}</div>
                <div className={styles.ideaGeoDiv} >{item.YourGEO}</div>
                <div className={styles.ideaViewDiv} ><span ><img className={styles.ideaitemimage} src="../SiteAssets/visited.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.View}</span>
                </div>
                <div className={styles.ideaVoteDiv} ><span ><img onClick={(likeEvt: any) => this.updateIdealikes(likeEvt)}
                  className={styles.ideaitemimage + " " + isuservoted} src="../SiteAssets/thumpsup.png" /></span>
                  <span className={styles.ideaitemTitle + " " + styles.voteHover}
                  >{item.Vote}
                    <span className={styles.voteduserDetails}>
                      <p> <b>Voted unique users</b>  :<br />
                        <div dangerouslySetInnerHTML={{ __html: uniqueVoters }} />
                      </p></span>
                  </span>
                </div>
                <div className={styles.ideaCommentDiv}>
                  <span ><img onClick={(chatEvt: any) => this.openIdeacomments(chatEvt)}
                    className={styles.ideaitemimage + " " + isuserCommented} src="../SiteAssets/Comments.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.Commented}</span>
                </div>
              </div>
              );
            }
          })}
        </div>
        <div id="Archived" className={styles.tabcontent}>
          {this.state.items.map((item: any, key: any): any => {
            if (item.IdeaStatus === "Archived") {
              if (item.VotedUsers !== null) {
                var uniqueVoters: any = "";
                var isuservoted: any = "";
                item.VotedUsers.split(",").forEach(element => {
                  if (element === this.props.currentloginuser) {
                    isuservoted = styles.votedIdea;
                  }
                  uniqueVoters = uniqueVoters + element + "<br/>";
                });
              }
              if (item.CommentedUsers !== null) {
                var uniqueCommentors: any = "";
                var isuserCommented: any = "";
                item.CommentedUsers.split(",").forEach(commented => {
                  if (commented === this.props.currentloginuser) {
                    isuserCommented = styles.commentedIdea;
                  }
                });
              }
              return (<div className={styles.Newides}>
                <div className={styles.itemId}>{item.Id}</div>
                <div className={styles.ideaTitleDiv}>
                  <a className={styles.TitleHover} href="#" onClick={(itmEvt: any) => this.openideaItem(itmEvt)}>{item.Title}
                    <span className={styles.tooltiptext}>
                      <p>
                        <div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Business Case :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Describe your Idea :</div>
                            <div className={styles.tooltipdesc}> {item.IdeaDescription}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Panel feedback :</div>
                            <div className={styles.tooltipdesc}> {item.Reasoning}</div>
                          </div>
                        </div>
                      </p>
                    </span></a> </div>
                <div className={styles.ideaNumberDiv} >{item.IdeaID}</div>
                <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                <div className={styles.ideaCoachDiv} >{item.InnovationCoachAssigned}</div>
                <div className={styles.ideaOrgDiv} >{item.YourOrganization}</div>
                <div className={styles.ideaGeoDiv} >{item.YourGEO}</div>
                <div className={styles.ideaViewDiv} ><span ><img className={styles.ideaitemimage} src="../SiteAssets/visited.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.View}</span>
                </div>
                <div className={styles.ideaVoteDiv} ><span ><img onClick={(likeEvt: any) => this.updateIdealikes(likeEvt)}
                  className={styles.ideaitemimage + " " + isuservoted} src="../SiteAssets/thumpsup.png" /></span>
                  <span className={styles.ideaitemTitle + " " + styles.voteHover}
                  >{item.Vote}
                    <span className={styles.voteduserDetails}>
                      <p> <b>Voted unique users</b>  :<br />
                        <div dangerouslySetInnerHTML={{ __html: uniqueVoters }} />
                      </p></span>
                  </span>
                </div>
                <div className={styles.ideaCommentDiv}>
                  <span ><img onClick={(chatEvt: any) => this.openIdeacomments(chatEvt)}
                    className={styles.ideaitemimage + " " + isuserCommented} src="../SiteAssets/Comments.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.Commented}</span>
                </div>
              </div>
              );
            }
          })}
        </div>
       
        <div id="Presented" className={styles.tabcontent}>
          {this.state.items.map((item: any, key: any): any => {
            if (item.IdeaStatus === "Presented") {
              if (item.VotedUsers !== null) {
                var uniqueVoters: any = "";
                var isuservoted: any = "";
                item.VotedUsers.split(",").forEach(element => {
                  if (element === this.props.currentloginuser) {
                    isuservoted = styles.votedIdea;
                  }
                  uniqueVoters = uniqueVoters + element + "<br/>";
                });
              }
              if (item.CommentedUsers !== null) {
                var isuserCommented: any = "";
                item.CommentedUsers.split(",").forEach(commented => {
                  if (commented === this.props.currentloginuser) {
                    isuserCommented = styles.commentedIdea;
                  }
                });
              }
              return (<div className={styles.Newides}>
                <div className={styles.itemId}>{item.Id}</div>
                <div className={styles.ideaTitleDiv}>
                  <a className={styles.TitleHover} href="#" onClick={(itmEvt: any) => this.openideaItem(itmEvt)}>{item.Title}
                    <span className={styles.tooltiptext}>
                      <p>
                        <div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Describe your Idea :</div>
                            <div className={styles.tooltipdesc}> {item.IdeaDescription}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Business Case :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                        </div>
                      </p>
                    </span></a> </div>
                <div className={styles.ideaNumberDiv} >{item.IdeaID}</div>
                <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                <div className={styles.ideaCoachDiv} >{item.InnovationCoachAssigned}</div>
                <div className={styles.ideaOrgDiv} >{item.YourOrganization}</div>
                <div className={styles.ideaGeoDiv} >{item.YourGEO}</div>
                <div className={styles.ideaViewDiv} ><span ><img className={styles.ideaitemimage} src="../SiteAssets/visited.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.View}</span>
                </div>
                <div className={styles.ideaVoteDiv} ><span ><img onClick={(likeEvt: any) => this.updateIdealikes(likeEvt)}
                  className={styles.ideaitemimage + " " + isuservoted} src="../SiteAssets/thumpsup.png" /></span>
                  <span className={styles.ideaitemTitle + " " + styles.voteHover}>{item.Vote}
                    <span className={styles.voteduserDetails}>
                      <p> <b>Voted unique users</b>  :<br />
                        <div dangerouslySetInnerHTML={{ __html: uniqueVoters }} />
                      </p></span>
                  </span>
                </div>
                <div className={styles.ideaCommentDiv}>
                  <span ><img onClick={(chatEvt: any) => this.openIdeacomments(chatEvt)}
                    className={styles.ideaitemimage + " " + isuserCommented} src="../SiteAssets/Comments.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.Commented}</span>
                </div>
              </div>
              );
            }
          })}
        </div>

        <div id="Implemented" className={styles.tabcontent}>
          {this.state.items.map((item: any, key: any): any => {
            if (item.IdeaStatus === "Implemented") {
              if (item.VotedUsers !== null) {
                var uniqueVoters: any = "";
                var isuservoted: any = "";
                item.VotedUsers.split(",").forEach(element => {
                  if (element === this.props.currentloginuser) {
                    isuservoted = styles.votedIdea;
                  }
                  uniqueVoters = uniqueVoters + element + "<br/>";
                });
              }
              if (item.CommentedUsers !== null) {
                var uniqueCommentors: any = "";
                var isuserCommented: any = "";
                item.CommentedUsers.split(",").forEach(commented => {
                  if (commented === this.props.currentloginuser) {
                    isuserCommented = styles.commentedIdea;
                  }
                });
              }
              return (<div className={styles.Newides}>
                <div className={styles.itemId}>{item.Id}</div>
                <div className={styles.ideaTitleDiv}>
                  <a className={styles.TitleHover} href="#" onClick={(itmEvt: any) => this.openideaItem(itmEvt)}>{item.Title}
                    <span className={styles.tooltiptext}>
                      <p>
                        <div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Business Case :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Describe your Idea :</div>
                            <div className={styles.tooltipdesc}> {item.IdeaDescription}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Panel feedback :</div>
                            <div className={styles.tooltipdesc}> {item.Reasoning}</div>
                          </div>
                        </div>
                      </p>
                    </span></a> </div>
                <div className={styles.ideaNumberDiv} >{item.IdeaID}</div>
                <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                <div className={styles.ideaCoachDiv} >{item.InnovationCoachAssigned}</div>
                <div className={styles.ideaOrgDiv} >{item.YourOrganization}</div>
                <div className={styles.ideaGeoDiv} >{item.YourGEO}</div>
                <div className={styles.ideaViewDiv} ><span ><img className={styles.ideaitemimage} src="../SiteAssets/visited.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.View}</span>
                </div>
                <div className={styles.ideaVoteDiv} ><span ><img onClick={(likeEvt: any) => this.updateIdealikes(likeEvt)}
                  className={styles.ideaitemimage + " " + isuservoted} src="../SiteAssets/thumpsup.png" /></span>
                  <span className={styles.ideaitemTitle + " " + styles.voteHover}
                  >{item.Vote}
                    <span className={styles.voteduserDetails}>
                      <p> <b>Voted unique users</b>  :<br />
                        <div dangerouslySetInnerHTML={{ __html: uniqueVoters }} />
                      </p></span>
                  </span>
                </div>
                <div className={styles.ideaCommentDiv}>
                  <span ><img onClick={(chatEvt: any) => this.openIdeacomments(chatEvt)}
                    className={styles.ideaitemimage + " " + isuserCommented} src="../SiteAssets/Comments.png" /></span>
                  <span className={styles.ideaitemTitle}>{item.Commented}</span>
                </div>
              </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}