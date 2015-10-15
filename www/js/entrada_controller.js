
var EntradaController = {

   ultimaEntrada: null,

   listarEntradas: function() {

     Repository.obterEntradas(new Date(), function(err){
       console.log(err);
     }, function (result){

       $.get('entrada_list.mst', function(template) {

         if(result.docs.length > 0) {
          EntradaController.ultimaEntrada = result.docs[result.docs.length-1];

          dateTime = EntradaController.getDateTime();
          EntradaController.ultimaEntrada.saida = {hora:dateTime.hour, minuto: dateTime.min};
         }

         var rendered = Mustache.render(template, {entradas:result.docs,
           entradaHoraMin:function() {
              return ''+(this.entrada.hora<10?'0'+this.entrada.hora:this.entrada.hora)+':'+(this.entrada.minuto<10?'0'+this.entrada.minuto:this.entrada.minuto);
           },
           saidaHoraMin:function() {
             return ''+(this.saida.hora<10?'0'+this.saida.hora:this.saida.hora)+':'+(this.saida.minuto<10?'0'+this.saida.minuto:this.saida.minuto);
           },
           estilo:function() {
             return this.aberto?'entrada_atual':'entrada_antiga';
           }
         });

         $('#entradas_container').html(rendered);
       });

     });

   },

   checkIn: function() {

     dateTime = this.getDateTime();

     if(EntradaController.ultimaEntrada) {
       EntradaController.ultimaEntrada.aberto = false;
       EntradaController.ultimaEntrada.saida = {hora:dateTime.hour, minuto: dateTime.min};
     }

     entrada = {
       _id: new Date().toISOString(),
       entrada: {hora:dateTime.hour, minuto: dateTime.min},
       saida: {hora:dateTime.hour, minuto: dateTime.min},
       milliseconds: dateTime.time,
       total: 10,
       aberto: true,
       tarefa_id: 1,
       tarefa: "abacate",
       data: dateTime.date,
     };

     if(EntradaController.ultimaEntrada) {
       Repository.salvarEntrada(EntradaController.ultimaEntrada, function(err) { //salva a ultima entrada
         console.log(err)
       }, function(ent, result) {//sucesso - cria a nova entrada
         Repository.salvarEntrada(entrada, function(err) {
           console.log(err)
         }, function(ent, result) {
           //console.log(result)
           EntradaController.listarEntradas();
         });
       });
    } else {
      Repository.salvarEntrada(entrada, function(err) {
        console.log(err)
      }, function(ent, result) {//sucesso
        //console.log(result)
        EntradaController.listarEntradas();
      });
    }
   },

   editarEntrada: function(id) {

     Repository.obterTarefas(function(err){}, function(tarefas) {

       Repository.obterEntrada(id, function(err){
         console.log(err);
       }, function (doc){

         for(i = 0; i < tarefas.length; i++) {
            if(tarefas[i]._id == doc.tarefa_id) {
              tarefas[i].selecionado = true;
            } else {
              tarefas[i].selecionado = false;
            }
         }

         $.get('entrada_edit.mst', function(template) {
           var rendered = Mustache.render(template, {entrada:doc, tarefas: tarefas});
           $('#entradas_container').html(rendered);
         });
       });
     });
   },

   getDateTime: function(date) {
     date = new Date();

     time = date.getTime();
     day = date.getDate();
     month = date.getMonth();
     hour = date.getHours();
     min = date.getMinutes()

     date = ''+(day<10?'0'+day:day)+'/'+(month<10?'0'+month:month)+'/'+date.getFullYear();

     return {date: date, min: min, hour: hour, time: time};
   }
 }
