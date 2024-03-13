sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappreport354.controller.Lista", {
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
