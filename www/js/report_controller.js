var ReportController = {

  iniciar: function() {
    date = this.getDate()

    periodo = {
      inicio: date,
      fim: date
    };

    $.get('report_list.mst', function(template) {
      var rendered = Mustache.render(template,{periodo: periodo});
      $('#report').html(rendered);
    });

  },

  sincronizarServidor: function() {

  },

  enviarEmail: function() {

    var inicio = $("#txt_inicio_report").val();
    var fim = $("#txt_fim_report").val();


    inicio = inicio.split("-");
    fim = fim.split("-");

    inicio = new Date(inicio[0], inicio[1], inicio[2], 0, 0, 0, 0).getTime();
    fim = new Date(fim[0], fim[1], fim[2], 23, 59, 59, 0).getTime();

    Repository.obterEntradasPeriodo(inicio, fim, function(err){}, function(result){
      console.log(result);
    });
  },

  getDate: function() {
    var date = new Date();

    day = date.getDate();
    month = date.getMonth();

    date = ''+date.getFullYear()+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);

    return date;
  }
}
