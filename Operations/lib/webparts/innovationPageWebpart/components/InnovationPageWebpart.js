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
var InnovationPageWebpart_module_scss_1 = require("./InnovationPageWebpart.module.scss");
var jquery = require("jquery");
var sp_http_1 = require("@microsoft/sp-http");
var InnovationPageWebpart = /** @class */ (function (_super) {
    __extends(InnovationPageWebpart, _super);
    function InnovationPageWebpart(props, state) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            status: "Ready",
            items: [],
            currentItems: [],
            fileInput: []
        };
        return _this;
    }
    InnovationPageWebpart.prototype.componentDidMount = function () {
        var reactHandler = this;
        var leaders = "";
        jquery.ajax({
            url: this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')/items" +
                "?$top=5000&$select=Title,IdeaStatus,Author/Title,Created,IdeaDescription,MainIdeaCategory,BusinessImpact,ROIImpact,YourOrganization," +
                "YourGEO,Vote,View,Id,ViewedUsers,IdeaID,InnovationCoachAssigned,VotedUsers,Panelpresentation,CommentedUsers," +
                "Loophasbeenclosed,Reasoning,Manager,Commented&$Expand=Author&$orderby=Id desc",
            type: "GET",
            headers: { "Accept": "application/json; odata=verbose;" },
            success: function (resultData) {
                reactHandler.setState({
                    items: resultData.d.results
                });
            },
            error: function (jqXHR) {
                console.log("error");
            }
        });
        jquery.ajax({
            url: this.props.siteUrl + "/_api/sp.userprofiles.peoplemanager/GetMyProperties",
            type: "GET",
            headers: { "Accept": "application/json; odata=verbose;" },
            success: function (userresultData) {
                var userinfoId = userresultData.d.DisplayName;
                var userproperties = userresultData.d.UserProfileProperties.results;
                var rmName = userresultData.d.UserProfileProperties.results[15].Value;
                var logedinRMname = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId);
                var logedinRMname1 = logedinRMname[0].innerText.substring(18, (logedinRMname[0].innerText).length).replace("@autodesk.com", "").replace(".", " ");
                jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserGeo).append(yourGEO);
                for (var i = 0; i < userproperties.length; i++) {
                    var property = userproperties[i];
                    if (property.Key === "GEO") {
                        var yourGEO = property.Value;
                        jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserGeo).append(yourGEO);
                    }
                    if (property.Key === "Department") {
                        var yourOrg = property.Value;
                        jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserOrg).append(yourOrg);
                    }
                    if (property.Key === "Manager") {
                        var yourRM = property.Value;
                        jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId).append(yourRM);
                    }
                }
                jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserId).append(userinfoId);
            },
            error: function (jqXHR) {
                console.log("error");
            }
        });
        jquery.ajax({
            url: this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')/fields",
            type: "GET",
            headers: { "Accept": "application/json; odata=verbose;" },
            success: function (resultData) {
                var allcolumns = resultData.d.results;
                var options;
                for (var i = 0; i < allcolumns.length; i++) {
                    if (allcolumns[i].TypeDisplayName === "Choice") {
                        if (allcolumns[i].StaticName === "MainIdeaCategory") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#mainideaCategory").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "roiCategory") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#roiCategory").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "TeamsAffectedbythisIdea") {
                            options = allcolumns[i].Choices.results;
                            for (var cb = 0; cb < options.length; cb++) {
                                var cbox = "<div className=" + InnovationPageWebpart_module_scss_1.default.CheckBoxDiv + ">" +
                                    "<input type=checkbox name=Teamsoptions value='" + options[cb] + "'>" + options[cb] + "</input><div>";
                                jquery("#teamsAffectedbyIdeaId").append(jquery(cbox));
                            }
                        }
                        if (allcolumns[i].StaticName === "IdeaStatus") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#ideaStatusId").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "Loophasbeenclosed") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#loopclosedId").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "Panelpresentation") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#PanelpresentationId").append(jquery(option));
                            });
                        }
                    }
                }
            },
            error: function (jqXHR) {
                console.log("error");
            }
        });
        document.getElementById("NewIdeas").style.display = "block";
    };
    InnovationPageWebpart.prototype.closepopup = function () {
        var modal = document.getElementById("IdeaNewForm");
        modal.style.display = "none";
    };
    InnovationPageWebpart.prototype.closeLikespopup = function () {
        var modal = document.getElementById("IdeaLikesForm");
        modal.style.display = "none";
    };
    InnovationPageWebpart.prototype.closesearchpopup = function () {
        var modal = document.getElementById("IdeaSearchForm");
        modal.style.display = "none";
    };
    InnovationPageWebpart.prototype.closecommentspopup = function () {
        var modal = document.getElementById("IdeaCommentsForm");
        modal.style.display = "none";
    };
    InnovationPageWebpart.prototype.closecommentspopup1 = function () {
        var modal = document.getElementById("IdeaAckForm");
        modal.style.display = "none";
    };
    InnovationPageWebpart.prototype.submitform = function () {
        var userGeo = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserGeo)[0].innerText;
        var userOrg = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserOrg)[0].innerText;
        var logedinRMname = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId);
        var logedinRMname1 = logedinRMname[0].innerText.substring(18, (logedinRMname[0].innerText).length).replace("@autodesk.com", "").replace(".", " ");
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
        jquery("." + InnovationPageWebpart_module_scss_1.default.existingFiles).empty();
        jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).css("display", "none");
        jquery("." + InnovationPageWebpart_module_scss_1.default.Editcontrols).css("display", "none");
        jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("display", "none");
        jquery("." + InnovationPageWebpart_module_scss_1.default.submitDataButton).css("display", "block");
        jquery("." + InnovationPageWebpart_module_scss_1.default.UserControls).css("pointer-events", "visible");
        jquery("textarea").css("pointer-events", "visible");
        jquery("textarea").removeAttr("disabled");
        jquery("." + InnovationPageWebpart_module_scss_1.default.currentitemId).empty();
        var modal = document.getElementById("IdeaAckForm");
        modal.style.display = "none";
        var modal = document.getElementById("IdeaNewForm");
        window.document.getElementById("IdeaNewForm").style.display = "block";
    };
    InnovationPageWebpart.prototype.ackForm = function () {
        jquery("." + InnovationPageWebpart_module_scss_1.default.UserControls).css("pointer-events", "visible");
        var modal = document.getElementById("IdeaAckForm");
        window.document.getElementById("IdeaAckForm").style.display = "block";
    };
    InnovationPageWebpart.prototype.searchBar = function (authorevt) {
        var reactHandler = this;
        var searchbox = jquery("." + InnovationPageWebpart_module_scss_1.default.searchBar);
        var searchKey = searchbox[0].value;
        if (searchKey !== "") {
            if (((searchKey.search('Idea #')) == "0") || ((searchKey.search('Idea#')) == "0")) {
                searchKey = searchKey.substring(6, searchKey.length);
            }
            this.props.spHttpClient.get(this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')" +
                ("/items?$top=5000&&$expand=Author&$filter=(substringof('" + searchKey + "',Title) or substringof('" + searchKey + "',Author/Title) or substringof('" + searchKey + "',IdeaID) or (IdeaStatus eq '" + searchKey + "') or") +
                (" substringof('" + searchKey + "',MainIdeaCategory) or substringof('" + searchKey + "',YourOrganization) or") +
                (" substringof('" + searchKey + "',YourGEO))&$select=Title,") +
                "IdeaStatus,IdeaID,Author/Title,Created,IdeaDescription,MainIdeaCategory,BusinessImpact,ROIImpact,YourOrganization,YourGEO," +
                "Vote,View,Id,ViewedUsers,VotedUsers,CommentedUsers,Commented&$Expand=Author&$orderby=Id desc", sp_http_1.SPHttpClient.configurations.v1, {
                headers: {
                    "Accept": "application/json;odata=nometadata",
                    "odata-version": ""
                }
            })
                .then(function (response) {
                return response.json();
            }).then(function (item) {
                reactHandler.setState({
                    currentItems: item.value
                });
                window.document.getElementById("IdeaSearchForm").style.display = "block";
            }, function (error) {
                console.log("views not updated ");
            });
        }
        else {
            alert("Please enter some keywords");
        }
    };
    InnovationPageWebpart.prototype.htmlDecode = function (input) {
        var e = document.createElement("div");
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    };
    InnovationPageWebpart.prototype.opencontentItems = function (evt) {
        var i, tabcontent, tablinks;
        var cityName = evt.target.textContent.replace(/ /g, "");
        tabcontent = jquery("." + InnovationPageWebpart_module_scss_1.default.tabcontent);
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = jquery("." + InnovationPageWebpart_module_scss_1.default.tablinks);
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" " + InnovationPageWebpart_module_scss_1.default.active, "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " " + InnovationPageWebpart_module_scss_1.default.active;
    };
    InnovationPageWebpart.prototype.sortbyVoting = function (voteevt) {
        var voteclassNames = voteevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var ttt = jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaViewDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaitemTitle);
            console.log(jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaViewDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaitemTitle)[0].innerText);
            var textA = +jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaVoteDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaitemTitle)[0].innerText;
            var textB = +jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaVoteDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaitemTitle)[0].innerText;
            if (textA < textB) {
                return 1;
            }
            if (textA > textB) {
                return -1;
            }
            return 0;
        });
        if (voteclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            voteevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            voteevt.target.classList.remove("descending");
        }
    };
    InnovationPageWebpart.prototype.sortbyViews = function (voteevt) {
        var voteclassNames = voteevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var textA = +jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaViewDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaitemTitle).text();
            var textB = +jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaViewDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaitemTitle).text();
            if (textA < textB) {
                return 1;
            }
            if (textA > textB) {
                return -1;
            }
            return 0;
        });
        if (voteclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            voteevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            voteevt.target.classList.remove("descending");
        }
    };
    //Edited By Damu
    InnovationPageWebpart.prototype.sortbyideanumber = function (numberevt) {
        var authorclassNames = numberevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        //  var firstText: any = (jquery(a).find("." + styles.ideaNumberDiv)[0].innerText).substring(6, (jquery(a).find("." + styles.ideaNumberDiv)[0].innerText).length);
        //  var secondText: any = (jquery(b).find("." + styles.ideaNumberDiv)[1].innerText).substring(6, (jquery(a).find("." + styles.ideaNumberDiv)[1].innerText).length);
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            // var textA: any = +jquery(a).find("." + styles.ideaNumberDiv).find("." + styles.ideaNumberDiv).text();
            // var textB: any = +jquery(b).find("." + styles.ideaNumberDiv).find("." + styles.ideaNumberDiv).text();
            var textA = (jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv).text()).substring(6, (jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv).text()).length);
            var textB = (jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv).text()).substring(6, (jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv).text()).length);
            if (textA < textB) {
                return 1;
            }
            if (textA > textB) {
                return -1;
            }
            return 0;
        });
        if (authorclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            numberevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            numberevt.target.classList.remove("descending");
        }
    };
    //
    InnovationPageWebpart.prototype.sortbycomments = function (voteevt) {
        var voteclassNames = voteevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var textA = +jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaCommentDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaitemTitle).text();
            var textB = +jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaCommentDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaitemTitle).text();
            if (textA < textB) {
                return 1;
            }
            if (textA > textB) {
                return -1;
            }
            return 0;
        });
        if (voteclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            voteevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            voteevt.target.classList.remove("descending");
        }
    };
    InnovationPageWebpart.prototype.parseDate = function (input) {
        var parts = input.match(/(\d+)/g);
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]); //     months are 0-based
    };
    InnovationPageWebpart.prototype.sortbyDate = function (dateevt) {
        var dateclassNames = dateevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var firstDate = jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaDateDiv).text();
            var secondDate = jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaDateDiv).text();
            return firstDate > secondDate ? -1 : firstDate < secondDate ? 1 : 0;
        });
        if (dateclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            dateevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            dateevt.target.classList.remove("descending");
        }
    };
    InnovationPageWebpart.prototype.sortbyAuthor = function (authorevt) {
        var authorclassNames = authorevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var firstText = jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv)[0].innerText;
            var secondText = jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv)[0].innerText;
            return firstText.localeCompare(secondText.toUpperCase());
        });
        if (authorclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            authorevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            authorevt.target.classList.remove("descending");
        }
    };
    InnovationPageWebpart.prototype.sortbyCoach = function (coachevt) {
        var authorclassNames = coachevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var firstText = jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaCoachDiv)[0].innerText;
            var secondText = jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaCoachDiv)[0].innerText;
            return firstText.localeCompare(secondText.toUpperCase());
        });
        if (authorclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            coachevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            coachevt.target.classList.remove("descending");
        }
    };
    InnovationPageWebpart.prototype.sortbyideanumber1 = function (numberevt) {
        var authorclassNames = numberevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var firstText = (jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv)[0].innerText).substring(6, (jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv)[0].innerText).length);
            var secondText = (jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv)[1].innerText).substring(6, (jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaNumberDiv)[1].innerText).length);
            return firstText.localeCompare(secondText.toUpperCase());
        });
        if (authorclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            numberevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            numberevt.target.classList.remove("descending");
        }
    };
    InnovationPageWebpart.prototype.sortbyOrg = function (authorevt) {
        var authorclassNames = authorevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var firstText = jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaOrgDiv)[0].innerText;
            var secondText = jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaOrgDiv)[0].innerText;
            return firstText.localeCompare(secondText.toUpperCase());
        });
        if (authorclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            authorevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            authorevt.target.classList.remove("descending");
        }
    };
    InnovationPageWebpart.prototype.sortbyGEO = function (authorevt) {
        var authorclassNames = authorevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var firstText = jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaGeoDiv)[0].innerText;
            var secondText = jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaGeoDiv)[0].innerText;
            return firstText.localeCompare(secondText.toUpperCase());
        });
        if (authorclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            authorevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            authorevt.target.classList.remove("descending");
        }
    };
    InnovationPageWebpart.prototype.comparer = function (index) {
        return function (a, b) {
            var valA = this.getCellValue(a, index), valB = this.getCellValue(b, index);
            return jquery.isNumeric(valA) && jquery.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
        };
    };
    InnovationPageWebpart.prototype.getCellValue = function (row, index) {
        return jquery(row).children("td").eq(index).text();
    };
    InnovationPageWebpart.prototype.updateIdealikes = function (likeEvt) {
        var _this = this;
        var currentItemIdvalue = likeEvt.target.parentElement.parentElement.parentElement.firstElementChild.innerText;
        var currentlogedinuser = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserId)[0].innerText;
        var finalusersarray = "";
        var isuserVoted = false;
        var itemResult = "";
        var dispVotes = "";
        var existingvotes = "";
        var allVotes = "";
        var allusers = "";
        var allusersComments = "";
        var finalusers = "";
        var userarray = "";
        var body = "";
        this.props.spHttpClient.get(this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')" +
            ("/items('" + currentItemIdvalue + "')"), sp_http_1.SPHttpClient.configurations.v1, {
            headers: {
                "Accept": "application/json;odata=nometadata",
                "odata-version": ""
            }
        })
            .then(function (response) {
            return response.json();
        }).then(function (item) {
            if (item.VotedUsers !== null) {
                var votedusers = item.VotedUsers.split(",");
                finalusersarray = _this.uniqueItems(votedusers);
                for (var i = 0; i < finalusersarray.length; i++) {
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
                    var index = finalusersarray.indexOf(currentlogedinuser);
                    if (index > -1) {
                        finalusersarray.splice(index, 1);
                    }
                    body = JSON.stringify({
                        "Vote": "" + allVotes,
                        "VotedUsers": "" + finalusersarray
                    });
                    _this.props.spHttpClient.post(_this.props.siteUrl + "/_api/web/lists/getbytitle('" + _this.props.listName + "')/" +
                        ("items(" + currentItemIdvalue + ")"), sp_http_1.SPHttpClient.configurations.v1, {
                        headers: {
                            "Accept": "application/json;odata=nometadata",
                            "Content-type": "application/json;odata=nometadata",
                            "odata-version": "",
                            "IF-MATCH": "*",
                            "X-HTTP-Method": "MERGE"
                        },
                        body: body
                    })
                        .then(function (response) {
                        alert("You have successfully removed your vote for this idea.");
                        document.location.reload(true);
                    }, function (error) {
                        console.log("votes not updated " + allVotes);
                    });
                    jquery("." + InnovationPageWebpart_module_scss_1.default.currentLikesitemId).empty();
                    jquery("." + InnovationPageWebpart_module_scss_1.default.currentLikesitemId).append(currentItemIdvalue);
                }
                else {
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
                    finalusersarray = _this.uniqueItems(userarray);
                    body = JSON.stringify({
                        "Vote": "" + allVotes,
                        "VotedUsers": "" + finalusersarray
                    });
                    _this.props.spHttpClient.post(_this.props.siteUrl + "/_api/web/lists/getbytitle('" + _this.props.listName + "')/" +
                        ("items(" + currentItemIdvalue + ")"), sp_http_1.SPHttpClient.configurations.v1, {
                        headers: {
                            "Accept": "application/json;odata=nometadata",
                            "Content-type": "application/json;odata=nometadata",
                            "odata-version": "",
                            "IF-MATCH": "*",
                            "X-HTTP-Method": "MERGE"
                        },
                        body: body
                    })
                        .then(function (response) {
                        alert("Thank you for casting your vote on this idea.");
                        document.location.reload(true);
                    }, function (error) {
                        console.log("views not updated " + allVotes);
                    });
                    jquery("." + InnovationPageWebpart_module_scss_1.default.currentLikesitemId).empty();
                    jquery("." + InnovationPageWebpart_module_scss_1.default.currentLikesitemId).append(currentItemIdvalue);
                }
            }
            else {
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
                finalusersarray = _this.uniqueItems(userarray);
                body = JSON.stringify({
                    "Vote": "" + allVotes,
                    "VotedUsers": "" + finalusersarray
                });
                _this.props.spHttpClient.post(_this.props.siteUrl + "/_api/web/lists/getbytitle('" + _this.props.listName + "')/" +
                    ("items(" + currentItemIdvalue + ")"), sp_http_1.SPHttpClient.configurations.v1, {
                    headers: {
                        "Accept": "application/json;odata=nometadata",
                        "Content-type": "application/json;odata=nometadata",
                        "odata-version": "",
                        "IF-MATCH": "*",
                        "X-HTTP-Method": "MERGE"
                    },
                    body: body
                })
                    .then(function (response) {
                    alert("Thank you for casting your vote on this idea.");
                    document.location.reload(true);
                }, function (error) {
                    console.log("views not updated " + allVotes);
                });
                jquery("." + InnovationPageWebpart_module_scss_1.default.currentLikesitemId).empty();
                jquery("." + InnovationPageWebpart_module_scss_1.default.currentLikesitemId).append(currentItemIdvalue);
            }
        }, function (error) {
            console.log("Likes not updated ");
        });
    };
    InnovationPageWebpart.prototype.openIdeacomments = function (chatEvt) {
        var currentItemIdvalue = chatEvt.target.parentElement.parentElement.parentElement.firstElementChild.innerText;
        jquery("." + InnovationPageWebpart_module_scss_1.default.currentcommentsitemId).empty();
        jquery("#userComments")[0].value = "";
        jquery("." + InnovationPageWebpart_module_scss_1.default.currentcommentsitemId).append(currentItemIdvalue);
        var modal = document.getElementById("IdeaCommentsForm");
        this.props.spHttpClient.get(this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')" +
            ("/items('" + currentItemIdvalue + "')"), sp_http_1.SPHttpClient.configurations.v1, {
            headers: {
                "Accept": "application/json;odata=nometadata",
                "odata-version": ""
            }
        })
            .then(function (response) {
            return response.json();
        }).then(function (item) {
            var alluserscomments = item.Comments;
            jquery("." + InnovationPageWebpart_module_scss_1.default.allComments)[0].innerHTML = alluserscomments;
            jquery("." + InnovationPageWebpart_module_scss_1.default.currentLikesitemId).append(currentItemIdvalue);
            window.document.getElementById("IdeaCommentsForm").style.display = "block";
        }, function (error) {
            console.log("views not updated ");
        });
    };
    InnovationPageWebpart.prototype.openideaItem = function (itmEvt) {
        var _this = this;
        var currentItemIdvalue = itmEvt.target.parentElement.previousElementSibling.innerText;
        var itemOwner = itmEvt.target.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
        jquery("." + InnovationPageWebpart_module_scss_1.default.allComments)[0].innerHTML = "";
        var presentTag = itmEvt.target.parentElement.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
        return this.props.spHttpClient.get(this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')" +
            ("/items('" + currentItemIdvalue + "')?$select=Title,IdeaStatus,AttachmentFiles,Author/Title,IdeaDescription,TeamsAffected,") +
            "MainIdeaCategory,ResourcesNeeded,OtherStakeholderscurrentlyinvolv,RoughTimeIndication,Roadblocks,EstimatedCompletion," +
            "OwnerComments,Fasttrack,Ideaproceedstonextstage,presentationDate,expiryDate,implementationDate,BudgetItem," +
            "YourGEO,Vote,View,Id,ViewedUsers,IdeaID,InnovationCoachAssigned,VotedUsers,Panelpresentation,Created,Modified,CommentedUsers," +
            "Loophasbeenclosed,BusinessImpact,ROIImpact,YourOrganization,Nextsteps,Reasoning,ActionsCompleted,Manager,Commented&$Expand=Author,AttachmentFiles", sp_http_1.SPHttpClient.configurations.v1, {
            headers: {
                "Accept": "application/json;odata=nometadata",
                "odata-version": ""
            }
        })
            .then(function (response) {
            return response.json();
        })
            .then(function (item) {
            var itemResult = item;
            var dispTitle = itemResult.Title;
            var dispOrg = itemResult.YourOrganization;
            var dispGeo = itemResult.YourGEO;
            var dispDesc = itemResult.IdeaDescription;
            var dispBImpact = itemResult.BusinessImpact;
            var dispROIImpact = itemResult.ROIImpact;
            var dispMIC = itemResult.MainIdeaCategory;
            var dispROIC = itemResult.roiCategory;
            var dispOSCI = itemResult.OtherStakeholderscurrentlyinvolv;
            var dispTABTI = itemResult.TeamsAffected;
            var dispresorcesNeeded = itemResult.ResourcesNeeded;
            var dispBitem = itemResult.BudgetItem;
            var dispRTI = itemResult.RoughTimeIndication;
            var dispIPTNS = itemResult.Ideaproceedstonextstage;
            var dispReasoning = itemResult.Reasoning;
            var dispICA = itemResult.InnovationCoachAssigned;
            var dispFastTrack = itemResult.Fasttrack;
            var dispIdeaStatus = itemResult.IdeaStatus;
            var LoophasbeenclosedStatus = itemResult.Loophasbeenclosed;
            var panelpresentaion = itemResult.Panelpresentation;
            var prvviews = itemResult.View;
            var dispActionscompleted = itemResult.ActionsCompleted;
            var dispRoadblocks = itemResult.Roadblocks;
            var dispNextsteps = itemResult.Nextsteps;
            var dispEstimatedCompletion = itemResult.EstimatedCompletion;
            var dispOwnerComments = itemResult.OwnerComments;
            var dispResolved = itemResult.Resolved;
            var dispManager = itemResult.Manager;
            var currentpresentationDate = itemResult.presentationDate;
            var currentExpiryDate = itemResult.expiryDate;
            var currentImplementationDate = itemResult.implementationDate;
            var lasteditedDate = itemResult.Modified.split("T")[0];
            var existfiles = itemResult.AttachmentFiles;
            jquery("." + InnovationPageWebpart_module_scss_1.default.existingFiles).empty();
            existfiles.forEach(function (existfile) {
                var exifilename = existfile.FileName;
                var exisfileurl = existfile.ServerRelativeUrl;
                var filehtml = "<a href='" + exisfileurl + "' download>" + exifilename + "</a><br/>";
                jquery("." + InnovationPageWebpart_module_scss_1.default.existingFiles).append(filehtml);
                // <div dangerouslySetInnerHTML={{ __html: uniqueVoters }} />
            });
            if (prvviews === null) {
                prvviews = 0;
            }
            var presentViews = parseInt(prvviews, 10);
            var allviews = presentViews + 1;
            var allusers = itemResult.ViewedUsers;
            if (allusers === null) {
                allusers = "";
            }
            var logedinuser = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserId)[0].innerText;
            var finalusers = allusers + logedinuser + ",";
            if (panelpresentaion === "Completed" || panelpresentaion === "Scheduled") {
                jquery("#PresentationDate").css("display", "block");
            }
            else {
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
            jquery("." + InnovationPageWebpart_module_scss_1.default.submittedDate).empty();
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
            jquery("." + InnovationPageWebpart_module_scss_1.default.submittedDate).append(lasteditedDate);
            if (dispTABTI !== null) {
                var checkteamsEffected = dispTABTI.split(";");
                checkteamsEffected.forEach(function (element) {
                    var val = element;
                    jquery("input[value='" + val + "']").prop("checked", true);
                });
            }
            if (dispResolved === "Yes") {
                jquery("input[name='Resolved']").prop("checked", true);
            }
            jquery("." + InnovationPageWebpart_module_scss_1.default.currentitemId).empty();
            jquery("." + InnovationPageWebpart_module_scss_1.default.currentitemId).append(currentItemIdvalue);
            jquery("." + InnovationPageWebpart_module_scss_1.default.currentitemOwner).empty();
            jquery("." + InnovationPageWebpart_module_scss_1.default.currentitemOwner).append(itemOwner);
            jquery("." + InnovationPageWebpart_module_scss_1.default.submitDataButton).css("display", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).css("display", "block");
            jquery("." + InnovationPageWebpart_module_scss_1.default.Editcontrols).css("display", "block");
            jquery("." + InnovationPageWebpart_module_scss_1.default.existingFiles).css("display", "block");
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("display", "block");
            jquery("." + InnovationPageWebpart_module_scss_1.default.UserControls).css("pointer-events", "none");
            jquery("textarea").css("pointer-events", "visible");
            jquery("textarea").prop("disabled", "disabled");
            jquery("." + InnovationPageWebpart_module_scss_1.default.Editcontrols).css("pointer-events", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("pointer-events", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("opacity", 0.5);
            var modal = document.getElementById("IdeaNewForm");
            window.document.getElementById("IdeaNewForm").style.display = "block";
            var userarray = finalusers.split(",");
            var finalusersarray = _this.uniqueItems(userarray);
            jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).prop("disabled", true).css("opacity", 0.5);
            if (logedinuser === itemOwner) {
                jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).prop("disabled", false).css("opacity", "");
                //jquery("." + styles.UserControls).css("pointer-events", "block");
            }
            _this.props.spHttpClient.get(_this.props.siteUrl + "/_api/web/lists/getbytitle('InnovationLeaders')" +
                "/items?$select=Leader/Title&$Expand=Leader&$top=5000", sp_http_1.SPHttpClient.configurations.v1, {
                headers: {
                    "Accept": "application/json;odata=nometadata",
                    "odata-version": ""
                }
            })
                .then(function (response) {
                return response.json();
            })
                .then(function (item) {
                for (var i = 0; i < item.value.length; i++) {
                    if (item.value[i].Leader.Title === logedinuser) {
                        jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).prop("disabled", false).css("opacity", "");
                    }
                }
            });
            //var ideaViewed: any =0;
            var body = JSON.stringify({
                "View": "" + allviews,
                "ViewedUsers": "" + finalusersarray
                //"ideaEdited": `${ideaViewed}`
            });
            _this.props.spHttpClient.post(_this.props.siteUrl + "/_api/web/lists/getbytitle('" + _this.props.listName + "')/items(" + item.Id + ")", sp_http_1.SPHttpClient.configurations.v1, {
                headers: {
                    "Accept": "application/json;odata=nometadata",
                    "Content-type": "application/json;odata=nometadata",
                    "odata-version": "",
                    "IF-MATCH": "*",
                    "X-HTTP-Method": "MERGE"
                },
                body: body
            })
                .then(function (response) {
                console.log("views updated " + allviews);
                presentTag.children[1].innerText = allviews;
            }, function (error) {
                console.log("views not updated " + allviews);
            });
        });
    };
    InnovationPageWebpart.prototype.uniqueItems = function (list) {
        var result = [];
        jquery.each(list, function (i, e) {
            if (jquery.inArray(e, result) === -1) {
                result.push(e);
            }
        });
        return result;
    };
    InnovationPageWebpart.prototype.editItemData = function (editevt) {
        jquery("#PanelpresentationId").on("change", function () {
            if (this.value === "Completed" || this.value === "Scheduled") {
                jquery("#PresentationDate").css("display", "block");
            }
            else {
                jquery("#PresentationDate").css("display", "none");
            }
        });
        jquery("." + InnovationPageWebpart_module_scss_1.default.UserControls).css("pointer-events", "none");
        var logedinuser = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserId)[0].innerText;
        var currentItemOwner = jquery("." + InnovationPageWebpart_module_scss_1.default.currentitemOwner)[0].innerText;
        if (logedinuser === currentItemOwner) {
            jquery("." + InnovationPageWebpart_module_scss_1.default.UserControls).css("display", "block");
            jquery("." + InnovationPageWebpart_module_scss_1.default.UserControls).css("pointer-events", "visible");
            jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).css("display", "block");
            jquery("." + InnovationPageWebpart_module_scss_1.default.submitDataButton).css("display", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.Editcontrols).css("pointer-events", "visible");
            jquery("." + InnovationPageWebpart_module_scss_1.default.existingFiles).css("pointer-events", "visible");
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
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("display", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("pointer-events", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("opacity", 0.5);
            jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).css("display", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.submitDataButton).css("display", "block");
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
        this.props.spHttpClient.get(this.props.siteUrl + "/_api/web/lists/getbytitle('InnovationLeaders')" +
            "/items?$select=Leader/Title&$Expand=Leader&$top=5000", sp_http_1.SPHttpClient.configurations.v1, {
            headers: {
                "Accept": "application/json;odata=nometadata",
                "odata-version": ""
            }
        })
            .then(function (response) {
            return response.json();
        })
            .then(function (item) {
            for (var i = 0; i < item.value.length; i++) {
                if (item.value[i].Leader.Title === logedinuser) {
                    jquery("." + InnovationPageWebpart_module_scss_1.default.UserControls).css("display", "block");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.UserControls).css("pointer-events", "visible");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).css("display", "none");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.submitDataButton).css("display", "block");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.Editcontrols).css("pointer-events", "visible");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.existingFiles).css("pointer-events", "visible");
                    jquery("#businessImpactid").removeAttr("disabled");
                    jquery("#roiImpactid").removeAttr("disabled");
                    jquery("#yourgeo").removeAttr("disabled");
                    jquery("#reasoningId").removeAttr("disabled");
                    jquery("#resourceNeededId").removeAttr("disabled");
                    jquery("#NextstepsId").removeAttr("disabled");
                    jquery("#NotesCommentsId").removeAttr("disabled");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("display", "block");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("pointer-events", "visible");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("opacity", "");
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
    };
    InnovationPageWebpart.prototype.submitData = function () {
        var _this = this;
        var logedinuser = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserId)[0].innerText;
        var logedinRMname = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId);
        var logedinRMname1 = logedinRMname[0].innerText.substring(18, (logedinRMname[0].innerText).length).replace("@autodesk.com", "").replace(".", " ");
        var fileInput = jquery("#ideafile");
        var fileName = jquery("#ideafile")[0].value.split("\\").pop();
        var isFileAttached = fileInput[0].value.length;
        var isitemid = jquery("." + InnovationPageWebpart_module_scss_1.default.currentitemId).text();
        var yourorganization = jquery("#yourorg")[0].value;
        var yourGeo = jquery("#yourgeo")[0].value;
        var ideaTitle = jquery("#ideaTitleid")[0].value;
        var ideaDesc = jquery("#ideaDescid")[0].value;
        var businessImpact = jquery("#businessImpactid")[0].value;
        var roiImpact = jquery("#roiImpactid")[0].value;
        var mainIdeaCategory = jquery("#mainideaCategory").find(":selected").text();
        var roiCategory = jquery("#roiCategory").find(":selected").text();
        var otherStakeholders = jquery("#otherstakeholdersid")[0].value;
        var TeamsAffected = [];
        jquery.each(jquery("input[name='Teamsoptions']:checked"), function () {
            TeamsAffected.push(jquery(this).val());
        });
        TeamsAffected = TeamsAffected.join(";");
        var resourceNeeded = jquery("#resourceNeededId")[0].value;
        var budgetItem = jquery("#budgetItemId").find(":selected").text();
        var roughTimeIndication = jquery("#roughItemId")[0].value;
        var ideaProceeds = jquery("#idearProceedsId").find(":selected").text();
        var reasoning = jquery("#reasoningId")[0].value;
        var innovationCoach = jquery("#innovationCoachId")[0].value;
        var fastTrack = jquery("#fastTrackid").find(":selected").text();
        var ideaStaus = jquery("#ideaStatusId").find(":selected").text();
        var loopclosed = jquery("#loopclosedId").find(":selected").text();
        var panelPresentation = jquery("#PanelpresentationId").find(":selected").text();
        var actionsCompleted = jquery("#ActionsCompletedId")[0].value;
        var roadblocks = jquery("#RoadblocksId")[0].value;
        var nextSteps = jquery("#NextstepsId")[0].value;
        var estimatedCompletion = jquery("#EstimatedcompletionId")[0].value;
        var notesComments = jquery("#NotesCommentsId")[0].value;
        var resolved = jquery("input[name='Resolved']:checked").val();
        var presentationDate = jquery("#PresentationDate")[0].value;
        var expiryDate = jquery("#expiryDate")[0].value;
        var implementationDate = jquery("#implementationDate")[0].value;
        var ideaViewed = 1;
        if (yourorganization === "" || yourGeo === "" || ideaTitle === "" || ideaDesc === "" ||
            mainIdeaCategory === "" || roiCategory === "" || roiImpact === "" || businessImpact === "" || TeamsAffected === "" ||
            roughTimeIndication === "" || resourceNeeded === "" || budgetItem === "" || otherStakeholders === "") {
            alert("Please fill in all mandatory fields.");
        }
        else {
            var body = JSON.stringify({
                "YourOrganization": "" + yourorganization,
                "Title": "" + ideaTitle,
                "IdeaDescription": "" + ideaDesc,
                "YourGEO": "" + yourGeo,
                "BusinessImpact": "" + businessImpact,
                "ROIImpact": "" + roiImpact,
                "MainIdeaCategory": "" + mainIdeaCategory,
                "roiCategory": "" + roiCategory,
                "OtherStakeholderscurrentlyinvolv": "" + otherStakeholders,
                "TeamsAffected": "" + TeamsAffected,
                "ResourcesNeeded": "" + resourceNeeded,
                "BudgetItem": "" + budgetItem,
                "RoughTimeIndication": "" + roughTimeIndication,
                "Ideaproceedstonextstage": "" + ideaProceeds,
                "Reasoning": "" + reasoning,
                "InnovationCoachAssigned": "" + innovationCoach,
                "Fasttrack": "" + fastTrack,
                "IdeaStatus": "" + ideaStaus,
                "ActionsCompleted": "" + actionsCompleted,
                "Roadblocks": "" + roadblocks,
                "Nextsteps": "" + nextSteps,
                "EstimatedCompletion": "" + estimatedCompletion,
                "OwnerComments": "" + notesComments,
                "Resolved": "" + resolved,
                "Loophasbeenclosed": "" + loopclosed,
                "Panelpresentation": "" + panelPresentation,
                "presentationDate": "" + presentationDate,
                "expiryDate": "" + expiryDate,
                "implementationDate": "" + implementationDate,
                "ideaEdited": "" + ideaViewed,
                "ideaEditedBy": "" + logedinuser,
                "Manager": "" + logedinRMname1
            });
            if (isitemid !== "") {
                this.props.spHttpClient.post(this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')/items(" + isitemid + ")", sp_http_1.SPHttpClient.configurations.v1, {
                    headers: {
                        "Accept": "application/json;odata=nometadata",
                        "Content-type": "application/json;odata=nometadata",
                        "odata-version": "",
                        "IF-MATCH": "*",
                        "X-HTTP-Method": "MERGE"
                    },
                    body: body
                })
                    .then(function (response) {
                    var newitemurl = response.url;
                    console.log(newitemurl);
                    if (isFileAttached !== 0) {
                        var getFile = _this.getFileBuffer(fileInput);
                        getFile.done(function (arrayBuffer) {
                            var addFile = _this.addFileToFolder(arrayBuffer, newitemurl, fileInput);
                        });
                    }
                    else {
                        var modal = document.getElementById("IdeaNewForm");
                        modal.style.display = "none";
                        document.location.reload(true);
                    }
                }, function (error) {
                    alert("Error updating item : " + error);
                });
            }
            else {
                this.props.spHttpClient.post(this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')/items", sp_http_1.SPHttpClient.configurations.v1, {
                    headers: {
                        "Accept": "application/json;odata=nometadata",
                        "Content-type": "application/json;odata=nometadata",
                        "odata-version": ""
                    },
                    body: body
                })
                    .then(function (response) {
                    return response.json();
                })
                    .then(function (item) {
                    var newitemurl = _this.props.siteUrl + "/_api/web/lists/getbytitle('" + _this.props.listName + "')/items(" + item.Id + ")";
                    console.log(newitemurl);
                    if (isFileAttached !== 0) {
                        var getFile = _this.getFileBuffer(fileInput);
                        getFile.done(function (arrayBuffer) {
                            var addFile = _this.addFileToFolder(arrayBuffer, newitemurl, fileInput);
                        });
                    }
                    else {
                        var modal = document.getElementById("IdeaNewForm");
                        modal.style.display = "none";
                        document.location.reload(true);
                    }
                }, function (error) {
                    console.log("Item Not created" + error);
                });
            }
        }
    };
    InnovationPageWebpart.prototype.submitData1 = function () {
        var chb1 = jquery("input[name='chk1']:checked");
        var chb2 = jquery("input[name='chk2']:checked");
        var chb3 = jquery("input[name='chk3']:checked");
        var chb4 = jquery("input[name='chk4']:checked");
        if (chb1.length === 1 && chb2.length === 1 && chb3.length === 1 && chb4.length === 1) {
            var userGeo = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserGeo)[0].innerText;
            var userOrg = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserOrg)[0].innerText;
            var logedinRMname = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId);
            var userRM = logedinRMname[0].innerText.substring(18, (logedinRMname[0].innerText).length).replace("@autodesk.com", "").replace(".", " ");
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
            jquery("." + InnovationPageWebpart_module_scss_1.default.existingFiles).empty();
            jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).css("display", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.Editcontrols).css("display", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("display", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.submitDataButton).css("display", "block");
            jquery("." + InnovationPageWebpart_module_scss_1.default.UserControls).css("pointer-events", "visible");
            jquery("textarea").css("pointer-events", "visible");
            jquery("textarea").removeAttr("disabled");
            jquery("." + InnovationPageWebpart_module_scss_1.default.currentitemId).empty();
            var modal = document.getElementById("IdeaAckForm");
            modal.style.display = "none";
            var modal = document.getElementById("IdeaNewForm");
            window.document.getElementById("IdeaNewForm").style.display = "block";
        }
        else {
            alert("Please select check boxes.");
        }
    };
    InnovationPageWebpart.prototype.submitcomments = function () {
        var _this = this;
        var isitemid = jquery("." + InnovationPageWebpart_module_scss_1.default.currentcommentsitemId).text();
        return this.props.spHttpClient.get(this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')" +
            ("/items('" + isitemid + "')"), sp_http_1.SPHttpClient.configurations.v1, {
            headers: {
                "Accept": "application/json;odata=nometadata",
                "odata-version": ""
            }
        })
            .then(function (response) {
            return response.json();
        })
            .then(function (item) {
            var itemResult = item;
            var dispVotes = itemResult.Commented;
            if (dispVotes === null) {
                dispVotes = 0;
            }
            var existingvotes = parseInt(dispVotes, 10);
            var allVotes = existingvotes + 1;
            var allusersComments = itemResult.Comments;
            var allcommentedusers = itemResult.CommentedUsers;
            if (allusersComments === null) {
                allusersComments = "";
            }
            if (allcommentedusers === null) {
                allcommentedusers = "";
            }
            var logedinuser = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserId)[0].innerText;
            var presentDate = new Date();
            var commentingDate = presentDate.getFullYear() + "/" + (presentDate.getMonth() + 1) + "/" + presentDate.getDate();
            var userComments = logedinuser + " &#58; " + commentingDate + " &#58; " +
                jquery("#userComments")[0].value + "</br>" + allusersComments;
            var commentedUsers = logedinuser + "," + allcommentedusers;
            var userarray = commentedUsers.split(",");
            var finalusersarray = _this.uniqueItems(userarray);
            var body = JSON.stringify({
                "Commented": "" + allVotes,
                "Comments": "" + userComments,
                "CommentedUsers": "" + finalusersarray
            });
            _this.props.spHttpClient.post(_this.props.siteUrl + "/_api/web/lists/getbytitle('" + _this.props.listName + "')/items(" + item.Id + ")", sp_http_1.SPHttpClient.configurations.v1, {
                headers: {
                    "Accept": "application/json;odata=nometadata",
                    "Content-type": "application/json;odata=nometadata",
                    "odata-version": "",
                    "IF-MATCH": "*",
                    "X-HTTP-Method": "MERGE"
                },
                body: body
            })
                .then(function (response) {
                console.log("comments updated " + allVotes);
                document.location.reload(true);
            }, function (error) {
                console.log("comments not updated " + allVotes);
            });
        });
    };
    InnovationPageWebpart.prototype.ExporttoExcel = function (editevt) {
        var _this = this;
        var table = "<table class='new_tab_table' cellspacing= '3 ' cellpadding= '3 ' border= '2 '>" +
            "<tr><th>IdeaID</th><th>Vote</th><th>Created By</th><th> Geo </th><th> Organization </th>" +
            "<th> IdeaCategory </th><th> Title </th><th> IdeaDescription </th><th> BusinessImpact </th>" +
            "<th>  Quantifiable ROI Justification </th><th>ROI Category</th><th> Innovation Coach assigned </th><th> Next Steps </th><th> Action Taken </th>" +
            "<th> Current Status </th><th>Reporting Manager</th></tr>";
        var reactHandler = this;
        this.props.spHttpClient.get(this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')" +
            "/items?$top=5000&$filter=IdeaStatus eq 'New'&$select=Title,IdeaStatus,Author/Title,Created,IdeaDescription,MainIdeaCategory," +
            "YourGEO,Vote,View,Id,ViewedUsers,IdeaID,InnovationCoachAssigned,VotedUsers,Panelpresentation,CommentedUsers," +
            "Loophasbeenclosed,BusinessImpact,ROIImpact,roiCategory,YourOrganization,Nextsteps,Reasoning,ActionsCompleted,Commented,Manager&$Expand=Author&$orderby=Id desc", sp_http_1.SPHttpClient.configurations.v1, {
            headers: {
                "Accept": "application/json;odata=nometadata",
                "odata-version": ""
            }
        })
            .then(function (response) {
            return response.json();
        }).then(function (newitems) {
            newitems.value.forEach(function (newitem) {
                table = table + "<tr><td>" + newitem.IdeaID + "</td><td>" + newitem.Vote + "</td><td>" + newitem.Author.Title + "</td>" +
                    "<td>" + newitem.YourGEO + "</td><td>" + newitem.YourOrganization + "</td><td>" + newitem.MainIdeaCategory + "</td>" +
                    "<td>" + newitem.Title + "</td><td>" + newitem.IdeaDescription + "</td><td>" + newitem.BusinessImpact + "</td>" +
                    "<td>" + newitem.ROIImpact + "</td><td>" + newitem.roiCategory + "</td><td>" + newitem.InnovationCoachAssigned + "</td>" +
                    "<td>" + newitem.Nextsteps + "</td><td>" + newitem.ActionsCompleted + "</td><td>" + newitem.Reasoning + "</td><td>" + newitem.Manager + "</td></tr>";
            });
            table = table + "</table>";
            var ua = _this.props.currentBrowser;
            var msie = ua.indexOf("MSIE ");
            var newideasDiv = "";
            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { // if Internet Explorer
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([table], {
                        type: "application/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, "Test file.xls");
                }
            }
            else {
                var a = document.createElement("a");
                var result = "data:application/vnd.ms-excel," + encodeURIComponent(table); // $('#NewIdeas')
                a.href = result;
                // setting the file name
                a.download = "newideas.xls";
                // triggering the function
                a.click();
                // just in case, prevent default behaviour
                // e.preventDefault();
                // window.open('data:application/vnd.ms-excel,JustOneThingReport' + encodeURIComponent($('#assessmentTable').html()));
            }
        }, function (error) {
            console.log("views not updated ");
        });
    };
    InnovationPageWebpart.prototype.getFileBuffer = function (fileInput) {
        var deferred = jquery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            deferred.resolve(e.target.result);
        };
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        };
        reader.readAsArrayBuffer(fileInput[0].files[0]);
        return deferred.promise();
    };
    InnovationPageWebpart.prototype.addFileToFolder = function (arrayBuffer, executeUpdateUrl, fileInput) {
        // get the file name from the file input control on the page.
        var parts = fileInput[0].value.split("\\");
        var fileName = parts[parts.length - 1];
        this.props.spHttpClient.post(executeUpdateUrl + "/AttachmentFiles/add(FileName='" + fileName + "')", sp_http_1.SPHttpClient.configurations.v1, {
            headers: {
                "Accept": "application/json;odata=nometadata",
                "Content-type": "application/json;odata=nometadata",
                "odata-version": "",
                "IF-MATCH": "*",
                "X-HTTP-Method": "MERGE"
            },
            body: arrayBuffer
        })
            .then(function (response) {
            console.log("uploaded");
            document.location.reload(true);
        }, function (error) {
            console.log("done");
        });
    };
    InnovationPageWebpart.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.innovationPageWebpart },
            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.instructions },
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.instructionsRightDiv },
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.GotAnIdea, onClick: this.ackForm }, "Have an idea? Click here to share it!"),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaSearchBar },
                        React.createElement("input", { type: "text", className: InnovationPageWebpart_module_scss_1.default.searchBar, name: "ideasearchbar", placeholder: "Search Ideas" }),
                        React.createElement("img", { onClick: function (authorevt) { return _this.searchBar(authorevt); }, src: "../SiteAssets/Search.png", className: InnovationPageWebpart_module_scss_1.default.searchIcon }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.loggedinuserId }),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.loggedinuserGeo }),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.loggedinuserOrg }),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.loggedinRMId })),
            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.exportnewidea },
                React.createElement("iframe", { id: "txtArea1", className: InnovationPageWebpart_module_scss_1.default.NewIdeaiframe }),
                React.createElement("input", { className: InnovationPageWebpart_module_scss_1.default.ExportDataButton, type: "submit", value: "Export New Ideas", onClick: function (editevt) { return _this.ExporttoExcel(editevt); } })),
            React.createElement("div", { id: "IdeaSearchForm", className: InnovationPageWebpart_module_scss_1.default.modal },
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.modalcontent },
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.SubmitformHeader },
                        React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.close, onClick: this.closesearchpopup }, "\u00D7")),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideacontainer },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsID },
                            "Idea #",
                            React.createElement("span", null)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsTitle }, "Description"),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsDate },
                            "Date",
                            React.createElement("span", null)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsAuthor },
                            "Innovator",
                            React.createElement("span", null)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsOrg },
                            "Org ",
                            React.createElement("span", null)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                            "Geo ",
                            React.createElement("span", null)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                            "Views ",
                            React.createElement("span", null)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                            "Vote",
                            React.createElement("span", null)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                            "Comment",
                            React.createElement("span", null)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                            "Idea Status",
                            React.createElement("span", null))),
                    this.state.currentItems.map(function (item, key) {
                        if (item.VotedUsers !== null) {
                            var uniqueVoters = "";
                            var isuservoted = "";
                            item.VotedUsers.split(",").forEach(function (element) {
                                if (element === _this.props.currentloginuser) {
                                    isuservoted = InnovationPageWebpart_module_scss_1.default.votedIdea;
                                }
                                uniqueVoters = uniqueVoters + element + "<br/>";
                            });
                        }
                        if (item.CommentedUsers !== null) {
                            var isuserCommented = "";
                            item.CommentedUsers.split(",").forEach(function (commented) {
                                if (commented === _this.props.currentloginuser) {
                                    isuserCommented = InnovationPageWebpart_module_scss_1.default.commentedIdea;
                                }
                            });
                        }
                        return (React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.Newides },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaIdeaIDDiv }, item.IdeaID),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTitleDiv },
                                React.createElement("a", { className: InnovationPageWebpart_module_scss_1.default.TitleHover, href: "#", onClick: function (itmEvt) { return _this.openideaItem(itmEvt); } },
                                    item.Title,
                                    React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.tooltiptext },
                                        React.createElement("p", null,
                                            React.createElement("b", null, "Business Case"),
                                            "  : ",
                                            item.BusinessImpact,
                                            React.createElement("br", null),
                                            React.createElement("b", null, "Idea Category\u00A0\u00A0\u00A0\u00A0"),
                                            ": ",
                                            item.MainIdeaCategory,
                                            React.createElement("br", null),
                                            React.createElement("b", null, "Describe your Idea"),
                                            "  : ",
                                            item.IdeaDescription))),
                                " "),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaOrgDiv }, item.YourOrganization),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.YourGEO),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaRMDiv }, item.YourGEO),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaViewDiv },
                                React.createElement("span", null,
                                    React.createElement("img", { className: InnovationPageWebpart_module_scss_1.default.ideaitemimage, src: "../SiteAssets/visited.png" })),
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.View)),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaVoteDiv },
                                React.createElement("span", null,
                                    React.createElement("img", { onClick: function (likeEvt) { return _this.updateIdealikes(likeEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuservoted, src: "../SiteAssets/thumpsup.png" })),
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle + " " + InnovationPageWebpart_module_scss_1.default.voteHover },
                                    item.Vote,
                                    React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.voteduserDetails },
                                        React.createElement("p", null,
                                            " ",
                                            React.createElement("b", null, "Voted unique users"),
                                            "  :",
                                            React.createElement("br", null))))),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCommentDiv },
                                React.createElement("span", null,
                                    React.createElement("img", { onClick: function (chatEvt) { return _this.openIdeacomments(chatEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuserCommented, src: "../SiteAssets/Comments.png" })),
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.Commented)),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCommentDiv },
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.IdeaStatus))));
                    }))),
            React.createElement("div", { id: "IdeaCommentsForm", className: InnovationPageWebpart_module_scss_1.default.modal },
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.modalcontent },
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.SubmitformHeader },
                        "Please add your comments.",
                        React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.close, onClick: this.closecommentspopup }, "\u00D7"),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.currentcommentsitemId })),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Comments : "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                            React.createElement("textarea", { id: "userComments" }))),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                        React.createElement("input", { className: InnovationPageWebpart_module_scss_1.default.submitcommentsButton, type: "submit", value: "Submit", onClick: function () { return _this.submitcomments(); } })),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Comments : "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.allComments }))))),
            React.createElement("div", { id: "IdeaAckForm", className: InnovationPageWebpart_module_scss_1.default.modal },
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.modalcontent },
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.SubmitformHeader },
                        "Hello, Innovator,",
                        React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.close, onClick: this.closecommentspopup1 }, "\u00D7"),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        "We are excited to learn about your idea but before you share your details, let\u2019s do a quick due diligence check. A great I2O idea is both in-scope and has been researched:",
                        React.createElement("br", null),
                        React.createElement("br", null),
                        "IN SCOPE",
                        React.createElement("br", null),
                        React.createElement("br", null),
                        "1)\tIs a clearly defined suggestion with distinct purpose",
                        React.createElement("br", null),
                        "2)\tHas a tangible, longer-term benefit for one or more groups within Operations",
                        React.createElement("br", null),
                        "3)\tImproves one or more of the following areas:",
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.AckRow }, "a.\tThe ways we work (workstreams, metrics, etc.)"),
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.AckRow }, "b.\tCross-team collaboration with other groups"),
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.AckRow }, "c.\tRewards & Recognition"),
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.AckRow }, "d.\tSystem Changes / Enhancements / Automations"),
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.AckRow }, "e.\tOps-related Policy and Process"),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        "RESEARCH",
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("input", { type: "checkbox", id: "chk1", name: "chk1" }),
                            " ",
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle1 }, "Have you discussed this idea with your manager?")),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("input", { type: "checkbox", id: "chk2", name: "chk2" }),
                            "\t ",
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle1 }, "Have you searched for duplicate/similar ideas on the I2O platform?")),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("input", { type: "checkbox", id: "chk3", name: "chk3" }),
                            "  ",
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle1 }, "Have you checked with relevant teams and stakeholders to ensure the idea does not yet exist, is not yet in the pipeline, or otherwise not feasible?")),
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle3 },
                                " ",
                                React.createElement("input", { type: "checkbox", id: "chk4", name: "chk4" }),
                                " I confirm my idea fulfills these I2O criteria and is ready to be submitted."))),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                        React.createElement("input", { className: InnovationPageWebpart_module_scss_1.default.submitcommentsButton1, type: "submit", value: "Proceed", onClick: function () { return _this.submitData1(); } })))),
            React.createElement("div", { id: "IdeaNewForm", className: InnovationPageWebpart_module_scss_1.default.modal },
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.modalcontent },
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.SubmitformHeader },
                        "Please share your idea with us by completing the fields below.",
                        React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.close, onClick: this.closepopup }, "\u00D7"),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.currentitemId }),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.currentitemOwner }),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.loggedinRMId })),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.UserControls },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Your Organization ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " : "),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", id: "yourorg", name: "Organization" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Your GEO ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", id: "yourgeo", name: "Organization" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Reporting Manager",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", className: InnovationPageWebpart_module_scss_1.default.Test, id: "yourRM", name: "Organization" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Main Idea Category ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "mainideaCategory" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Idea Title ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", placeholder: "1 sentence summary of your idea", id: "ideaTitleid", name: "ideatitle" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Describe your Idea ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "ideaDescid", placeholder: "Please add more details", name: "ideaDescription" }),
                                " ")),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Business Case ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "businessImpactid", placeholder: "How will this affect your work and ADSK?", name: "businessImpact" }),
                                " ")),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "ROI Category ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "roiCategory" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Quantifiable ROI justification or Other Success Measurements",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "roiImpactid", className: InnovationPageWebpart_module_scss_1.default.roiImpactclass, placeholder: "Please provide approximate numbers here like time savings per month or case reduced per month etc. Which ever is applicable based on your ROI catergory. You can use the ROI calculator as a guide or use your own data analysis. If you do not put a detailed data or numbers here, your idea will be archive.", name: "roiImpact" }),
                                " ",
                                React.createElement("br", null),
                                " ",
                                React.createElement("a", { href: "https://share.autodesk.com/sites/OperationsI2O/Shared%20Documents/ROI%20Documents/ROI%20Calculator.xlsx" }, "ROI Calculator link"))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Other Stakeholders name currently involved (if any) ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", id: "otherstakeholdersid", placeholder: "Who is currently involved in this idea other than yourself?", name: "OtherStakeHolders" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Who or which Stakeholders would benefit the idea? (Tick all that apply) ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("div", { id: "teamsAffectedbyIdeaId" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Resources Needed ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", id: "resourceNeededId", placeholder: "What is needed to implement your idea?", name: "ResourcesNeeded" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Budget Item ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "budgetItemId" },
                                    React.createElement("option", { value: "Select" }, "Select"),
                                    React.createElement("option", { value: "Yes" }, "Yes"),
                                    React.createElement("option", { value: "No" }, "No")))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Rough Time Indication ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", id: "roughItemId", placeholder: "What is the urgency level and timeline?", name: "RoughItemIndication" })))),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.Editcontrols },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Actions Completed :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "ActionsCompletedId", placeholder: "What actions have been taken so far to drive this idea forward?", name: "ActionsCompleted" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Roadblocks ",
                                React.createElement("span", null, "Resolved "),
                                React.createElement("span", null,
                                    React.createElement("input", { type: "checkbox", id: "Resolved", name: "Resolved", value: "Yes" })),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "RoadblocksId", placeholder: "What roadblocks have been uncovered. Has the issue been resolved?", name: "Roadblocks" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Next steps :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "NextstepsId", placeholder: "What are the next action items to implement the idea?", name: "Nextsteps" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Estimated completion :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", id: "EstimatedcompletionId", placeholder: "When is the idea expected to be implemented? What\u2019s the target roll out date?", name: "Estimatedcompletion" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Panel presentation :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "PanelpresentationId" }),
                                React.createElement("input", { type: "date", id: "PresentationDate", name: "bday" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Notes/Comments :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "NotesCommentsId", placeholder: "Provide any additional noteworthy thoughts", name: "NotesComments" })))),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.FileControl },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "File Attachments :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "file", id: "ideafile", name: "ideafile" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Attached files :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.existingFiles })))),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.leadersControls },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.InnovationpanelHeader },
                            React.createElement("b", null, "This section is only for Innovation panel to fill in.")),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Idea proceeds to next stage :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "idearProceedsId" },
                                    React.createElement("option", { value: "Select" }, "Select"),
                                    React.createElement("option", { value: "Yes" }, "Yes"),
                                    React.createElement("option", { value: "No" }, "No")))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Panel feedback :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "reasoningId", name: "Reasoning" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Loop has been closed :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "loopclosedId" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Innovation Coach Assigned :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", id: "innovationCoachId", name: "InnovationCoach" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Fast track :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "fastTrackid" },
                                    React.createElement("option", { value: "Select" }, "Select"),
                                    React.createElement("option", { value: "Yes" }, "Yes"),
                                    React.createElement("option", { value: "No" }, "No")))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Idea Status :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "ideaStatusId" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Expiry for no update/progress :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "date", id: "expiryDate", name: "expiryDate" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Implementation Date :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "date", id: "implementationDate", name: "implementationDate" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Last edited/saved on. :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submittedDate })))),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitformButton },
                        React.createElement("input", { className: InnovationPageWebpart_module_scss_1.default.submitDataButton, type: "submit", value: "SHARE IDEA", onClick: function () { return _this.submitData(); } }),
                        React.createElement("input", { className: InnovationPageWebpart_module_scss_1.default.editDataButton, type: "submit", value: "Edit", onClick: function (editevt) { return _this.editItemData(editevt); } })))),
            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tab },
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks + " " + InnovationPageWebpart_module_scss_1.default.active, onClick: function (evt) { return _this.opencontentItems(evt); } }, "New Ideas"),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks, onClick: function (evt) { return _this.opencontentItems(evt); } }, "FastTrack"),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks, onClick: function (evt) { return _this.opencontentItems(evt); } }, "Standard"),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks, onClick: function (evt) { return _this.opencontentItems(evt); } }, "Archived"),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks, onClick: function (evt) { return _this.opencontentItems(evt); } }, "Presented"),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks, onClick: function (evt) { return _this.opencontentItems(evt); } }, "Implemented")),
            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideacontainer },
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsTitle }, "Idea"),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                    "Idea#",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (numberevt) { return _this.sortbyideanumber(numberevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsDate },
                    "Date",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (dateevt) { return _this.sortbyDate(dateevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsAuthor },
                    "Innovator",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (authorevt) { return _this.sortbyAuthor(authorevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsAuthor },
                    "Coach Name",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (coachevt) { return _this.sortbyCoach(coachevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsOrg },
                    "Org ",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (authorevt) { return _this.sortbyOrg(authorevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                    "Geo ",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (authorevt) { return _this.sortbyGEO(authorevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                    "Views ",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (voteevt) { return _this.sortbyViews(voteevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                    "Vote",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (voteevt) { return _this.sortbyVoting(voteevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabs },
                    "Comment",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (voteevt) { return _this.sortbycomments(voteevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage })))),
            React.createElement("div", { id: "NewIdeas", className: InnovationPageWebpart_module_scss_1.default.tabcontent }, this.state.items.map(function (item, key) {
                if (item.IdeaStatus === "New") {
                    if (item.VotedUsers !== null) {
                        var uniqueVoters = "";
                        var isuservoted = "";
                        item.VotedUsers.split(",").forEach(function (element) {
                            if (element === _this.props.currentloginuser) {
                                isuservoted = InnovationPageWebpart_module_scss_1.default.votedIdea;
                            }
                            uniqueVoters = uniqueVoters + element + "<br/>";
                        });
                    }
                    if (item.CommentedUsers !== null) {
                        var isuserCommented = "";
                        item.CommentedUsers.split(",").forEach(function (commented) {
                            if (commented === _this.props.currentloginuser) {
                                isuserCommented = InnovationPageWebpart_module_scss_1.default.commentedIdea;
                            }
                        });
                    }
                    return (React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.Newides },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.itemId }, item.Id),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTitleDiv },
                            React.createElement("a", { className: InnovationPageWebpart_module_scss_1.default.TitleHover, href: "#", onClick: function (itmEvt) { return _this.openideaItem(itmEvt); } },
                                item.Title,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.tooltiptext },
                                    React.createElement("p", null,
                                        React.createElement("div", null,
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Describe your Idea :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.IdeaDescription)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Case :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)))))),
                            " "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaNumberDiv }, item.IdeaID),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCoachDiv }, item.InnovationCoachAssigned),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaOrgDiv }, item.YourOrganization),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.YourGEO),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaViewDiv },
                            React.createElement("span", null,
                                React.createElement("img", { className: InnovationPageWebpart_module_scss_1.default.ideaitemimage, src: "../SiteAssets/visited.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.View)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaVoteDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (likeEvt) { return _this.updateIdealikes(likeEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuservoted, src: "../SiteAssets/thumpsup.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle + " " + InnovationPageWebpart_module_scss_1.default.voteHover },
                                item.Vote,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.voteduserDetails },
                                    React.createElement("p", null,
                                        " ",
                                        React.createElement("b", null, "Voted unique users"),
                                        "  :",
                                        React.createElement("br", null),
                                        React.createElement("div", { dangerouslySetInnerHTML: { __html: uniqueVoters } }))))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCommentDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (chatEvt) { return _this.openIdeacomments(chatEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuserCommented, src: "../SiteAssets/Comments.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.Commented))));
                }
            })),
            React.createElement("div", { id: "FastTrack", className: InnovationPageWebpart_module_scss_1.default.tabcontent }, this.state.items.map(function (item, key) {
                if (item.IdeaStatus === "Fast-Track WIP") {
                    if (item.VotedUsers !== null) {
                        var uniqueVoters = "";
                        var isuservoted = "";
                        item.VotedUsers.split(",").forEach(function (element) {
                            if (element === _this.props.currentloginuser) {
                                isuservoted = InnovationPageWebpart_module_scss_1.default.votedIdea;
                            }
                            uniqueVoters = uniqueVoters + element + "<br/>";
                        });
                    }
                    if (item.CommentedUsers !== null) {
                        var isuserCommented = "";
                        item.CommentedUsers.split(",").forEach(function (commented) {
                            if (commented === _this.props.currentloginuser) {
                                isuserCommented = InnovationPageWebpart_module_scss_1.default.commentedIdea;
                            }
                        });
                    }
                    return (React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.Newides },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.itemId }, item.Id),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTitleDiv },
                            React.createElement("a", { className: InnovationPageWebpart_module_scss_1.default.TitleHover, href: "#", onClick: function (itmEvt) { return _this.openideaItem(itmEvt); } },
                                item.Title,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.tooltiptext },
                                    React.createElement("p", null,
                                        React.createElement("div", null,
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Describe your Idea :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.IdeaDescription)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Case :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)))))),
                            " "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaNumberDiv }, item.IdeaID),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCoachDiv }, item.InnovationCoachAssigned),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaOrgDiv }, item.YourOrganization),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.YourGEO),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaViewDiv },
                            React.createElement("span", null,
                                React.createElement("img", { className: InnovationPageWebpart_module_scss_1.default.ideaitemimage, src: "../SiteAssets/visited.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.View)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaVoteDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (likeEvt) { return _this.updateIdealikes(likeEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuservoted, src: "../SiteAssets/thumpsup.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle + " " + InnovationPageWebpart_module_scss_1.default.voteHover },
                                item.Vote,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.voteduserDetails },
                                    React.createElement("p", null,
                                        " ",
                                        React.createElement("b", null, "Voted unique users"),
                                        "  :",
                                        React.createElement("br", null),
                                        React.createElement("div", { dangerouslySetInnerHTML: { __html: uniqueVoters } }))))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCommentDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (chatEvt) { return _this.openIdeacomments(chatEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuserCommented, src: "../SiteAssets/Comments.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.Commented))));
                }
            })),
            React.createElement("div", { id: "Standard", className: InnovationPageWebpart_module_scss_1.default.tabcontent }, this.state.items.map(function (item, key) {
                if (item.IdeaStatus === "Standard Track WIP") {
                    if (item.VotedUsers !== null) {
                        var uniqueVoters = "";
                        var isuservoted = "";
                        item.VotedUsers.split(",").forEach(function (element) {
                            if (element === _this.props.currentloginuser) {
                                isuservoted = InnovationPageWebpart_module_scss_1.default.votedIdea;
                            }
                            uniqueVoters = uniqueVoters + element + "<br/>";
                        });
                    }
                    if (item.CommentedUsers !== null) {
                        var uniqueCommentors = "";
                        var isuserCommented = "";
                        item.CommentedUsers.split(",").forEach(function (commented) {
                            if (commented === _this.props.currentloginuser) {
                                isuserCommented = InnovationPageWebpart_module_scss_1.default.commentedIdea;
                            }
                        });
                    }
                    return (React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.Newides },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.itemId }, item.Id),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTitleDiv },
                            React.createElement("a", { className: InnovationPageWebpart_module_scss_1.default.TitleHover, href: "#", onClick: function (itmEvt) { return _this.openideaItem(itmEvt); } },
                                item.Title,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.tooltiptext },
                                    React.createElement("p", null,
                                        React.createElement("div", null,
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Case :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Describe your Idea :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.IdeaDescription)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Panel feedback :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.Reasoning)))))),
                            " "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaNumberDiv }, item.IdeaID),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCoachDiv }, item.InnovationCoachAssigned),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaOrgDiv }, item.YourOrganization),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.YourGEO),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaViewDiv },
                            React.createElement("span", null,
                                React.createElement("img", { className: InnovationPageWebpart_module_scss_1.default.ideaitemimage, src: "../SiteAssets/visited.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.View)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaVoteDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (likeEvt) { return _this.updateIdealikes(likeEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuservoted, src: "../SiteAssets/thumpsup.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle + " " + InnovationPageWebpart_module_scss_1.default.voteHover },
                                item.Vote,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.voteduserDetails },
                                    React.createElement("p", null,
                                        " ",
                                        React.createElement("b", null, "Voted unique users"),
                                        "  :",
                                        React.createElement("br", null),
                                        React.createElement("div", { dangerouslySetInnerHTML: { __html: uniqueVoters } }))))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCommentDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (chatEvt) { return _this.openIdeacomments(chatEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuserCommented, src: "../SiteAssets/Comments.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.Commented))));
                }
            })),
            React.createElement("div", { id: "Archived", className: InnovationPageWebpart_module_scss_1.default.tabcontent }, this.state.items.map(function (item, key) {
                if (item.IdeaStatus === "Archived") {
                    if (item.VotedUsers !== null) {
                        var uniqueVoters = "";
                        var isuservoted = "";
                        item.VotedUsers.split(",").forEach(function (element) {
                            if (element === _this.props.currentloginuser) {
                                isuservoted = InnovationPageWebpart_module_scss_1.default.votedIdea;
                            }
                            uniqueVoters = uniqueVoters + element + "<br/>";
                        });
                    }
                    if (item.CommentedUsers !== null) {
                        var uniqueCommentors = "";
                        var isuserCommented = "";
                        item.CommentedUsers.split(",").forEach(function (commented) {
                            if (commented === _this.props.currentloginuser) {
                                isuserCommented = InnovationPageWebpart_module_scss_1.default.commentedIdea;
                            }
                        });
                    }
                    return (React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.Newides },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.itemId }, item.Id),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTitleDiv },
                            React.createElement("a", { className: InnovationPageWebpart_module_scss_1.default.TitleHover, href: "#", onClick: function (itmEvt) { return _this.openideaItem(itmEvt); } },
                                item.Title,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.tooltiptext },
                                    React.createElement("p", null,
                                        React.createElement("div", null,
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Case :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Describe your Idea :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.IdeaDescription)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Panel feedback :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.Reasoning)))))),
                            " "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaNumberDiv }, item.IdeaID),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCoachDiv }, item.InnovationCoachAssigned),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaOrgDiv }, item.YourOrganization),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.YourGEO),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaViewDiv },
                            React.createElement("span", null,
                                React.createElement("img", { className: InnovationPageWebpart_module_scss_1.default.ideaitemimage, src: "../SiteAssets/visited.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.View)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaVoteDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (likeEvt) { return _this.updateIdealikes(likeEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuservoted, src: "../SiteAssets/thumpsup.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle + " " + InnovationPageWebpart_module_scss_1.default.voteHover },
                                item.Vote,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.voteduserDetails },
                                    React.createElement("p", null,
                                        " ",
                                        React.createElement("b", null, "Voted unique users"),
                                        "  :",
                                        React.createElement("br", null),
                                        React.createElement("div", { dangerouslySetInnerHTML: { __html: uniqueVoters } }))))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCommentDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (chatEvt) { return _this.openIdeacomments(chatEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuserCommented, src: "../SiteAssets/Comments.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.Commented))));
                }
            })),
            React.createElement("div", { id: "Presented", className: InnovationPageWebpart_module_scss_1.default.tabcontent }, this.state.items.map(function (item, key) {
                if (item.IdeaStatus === "Presented") {
                    if (item.VotedUsers !== null) {
                        var uniqueVoters = "";
                        var isuservoted = "";
                        item.VotedUsers.split(",").forEach(function (element) {
                            if (element === _this.props.currentloginuser) {
                                isuservoted = InnovationPageWebpart_module_scss_1.default.votedIdea;
                            }
                            uniqueVoters = uniqueVoters + element + "<br/>";
                        });
                    }
                    if (item.CommentedUsers !== null) {
                        var isuserCommented = "";
                        item.CommentedUsers.split(",").forEach(function (commented) {
                            if (commented === _this.props.currentloginuser) {
                                isuserCommented = InnovationPageWebpart_module_scss_1.default.commentedIdea;
                            }
                        });
                    }
                    return (React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.Newides },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.itemId }, item.Id),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTitleDiv },
                            React.createElement("a", { className: InnovationPageWebpart_module_scss_1.default.TitleHover, href: "#", onClick: function (itmEvt) { return _this.openideaItem(itmEvt); } },
                                item.Title,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.tooltiptext },
                                    React.createElement("p", null,
                                        React.createElement("div", null,
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Describe your Idea :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.IdeaDescription)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Case :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)))))),
                            " "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaNumberDiv }, item.IdeaID),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCoachDiv }, item.InnovationCoachAssigned),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaOrgDiv }, item.YourOrganization),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.YourGEO),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaViewDiv },
                            React.createElement("span", null,
                                React.createElement("img", { className: InnovationPageWebpart_module_scss_1.default.ideaitemimage, src: "../SiteAssets/visited.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.View)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaVoteDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (likeEvt) { return _this.updateIdealikes(likeEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuservoted, src: "../SiteAssets/thumpsup.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle + " " + InnovationPageWebpart_module_scss_1.default.voteHover },
                                item.Vote,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.voteduserDetails },
                                    React.createElement("p", null,
                                        " ",
                                        React.createElement("b", null, "Voted unique users"),
                                        "  :",
                                        React.createElement("br", null),
                                        React.createElement("div", { dangerouslySetInnerHTML: { __html: uniqueVoters } }))))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCommentDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (chatEvt) { return _this.openIdeacomments(chatEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuserCommented, src: "../SiteAssets/Comments.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.Commented))));
                }
            })),
            React.createElement("div", { id: "Implemented", className: InnovationPageWebpart_module_scss_1.default.tabcontent }, this.state.items.map(function (item, key) {
                if (item.IdeaStatus === "Implemented") {
                    if (item.VotedUsers !== null) {
                        var uniqueVoters = "";
                        var isuservoted = "";
                        item.VotedUsers.split(",").forEach(function (element) {
                            if (element === _this.props.currentloginuser) {
                                isuservoted = InnovationPageWebpart_module_scss_1.default.votedIdea;
                            }
                            uniqueVoters = uniqueVoters + element + "<br/>";
                        });
                    }
                    if (item.CommentedUsers !== null) {
                        var uniqueCommentors = "";
                        var isuserCommented = "";
                        item.CommentedUsers.split(",").forEach(function (commented) {
                            if (commented === _this.props.currentloginuser) {
                                isuserCommented = InnovationPageWebpart_module_scss_1.default.commentedIdea;
                            }
                        });
                    }
                    return (React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.Newides },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.itemId }, item.Id),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTitleDiv },
                            React.createElement("a", { className: InnovationPageWebpart_module_scss_1.default.TitleHover, href: "#", onClick: function (itmEvt) { return _this.openideaItem(itmEvt); } },
                                item.Title,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.tooltiptext },
                                    React.createElement("p", null,
                                        React.createElement("div", null,
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Case :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Describe your Idea :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.IdeaDescription)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Panel feedback :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.Reasoning)))))),
                            " "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaNumberDiv }, item.IdeaID),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCoachDiv }, item.InnovationCoachAssigned),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaOrgDiv }, item.YourOrganization),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.YourGEO),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaViewDiv },
                            React.createElement("span", null,
                                React.createElement("img", { className: InnovationPageWebpart_module_scss_1.default.ideaitemimage, src: "../SiteAssets/visited.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.View)),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaVoteDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (likeEvt) { return _this.updateIdealikes(likeEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuservoted, src: "../SiteAssets/thumpsup.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle + " " + InnovationPageWebpart_module_scss_1.default.voteHover },
                                item.Vote,
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.voteduserDetails },
                                    React.createElement("p", null,
                                        " ",
                                        React.createElement("b", null, "Voted unique users"),
                                        "  :",
                                        React.createElement("br", null),
                                        React.createElement("div", { dangerouslySetInnerHTML: { __html: uniqueVoters } }))))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaCommentDiv },
                            React.createElement("span", null,
                                React.createElement("img", { onClick: function (chatEvt) { return _this.openIdeacomments(chatEvt); }, className: InnovationPageWebpart_module_scss_1.default.ideaitemimage + " " + isuserCommented, src: "../SiteAssets/Comments.png" })),
                            React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.ideaitemTitle }, item.Commented))));
                }
            }))));
    };
    return InnovationPageWebpart;
}(React.Component));
exports.default = InnovationPageWebpart;
//# sourceMappingURL=InnovationPageWebpart.js.map