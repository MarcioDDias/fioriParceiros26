sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("fiori.z99bp.controller.Parceiros", {
        onInit: function () {

        },

        aoPesquisarParceiro: function(oEvent){
            //resgata o valor  a ser pesquisado
            let sPesquisa = oEvent.getParameters().newValue;

            let oFiltro = new Filter({
                // path: 'PartnerName1',
                // operator: FilterOperator.EQ,
                // value1: sPesquisa
                filters: [
                new Filter({
                    path: 'BusinessPartner',
                    operator: FilterOperator.Contains,
                    value1: sPesquisa
                }),
                new Filter({
                    path: 'BusinessPartnerName',
                    operator: FilterOperator.Contains,
                    value1: sPesquisa
                })
                ],
                and: false
            });

            //acessa a lista
            let oLista = this.getView().byId("listaParceiros");

            //acessa o binding da lista. Items é a agregação na view xml
            let oBinding = oLista.getBinding("items");

            //chama o método de filtro
            oBinding.filter(oFiltro);

        }
    });
});
