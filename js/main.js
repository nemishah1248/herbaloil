(function($){
   'use strict';
   //Отдельном выносим языки, для более простой локализации
   var Lang = {
       ru: {
           //Месяца
           months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
           //Месяца в родительcком падеже
           monthsRp: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
           //Месяца в предложном падеже
           monthsPp: ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'],
           maxPurchase: 'Больше всего заказов (_COUNT_) было _DATE_ _MONTH_ 2017 года.',
           stockInfoTitle: 'Более 100 000 продаж в ',
           stockInfoTime: 'Сроки проведения акции с _STARTDATE_ _STARTMONTH_ по _ENDDATE_ _ENDMONTH_'
       },
       es: {
           months: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Deciembre'],
           monthsRp: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'moviembre', 'deciembre'],
           monthsPp: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'moviembre', 'deciembre'],
           maxPurchase: 'Mas ventas (_COUNT_) fueron rezalizadas _DATE_ _MONTH_ del año.',
           stockInfoTitle: 'Más de 100 000 ventas en ',
           stockInfoTime: 'La oferta dura desde _STARTDATE_ _STARTMONTH_ hasta _ENDDATE_ _ENDMONTH_'
       }
   };

   //Объявляем класс нашего лендинга
   var Landing = function () {

       this.nowDate = new Date();
       
       //Параметры загрузки лендинга
       this.params = {
           lang: 'es', //локализация
           maxPurchase: 2419, //Максимальное кол-во покупок
           maxPurchaseDate: 2, //Количество дней назад 
           startStockDate: 29, //Дней назад началась акция
           endStockDate: 1, //Дней через которые акция закончится
           countDownDiff: Math.ceil((24*60*60)-(this.nowDate.getHours() * 60 * 60 + this.nowDate.getMinutes() * 60 + this.nowDate.getSeconds())), //Количество секунд до конца таймера
           selectors: {
               countDown: '.landing__countdown', //Таймер
               maxPurcahesDate: '.landing__maxpurcashe', //Максимальное кол-во покупок
               stockInfo: '.landing__stockinfo',
               stockInfoTitle: '.landing__stockinfo_title'
           }
       };

       //Стартуем таймер
       this.initCountDown();
       //Заполняем обман
       //Максимальное количество покупок
       this.initMaxPurcasheDate();
       //Даты проведения акции
       this.initStockInfo();

       this.initEvents();
   };
   //Список ивентов лендинга
   Landing.prototype.initEvents = function() {
       this.removeStyleTag();
      $('.scrollto').on('click', this.scrollToForm);

       $('.js-address').on('input', this.autocompleteAddress);

       $(document).on('click', this.checkDocClick);
   };

   //Информация о дате проведения лендингов
   Landing.prototype.initStockInfo = function() {
       var lang = Lang[this.params.lang];
       var stockTitle = lang.stockInfoTitle + lang.monthsPp[this.nowDate.getUTCMonth()];


       var endStockDate = new Date(this.nowDate.getTime() + (this.params.endStockDate*24*60*60*1000));
       var startStockDate = new Date(this.nowDate.getTime() - (this.params.startStockDate*24*60*60*1000));

       var stockInfo = lang.stockInfoTime;
           stockInfo = stockInfo.replace('_STARTDATE_', startStockDate.getUTCDate());
           stockInfo = stockInfo.replace('_ENDDATE_', endStockDate.getUTCDate());
           stockInfo = stockInfo.replace('_STARTMONTH_', lang.monthsRp[startStockDate.getMonth()]);
           stockInfo = stockInfo.replace('_ENDMONTH_', lang.monthsRp[endStockDate.getMonth()]);
       
       $(this.params.selectors.stockInfoTitle).html(stockTitle);
       $(this.params.selectors.stockInfo).html(stockInfo);
   };
   
   //Максимальное количество покупок
   Landing.prototype.initMaxPurcasheDate = function() {
       var maxPurchaseDate = new Date(this.nowDate.getTime() - (this.params.maxPurchaseDate*24*60*60*1000));
       var htmlString = Lang[this.params.lang].maxPurchase;
           htmlString = htmlString.replace('_COUNT_', this.params.maxPurchase);
           htmlString = htmlString.replace('_DATE_', maxPurchaseDate.getUTCDate());
           htmlString = htmlString.replace('_MONTH_', Lang[this.params.lang].monthsRp[maxPurchaseDate.getUTCMonth()]);

       $(this.params.selectors.maxPurcahesDate).html(htmlString);
   };

   Landing.prototype.initCountDown = function() {
       var _this = this,
           endDate = new Date(this.nowDate.getTime() + this.params.countDownDiff * 1000);

       var countDownTimer = setInterval( function () {
           var diffDate = new Date(endDate.getTime() - Date.now()),
               h = (diffDate.getHours() > 9) ? diffDate.getHours() : '0'+diffDate.getHours(),
               m = (diffDate.getMinutes() > 9) ? diffDate.getMinutes() : '0'+diffDate.getMinutes(),
               s = (diffDate.getSeconds() > 9) ? diffDate.getSeconds() : '0'+diffDate.getSeconds();

           var htmlTime = '<span class="hours">'+ h +'</span>'+
                          '<span class="minutes">'+ m +'</span>'+
                          '<span class="seconds">'+ s +'</span>';

           $(_this.params.selectors.countDown).html(htmlTime);
       }, 1000);
   };

   Landing.prototype.removeStyleTag = function(event) {
       $(document.head).find('style').remove();
   };

   Landing.prototype.scrollToForm = function(event) {
      var $target = $(event.currentTarget);

      $("body,html").animate({
           scrollTop: $($target.attr("href")).offset().top
       }, 1e3);
       event.preventDefault();
   };


   $(function() {
       window.landing = new Landing();
   });
   $(document).ready(function () {
      $('.toform').click(function () {
         $("html, body").animate({scrollTop: $("#order_form").offset().top}, 1000);
         return false;
      });
   });
})(jQuery);
function validate(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }
