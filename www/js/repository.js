var remoteCouch = false;

var Repository = {

  atividadesdb: null,
  clientesdb: null,
  entradasdb: null,
  totaldb: null,

  createDatabase: function() {
    this.atividadesdb = new PouchDB('atividadesdb');
    this.clientesdb = new PouchDB('clientesdb');
    this.entradasdb = new PouchDB('entradasdb');
    this.totaldb = new PouchDB('totaldb');

    this.entradasdb.createIndex({
      index: {
        fields: ['milliseconds']
      }
    }).then(function (result) {
      console.log(result)
    }).catch(function (err) {
      console.log(err)
    });
  },

  getFormatedDate: function(date) {

    day = date.getDate();
    month = date.getMonth();
    hour = date.getHours();
    min = date.getMinutes();

    return ''+(day<10?'0'+day:day)+'/'+(month<10?'0'+month:month)+'/'+date.getFullYear();
  },

  removerTarefa: function(id, errorCall, sucessoCall) {
      this.removerPorId(this.atividadesdb, id, errorCall, sucessoCall);
  },

  obterTarefa: function(id, errorCall, sucessoCall) {

      this.obterPorId(this.atividadesdb, id, errorCall, sucessoCall);
  },

  obterTarefas: function(cliente_id, errorCall, sucessoCall) {

    this.atividadesdb.createIndex({
      index: {
        fields: ['cliente_id']
      }
    }).then(function (result) {

      Repository.atividadesdb.find({
        selector: {cliente_id: cliente_id}
      }).then(function (result) {
        sucessoCall(result);
      }).catch(function (err) {
        errorCall(err);
      });

    });

  },

  obterEntrada: function(id, errorCall, sucessoCall) {

      this.obterPorId(this.entradasdb, id, errorCall, sucessoCall);
  },

  removerEntrada: function(id, errorCall, sucessoCall) {
      this.removerPorId(this.entradasdb, id, errorCall, sucessoCall);
  },

  obterEntradas: function(data, errorCall, sucessoCall) {

    data = this.getFormatedDate(data);

    console.debug(data);

    this.entradasdb.createIndex({
      index: {
        fields: ['milliseconds']
      }
    }).then(function (result) {

      console.log(result)

      Repository.entradasdb.find({
        selector: {data: data, milliseconds: {'$exists':true}},
        sort:[{'milliseconds':'asc'}]
      }).then(function (result) {
        sucessoCall(result);
      }).catch(function (err) {
        errorCall(err);
      });
    })
  },

  obterEntradasTarefa: function(tarefa_id, errorCall, sucessoCall) {


    this.entradasdb.createIndex({
      index: {
        fields: ['tarefa_id']
      }
    }).then(function (result) {

      Repository.entradasdb.find({
        selector: {tarefa_id: tarefa_id}
      }).then(function (result) {
        sucessoCall(result);
      }).catch(function (err) {
        errorCall(err);
      });
    })
  },

  obterEntradasPeriodo: function(inicio, fim, errorCall, sucessoCall) {

    this.entradasdb.createIndex({
      index: {
        fields: ['milliseconds']
      }
    }).then(function (result) {

      Repository.entradasdb.find({
        selector: {$and: [
          {milliseconds: {$gte: inicio}},
          {milliseconds: {$lte: fim}},
          ]},
        sort:[{'milliseconds':'asc'}]
      }).then(function (result) {
        sucessoCall(result);
      }).catch(function (err) {
        errorCall(err);
      });
    })
  },

  obterCliente: function(id, errorCall, sucessoCall) {
    this.obterPorId(this.clientesdb, id, errorCall, sucessoCall);
  },

  obterPorId: function(db, id, errorCall, sucessoCall) {
    db.get(id).then(function (doc) {
        sucessoCall(doc);
      }).catch(function (err) {
        errorCall(err);
      });
  },

  removerPorId: function(db, id, errorCall, sucessoCall) {
    this.obterPorId(db, id, errorCall, function(doc){
      return db.remove(doc, sucessoCall);
    });
  },

  obterClientes: function(errorCall, sucessoCall) {

    this.clientesdb.allDocs({
      include_docs: true,
      attachments: true
    }).then(function (result) {
      sucessoCall(result)
    }).catch(function (err) {
      errorCall(err);
    });
  },


  salvarEntrada: function(entrada, errorCall, sucessoCall) {
    this.entradasdb.put(entrada, function callback(err, result) {
      if (!err) {
        sucessoCall(entrada, result);
      } else {
        errorCall(err);
      }
    });
  },

  salvarCliente: function(cliente, errorCall, sucessoCall) {
    this.clientesdb.put(cliente, function callback(err, result) {
      if (!err) {
        sucessoCall(cliente, result);
      } else {
        errorCall(err);
      }
    });
  },

  salvarTarefa: function(atividade, errorCall, sucessoCall) {
    this.atividadesdb.put(atividade, function callback(err, result) {
      if (!err) {
        sucessoCall(atividade, result);
      } else {
        errorCall(err);
      }
    });
  }

}
