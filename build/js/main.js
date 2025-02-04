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
  var locale = sessionStorage.getItem("locale") ? sessionStorage.getItem("locale") : "uk";
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
  var currentDay = sessionStorage.getItem("currentDay") ? Number(sessionStorage.getItem("currentDay")) : 0;
  console.log(currentDay);
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
      if (prize === "fs77") {
        sections.addEventListener("animationend", function () {
          return showPopup(sections, wheel, "_fs77", currentDay, spinBg, popupCloseBtn, popupContainer, popup);
        });
        spinWheel(1845, "fs77Prize", sections, btn, wheel, arrow, prize, spinBg, salut);
      }
      if (prize === "bonus111") {
        sections.addEventListener("animationend", function () {
          return showPopup(sections, wheel, "_bonus111", currentDay, spinBg, popupCloseBtn, popupContainer, popup);
        });
        spinWheel(1845, "bonus111Prize", sections, btn, wheel, arrow, prize, spinBg, salut);
      }
      if (prize === "respin") {
        sections.addEventListener("animationend", function () {
          return showPopup(sections, wheel, "_bonus", streakBonus, spinBg, popupCloseBtn, popupContainer, popup, "respin");
        }, {
          once: true
        });
        spinWheel(89.5, "respinAnim", sections, btn, wheel, arrow, prize, spinBg, salut);
      }

      // sendSpinRequest().then(res => {
      //     const authRes = checkUserAuth(true);
      //     if(authRes) {
      //         return authRes.then(() => res);
      //     }
      //     return res;
      // })
      //     .then(res => {
      //         console.log(res);
      //         if (!res || !!res.error) {
      //             wheelBtn.classList.add('pulse-btn');
      //             wheelBtn.classList.remove('_disabled');
      //             return;
      //         }
      //         const prize = res.number;
      //         const streakBonus = res.streakBonus || debug;
      //             if(prize === "iphone"){
      //                 sections.addEventListener("animationend", () => showPopup(sections, wheel, "_iphone", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
      //                 spinWheel(1800, "iphonePrize", sections, btn, wheel, arrow, prize, spinBg, salut)
      //             }
      //             if(prize === "ecoflow"){
      //                 sections.addEventListener("animationend", () => showPopup(sections, wheel, "_ecoflow", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
      //                 spinWheel(1665, "ecoflowPrize", sections, btn, wheel, arrow, prize, spinBg, salut)
      //             }
      //             if(prize === "fs99"){
      //                 sections.addEventListener("animationend", () => showPopup(sections, wheel, "_fs99", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
      //                 spinWheel(1711, "fs99Prize", sections, btn, wheel, arrow, prize, spinBg, salut)
      //             }
      //             if(prize === "nothing"){
      //                 popup.classList.add("_nothing")
      //                 sections.addEventListener("animationend", () => showPopup(sections, wheel,"_nothing", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
      //                 spinWheel(1755, "nothingPrize", sections, btn, wheel, arrow, prize, spinBg, salut)
      //             }
      //             if(prize === "bonuses"){
      //                 sections.addEventListener("animationend", () => showPopup(sections, wheel, "_bonus", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
      //                 spinWheel(1935, "bonusesPrize", sections, btn, wheel, arrow, prize, spinBg, salut)
      //             }
      //             if(prize === "fs77"){
      //                 sections.addEventListener("animationend", () => showPopup(sections, wheel, "_fs77", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
      //                 spinWheel(1711, "fs77Prize", sections, btn, wheel, arrow, prize, spinBg, salut)
      //             }
      //     });
    });
  }

  initSpin(wheelSections, wheelBtn, wheelWrap, wheelArrow, spinBg, salut, "bonus111");
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
  var fs99 = document.querySelector('.fs99-popup');
  var iphone = document.querySelector('.iphone-popup');
  var ecoflow = document.querySelector('.ecoflow-popup');
  var bonuses = document.querySelector('.bonus103-popup');
  var fs77 = document.querySelector('.fs77-popup');
  var bonus111 = document.querySelector('.bonus111-popup');
  var done = document.querySelector('.done');
  var dropNothingButton = document.querySelector('.nothing-popup');
  var respinBtn = document.querySelector('.respin-popup');
  var dropLock = document.querySelector('.lock');
  var dropSign = document.querySelector('.sign');
  var skipBtn = document.querySelector('.skip-anim');
  var lngBtn = document.querySelector('.lng-btn');
  var streakBonus = JSON.parse(localStorage.getItem('streakBonus')) || false;
  var skipAnim = sessionStorage.getItem("skip") === "skip" ? true : false;
  lngBtn.addEventListener("click", function () {
    if (locale === "uk") {
      sessionStorage.setItem("locale", "en");
      window.location.reload();
      return;
    }
    if (locale === "en") {
      sessionStorage.setItem("locale", "uk");
      window.location.reload();
      return;
    }
  });
  console.log(skipAnim);
  if (skipAnim) {
    skipBtn.classList.add("green");
    skipBtn.classList.remove("red");
    wheelSections.classList.add("skipSpin");
  }
  if (!skipAnim) {
    skipBtn.classList.remove("green");
    skipBtn.classList.add("red");
    wheelSections.classList.remove("skipSpin");
  }
  skipBtn.addEventListener("click", function (e) {
    if (skipAnim) {
      skipBtn.classList.add("green");
      skipBtn.classList.remove("red");
      sessionStorage.removeItem("skip");
      wheelSections.classList.add("skipSpin");
      sessionStorage.removeItem("skip");
      window.location.reload();
    }
    if (!skipAnim) {
      skipBtn.classList.remove("green");
      skipBtn.classList.add("red");
      sessionStorage.setItem("skip", "skip");
      wheelSections.classList.remove("skipSpin");
      window.location.reload();
    }
  });
  if (streakBonus) {
    done.style.background = "green";
    currentDay = 2;
  }
  if (!streakBonus) {
    done.style.background = "red";
    currentDay = 0;
  }
  done.addEventListener("click", function () {
    streakBonus = !streakBonus;
    localStorage.setItem('streakBonus', JSON.stringify(streakBonus));
    streakBonus = JSON.parse(localStorage.getItem('streakBonus')) || false;
    console.log(streakBonus);
    window.location.reload();
  });
  document.querySelector(".menu-btn").addEventListener("click", function () {
    document.querySelector(".menu-test").classList.toggle("_hidden");
  });
  initSpin(wheelSections, fs99, wheelWrap, wheelArrow, spinBg, salut, "fs99", streakBonus);
  initSpin(wheelSections, iphone, wheelWrap, wheelArrow, spinBg, salut, "iphone", streakBonus);
  initSpin(wheelSections, ecoflow, wheelWrap, wheelArrow, spinBg, salut, "ecoflow", streakBonus);
  initSpin(wheelSections, bonuses, wheelWrap, wheelArrow, spinBg, salut, "bonuses", streakBonus);
  initSpin(wheelSections, fs77, wheelWrap, wheelArrow, spinBg, salut, "fs77", streakBonus);
  initSpin(wheelSections, bonus111, wheelWrap, wheelArrow, spinBg, salut, "bonus111", streakBonus);
  initSpin(wheelSections, dropNothingButton, wheelWrap, wheelArrow, spinBg, salut, "nothing", streakBonus);
  initSpin(wheelSections, respinBtn, wheelWrap, wheelArrow, spinBg, salut, "respin", streakBonus);
  dropLock.addEventListener("click", function () {
    wheelWrap.classList.toggle("_lock");
    document.querySelector(".progress").classList.toggle("_lock");
    wheelWrap.classList.remove("_sign");
    document.querySelector(".progress").classList.remove("_sign");
  });
  dropSign.addEventListener("click", function () {
    wheelWrap.classList.toggle("_sign");
    document.querySelector(".progress").classList.toggle("_sign");
    wheelWrap.classList.remove("_lock");
    document.querySelector(".progress").classList.remove("_lock");
  });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiYXBpVVJMIiwidW5hdXRoTXNncyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInBhcnRpY2lwYXRlQnRucyIsInJvTGVuZyIsInF1ZXJ5U2VsZWN0b3IiLCJlbkxlbmciLCJsb2NhbGUiLCJzZXNzaW9uU3RvcmFnZSIsImdldEl0ZW0iLCJpMThuRGF0YSIsImRlYnVnIiwidXNlcklkIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwidGhlbiIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwicmVtb3ZlQXR0cmlidXRlIiwibWFpblBhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZWZyZXNoTG9jYWxpemVkQ2xhc3MiLCJlbGVtZW50IiwiYmFzZUNzc0NsYXNzIiwibGFuZyIsInJlbW92ZSIsInJlcXVlc3QiLCJsaW5rIiwiZXh0cmFPcHRpb25zIiwiaGVhZGVycyIsImluaXQiLCJ3aW5kb3ciLCJzdG9yZSIsInN0YXRlIiwiZ2V0U3RhdGUiLCJhdXRoIiwiaXNBdXRob3JpemVkIiwiaWQiLCJzZXR1cFBhZ2UiLCJjIiwiaSIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJhdXRoQnRuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInBhcnRpY2lwYXRlIiwicGFyYW1zIiwidXNlcmlkIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJpdGVtIiwid2hlZWxXcmFwIiwic2tpcFBvcHVwIiwibXNnIiwicmVmcmVzaFVzZXJJbmZvIiwiZGlzcGxheVVzZXJTcGlucyIsInNwaW5zIiwiYnRuIiwiaGVhZERyb3BJdGVtIiwibm9TcGluSXRlbSIsInNwaW5zQ29udGFpbmVyIiwic3BpbiIsInNwaW5EYXRlIiwiRGF0ZSIsImRhdGUiLCJmb3JtYXR0ZWREYXRlIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwic3Bpbk5hbWUiLCJ0cmFuc2xhdGVLZXkiLCJuYW1lIiwic3BpbkVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJzZXRUaW1lb3V0Iiwic2VuZFNwaW5SZXF1ZXN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJudW1iZXIiLCJ0eXBlIiwiZGF5cyIsInBvcHVwRGF5cyIsInBvcHVwRGF5c01vYiIsImN1cnJlbnREYXkiLCJOdW1iZXIiLCJjb25zb2xlIiwibG9nIiwic2V0RGF5cyIsImRheSIsInRvZ2dsZSIsImRheXNSZW1pbmQiLCJjbGFzc0FuaW0iLCJkZWxheSIsImFkZEZpcmV3b3JrcyIsImNvbnRhaW5lclNlbGVjdG9yIiwibnVtYmVyT2ZGaXJld29ya3MiLCJmaXJld29ya3NXcmFwIiwiY2xhc3NOYW1lIiwiZmlyZXdvcmsiLCJjb250YWluZXIiLCJlcnJvciIsInJlbW92ZUZpcmV3b3JrcyIsInN0YXJ0UmFuZG9tSW50ZXJ2YWwiLCJyYW5kb21JbnRlcnZhbCIsIk1hdGgiLCJyYW5kb20iLCJ3aGVlbFNlY3Rpb25zIiwid2hlZWxBcnJvdyIsIndoZWVsQnRuIiwic3BpbkJnIiwic2FsdXQiLCJidWJsZUJ0biIsIndoZWVsQnVibGUiLCJwb3B1cENvbnRhaW5lciIsInBvcHVwIiwicG9wdXBDbG9zZUJ0biIsInRhcmdldCIsInByaXplcyIsImdldFJhbmRvbVByaXplIiwiYXJyIiwiZmxvb3IiLCJzaG93UG9wdXAiLCJzZWN0aW9ucyIsIndoZWVsIiwic2hvd0NsYXNzIiwic3RyZWFrQm9udXMiLCJjbG9zZUJ0biIsImNsYXNzUHJpemUiLCJjb250YWlucyIsInN0eWxlIiwib3ZlcmZsb3ciLCJwZXJzIiwicHJpemUiLCJidWJsZSIsInBvcHVwQm9keSIsInBvcHVwVGl0bGUiLCJwb3B1cExlZnRBcnJvdyIsInBvcHVwUmlnaHRBcnJvdyIsImFkZEFuaW0iLCJvbmNlIiwic3BpbldoZWVsIiwicG9zaXRpb24iLCJhbmltYXRpb24iLCJhcnJvdyIsInRyYW5zZm9ybSIsIm9wYWNpdHkiLCJwb2ludGVyRXZlbnRzIiwiaW5pdFNwaW4iLCJ1c2VySW5mbyIsInJlZnJlc2hEYWlseVBvaW50c1NlY3Rpb24iLCJyZWZyZXNoV2hlZWwiLCJyZWZyZXNoU3RyZWFrIiwic3BpbkFsbG93ZWQiLCJwb2ludHNQZXJEYXkiLCJwb2ludHMiLCJtaW4iLCJwcm9ncmVzc1N0YXR1cyIsImN1cnJlbnRTcGFuIiwicHJvZ3Jlc3NMaW5lIiwicHJvZ3Jlc3MiLCJ3aWR0aCIsImxhc3RVcGRhdGVFbGVtZW50IiwibGFzdFVwZGF0ZSIsImxhc3RVcGRhdGVEYXRlIiwiaXNOYU4iLCJTdHJpbmciLCJnZXREYXRlIiwicGFkU3RhcnQiLCJtb250aCIsImdldE1vbnRoIiwieWVhciIsImdldEZ1bGxZZWFyIiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZm9ybWF0dGVkRGF0ZVRpbWUiLCJpdGVtcyIsInN0cmVhayIsInNwaW5zU3RyZWFrIiwiaiIsIm1vYmlsZURheXMiLCJrIiwiYWNjb3JkaW9uSGVhZGVycyIsImhlYWRlciIsImNvbnRlbnQiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJkaXNwbGF5IiwicHJldmlvdXNFbGVtZW50U2libGluZyIsImZzOTkiLCJpcGhvbmUiLCJlY29mbG93IiwiYm9udXNlcyIsImZzNzciLCJib251czExMSIsImRvbmUiLCJkcm9wTm90aGluZ0J1dHRvbiIsInJlc3BpbkJ0biIsImRyb3BMb2NrIiwiZHJvcFNpZ24iLCJza2lwQnRuIiwibG5nQnRuIiwicGFyc2UiLCJsb2NhbFN0b3JhZ2UiLCJza2lwQW5pbSIsInNldEl0ZW0iLCJsb2NhdGlvbiIsInJl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QUFDO0VBQ0ZtTCxRQUFRLENBQUM5SixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBWTtJQUMzQ1csU0FBUyxDQUFDdEMsU0FBUyxDQUFDMkUsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQzdHLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDOEIsU0FBUyxDQUFDMkUsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUM3RHJDLFNBQVMsQ0FBQ3RDLFNBQVMsQ0FBQ00sTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQ3hDLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDOEIsU0FBUyxDQUFDTSxNQUFNLENBQUMsT0FBTyxDQUFDO0VBQ2pFLENBQUMsQ0FBQztBQUVOLENBQUMsR0FBRzs7QUFJSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFwaVVSTCA9ICdodHRwczovL2Zhdi1wcm9tLmNvbS9hcGlfd2hlZWxfdWEnO1xuXG4gICAgY29uc3RcbiAgICAgICAgdW5hdXRoTXNncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy51bmF1dGgtbXNnJyksXG4gICAgICAgIHBhcnRpY2lwYXRlQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idG4tam9pbicpO1xuXG4gICAgY29uc3Qgcm9MZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvTGVuZycpO1xuICAgIGNvbnN0IGVuTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbkxlbmcnKTtcblxuICAgIGxldCBsb2NhbGUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxlXCIpID8gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcImxvY2FsZVwiKSA6IFwidWtcIlxuXG4gICAgaWYgKHJvTGVuZykgbG9jYWxlID0gJ3VrJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG5cbiAgICBsZXQgaTE4bkRhdGEgPSB7fTtcbiAgICBjb25zdCBkZWJ1ZyA9IGZhbHNlO1xuICAgIGxldCB1c2VySWQ7XG4gICAgLy8gdXNlcklkID0gMTM0ODA0O1xuXG4gICAgZnVuY3Rpb24gbG9hZFRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAke2FwaVVSTH0vdHJhbnNsYXRlcy8ke2xvY2FsZX1gKS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgICAgICAgICAgaTE4bkRhdGEgPSBqc29uO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2hlZWwnKSwge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10cmFuc2xhdGVdJylcbiAgICAgICAgaWYgKGVsZW1zICYmIGVsZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgZWxlbXMuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IGkxOG5EYXRhW2tleV0gfHwgJyotLS0tTkVFRCBUTyBCRSBUUkFOU0xBVEVELS0tLSogICBrZXk6ICAnICsga2V5O1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSAnZW4nKSB7XG4gICAgICAgICAgICBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdlbicpO1xuICAgICAgICB9XG4gICAgICAgIHJlZnJlc2hMb2NhbGl6ZWRDbGFzcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZnJlc2hMb2NhbGl6ZWRDbGFzcyhlbGVtZW50LCBiYXNlQ3NzQ2xhc3MpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBsYW5nIG9mIFsndWsnLCAnZW4nXSkge1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGJhc2VDc3NDbGFzcyArIGxhbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChiYXNlQ3NzQ2xhc3MgKyBsb2NhbGUpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcXVlc3QgPSBmdW5jdGlvbiAobGluaywgZXh0cmFPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChhcGlVUkwgKyBsaW5rLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4uKGV4dHJhT3B0aW9ucyB8fCB7fSlcbiAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuc3RvcmUpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHdpbmRvdy5zdG9yZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgICAgdXNlcklkID0gc3RhdGUuYXV0aC5pc0F1dGhvcml6ZWQgJiYgc3RhdGUuYXV0aC5pZCB8fCAnJztcbiAgICAgICAgICAgIHNldHVwUGFnZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0dXBQYWdlKCk7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICB2YXIgaSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYyA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXdpbmRvdy5nX3VzZXJfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IHdpbmRvdy5nX3VzZXJfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR1cFBhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG5cbiAgICAgICAgcGFydGljaXBhdGVCdG5zLmZvckVhY2goKGF1dGhCdG4sIGkpID0+IHtcbiAgICAgICAgICAgIGF1dGhCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBwYXJ0aWNpcGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwUGFnZSgpIHt9XG5cbiAgICBmdW5jdGlvbiBwYXJ0aWNpcGF0ZSgpIHtcbiAgICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHt1c2VyaWQ6IHVzZXJJZH07XG4gICAgICAgIHJlcXVlc3QoJy91c2VyJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXMpXG4gICAgICAgIH0pLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgIHBhcnRpY2lwYXRlQnRucy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKCdoaWRlJykpO1xuICAgICAgICAgICAgd2hlZWxXcmFwLmNsYXNzTGlzdC5yZW1vdmUoJ19zaWduJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJfc2lnblwiKTtcbiAgICAgICAgICAgIHNldHVwUGFnZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG4gICAgZnVuY3Rpb24gY2hlY2tVc2VyQXV0aChza2lwUG9wdXAgPSBmYWxzZSkge1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgICB1bmF1dGhNc2dzLmZvckVhY2gobXNnID0+IG1zZy5jbGFzc0xpc3QuYWRkKCdoaWRlJykpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QoYC9mYXZ1c2VyLyR7dXNlcklkfT9ub2NhY2hlPTFgKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMudXNlcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNpcGF0ZUJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlkZScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QucmVtb3ZlKCdfc2lnbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcm9ncmVzc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiX3NpZ25cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCS0ZbQtNC+0LHRgNCw0LbQtdC90L3RjyDRltC90YTQvtGA0LzQsNGG0ZbRlyDQutC+0YDQuNGB0YLRg9Cy0LDRh9CwXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoVXNlckluZm8ocmVzLCBza2lwUG9wdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheVVzZXJTcGlucyhyZXMuc3BpbnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhdGVCdG5zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnRpY2lwYXRlQnRucy5mb3JFYWNoKGJ0biA9PiBidG4uY2xhc3NMaXN0LmFkZCgnaGlkZScpKTtcbiAgICAgICAgICAgIHVuYXV0aE1zZ3MuZm9yRWFjaChtc2cgPT4gbXNnLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNwbGF5VXNlclNwaW5zKHNwaW5zLCBza2lwUG9wdXAgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBoZWFkRHJvcEl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50LWl0ZW0uaGVhZC1kcm9wJyk7XG4gICAgICAgIGNvbnN0IG5vU3Bpbkl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50LWl0ZW0ubm8tc3BpbnMnKTtcblxuICAgICAgICBpZiAoIXNwaW5zIHx8IHNwaW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgaGVhZERyb3BJdGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgIG5vU3Bpbkl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0J/RgNC+0L/Rg9GB0LrQsNGU0LzQviDQv9C+0LrQsNC3INC/0L7Qv9Cw0L/Rgywg0Y/QutGJ0L4gc2tpcFBvcHVwINC00L7RgNGW0LLQvdGO0ZQgdHJ1ZVxuICAgICAgICBpZiAoc2tpcFBvcHVwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzcGluc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRlbnQtd3JhcCcpO1xuICAgICAgICBzcGluc0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBoZWFkRHJvcEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICBub1NwaW5JdGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcblxuICAgICAgICBzcGlucy5mb3JFYWNoKHNwaW4gPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3BpbkRhdGUgPSBuZXcgRGF0ZShzcGluLmRhdGUpO1xuICAgICAgICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IHNwaW5EYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygndWEtVUEnKTtcbiAgICAgICAgICAgIGNvbnN0IHNwaW5OYW1lID0gdHJhbnNsYXRlS2V5KHNwaW4ubmFtZSkgfHwgJyc7XG5cbiAgICAgICAgICAgIGNvbnN0IHNwaW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBzcGluRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY2NvcmRpb25fX2NvbnRlbnQtaXRlbScpO1xuXG4gICAgICAgICAgICBzcGluRWxlbWVudC5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNvbnRlbnQtZGF0ZVwiPiR7Zm9ybWF0dGVkRGF0ZX08L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNvbnRlbnQtcHJpemVcIj4ke3NwaW5OYW1lfTwvc3Bhbj5cbiAgICAgICAgYDtcblxuICAgICAgICAgICAgc3BpbnNDb250YWluZXIuYXBwZW5kQ2hpbGQoc3BpbkVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVLZXkoa2V5KSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGkxOG5EYXRhW2tleV0gfHwgJyotLS0tTkVFRCBUTyBCRSBUUkFOU0xBVEVELS0tLSogICBrZXk6ICAnICsga2V5O1xuICAgIH1cblxuICAgIGxvYWRUcmFuc2xhdGlvbnMoKVxuICAgICAgICAudGhlbihpbml0KTtcblxuICAgIGxldCBtYWluUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXYtcGFnZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnb3ZlcmZsb3cnKSwgMTAwMCk7XG5cblxuICAgIGxldCBpID0gMTtcbiAgICBmdW5jdGlvbiBzZW5kU3BpblJlcXVlc3QoKSB7XG4gICAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVidWcpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgIG51bWJlcjogJ3Jlc3BpbicsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3Rlc3QnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHt1c2VyaWQ6IHVzZXJJZH07XG4gICAgICAgIHJldHVybiByZXF1ZXN0KCcvc3BpbicsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGFyYW1zKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvL0JlZm9yZSBDb2RlXG4gICAgY29uc3QgZGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2hlZWxfX2RheXMtaXRlbVwiKVxuICAgIGNvbnN0IHBvcHVwRGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucG9wdXBfX2RheXMtaXRlbVwiKTtcbiAgICBjb25zdCBwb3B1cERheXNNb2IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRheXNfX2l0ZW1cIik7XG4gICAgbGV0IGN1cnJlbnREYXkgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwiY3VycmVudERheVwiKSA/IE51bWJlcihzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwiY3VycmVudERheVwiKSkgOiAwXG4gICAgY29uc29sZS5sb2coY3VycmVudERheSlcblxuICAgIGZ1bmN0aW9uIHNldERheXMoZGF5cywgY3VycmVudERheSl7XG4gICAgICAgIGRheXMuZm9yRWFjaCgoZGF5LCBpKSA9PntcbiAgICAgICAgICAgICsraVxuICAgICAgICAgICAgZGF5LmNsYXNzTGlzdC50b2dnbGUoXCJuZXh0XCIsIGkgPiBjdXJyZW50RGF5KTtcbiAgICAgICAgICAgIGRheS5jbGFzc0xpc3QudG9nZ2xlKFwicGFzdFwiLCBpIDwgY3VycmVudERheSk7XG4gICAgICAgICAgICBkYXkuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBpID09PSBjdXJyZW50RGF5KTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgZnVuY3Rpb24gZGF5c1JlbWluZChkYXlzLCBjbGFzc0FuaW0pIHtcbiAgICAgICAgbGV0IGRlbGF5ID0gOTAwO1xuICAgICAgICBkYXlzLmZvckVhY2goKGRheSwgaSkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoY2xhc3NBbmltKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGRheS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzQW5pbSksIDEyMDApXG4gICAgICAgICAgICB9LCBkZWxheSAqIGkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gY29uc3QgcmFuZG9tSW50ZXJ2YWwgPSBNYXRoLnJhbmRvbSgpICogKDYwMDAgLSA0MDAwKSArIDQwMDA7XG4gICAgZnVuY3Rpb24gYWRkRmlyZXdvcmtzKGNvbnRhaW5lclNlbGVjdG9yLCBudW1iZXJPZkZpcmV3b3Jrcykge1xuICAgICAgICBjb25zdCBmaXJld29ya3NXcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGZpcmV3b3Jrc1dyYXAuY2xhc3NOYW1lID0gJ2ZpcmV3b3Jrcy13cmFwJztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZkZpcmV3b3JrczsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJld29yayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZmlyZXdvcmsuY2xhc3NOYW1lID0gJ2ZpcmV3b3JrJztcbiAgICAgICAgICAgIGZpcmV3b3Jrc1dyYXAuYXBwZW5kQ2hpbGQoZmlyZXdvcmspO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyU2VsZWN0b3IpO1xuICAgICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZmlyZXdvcmtzV3JhcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGDQmtC+0L3RgtC10LnQvdC10YAg0Lcg0YHQtdC70LXQutGC0L7RgNC+0LwgXCIke2NvbnRhaW5lclNlbGVjdG9yfVwiINC90LUg0LfQvdCw0LnQtNC10L3Qvi5gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW1vdmVGaXJld29ya3MoY29udGFpbmVyU2VsZWN0b3IpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXJTZWxlY3Rvcik7XG4gICAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcmV3b3Jrc1dyYXAgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmZpcmV3b3Jrcy13cmFwJyk7XG4gICAgICAgICAgICBpZiAoZmlyZXdvcmtzV3JhcCkge1xuICAgICAgICAgICAgICAgIGZpcmV3b3Jrc1dyYXAucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGDQmtC+0L3RgtC10LnQvdC10YAg0Lcg0YHQtdC70LXQutGC0L7RgNC+0LwgXCIke2NvbnRhaW5lclNlbGVjdG9yfVwiINC90LUg0LfQvdCw0LnQtNC10L3Qvi5gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzdGFydFJhbmRvbUludGVydmFsKCkge1xuICAgICAgICBjb25zdCByYW5kb21JbnRlcnZhbCA9IE1hdGgucmFuZG9tKCkgKiAoMjAwMDAgLSAxMDAwMCkgKyAxMDAwMDsgLy8g0JLQuNC/0LDQtNC60L7QstC40Lkg0ZbQvdGC0LXRgNCy0LDQuyDQvNGW0LYgMTAg0ZYgMjAg0YHQtdC60YPQvdC00LDQvNC4XG4gICAgICAgIGRheXNSZW1pbmQoZGF5cywgXCJyZW1pbmRcIik7XG4gICAgICAgIGRheXNSZW1pbmQocG9wdXBEYXlzLCBcInJlbWluZFwiKTtcbiAgICAgICAgZGF5c1JlbWluZChwb3B1cERheXNNb2IsIFwicmVtaW5kXCIpO1xuICAgICAgICBzZXRUaW1lb3V0KHN0YXJ0UmFuZG9tSW50ZXJ2YWwsIHJhbmRvbUludGVydmFsKTtcbiAgICB9XG4gICAgc3RhcnRSYW5kb21JbnRlcnZhbCgpO1xuICAgIGRheXNSZW1pbmQoZGF5cywgXCJyZW1pbmRcIilcbiAgICBzZXREYXlzKGRheXMsIGN1cnJlbnREYXkpXG4gICAgc2V0RGF5cyhwb3B1cERheXMsIGN1cnJlbnREYXkpXG4gICAgc2V0RGF5cyhwb3B1cERheXNNb2IsIGN1cnJlbnREYXkpXG5cbi8vLyB3aGVlbCBsb2dpY1xuICAgIGNvbnN0IHdoZWVsU2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndoZWVsX19zZWN0aW9uc1wiKSxcbiAgICAgICAgd2hlZWxXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aGVlbF9fd3JhcFwiKSxcbiAgICAgICAgd2hlZWxBcnJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2hlZWxfX2Fycm93XCIpLFxuICAgICAgICB3aGVlbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2hlZWxfX2J0blwiKSxcbiAgICAgICAgc3BpbkJnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zcGluLWJnXCIpLFxuICAgICAgICBzYWx1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlyZXdvcmtzLXdyYXBcIiksXG4gICAgICAgIGJ1YmxlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aGVlbF9fZGF5cy1pY29uc1wiKSxcbiAgICAgICAgd2hlZWxCdWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2hlZWxfX2J1YmxlXCIpLFxuICAgICAgICBwb3B1cENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXBzXCIpLFxuICAgICAgICBwb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXBcIiksXG4gICAgICAgIHBvcHVwQ2xvc2VCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwX19jbG9zZVwiKVxuXG4gICAgYnVibGVCdG4uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCAoZSkgPT57XG4gICAgICAgIHdoZWVsQnVibGUuY2xhc3NMaXN0LnJlbW92ZShcIl9oaWRkZW5cIilcbiAgICB9KVxuICAgIGJ1YmxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCAoZSkgPT57XG4gICAgICAgIHdoZWVsQnVibGUuY2xhc3NMaXN0LmFkZChcIl9oaWRkZW5cIilcbiAgICB9KVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IGUudGFyZ2V0ID09PSBidWJsZUJ0biA/IG51bGwgOiB3aGVlbEJ1YmxlLmNsYXNzTGlzdC5hZGQoXCJfaGlkZGVuXCIpKVxuICAgIGxldCBwcml6ZXMgPSBbJ2lwaG9uZScsICdlY29mbG93JywgJ2ZzOTknLCAnbm90aGluZycsIFwiYm9udXNlc1wiXVxuICAgIGZ1bmN0aW9uIGdldFJhbmRvbVByaXplKGFycikge1xuICAgICAgICByZXR1cm4gYXJyW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHByaXplcy5sZW5ndGgpXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgc2hvd0NsYXNzLCBzdHJlYWtCb251cywgc3BpbkJnLCBjbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwLCBjbGFzc1ByaXplKXtcbiAgICAgICAgLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYXYtcGFnZVwiKS5jbGFzc0xpc3QuYWRkKFwicG9wdXBCZ1wiKVxuICAgICAgICBpZihjbGFzc1ByaXplKXtcbiAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoYCR7Y2xhc3NQcml6ZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZihjbGFzc1ByaXplID09PSBcInJlc3BpblwiKSByZXR1cm5cbiAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZChgJHtzaG93Q2xhc3N9YClcbiAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdfbm90aGluZycpID09PSB0cnVlID8gbnVsbCA6IGFkZEZpcmV3b3JrcyhcIi5wb3B1cHNcIiwgNylcbiAgICAgICAgc3RyZWFrQm9udXMgPyBwb3B1cC5jbGFzc0xpc3QuYWRkKFwiX2RvbmVcIikgOiBwb3B1cC5jbGFzc0xpc3QuYWRkKFwiX2luY29tcGxldGVcIilcbiAgICAgICAgcG9wdXBDb250YWluZXIuY2xhc3NMaXN0LmFkZChcIl9vcGFjaXR5XCIsIFwiX3pJbmRleFwiKVxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIlxuICAgICAgICBzcGluQmcuY2xhc3NMaXN0LnJlbW92ZShcInNob3dTcGluQmdcIilcbiAgICAgICAgY29uc3QgcGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucG9wdXBfX3BlcnNcIilcbiAgICAgICAgY29uc3QgcHJpemUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcHVwX19wcml6ZVwiKVxuICAgICAgICBjb25zdCBidWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucG9wdXBfX2J1YmxlXCIpXG4gICAgICAgIGNvbnN0IHBvcHVwQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucG9wdXBfX21haW5cIilcbiAgICAgICAgY29uc3QgcG9wdXBUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucG9wdXBfX3RpdGxlXCIpXG4gICAgICAgIGNvbnN0IHBvcHVwTGVmdEFycm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb3B1cF9fZGVjb3ItbGVmdFwiKVxuICAgICAgICBjb25zdCBwb3B1cFJpZ2h0QXJyb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcHVwX19kZWNvci1yaWdodFwiKVxuICAgICAgICBzdHJlYWtCb251cyA/IHBvcHVwQm9keS5jbGFzc0xpc3QuYWRkKFwiX2RvbmVcIikgOiBwb3B1cC5jbGFzc0xpc3QuYWRkKFwiX2luY29tcGxldGVcIilcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYXYtcGFnZVwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiYmdTY2FsZVwiKVxuICAgICAgICBmdW5jdGlvbiBhZGRBbmltKGFyciwgY2xhc3NBbmltKXtcbiAgICAgICAgICAgIGFyci5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKGAke2NsYXNzQW5pbX1gKSApXG4gICAgICAgIH1cbiAgICAgICAgLy9wb3B1cCBhbmltYXRpb25zXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT57XG4gICAgICAgICAgICBwb3B1cEJvZHkuY2xhc3NMaXN0LmFkZChcInBvcHVwTWFpbkFuaW1cIilcbiAgICAgICAgICAgIGFkZEFuaW0ocGVycywgXCJwb3B1cFBlcnNBbmltXCIpXG4gICAgICAgICAgICBhZGRBbmltKGJ1YmxlLCBcInBvcHVwQnVibGVBbmltXCIpXG4gICAgICAgIH0sIDEwMClcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+e1xuICAgICAgICAgICAgYWRkQW5pbShwcml6ZSwgXCJwb3B1cFByaXplQW5pbVwiKVxuICAgICAgICAgICAgcG9wdXBUaXRsZS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKFwicG9wdXBUaXRsZUFuaW1cIikpXG5cbiAgICAgICAgfSwgNjAwKVxuICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XG4gICAgICAgICAgICBwb3B1cExlZnRBcnJvdy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKFwicG9wdXBMZWZ0QXJyQW5pbVwiKSlcbiAgICAgICAgICAgIHBvcHVwUmlnaHRBcnJvdy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKFwicG9wdXBSaWdodEFyckFuaW1cIikpXG4gICAgICAgIH0sIDEyMDApXG4gICAgICAgIC8vcG9wdXAgYW5pbWF0aW9uc1xuICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4gICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ19ub3RoaW5nJykgPT09IHRydWUgPyBudWxsIDogYWRkRmlyZXdvcmtzKFwiLndoZWVsXCIsIDcpXG4gICAgICAgICAgICB3aGVlbC5jbGFzc0xpc3QuYWRkKFwiX2xvY2tcIilcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZ3Jlc3NcIikuY2xhc3NMaXN0LmFkZChcIl9sb2NrXCIpXG4gICAgICAgICAgICB3aGVlbC5jbGFzc0xpc3QucmVtb3ZlKFwid2hlZWxTaXplSW5jcmVhc2VcIilcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcImF1dG9cIlxuICAgICAgICAgICAgcG9wdXBDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIl9vcGFjaXR5XCIsIFwiX3pJbmRleFwiKVxuICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZShgJHtzaG93Q2xhc3N9YCwgJ19kb25lJywgJ19pbmNvbXBsZXRlJylcbiAgICAgICAgICAgIHJlbW92ZUZpcmV3b3JrcyhcIi5wb3B1cHNcIik7XG4gICAgICAgIH0sIHtvbmNlOiB0cnVlfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3B1cF9fYnRuJykuZm9yRWFjaChidG4gPT4gYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuY29udGFpbnMoJ19ub3RoaW5nJykgPT09IHRydWUgPyBudWxsIDogYWRkRmlyZXdvcmtzKFwiLndoZWVsXCIsIDcpXG4gICAgICAgICAgICB3aGVlbC5jbGFzc0xpc3QuYWRkKFwiX2xvY2tcIilcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZ3Jlc3NcIikuY2xhc3NMaXN0LmFkZChcIl9sb2NrXCIpXG4gICAgICAgICAgICB3aGVlbC5jbGFzc0xpc3QucmVtb3ZlKFwid2hlZWxTaXplSW5jcmVhc2VcIilcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcImF1dG9cIlxuICAgICAgICAgICAgcG9wdXBDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIl9vcGFjaXR5XCIsIFwiX3pJbmRleFwiKVxuICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LnJlbW92ZShgJHtzaG93Q2xhc3N9YCwgJ19kb25lJywgJ19pbmNvbXBsZXRlJylcbiAgICAgICAgICAgIHJlbW92ZUZpcmV3b3JrcyhcIi5wb3B1cHNcIik7XG4gICAgICAgIH0sIHtvbmNlOiB0cnVlfSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNwaW5XaGVlbChwb3NpdGlvbiwgYW5pbWF0aW9uLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KXtcbiAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PntcbiAgICAgICAgICAgIHNlY3Rpb25zLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoLTUwJSwgLTUwJSkgcm90YXRlKCR7cG9zaXRpb259ZGVnKWBcbiAgICAgICAgICAgIHNlY3Rpb25zLmNsYXNzTGlzdC5yZW1vdmUoYCR7YW5pbWF0aW9ufWApXG4gICAgICAgIH0sIHtvbmNlOiB0cnVlfSlcbiAgICAgICAgc2VjdGlvbnMuY2xhc3NMaXN0LmFkZChgJHthbmltYXRpb259YClcbiAgICAgICAgYXJyb3cuc3R5bGUub3BhY2l0eSA9IFwiMFwiXG4gICAgICAgIHdoZWVsLmNsYXNzTGlzdC5hZGQoXCJ3aGVlbFNpemVJbmNyZWFzZVwiKVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZhdi1wYWdlXCIpLmNsYXNzTGlzdC5hZGQoXCJiZ1NjYWxlXCIpXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VjdG9yLXByaXplXCIpLnN0eWxlLm9wYWNpdHkgPSBcIjFcIlxuICAgICAgICBzcGluQmcuY2xhc3NMaXN0LmFkZChcInNob3dTcGluQmdcIilcbiAgICAgICAgaWYoYW5pbWF0aW9uICE9PSBcInJlc3BpbkFuaW1cIil7XG4gICAgICAgICAgICBidG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGluaXRTcGluKHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgc3BpbkJnLCBzYWx1dCwgcHJpemUsIHN0cmVha0JvbnVzKSB7XG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4gICAgICAgICAgICB3aGVlbEJ0bi5jbGFzc0xpc3QuYWRkKCdfZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgaWYocHJpemUgPT09IFwiaXBob25lXCIpe1xuICAgICAgICAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfaXBob25lXCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTgwMCwgXCJpcGhvbmVQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocHJpemUgPT09IFwiZWNvZmxvd1wiKXtcbiAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2Vjb2Zsb3dcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxNjY1LCBcImVjb2Zsb3dQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocHJpemUgPT09IFwiZnM5OVwiKXtcbiAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2ZzOTlcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxNzExLCBcImZzOTlQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocHJpemUgPT09IFwibm90aGluZ1wiKXtcbiAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKFwiX25vdGhpbmdcIilcbiAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsXCJfbm90aGluZ1wiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4gICAgICAgICAgICAgICAgc3BpbldoZWVsKDE3NTUsIFwibm90aGluZ1ByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihwcml6ZSA9PT0gXCJib251c2VzXCIpe1xuICAgICAgICAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfYm9udXNcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxOTM1LCBcImJvbnVzZXNQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocHJpemUgPT09IFwiZnM3N1wiKXtcbiAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2ZzNzdcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxODQ1LCBcImZzNzdQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocHJpemUgPT09IFwiYm9udXMxMTFcIil7XG4gICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9ib251czExMVwiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4gICAgICAgICAgICAgICAgc3BpbldoZWVsKDE4NDUsIFwiYm9udXMxMTFQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocHJpemUgPT09IFwicmVzcGluXCIpe1xuICAgICAgICAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfYm9udXNcIiwgc3RyZWFrQm9udXMsIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwLCBcInJlc3BpblwiKSwge29uY2U6IHRydWV9KVxuICAgICAgICAgICAgICAgIHNwaW5XaGVlbCg4OS41LCBcInJlc3BpbkFuaW1cIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VuZFNwaW5SZXF1ZXN0KCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgLy8gICAgIGNvbnN0IGF1dGhSZXMgPSBjaGVja1VzZXJBdXRoKHRydWUpO1xuICAgICAgICAgICAgLy8gICAgIGlmKGF1dGhSZXMpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuIGF1dGhSZXMudGhlbigoKSA9PiByZXMpO1xuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgICAgIC8vICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgLy8gICAgICAgICBpZiAoIXJlcyB8fCAhIXJlcy5lcnJvcikge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgd2hlZWxCdG4uY2xhc3NMaXN0LmFkZCgncHVsc2UtYnRuJyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB3aGVlbEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdfZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICBjb25zdCBwcml6ZSA9IHJlcy5udW1iZXI7XG4gICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IHN0cmVha0JvbnVzID0gcmVzLnN0cmVha0JvbnVzIHx8IGRlYnVnO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYocHJpemUgPT09IFwiaXBob25lXCIpe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfaXBob25lXCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTgwMCwgXCJpcGhvbmVQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYocHJpemUgPT09IFwiZWNvZmxvd1wiKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2Vjb2Zsb3dcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxNjY1LCBcImVjb2Zsb3dQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYocHJpemUgPT09IFwiZnM5OVwiKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2ZzOTlcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxNzExLCBcImZzOTlQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYocHJpemUgPT09IFwibm90aGluZ1wiKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKFwiX25vdGhpbmdcIilcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsXCJfbm90aGluZ1wiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgc3BpbldoZWVsKDE3NTUsIFwibm90aGluZ1ByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBpZihwcml6ZSA9PT0gXCJib251c2VzXCIpe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfYm9udXNcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxOTM1LCBcImJvbnVzZXNQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYocHJpemUgPT09IFwiZnM3N1wiKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2ZzNzdcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxNzExLCBcImZzNzdQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCB3aGVlbEJ0biwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImJvbnVzMTExXCIpXG5cbiAgICBmdW5jdGlvbiByZWZyZXNoVXNlckluZm8odXNlckluZm8sIHNraXBQb3B1cCkge1xuICAgICAgICByZWZyZXNoRGFpbHlQb2ludHNTZWN0aW9uKHVzZXJJbmZvKTtcbiAgICAgICAgaWYoIXNraXBQb3B1cCkge1xuICAgICAgICAgICAgcmVmcmVzaFdoZWVsKHVzZXJJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICByZWZyZXNoU3RyZWFrKHVzZXJJbmZvKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoV2hlZWwodXNlckluZm8pIHtcbiAgICAgICAgaWYgKHVzZXJJbmZvLnNwaW5BbGxvd2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXJJbmZvLnBvaW50c1BlckRheSA+PSAxMDApIHtcbiAgICAgICAgICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QuYWRkKCdfbG9jaycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2hlZWxXcmFwLmNsYXNzTGlzdC5hZGQoJ19ibG9jaycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaERhaWx5UG9pbnRzU2VjdGlvbih1c2VySW5mbykge1xuICAgICAgICBjb25zdCBwb2ludHMgPSBNYXRoLm1pbih1c2VySW5mby5wb2ludHNQZXJEYXkgfHwgMCwgMTAwKTtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NTdGF0dXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3NfX2Jhci1zdGF0dXMnKTtcbiAgICAgICAgcHJvZ3Jlc3NTdGF0dXMuaW5uZXJIVE1MID0gcG9pbnRzID8gYCR7cG9pbnRzfSDigrRgIDogXCIgMCDigrRcIjtcbiAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudCcpO1xuICAgICAgICBjdXJyZW50U3Bhbi5pbm5lckhUTUwgPSBgJHtwb2ludHN9YDtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NMaW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2dyZXNzX19iYXItbGluZScpO1xuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHBvaW50cyAvIDEwMC4wICogMTAwO1xuICAgICAgICBwcm9ncmVzc0xpbmUuc3R5bGUud2lkdGggPSBgJHtwcm9ncmVzc30lYDtcblxuICAgICAgICBjb25zdCBsYXN0VXBkYXRlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYmFyLWRhdGEnKTtcbiAgICAgICAgaWYgKGxhc3RVcGRhdGVFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAodXNlckluZm8ubGFzdFVwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RVcGRhdGVEYXRlID0gbmV3IERhdGUodXNlckluZm8ubGFzdFVwZGF0ZSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihsYXN0VXBkYXRlRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF5ID0gU3RyaW5nKGxhc3RVcGRhdGVEYXRlLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSBTdHJpbmcobGFzdFVwZGF0ZURhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHllYXIgPSBsYXN0VXBkYXRlRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBob3VycyA9IFN0cmluZyhsYXN0VXBkYXRlRGF0ZS5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKGxhc3RVcGRhdGVEYXRlLmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWREYXRlVGltZSA9IGAke2RheX0uJHttb250aH0uJHt5ZWFyfS4gJHtob3Vyc306JHttaW51dGVzfWA7XG5cbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnQtZGF0YScpLmlubmVySFRNTCA9IGZvcm1hdHRlZERhdGVUaW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWZyZXNoU3RyZWFrKHVzZXJJbmZvKSB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndoZWVsX19kYXlzLWl0ZW0nKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBsZXQgc3RyZWFrID0gdXNlckluZm8uc3BpbnNTdHJlYWs7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgncGFzdCcpO1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCduZXh0Jyk7XG4gICAgICAgICAgICBpZiAoaSA8IHN0cmVhaykge1xuICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgncGFzdCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ25leHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvcHVwRGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3B1cF9fZGF5cy1pdGVtJyk7XG4gICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBwb3B1cERheXMpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3Bhc3QnKTtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbmV4dCcpO1xuICAgICAgICAgICAgaWYgKGogPCBzdHJlYWspIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3Bhc3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCduZXh0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqKys7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtb2JpbGVEYXlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRheXNfX2l0ZW0nKTtcbiAgICAgICAgbGV0IGsgPSAwO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIG1vYmlsZURheXMpIHtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgncGFzdCcpO1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCduZXh0Jyk7XG4gICAgICAgICAgICBpZiAoayA8IHN0cmVhaykge1xuICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgncGFzdCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ25leHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGsrKztcbiAgICAgICAgfVxuICAgIH1cblxuXG4vLy8vIGFjY29yZGlvblxuICAgIGNvbnN0IGFjY29yZGlvbkhlYWRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uX19oZWFkZXInKTtcbiAgICBhY2NvcmRpb25IZWFkZXJzLmZvckVhY2goaGVhZGVyID0+IHtcbiAgICAgICAgaGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGhlYWRlci5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uX19jb250ZW50JykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPT0gY29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY29udGVudC5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgICAgICAgY29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ29wZW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBmb3IgdGVzdFxuICAgIC8vXG4gICAgY29uc3QgZnM5OSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mczk5LXBvcHVwJylcbiAgICBjb25zdCBpcGhvbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaXBob25lLXBvcHVwJylcbiAgICBjb25zdCBlY29mbG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVjb2Zsb3ctcG9wdXAnKVxuICAgIGNvbnN0IGJvbnVzZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9udXMxMDMtcG9wdXAnKVxuICAgIGNvbnN0IGZzNzcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnM3Ny1wb3B1cCcpXG4gICAgY29uc3QgYm9udXMxMTEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9udXMxMTEtcG9wdXAnKVxuICAgIGNvbnN0IGRvbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZG9uZScpXG4gICAgY29uc3QgZHJvcE5vdGhpbmdCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm90aGluZy1wb3B1cCcpO1xuICAgIGNvbnN0IHJlc3BpbkJ0bj0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3Bpbi1wb3B1cCcpO1xuXG4gICAgY29uc3QgZHJvcExvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9jaycpO1xuICAgIGNvbnN0IGRyb3BTaWduID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpZ24nKTtcbiAgICBjb25zdCBza2lwQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNraXAtYW5pbScpO1xuICAgIGNvbnN0IGxuZ0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sbmctYnRuJyk7XG5cbiAgICB2YXIgc3RyZWFrQm9udXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzdHJlYWtCb251cycpKSB8fCBmYWxzZTtcblxuICAgIGxldCBza2lwQW5pbSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJza2lwXCIpID09PSBcInNraXBcIiA/IHRydWUgOiBmYWxzZVxuXG4gICAgbG5nQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PntcbiAgICAgICAgaWYobG9jYWxlID09PSBcInVrXCIpe1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcImxvY2FsZVwiLCBcImVuXCIpXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmKGxvY2FsZSA9PT0gXCJlblwiKXtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJsb2NhbGVcIiwgXCJ1a1wiKVxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zb2xlLmxvZyhza2lwQW5pbSlcblxuICAgIGlmKHNraXBBbmltKXtcbiAgICAgICAgc2tpcEJ0bi5jbGFzc0xpc3QuYWRkKFwiZ3JlZW5cIilcbiAgICAgICAgc2tpcEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwicmVkXCIpXG4gICAgICAgIHdoZWVsU2VjdGlvbnMuY2xhc3NMaXN0LmFkZChcInNraXBTcGluXCIpXG4gICAgfVxuICAgIGlmKCFza2lwQW5pbSl7XG4gICAgICAgIHNraXBCdG4uY2xhc3NMaXN0LnJlbW92ZShcImdyZWVuXCIpXG4gICAgICAgIHNraXBCdG4uY2xhc3NMaXN0LmFkZChcInJlZFwiKVxuICAgICAgICB3aGVlbFNlY3Rpb25zLmNsYXNzTGlzdC5yZW1vdmUoXCJza2lwU3BpblwiKVxuICAgIH1cblxuICAgIHNraXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PntcbiAgICAgICAgaWYoc2tpcEFuaW0pe1xuICAgICAgICAgICAgc2tpcEJ0bi5jbGFzc0xpc3QuYWRkKFwiZ3JlZW5cIilcbiAgICAgICAgICAgIHNraXBCdG4uY2xhc3NMaXN0LnJlbW92ZShcInJlZFwiKVxuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShcInNraXBcIilcbiAgICAgICAgICAgIHdoZWVsU2VjdGlvbnMuY2xhc3NMaXN0LmFkZChcInNraXBTcGluXCIpXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFwic2tpcFwiKVxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgIH1cbiAgICAgICAgaWYoIXNraXBBbmltKXtcbiAgICAgICAgICAgIHNraXBCdG4uY2xhc3NMaXN0LnJlbW92ZShcImdyZWVuXCIpXG4gICAgICAgICAgICBza2lwQnRuLmNsYXNzTGlzdC5hZGQoXCJyZWRcIilcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJza2lwXCIsIFwic2tpcFwiKVxuICAgICAgICAgICAgd2hlZWxTZWN0aW9ucy5jbGFzc0xpc3QucmVtb3ZlKFwic2tpcFNwaW5cIilcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgICB9XG5cblxuICAgIH0pXG5cblxuICAgIGlmKHN0cmVha0JvbnVzKXtcbiAgICAgICAgZG9uZS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJncmVlblwiXG4gICAgICAgIGN1cnJlbnREYXkgPSAyXG4gICAgfVxuICAgIGlmKCFzdHJlYWtCb251cyl7XG4gICAgICAgIGRvbmUuc3R5bGUuYmFja2dyb3VuZCA9IFwicmVkXCJcbiAgICAgICAgY3VycmVudERheSA9IDBcbiAgICB9XG5cbiAgICBkb25lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHN0cmVha0JvbnVzID0gIXN0cmVha0JvbnVzO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc3RyZWFrQm9udXMnLCBKU09OLnN0cmluZ2lmeShzdHJlYWtCb251cykpO1xuICAgICAgICBzdHJlYWtCb251cyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3N0cmVha0JvbnVzJykpIHx8IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZyhzdHJlYWtCb251cylcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG5cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtdGVzdFwiKS5jbGFzc0xpc3QudG9nZ2xlKFwiX2hpZGRlblwiKVxuICAgIH0pXG5cblxuICAgIGluaXRTcGluKHdoZWVsU2VjdGlvbnMsIGZzOTksIHdoZWVsV3JhcCwgd2hlZWxBcnJvdywgc3BpbkJnLCBzYWx1dCwgXCJmczk5XCIsIHN0cmVha0JvbnVzKVxuICAgIGluaXRTcGluKHdoZWVsU2VjdGlvbnMsIGlwaG9uZSwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImlwaG9uZVwiLCBzdHJlYWtCb251cylcbiAgICBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCBlY29mbG93LCB3aGVlbFdyYXAsIHdoZWVsQXJyb3csIHNwaW5CZywgc2FsdXQsIFwiZWNvZmxvd1wiLCBzdHJlYWtCb251cylcbiAgICBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCBib251c2VzLCB3aGVlbFdyYXAsIHdoZWVsQXJyb3csIHNwaW5CZywgc2FsdXQsIFwiYm9udXNlc1wiLCBzdHJlYWtCb251cylcbiAgICBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCBmczc3LCB3aGVlbFdyYXAsIHdoZWVsQXJyb3csIHNwaW5CZywgc2FsdXQsIFwiZnM3N1wiLCBzdHJlYWtCb251cylcbiAgICBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCBib251czExMSwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImJvbnVzMTExXCIsIHN0cmVha0JvbnVzKVxuICAgIGluaXRTcGluKHdoZWVsU2VjdGlvbnMsIGRyb3BOb3RoaW5nQnV0dG9uLCB3aGVlbFdyYXAsIHdoZWVsQXJyb3csIHNwaW5CZywgc2FsdXQsIFwibm90aGluZ1wiLCBzdHJlYWtCb251cylcbiAgICBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCByZXNwaW5CdG4sIHdoZWVsV3JhcCwgd2hlZWxBcnJvdywgc3BpbkJnLCBzYWx1dCwgXCJyZXNwaW5cIiwgc3RyZWFrQm9udXMpXG5cbiAgICBkcm9wTG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aGVlbFdyYXAuY2xhc3NMaXN0LnRvZ2dsZShcIl9sb2NrXCIpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC50b2dnbGUoXCJfbG9ja1wiKTtcbiAgICAgICAgd2hlZWxXcmFwLmNsYXNzTGlzdC5yZW1vdmUoXCJfc2lnblwiKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcm9ncmVzc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiX3NpZ25cIik7XG4gICAgfSk7XG4gICAgZHJvcFNpZ24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2hlZWxXcmFwLmNsYXNzTGlzdC50b2dnbGUoXCJfc2lnblwiKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcm9ncmVzc1wiKS5jbGFzc0xpc3QudG9nZ2xlKFwiX3NpZ25cIik7XG4gICAgICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QucmVtb3ZlKFwiX2xvY2tcIik7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZ3Jlc3NcIikuY2xhc3NMaXN0LnJlbW92ZShcIl9sb2NrXCIpO1xuICAgIH0pO1xuXG59KSgpO1xuXG5cblxuLy8gYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9Pntcbi8vICAgICBpZihwcml6ZSA9PT0gXCJpcGhvbmVcIil7XG4vLyAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfaXBob25lXCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbi8vICAgICAgICAgc3BpbldoZWVsKDE4MDAsIFwiaXBob25lUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbi8vICAgICB9XG4vLyAgICAgaWYocHJpemUgPT09IFwiZWNvZmxvd1wiKXtcbi8vICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9lY29mbG93XCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbi8vICAgICAgICAgc3BpbldoZWVsKDE2NjUsIFwiZWNvZmxvd1ByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4vLyAgICAgfVxuLy8gICAgIGlmKHByaXplID09PSBcImZzOTlcIil7XG4vLyAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfZnM5OVwiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4vLyAgICAgICAgIHNwaW5XaGVlbCgxNzExLCBcImZzOTlQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuLy8gICAgIH1cbi8vICAgICBpZihwcml6ZSA9PT0gXCJub3RoaW5nXCIpe1xuLy8gICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKFwiX25vdGhpbmdcIilcbi8vICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLFwiX25vdGhpbmdcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuLy8gICAgICAgICBzcGluV2hlZWwoMTc1NSwgXCJub3RoaW5nUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbi8vICAgICB9XG4vLyAgICAgaWYocHJpemUgPT09IFwiYm9udXNlc1wiKXtcbi8vICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9ib251c1wiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4vLyAgICAgICAgIHNwaW5XaGVlbCgxOTM1LCBcImJvbnVzZXNQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuLy8gICAgIH1cbi8vIH0pXG5cbiJdfQ==
