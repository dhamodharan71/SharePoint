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
        `?$top=5000&$select=Title,IdeaStatus,Author/Title,Created,IdeaDescription,MainIdeaCategory,CustomersImpact,WorkImpact,ManagersImpact,EffortsImpact,TeamsAffected,SpecialistImpact,BusinessImpact,` +
        `yourGeo,Vote,View,Id,ViewedUsers,IdeaID,VotedUsers,Score,CommentedUsers,` +
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
        var userinfoEmail: any = userresultData.d.Email;
        var userproperties: any = userresultData.d.UserProfileProperties.results;
        var rmName: any= userresultData.d.UserProfileProperties.results[15].Value;
        var logedinRMname: any = jquery("." + styles.loggedinRMId);
        var logedinRMname1: any = logedinRMname[0].innerText.substring(18,(logedinRMname[0].innerText).length).replace("@autodesk.com","").replace("."," ");
        jquery("." + styles.loggedinuserGeo).append(yourGeo);
        for (var i: any = 0; i < userproperties.length; i++) {
          var property: any = userproperties[i];
          if (property.Key === "GEO") {
            var yourGeo: any = property.Value;
            jquery("." + styles.loggedinuserGeo).append(yourGeo);
          }
          if (property.Key === "Manager") {
            var yourRM: any = property.Value;
            jquery("." + styles.loggedinRMId).append(yourRM);
          }
        }
        jquery("." + styles.loggedinuserEmail).append(userinfoEmail);
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
            if (allcolumns[i].StaticName === "TeamsAffectedbythisIdea") {
              options = allcolumns[i].Choices.results;
              for (var cb: any = 0; cb < options.length; cb++) {
                var cbox: any = "<div className=" + styles.CheckBoxDiv + ">" +
                  "<input type=checkbox name=Teamsoptions value='" + options[cb] + "'>" + options[cb] + "</input><div>";
                jquery("#teamsAffectedbyIdeaId").append(jquery(cbox));
              }
            }
            if (allcolumns[i].StaticName === "SpecialistImpact") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#specialistImpact").append(jquery(option));
              });
            }
            
            if (allcolumns[i].StaticName === "ManagersImpact") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#managersImpact").append(jquery(option));
              });
            }
            if (allcolumns[i].StaticName === "EffortsImpact") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#effortsImpact").append(jquery(option));
              });
            }
            if (allcolumns[i].StaticName === "CustomersImpact") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#customersImpact").append(jquery(option));
              });
            }
            if (allcolumns[i].StaticName === "WorkImpact") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#workImpact").append(jquery(option));
              });
            }
            if (allcolumns[i].StaticName === "yourGeo") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#yourGeo").append(jquery(option));
              });
            }
           
            if (allcolumns[i].StaticName === "IdeaStatus") {
              options = allcolumns[i].Choices.results;
              options.forEach((element: string) => {
                var option: any = new Option(element, element);
                jquery("#ideaStatusId").append(jquery(option));
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
    var logedinRMname2: any = jquery("." + styles.loggedinRMId)[0].innerText;
    var logedinRMname1: any = logedinRMname[0].innerText.substring(18,(logedinRMname[0].innerText).length).replace("@autodesk.com","").replace("."," ");
    jquery("#mainideaCategory").find(":selected").attr("selected", false);
    jquery("#specialistImpact").find(":selected").attr("selected", false);
    
    jquery("#effortsImpact").find(":selected").attr("selected", false);
    jquery("#managersImpact").find(":selected").attr("selected", false);
    jquery("#customersImpact").find(":selected").attr("selected", false);
    jquery("#workImpact").find(":selected").attr("selected", false);
    
    jquery("#yourGeo").find(":selected").attr("selected", false);
    jquery("#ideaStatusId").find(":selected").attr("selected", false);
   
    jquery("input[name='Teamsoptions']").prop("checked", false);
   
    jquery("#yourRM")[0].value = "";
    jquery("#ideaTitleid")[0].value = "";
    jquery("#ideaDescid")[0].value = "";
    jquery("#businessImpactid")[0].value = "";
    jquery("#resourceNeededId")[0].value = "";
    jquery("#reasoningId")[0].value = "";
    
    jquery("#NotesCommentsId")[0].value = "";
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
      ` substringof('${searchKey}',MainIdeaCategory) or substringof('${searchKey}',ManagersImpact) or substringof('${searchKey}',EffortsImpact) or substringof('${searchKey}',TeamsAffected) or substringof('${searchKey}',WorkImpact)  or substringof('${searchKey}',CustomersImpact) or substringof('${searchKey}',SpecialistImpact) or`  +
      ` substringof('${searchKey}',yourGeo))&$select=Title,` +
      `IdeaStatus,IdeaID,Author/Title,Created,IdeaDescription,Score,MainIdeaCategory,CustomersImpact,SpecialistImpact,TeamsAffected, ManagersImpact,EffortsImpact,WorkImpact,BusinessImpact,yourGeo,` +
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
  public sortbyScore(voteevt: any): any {
    var voteclassNames: any = voteevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var textA: any = +jquery(a).find("." + styles.ideaScoreDiv).find("." + styles.ideaScoreDiv).prevObject[0].outerText;
      var textB: any = +jquery(b).find("." + styles.ideaScoreDiv).find("." + styles.ideaScoreDiv).prevObject[0].outerText;
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
  public sortbyTeamsImpact(teamsevt: any): any {
    var authorclassNames: any = teamsevt.target.classList;
    var activetab: any = jquery("." + styles.active)[0].innerText.replace(/ /g, "");
    var cont: any = jquery("#" + activetab);
    var arr: any = "";
    arr = jquery.makeArray(cont.children("." + styles.Newides));
    arr.sort(function (a: any, b: any): any {
      var firstText: any = jquery(a).find("." + styles.ideaTeamsDiv)[0].innerText;
      var secondText: any = jquery(b).find("." + styles.ideaTeamsDiv)[0].innerText;
      return firstText.localeCompare(secondText.toUpperCase());
    });
    if (authorclassNames.length === 1) {
      cont.empty();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      teamsevt.target.classList.add("descending");
    } else {
      cont.empty();
      arr.reverse();
      jquery.each(arr, function (): any {
        cont.append(this);
      });
      teamsevt.target.classList.remove("descending");
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
    var currentloggedinEmail : any = jquery("." + styles.loggedinuserEmail)[0].innerText;
    var finalusersarray: any = "";
    var finalusersemailarray: any = "";
    var isuserVoted: boolean = false;
    var itemResult: any = ""; var dispVotes: any = "";
    var existingvotes: any = "";
    var allVotes: any = "";
    var allusers: any = "";
    var allusersEmail: any = "";
    var allusersComments: any = "";
    var finalusers: any = "";
    var finalusersEmail: any = "";
    var userarray: any = "";
    var userarrayemail: any = "";
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
          var votedusersemail: any = item.VotedUsersEmail.split(",");

          finalusersemailarray = this.uniqueItems(votedusersemail);
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
            var indexemail: any = finalusersemailarray.indexOf(currentloggedinEmail);
            if (index > -1) {
              finalusersarray.splice(index, 1);
              finalusersemailarray.splice(indexemail, 1);
            }
            body = JSON.stringify({
              "Vote": `${allVotes}`,
              "VotedUsers": `${finalusersarray}`,
              "VotedUsersEmail": `${finalusersemailarray}`
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
                document.location.reload();
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
            allusersEmail = itemResult.VotedUsersEmail;
            if (allusers === null) {
              allusers = "";
              allusersEmail ="";
            }
            allusersComments = itemResult.Comments;
            if (allusersComments === null) {
              allusersComments = "";
            }
            finalusersEmail = currentloggedinEmail + ","+ allusersEmail;
            finalusers = currentlogedinuser + "," + allusers;
            userarray = finalusers.split(",");
            userarrayemail = finalusersEmail.split(",");
            finalusersarray = this.uniqueItems(userarray);
            finalusersemailarray = this.uniqueItems(userarrayemail);
            body = JSON.stringify({
              "Vote": `${allVotes}`,
              "VotedUsers": `${finalusersarray}`,
              "VotedUsersEmail": `${finalusersemailarray}`
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
                document.location.reload();
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
          allusersEmail = itemResult.VotedUsersEmail;
          if (allusers === null) {
            allusers = "";
            allusersEmail ="";
          }
          allusersComments = itemResult.Comments;
          if (allusersComments === null) {
            allusersComments = "";
          }

          finalusersEmail = currentloggedinEmail + ","+ allusersEmail;
          finalusers = currentlogedinuser + "," + allusers;
          userarray = finalusers.split(",");
          userarrayemail = finalusersEmail.split(",");
          finalusersarray = this.uniqueItems(userarray);
          finalusersemailarray = this.uniqueItems(userarrayemail);
          body = JSON.stringify({
            "Vote": `${allVotes}`,
            "VotedUsers": `${finalusersarray}`,
            "VotedUsersEmail": `${finalusersemailarray}`

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
              document.location.reload();
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
      `/items('${currentItemIdvalue}')?$select=Title,IdeaStatus,AttachmentFiles,Author/Title,TeamsAffected,IdeaDescription,` +
      `MainIdeaCategory,SpecialistImpact,ManagersImpact,EffortsImpact,CustomersImpact,WorkImpact,ResourcesNeeded,` +
      `OwnerComments,implementationDate,yourGeo,Vote,View,Id,ViewedUsers,IdeaID,VotedUsers,Created,Modified,CommentedUsers,` +
      `BusinessImpact,Reasoning,Manager,Commented&$Expand=Author,AttachmentFiles`,
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
        var dispGeo: any = itemResult.yourGeo;
        var dispDesc: any = itemResult.IdeaDescription;
        var dispBImpact: any = itemResult.BusinessImpact;
        var dispMIC: any = itemResult.MainIdeaCategory;
        var dispSPI: any = itemResult.SpecialistImpact;
        var dispCI: any = itemResult.CustomersImpact;
        var dispWI: any = itemResult.WorkImpact;
        var dispMI: any = itemResult.ManagersImpact;
        var dispEI: any = itemResult.EffortsImpact;
        var dispresorcesNeeded: any = itemResult.ResourcesNeeded;
        var dispTABTI: any = itemResult.TeamsAffected;
        var dispReasoning: any = itemResult.Reasoning;
        var dispIdeaStatus: any = itemResult.IdeaStatus;
        
        var prvviews: any = itemResult.View;

        var dispOwnerComments: any = itemResult.OwnerComments;
        
        var dispManager: any = itemResult.Manager;
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
        jquery("input[name='Teamsoptions']").prop("checked", false);
        jquery("#mainideaCategory").find(":selected").attr("selected", false);
        jquery("#specialistImpact").find(":selected").attr("selected", false);
        jquery("#effortsImpact").find(":selected").attr("selected", false);
        jquery("#managersImpact").find(":selected").attr("selected", false);
        jquery("#customersImpact").find(":selected").attr("selected", false);
        jquery("#workImpact").find(":selected").attr("selected", false);
        jquery("#yourGeo").find(":selected").attr("selected", false);
        jquery("#ideaStatusId").find(":selected").attr("selected", false);
        
        jquery("#yourGeo").find("option[value='" + dispGeo + "']").attr("selected", "selected");
        jquery("#mainideaCategory").find("option[value='" + dispMIC + "']").attr("selected", "selected");
        jquery("#specialistImpact").find("option[value='" + dispSPI + "']").attr("selected", "selected");
        jquery("#effortsImpact").find("option[value='" + dispEI + "']").attr("selected", "selected");
        jquery("#managersImpact").find("option[value='" + dispMI + "']").attr("selected", "selected");
        jquery("#customersImpact").find("option[value='" + dispCI + "']").attr("selected", "selected");
        jquery("#workImpact").find("option[value='" + dispWI + "']").attr("selected", "selected");
        jquery("#ideaStatusId").find("option[value='" + dispIdeaStatus + "']").attr("selected", "selected");
        
       
        jquery("." + styles.submittedDate).empty();

        jquery("#ideaTitleid")[0].value = "";
        jquery("#ideaDescid")[0].value = "";
        jquery("#businessImpactid")[0].value = "";
        jquery("#resourceNeededId")[0].value = "";
        jquery("#reasoningId")[0].value = "";
        jquery("#NotesCommentsId")[0].value = "";
        jquery("#yourRM")[0].value = "";  
        jquery("#yourRM")[0].value = dispManager;
        jquery("#ideaTitleid")[0].value = dispTitle;
        jquery("#ideaDescid")[0].value = dispDesc;
        jquery("#businessImpactid")[0].value = dispBImpact;
        
        jquery("#resourceNeededId")[0].value = dispresorcesNeeded;
        jquery("#reasoningId")[0].value = dispReasoning;
        jquery("#NotesCommentsId")[0].value = dispOwnerComments;
        jquery("#implementationDate")[0].value = currentImplementationDate;
        
        jquery("." + styles.submittedDate).append(lasteditedDate);

        if (dispTABTI !== null) {
          var checkteamsEffected: any = dispTABTI.split(";");
          checkteamsEffected.forEach(element => {
            var val: any = element;
            jquery("input[value='" + val + "']").prop("checked", true);
          });
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
      jquery("#mainideaCategory").prop('disabled', true);
      jquery("#specialistImpact").prop('disabled', true);
      jquery("#effortsImpact").prop('disabled', true);
      jquery("#managersImpact").prop('disabled', true);
      jquery("#customersImpact").prop('disabled', true);
      jquery("#workImpact").prop('disabled', true);
      
      jquery("#yourGeo").removeAttr("disabled");
      jquery("#resourceNeededId").removeAttr("disabled");
      jquery("#reasoningId").removeAttr("disabled");
     
      jquery("#NotesCommentsId").removeAttr("disabled");
      jquery("." + styles.leadersControls).css("display", "none");
      jquery("." + styles.leadersControls).css("pointer-events", "none");
      jquery("." + styles.leadersControls).css("opacity", 0.5);
      jquery("." + styles.editDataButton).css("display", "none");
      jquery("." + styles.submitDataButton).css("display", "block");
      jquery("#ideaTitleid").prop('disabled', true);
      
      // jquery("." + styles.editDataButton).css("display", "none");
      // jquery("." + styles.submitDataButton).css("display", "block");
      // jquery("." + styles.Editcontrols).css("pointer-events", "visible");
      // jquery("." + styles.existingFiles).css("pointer-events", "visible");
      
     
      // jquery("#reasoningId").removeAttr("disabled");
     
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
            jquery("#yourGeo").prop('disabled', false);
            jquery("#reasoningId").removeAttr("disabled");
            jquery("#resourceNeededId").removeAttr("disabled");
            jquery("#NotesCommentsId").removeAttr("disabled");
            jquery("." + styles.leadersControls).css("display", "block");
            jquery("." + styles.leadersControls).css("pointer-events", "visible");
            jquery("." + styles.leadersControls).css("opacity", "");
            jquery("#resourceNeededId").removeAttr("disabled");
            jquery("#businessImpactid").removeAttr("disabled");
            jquery("#mainideaCategory").prop('disabled', false);
            jquery("#specialistImpact").prop('disabled', false);
            jquery("#effortsImpact").prop('disabled', false);
            jquery("#managersImpact").prop('disabled', false);
            jquery("#customersImpact").prop('disabled', false);
            jquery("#workImpact").prop('disabled', false);
            jquery("#NotesCommentsId").removeAttr("disabled");
            jquery("#ideaTitleid").prop('disabled', true);
          }
        }
      });
  }
  private submitData(): void {
    var logedinuser: any = jquery("." + styles.loggedinuserId)[0].innerText;
    var logedinRMname2: any = jquery("#yourRM")[0].value;
    var logedinRMname: any = jquery("." + styles.loggedinRMId);
    var logedinRMname1: any = logedinRMname[0].innerText.substring(18,(logedinRMname[0].innerText).length).replace("@autodesk.com","").replace("."," ");
    var fileInput: any = jquery("#ideafile");
    var fileName: any = jquery("#ideafile")[0].value.split("\\").pop();
    var isFileAttached: any = fileInput[0].value.length;
    var isitemid: any = jquery("." + styles.currentitemId).text();
    var yourGeo: any = jquery("#yourGeo").find(":selected").text();
    var ideaTitle: string = jquery("#ideaTitleid")[0].value;
    var ideaDesc: string = jquery("#ideaDescid")[0].value;
    var businessImpact: any = jquery("#businessImpactid")[0].value;
    var mainIdeaCategory: any = jquery("#mainideaCategory").find(":selected").text();
    var specialistImpact: any = jquery("#specialistImpact").find(":selected").text();
    var effortsImpact: any = jquery("#effortsImpact").find(":selected").text();
    var managersImpact: any = jquery("#managersImpact").find(":selected").text();
    var customersImpact: any = jquery("#customersImpact").find(":selected").text();
    var workImpact: any = jquery("#workImpact").find(":selected").text();
    
    var TeamsAffected: any = [];
    jquery.each(jquery("input[name='Teamsoptions']:checked"), function (): any {
      TeamsAffected.push(jquery(this).val());
    });
    TeamsAffected = TeamsAffected.join(";");
    
    
    var resourceNeeded: any = jquery("#resourceNeededId")[0].value;
    
    var reasoning: any = jquery("#reasoningId")[0].value;
    var ideaStaus: any = jquery("#ideaStatusId").find(":selected").text();
    var notesComments: any = jquery("#NotesCommentsId")[0].value;
    var implementationDate: any = jquery("#implementationDate")[0].value;
    var ideaViewed: any =1;
    if (yourGeo === "" || ideaTitle === "" || ideaDesc === "" || TeamsAffected === "" ||
      mainIdeaCategory === "" || specialistImpact === "" || managersImpact ===""|| effortsImpact ==="" || customersImpact === "" || workImpact ==="" || businessImpact === "" || 
      resourceNeeded === "") {
      alert("Please fill in all mandatory fields.");
    } 
    else if(isNaN(resourceNeeded)){
      jquery("#resourceNeededId").css("color", "red");
      jquery("#resourceNeededId").css("border-block-color", "red");
      alert("Please enter only numbers for Estimated potential time savings per occurrence");
    }else {
      var body: any = JSON.stringify({
        "Title": `${ideaTitle}`,
        "IdeaDescription": `${ideaDesc}`,
        "yourGeo": `${yourGeo}`,
        "BusinessImpact": `${businessImpact}`,
        "MainIdeaCategory": `${mainIdeaCategory}`,
        "SpecialistImpact": `${specialistImpact}`, 
        "TeamsAffected": `${TeamsAffected}`,
        "ManagersImpact": `${managersImpact}`, 
        "EffortsImpact": `${effortsImpact}`,  
        "CustomersImpact": `${customersImpact}`,  
        "WorkImpact": `${workImpact}`,        
        "ResourcesNeeded": `${resourceNeeded}`,
        "Reasoning": `${reasoning}`,
        "IdeaStatus": `${ideaStaus}`,
        "OwnerComments": `${notesComments}`,
        "implementationDate": `${implementationDate}`,
        "ideaEdited": `${ideaViewed}`,
        "ideaEditedBy":`${logedinuser}`,
        "Manager" : `${logedinRMname2}`
        

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
              document.location.reload();
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
              document.location.reload();
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
    
if(chb1.length === 1 && chb2.length === 1 && chb3.length === 1){
  var userGeo: any = jquery("." + styles.loggedinuserGeo)[0].innerText;
  var userOrg: any = jquery("." + styles.loggedinuserOrg)[0].innerText;
  var logedinRMname: any = jquery("." + styles.loggedinRMId);
  var userRM: any = logedinRMname[0].innerText.substring(18,(logedinRMname[0].innerText).length).replace("@autodesk.com","").replace("."," ");
  jquery("#mainideaCategory").find(":selected").attr("selected", false);
  jquery("#specialistImpact").find(":selected").attr("selected", false);
  jquery("#effortsImpact").find(":selected").attr("selected", false);
  jquery("#managersImpact").find(":selected").attr("selected", false);
  jquery("#customersImpact").find(":selected").attr("selected", false);
  jquery("#workImpact").find(":selected").attr("selected", false);
  
  jquery("#yourGeo").find(":selected").attr("selected", false);
  jquery("#ideaStatusId").find(":selected").attr("selected", false);
  
  jquery("input[name='Teamsoptions']").prop("checked", false);
  jquery("#ideaTitleid")[0].value = "";
  jquery("#ideaDescid")[0].value = "";
  jquery("#businessImpactid")[0].value = "";
  jquery("#resourceNeededId")[0].value = "";
  jquery("#reasoningId")[0].value = "";
  jquery("#NotesCommentsId")[0].value = "";
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
            document.location.reload();
          }, (error: any): void => {
            console.log("comments not updated " + allVotes);
          });
      });
  }
  private ExporttoExcel(editevt: any): any {
    var table: any = "<table class='new_tab_table' cellspacing= '3 ' cellpadding= '3 ' border= '2 '>" +
      "<tr><th>IdeaID</th><th>Vote</th><th>Created By</th><th> Geo </th>" +
      "<th> IdeaCategory </th><th> Title </th><th> IdeaDescription </th><th> BusinessImpact </th>" +
      "<th> Current Status </th><th>Reporting Manager</th></tr>";
    var reactHandler: any = this;
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')` +
      `/items?$top=5000&$filter=IdeaStatus eq 'New'&$select=Title,IdeaStatus,Author/Title,Created,IdeaDescription,CustomersImpact,WorkImpact,ManagersImpact,EffortsImpact,TeamsAffected,SpecialistImpact,MainIdeaCategory,` +
      `yourGeo,Vote,View,Id,ViewedUsers,IdeaID,VotedUsers,CommentedUsers,` +
      `Loophasbeenclosed,BusinessImpact,Reasoning,Commented,Manager&$Expand=Author&$orderby=Id desc`,
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
            "<td>" + newitem.yourGeo + "</td><td>" + newitem.MainIdeaCategory + "</td>" +
            "<td>" + newitem.Title + "</td><td>" + newitem.IdeaDescription + "</td><td>" + newitem.BusinessImpact + "</td>" +
            "<td>" + newitem.IdeaStatus + "</td><td>"+ newitem.Manager +"</td></tr>";
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
        document.location.reload();
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
          <div className={styles.loggedinuserEmail}></div>
          
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
                          <b>Business Impact</b>  : {item.BusinessImpact}<br />
                          <b>Idea Category&nbsp;&nbsp;&nbsp;&nbsp;</b>: {item.MainIdeaCategory}<br />
                          <b>Idea Description</b>  : {item.IdeaDescription}
                        </p></span></a> </div>
                  <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                  <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                  <div className={styles.ideaTeamsDiv} >{item.TeamsAffected}</div>
                  <div className={styles.ideaGeoDiv} >{item.yourGeo}</div>
                  <div className={styles.ideaRMDiv} >{item.yourGeo}</div>
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
        <div id="IdeaAckForm" className={styles.modal1}>
          <div className={styles.modalcontent1}>
            <div className={styles.SubmitformHeader}>Hello, Innovator!<span className={styles.close} onClick={this.closecommentspopup1}>&times;</span><br/><br/>
            We are excited to learn about your opportunity to improve <b>productivity and efficiency in GPS</b>. A great idea is both in-scope 
and has been researched. <br/>
<br/><b>IN SCOPE</b><br/><br/>
1) Clear problem statement<br/>
2) Challenge impacts multiple team members or teams<br/>
3) Challenge is process or system related (no policy or HR requests)<br/>
4) There is a tangible, longer-term benefit from implementing a workaround or fix.<br/><br/>
<b>RESEARCH<br/></b><br/>
<div className={styles.submitform}>
  <input type="checkbox" id="chk1" name="chk1"></input> <div className={styles.ColumnTitle1}>Have you searched for duplicate/similar ideas on the SIMPLI FI platform?</div> 
</div> 
<div className={styles.submitform}>
  <input type="checkbox" id="chk2" name="chk2"></input>	 <div className={styles.ColumnTitle1}>Have you discussed this idea with your manager?</div>
</div> <br/>
<div className={styles.submitform}>
  <br/><input type="checkbox" id="chk3" name="chk3"></input>  <div className={styles.ColumnTitle1}>I confirm my idea fulfills these criteria and is ready to be submitted</div>
</div> 
<br/>
<div className={styles.submitform}>
</div>
 </div>
      <div className={styles.submitform}>
        <input className={styles.submitcommentsButton1} type="submit" value="Proceed" onClick={() => this.submitData1()}></input>
      </div>
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
        <div id="IdeaNewForm" className={styles.modal}>
        <div className={styles.modalcontent1}>
            <div className={styles.SubmitformHeader}>Please share your idea with us by completing the fields below.
              <span className={styles.close} onClick={this.closepopup}>&times;</span>
              <div className={styles.currentitemId}></div>
              <div className={styles.currentitemOwner}></div>
              <div className={styles.loggedinRMId}></div>
            </div>
            <div className={styles.UserControls}>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Your Geo <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="yourGeo"></select></div>
              </div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Reporting Manager<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><input type="text" className={styles.Test}  id="yourRM" name="Organization"></input></div>
              </div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Opportunity Title<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <input type="text" placeholder="What is the title for your opportunity?" id="ideaTitleid" name="ideatitle"></input></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Opportunity Description <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <textarea id="ideaDescid" placeholder="Add here a link to your screencast (max 2 minutes)" name="ideaDescription"></textarea > </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Describe the challenge <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <textarea id="businessImpactid" placeholder="In one or a few sentences summarize the challenge" name="businessImpact">
                  </textarea > </div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Estimated potential time savings per occurrence? (minutes) <span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <input type="text" id="resourceNeededId" placeholder="How much time could be saved every time this challenge is found" name="ResourcesNeeded">
                  </input></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>How frequent is this challenge?<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="mainideaCategory"></select></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>What is the challenge impact to specialists?<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="specialistImpact"></select></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>What is the categories of work impacted?<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="workImpact"></select></div></div>
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>What is the challenge impact to the Customers?<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="customersImpact"></select></div></div> 
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>What is the challenge impact to Managers?<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="managersImpact"></select></div></div>
              
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Which Teams are impacted by this challenge?<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}>
                  <div id="teamsAffectedbyIdeaId" ></div></div></div>
             <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Effort Estimation?<span className={styles.mandatory}>*</span> :</div>
                <div className={styles.ColumnTypes}><select id="effortsImpact"></select></div></div>    
            </div>
            <div className={styles.Editcontrols}>
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
                <div className={styles.ColumnTitle}>Panel feedback :</div>
                <div className={styles.ColumnTypes}><textarea id="reasoningId" name="Reasoning"></textarea></div>
              </div>
            
              <div className={styles.submitform}>
                <div className={styles.ColumnTitle}>Idea Status :</div>
                <div className={styles.ColumnTypes}><select id="ideaStatusId"></select></div></div>
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
          <div className={styles.tablinks} onClick={(evt: any) => this.opencontentItems(evt)}>Under Review</div>
          <div className={styles.tablinks} onClick={(evt: any) => this.opencontentItems(evt)}>In Progress</div>
          <div className={styles.tablinks} onClick={(evt: any) => this.opencontentItems(evt)}>Implemented</div>
          <div className={styles.tablinks} onClick={(evt: any) => this.opencontentItems(evt)}>Will Not Pursue</div>
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
          <div className={styles.ideaTabsAuthor}>Teams Impact<span>
            <img onClick={(teamsevt: any) => this.sortbyTeamsImpact(teamsevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabsScore}>Score<span>
            <img onClick={(scoreevt: any) => this.sortbyScore(scoreevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabsScore}>Geo <span>
            <img onClick={(authorevt: any) => this.sortbyGEO(authorevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabsScore}>Views <span>
            <img onClick={(voteevt: any) => this.sortbyViews(voteevt)} src="../SiteAssets/sort.png" className={styles.sortImage}>
            </img></span></div>
          <div className={styles.ideaTabsScore} >Vote<span>
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
                            <div className={styles.tooltipHeader}>Idea Description :</div>
                            <div className={styles.tooltipdesc}> {item.IdeaDescription}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Business Impact :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                        </div>
                      </p>
                    </span></a> </div>
                    <div className={styles.ideaNumberDiv} >{item.IdeaID}</div>
                <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                <div className={styles.ideaTeamsDiv} >{item.TeamsAffected}</div>
                <div className={styles.ideaScoreDiv} >{item.Score}</div>
                <div className={styles.ideaGeoDiv} >{item.yourGeo}</div>
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
        <div id="UnderReview" className={styles.tabcontent}>
          {this.state.items.map((item: any, key: any): any => {
            if (item.IdeaStatus === "Under Review") {
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
                            <div className={styles.tooltipHeader}>Idea Description :</div>
                            <div className={styles.tooltipdesc}> {item.IdeaDescription}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Business Impact :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                        </div>
                      </p>
                    </span></a> </div>
                    <div className={styles.ideaNumberDiv} >{item.IdeaID}</div>
                <div className={styles.ideaDateDiv} >{item.Created.split("T")[0]}</div>
                <div className={styles.ideaAuthorDiv} >{item.Author.Title}</div>
                <div className={styles.ideaTeamsDiv} >{item.TeamsAffected}</div>
                <div className={styles.ideaScoreDiv} >{item.Score}</div>
                <div className={styles.ideaGeoDiv} >{item.yourGeo}</div>
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
        <div id="InProgress" className={styles.tabcontent}>
          {this.state.items.map((item: any, key: any): any => {
            if (item.IdeaStatus === "In Progress") {
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
                            <div className={styles.tooltipHeader}>Business Impact :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Description :</div>
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
                <div className={styles.ideaTeamsDiv} >{item.TeamsAffected}</div>
                <div className={styles.ideaScoreDiv} >{item.Score}</div>
                <div className={styles.ideaGeoDiv} >{item.yourGeo}</div>
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
                            <div className={styles.tooltipHeader}>Business Impact :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Description :</div>
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
                <div className={styles.ideaTeamsDiv} >{item.TeamsAffected}</div>
                <div className={styles.ideaScoreDiv} >{item.Score}</div>
                <div className={styles.ideaGeoDiv} >{item.yourGeo}</div>
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
        <div id="WillNotPursue" className={styles.tabcontent}>
          {this.state.items.map((item: any, key: any): any => {
            if (item.IdeaStatus === "Will not pursue") {
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
                            <div className={styles.tooltipHeader}>Business Impact :</div>
                            <div className={styles.tooltipdesc}>{item.BusinessImpact}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Category :</div>
                            <div className={styles.tooltipdesc}> {item.MainIdeaCategory}</div>
                          </div>
                          <div className={styles.tooltipRow} >
                            <div className={styles.tooltipHeader}>Idea Description :</div>
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
                <div className={styles.ideaTeamsDiv} >{item.TeamsAffected}</div>
                <div className={styles.ideaScoreDiv} >{item.Score}</div>
                <div className={styles.ideaGeoDiv} >{item.yourGeo}</div>
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