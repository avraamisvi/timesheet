
var EntradaController = {

   ultimaEntrada: null,

   listarEntradas: function() {

     Repository.obterEntradas(new Date(), function(err){
       console.log(err);
     }, function (result){

       $.get('entrada_list.mst', function(template) {

         console.log(result);

         var rendered = Mustache.render(template, {entradas:result.docs});

         if(result.docs.length > 0)
          EntradaController.ultimaEntrada = result.docs[result.docs.length-1];

         $('#entradas_container').html(rendered);
       });

     });

   },

   checkIn: function() {

     dateTime = this.getDateTime();

     entrada = {
       _id: new Date().toISOString(),
       entrada: {hora:dateTime.hour, minuto: dateTime.min, periodo: 'AM'},
       saida: {hora:dateTime.hour, minuto: dateTime.min, periodo: 'PM'},
       total: 10,
       aberto: true,
       tarefa_id: 1,
       tarefa: "abacate",
       data: dateTime.date,
     };

     Repository.salvarEntrada(entrada, function(err) {
       console.log(err)
     }, function(ent, result) {//sucesso
       console.log(result)
       EntradaController.listarEntradas();
     });
   },

   getDateTime: function(date) {
     date = new Date();

     day = date.getDate();
     month = date.getMonth();
     hour = date.getHours();
     min = date.getMinutes()

     date = ''+(day<10?'0'+day:day)+'/'+(month<10?'0'+month:month)+'/'+date.getFullYear();

     return {date: date, min: min, hour: hour};
   }
 }
