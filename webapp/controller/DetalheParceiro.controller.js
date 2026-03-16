sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/m/MessageToast",
        "sap/m/MessageBox"        
    ],
    function(BaseController, Fragment, MessageToast, MessageBox) {
      "use strict";
  
      return BaseController.extend("fiori.z99bp.controller.DetalheParceiro", {
        onInit: function() {

            this._oFragment;

            //resgata o roteador 
            let oRoteador = this.getOwnerComponent().getRouter();

            //interceptar a rota de detalhe e anexar uma função para resgatar o ID
            oRoteador.getRoute("RouteDetalheParceiro").attachPatternMatched(this.rotaDetalheParceiro, this);
            
            //troca o tipo de binding pra bidirecional, para que aceite alterações tanto no backend quanto no frontend (através do user)
            this.getOwnerComponent().getModel().sDefaultBindingMode = "TwoWay";     
        },

        rotaDetalheParceiro: function(oEvent){

            //resgata o ID do parceiro na URL
            let sIdParceiro = oEvent.getParameters().arguments.idParceiro;

            //resgata o modelo principal OData (sem nome)
            let oModel = this.getOwnerComponent().getModel();


            //monta o caminho do Read no modelo
            let sCaminho = oModel.createKey("/Parceiros", {
                PartnerId: sIdParceiro
            });

            //associa o caminho do parceiro no modelo na view 
            this.getView().bindElement(sCaminho);

            if(!this._oFragment){
                Fragment.load({
                    name: "fiori.z99bp.view.fragment.formParceiro",
                    controller: this
                }).then(oFragment => {
                    //guardar o fragmento instanciado
                    this._oFragment = oFragment;

                    //inclui como dependente da view
                    this.getView().addDependent(oFragment);
                    //exibe o fragmento na content da página
                    this.getView().byId("detalheParceiro").addContent(this._oFragment);
                });
            }else{
                //exibe o fragmento na content da página
                this.getView().byId("detalheParceiro").addContent(this._oFragment);
            }
     
        },
        aoEditar: function(oEvent){
            //resgata o modelo de modo
            let oModeloModo = this.getOwnerComponent().getModel("modo");

            //altera a propriedade editável para true para habilitar todos os inputs do formulário
            oModeloModo.setProperty("/editavel", true);

            //esconde o botão editar
            this.getView().byId("btnEditar").setVisible(false);

            //exibe os botões salvar e cancelar
            this.getView().byId("btnSalvar").setVisible(true);
            this.getView().byId("btnCancelar").setVisible(true);     

        },

        aoCancelar: function(){
            //resgata o modelo de modo
            let oModeloModo = this.getOwnerComponent().getModel("modo");

            //altera a propriedade editável para false para habilitar todos os inputs do formulário
            oModeloModo.setProperty("/editavel", false);

            //esconde os botões salvar e cancelar
            this.getView().byId("btnSalvar").setVisible(false);
            this.getView().byId("btnCancelar").setVisible(false);     

            //exibe o botão editar
            this.getView().byId("btnEditar").setVisible(true);

            //resgata o modelo OData
            let oModel = this.getOwnerComponent().getModel();
            //reset das alterações
            oModel.resetChanges();

        },

        aoSalvar: function(oEvent){
            //resgata o caminho para o update
            let sCaminho = this.getView().getBindingContext().getPath();
            
            //resgata os dados a serem enviados
            let oDados = this.getView().getBindingContext().getObject();

            //resgata o modelo OData
            let oModel = this.getOwnerComponent().getModel();

            //configuração das propriedades técnicas pro PUT
            oModel.setHeaders({ 'X-Requested-With': 'X'});
            oModel.sDefaultUpdatedMethod = "PUT";            

            //envia a requisição PUT
            oModel.update(sCaminho, oDados, {
                success: oResponse => {
                    //notificação simples na tela
                    MessageToast.show("Dados salvos com sucesso!");

                    //resgata o modelo de modo para fechar o formulário
                    let oModeloModo = this.getOwnerComponent().getModel("modo");
                    oModeloModo.setProperty("/editavel",false);

                    //habilitar o modo de visualização (salvar e cancelar escondidos e o botão editar visível)
                    let oView = this.getView();
                    oView.byId("btnEditar").setVisible(true);
                    oView.byId("btnSalvar").setVisible(false);
                    oView.byId("btnCancelar").setVisible(false);
                },
                error: oError => {
                    //transforma o erro de string para JSON para poder ler o atributo error.message.value
                    let oErro = JSON.parse(oError.responseText);

                    //mensagem de erro no popup
                    MessageBox.error(oErro.error.message.value);
                }
            });
        }

      });
    }
  );
  