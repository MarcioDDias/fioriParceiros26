sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/m/MessageBox"
    ],
    function(BaseController, MessageToast, MessageBox) {
      "use strict";
  
      return BaseController.extend("fiori.z13bp.controller.NovoParceiro", {
        onInit: function() {
            //resgata o roteador no pai do controller (Component.js)
            let oRoteador = this.getOwnerComponent().getRouter();

            //interceptar a rota de novo parceiro e carregar o fragmento
            oRoteador.getRoute("RouteNovoParceiro").attachPatternMatched(this.rotaNovoParceiro, this);

        },

        rotaNovoParceiro: function(oEvent){
            //resgata o modelo de modo
            let oModeloModo = this.getOwnerComponent().getModel("modo");

            //altera a propriedade editável para true para habilitar todos os inputs do formulário
            oModeloModo.setProperty("/editavel", true);
        },

        aoEscolherCategoria: function(oEvent){

            //resgat o item clicado
            let oItem = oEvent.getParameter('selectedItem');

            //resgata o contexto de binding do item clicado e o objeto no modelo
            let oCategoria = oItem.getBindingContext("novoParceiro").getObject();

            //resgata o modelo novoParceiro e altera o valor da propriedade PartnerType
            let oModeloNovoParceiro = this.getOwnerComponent().getModel("novoParceiro");
            oModeloNovoParceiro.setProperty("/PartnerType", oCategoria.PartnerType);

        },

        onPressCancelar: function(oEvent){
            //resgata o roteador no pai do controller (Component.js)
            let oRoteador = this.getOwnerComponent().getRouter();

            //navega para rota de parceiros
            oRoteador.navTo("RouteParceiros");

        },

        onPressSalvar: function(oEvent){

            //resgata o payload da chamada de criação
            let oModeloNovoParceiro = this.getOwnerComponent().getModel("novoParceiro");
            let oDados = oModeloNovoParceiro.getProperty("/");
            let oPayload = {};
            oPayload.PartnerType = oDados.PartnerType;
            oPayload.PartnerName1 = oDados.PartnerName1;
            oPayload.PartnerName2 = oDados.PartnerName2;
            oPayload.SearchTerm1 = oDados.SearchTerm1;
            oPayload.SearchTerm2 = oDados.SearchTerm2;
            oPayload.Street = oDados.Street;
            oPayload.HouseNumber = oDados.HouseNumber;
            oPayload.District = oDados.District;
            oPayload.Region = oDados.Region;
            oPayload.City = oDados.City;
            oPayload.ZipCode = oDados.ZipCode;
            oPayload.Country = oDados.Country;                 

            //resgata o modelo OData
            let oModel = this.getOwnerComponent().getModel();

            //configura o cabeçalho da requisição para não ser um XMLHttpRequest
            oModel.setHeaders({ 'X-Requested-With': 'X'});            

            //requisição POST (OData create)
            oModel.create("/Parceiros", oPayload, {
                success: oResponse => {
                    MessageToast.show("Parceiro " + oResponse.PartnerId + " criado com sucesso!");
                },
                error: oError => {
                  let oErro = JSON.parse(oError.responseText);
                  MessageBox.error(oErro.error.message.value);
                }
            });
        }
      });
    }
  );
  