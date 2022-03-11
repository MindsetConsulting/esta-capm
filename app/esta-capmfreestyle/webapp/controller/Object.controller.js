sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
	"sap/m/MessageBox",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter"
], function (BaseController, MessageToast, MessageBox, Filter, FilterOperator, FilterType, JSONModel, History, formatter) {
    "use strict";

    return BaseController.extend("freestylecapm.estacapmfreestyle.controller.Object", {

        formatter: formatter,

        onInit : function () {
            var oMessageManager = sap.ui.getCore().getMessageManager(),
				oMessageModel = oMessageManager.getMessageModel(),
				oMessageModelBinding = oMessageModel.bindList("/", undefined, [],
					new Filter("technical", FilterOperator.EQ, true)),
				oViewModel = new JSONModel({
					busy : false,
					hasUIChanges : false,
					order : 0,
                    editMode : false
				});
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");
            this.getView().setModel(oMessageModel, "message");
            this.oSemanticPage = this.byId("page");
            this.oEditAction = this.byId("editAction");

			oMessageModelBinding.attachChange(this.onMessageBindingChange, this);
			this._bTechnicalErrors = false;
        },

        onNavBack : function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("worklist", {}, true);
            }
        },

        _onObjectMatched : function (oEvent) {
            var sObjectId =  oEvent.getParameter("arguments").objectId;
            this._bindView("/Employees" + sObjectId);
        },

        _bindView : function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                },
                parameters: {
                    "$$updateGroupId" : 'employeeInfo'
                }
            });
        },

        _onBindingChange : function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.ID,
                sObjectName = oObject.Employees;

                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/shareSendEmailSubject",
                    oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
                oViewModel.setProperty("/shareSendEmailMessage",
                    oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        },

        onEditEmployee : function () {
            var oViewModel = this.getModel("objectView")
                oViewModel.setProperty("/editMode", true);

            this.byId("bigName").setProperty("visible", false);
            this.byId("bigNameEdit").setProperty("visible", true);
            this.byId("information").setProperty("visible", false);
            this.byId("inputs").setProperty("visible", true);
            this.showFooter(true);
        },

        onSave : function () {
            this.showFooter(false);
            this.oEditAction.setVisible(true);
			var fnSuccess = function () {
				this._setBusy(false);
				this._setUIChanges(false);
			}.bind(this);

			var fnError = function (oError) {
				this._setBusy(false);
				this._setUIChanges(false);
			}.bind(this);

			this._setBusy(true); // Lock UI until submitBatch is resolved.
			this.getView().getModel().submitBatch("employeeInfo").then(fnSuccess, fnError);
			this._bTechnicalErrors = false;

            var oViewModel = this.getModel("objectView")
            oViewModel.setProperty("/editMode", false);

            this.byId("bigName").setProperty("visible", true);
            this.byId("bigNameEdit").setProperty("visible", false);
            this.byId("information").setProperty("visible", true);
            this.byId("inputs").setProperty("visible", false);

            MessageToast.show("Changes saved!");
        },

        onResetChanges : function () {
            var oViewModel = this.getModel("objectView")
            oViewModel.setProperty("/editMode", false);
            this.byId("bigName").setProperty("visible", true);
            this.byId("bigNameEdit").setProperty("visible", false);
            this.byId("information").setProperty("visible", true);
            this.byId("inputs").setProperty("visible", false);
            this.showFooter(false);
            this.oEditAction.setVisible(true);
            this.getView().getModel().resetChanges("employeeInfo");
        },

        showFooter : function (bShow) {
			this.oSemanticPage.setShowFooter(bShow);
		},

        onInputChange : function (oEvt) {
			if (oEvt.getParameter("escPressed")) {
				this._setUIChanges();
			} else {
				this._setUIChanges(true);
			}
		},

        onSelectChange : function (oEvent) {
            console.log(oEvent.getParameter("selectedItem").getProperty("text"));
        },

        _setUIChanges : function (bHasUIChanges) {
			if (this._bTechnicalErrors) {
				// If there is currently a technical error, then force 'true'.
				bHasUIChanges = true;
			} else if (bHasUIChanges === undefined) {
				bHasUIChanges = this.getView().getModel().hasPendingChanges();
			}
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/hasUIChanges", bHasUIChanges);
		},

        _setBusy : function (bIsBusy) {
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/busy", bIsBusy);
		},

        onOpenDeleteDialog : function () {
			if (!this.deleteDialog) {
				this.deleteDialog = this.getView().byId("deleteDialog")
			} 
			this.deleteDialog.open();
		},

        onDelete : function (oEvent) {
            var oRouter = this.getRouter();
            var employeeContext = this.getView("objectView").byId("page").getBindingContext();
            
            employeeContext.delete("$auto").then(function (oEvent) {
                oRouter.navTo("worklist", {});
                this.byId("deleteDialog").close();
            })

            MessageToast.show("Employee deleted!");
        },

        onCloseDeleteDialog : function () {
			this.byId("deleteDialog").close();
		},

        //register on change event
        //maybe make new function to handle change for SELECT
        onCreateSkill : function () {
            var oList = this.byId("skillTable"),
				oBinding = oList.getBinding("items"),
				oContext = oBinding.create({
                    "skill": {
                        "ID": "3b6fbba2-d36d-4e7d-9a8e-425c4b0636d6"
                    },
					"dateAcquired" : "",
                    "renewal" : "",
                    "comfortLevel" : ""
				});

			this._setUIChanges();
			this.getView().getModel("appView").setProperty("/usernameEmpty", true);

			oList.getItems().some(function (oItem) {
				if (oItem.getBindingContext() === oContext) {
					oItem.focus();
					oItem.setSelected(true);
					return true;
				}
			});
        },

        onDeleteSkill : function () {
            var oSelected = this.byId("skillTable").getSelectedItem();

			if (oSelected) {
				oSelected.getBindingContext().delete("$auto").then(function () {
					MessageToast.show("Skill deleted!");
				}.bind(this), function (oError) {
					MessageBox.error(oError.message);
				});
			}
        },

        //SEARCH NOT WORKING ON SKILL TABLE
        onSearch : function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("skillTitle", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }
        },

        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("skillTable"),
                oViewModel = this.getModel("objectView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
            }
        }
    });
});
