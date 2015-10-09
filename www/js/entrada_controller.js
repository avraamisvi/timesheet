
var EntradaController = {

   listarEntradas: function() {

     Repository.obterEntradas(new Date(), function(err){
       console.log(err);
     }, function (result){

       $.get('entrada_list.mst', function(template) {

         console.log(result);

         var rendered = Mustache.render(template, {entradas:result.docs});

         $('#entradas_container').html(rendered);
       });

     });

   },

   checkIn: function() {

     entrada = {
       _id: new Date().toISOString(),
       entrada: {hora:10, minuto: 10, periodo: 'AM'},
       saida: {hora:10, minuto: 10, periodo: 'PM'},
       total: 10,
       tarefa_id: 1,
       tarefa: "abacate",
       data: "09/09/2015",
     };

     Repository.salvarEntrada(entrada, function(err) {
       console.log(err)
     }, function(ent, result) {//sucesso
       console.log(result)
     });
   }

   /*getTime: function(date) {
     day = date.getDate();
     month = date.getMonth();
     hour = date.getHours();
     min = date.getMinutes()
   }*/
 }
