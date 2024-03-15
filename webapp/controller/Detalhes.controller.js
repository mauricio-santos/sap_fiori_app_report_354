sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/format/NumberFormat",
        "br/com/gestao/fioriappreport354/util/Formatter"
    ],
    function(BaseController, NumberFormat, Formatter) {
      "use strict";
  
      return BaseController.extend("br.com.gestao.fioriappreport354.controller.Detalhes", {

        objFormatter: Formatter,

        onInit: function() {
          // debugger;
          // CRIANDO OBJETO ROUTE
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          // ACOPLANDO A FUNÇÃO QUE FARÁ O bindingElement
          oRouter.getRoute("RouteDetalhes").attachMatched(this.onBindingProdutoDetalhes, this);
        },

        onBindingProdutoDetalhes: function(event){
          // debugger;
          //CAPTURANDO O PARÂMETRO TRAFEGADO NO RouteDetalhes (productId)
          var productId = event.getParameter("arguments").productId;

          // Objeto referente a view Detalhes
          var oView = this.getView();

          // Criar URL de chamada da entidade Products
          var sURL = "/Products('" + productId + "')";

          // Fazendo o bindingElement
          oView.bindElement({
            path: sURL,
            parameters: {expand: 'to_cat'},
            events: {
              change: this.onBindingChange.bind(this), //Validando id do produto
              dataRequested: function() {
                // debugger
                oView.setBusy(true)
              },
              dataReceived: function(data) {
                // debugger
                oView.setBusy(false)
              }
            }
          });

        },

        //Validando o id do produto
        onBindingChange: function(event){
          // debugger;
          var oView = this.getView();
          var oElementBinding = oView.getElementBinding();
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          //Se o produto não existir
          if(!oElementBinding.getBoundContext()){
            //redirecionando para a página de erro
            oRouter.getTargets().display("TargetObjNotFound");
            return;
          }
        },

        onNavBack: function(){
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteLista");
        },

     
    }); //end functions
  }
);
  