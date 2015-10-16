var ClienteController = {

  editing: null,

  listarClientes: function() {
    Repository.obterClientes(function(err){console.log(err);},function(result){
      console.log(result);

      $.get('cliente_list.mst', function(template) {
        var rendered = Mustache.render(template, {clientes:result.rows});
        $('#clientes_content').html(rendered);
      });
    });
  },

  editarCliente: function(id) {

    this.editing = null;
    Repository.obterCliente(id, function(err){console.log(err)}, function(cliente){
      $.get('cliente_edit.mst', function(template) {
        ClienteController.editing = cliente;
        var rendered = Mustache.render(template, {cliente: cliente});
        $('#clientes_content').html(rendered);
      });
    });
  },

  novoCliente: function() {

    $.get('cliente_edit.mst', function(template) {

      var cliente = {
        _id: new Date().toISOString(),
        nome: "",
        codigo:"",
      };

      var rendered = Mustache.render(template, {cliente: cliente});
      $('#clientes_content').html(rendered);
    });
  },

  salvarCliente: function(id) {

    var cliente = {};

    if(this.editing) {
      cliente = this.editing;
    } else {
      cliente = {
        _id: id,
        nome: "",
        codigo: "",
      };
    }

    cliente.nome = $("#txt_nome").val();
    cliente.codigo = $("#txt_codigo").val();

    Repository.salvarCliente(cliente, function(err){console.log(err)}, function(result) {
      ClienteController.listarClientes();
    });

  }

  removerCliente: function(id) {

    Repository.obterCliente(id, function(err){console.log(err)}, function(cliente){
      Repository.removerCliente(cliente, function(err){console.log(err)}, function(result) {
        Repository.obterTarefasCliente(id, ClienteController.tratarErro, function(res){
          for(i =0;i < res.docs.length;i++) {
            Repository.removerTarefa(res.docs[i]._id, TarefaController.tratarErro, function(res){console.log(res)});
          }
        });
        ClienteController.listarClientes();
      });
    });

  },

  tratarErro: function(err) {

  }
}
