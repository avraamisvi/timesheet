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
        fields: ['data']
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

  obterEntradas: function(data, errorCall, sucessoCall) {

    data = this.getFormatedDate(data);

    console.debug(data);

    this.entradasdb.find({
      selector: {data: data}
    }).then(function (result) {
      sucessoCall(result);
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

  salvarAtividade: function(atividade, errorCall, sucessoCall) {
    this.atividadesdb.put(atividade, function callback(err, result) {
      if (!err) {
        sucessoCall(atividade, result);
      } else {
        errorCall(err);
      }
    });
  }

}
