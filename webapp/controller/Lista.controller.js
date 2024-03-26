sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/gestao/fioriappreport354/util/Formatter",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Formatter, Fragment) {
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
                var oCategory = this.byId("productCategory").getValue();

                var objFilter = {filters: [], and: true};
                objFilter.filters.push(new Filter("Productid", FilterOperator.Contains, oProductId));
                objFilter.filters.push(new Filter("Name", FilterOperator.Contains, oProductName));
                objFilter.filters.push(new Filter("Category", FilterOperator.Contains, oCategory));

                var oFilter = new Filter(objFilter);

                //Implementando objeto filter baseado no valor buscado
                // var oFilter = new Filter({
                //     filters: [
                //         new Filter("Productid", FilterOperator.Contains, oProductId),
                //         new Filter("Name", FilterOperator.Contains, oProductName)
                //     ],
                //     and: true
                // });

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

            // ########### CRIAR MATCH CODE - FRAGMENTS ###########

            onCategory: function(event){
                //Criando propiedade _oIpunt e capturando o id do input que o chamou
                this._oInput = event.getSource().getId();

                //capturando a view
                var oView = this.getView();

                // debugger;

                // Verificando se o objeto fragment existe. senão cria e adiciona na view
                // this._CategorySearchHelp é o objeto que armazena o match code
                if(!this._CategorySearchHelp){
                    //Carregamento do fragmento
                    this._CategorySearchHelp = Fragment.load({
                        id: oView.getId(),
                        //Namespace do fragmento
                        name: "br.com.gestao.fioriappreport354.frags.SH_Categories",
                        controller: this
                    }).then(function(oDialog){
                        //oDialog corresponde ao fragment (_CategorySearchHelp) recém criado
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this._CategorySearchHelp.then(function(oDialog){
                    //Limpando o filtro de categorias
                    oDialog.getBinding("items").filter([]); 

                    //Abertura do fragmento
                    oDialog.open();

                });
            },

            //Mostrando lista de Categorias
            onValueHelpSearch: function(event){

                //Capturando string digitada
                var sValue = event.getParameter("value");
                
                // Opção 1 - Criando um único objeto filtro
                //Criando um filtro e buscando resultado
                // var oFilter = new Filter("Description", FilterOperator.Contains, sValue);
                // event.getSource().getBinding("items").filter([oFilter]);

                // Opção 2 - Criando um objeto dinâmico onde poderá adicionar várias propiedades
                var objFilter = {filters: [], and: false};

                //Criação dos filtros de Descrição e ID da Categoria
                objFilter.filters.push(new Filter("Description", FilterOperator.Contains, sValue));
                objFilter.filters.push(new Filter("Category", FilterOperator.Contains, sValue));

                var oFilter = new Filter(objFilter);
                event.getSource().getBinding("items").filter(oFilter);
            },

            onValueHelpClose: function(event){
                // debugger
                var oSelectedItem = event.getParameter("selectedItem");
                var oInput = null;

                if(this.byId(this._oInput)){
                    oInput = this.byId(this._oInput);
                }else{
                    oInput = sap.ui.getCore().byId(this._oInput);
                }

                if(!oSelectedItem){
                    oInput.resetProperty("value");
                    return;
                }

                oInput.setValue(oSelectedItem.getTitle());
            }
        });
    });
