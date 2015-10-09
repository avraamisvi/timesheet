
var HomeController = {

  inicialize: function () {
    date = new Date();

    day = date.getDate();
    month = date.getMonth();
    hour = date.getHours();
    min = date.getMinutes()

    date = ''+(day<10?'0'+day:day)+'/'+(month<10?'0'+month:month)+'/'+date.getFullYear();
    //time = ''+(hour<10?'0'+hour:hour)+':'+(min<10?'0'+min:min);

    $('#home-date').html(date);
  }
}
