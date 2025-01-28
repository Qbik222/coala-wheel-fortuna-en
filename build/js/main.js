"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
(function () {
  var apiURL = 'https://fav-prom.com/api_wheel_ua';
  var unauthMsgs = document.querySelectorAll('.unauth-msg'),
    participateBtns = document.querySelectorAll('.btn-join');
  var roLeng = document.querySelector('#roLeng');
  var enLeng = document.querySelector('#enLeng');
  var locale = 'en';
  if (roLeng) locale = 'uk';
  if (enLeng) locale = 'en';
  var i18nData = {};
  var debug = false;
  var userId;
  // userId = 134804;

  function loadTranslations() {
    return fetch("".concat(apiURL, "/translates/").concat(locale)).then(function (res) {
      return res.json();
    }).then(function (json) {
      i18nData = json;
      translate();
      var mutationObserver = new MutationObserver(function (mutations) {
        translate();
      });
      mutationObserver.observe(document.getElementById('wheel'), {
        childList: true,
        subtree: true
      });
    });
  }
  function translate() {
    var elems = document.querySelectorAll('[data-translate]');
    if (elems && elems.length) {
      elems.forEach(function (elem) {
        var key = elem.getAttribute('data-translate');
        elem.innerHTML = i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
        elem.removeAttribute('data-translate');
      });
    }
    if (locale === 'en') {
      mainPage.classList.add('en');
    }
    refreshLocalizedClass();
  }
  function refreshLocalizedClass(element, baseCssClass) {
    if (!element) {
      return;
    }
    for (var _i = 0, _arr = ['uk', 'en']; _i < _arr.length; _i++) {
      var lang = _arr[_i];
      element.classList.remove(baseCssClass + lang);
    }
    element.classList.add(baseCssClass + locale);
  }
  var request = function request(link, extraOptions) {
    return fetch(apiURL + link, _objectSpread({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, extraOptions || {})).then(function (res) {
      return res.json();
    });
  };
  function init() {
    if (window.store) {
      var state = window.store.getState();
      userId = state.auth.isAuthorized && state.auth.id || '';
      setupPage();
    } else {
      setupPage();
      var c = 0;
      var i = setInterval(function () {
        if (c < 50) {
          if (!!window.g_user_id) {
            userId = window.g_user_id;
            setupPage();
            checkUserAuth();
            clearInterval(i);
          }
        } else {
          clearInterval(i);
        }
      }, 200);
    }
    checkUserAuth();
    participateBtns.forEach(function (authBtn, i) {
      authBtn.addEventListener('click', function (e) {
        e.preventDefault();
        participate();
      });
    });
  }
  function setupPage() {}
  function participate() {
    if (!userId) {
      return;
    }
    var params = {
      userid: userId
    };
    request('/user', {
      method: 'POST',
      body: JSON.stringify(params)
    }).then(function (res) {
      participateBtns.forEach(function (item) {
        return item.classList.add('hide');
      });
      wheelWrap.classList.remove('_sign');
      document.querySelector(".progress").classList.remove("_sign");
      setupPage();
    });
  }
  function checkUserAuth() {
    var skipPopup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (userId) {
      unauthMsgs.forEach(function (msg) {
        return msg.classList.add('hide');
      });
      return request("/favuser/".concat(userId, "?nocache=1")).then(function (res) {
        if (res.userid) {
          participateBtns.forEach(function (item) {
            return item.classList.add('hide');
          });
          wheelWrap.classList.remove('_sign');
          document.querySelector(".progress").classList.remove("_sign");

          // Відображення інформації користувача
          refreshUserInfo(res, skipPopup);
          displayUserSpins(res.spins);
        } else {
          participateBtns.forEach(function (item) {
            return item.classList.remove('hide');
          });
        }
      });
    } else {
      participateBtns.forEach(function (btn) {
        return btn.classList.add('hide');
      });
      unauthMsgs.forEach(function (msg) {
        return msg.classList.remove('hide');
      });
    }
  }
  function displayUserSpins(spins) {
    var skipPopup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var headDropItem = document.querySelector('.accordion__content-item.head-drop');
    var noSpinItem = document.querySelector('.accordion__content-item.no-spins');
    if (!spins || spins.length === 0) {
      headDropItem.classList.add('hide');
      noSpinItem.classList.remove('hide');
      return;
    }

    // Пропускаємо показ попапу, якщо skipPopup дорівнює true
    if (skipPopup) {
      return;
    }
    var spinsContainer = document.querySelector('.accordion__content-wrap');
    spinsContainer.innerHTML = '';
    headDropItem.classList.remove('hide');
    noSpinItem.classList.add('hide');
    spins.forEach(function (spin) {
      var spinDate = new Date(spin.date);
      var formattedDate = spinDate.toLocaleDateString('ua-UA');
      var spinName = translateKey(spin.name) || '';
      var spinElement = document.createElement('div');
      spinElement.classList.add('accordion__content-item');
      spinElement.innerHTML = "\n            <span class=\"content-date\">".concat(formattedDate, "</span>\n            <span class=\"content-prize\">").concat(spinName, "</span>\n        ");
      spinsContainer.appendChild(spinElement);
    });
  }
  function translateKey(key) {
    if (!key) {
      return;
    }
    return i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
  }
  loadTranslations().then(init);
  var mainPage = document.querySelector('.fav-page');
  setTimeout(function () {
    return mainPage.classList.add('overflow');
  }, 1000);
  var i = 1;
  function sendSpinRequest() {
    if (!userId) {
      return;
    }
    if (debug) {
      return Promise.resolve({
        number: 'respin',
        type: 'test'
      });
    }
    var params = {
      userid: userId
    };
    return request('/spin', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  //Before Code
  var days = document.querySelectorAll(".wheel__days-item");
  var popupDays = document.querySelectorAll(".popup__days-item");
  var popupDaysMob = document.querySelectorAll(".days__item");
  var currentDay = 0;
  function setDays(days, currentDay) {
    days.forEach(function (day, i) {
      ++i;
      day.classList.toggle("next", i > currentDay);
      day.classList.toggle("past", i < currentDay);
      day.classList.toggle("active", i === currentDay);
    });
  }
  function daysRemind(days, classAnim) {
    var delay = 900;
    days.forEach(function (day, i) {
      setTimeout(function () {
        day.classList.add(classAnim);
        setTimeout(function () {
          return day.classList.remove(classAnim);
        }, 1200);
      }, delay * i);
    });
  }
  // const randomInterval = Math.random() * (6000 - 4000) + 4000;
  function addFireworks(containerSelector, numberOfFireworks) {
    var fireworksWrap = document.createElement('div');
    fireworksWrap.className = 'fireworks-wrap';
    for (var _i2 = 0; _i2 < numberOfFireworks; _i2++) {
      var firework = document.createElement('div');
      firework.className = 'firework';
      fireworksWrap.appendChild(firework);
    }
    var container = document.querySelector(containerSelector);
    if (container) {
      container.appendChild(fireworksWrap);
    } else {
      console.error("\u041A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0437 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440\u043E\u043C \"".concat(containerSelector, "\" \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E."));
    }
  }
  function removeFireworks(containerSelector) {
    var container = document.querySelector(containerSelector);
    if (container) {
      var fireworksWrap = container.querySelector('.fireworks-wrap');
      if (fireworksWrap) {
        fireworksWrap.remove();
      }
    } else {
      console.error("\u041A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0437 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440\u043E\u043C \"".concat(containerSelector, "\" \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E."));
    }
  }
  function startRandomInterval() {
    var randomInterval = Math.random() * (20000 - 10000) + 10000; // Випадковий інтервал між 10 і 20 секундами
    daysRemind(days, "remind");
    daysRemind(popupDays, "remind");
    daysRemind(popupDaysMob, "remind");
    setTimeout(startRandomInterval, randomInterval);
  }
  startRandomInterval();
  daysRemind(days, "remind");
  setDays(days, currentDay);
  setDays(popupDays, currentDay);
  setDays(popupDaysMob, currentDay);

  /// wheel logic
  var wheelSections = document.querySelector(".wheel__sections"),
    wheelWrap = document.querySelector(".wheel__wrap"),
    wheelArrow = document.querySelector(".wheel__arrow"),
    wheelBtn = document.querySelector(".wheel__btn"),
    spinBg = document.querySelector(".spin-bg"),
    salut = document.querySelector(".fireworks-wrap"),
    bubleBtn = document.querySelector(".wheel__days-icons"),
    wheelBuble = document.querySelector(".wheel__buble"),
    popupContainer = document.querySelector(".popups"),
    popup = document.querySelector(".popup"),
    popupCloseBtn = document.querySelector(".popup__close");
  bubleBtn.addEventListener("mouseover", function (e) {
    wheelBuble.classList.remove("_hidden");
  });
  bubleBtn.addEventListener("mouseout", function (e) {
    wheelBuble.classList.add("_hidden");
  });
  document.addEventListener("click", function (e) {
    return e.target === bubleBtn ? null : wheelBuble.classList.add("_hidden");
  });
  var prizes = ['iphone', 'ecoflow', 'fs99', 'nothing', "bonuses"];
  function getRandomPrize(arr) {
    return arr[Math.floor(Math.random() * prizes.length)];
  }
  function showPopup(sections, wheel, showClass, streakBonus, spinBg, closeBtn, popupContainer, popup, classPrize) {
    // document.querySelector(".fav-page").classList.add("popupBg")
    if (classPrize) {
      popup.classList.add("".concat(classPrize));
    }
    if (classPrize === "respin") return;
    popup.classList.add("".concat(showClass));
    popup.classList.contains('_nothing') === true ? null : addFireworks(".popups", 7);
    streakBonus ? popup.classList.add("_done") : popup.classList.add("_incomplete");
    popupContainer.classList.add("_opacity", "_zIndex");
    document.body.style.overflow = "hidden";
    spinBg.classList.remove("showSpinBg");
    var pers = document.querySelectorAll(".popup__pers");
    var prize = document.querySelectorAll(".popup__prize");
    var buble = document.querySelectorAll(".popup__buble");
    var popupBody = document.querySelector(".popup__main");
    var popupTitle = document.querySelectorAll(".popup__title");
    var popupLeftArrow = document.querySelectorAll(".popup__decor-left");
    var popupRightArrow = document.querySelectorAll(".popup__decor-right");
    streakBonus ? popupBody.classList.add("_done") : popup.classList.add("_incomplete");
    document.querySelector(".fav-page").classList.remove("bgScale");
    function addAnim(arr, classAnim) {
      arr.forEach(function (item) {
        return item.classList.add("".concat(classAnim));
      });
    }
    //popup animations
    setTimeout(function () {
      popupBody.classList.add("popupMainAnim");
      addAnim(pers, "popupPersAnim");
      addAnim(buble, "popupBubleAnim");
    }, 100);
    setTimeout(function () {
      addAnim(prize, "popupPrizeAnim");
      popupTitle.forEach(function (item) {
        return item.classList.add("popupTitleAnim");
      });
    }, 600);
    setTimeout(function () {
      popupLeftArrow.forEach(function (item) {
        return item.classList.add("popupLeftArrAnim");
      });
      popupRightArrow.forEach(function (item) {
        return item.classList.add("popupRightArrAnim");
      });
    }, 1200);
    //popup animations
    closeBtn.addEventListener("click", function () {
      popup.classList.contains('_nothing') === true ? null : addFireworks(".wheel", 7);
      wheel.classList.add("_lock");
      document.querySelector(".progress").classList.add("_lock");
      wheel.classList.remove("wheelSizeIncrease");
      document.body.style.overflow = "auto";
      popupContainer.classList.remove("_opacity", "_zIndex");
      popup.classList.remove("".concat(showClass), '_done', '_incomplete');
      removeFireworks(".popups");
    }, {
      once: true
    });
    document.querySelectorAll('.popup__btn').forEach(function (btn) {
      return btn.addEventListener("click", function () {
        popup.classList.contains('_nothing') === true ? null : addFireworks(".wheel", 7);
        wheel.classList.add("_lock");
        document.querySelector(".progress").classList.add("_lock");
        wheel.classList.remove("wheelSizeIncrease");
        document.body.style.overflow = "auto";
        popupContainer.classList.remove("_opacity", "_zIndex");
        popup.classList.remove("".concat(showClass), '_done', '_incomplete');
        removeFireworks(".popups");
      }, {
        once: true
      });
    });
  }
  function spinWheel(position, animation, sections, btn, wheel, arrow, prize, spinBg, salut) {
    sections.addEventListener("animationend", function () {
      sections.style.transform = "translate(-50%, -50%) rotate(".concat(position, "deg)");
      sections.classList.remove("".concat(animation));
    }, {
      once: true
    });
    sections.classList.add("".concat(animation));
    arrow.style.opacity = "0";
    wheel.classList.add("wheelSizeIncrease");
    document.querySelector(".fav-page").classList.add("bgScale");
    document.querySelector(".sector-prize").style.opacity = "1";
    spinBg.classList.add("showSpinBg");
    if (animation !== "respinAnim") {
      btn.style.pointerEvents = "none";
    }
  }
  function initSpin(sections, btn, wheel, arrow, spinBg, salut, prize, streakBonus) {
    btn.addEventListener("click", function () {
      wheelBtn.classList.add('_disabled');
      sendSpinRequest().then(function (res) {
        var authRes = checkUserAuth(true);
        if (authRes) {
          return authRes.then(function () {
            return res;
          });
        }
        return res;
      }).then(function (res) {
        console.log(res);
        if (!res || !!res.error) {
          wheelBtn.classList.add('pulse-btn');
          wheelBtn.classList.remove('_disabled');
          return;
        }
        var prize = res.number;
        var streakBonus = res.streakBonus || debug;
        if (prize === "iphone") {
          sections.addEventListener("animationend", function () {
            return showPopup(sections, wheel, "_iphone", currentDay, spinBg, popupCloseBtn, popupContainer, popup);
          });
          spinWheel(1800, "iphonePrize", sections, btn, wheel, arrow, prize, spinBg, salut);
        }
        if (prize === "ecoflow") {
          sections.addEventListener("animationend", function () {
            return showPopup(sections, wheel, "_ecoflow", currentDay, spinBg, popupCloseBtn, popupContainer, popup);
          });
          spinWheel(1665, "ecoflowPrize", sections, btn, wheel, arrow, prize, spinBg, salut);
        }
        if (prize === "fs99") {
          sections.addEventListener("animationend", function () {
            return showPopup(sections, wheel, "_fs99", currentDay, spinBg, popupCloseBtn, popupContainer, popup);
          });
          spinWheel(1711, "fs99Prize", sections, btn, wheel, arrow, prize, spinBg, salut);
        }
        if (prize === "nothing") {
          popup.classList.add("_nothing");
          sections.addEventListener("animationend", function () {
            return showPopup(sections, wheel, "_nothing", currentDay, spinBg, popupCloseBtn, popupContainer, popup);
          });
          spinWheel(1755, "nothingPrize", sections, btn, wheel, arrow, prize, spinBg, salut);
        }
        if (prize === "bonuses") {
          sections.addEventListener("animationend", function () {
            return showPopup(sections, wheel, "_bonus", currentDay, spinBg, popupCloseBtn, popupContainer, popup);
          });
          spinWheel(1935, "bonusesPrize", sections, btn, wheel, arrow, prize, spinBg, salut);
        }
      });
    });
  }
  initSpin(wheelSections, wheelBtn, wheelWrap, wheelArrow, spinBg, salut);
  function refreshUserInfo(userInfo, skipPopup) {
    refreshDailyPointsSection(userInfo);
    if (!skipPopup) {
      refreshWheel(userInfo);
    }
    refreshStreak(userInfo);
  }
  function refreshWheel(userInfo) {
    if (userInfo.spinAllowed) {
      return;
    }
    if (userInfo.pointsPerDay >= 100) {
      wheelWrap.classList.add('_lock');
    } else {
      wheelWrap.classList.add('_block');
    }
  }
  function refreshDailyPointsSection(userInfo) {
    var points = Math.min(userInfo.pointsPerDay || 0, 100);
    var progressStatus = document.querySelector('.progress__bar-status');
    progressStatus.innerHTML = points ? "".concat(points, " \u20B4") : " 0 ₴";
    var currentSpan = document.querySelector('.current');
    currentSpan.innerHTML = "".concat(points);
    var progressLine = document.querySelector('.progress__bar-line');
    var progress = points / 100.0 * 100;
    progressLine.style.width = "".concat(progress, "%");
    var lastUpdateElement = document.querySelector('.progress__bar-data');
    if (lastUpdateElement) {
      if (userInfo.lastUpdate) {
        var lastUpdateDate = new Date(userInfo.lastUpdate);
        if (!isNaN(lastUpdateDate)) {
          var day = String(lastUpdateDate.getDate()).padStart(2, '0');
          var month = String(lastUpdateDate.getMonth() + 1).padStart(2, '0');
          var year = lastUpdateDate.getFullYear();
          var hours = String(lastUpdateDate.getHours()).padStart(2, '0');
          var minutes = String(lastUpdateDate.getMinutes()).padStart(2, '0');
          var formattedDateTime = "".concat(day, ".").concat(month, ".").concat(year, ". ").concat(hours, ":").concat(minutes);
          document.querySelector('.current-data').innerHTML = formattedDateTime;
          lastUpdateElement.classList.remove('hide');
        }
      }
    }
  }
  function refreshStreak(userInfo) {
    var items = document.querySelectorAll('.wheel__days-item');
    var i = 0;
    var streak = userInfo.spinsStreak;
    var _iterator = _createForOfIteratorHelper(items),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        item.classList.remove('past');
        item.classList.remove('next');
        if (i < streak) {
          item.classList.add('past');
        } else {
          item.classList.add('next');
        }
        i++;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var popupDays = document.querySelectorAll('.popup__days-item');
    var j = 0;
    var _iterator2 = _createForOfIteratorHelper(popupDays),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _item = _step2.value;
        _item.classList.remove('active');
        _item.classList.remove('past');
        _item.classList.remove('next');
        if (j < streak) {
          _item.classList.add('past');
        } else {
          _item.classList.add('next');
        }
        j++;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var mobileDays = document.querySelectorAll('.days__item');
    var k = 0;
    var _iterator3 = _createForOfIteratorHelper(mobileDays),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _item2 = _step3.value;
        _item2.classList.remove('past');
        _item2.classList.remove('next');
        if (k < streak) {
          _item2.classList.add('past');
        } else {
          _item2.classList.add('next');
        }
        k++;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }

  //// accordion
  var accordionHeaders = document.querySelectorAll('.accordion__header');
  accordionHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      var content = header.nextElementSibling;
      document.querySelectorAll('.accordion__content').forEach(function (item) {
        if (item !== content) {
          item.style.display = 'none';
          item.previousElementSibling.classList.remove('open');
        }
      });
      if (content.style.display === 'block') {
        content.style.display = 'none';
        header.classList.remove('open');
      } else {
        content.style.display = 'block';
        header.classList.add('open');
      }
    });
  });

  // for test
  //
  // const fs20 = document.querySelector('.fs20')
  // const fs25 = document.querySelector('.fs25')
  // const fs40 = document.querySelector('.fs40')
  // const fs50 = document.querySelector('.fs50')
  // const fs75 = document.querySelector('.fs75')
  // const lei15 = document.querySelector('.lei15')
  // const lei20 = document.querySelector('.lei20')
  // const lei25 = document.querySelector('.lei25')
  // const done = document.querySelector('.streak')
  // const dropBonusButton = document.querySelector('.drop-bonus');
  // const dropNothingButton = document.querySelector('.drop-nothing');
  //
  // const dropLock = document.querySelector('.lock');
  // const dropSign = document.querySelector('.sign');
  //
  // var streakBonus = JSON.parse(localStorage.getItem('streakBonus')) || false;
  //
  // if(streakBonus){
  //     done.style.background = "green"
  // }
  // if(!streakBonus){
  //     done.style.background = "red"
  // }
  //
  // done.addEventListener("click", () => {
  //     streakBonus = !streakBonus;
  //     localStorage.setItem('streakBonus', JSON.stringify(streakBonus));
  //     streakBonus = JSON.parse(localStorage.getItem('streakBonus')) || false;
  //     console.log(streakBonus)
  //     window.location.reload()
  //
  // });
  //
  // document.querySelector(".drop-btn").addEventListener("click", () =>{
  //     document.querySelector(".drop-menu").classList.toggle("_hidden")
  // })
  //
  //
  // initSpin(wheelSections, fs20, wheelWrap, wheelArrow, spinBg, salut, "fs20", streakBonus)
  // initSpin(wheelSections, fs25, wheelWrap, wheelArrow, spinBg, salut, "fs25", streakBonus)
  // initSpin(wheelSections, fs40, wheelWrap, wheelArrow, spinBg, salut, "fs40", streakBonus)
  // initSpin(wheelSections, fs50, wheelWrap, wheelArrow, spinBg, salut, "fs50", streakBonus)
  // initSpin(wheelSections, fs75, wheelWrap, wheelArrow, spinBg, salut, "fs75", streakBonus)
  // initSpin(wheelSections, lei15, wheelWrap, wheelArrow, spinBg, salut, "lei15", streakBonus)
  // initSpin(wheelSections, lei20, wheelWrap, wheelArrow, spinBg, salut, "lei20", streakBonus)
  // initSpin(wheelSections, lei25, wheelWrap, wheelArrow, spinBg, salut, "lei25", streakBonus)
  // // initSpin(wheelSections, dropBonusButton, wheelWrap, wheelArrow, spinBg, salut)
  // initSpin(wheelSections, dropNothingButton, wheelWrap, wheelArrow, spinBg, salut, "nothing", streakBonus)
  //
  // dropLock.addEventListener("click", function () {
  //     wheelWrap.classList.toggle("_lock");
  //     document.querySelector(".progress").classList.toggle("_lock");
  //     wheelWrap.classList.remove("_sign");
  //     document.querySelector(".progress").classList.remove("_sign");
  // });
  // dropSign.addEventListener("click", function () {
  //     wheelWrap.classList.toggle("_sign");
  //     document.querySelector(".progress").classList.toggle("_sign");
  //     wheelWrap.classList.remove("_lock");
  //     document.querySelector(".progress").classList.remove("_lock");
  // });
})();

// btn.addEventListener("click", () =>{
//     if(prize === "iphone"){
//         sections.addEventListener("animationend", () => showPopup(sections, wheel, "_iphone", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
//         spinWheel(1800, "iphonePrize", sections, btn, wheel, arrow, prize, spinBg, salut)
//     }
//     if(prize === "ecoflow"){
//         sections.addEventListener("animationend", () => showPopup(sections, wheel, "_ecoflow", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
//         spinWheel(1665, "ecoflowPrize", sections, btn, wheel, arrow, prize, spinBg, salut)
//     }
//     if(prize === "fs99"){
//         sections.addEventListener("animationend", () => showPopup(sections, wheel, "_fs99", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
//         spinWheel(1711, "fs99Prize", sections, btn, wheel, arrow, prize, spinBg, salut)
//     }
//     if(prize === "nothing"){
//         popup.classList.add("_nothing")
//         sections.addEventListener("animationend", () => showPopup(sections, wheel,"_nothing", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
//         spinWheel(1755, "nothingPrize", sections, btn, wheel, arrow, prize, spinBg, salut)
//     }
//     if(prize === "bonuses"){
//         sections.addEventListener("animationend", () => showPopup(sections, wheel, "_bonus", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
//         spinWheel(1935, "bonusesPrize", sections, btn, wheel, arrow, prize, spinBg, salut)
//     }
// })
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiYXBpVVJMIiwidW5hdXRoTXNncyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInBhcnRpY2lwYXRlQnRucyIsInJvTGVuZyIsInF1ZXJ5U2VsZWN0b3IiLCJlbkxlbmciLCJsb2NhbGUiLCJpMThuRGF0YSIsImRlYnVnIiwidXNlcklkIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwidGhlbiIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwicmVtb3ZlQXR0cmlidXRlIiwibWFpblBhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZWZyZXNoTG9jYWxpemVkQ2xhc3MiLCJlbGVtZW50IiwiYmFzZUNzc0NsYXNzIiwibGFuZyIsInJlbW92ZSIsInJlcXVlc3QiLCJsaW5rIiwiZXh0cmFPcHRpb25zIiwiaGVhZGVycyIsImluaXQiLCJ3aW5kb3ciLCJzdG9yZSIsInN0YXRlIiwiZ2V0U3RhdGUiLCJhdXRoIiwiaXNBdXRob3JpemVkIiwiaWQiLCJzZXR1cFBhZ2UiLCJjIiwiaSIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJhdXRoQnRuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInBhcnRpY2lwYXRlIiwicGFyYW1zIiwidXNlcmlkIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJpdGVtIiwid2hlZWxXcmFwIiwic2tpcFBvcHVwIiwibXNnIiwicmVmcmVzaFVzZXJJbmZvIiwiZGlzcGxheVVzZXJTcGlucyIsInNwaW5zIiwiYnRuIiwiaGVhZERyb3BJdGVtIiwibm9TcGluSXRlbSIsInNwaW5zQ29udGFpbmVyIiwic3BpbiIsInNwaW5EYXRlIiwiRGF0ZSIsImRhdGUiLCJmb3JtYXR0ZWREYXRlIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwic3Bpbk5hbWUiLCJ0cmFuc2xhdGVLZXkiLCJuYW1lIiwic3BpbkVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJzZXRUaW1lb3V0Iiwic2VuZFNwaW5SZXF1ZXN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJudW1iZXIiLCJ0eXBlIiwiZGF5cyIsInBvcHVwRGF5cyIsInBvcHVwRGF5c01vYiIsImN1cnJlbnREYXkiLCJzZXREYXlzIiwiZGF5IiwidG9nZ2xlIiwiZGF5c1JlbWluZCIsImNsYXNzQW5pbSIsImRlbGF5IiwiYWRkRmlyZXdvcmtzIiwiY29udGFpbmVyU2VsZWN0b3IiLCJudW1iZXJPZkZpcmV3b3JrcyIsImZpcmV3b3Jrc1dyYXAiLCJjbGFzc05hbWUiLCJmaXJld29yayIsImNvbnRhaW5lciIsImNvbnNvbGUiLCJlcnJvciIsInJlbW92ZUZpcmV3b3JrcyIsInN0YXJ0UmFuZG9tSW50ZXJ2YWwiLCJyYW5kb21JbnRlcnZhbCIsIk1hdGgiLCJyYW5kb20iLCJ3aGVlbFNlY3Rpb25zIiwid2hlZWxBcnJvdyIsIndoZWVsQnRuIiwic3BpbkJnIiwic2FsdXQiLCJidWJsZUJ0biIsIndoZWVsQnVibGUiLCJwb3B1cENvbnRhaW5lciIsInBvcHVwIiwicG9wdXBDbG9zZUJ0biIsInRhcmdldCIsInByaXplcyIsImdldFJhbmRvbVByaXplIiwiYXJyIiwiZmxvb3IiLCJzaG93UG9wdXAiLCJzZWN0aW9ucyIsIndoZWVsIiwic2hvd0NsYXNzIiwic3RyZWFrQm9udXMiLCJjbG9zZUJ0biIsImNsYXNzUHJpemUiLCJjb250YWlucyIsInN0eWxlIiwib3ZlcmZsb3ciLCJwZXJzIiwicHJpemUiLCJidWJsZSIsInBvcHVwQm9keSIsInBvcHVwVGl0bGUiLCJwb3B1cExlZnRBcnJvdyIsInBvcHVwUmlnaHRBcnJvdyIsImFkZEFuaW0iLCJvbmNlIiwic3BpbldoZWVsIiwicG9zaXRpb24iLCJhbmltYXRpb24iLCJhcnJvdyIsInRyYW5zZm9ybSIsIm9wYWNpdHkiLCJwb2ludGVyRXZlbnRzIiwiaW5pdFNwaW4iLCJhdXRoUmVzIiwibG9nIiwidXNlckluZm8iLCJyZWZyZXNoRGFpbHlQb2ludHNTZWN0aW9uIiwicmVmcmVzaFdoZWVsIiwicmVmcmVzaFN0cmVhayIsInNwaW5BbGxvd2VkIiwicG9pbnRzUGVyRGF5IiwicG9pbnRzIiwibWluIiwicHJvZ3Jlc3NTdGF0dXMiLCJjdXJyZW50U3BhbiIsInByb2dyZXNzTGluZSIsInByb2dyZXNzIiwid2lkdGgiLCJsYXN0VXBkYXRlRWxlbWVudCIsImxhc3RVcGRhdGUiLCJsYXN0VXBkYXRlRGF0ZSIsImlzTmFOIiwiU3RyaW5nIiwiZ2V0RGF0ZSIsInBhZFN0YXJ0IiwibW9udGgiLCJnZXRNb250aCIsInllYXIiLCJnZXRGdWxsWWVhciIsImhvdXJzIiwiZ2V0SG91cnMiLCJtaW51dGVzIiwiZ2V0TWludXRlcyIsImZvcm1hdHRlZERhdGVUaW1lIiwiaXRlbXMiLCJzdHJlYWsiLCJzcGluc1N0cmVhayIsImoiLCJtb2JpbGVEYXlzIiwiayIsImFjY29yZGlvbkhlYWRlcnMiLCJoZWFkZXIiLCJjb250ZW50IiwibmV4dEVsZW1lbnRTaWJsaW5nIiwiZGlzcGxheSIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxZQUFZO0VBQ1QsSUFBTUEsTUFBTSxHQUFHLG1DQUFtQztFQUVsRCxJQUNJQyxVQUFVLEdBQUdDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO0lBQ3JEQyxlQUFlLEdBQUdGLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsV0FBVyxDQUFDO0VBRTVELElBQU1FLE1BQU0sR0FBR0gsUUFBUSxDQUFDSSxhQUFhLENBQUMs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QUFPO1FBQy9CSCxNQUFNLENBQUMxSyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7TUFDaEM7SUFDSixDQUFDLENBQUM7RUFDTixDQUFDLENBQUM7O0VBRUY7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0FBRUosQ0FBQyxHQUFHOztBQUlKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYXBpVVJMID0gJ2h0dHBzOi8vZmF2LXByb20uY29tL2FwaV93aGVlbF91YSc7XG5cbiAgICBjb25zdFxuICAgICAgICB1bmF1dGhNc2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnVuYXV0aC1tc2cnKSxcbiAgICAgICAgcGFydGljaXBhdGVCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJ0bi1qb2luJyk7XG5cbiAgICBjb25zdCByb0xlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm9MZW5nJyk7XG4gICAgY29uc3QgZW5MZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VuTGVuZycpO1xuXG4gICAgbGV0IGxvY2FsZSA9ICdlbic7XG5cbiAgICBpZiAocm9MZW5nKSBsb2NhbGUgPSAndWsnO1xuICAgIGlmIChlbkxlbmcpIGxvY2FsZSA9ICdlbic7XG5cblxuICAgIGxldCBpMThuRGF0YSA9IHt9O1xuICAgIGNvbnN0IGRlYnVnID0gZmFsc2U7XG4gICAgbGV0IHVzZXJJZDtcbiAgICAvLyB1c2VySWQgPSAxMzQ4MDQ7XG5cbiAgICBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7YXBpVVJMfS90cmFuc2xhdGVzLyR7bG9jYWxlfWApLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgICBpMThuRGF0YSA9IGpzb247XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aGVlbCcpLCB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKCkge1xuICAgICAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRyYW5zbGF0ZV0nKVxuICAgICAgICBpZiAoZWxlbXMgJiYgZWxlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtcy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gaTE4bkRhdGFba2V5XSB8fCAnKi0tLS1ORUVEIFRPIEJFIFRSQU5TTEFURUQtLS0tKiAgIGtleTogICcgKyBrZXk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09ICdlbicpIHtcbiAgICAgICAgICAgIG1haW5QYWdlLmNsYXNzTGlzdC5hZGQoJ2VuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVmcmVzaExvY2FsaXplZENsYXNzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaExvY2FsaXplZENsYXNzKGVsZW1lbnQsIGJhc2VDc3NDbGFzcykge1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGxhbmcgb2YgWyd1aycsICdlbiddKSB7XG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYmFzZUNzc0NsYXNzICsgbGFuZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGJhc2VDc3NDbGFzcyArIGxvY2FsZSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdCA9IGZ1bmN0aW9uIChsaW5rLCBleHRyYU9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGFwaVVSTCArIGxpbmssIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAuLi4oZXh0cmFPcHRpb25zIHx8IHt9KVxuICAgICAgICB9KS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5zdG9yZSkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gd2luZG93LnN0b3JlLmdldFN0YXRlKCk7XG4gICAgICAgICAgICB1c2VySWQgPSBzdGF0ZS5hdXRoLmlzQXV0aG9yaXplZCAmJiBzdGF0ZS5hdXRoLmlkIHx8ICcnO1xuICAgICAgICAgICAgc2V0dXBQYWdlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXR1cFBhZ2UoKTtcbiAgICAgICAgICAgIGxldCBjID0gMDtcbiAgICAgICAgICAgIHZhciBpID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChjIDwgNTApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhd2luZG93LmdfdXNlcl9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gd2luZG93LmdfdXNlcl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHVwUGFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tVc2VyQXV0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrVXNlckF1dGgoKTtcblxuICAgICAgICBwYXJ0aWNpcGF0ZUJ0bnMuZm9yRWFjaCgoYXV0aEJ0biwgaSkgPT4ge1xuICAgICAgICAgICAgYXV0aEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHBhcnRpY2lwYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXBQYWdlKCkge31cblxuICAgIGZ1bmN0aW9uIHBhcnRpY2lwYXRlKCkge1xuICAgICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0ge3VzZXJpZDogdXNlcklkfTtcbiAgICAgICAgcmVxdWVzdCgnL3VzZXInLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBhcmFtcylcbiAgICAgICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgcGFydGljaXBhdGVCdG5zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKSk7XG4gICAgICAgICAgICB3aGVlbFdyYXAuY2xhc3NMaXN0LnJlbW92ZSgnX3NpZ24nKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZ3Jlc3NcIikuY2xhc3NMaXN0LnJlbW92ZShcIl9zaWduXCIpO1xuICAgICAgICAgICAgc2V0dXBQYWdlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG5cbiAgICBmdW5jdGlvbiBjaGVja1VzZXJBdXRoKHNraXBQb3B1cCA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgICAgIHVuYXV0aE1zZ3MuZm9yRWFjaChtc2cgPT4gbXNnLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKSk7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdChgL2ZhdnVzZXIvJHt1c2VySWR9P25vY2FjaGU9MWApXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy51c2VyaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2lwYXRlQnRucy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKCdoaWRlJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hlZWxXcmFwLmNsYXNzTGlzdC5yZW1vdmUoJ19zaWduJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJfc2lnblwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g0JLRltC00L7QsdGA0LDQttC10L3QvdGPINGW0L3RhNC+0YDQvNCw0YbRltGXINC60L7RgNC40YHRgtGD0LLQsNGH0LBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hVc2VySW5mbyhyZXMsIHNraXBQb3B1cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5VXNlclNwaW5zKHJlcy5zcGlucyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNpcGF0ZUJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFydGljaXBhdGVCdG5zLmZvckVhY2goYnRuID0+IGJ0bi5jbGFzc0xpc3QuYWRkKCdoaWRlJykpO1xuICAgICAgICAgICAgdW5hdXRoTXNncy5mb3JFYWNoKG1zZyA9PiBtc2cuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpc3BsYXlVc2VyU3BpbnMoc3BpbnMsIHNraXBQb3B1cCA9IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IGhlYWREcm9wSXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRlbnQtaXRlbS5oZWFkLWRyb3AnKTtcbiAgICAgICAgY29uc3Qgbm9TcGluSXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRlbnQtaXRlbS5uby1zcGlucycpO1xuXG4gICAgICAgIGlmICghc3BpbnMgfHwgc3BpbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBoZWFkRHJvcEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgICAgbm9TcGluSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQn9GA0L7Qv9GD0YHQutCw0ZTQvNC+INC/0L7QutCw0Lcg0L/QvtC/0LDQv9GDLCDRj9C60YnQviBza2lwUG9wdXAg0LTQvtGA0ZbQstC90Y7RlCB0cnVlXG4gICAgICAgIGlmIChza2lwUG9wdXApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNwaW5zQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjY29yZGlvbl9fY29udGVudC13cmFwJyk7XG4gICAgICAgIHNwaW5zQ29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGhlYWREcm9wSXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIG5vU3Bpbkl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuXG4gICAgICAgIHNwaW5zLmZvckVhY2goc3BpbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBzcGluRGF0ZSA9IG5ldyBEYXRlKHNwaW4uZGF0ZSk7XG4gICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gc3BpbkRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKCd1YS1VQScpO1xuICAgICAgICAgICAgY29uc3Qgc3Bpbk5hbWUgPSB0cmFuc2xhdGVLZXkoc3Bpbi5uYW1lKSB8fCAnJztcblxuICAgICAgICAgICAgY29uc3Qgc3BpbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHNwaW5FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjY29yZGlvbl9fY29udGVudC1pdGVtJyk7XG5cbiAgICAgICAgICAgIHNwaW5FbGVtZW50LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY29udGVudC1kYXRlXCI+JHtmb3JtYXR0ZWREYXRlfTwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY29udGVudC1wcml6ZVwiPiR7c3Bpbk5hbWV9PC9zcGFuPlxuICAgICAgICBgO1xuXG4gICAgICAgICAgICBzcGluc0NvbnRhaW5lci5hcHBlbmRDaGlsZChzcGluRWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZUtleShrZXkpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaTE4bkRhdGFba2V5XSB8fCAnKi0tLS1ORUVEIFRPIEJFIFRSQU5TTEFURUQtLS0tKiAgIGtleTogICcgKyBrZXk7XG4gICAgfVxuXG4gICAgbG9hZFRyYW5zbGF0aW9ucygpXG4gICAgICAgIC50aGVuKGluaXQpO1xuXG4gICAgbGV0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhdi1wYWdlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdycpLCAxMDAwKTtcblxuXG4gICAgbGV0IGkgPSAxO1xuICAgIGZ1bmN0aW9uIHNlbmRTcGluUmVxdWVzdCgpIHtcbiAgICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWJ1Zykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgbnVtYmVyOiAncmVzcGluJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAndGVzdCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0ge3VzZXJpZDogdXNlcklkfTtcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QoJy9zcGluJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXMpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vQmVmb3JlIENvZGVcbiAgICBjb25zdCBkYXlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aGVlbF9fZGF5cy1pdGVtXCIpXG4gICAgY29uc3QgcG9wdXBEYXlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb3B1cF9fZGF5cy1pdGVtXCIpO1xuICAgIGNvbnN0IHBvcHVwRGF5c01vYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZGF5c19faXRlbVwiKTtcbiAgICBsZXQgY3VycmVudERheSA9IDBcbiAgICBmdW5jdGlvbiBzZXREYXlzKGRheXMsIGN1cnJlbnREYXkpe1xuICAgICAgICBkYXlzLmZvckVhY2goKGRheSwgaSkgPT57XG4gICAgICAgICAgICArK2lcbiAgICAgICAgICAgIGRheS5jbGFzc0xpc3QudG9nZ2xlKFwibmV4dFwiLCBpID4gY3VycmVudERheSk7XG4gICAgICAgICAgICBkYXkuY2xhc3NMaXN0LnRvZ2dsZShcInBhc3RcIiwgaSA8IGN1cnJlbnREYXkpO1xuICAgICAgICAgICAgZGF5LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgaSA9PT0gY3VycmVudERheSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIGRheXNSZW1pbmQoZGF5cywgY2xhc3NBbmltKSB7XG4gICAgICAgIGxldCBkZWxheSA9IDkwMDtcbiAgICAgICAgZGF5cy5mb3JFYWNoKChkYXksIGkpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKGNsYXNzQW5pbSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBkYXkuY2xhc3NMaXN0LnJlbW92ZShjbGFzc0FuaW0pLCAxMjAwKVxuICAgICAgICAgICAgfSwgZGVsYXkgKiBpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIGNvbnN0IHJhbmRvbUludGVydmFsID0gTWF0aC5yYW5kb20oKSAqICg2MDAwIC0gNDAwMCkgKyA0MDAwO1xuICAgIGZ1bmN0aW9uIGFkZEZpcmV3b3Jrcyhjb250YWluZXJTZWxlY3RvciwgbnVtYmVyT2ZGaXJld29ya3MpIHtcbiAgICAgICAgY29uc3QgZmlyZXdvcmtzV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBmaXJld29ya3NXcmFwLmNsYXNzTmFtZSA9ICdmaXJld29ya3Mtd3JhcCc7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZGaXJld29ya3M7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZmlyZXdvcmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGZpcmV3b3JrLmNsYXNzTmFtZSA9ICdmaXJld29yayc7XG4gICAgICAgICAgICBmaXJld29ya3NXcmFwLmFwcGVuZENoaWxkKGZpcmV3b3JrKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lclNlbGVjdG9yKTtcbiAgICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZpcmV3b3Jrc1dyYXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihg0JrQvtC90YLQtdC50L3QtdGAINC3INGB0LXQu9C10LrRgtC+0YDQvtC8IFwiJHtjb250YWluZXJTZWxlY3Rvcn1cIiDQvdC1INC30L3QsNC50LTQtdC90L4uYCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlRmlyZXdvcmtzKGNvbnRhaW5lclNlbGVjdG9yKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyU2VsZWN0b3IpO1xuICAgICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJld29ya3NXcmFwID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5maXJld29ya3Mtd3JhcCcpO1xuICAgICAgICAgICAgaWYgKGZpcmV3b3Jrc1dyYXApIHtcbiAgICAgICAgICAgICAgICBmaXJld29ya3NXcmFwLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihg0JrQvtC90YLQtdC50L3QtdGAINC3INGB0LXQu9C10LrRgtC+0YDQvtC8IFwiJHtjb250YWluZXJTZWxlY3Rvcn1cIiDQvdC1INC30L3QsNC50LTQtdC90L4uYCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RhcnRSYW5kb21JbnRlcnZhbCgpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tSW50ZXJ2YWwgPSBNYXRoLnJhbmRvbSgpICogKDIwMDAwIC0gMTAwMDApICsgMTAwMDA7IC8vINCS0LjQv9Cw0LTQutC+0LLQuNC5INGW0L3RgtC10YDQstCw0Lsg0LzRltC2IDEwINGWIDIwINGB0LXQutGD0L3QtNCw0LzQuFxuICAgICAgICBkYXlzUmVtaW5kKGRheXMsIFwicmVtaW5kXCIpO1xuICAgICAgICBkYXlzUmVtaW5kKHBvcHVwRGF5cywgXCJyZW1pbmRcIik7XG4gICAgICAgIGRheXNSZW1pbmQocG9wdXBEYXlzTW9iLCBcInJlbWluZFwiKTtcbiAgICAgICAgc2V0VGltZW91dChzdGFydFJhbmRvbUludGVydmFsLCByYW5kb21JbnRlcnZhbCk7XG4gICAgfVxuICAgIHN0YXJ0UmFuZG9tSW50ZXJ2YWwoKTtcbiAgICBkYXlzUmVtaW5kKGRheXMsIFwicmVtaW5kXCIpXG4gICAgc2V0RGF5cyhkYXlzLCBjdXJyZW50RGF5KVxuICAgIHNldERheXMocG9wdXBEYXlzLCBjdXJyZW50RGF5KVxuICAgIHNldERheXMocG9wdXBEYXlzTW9iLCBjdXJyZW50RGF5KVxuXG4vLy8gd2hlZWwgbG9naWNcbiAgICBjb25zdCB3aGVlbFNlY3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aGVlbF9fc2VjdGlvbnNcIiksXG4gICAgICAgIHdoZWVsV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2hlZWxfX3dyYXBcIiksXG4gICAgICAgIHdoZWVsQXJyb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndoZWVsX19hcnJvd1wiKSxcbiAgICAgICAgd2hlZWxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndoZWVsX19idG5cIiksXG4gICAgICAgIHNwaW5CZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3Bpbi1iZ1wiKSxcbiAgICAgICAgc2FsdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpcmV3b3Jrcy13cmFwXCIpLFxuICAgICAgICBidWJsZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2hlZWxfX2RheXMtaWNvbnNcIiksXG4gICAgICAgIHdoZWVsQnVibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndoZWVsX19idWJsZVwiKSxcbiAgICAgICAgcG9wdXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwc1wiKSxcbiAgICAgICAgcG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwXCIpLFxuICAgICAgICBwb3B1cENsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cF9fY2xvc2VcIilcblxuICAgIGJ1YmxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+e1xuICAgICAgICB3aGVlbEJ1YmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJfaGlkZGVuXCIpXG4gICAgfSlcbiAgICBidWJsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKGUpID0+e1xuICAgICAgICB3aGVlbEJ1YmxlLmNsYXNzTGlzdC5hZGQoXCJfaGlkZGVuXCIpXG4gICAgfSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiBlLnRhcmdldCA9PT0gYnVibGVCdG4gPyBudWxsIDogd2hlZWxCdWJsZS5jbGFzc0xpc3QuYWRkKFwiX2hpZGRlblwiKSlcbiAgICBsZXQgcHJpemVzID0gWydpcGhvbmUnLCAnZWNvZmxvdycsICdmczk5JywgJ25vdGhpbmcnLCBcImJvbnVzZXNcIl1cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21Qcml6ZShhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwcml6ZXMubGVuZ3RoKV07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIHNob3dDbGFzcywgc3RyZWFrQm9udXMsIHNwaW5CZywgY2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCwgY2xhc3NQcml6ZSl7XG4gICAgICAgIC8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmF2LXBhZ2VcIikuY2xhc3NMaXN0LmFkZChcInBvcHVwQmdcIilcbiAgICAgICAgaWYoY2xhc3NQcml6ZSl7XG4gICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKGAke2NsYXNzUHJpemV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY2xhc3NQcml6ZSA9PT0gXCJyZXNwaW5cIikgcmV0dXJuXG4gICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoYCR7c2hvd0NsYXNzfWApXG4gICAgICAgIHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygnX25vdGhpbmcnKSA9PT0gdHJ1ZSA/IG51bGwgOiBhZGRGaXJld29ya3MoXCIucG9wdXBzXCIsIDcpXG4gICAgICAgIHN0cmVha0JvbnVzID8gcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9kb25lXCIpIDogcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9pbmNvbXBsZXRlXCIpXG4gICAgICAgIHBvcHVwQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJfb3BhY2l0eVwiLCBcIl96SW5kZXhcIilcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCJcbiAgICAgICAgc3BpbkJnLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93U3BpbkJnXCIpXG4gICAgICAgIGNvbnN0IHBlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcHVwX19wZXJzXCIpXG4gICAgICAgIGNvbnN0IHByaXplID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb3B1cF9fcHJpemVcIilcbiAgICAgICAgY29uc3QgYnVibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcHVwX19idWJsZVwiKVxuICAgICAgICBjb25zdCBwb3B1cEJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwX19tYWluXCIpXG4gICAgICAgIGNvbnN0IHBvcHVwVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcHVwX190aXRsZVwiKVxuICAgICAgICBjb25zdCBwb3B1cExlZnRBcnJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucG9wdXBfX2RlY29yLWxlZnRcIilcbiAgICAgICAgY29uc3QgcG9wdXBSaWdodEFycm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb3B1cF9fZGVjb3ItcmlnaHRcIilcbiAgICAgICAgc3RyZWFrQm9udXMgPyBwb3B1cEJvZHkuY2xhc3NMaXN0LmFkZChcIl9kb25lXCIpIDogcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9pbmNvbXBsZXRlXCIpXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmF2LXBhZ2VcIikuY2xhc3NMaXN0LnJlbW92ZShcImJnU2NhbGVcIilcbiAgICAgICAgZnVuY3Rpb24gYWRkQW5pbShhcnIsIGNsYXNzQW5pbSl7XG4gICAgICAgICAgICBhcnIuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZChgJHtjbGFzc0FuaW19YCkgKVxuICAgICAgICB9XG4gICAgICAgIC8vcG9wdXAgYW5pbWF0aW9uc1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+e1xuICAgICAgICAgICAgcG9wdXBCb2R5LmNsYXNzTGlzdC5hZGQoXCJwb3B1cE1haW5BbmltXCIpXG4gICAgICAgICAgICBhZGRBbmltKHBlcnMsIFwicG9wdXBQZXJzQW5pbVwiKVxuICAgICAgICAgICAgYWRkQW5pbShidWJsZSwgXCJwb3B1cEJ1YmxlQW5pbVwiKVxuICAgICAgICB9LCAxMDApXG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PntcbiAgICAgICAgICAgIGFkZEFuaW0ocHJpemUsIFwicG9wdXBQcml6ZUFuaW1cIilcbiAgICAgICAgICAgIHBvcHVwVGl0bGUuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZChcInBvcHVwVGl0bGVBbmltXCIpKVxuXG4gICAgICAgIH0sIDYwMClcbiAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgcG9wdXBMZWZ0QXJyb3cuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZChcInBvcHVwTGVmdEFyckFuaW1cIikpXG4gICAgICAgICAgICBwb3B1cFJpZ2h0QXJyb3cuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZChcInBvcHVwUmlnaHRBcnJBbmltXCIpKVxuICAgICAgICB9LCAxMjAwKVxuICAgICAgICAvL3BvcHVwIGFuaW1hdGlvbnNcbiAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xuICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdfbm90aGluZycpID09PSB0cnVlID8gbnVsbCA6IGFkZEZpcmV3b3JrcyhcIi53aGVlbFwiLCA3KVxuICAgICAgICAgICAgd2hlZWwuY2xhc3NMaXN0LmFkZChcIl9sb2NrXCIpXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC5hZGQoXCJfbG9ja1wiKVxuICAgICAgICAgICAgd2hlZWwuY2xhc3NMaXN0LnJlbW92ZShcIndoZWVsU2l6ZUluY3JlYXNlXCIpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCJcbiAgICAgICAgICAgIHBvcHVwQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJfb3BhY2l0eVwiLCBcIl96SW5kZXhcIilcbiAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoYCR7c2hvd0NsYXNzfWAsICdfZG9uZScsICdfaW5jb21wbGV0ZScpXG4gICAgICAgICAgICByZW1vdmVGaXJld29ya3MoXCIucG9wdXBzXCIpO1xuICAgICAgICB9LCB7b25jZTogdHJ1ZX0pO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucG9wdXBfX2J0bicpLmZvckVhY2goYnRuID0+IGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdfbm90aGluZycpID09PSB0cnVlID8gbnVsbCA6IGFkZEZpcmV3b3JrcyhcIi53aGVlbFwiLCA3KVxuICAgICAgICAgICAgd2hlZWwuY2xhc3NMaXN0LmFkZChcIl9sb2NrXCIpXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC5hZGQoXCJfbG9ja1wiKVxuICAgICAgICAgICAgd2hlZWwuY2xhc3NMaXN0LnJlbW92ZShcIndoZWVsU2l6ZUluY3JlYXNlXCIpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCJcbiAgICAgICAgICAgIHBvcHVwQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJfb3BhY2l0eVwiLCBcIl96SW5kZXhcIilcbiAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoYCR7c2hvd0NsYXNzfWAsICdfZG9uZScsICdfaW5jb21wbGV0ZScpXG4gICAgICAgICAgICByZW1vdmVGaXJld29ya3MoXCIucG9wdXBzXCIpO1xuICAgICAgICB9LCB7b25jZTogdHJ1ZX0pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcGluV2hlZWwocG9zaXRpb24sIGFuaW1hdGlvbiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dCl7XG4gICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT57XG4gICAgICAgICAgICBzZWN0aW9ucy5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKC01MCUsIC01MCUpIHJvdGF0ZSgke3Bvc2l0aW9ufWRlZylgXG4gICAgICAgICAgICBzZWN0aW9ucy5jbGFzc0xpc3QucmVtb3ZlKGAke2FuaW1hdGlvbn1gKVxuICAgICAgICB9LCB7b25jZTogdHJ1ZX0pXG4gICAgICAgIHNlY3Rpb25zLmNsYXNzTGlzdC5hZGQoYCR7YW5pbWF0aW9ufWApXG4gICAgICAgIGFycm93LnN0eWxlLm9wYWNpdHkgPSBcIjBcIlxuICAgICAgICB3aGVlbC5jbGFzc0xpc3QuYWRkKFwid2hlZWxTaXplSW5jcmVhc2VcIilcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYXYtcGFnZVwiKS5jbGFzc0xpc3QuYWRkKFwiYmdTY2FsZVwiKVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlY3Rvci1wcml6ZVwiKS5zdHlsZS5vcGFjaXR5ID0gXCIxXCJcbiAgICAgICAgc3BpbkJnLmNsYXNzTGlzdC5hZGQoXCJzaG93U3BpbkJnXCIpXG4gICAgICAgIGlmKGFuaW1hdGlvbiAhPT0gXCJyZXNwaW5BbmltXCIpe1xuICAgICAgICAgICAgYnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIlxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBpbml0U3BpbihzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHNwaW5CZywgc2FsdXQsIHByaXplLCBzdHJlYWtCb251cykge1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xuICAgICAgICAgICAgd2hlZWxCdG4uY2xhc3NMaXN0LmFkZCgnX2Rpc2FibGVkJyk7XG4gICAgICAgICAgICBzZW5kU3BpblJlcXVlc3QoKS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXV0aFJlcyA9IGNoZWNrVXNlckF1dGgodHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYoYXV0aFJlcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXV0aFJlcy50aGVuKCgpID0+IHJlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzIHx8ICEhcmVzLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGVlbEJ0bi5jbGFzc0xpc3QuYWRkKCdwdWxzZS1idG4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZWVsQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ19kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByaXplID0gcmVzLm51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RyZWFrQm9udXMgPSByZXMuc3RyZWFrQm9udXMgfHwgZGVidWc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihwcml6ZSA9PT0gXCJpcGhvbmVcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9pcGhvbmVcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxODAwLCBcImlwaG9uZVByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihwcml6ZSA9PT0gXCJlY29mbG93XCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfZWNvZmxvd1wiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BpbldoZWVsKDE2NjUsIFwiZWNvZmxvd1ByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihwcml6ZSA9PT0gXCJmczk5XCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfZnM5OVwiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BpbldoZWVsKDE3MTEsIFwiZnM5OVByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihwcml6ZSA9PT0gXCJub3RoaW5nXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoXCJfbm90aGluZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCxcIl9ub3RoaW5nXCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTc1NSwgXCJub3RoaW5nUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHByaXplID09PSBcImJvbnVzZXNcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9ib251c1wiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BpbldoZWVsKDE5MzUsIFwiYm9udXNlc1ByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGluaXRTcGluKHdoZWVsU2VjdGlvbnMsIHdoZWVsQnRuLCB3aGVlbFdyYXAsIHdoZWVsQXJyb3csIHNwaW5CZywgc2FsdXQpXG5cbiAgICBmdW5jdGlvbiByZWZyZXNoVXNlckluZm8odXNlckluZm8sIHNraXBQb3B1cCkge1xuICAgICAgICByZWZyZXNoRGFpbHlQb2ludHNTZWN0aW9uKHVzZXJJbmZvKTtcbiAgICAgICAgaWYoIXNraXBQb3B1cCkge1xuICAgICAgICAgICAgcmVmcmVzaFdoZWVsKHVzZXJJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICByZWZyZXNoU3RyZWFrKHVzZXJJbmZvKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoV2hlZWwodXNlckluZm8pIHtcbiAgICAgICAgaWYgKHVzZXJJbmZvLnNwaW5BbGxvd2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXJJbmZvLnBvaW50c1BlckRheSA+PSAxMDApIHtcbiAgICAgICAgICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QuYWRkKCdfbG9jaycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2hlZWxXcmFwLmNsYXNzTGlzdC5hZGQoJ19ibG9jaycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaERhaWx5UG9pbnRzU2VjdGlvbih1c2VySW5mbykge1xuICAgICAgICBjb25zdCBwb2ludHMgPSBNYXRoLm1pbih1c2VySW5mby5wb2ludHNQZXJEYXkgfHwgMCwgMTAwKTtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NTdGF0dXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3NfX2Jhci1zdGF0dXMnKTtcbiAgICAgICAgcHJvZ3Jlc3NTdGF0dXMuaW5uZXJIVE1MID0gcG9pbnRzID8gYCR7cG9pbnRzfSDigrRgIDogXCIgMCDigrRcIjtcbiAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudCcpO1xuICAgICAgICBjdXJyZW50U3Bhbi5pbm5lckhUTUwgPSBgJHtwb2ludHN9YDtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NMaW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2dyZXNzX19iYXItbGluZScpO1xuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHBvaW50cyAvIDEwMC4wICogMTAwO1xuICAgICAgICBwcm9ncmVzc0xpbmUuc3R5bGUud2lkdGggPSBgJHtwcm9ncmVzc30lYDtcblxuICAgICAgICBjb25zdCBsYXN0VXBkYXRlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYmFyLWRhdGEnKTtcbiAgICAgICAgaWYgKGxhc3RVcGRhdGVFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAodXNlckluZm8ubGFzdFVwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RVcGRhdGVEYXRlID0gbmV3IERhdGUodXNlckluZm8ubGFzdFVwZGF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihsYXN0VXBkYXRlRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF5ID0gU3RyaW5nKGxhc3RVcGRhdGVEYXRlLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSBTdHJpbmcobGFzdFVwZGF0ZURhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHllYXIgPSBsYXN0VXBkYXRlRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBob3VycyA9IFN0cmluZyhsYXN0VXBkYXRlRGF0ZS5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKGxhc3RVcGRhdGVEYXRlLmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWREYXRlVGltZSA9IGAke2RheX0uJHttb250aH0uJHt5ZWFyfS4gJHtob3Vyc306JHttaW51dGVzfWA7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnQtZGF0YScpLmlubmVySFRNTCA9IGZvcm1hdHRlZERhdGVUaW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoU3RyZWFrKHVzZXJJbmZvKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndoZWVsX19kYXlzLWl0ZW0nKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgc3RyZWFrID0gdXNlckluZm8uc3BpbnNTdHJlYWs7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgncGFzdCcpO1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCduZXh0Jyk7XG4gICAgICAgICAgICBpZiAoaSA8IHN0cmVhaykge1xuICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgncGFzdCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ25leHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvcHVwRGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3B1cF9fZGF5cy1pdGVtJyk7XG4gICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBwb3B1cERheXMpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3Bhc3QnKTtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbmV4dCcpO1xuICAgICAgICAgICAgaWYgKGogPCBzdHJlYWspIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3Bhc3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCduZXh0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqKys7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb2JpbGVEYXlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRheXNfX2l0ZW0nKTtcbiAgICAgICAgbGV0IGsgPSAwO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIG1vYmlsZURheXMpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgncGFzdCcpO1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCduZXh0Jyk7XG4gICAgICAgICAgICBpZiAoayA8IHN0cmVhaykge1xuICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgncGFzdCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ25leHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuICAgIH1cblxuXG4vLy8vIGFjY29yZGlvblxuICAgIGNvbnN0IGFjY29yZGlvbkhlYWRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uX19oZWFkZXInKTtcbiAgICBhY2NvcmRpb25IZWFkZXJzLmZvckVhY2goaGVhZGVyID0+IHtcbiAgICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGhlYWRlci5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uX19jb250ZW50JykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPT0gY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY29udGVudC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgICAgICAgY29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBmb3IgdGVzdFxuICAgIC8vXG4gICAgLy8gY29uc3QgZnMyMCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mczIwJylcbiAgICAvLyBjb25zdCBmczI1ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZzMjUnKVxuICAgIC8vIGNvbnN0IGZzNDAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnM0MCcpXG4gICAgLy8gY29uc3QgZnM1MCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mczUwJylcbiAgICAvLyBjb25zdCBmczc1ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZzNzUnKVxuICAgIC8vIGNvbnN0IGxlaTE1ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxlaTE1JylcbiAgICAvLyBjb25zdCBsZWkyMCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sZWkyMCcpXG4gICAgLy8gY29uc3QgbGVpMjUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGVpMjUnKVxuICAgIC8vIGNvbnN0IGRvbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RyZWFrJylcbiAgICAvLyBjb25zdCBkcm9wQm9udXNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJvcC1ib251cycpO1xuICAgIC8vIGNvbnN0IGRyb3BOb3RoaW5nQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRyb3Atbm90aGluZycpO1xuICAgIC8vXG4gICAgLy8gY29uc3QgZHJvcExvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9jaycpO1xuICAgIC8vIGNvbnN0IGRyb3BTaWduID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpZ24nKTtcbiAgICAvL1xuICAgIC8vIHZhciBzdHJlYWtCb251cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3N0cmVha0JvbnVzJykpIHx8IGZhbHNlO1xuICAgIC8vXG4gICAgLy8gaWYoc3RyZWFrQm9udXMpe1xuICAgIC8vICAgICBkb25lLnN0eWxlLmJhY2tncm91bmQgPSBcImdyZWVuXCJcbiAgICAvLyB9XG4gICAgLy8gaWYoIXN0cmVha0JvbnVzKXtcbiAgICAvLyAgICAgZG9uZS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZWRcIlxuICAgIC8vIH1cbiAgICAvL1xuICAgIC8vIGRvbmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAvLyAgICAgc3RyZWFrQm9udXMgPSAhc3RyZWFrQm9udXM7XG4gICAgLy8gICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzdHJlYWtCb251cycsIEpTT04uc3RyaW5naWZ5KHN0cmVha0JvbnVzKSk7XG4gICAgLy8gICAgIHN0cmVha0JvbnVzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc3RyZWFrQm9udXMnKSkgfHwgZmFsc2U7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHN0cmVha0JvbnVzKVxuICAgIC8vICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAvL1xuICAgIC8vIH0pO1xuICAgIC8vXG4gICAgLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kcm9wLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4gICAgLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZHJvcC1tZW51XCIpLmNsYXNzTGlzdC50b2dnbGUoXCJfaGlkZGVuXCIpXG4gICAgLy8gfSlcbiAgICAvL1xuICAgIC8vXG4gICAgLy8gaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgZnMyMCwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImZzMjBcIiwgc3RyZWFrQm9udXMpXG4gICAgLy8gaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgZnMyNSwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImZzMjVcIiwgc3RyZWFrQm9udXMpXG4gICAgLy8gaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgZnM0MCwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImZzNDBcIiwgc3RyZWFrQm9udXMpXG4gICAgLy8gaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgZnM1MCwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImZzNTBcIiwgc3RyZWFrQm9udXMpXG4gICAgLy8gaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgZnM3NSwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImZzNzVcIiwgc3RyZWFrQm9udXMpXG4gICAgLy8gaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgbGVpMTUsIHdoZWVsV3JhcCwgd2hlZWxBcnJvdywgc3BpbkJnLCBzYWx1dCwgXCJsZWkxNVwiLCBzdHJlYWtCb251cylcbiAgICAvLyBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCBsZWkyMCwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImxlaTIwXCIsIHN0cmVha0JvbnVzKVxuICAgIC8vIGluaXRTcGluKHdoZWVsU2VjdGlvbnMsIGxlaTI1LCB3aGVlbFdyYXAsIHdoZWVsQXJyb3csIHNwaW5CZywgc2FsdXQsIFwibGVpMjVcIiwgc3RyZWFrQm9udXMpXG4gICAgLy8gLy8gaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgZHJvcEJvbnVzQnV0dG9uLCB3aGVlbFdyYXAsIHdoZWVsQXJyb3csIHNwaW5CZywgc2FsdXQpXG4gICAgLy8gaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgZHJvcE5vdGhpbmdCdXR0b24sIHdoZWVsV3JhcCwgd2hlZWxBcnJvdywgc3BpbkJnLCBzYWx1dCwgXCJub3RoaW5nXCIsIHN0cmVha0JvbnVzKVxuICAgIC8vXG4gICAgLy8gZHJvcExvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyAgICAgd2hlZWxXcmFwLmNsYXNzTGlzdC50b2dnbGUoXCJfbG9ja1wiKTtcbiAgICAvLyAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcm9ncmVzc1wiKS5jbGFzc0xpc3QudG9nZ2xlKFwiX2xvY2tcIik7XG4gICAgLy8gICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QucmVtb3ZlKFwiX3NpZ25cIik7XG4gICAgLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZ3Jlc3NcIikuY2xhc3NMaXN0LnJlbW92ZShcIl9zaWduXCIpO1xuICAgIC8vIH0pO1xuICAgIC8vIGRyb3BTaWduLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QudG9nZ2xlKFwiX3NpZ25cIik7XG4gICAgLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZ3Jlc3NcIikuY2xhc3NMaXN0LnRvZ2dsZShcIl9zaWduXCIpO1xuICAgIC8vICAgICB3aGVlbFdyYXAuY2xhc3NMaXN0LnJlbW92ZShcIl9sb2NrXCIpO1xuICAgIC8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJfbG9ja1wiKTtcbiAgICAvLyB9KTtcblxufSkoKTtcblxuXG5cbi8vIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4vLyAgICAgaWYocHJpemUgPT09IFwiaXBob25lXCIpe1xuLy8gICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2lwaG9uZVwiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4vLyAgICAgICAgIHNwaW5XaGVlbCgxODAwLCBcImlwaG9uZVByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4vLyAgICAgfVxuLy8gICAgIGlmKHByaXplID09PSBcImVjb2Zsb3dcIil7XG4vLyAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfZWNvZmxvd1wiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4vLyAgICAgICAgIHNwaW5XaGVlbCgxNjY1LCBcImVjb2Zsb3dQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuLy8gICAgIH1cbi8vICAgICBpZihwcml6ZSA9PT0gXCJmczk5XCIpe1xuLy8gICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2ZzOTlcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuLy8gICAgICAgICBzcGluV2hlZWwoMTcxMSwgXCJmczk5UHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbi8vICAgICB9XG4vLyAgICAgaWYocHJpemUgPT09IFwibm90aGluZ1wiKXtcbi8vICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9ub3RoaW5nXCIpXG4vLyAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCxcIl9ub3RoaW5nXCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbi8vICAgICAgICAgc3BpbldoZWVsKDE3NTUsIFwibm90aGluZ1ByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4vLyAgICAgfVxuLy8gICAgIGlmKHByaXplID09PSBcImJvbnVzZXNcIil7XG4vLyAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfYm9udXNcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuLy8gICAgICAgICBzcGluV2hlZWwoMTkzNSwgXCJib251c2VzUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbi8vICAgICB9XG4vLyB9KVxuXG4iXX0=
