/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "fiori/z99bp/model/models",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models, JSONModel) {
        "use strict";

        return UIComponent.extend("fiori.z99bp.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();
                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                //associa uma função de navegação no evento Route Matched
                this.getRouter().attachRouteMatched(this.aoNavegar, this);

                //cria o JSON Model que guarda o valor do layout da tela
                let oModel = new JSONModel();
                //cria a propriedade que guarda o valor do layout
                oModel.setProperty("/modo", "OneColumn");
                //associa o modelo no Component pra poder ficar disponível
                this.setModel(oModel, "layout");
            },

            aoNavegar: function(oEvent){
                //guarda o nome da rota
                let sNomeDaRota = oEvent.getParameters().name;
                let sLayout;

                switch(sNomeDaRota){
                    case "RouteParceiros":
                        sLayout = "OneColumn";
                        break;
                }
                
                //Resgata o modelo e altera a propriedade modo que está associada no flexibleColumnLayout
                let oModel = this.getModel("layout");
                oModel.setProperty("/modo", sLayout);
            }
        });
    }
);