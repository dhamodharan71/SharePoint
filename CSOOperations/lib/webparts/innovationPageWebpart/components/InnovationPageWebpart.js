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
                "?$top=5000&$select=Title,IdeaStatus,Author/Title,Created,IdeaDescription,MainIdeaCategory,CustomersImpact,WorkImpact,ManagersImpact,EffortsImpact,TeamsAffected,SpecialistImpact,BusinessImpact," +
                "yourGeo,Vote,View,Id,ViewedUsers,IdeaID,VotedUsers,Score,CommentedUsers," +
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
                var userinfoEmail = userresultData.d.Email;
                var userproperties = userresultData.d.UserProfileProperties.results;
                var rmName = userresultData.d.UserProfileProperties.results[15].Value;
                var logedinRMname = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId);
                var logedinRMname1 = logedinRMname[0].innerText.substring(18, (logedinRMname[0].innerText).length).replace("@autodesk.com", "").replace(".", " ");
                jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserGeo).append(yourGeo);
                for (var i = 0; i < userproperties.length; i++) {
                    var property = userproperties[i];
                    if (property.Key === "GEO") {
                        var yourGeo = property.Value;
                        jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserGeo).append(yourGeo);
                    }
                    if (property.Key === "Manager") {
                        var yourRM = property.Value;
                        jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId).append(yourRM);
                    }
                }
                jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserEmail).append(userinfoEmail);
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
                        if (allcolumns[i].StaticName === "TeamsAffectedbythisIdea") {
                            options = allcolumns[i].Choices.results;
                            for (var cb = 0; cb < options.length; cb++) {
                                var cbox = "<div className=" + InnovationPageWebpart_module_scss_1.default.CheckBoxDiv + ">" +
                                    "<input type=checkbox name=Teamsoptions value='" + options[cb] + "'>" + options[cb] + "</input><div>";
                                jquery("#teamsAffectedbyIdeaId").append(jquery(cbox));
                            }
                        }
                        if (allcolumns[i].StaticName === "SpecialistImpact") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#specialistImpact").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "ManagersImpact") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#managersImpact").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "EffortsImpact") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#effortsImpact").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "CustomersImpact") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#customersImpact").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "WorkImpact") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#workImpact").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "yourGeo") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#yourGeo").append(jquery(option));
                            });
                        }
                        if (allcolumns[i].StaticName === "IdeaStatus") {
                            options = allcolumns[i].Choices.results;
                            options.forEach(function (element) {
                                var option = new Option(element, element);
                                jquery("#ideaStatusId").append(jquery(option));
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
        var logedinRMname2 = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId)[0].innerText;
        var logedinRMname1 = logedinRMname[0].innerText.substring(18, (logedinRMname[0].innerText).length).replace("@autodesk.com", "").replace(".", " ");
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
                (" substringof('" + searchKey + "',MainIdeaCategory) or substringof('" + searchKey + "',ManagersImpact) or substringof('" + searchKey + "',EffortsImpact) or substringof('" + searchKey + "',TeamsAffected) or substringof('" + searchKey + "',WorkImpact)  or substringof('" + searchKey + "',CustomersImpact) or substringof('" + searchKey + "',SpecialistImpact) or") +
                (" substringof('" + searchKey + "',yourGeo))&$select=Title,") +
                "IdeaStatus,IdeaID,Author/Title,Created,IdeaDescription,Score,MainIdeaCategory,CustomersImpact,SpecialistImpact,TeamsAffected, ManagersImpact,EffortsImpact,WorkImpact,BusinessImpact,yourGeo," +
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
    InnovationPageWebpart.prototype.sortbyScore = function (voteevt) {
        var voteclassNames = voteevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var textA = +jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaScoreDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaScoreDiv).prevObject[0].outerText;
            var textB = +jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaScoreDiv).find("." + InnovationPageWebpart_module_scss_1.default.ideaScoreDiv).prevObject[0].outerText;
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
    InnovationPageWebpart.prototype.sortbyTeamsImpact = function (teamsevt) {
        var authorclassNames = teamsevt.target.classList;
        var activetab = jquery("." + InnovationPageWebpart_module_scss_1.default.active)[0].innerText.replace(/ /g, "");
        var cont = jquery("#" + activetab);
        var arr = "";
        arr = jquery.makeArray(cont.children("." + InnovationPageWebpart_module_scss_1.default.Newides));
        arr.sort(function (a, b) {
            var firstText = jquery(a).find("." + InnovationPageWebpart_module_scss_1.default.ideaTeamsDiv)[0].innerText;
            var secondText = jquery(b).find("." + InnovationPageWebpart_module_scss_1.default.ideaTeamsDiv)[0].innerText;
            return firstText.localeCompare(secondText.toUpperCase());
        });
        if (authorclassNames.length === 1) {
            cont.empty();
            jquery.each(arr, function () {
                cont.append(this);
            });
            teamsevt.target.classList.add("descending");
        }
        else {
            cont.empty();
            arr.reverse();
            jquery.each(arr, function () {
                cont.append(this);
            });
            teamsevt.target.classList.remove("descending");
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
        var currentloggedinEmail = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserEmail)[0].innerText;
        var finalusersarray = "";
        var finalusersemailarray = "";
        var isuserVoted = false;
        var itemResult = "";
        var dispVotes = "";
        var existingvotes = "";
        var allVotes = "";
        var allusers = "";
        var allusersEmail = "";
        var allusersComments = "";
        var finalusers = "";
        var finalusersEmail = "";
        var userarray = "";
        var userarrayemail = "";
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
                var votedusersemail = item.VotedUsersEmail.split(",");
                finalusersemailarray = _this.uniqueItems(votedusersemail);
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
                    var indexemail = finalusersemailarray.indexOf(currentloggedinEmail);
                    if (index > -1) {
                        finalusersarray.splice(index, 1);
                        finalusersemailarray.splice(indexemail, 1);
                    }
                    body = JSON.stringify({
                        "Vote": "" + allVotes,
                        "VotedUsers": "" + finalusersarray,
                        "VotedUsersEmail": "" + finalusersemailarray
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
                        document.location.reload();
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
                    allusersEmail = itemResult.VotedUsersEmail;
                    if (allusers === null) {
                        allusers = "";
                        allusersEmail = "";
                    }
                    allusersComments = itemResult.Comments;
                    if (allusersComments === null) {
                        allusersComments = "";
                    }
                    finalusersEmail = currentloggedinEmail + "," + allusersEmail;
                    finalusers = currentlogedinuser + "," + allusers;
                    userarray = finalusers.split(",");
                    userarrayemail = finalusersEmail.split(",");
                    finalusersarray = _this.uniqueItems(userarray);
                    finalusersemailarray = _this.uniqueItems(userarrayemail);
                    body = JSON.stringify({
                        "Vote": "" + allVotes,
                        "VotedUsers": "" + finalusersarray,
                        "VotedUsersEmail": "" + finalusersemailarray
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
                        document.location.reload();
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
                allusersEmail = itemResult.VotedUsersEmail;
                if (allusers === null) {
                    allusers = "";
                    allusersEmail = "";
                }
                allusersComments = itemResult.Comments;
                if (allusersComments === null) {
                    allusersComments = "";
                }
                finalusersEmail = currentloggedinEmail + "," + allusersEmail;
                finalusers = currentlogedinuser + "," + allusers;
                userarray = finalusers.split(",");
                userarrayemail = finalusersEmail.split(",");
                finalusersarray = _this.uniqueItems(userarray);
                finalusersemailarray = _this.uniqueItems(userarrayemail);
                body = JSON.stringify({
                    "Vote": "" + allVotes,
                    "VotedUsers": "" + finalusersarray,
                    "VotedUsersEmail": "" + finalusersemailarray
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
                    document.location.reload();
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
            ("/items('" + currentItemIdvalue + "')?$select=Title,IdeaStatus,AttachmentFiles,Author/Title,TeamsAffected,IdeaDescription,") +
            "MainIdeaCategory,SpecialistImpact,ManagersImpact,EffortsImpact,CustomersImpact,WorkImpact,ResourcesNeeded," +
            "OwnerComments,implementationDate,yourGeo,Vote,View,Id,ViewedUsers,IdeaID,VotedUsers,Created,Modified,CommentedUsers," +
            "BusinessImpact,Reasoning,Manager,Commented&$Expand=Author,AttachmentFiles", sp_http_1.SPHttpClient.configurations.v1, {
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
            var dispGeo = itemResult.yourGeo;
            var dispDesc = itemResult.IdeaDescription;
            var dispBImpact = itemResult.BusinessImpact;
            var dispMIC = itemResult.MainIdeaCategory;
            var dispSPI = itemResult.SpecialistImpact;
            var dispCI = itemResult.CustomersImpact;
            var dispWI = itemResult.WorkImpact;
            var dispMI = itemResult.ManagersImpact;
            var dispEI = itemResult.EffortsImpact;
            var dispresorcesNeeded = itemResult.ResourcesNeeded;
            var dispTABTI = itemResult.TeamsAffected;
            var dispReasoning = itemResult.Reasoning;
            var dispIdeaStatus = itemResult.IdeaStatus;
            var prvviews = itemResult.View;
            var dispOwnerComments = itemResult.OwnerComments;
            var dispManager = itemResult.Manager;
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
            jquery("." + InnovationPageWebpart_module_scss_1.default.submittedDate).empty();
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
            jquery("." + InnovationPageWebpart_module_scss_1.default.submittedDate).append(lasteditedDate);
            if (dispTABTI !== null) {
                var checkteamsEffected = dispTABTI.split(";");
                checkteamsEffected.forEach(function (element) {
                    var val = element;
                    jquery("input[value='" + val + "']").prop("checked", true);
                });
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
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("display", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("pointer-events", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("opacity", 0.5);
            jquery("." + InnovationPageWebpart_module_scss_1.default.editDataButton).css("display", "none");
            jquery("." + InnovationPageWebpart_module_scss_1.default.submitDataButton).css("display", "block");
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
                    jquery("#yourGeo").prop('disabled', false);
                    jquery("#reasoningId").removeAttr("disabled");
                    jquery("#resourceNeededId").removeAttr("disabled");
                    jquery("#NotesCommentsId").removeAttr("disabled");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("display", "block");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("pointer-events", "visible");
                    jquery("." + InnovationPageWebpart_module_scss_1.default.leadersControls).css("opacity", "");
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
    };
    InnovationPageWebpart.prototype.submitData = function () {
        var _this = this;
        var logedinuser = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserId)[0].innerText;
        var logedinRMname2 = jquery("#yourRM")[0].value;
        var logedinRMname = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId);
        var logedinRMname1 = logedinRMname[0].innerText.substring(18, (logedinRMname[0].innerText).length).replace("@autodesk.com", "").replace(".", " ");
        var fileInput = jquery("#ideafile");
        var fileName = jquery("#ideafile")[0].value.split("\\").pop();
        var isFileAttached = fileInput[0].value.length;
        var isitemid = jquery("." + InnovationPageWebpart_module_scss_1.default.currentitemId).text();
        var yourGeo = jquery("#yourGeo").find(":selected").text();
        var ideaTitle = jquery("#ideaTitleid")[0].value;
        var ideaDesc = jquery("#ideaDescid")[0].value;
        var businessImpact = jquery("#businessImpactid")[0].value;
        var mainIdeaCategory = jquery("#mainideaCategory").find(":selected").text();
        var specialistImpact = jquery("#specialistImpact").find(":selected").text();
        var effortsImpact = jquery("#effortsImpact").find(":selected").text();
        var managersImpact = jquery("#managersImpact").find(":selected").text();
        var customersImpact = jquery("#customersImpact").find(":selected").text();
        var workImpact = jquery("#workImpact").find(":selected").text();
        var TeamsAffected = [];
        jquery.each(jquery("input[name='Teamsoptions']:checked"), function () {
            TeamsAffected.push(jquery(this).val());
        });
        TeamsAffected = TeamsAffected.join(";");
        var resourceNeeded = jquery("#resourceNeededId")[0].value;
        var reasoning = jquery("#reasoningId")[0].value;
        var ideaStaus = jquery("#ideaStatusId").find(":selected").text();
        var notesComments = jquery("#NotesCommentsId")[0].value;
        var implementationDate = jquery("#implementationDate")[0].value;
        var ideaViewed = 1;
        if (yourGeo === "" || ideaTitle === "" || ideaDesc === "" || TeamsAffected === "" ||
            mainIdeaCategory === "" || specialistImpact === "" || managersImpact === "" || effortsImpact === "" || customersImpact === "" || workImpact === "" || businessImpact === "" ||
            resourceNeeded === "") {
            alert("Please fill in all mandatory fields.");
        }
        else if (isNaN(resourceNeeded)) {
            jquery("#resourceNeededId").css("color", "red");
            jquery("#resourceNeededId").css("border-block-color", "red");
            alert("Please enter only numbers for Estimated potential time savings per occurrence");
        }
        else {
            var body = JSON.stringify({
                "Title": "" + ideaTitle,
                "IdeaDescription": "" + ideaDesc,
                "yourGeo": "" + yourGeo,
                "BusinessImpact": "" + businessImpact,
                "MainIdeaCategory": "" + mainIdeaCategory,
                "SpecialistImpact": "" + specialistImpact,
                "TeamsAffected": "" + TeamsAffected,
                "ManagersImpact": "" + managersImpact,
                "EffortsImpact": "" + effortsImpact,
                "CustomersImpact": "" + customersImpact,
                "WorkImpact": "" + workImpact,
                "ResourcesNeeded": "" + resourceNeeded,
                "Reasoning": "" + reasoning,
                "IdeaStatus": "" + ideaStaus,
                "OwnerComments": "" + notesComments,
                "implementationDate": "" + implementationDate,
                "ideaEdited": "" + ideaViewed,
                "ideaEditedBy": "" + logedinuser,
                "Manager": "" + logedinRMname2
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
                        document.location.reload();
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
                        document.location.reload();
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
        if (chb1.length === 1 && chb2.length === 1 && chb3.length === 1) {
            var userGeo = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserGeo)[0].innerText;
            var userOrg = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinuserOrg)[0].innerText;
            var logedinRMname = jquery("." + InnovationPageWebpart_module_scss_1.default.loggedinRMId);
            var userRM = logedinRMname[0].innerText.substring(18, (logedinRMname[0].innerText).length).replace("@autodesk.com", "").replace(".", " ");
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
                document.location.reload();
            }, function (error) {
                console.log("comments not updated " + allVotes);
            });
        });
    };
    InnovationPageWebpart.prototype.ExporttoExcel = function (editevt) {
        var _this = this;
        var table = "<table class='new_tab_table' cellspacing= '3 ' cellpadding= '3 ' border= '2 '>" +
            "<tr><th>IdeaID</th><th>Vote</th><th>Created By</th><th> Geo </th>" +
            "<th> IdeaCategory </th><th> Title </th><th> IdeaDescription </th><th> BusinessImpact </th>" +
            "<th> Current Status </th><th>Reporting Manager</th></tr>";
        var reactHandler = this;
        this.props.spHttpClient.get(this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.listName + "')" +
            "/items?$top=5000&$filter=IdeaStatus eq 'New'&$select=Title,IdeaStatus,Author/Title,Created,IdeaDescription,CustomersImpact,WorkImpact,ManagersImpact,EffortsImpact,TeamsAffected,SpecialistImpact,MainIdeaCategory," +
            "yourGeo,Vote,View,Id,ViewedUsers,IdeaID,VotedUsers,CommentedUsers," +
            "Loophasbeenclosed,BusinessImpact,Reasoning,Commented,Manager&$Expand=Author&$orderby=Id desc", sp_http_1.SPHttpClient.configurations.v1, {
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
                    "<td>" + newitem.yourGeo + "</td><td>" + newitem.MainIdeaCategory + "</td>" +
                    "<td>" + newitem.Title + "</td><td>" + newitem.IdeaDescription + "</td><td>" + newitem.BusinessImpact + "</td>" +
                    "<td>" + newitem.IdeaStatus + "</td><td>" + newitem.Manager + "</td></tr>";
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
            document.location.reload();
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
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.loggedinRMId }),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.loggedinuserEmail })),
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
                                            React.createElement("b", null, "Business Impact"),
                                            "  : ",
                                            item.BusinessImpact,
                                            React.createElement("br", null),
                                            React.createElement("b", null, "Idea Category\u00A0\u00A0\u00A0\u00A0"),
                                            ": ",
                                            item.MainIdeaCategory,
                                            React.createElement("br", null),
                                            React.createElement("b", null, "Idea Description"),
                                            "  : ",
                                            item.IdeaDescription))),
                                " "),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTeamsDiv }, item.TeamsAffected),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.yourGeo),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaRMDiv }, item.yourGeo),
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
            React.createElement("div", { id: "IdeaAckForm", className: InnovationPageWebpart_module_scss_1.default.modal1 },
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.modalcontent1 },
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.SubmitformHeader },
                        "Hello, Innovator!",
                        React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.close, onClick: this.closecommentspopup1 }, "\u00D7"),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        "We are excited to learn about your opportunity to improve ",
                        React.createElement("b", null, "productivity and efficiency in GPS"),
                        ". A great idea is both in-scope and has been researched. ",
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("b", null, "IN SCOPE"),
                        React.createElement("br", null),
                        React.createElement("br", null),
                        "1) Clear problem statement",
                        React.createElement("br", null),
                        "2) Challenge impacts multiple team members or teams",
                        React.createElement("br", null),
                        "3) Challenge is process or system related (no policy or HR requests)",
                        React.createElement("br", null),
                        "4) There is a tangible, longer-term benefit from implementing a workaround or fix.",
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("b", null,
                            "RESEARCH",
                            React.createElement("br", null)),
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("input", { type: "checkbox", id: "chk1", name: "chk1" }),
                            " ",
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle1 }, "Have you searched for duplicate/similar ideas on the SIMPLI FI platform?")),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("input", { type: "checkbox", id: "chk2", name: "chk2" }),
                            "\t ",
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle1 }, "Have you discussed this idea with your manager?")),
                        " ",
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("br", null),
                            React.createElement("input", { type: "checkbox", id: "chk3", name: "chk3" }),
                            "  ",
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle1 }, "I confirm my idea fulfills these criteria and is ready to be submitted")),
                        React.createElement("br", null),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform })),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                        React.createElement("input", { className: InnovationPageWebpart_module_scss_1.default.submitcommentsButton1, type: "submit", value: "Proceed", onClick: function () { return _this.submitData1(); } })))),
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
            React.createElement("div", { id: "IdeaNewForm", className: InnovationPageWebpart_module_scss_1.default.modal },
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.modalcontent1 },
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.SubmitformHeader },
                        "Please share your idea with us by completing the fields below.",
                        React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.close, onClick: this.closepopup }, "\u00D7"),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.currentitemId }),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.currentitemOwner }),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.loggedinRMId })),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.UserControls },
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Your Geo ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "yourGeo" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Reporting Manager",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", className: InnovationPageWebpart_module_scss_1.default.Test, id: "yourRM", name: "Organization" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Opportunity Title",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", placeholder: "What is the title for your opportunity?", id: "ideaTitleid", name: "ideatitle" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Opportunity Description ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "ideaDescid", placeholder: "Add here a link to your screencast (max 2 minutes)", name: "ideaDescription" }),
                                " ")),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Describe the challenge ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "businessImpactid", placeholder: "In one or a few sentences summarize the challenge", name: "businessImpact" }),
                                " ")),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Estimated potential time savings per occurrence? (minutes) ",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("input", { type: "text", id: "resourceNeededId", placeholder: "How much time could be saved every time this challenge is found", name: "ResourcesNeeded" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "How frequent is this challenge?",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "mainideaCategory" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "What is the challenge impact to specialists?",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "specialistImpact" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "What is the categories of work impacted?",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "workImpact" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "What is the challenge impact to the Customers?",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "customersImpact" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "What is the challenge impact to Managers?",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "managersImpact" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Which Teams are impacted by this challenge?",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("div", { id: "teamsAffectedbyIdeaId" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle },
                                "Effort Estimation?",
                                React.createElement("span", { className: InnovationPageWebpart_module_scss_1.default.mandatory }, "*"),
                                " :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "effortsImpact" })))),
                    React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.Editcontrols },
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
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Panel feedback :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("textarea", { id: "reasoningId", name: "Reasoning" }))),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.submitform },
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTitle }, "Idea Status :"),
                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ColumnTypes },
                                React.createElement("select", { id: "ideaStatusId" }))),
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
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks, onClick: function (evt) { return _this.opencontentItems(evt); } }, "Under Review"),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks, onClick: function (evt) { return _this.opencontentItems(evt); } }, "In Progress"),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks, onClick: function (evt) { return _this.opencontentItems(evt); } }, "Implemented"),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tablinks, onClick: function (evt) { return _this.opencontentItems(evt); } }, "Will Not Pursue")),
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
                    "Teams Impact",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (teamsevt) { return _this.sortbyTeamsImpact(teamsevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsScore },
                    "Score",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (scoreevt) { return _this.sortbyScore(scoreevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsScore },
                    "Geo ",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (authorevt) { return _this.sortbyGEO(authorevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsScore },
                    "Views ",
                    React.createElement("span", null,
                        React.createElement("img", { onClick: function (voteevt) { return _this.sortbyViews(voteevt); }, src: "../SiteAssets/sort.png", className: InnovationPageWebpart_module_scss_1.default.sortImage }))),
                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTabsScore },
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
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Description :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.IdeaDescription)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Impact :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)))))),
                            " "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaNumberDiv }, item.IdeaID),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTeamsDiv }, item.TeamsAffected),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaScoreDiv }, item.Score),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.yourGeo),
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
            React.createElement("div", { id: "UnderReview", className: InnovationPageWebpart_module_scss_1.default.tabcontent }, this.state.items.map(function (item, key) {
                if (item.IdeaStatus === "Under Review") {
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
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Description :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.IdeaDescription)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Impact :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)))))),
                            " "),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaNumberDiv }, item.IdeaID),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaDateDiv }, item.Created.split("T")[0]),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaAuthorDiv }, item.Author.Title),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTeamsDiv }, item.TeamsAffected),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaScoreDiv }, item.Score),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.yourGeo),
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
            React.createElement("div", { id: "InProgress", className: InnovationPageWebpart_module_scss_1.default.tabcontent }, this.state.items.map(function (item, key) {
                if (item.IdeaStatus === "In Progress") {
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
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Impact :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Description :"),
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
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTeamsDiv }, item.TeamsAffected),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaScoreDiv }, item.Score),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.yourGeo),
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
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Impact :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Description :"),
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
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTeamsDiv }, item.TeamsAffected),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaScoreDiv }, item.Score),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.yourGeo),
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
            React.createElement("div", { id: "WillNotPursue", className: InnovationPageWebpart_module_scss_1.default.tabcontent }, this.state.items.map(function (item, key) {
                if (item.IdeaStatus === "Will not pursue") {
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
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Business Impact :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc }, item.BusinessImpact)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Category :"),
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipdesc },
                                                    " ",
                                                    item.MainIdeaCategory)),
                                            React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipRow },
                                                React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.tooltipHeader }, "Idea Description :"),
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
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaTeamsDiv }, item.TeamsAffected),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaScoreDiv }, item.Score),
                        React.createElement("div", { className: InnovationPageWebpart_module_scss_1.default.ideaGeoDiv }, item.yourGeo),
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