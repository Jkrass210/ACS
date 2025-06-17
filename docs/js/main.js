"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() { }; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

$('.navigation__location__otherCity__wrap__input__inputCity').on('input', function() {

})
document.addEventListener('DOMContentLoaded', function () {
  //табы авторизации
  var tabs = document.querySelectorAll(".reg-right__tab");
  var contents = document.querySelectorAll(".reg-right--content");

  var _loop = function _loop(i) {
    tabs[i].addEventListener("click", function () {
      for (var j = 0; j < contents.length; j++) {
        contents[j].classList.remove("content--active");
      }

      for (var jj = 0; jj < tabs.length; jj++) {
        tabs[jj].classList.remove("tabs--active");
      }

      contents[i].classList.add("content--active");
      tabs[i].classList.add("tabs--active");
    });
  };

  for (var i = 0; i < tabs.length; i++) {
    _loop(i);
  }
});
$(document).ready(function () {
  $('.main-banner-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    responsive: [
        {
          breakpoint: 1024,
          settings: {
            arrows: false,
            dots: true,
          }
        },
    ]
});
  $('.main-business-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                arrows: false
              }
            },
            {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2,
                  arrows: false
                }
            },
            {
              breakpoint: 450,
              settings: {
                slidesToShow: 1,
                arrows: false
              }
          }
        ]
    });
    $( ".btn_catalog_pc" ).click(function(event){
	    event.preventDefault();
      $('.main-page-catalog').toggleClass('active');
	  });  

    $(window).scroll(function() {
      if($(this).scrollTop() > 64) {
        $('.main-page-catalog').addClass('active-scroll');
      } else {
        $('.main-page-catalog').removeClass('active-scroll');
      }
    });
  const inputData = document.querySelectorAll('.block_total_basket_box input');
  inputData.forEach((e) => {
    e.addEventListener('input', (i) => {
      const clear = i.target.parentNode.querySelector(
          '.clear-btn'
      );
      clear.classList.add('active');
      clear.addEventListener('click', () => {
        e.value = '';
        clear.classList.remove('active');
      });
    });
  });

  if (document.querySelector('.lk-biz__statistics-item--table tbody tr')) {
    $('.lk-biz__statistics-item--table tbody tr').hide().filter(function () {
      return $(this).find('td[colspan]').length;
    }).addClass('team-header').css('display', 'table-row')
    $(document).on('click', '.team-header', function() {
      $(this).nextUntil('tr.team-header').css('display', function(i,v){
        return this.style.display === 'table-row' ? 'none' : 'table-row';
      });
    });
  }

  const infoBtn = document.querySelectorAll('.block_btn_change button');
  const infoUser = document.querySelectorAll('.block_body_step .block_info_user');
  let infoBtnClicked = infoBtn[0];
  let infoUserClicked = infoUser[0];

  if (infoBtn) {
    for (let i = 0; i < infoBtn.length; i++) {
      infoBtn[i].addEventListener("click", function () {
        infoBtnClicked.classList.remove("active");
        infoUserClicked.classList.remove("active");
        this.classList.add("active");
        infoUser[i].classList.add("active");
        infoBtnClicked = this;
        infoUserClicked = infoUser[i];
      });
    }
  }

  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    vertical:true,
    asNavFor: '.slider-for',
    dots: false,
    focusOnSelect: true,
    verticalSwiping:true,
    responsive: [
      {
        breakpoint: 568,
        settings: {
          vertical: false,
        }
      }
    ]
  });

  const avatarInput = document.querySelector('[avatar]');
  const avatar = document.querySelector('.lk-biz__box__item--avatar img');

  if (avatarInput) {
    avatarInput.onchange = function(event) {
      var target = event.target;

      if (!FileReader) {
        alert('FileReader не поддерживается — облом');
        return;
      }

      if (!target.files.length) {
        alert('Ничего не загружено');
        return;
      }

      var fileReader = new FileReader();
      fileReader.onload = function() {
        avatar.src = fileReader.result;
      }

      fileReader.readAsDataURL(target.files[0]);
    }
  }

  if (document.querySelector('.select-wrapper')) {
    $('.select-wrapper').on('click', function () {
      $(this).find('.select').toggleClass('open');
    });
  }

  const orderBtn = document.querySelectorAll(".block_total_basket_wrapper button");
  let orderBtnClicked = orderBtn[0];

  for (let i = 0; i < orderBtn.length; i++) {
    orderBtn[i].addEventListener("click", function () {
      orderBtnClicked.classList.remove("active");
      this.classList.add("active");
      orderBtnClicked = this;
    });
  }

  const addressBtn = document.querySelectorAll("[data-address]");
  let addressBtnClicked = addressBtn[0];

  for (let i = 0; i < addressBtn.length; i++) {
    addressBtn[i].addEventListener("click", function () {
      addressBtnClicked.classList.remove("active");
      this.classList.add("active");
      addressBtnClicked = this;
    });
  }

  $('.block_item_category').each(function(){

    if($(this).find('.block_list a').length > 3){

      $(this).find('a:nth-child(n+4)').hide();
      $(this).find('.link_more').addClass('block').text("Еще " + (($(this).find('.block_list a').length) - 3));
    }

    $(this).find('.link_more').click(function () {
      if ($(this).hasClass('SHOW')){
        $(this).removeClass('SHOW');
        $(this).removeClass('SHOW').text("Еще " + (($(this).parent().find('.block_list a').length) - 3));
        $(this).parent().find('a:nth-child(n+4)').hide();

      }
      else {
        $(this).parent().find('a:nth-child(n+4)').show();
        $(this).addClass('SHOW').html('Скрыть');

      }
    });
  });

  const deliveryBtn = document.querySelectorAll(".delivery-popup--btn");
  let deliveryBtnClicked = deliveryBtn[0];

  for (let i = 0; i < deliveryBtn.length; i++) {
    deliveryBtn[i].addEventListener("click", function () {
      deliveryBtnClicked.classList.remove("active");
      this.classList.add("active");
      deliveryBtnClicked = this;
    });
  }

  // $('.minus').click(function () {
  //   var $input = $(this).parent().find('input');
  //   var count = parseInt($input.val()) - 1;
  //   count = count < 1 ? 1 : count;
  //   if (count == 1) {
  //     $(this).addClass("disabled");
  //   }
  //   $input.val(count);
  //   $input.change();
  //   return false;
  // });

  // $('.plus').click(function () {
  //   var $input = $(this).parent().find('input');
  //   $input.val(parseInt($input.val()) + 1);
  //   $input.change();

  //   $('.minus').removeClass("disabled");
  //   return false;
  // });

  if (document.querySelector('.js-example-basic-single')) {
    $('.js-example-basic-single').select2({
      placeholder: "Выберите клиента",
      language: {
        noResults: function (params) {
          return "Клиент не найден.";
        }
      }
    });
  }

  if (document.querySelector('.basic-single')) {
    $('.basic-single').select2({
      placeholder: "Поиск участников",
      closeOnSelect : false,
      language: {
        noResults: function (params) {
          return "Клиент не найден.";
        }
      },
      templateResult: function (idioma) {
        let picture = '';
        if($(".basic-single option[value='" + idioma.id + "']").attr("data-picture")) {
          picture = $(".basic-single option[value='" + idioma.id + "']").attr("data-picture");
        }

        var $span = $("<span><img src='" + picture + "'/> " + idioma.text + "</span>");
        return $span;
      }
    });
    $('.basic-single').select2('open');
  }

  const codeNumber = document.querySelector('.confirmation__code-number');
  const confirmBtn = document.querySelector('[data-confirm]');

  if (codeNumber) {
    codeNumber.addEventListener('input', function (evt) {
      var inp = evt.target;
      var inps = this.querySelectorAll('input');
      var value = Array.prototype.map.call(inps, x => x.value).join('');
      var i = +inp.dataset.start + inp.selectionStart, pos = value.length;

      for (var q=0; q<inps.length; ++q) {
        var start = +inps[q].dataset.start, len = +inps[q].dataset.len;
        inps[q].value = value.substr(start, len);


        if (start + len >= i) {
          inp = inps[q];
          pos = i - start;
          i = NaN;
          if (inp.getAttribute('data-start') == 5) {
            confirmBtn.classList.remove('disabled');
          } else {
            confirmBtn.classList.add('disabled');
          }
        }
      }

      inp.focus();
      inp.selectionStart = inp.selectionEnd = pos;

    })
  }

  $(".phonemask").inputmask("+7 (999) 999-9999"); //email mask
  //  $(".emailmask").inputmask({
  //    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
  //    greedy: false,
  //    onBeforePaste: function (pastedValue, opts) {
  //      pastedValue = pastedValue.toLowerCase();
  //      return pastedValue.replace("mailto:", "");
  //    },
  //    definitions: {
  //      '*': {
  //        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
  //        casing: "lower"
  //      }
  //    }
  //  });
  //проверка все input на пустоту reg.html

  function inputValid() {
    var bad = 0;

    if ($.trim($(this).val()) == "") {
      $(this).css("border-color", "red");
    } else {
      $(this).css("border-color", "#E6ECF0");
    }

    $('.verification-form__wrap :text').each(function () {
      if ($.trim($(this).val()) == "") {
        bad++;
      }
    });

    if (bad > 0) {
      $('.btn-disable').removeClass('active');
    } else {
      $('.btn-disable').addClass('active');
    }
  }

  $('.input-onenum').on('keyup', function () {
    inputValid();
    var $this = $(this);
    setTimeout(function () {
      if ($this.val().length >= parseInt($this.attr("maxlength"), 0)) $this.next("input").focus();
    }, 0);
  }); //btn next form reg

  $('.btn-required').on('click', function () {
    var bad = 0;
    var inputRequired = $(this).parents('form').find('.required');
    inputRequired.each(function () {
      if ($.trim($(this).val()) == "") {
        bad++;
        $(this).addClass('input-blinking');
      } else {
        $(this).removeClass('input-blinking');
      }
    });
    // setTimeout(function () {
    //   inputRequired.removeClass("input-blinking");
    // }, 2000);

    // if (bad > 0) {} else {
    //   $(this).parents('.registration-form').hide();
    //   $(this).parents('.registration-form').next().show();
    //   $('.reg-right__head, .reg-right--title').css('display', 'none');
    //   $(".input-onenum:first-child").focus();
    //   startTimer();
    // }
  }); //timer

  function startTimer() {
    var timer2 = "1:01";
    var interval = setInterval(function () {
      var timer = timer2.split(':'); //by parsing integer, I avoid all extra string processing

      var minutes = parseInt(timer[0], 10);
      var seconds = parseInt(timer[1], 10);
      --seconds;
      minutes = seconds < 0 ? --minutes : minutes;
      if (minutes < 0) clearInterval(interval);
      seconds = seconds < 0 ? 59 : seconds;
      seconds = seconds < 10 ? '0' + seconds : seconds; //minutes = (minutes < 10) ?  minutes : minutes;

      $('.countdown').html(minutes + ':' + seconds);
      timer2 = minutes + ':' + seconds;

      if (seconds == 0 & minutes == 0) {
        timer2 = '1:01';
      }
    }, 1000);
  } //сортировка таблицы


  var headers = $('#data-table thead th .table-title');
  $('table').not(".tablesort").addClass('tablesort'); //отключить readonly
  //$('table').not(".tablesort").not('.table-lk-noapplication').addClass('tablesort'); //отключить readonly

  $('.btn--edit').on('click', function () {
    var removeAttr = $(this).parents('tr').find('input');
    removeAttr.attr("readonly", false);
  }); //form filter search reset

  $('.personal-filter__remove').on('click', function () {
    var a = $(this).parents('.search-form').trigger('reset');

    if ($('form').hasClass('noappl-form')) {
      $(this).parents('.search-form').find('.custom-option').removeClass('selected');
      $(this).parents('.search-form').find('.custom-option:first-child').addClass('selected');
      var textCustomSelect = $(this).parents('.search-form').find('.custom-option:first-child').text();
      $('.select__trigger span').text(textCustomSelect);
    }
  }); //menu drop

  $('.sandwich').on('click', function () {
    $('.sandwich-drop').toggleClass('active');
    $(this).toggleClass('is-active');
    $('.wrapper').toggleClass('active');
  });
  $('.nav-header').on('click', function () {
    $(this).next().addClass('active');
  });
  $('.nav-body--back').on('click', function () {
    $(this).parent().removeClass('active');
  }); //слайдер авторизации

  $('.js-reg--slider').slick({
    infinite: true,
    slidesToShow: 2,
    prevArrow: $('.slide-nav--prev'),
    nextArrow: $('.slide-nav--next'),
    slidesToScroll: 1,
    dots: true,
    appendDots: $('.js-reg--dots'),
    customPaging: function customPaging(slider, i) {
      return '<span class="js-reg--dot"></span>';
    },
    responsive: [{
      breakpoint: 1100,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 900,
      settings: {
        slidesToShow: 1
      }
    }]
  }); //personal card edit remove

  $('.personal--edit-del').on('click', function () {
    $(this).parent().remove();
  }); //slide toggle

  function slideToggleMy(selector) {
    $(selector).on('click', function () {
      $(this).next().slideToggle();
      $(this).find('.arr--rotate').toggleClass('active');
    });
  } // slideToggleMy('.table--more-btn');


  slideToggleMy('.personal-filter--mobHead');
  $('.table--more-btn').on('click', function () {
    var aaa = $(this).next();
    $('.table--more-content').slideUp();
    aaa.slideToggle();
  }); //custpopup

  $('.btn-custpopup').on('click', function () {
    $('.custpopup-overflow').addClass('active');
  });

  function clickEtarget(selector, selector2, selector3) {
    $(document).mouseup(function (e) {
      var div = $(selector); // тут указываем ID элемента

      if (!div.is(e.target) // если клик был не по нашему блоку
        && div.has(e.target).length === 0) {
        // и не по его дочерним элементам
        $(selector2).removeClass('active'); // скрываем его

        $(selector3).slideUp();
      }
    });
  }

  clickEtarget('.cust-popup', '.custpopup-overflow');
  clickEtarget('.table--more', '.table--more-content', '.table--more-content');
  $('.cust-close').on('click', function () {
    $('.custpopup-overflow').removeClass('active');
  }); //lk menu mob
  // $('.lk-biz--aside--mob').on('click', function() {
  //   $('.lk-biz--aside').toggleClass('active');
  // });
  //my custom select

  if ($('form').hasClass('noappl-form')) {
    //   document.querySelector('.select-wrapper').addEventListener('click', function() {
    //     this.querySelector('.select').classList.toggle('open');
    //     document.querySelector('.arrow').classList.toggle('arrow-toggle');
    // })
    $('.select-wrapper').on('click', function () {
      $(this).find('.select').toggleClass('open');
    });
  }

  var _iterator = _createForOfIteratorHelper(document.querySelectorAll(".custom-option")),
    _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var option = _step.value;
      option.addEventListener('click', function () {
        if (!this.classList.contains('selected')) {
          if(this.parentNode.querySelector('.custom-option.selected') && this.parentNode.querySelector('.custom-option.selected').classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
          }
          this.classList.add('selected');
          this.closest('.select').querySelector('.select__trigger span').textContent = this.textContent;
        }
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  $(document).click(function (e) {
    if ($(e.target).closest('.select-wrapper').length) {
      // клик внутри элемента
      return;
    } // клик снаружи элемента


    $('.select-wrapper').find('.select').removeClass('open');
    $(this).find('.arrow').removeClass('arrow-toggle');
  }); //показать скрыть пароль

  $('.password-show').on('click', function () {
    var passwordInput = $(this).parents('.form-item--wrap').find('input');

    if (passwordInput.attr('type') == 'password') {
      passwordInput.attr('type', 'text');
    } else {
      passwordInput.attr('type', 'password');
    }
  }); //только цифры для инпута

  $(".input-onenum").on('input', function (e) {
    this.value = this.value.replace(/[^0-9\.]/g, '');
  });

  $(window).scroll(function() {
    if($(this).scrollTop() > 64) {
      $('.header').addClass('header-fixed');
    } else {
      $('.header').removeClass('header-fixed');
    }
  });
});
document.addEventListener('DOMContentLoaded', function () {
  //adaptive textarea
  document.querySelectorAll('.textarea-height').forEach(function (el) {
    el.style.height = el.setAttribute('style', 'height: ' + el.scrollHeight + 'px');
    el.classList.add('auto');
    el.addEventListener('input', function (e) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    });
  }); //drop

  var $fileInput = $('.file-input');
  var $droparea = $('.file-drop-area'); // highlight drag area

  $fileInput.on('dragenter focus click', function () {
    $droparea.addClass('is-active');
  }); // back to normal state

  $fileInput.on('dragleave blur drop', function () {
    $droparea.removeClass('is-active');
  }); //choose all

  $('.chooseAll--inputClick').on('click', function () {
    var chooseInput = $(this).find('input');

    if (chooseInput.is(':checked')) {
      $('tbody .chooseAll--inputWrap input').prop('checked', true);
    } else {
      $('tbody .chooseAll--inputWrap input').prop('checked', false);
    }
  }); // change inner text

  $fileInput.on('change', function () {
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();

    if (filesCount === 1) {
      // if single file is selected, show file name
      var fileName = $(this).val().split('\\').pop();
      $textContainer.text(fileName);
    } else {
      // otherwise show number of files
      $textContainer.text(filesCount + ' files selected');
    }
  });

  var c = document.getElementsByTagName("a");
  for(var i = 0; i < c.length; i++) {
    if((typeof(c[i]) !== undefined) && (c[i].href.indexOf('mailto') !== -1)) {
      c[i].addEventListener('copy', function(evt) {
        ym(93753478,'reachGoal','copy_email')
        gtag("event", "copy_email");
      });
      c[i].addEventListener('contextmenu', function(evt) {
        ym(93753478,'reachGoal','copy_email')
        gtag("event", "copy_email");
      });
    }
  }
});


jQuery(document).ready(function ($) {



  function progressView() {
    let diagramBox = document.querySelectorAll('.diagram.progress');
    diagramBox.forEach((box) => {
      let deg = (360 * box.dataset.percent / 100) + 180;
      if (box.dataset.percent >= 50) {
        box.classList.add('over_50');
      } else {
        box.classList.remove('over_50');
      }
      box.querySelector('.piece.right').style.transform = 'rotate(' + deg + 'deg)';
    });
  }
  progressView();

  /*прибавить убавить количество в карточке*/
  if($("#basket-total-template").length === 0) {
    $('.minus').click(function () {
      var $input = $(this).parent().find('input');

      let ratio = $input[0].dataset.ratio != undefined ? parseFloat($input[0].dataset.ratio) : 1;
      if (ratio == undefined || ratio < 1) {
        ratio = 1;
      }
      var count = parseInt($input.val()) - ratio;
      count = count < ratio ? ratio : count;
      if($(".block_detail_good_info").length == 0) {
        if (count == ratio) {
          $(this).addClass("disabled");
        }
      }
      $input.val(count);
      $input.change();
      return false;
    });
    $('.plus').click(function () {
      var $input = $(this).parent().find('input');
      let ratio = $input[0].dataset.ratio != undefined ? parseFloat($input[0].dataset.ratio) : 1;
      if (ratio == undefined || ratio < 1) {
        ratio = 1;
      }
      $input.val(parseInt($input.val()) + ratio);
      $input.change();

      $('.minus').removeClass("disabled");
      return false;
    });
  }

  /*конец блока прибавить убавить количество в карточке*/
  $(".btn_in_basket").on("click", function () {
    $(this).parent().next().toggleClass('flex');
    $(this).hide();
  })

  $('#full_param').easyResponsiveTabs();

  /*
  // перенесено в скрипт фильтра
  $(".block_filter_title").click(function(){
      if ($(this).parent().hasClass('is-active')) {
          $(this).next().slideUp();
          $(this).parent().removeClass("is-active");
      } else {
          $(this).parent().toggleClass("is-active");
          $(this).next().slideDown("");
      }
  }); */

  $(".block_input_clear input").keyup(function () {
    $(this).parent().find(".clear_input").addClass("block");
  });

  $(".clear_input").on("click", function () {
    $(this).parent().find("input").val("");
    $(this).removeClass("block");
  });

  $(".block_search_prop_item input").keyup(function () {
    $(this).parent().find(".clear_input").addClass("block");
  });

  // $('.block_filter_item_body').each(function () {
  // if (($(this).find('.block_filter_item_prop').length) > 5) {
  // $(this).addClass('moreFive');
  // $(".view_all").on("click", function () {
  // if ($(this).hasClass('SHOW')) {
  // $(this).removeClass('SHOW');
  // $(this).removeClass('SHOW').html('Показать больше');
  // $(this).parent().find('.moreFive').removeClass('height384px');

  // }
  // else {
  // $(this).parent().find('.moreFive').addClass('height384px');
  // $(this).addClass('SHOW').html('Показать меньше');

  // }
  // });
  // };
  // });

});

$(function () {
  var tab = $('#tabs .tabs-items > div');
  tab.hide().filter(':first').show().addClass('is-active');

  // Клики по вкладкам.
  $('#tabs .tabs-nav a').click(function () {
    tab.hide();
    tab.filter(this.hash).show();
    $('#tabs .tabs-nav a').removeClass('is-active');
    $(this).addClass('is-active');
    return false;
  }).filter(':first').click();

  // Клики по якорным ссылкам.
  $('.tabs-target').click(function () {
    $('#tabs .tabs-nav a[href=' + $(this).attr('href') + ']').click();
  });

  // Отрытие вкладки из хеша URL
  if (window.location.hash) {
    $('#tabs-nav a[href=' + window.location.hash + ']').click();
    window.scrollTo(0, $("#".window.location.hash).offset().top);
  }
});

jQuery(document).ready(function ($) {

  $(".phonemask").inputmask("+7 (999) 999-9999");

  //email mask
  $(".emailmask").inputmask({
    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
    greedy: false,
    onBeforePaste: function (pastedValue, opts) {
      pastedValue = pastedValue.toLowerCase();
      return pastedValue.replace("mailto:", "");
    },
    definitions: {
      '*': {
        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
        casing: "lower"
      }
    }
  });


  // $('.block_item_category').each(function () {

  //   if ($(this).find('.block_list a').length > 3) {

  //     $(this).find('a:nth-child(n+4)').hide();
  //     $(this).find('.link_more').addClass('block').text("Еще " + (($(this).find('.block_list a').length) - 3));
  //   }

  //   $(this).find('.link_more').click(function () {
  //     if ($(this).hasClass('SHOW')) {
  //       $(this).removeClass('SHOW');
  //       $(this).removeClass('SHOW').text("Еще " + (($(this).parent().find('.block_list a').length) - 3));
  //       $(this).parent().find('a:nth-child(n+4)').hide();

  //     }
  //     else {
  //       $(this).parent().find('a:nth-child(n+4)').show();
  //       $(this).addClass('SHOW').html('Скрыть');

  //     }
  //   });
  // });

  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    vertical: true,
    asNavFor: '.slider-for',
    dots: false,
    focusOnSelect: true,
    verticalSwiping: true,
    responsive: [
      {
        breakpoint: 568,
        settings: {
          vertical: false,
        }
      }
    ]
  });

  $(document).on('click', '.block_select_change', function () {
    $('body').find(".block_select_change").removeClass("open");
    $(this).addClass("open");
  });
  
  // $(".OpenFormKP").on("click", function () {
  // $('body').find('.block_pop_kp').addClass('is-active');
  // });
  $(".close_popup").on("click", function () {
    $('body').find('.block_pop_kp').removeClass('is-active');
  });

  $(".close_popup").on("click", function () {
    $(this).closest(".popup").removeClass('is-active');
  });
  $(".close_btn").on("click", function () {
    $(this).closest(".popup").removeClass('is-active');
  });
  $(document).on('click', '.close_btn', function (event) {
    $(this).closest(".popup").removeClass('is-active');
  });
  $(".detele_item").on("click", function () {
    $('body').find('.popup-delete').addClass('is-active');
  });

  $(".btn_delete").on("click", function () {
    $(".popup").removeClass("is-active")
    $('body').find('.popup-Yesdelete').addClass('is-active');
  });
  $(".add_obrashenie").on("click", function () {
    $(".popup").removeClass("is-active")
    $('body').find('.popup-obrashenie').addClass('is-active');
  });


  $(".nextMess").on("click", function () {
    $(".popup").removeClass("is-active")
    $('body').find('.popup-obrashenieDone').addClass('is-active');
  });

  $(".send-newFileOrder").on("click", function () {
    $(".popup").removeClass("is-active")
    $('body').find('.popup-newFileOrder').addClass('is-active');
  });








  $(".close_cookies").on("click", function () {
    $(".cookies").removeClass("is-active")
  });

  $(".feedback").on("click", function () {
    $('body').find('.popup-WriteLetter').addClass('is-active');
  });

  $(".order_akt").on("click", function () {
    $('body').find('.popup-akt').addClass('is-active');
  });

  $(".btn_create").on("click", function () {
    $('.popup-akt').removeClass('is-active');
    $('body').find('.popup-AktDwn').addClass('is-active');
  });



  $(document).click(function (e) {
    if ($(e.target).closest('.OpenFormKP, .block_body_pop_kp').length) {
      // клик внутри элемента
      return;
    }
    // клик снаружи элемента
    $(".block_pop_kp").removeClass("is-active");

  });

  // $(".btn_catalog_pc").on("click", function (e) {
  //   e.preventDefault();
  //   $('body').find('.block_menu_catalog_pc').addClass('SHOW');
  // });
  $(".close_menu").on("click", function () {
    $('body').find('.block_menu_catalog_pc').removeClass('SHOW');
  });



  $(".box_select li").click(function () {
    var txt_sort = $(this).text();
    $(".block_select_change").removeClass("open");
    $(this).parent().find("li").removeClass("change");
    $(this).addClass('change');

    // $('body').find('.block_select_change').html(txt_sort);
    $(this).parent().parent().parent().find('.block_select_change').html(txt_sort);
  });


  $(".link_filter").on("click", function () {
    $(".block_filter_catalog").addClass("is-active");
  });

  $(".close_filter").on("click", function () {
    $(".block_filter_catalog").removeClass("is-active");
  });

  $(".link_sort").on("click", function () {
    $(".block_sort_catalog").addClass("is-active");
  });


  $(".close_sort").on("click", function () {
    $(".block_sort_catalog").removeClass("is-active");
  });
  $(".block_sort_body_catalog a").click(function () {
    var txt_sort = $(this).text();
    $(this).parent().find("a").removeClass("change");
    $(".block_sort_item_catalog").removeClass("is-active");
    $(this).addClass('change');

    $('body').find('.block_mob_filter_sort .link_sort span').html(txt_sort);
    $(".block_sort_catalog").removeClass("is-active");
  });




  var $range = $(".js-range-slider"),
    $inputFrom = $(".js-input-from"),
    $inputTo = $(".js-input-to"),
    instance,
    min = 0,
    max = 10000,
    from = 0,
    to = 0;

  $range.ionRangeSlider({
    skin: "round",
    type: "double",
    min: min,
    max: max,
    from: 0,
    to: 10000,
    hide_min_max: true,
    hide_from_to: true,
    onStart: updateInputs,
    onChange: updateInputs
  });
  instance = $range.data("ionRangeSlider");

  function updateInputs(data) {
    from = data.from;
    to = data.to;

    $inputFrom.prop("value", from);
    $inputTo.prop("value", to);
  }

  $inputFrom.on("input", function () {
    var val = $(this).prop("value");

    // validate
    if (val < min) {
      val = min;
    } else if (val > to) {
      val = to;
    }

    instance.update({
      from: val
    });
  });

  $inputTo.on("input", function () {
    var val = $(this).prop("value");

    // validate
    if (val < from) {
      val = from;
    } else if (val > max) {
      val = max;
    }

    instance.update({
      to: val
    });
  });
  function createSlick() {
    $('.block_slider_similar').not('.slick-initialized').slick({
      dots: false,
      arrows: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      variableWidth: true,
      responsive: [
        {
          breakpoint: 380,
          settings: {
            slidesToShow: 1,
            variableWidth: false,
          }
        },
      ]

    });
  }
  createSlick();
  $(window).on('resize', createSlick);

});

function humanFileSize(bytes, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}


