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

        },

        aoSelecionarParceiro: function(oEvent){
            //acessa o objeto do item clicado
            let oItemClicado = oEvent.getParameters().listItem;

            //acessa o contexto de binding (o caminho no modelo OData para o item)
            let oBindingContext = oItemClicado.getBindingContext();

            //acessa a entrada do item selecionado no modelo
            let oParceiro = oBindingContext.getObject();

            //guarda o ID do parceiro
            let sIdParceiro = oParceiro.BusinessPartner;

            //navegação - acessa o roteador e efetua navegação
            let oRouter = this.getOwnerComponent().getRouter();

            oRouter.navTo("RouteDetalheParceiro", {
                idParceiro: sIdParceiro 
            });

        },
        aoCriarParceiro: function(){
            //acessa o roteador
            let oRoteador = this.getOwnerComponent().getRouter();

            //navegação para a página de criação
            oRoteador.navTo("RouteNovoParceiro");
        }        
    });
});
