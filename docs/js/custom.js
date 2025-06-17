$(document).ready(function () {
  // $(".preloader").addClass("preloader-remove");

  // window.onbeforeunload = function () {
  //   $(".preloader").removeClass("preloader-remove");
  // };

  $(document).on("click", ".cookies .close_cookies", function (event) {
    let date = new Date();
    date.setDate(date.getDate() + 365);
    document.cookie = "cookiepopup=yes; path=/; expires=" + date.toUTCString();
  });

  $(document).on("click", ".js_add_to_cart", function (event) {
    $('.popup-YesAddedCatalog .quantity').attr('data-id',$(this).attr('data-id'))
    let product_id = $(this).attr("data-id"),
      that = $(this);

    let ratio = $(".js_quantity_change[data-product-id='" + product_id + "'] input").attr("data-ratio");

    if (ratio === undefined || ratio < 1) {
      ratio = 1;
    }

    let product_count = 1;

    if ($(".block_price_btn .js_cnt_input")) {
      product_count = $(".block_price_btn .js_cnt_input").val();
    }

    let item_button = $(this).closest(".quantity-data-item").children(".js_quantity_change");

    if(item_button.length == 0) {
      item_button = $(".js_quantity_change[data-product-id='" + product_id + "']");
    }

    $.ajax({
      url: "/local/_ajax/catalog_cart.php",
      type: "POST",
      data: {
        add: "Y",
        id: product_id,
        count: product_count,
      },
      dataType: "json",
      success: function (data) {
        if (typeof data.status != "undefined" && data.status == "ok") {
          if (data.item_id) {
            if (item_button) {
              item_button.attr("data-id", data.item_id);
            }
          }

          if ($(".popup-YesAddedCatalog")) {
            $(".popup-YesAddedCatalog .quantity").attr("data-id", data.item_id);
            $(".popup-YesAddedCatalog .quantity .js_cnt_input").attr("data-ratio", ratio);
          }

          setTimeout(function () {
            BX.onCustomEvent("OnBasketChange");
          }, 500);
          that.html("<i></i><span>В корзине</span>");
          that.addClass("buy_btn_brands");
          $(".popup.popup-YesAdded").addClass("is-active");
          ym(90155943, "reachGoal", "add_cart");
        }
      },
    });
    return false;
  });

  $(".js_change_cnt_btn").click(function (event) {
    let product_id = $(this).parents(".js_quantity_change").attr("data-id");
    let count = $(this).parents(".js_quantity_change").find(".js_cnt_input").val();
    let max = $(this).parents(".js_quantity_change").attr("data-max");
    let max_popup = $(this).parents(".block_nal_qwnt").find(".info_pop_nal");

    if (Number(max) > 0 && max_popup.length > 0) {
      if (Number(count) > Number(max)) {
        max_popup.addClass("block");
      } else {
        max_popup.removeClass("block");
      }
    }

    let dataReq = { update: "Y", id: product_id, count: count };

    if (typeof t != "undefined") {
      clearTimeout(t);
    }
    t = setTimeout(function () {
      $.ajax({
        url: "/local/_ajax/catalog_cart.php",
        type: "POST",
        data: dataReq,
        dataType: "json",
        success: function (data) {
          //console.log(data);
        },
      });
      setTimeout(function () {
        BX.onCustomEvent("OnBasketChange");
      }, 500);
    }, 500);
  });

  $(document).on("change", ".js_cnt_input", function (event) {
    let product_id = $(this).parents(".js_quantity_change").attr("data-id");
    let ratio = $(this)[0].dataset.ratio != undefined ? parseFloat($(this)[0].dataset.ratio) : 1;

    let count = ratio !== 1 ? Math.round(parseFloat($(this).val()) / ratio) * ratio : $(this).val();
    if (count != $(this).val()) $(this).val(count);
    let max = $(this).parents(".js_quantity_change").attr("data-max");
    let max_popup = $(this).parents(".block_nal_qwnt").find(".info_pop_nal");

    if (Number(max) > 0 && max_popup.length > 0) {
      if (Number(count) > Number(max)) {
        max_popup.addClass("block");
      } else {
        max_popup.removeClass("block");
      }
    }

    if (count > 0) {
      $.ajax({
        url: "/local/_ajax/catalog_cart.php",
        type: "POST",
        data: { update: "Y", id: product_id, count: count },
        dataType: "json",
        success: function (data) {
          //console.log(data);
        },
      });
      setTimeout(function () {
        BX.onCustomEvent("OnBasketChange");
      }, 500);
    }
  });

  //location
  if ($(".navigation__location__wrap__buttons__item").length) {
    $(".navigation__location__wrap__buttons__item").click(function (e) {
      e.preventDefault();

      $(".navigation__location__wrap").removeClass("open");

      if ($(this).data("item") == "no") {
        city_load();
        $(".navigation__location__otherCity__wrap").addClass("open");
      }
    });
  }

  if ($("input.navigation__location__otherCity__wrap__input__inputCity").length) {
    $("input.navigation__location__otherCity__wrap__input__inputCity").on("change keyup paste", function () {
      let valueText = $(this).val().toLowerCase();

      $(".cityList__item")
        .removeClass("hidden")
        .addClass("show")
        .each(function (i, elem) {
          if ($(elem).text().indexOf(valueText) == -1) {
            $(elem).addClass("hidden");
            $(elem).removeClass("show");

            $(".navigation__location__otherCity__wrap__list__point").each(function (ie, element) {
              if ($(element).find(".cityList__item.show").length > 0) {
                $(element).removeClass("hidden");
              } else {
                $(element).addClass("hidden");
              }
            });
          }
        });
    });
  }

  //select city
  let observeSelectCity = document.querySelector(".navigation__location__otherCity__wrap");
  let observeSelectCityConfig = { attributes: true, childList: true, subtree: true };
  let observeSelectCityCallback = (mutationList, observer) => {
    $(".cityList__item").on("click", function () {
      let dataForm = [];
      dataForm["COUNTRY_ID"] = $(this).attr("data-countryID");
      dataForm["DISTRICT_ID"] = $(this).attr("data-districtID");
      dataForm["REGION_ID"] = $(this).attr("data-regionID");
      dataForm["CITY_ID"] = $(this).attr("data-cityID");
      document.cookie = "AKS_LOCATION_USER_NOT_SELECTED=N; path=/;";
      BX.ajax({
        url: "/local/_ajax/changeLocation.php",
        data: { ajax: "Y", currentPosition: dataForm },
        method: "POST",
        dataType: "html",
        timeout: 30,
        async: true,
        processData: true,
        scriptsRunFirst: true,
        emulateOnload: true,
        start: true,
        cache: false,
        onsuccess: function (data) {
          $(".navigation__location__otherCity__wrap").removeClass("open");
          location.reload();
        },
        onfailure: function (error) {
          console.log(error);
        },
      });
    });
  };
  let observer = new MutationObserver(observeSelectCityCallback);
  observer.observe(observeSelectCity, observeSelectCityConfig);
  //select city

  function closeCurrentList() {
    $(".navigation__location__wrap").removeClass("open");
  }

  function closeCitiesList() {
    $(".navigation__location__otherCity__wrap").removeClass("open");
  }

  function positionCitiesList() {
    if (!$(".header__icons-navigation__location-link").length) return;

    let navigationIcon = $(".header__icons-navigation__location-link"),
      navigationBlock = $(".navigation__location__wrap"),
      navigationBlockWidth = navigationBlock.outerWidth(),
      navigationBlockHeight = navigationBlock.outerHeight(),
      navigationIconOffset = navigationIcon.offset(),
      navigationBlockNewTop = Math.round(navigationIconOffset.top + navigationIcon.outerHeight()),
      navigationBlockNewLeft = Math.round(navigationIconOffset.left - navigationBlockWidth / 2),
      windowWidth = $(window).outerWidth(),
      windowHeight = $(window).outerHeight();

    $(".navigation__location__otherCity__wrap").removeClass("open");

    if (windowWidth > 640) {
      navigationBlock.css({ top: navigationBlockNewTop, left: navigationBlockNewLeft });
    } else {
      navigationBlock.css({
        top: Math.round(windowHeight / 2 - navigationBlockHeight / 2),
        left: Math.round(windowWidth / 2 - navigationBlockWidth / 2),
        position: "fixed",
      });
    }
  }

  $(".header__icons-navigation__location-link").click(function (e) {
    e.preventDefault();
    let navigationIcon = $(".navigation__location__wrap");

    if (navigationIcon.hasClass("open")) {
      closeCurrentList();
    } else {
      navigationIcon.addClass("open");
      positionCitiesList();
    }
  });

  $(".navigation__location__otherCity__wrap__closeForm").click(function () {
    closeCitiesList();
  });

  $(window).resize(function () {
    positionCitiesList();
  });
  positionCitiesList();

  function city_load() {
    if ($(".navigation__location__otherCity__wrap__list__all").html().length < 30) {
      $(".navigation__location__otherCity__wrap__list__all").html("Идет загрузка....");
      $.ajax({
        url: "/local/_ajax/city_ajax.php",
        success: function (data) {
          $(".navigation__location__otherCity__wrap__list__all").empty().html(data);
        },
      });
    }
    return true;
  }

  $(".header__icons-navigation__location-link").click(function (event) {
    if ($(".header__icons-navigation__user_menu-link.opened").length > 0) {
      $(".header__icons-navigation__user_menu-link.opened").removeClass("opened");
    }
  });

  $(".header__icons-navigation__user_menu-link").click(function (event) {
    if ($(".navigation__location__wrap.open").length > 0) {
      $(".navigation__location__wrap.open").removeClass("open");
    }
  });

  $(".navigation__location__otherCity__wrap__input__inputCity").keyup(function (event) {
    var fav_list = $(this).parents(".navigation__location__otherCity").find(".cityList.favorites");
    if (typeof fav_list != "undefined" && fav_list.length > 0) {
      setTimeout(function () {
        let fav_cnt = fav_list.find(".cityList__item:not(.hidden)").length;
        if (fav_cnt < 1) {
          $(".navigation__location__otherCity__wrap__list").addClass("fullWidth");
        } else {
          $(".navigation__location__otherCity__wrap__list").removeClass("fullWidth");
        }
      }, 100);
    }
  });
  //location

  $(".navigation__location__wrap__buttons__item[data-item=yes]").click(function () {
    document.cookie = "AKS_LOCATION_USER_NOT_SELECTED=N; path=/;";
  });
});

// вывести изменения состояния
//document.addEventListener('readystatechange', () => {
//    if (document.readyState == 'interactive') {
//        $(".preloader").addClass("preloader-remove");
//    }
//});
