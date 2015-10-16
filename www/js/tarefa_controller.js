var TarefaController = {

  editing: null,

  listarClientes: function() {
    Repository.obterClientes(function(err){console.log(err);},function(result){
      console.log(result);

      $.get('tarefa_cliente_list.mst', function(template) {
        var rendered = Mustache.render(template, {clientes:result.rows});
        $('#tarefas_content').html(rendered);
      });
    });
  },

  listarTarefasCliente: function(cliente_id) {
    Repository.obterTarefas(cliente_id, function(err){console.log(err);},function(result){
      console.log(result);

      $.get('tarefa_list.mst', function(template) {
        var rendered = Mustache.render(template, {tarefas:result.docs});
        $('#tarefas_content').html(rendered);
      });
    });
  },

  selecionarCliente: function(id, clientes) {
    for(i = 0; i < clientes.length;i++) {
      if(id == clientes[i].doc._id) {
        clientes[i].doc.selecionado = true;
        return;
      }
    }
  },

  editarTarefa: function(id) {

    this.editing = null;

    Repository.obterClientes(function(err){console.log(err);}, function(clientes_res){
      Repository.obterTarefa(id, function(err){console.log(err)}, function(tarefa){
        $.get('tarefa_edit.mst', function(template) {
          TarefaController.editing = tarefa;

          TarefaController.selecionarCliente(tarefa.cliente_id, clientes_res.rows);

          var rendered = Mustache.render(template, {tarefa: tarefa, clientes: clientes_res.rows});
          $('#tarefas_content').html(rendered);
        });
      });
    });

  },

  novaTarefa: function() {

    $.get('tarefa_edit.mst', function(template) {

      var tarefa = {
        _id: new Date().toISOString(),
        nome: "",
        codigo:"",
        cliente_id: 0
      };

      Repository.obterClientes(function(err){console.log;}, function(clientes_res){
        var rendered = Mustache.render(template, {tarefa: tarefa, clientes: clientes_res.rows});
        $('#tarefas_content').html(rendered);
      });

    });
  },

  salvarTarefa: function(id) {

    var tarefa = {};

    if(this.editing) {
      tarefa = this.editing;
    } else {
      tarefa = {
        _id: id,
        nome: "",
        codigo: "",
        cliente_id: 0
      };
    }

    tarefa.nome = $("#txt_nome").val();
    tarefa.codigo = $("#txt_codigo").val();
    tarefa.cliente_id = $("#sel_clientes").val();

    Repository.salvarTarefa(tarefa, function(err){console.log(err)}, function(result) {
      TarefaController.listarTarefasCliente($("#sel_clientes").val());
    });

  }
}
