sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/format/NumberFormat"
    ],
    function(BaseController, NumberFormat) {
      "use strict";
  
      return BaseController.extend("br.com.gestao.fioriappreport354.controller.Detalhes", {
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

        dateFormat: function(value){
          // debugger;

          var oConfiguration = sap.ui.getCore().getConfiguration();
          var oLocale = oConfiguration.getFormatLocale();
          // console.log(oLocale)
          

          if(value){
              var year = new Date().getFullYear();
              if (year === 9999){
                  return "";
              }

              var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                  style: "short",
                  pattern: (oLocale === "pt-BR") ? "dd/MM/yyyy HH:mm" : "dd.MM.yyyy HH:mm"
              });

              return oDateFormat.format(new Date(value));
          }else{
              return value
          }
      },

      productStatus: function(status){
          // debugger
          //Apresentar o texto do status medianet a propiedade status do model
          var oBundle = this.getView().getModel("i18n").getResourceBundle();
          var key = "status" + status;

          try {
              return oBundle.getText(key);
          } catch (err) {
              return;
          }
      },

      changeStatus: function(status){
          try {
              switch(status){
                  case "E":
                      return "Success";
                  case "P":
                      return "Warning";
                  case "F":
                      return "Error";
                  default:
                      return "None";
              }
              

          } catch (err) {
              return;
          }
      },

      changeIcon: function(status){
          try {
              switch(status){
                  case "E":
                      return "sap-icon://sys-enter-2";
                  case "P":
                      return "sap-icon://alert";
                  case "F":
                      return "sap-icon://error";
                  default:
                      return "";
              }                   
          } catch (err) {
              return;
          }
      },

      //Formatação de valores decimais
      floatNumber: function(value){
        var numFloat = NumberFormat.getFloatInstance({
          maxFractionDigits: 2,
          minFractionDigits: 2,
          groupingEnabled: true,
          groupingSeparator: ".",
          decimalSeparator: ","
        });

        return numFloat.format(value);
      }


    }); //end functions
  }
);
  