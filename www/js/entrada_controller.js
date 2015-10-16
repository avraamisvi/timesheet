
var EntradaController = {

   ultimaEntrada: null,
   modoListagem: true,

   listarEntradas: function() {
     this.modoListagem = true;

     Repository.obterEntradas(new Date(), function(err){
       console.log(err);
     }, function (result){

       $.get('entrada_list.mst', function(template) {

        EntradaController.ultimaEntrada = null;

        if(result.docs.length > 0) {

           for(i = 0; i < result.docs.length; i++) {
             if(result.docs[i].aberto) {
               EntradaController.ultimaEntrada = result.docs[i];
               break;
             }
           }

          if(EntradaController.ultimaEntrada) {
            dateTime = EntradaController.getDateTime();
            EntradaController.ultimaEntrada.saida = {hora:dateTime.hour, minuto: dateTime.min};
          }

         }

         var rendered = Mustache.render(template, {entradas:result.docs,
           entradaHoraMin:function() {
              return ''+(this.entrada.hora<10?'0'+this.entrada.hora:this.entrada.hora)+':'+(this.entrada.minuto<10?'0'+this.entrada.minuto:this.entrada.minuto);
           },
           saidaHoraMin:function() {
             return ''+(this.saida.hora<10?'0'+this.saida.hora:this.saida.hora)+':'+(this.saida.minuto<10?'0'+this.saida.minuto:this.saida.minuto);
           },
           getTotal:function(){

             lo_hora = this.saida.hora - this.entrada.hora;
             lo_min = Math.abs(this.saida.minuto - this.entrada.minuto);

             return ''+(lo_hora<10?'0'+lo_hora:lo_hora)+':'+(lo_min<10?'0'+lo_min:lo_min);
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
       saida: {hora:23, minuto: 59},
       milliseconds: dateTime.time,
       total: 0,
       aberto: true,
       tarefa_id: 0,
       tarefa: "-----",
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


   checkOut: function() {

     dateTime = this.getDateTime();

     if(EntradaController.ultimaEntrada) {
       EntradaController.ultimaEntrada.aberto = false;
       EntradaController.ultimaEntrada.saida = {hora:dateTime.hour, minuto: dateTime.min};
       EntradaController.ultimaEntrada.total = (EntradaController.ultimaEntrada.saida.hora - EntradaController.ultimaEntrada.entrada.hora) + (Math.abs(EntradaController.ultimaEntrada.saida.minuto - EntradaController.ultimaEntrada.entrada.minuto)/60);
     }

     if(EntradaController.ultimaEntrada) {
       Repository.salvarEntrada(EntradaController.ultimaEntrada, function(err) { //salva a ultima entrada
         console.log(err)
       }, function(ent, result) {//sucesso - cria a nova entrada
           EntradaController.listarEntradas();
       });
    }
   },

   selecionarCliente: function(id, clientes) {
     for(i = 0; i < clientes.length;i++) {
       if(id == clientes[i].doc._id) {
         clientes[i].doc.selecionado = true;
         return;
       }
     }
   },

   editarEntrada: function(id) {

     this.modoListagem = false;

     Repository.obterEntrada(id, function(err){console.log(err);}, function (doc) {

       if(EntradaController.ultimaEntrada != null && EntradaController.ultimaEntrada._id == id) {
         doc = EntradaController.ultimaEntrada;
       }

        if(doc.tarefa_id != 0) {
          Repository.obterTarefa(doc.tarefa_id, function(err){}, function(tarefa) {
            Repository.obterClientes(function(err){console.log(err);}, function(clientes_res){

            EntradaController.selecionarCliente(tarefa.cliente_id, clientes_res.rows);

              Repository.obterTarefas(tarefa.cliente_id, function(err){}, function(tarefas) {

                EntradaController.construirEditarEntrada(doc, tarefas.docs, clientes_res);

              });

           });
          });
        } else {

            Repository.obterClientes(function(err){console.log(err);}, function(clientes_res) {

              if(clientes_res.rows.length > 0 ) {
                clientes_res.rows[0].doc.selecionado=true;
              }

              Repository.obterTarefas(clientes_res.rows[0].id, function(err){}, function(tarefas) {

                EntradaController.construirEditarEntrada(doc, tarefas.docs, clientes_res);

              });

           });

        }

     });

   },

   construirEditarEntrada: function(doc, tarefas, clientes_res) {

      for(i = 0; i < tarefas.length; i++) {
         if(tarefas[i]._id == doc.tarefa_id) {
           tarefas[i].selecionado = true;
         } else {
           tarefas[i].selecionado = false;
         }
      }

      $.get('entrada_edit.mst', function(template) {
        var rendered = Mustache.render(template,
          {
            entrada:doc,
            clientes: clientes_res.rows,
            tarefas: tarefas,
            formatTimeEntrada:function(entr) {
              return function() {
                return EntradaController.formatTime(entr.entrada.hora, entr.entrada.minuto);
              }
           }(doc),
           formatTimeSaida:function(entr) {
             return function() {
               return EntradaController.formatTime(entr.saida.hora, entr.saida.minuto);
             }
           }(doc),
        });
        $('#entradas_container').html(rendered);
      });
   },

   salvarEntrada: function(id) {

     Repository.obterEntrada(id, function(err){
       console.log(err);
     }, function (entrada){

       var milliseconds = entrada.milliseconds;

       var entrada_hora = $("#txt_inicio").val()
       entrada_hora = entrada_hora.split(":");
       var entrada_min = parseInt(entrada_hora[1]);
       entrada_hora = parseInt(entrada_hora[0]);

       var saida_hora = $("#txt_fim").val()
       saida_hora = saida_hora.split(":");
       var saida_min = parseInt(saida_hora[1]);
       saida_hora = parseInt(saida_hora[0]);

       var date = new Date(milliseconds);

       date.setHours(entrada_hora);
       date.setMinutes(entrada_min);

       entrada.entrada = {hora:entrada_hora, minuto: entrada_min};
       entrada.saida = {hora:saida_hora, minuto: saida_min};
       entrada.total = (saida_hora - entrada_hora) + ((saida_min - entrada_min)/60);
       entrada.milliseconds = date.getTime();
       entrada.tarefa_id = $("#sel_tarefas").val();
       entrada.tarefa = $("#sel_tarefas option:selected").text();
       entrada.descricao = $("#txt_descricao").val();

        Repository.salvarEntrada(entrada, function(err) {
          console.log(err)
        }, function(ent, result) {//sucesso
          EntradaController.listarEntradas();
        });
     });
   },

   removerEntrada: function(id) {
     Repository.removerEntrada(id,function(err){console.log(err);}, function(res){EntradaController.listarEntradas();});
   },

   formatTime: function(hour, min) {
     return ''+(hour<10?'0'+hour:hour)+':'+(min<10?'0'+min:min);
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
   },

   updateList: function() {
     if(this.modoListagem) {
       this.listarEntradas();
     }
   }
 }

setInterval(function() {EntradaController.updateList();}, 30000);
