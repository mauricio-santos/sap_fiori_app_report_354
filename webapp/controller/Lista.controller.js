sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/gestao/fioriappreport354/util/Formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Formatter) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappreport354.controller.Lista", {

            objFormatter: Formatter,
            
            onInit: function () {
                // var oConfiguration = sap.ui.getCore().getConfiguration();
                // oConfiguration.setFormatLocale("pt-BR");



            },

            onSearch: function(event){
                // debugger;

                //Capturando os inputs do filterbar
                var oProductId = this.byId("productIdInput").getValue();
                var oProductName = this.byId("productNameInput").getValue();

                //Implementando objeto filter baseado no valor buscado
                var oFilter = new Filter({
                    filters: [
                        new Filter("Productid", FilterOperator.Contains, oProductId),
                        new Filter("Name", FilterOperator.Contains, oProductName)
                    ],
                    and: true
                });

                var oTable = this.byId("productsTable");
                var binding = oTable.getBinding("items");
                binding.filter(oFilter);
            },

            // ########### CRIAR ROTAS EM TEMPO DE EXECUÇÃO ###########
            onRouting: function(){
                // debugger;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this); //Pega todas as rotas do manifest.json
                oRouter.navTo("RouteDetalhes"); //Redireciona para rota desejada            
            },

            // ########### CRIANDO ROTAS ASSOCIADAS A ÍTENS DA LISTA ###########
            onSelectedItem: function(event){
                // debugger;

                // Capturando id do objeto no evento
                var oProductId = event.getSource().getBindingContext().getProperty("Productid");
                
                // Redirecionando para detalhes com o parâmetro
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDetalhes", {
                    productId: oProductId
                });          
            },
        });
    });
