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
  mainPage.parentNode.parentNode.children[0].style.zIndex = '1';
  mainPage.parentNode.parentNode.children[0].style.margin = '0';
  mainPage.parentNode.parentNode.children[0].style.padding = '16px';
  mainPage.parentNode.parentNode.children[0].style.background = 'inherit';
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiYXBpVVJMIiwidW5hdXRoTXNncyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInBhcnRpY2lwYXRlQnRucyIsInJvTGVuZyIsInF1ZXJ5U2VsZWN0b3IiLCJlbkxlbmciLCJsb2NhbGUiLCJzZXNzaW9uU3RvcmFnZSIsImdldEl0ZW0iLCJpMThuRGF0YSIsImRlYnVnIiwidXNlcklkIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwidGhlbiIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwicmVtb3ZlQXR0cmlidXRlIiwibWFpblBhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJyZWZyZXNoTG9jYWxpemVkQ2xhc3MiLCJlbGVtZW50IiwiYmFzZUNzc0NsYXNzIiwibGFuZyIsInJlbW92ZSIsInJlcXVlc3QiLCJsaW5rIiwiZXh0cmFPcHRpb25zIiwiaGVhZGVycyIsImluaXQiLCJ3aW5kb3ciLCJzdG9yZSIsInN0YXRlIiwiZ2V0U3RhdGUiLCJhdXRoIiwiaXNBdXRob3JpemVkIiwiaWQiLCJzZXR1cFBhZ2UiLCJjIiwiaSIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJhdXRoQnRuIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInBhcnRpY2lwYXRlIiwicGFyYW1zIiwidXNlcmlkIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJpdGVtIiwid2hlZWxXcmFwIiwic2tpcFBvcHVwIiwibXNnIiwicmVmcmVzaFVzZXJJbmZvIiwiZGlzcGxheVVzZXJTcGlucyIsInNwaW5zIiwiYnRuIiwiaGVhZERyb3BJdGVtIiwibm9TcGluSXRlbSIsInNwaW5zQ29udGFpbmVyIiwic3BpbiIsInNwaW5EYXRlIiwiRGF0ZSIsImRhdGUiLCJmb3JtYXR0ZWREYXRlIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwic3Bpbk5hbWUiLCJ0cmFuc2xhdGVLZXkiLCJuYW1lIiwic3BpbkVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJwYXJlbnROb2RlIiwiY2hpbGRyZW4iLCJzdHlsZSIsInpJbmRleCIsIm1hcmdpbiIsInBhZGRpbmciLCJiYWNrZ3JvdW5kIiwic2V0VGltZW91dCIsInNlbmRTcGluUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwibnVtYmVyIiwidHlwZSIsImRheXMiLCJwb3B1cERheXMiLCJwb3B1cERheXNNb2IiLCJjdXJyZW50RGF5IiwiTnVtYmVyIiwiY29uc29sZSIsImxvZyIsInNldERheXMiLCJkYXkiLCJ0b2dnbGUiLCJkYXlzUmVtaW5kIiwiY2xhc3NBbmltIiwiZGVsYXkiLCJhZGRGaXJld29ya3MiLCJjb250YWluZXJTZWxlY3RvciIsIm51bWJlck9mRmlyZXdvcmtzIiwiZmlyZXdvcmtzV3JhcCIsImNsYXNzTmFtZSIsImZpcmV3b3JrIiwiY29udGFpbmVyIiwiZXJyb3IiLCJyZW1vdmVGaXJld29ya3MiLCJzdGFydFJhbmRvbUludGVydmFsIiwicmFuZG9tSW50ZXJ2YWwiLCJNYXRoIiwicmFuZG9tIiwid2hlZWxTZWN0aW9ucyIsIndoZWVsQXJyb3ciLCJ3aGVlbEJ0biIsInNwaW5CZyIsInNhbHV0IiwiYnVibGVCdG4iLCJ3aGVlbEJ1YmxlIiwicG9wdXBDb250YWluZXIiLCJwb3B1cCIsInBvcHVwQ2xvc2VCdG4iLCJ0YXJnZXQiLCJwcml6ZXMiLCJnZXRSYW5kb21Qcml6ZSIsImFyciIsImZsb29yIiwic2hvd1BvcHVwIiwic2VjdGlvbnMiLCJ3aGVlbCIsInNob3dDbGFzcyIsInN0cmVha0JvbnVzIiwiY2xvc2VCdG4iLCJjbGFzc1ByaXplIiwiY29udGFpbnMiLCJvdmVyZmxvdyIsInBlcnMiLCJwcml6ZSIsImJ1YmxlIiwicG9wdXBCb2R5IiwicG9wdXBUaXRsZSIsInBvcHVwTGVmdEFycm93IiwicG9wdXBSaWdodEFycm93IiwiYWRkQW5pbSIsIm9uY2UiLCJzcGluV2hlZWwiLCJwb3NpdGlvbiIsImFuaW1hdGlvbiIsImFycm93IiwidHJhbnNmb3JtIiwib3BhY2l0eSIsInBvaW50ZXJFdmVudHMiLCJpbml0U3BpbiIsInVzZXJJbmZvIiwicmVmcmVzaERhaWx5UG9pbnRzU2VjdGlvbiIsInJlZnJlc2hXaGVlbCIsInJlZnJlc2hTdHJlYWsiLCJzcGluQWxsb3dlZCIsInBvaW50c1BlckRheSIsInBvaW50cyIsIm1pbiIsInByb2dyZXNzU3RhdHVzIiwiY3VycmVudFNwYW4iLCJwcm9ncmVzc0xpbmUiLCJwcm9ncmVzcyIsIndpZHRoIiwibGFzdFVwZGF0ZUVsZW1lbnQiLCJsYXN0VXBkYXRlIiwibGFzdFVwZGF0ZURhdGUiLCJpc05hTiIsIlN0cmluZyIsImdldERhdGUiLCJwYWRTdGFydCIsIm1vbnRoIiwiZ2V0TW9udGgiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJob3VycyIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJmb3JtYXR0ZWREYXRlVGltZSIsIml0ZW1zIiwic3RyZWFrIiwic3BpbnNTdHJlYWsiLCJqIiwibW9iaWxlRGF5cyIsImsiLCJhY2NvcmRpb25IZWFkZXJzIiwiaGVhZGVyIiwiY29udGVudCIsIm5leHRFbGVtZW50U2libGluZyIsImRpc3BsYXkiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwiZnM5OSIsImlwaG9uZSIsImVjb2Zsb3ciLCJib251c2VzIiwiZnM3NyIsImJvbnVzMTExIiwiZG9uZSIsImRyb3BOb3RoaW5nQnV0dG9uIiwicmVzcGluQnRuIiwiZHJvcExvY2siLCJkcm9wU2lnbiIsInNraXBCdG4iLCJsbmdCdG4iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsInNraXBBbmltIiwic2V0SXRlbSIsImxvY2F0aW9uIiwicmVsb2FkIiwicmVtb3ZlSXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFlBQVk7RUFDVCxJQUFNQSxNQUFNLEdBQUcsbUNBQW1DO0VBRWxELElBQ0lDLFVBQVUsR0FBR0MsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7SUFDckRDLGVBQWUsR0FBR0YsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7RUFFNUQsSUFBTUUsTUFBTSxHQUFHSCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDaEQsSUFBTUMsTUFBTSxHQUFHTCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFFaEQsSUFBSUUsTUFBTSxHQUFHQyxjQUFjLENBQUNDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBR0QsY0FBYyxDQUFDQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSTtFQUV2RixJQUFJTCxNQUFNLEVBQUVHLE1BQU0sR0FBRyxJQUFJO0VBQ3pCLElBQUlELE1BQU0sRUFBRUMsTUFBTSxHQUFHLElBQUk7RUFHekIsSUFBSUcsUUFBUSxHQUFHLENBQUMsQ0FBQztFQUNqQixJQUFNQyxLQUFLLEdBQUcsS0FBSztFQUNuQixJQUFJQyxNQUFNO0VBQ1Y7O0VBRUEsU0FBU0MsZ0JBQWdCLEdBQUc7SUFDeEIsT0FBT0MsS0FBSyxXQUFJZixNQUFNLHlCQUFlUSxNQUFNLEVBQUcsQ0FBQ1EsSUFBSSxDQUFDLFVBQUFDLEdBQUc7TUFBQSxPQUFJQSxHQUFHLENBQUNDLElBQUksRUFBRTtJQUFBLEVBQUMsQ0FDakVGLElBQUksQ0FBQyxVQUFBRSxJQUFJLEVBQUk7TUFDVlAsUUFBUSxHQUFHTyxJQUFJO01BQ2ZDLFNBQVMsRUFBRTtNQUVYLElBQUlDLGdCQUFnQixHQUFHLElBQUlDLGdCQUFnQixDQUFDLFVBQVVDLFNBQVMsRUFBRTtRQUM3REgsU0FB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LCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFwaVVSTCA9ICdodHRwczovL2Zhdi1wcm9tLmNvbS9hcGlfd2hlZWxfdWEnO1xuXG4gICAgY29uc3RcbiAgICAgICAgdW5hdXRoTXNncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy51bmF1dGgtbXNnJyksXG4gICAgICAgIHBhcnRpY2lwYXRlQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idG4tam9pbicpO1xuXG4gICAgY29uc3Qgcm9MZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvTGVuZycpO1xuICAgIGNvbnN0IGVuTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbkxlbmcnKTtcblxuICAgIGxldCBsb2NhbGUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxlXCIpID8gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcImxvY2FsZVwiKSA6IFwidWtcIlxuXG4gICAgaWYgKHJvTGVuZykgbG9jYWxlID0gJ3VrJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG5cbiAgICBsZXQgaTE4bkRhdGEgPSB7fTtcbiAgICBjb25zdCBkZWJ1ZyA9IGZhbHNlO1xuICAgIGxldCB1c2VySWQ7XG4gICAgLy8gdXNlcklkID0gMTM0ODA0O1xuXG4gICAgZnVuY3Rpb24gbG9hZFRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAke2FwaVVSTH0vdHJhbnNsYXRlcy8ke2xvY2FsZX1gKS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgICAgICAgICAgaTE4bkRhdGEgPSBqc29uO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2hlZWwnKSwge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10cmFuc2xhdGVdJylcbiAgICAgICAgaWYgKGVsZW1zICYmIGVsZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgZWxlbXMuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IGkxOG5EYXRhW2tleV0gfHwgJyotLS0tTkVFRCBUTyBCRSBUUkFOU0xBVEVELS0tLSogICBrZXk6ICAnICsga2V5O1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSAnZW4nKSB7XG4gICAgICAgICAgICBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdlbicpO1xuICAgICAgICB9XG4gICAgICAgIHJlZnJlc2hMb2NhbGl6ZWRDbGFzcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZnJlc2hMb2NhbGl6ZWRDbGFzcyhlbGVtZW50LCBiYXNlQ3NzQ2xhc3MpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBsYW5nIG9mIFsndWsnLCAnZW4nXSkge1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGJhc2VDc3NDbGFzcyArIGxhbmcpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChiYXNlQ3NzQ2xhc3MgKyBsb2NhbGUpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcXVlc3QgPSBmdW5jdGlvbiAobGluaywgZXh0cmFPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChhcGlVUkwgKyBsaW5rLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4uKGV4dHJhT3B0aW9ucyB8fCB7fSlcbiAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuc3RvcmUpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHdpbmRvdy5zdG9yZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgICAgdXNlcklkID0gc3RhdGUuYXV0aC5pc0F1dGhvcml6ZWQgJiYgc3RhdGUuYXV0aC5pZCB8fCAnJztcbiAgICAgICAgICAgIHNldHVwUGFnZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2V0dXBQYWdlKCk7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICB2YXIgaSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYyA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXdpbmRvdy5nX3VzZXJfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IHdpbmRvdy5nX3VzZXJfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR1cFBhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG5cbiAgICAgICAgcGFydGljaXBhdGVCdG5zLmZvckVhY2goKGF1dGhCdG4sIGkpID0+IHtcbiAgICAgICAgICAgIGF1dGhCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBwYXJ0aWNpcGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwUGFnZSgpIHt9XG5cbiAgICBmdW5jdGlvbiBwYXJ0aWNpcGF0ZSgpIHtcbiAgICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHt1c2VyaWQ6IHVzZXJJZH07XG4gICAgICAgIHJlcXVlc3QoJy91c2VyJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXMpXG4gICAgICAgIH0pLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgIHBhcnRpY2lwYXRlQnRucy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuYWRkKCdoaWRlJykpO1xuICAgICAgICAgICAgd2hlZWxXcmFwLmNsYXNzTGlzdC5yZW1vdmUoJ19zaWduJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJfc2lnblwiKTtcbiAgICAgICAgICAgIHNldHVwUGFnZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG4gICAgZnVuY3Rpb24gY2hlY2tVc2VyQXV0aChza2lwUG9wdXAgPSBmYWxzZSkge1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgICB1bmF1dGhNc2dzLmZvckVhY2gobXNnID0+IG1zZy5jbGFzc0xpc3QuYWRkKCdoaWRlJykpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3QoYC9mYXZ1c2VyLyR7dXNlcklkfT9ub2NhY2hlPTFgKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMudXNlcmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNpcGF0ZUJ0bnMuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlkZScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QucmVtb3ZlKCdfc2lnbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcm9ncmVzc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiX3NpZ25cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINCS0ZbQtNC+0LHRgNCw0LbQtdC90L3RjyDRltC90YTQvtGA0LzQsNGG0ZbRlyDQutC+0YDQuNGB0YLRg9Cy0LDRh9CwXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoVXNlckluZm8ocmVzLCBza2lwUG9wdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheVVzZXJTcGlucyhyZXMuc3BpbnMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljaXBhdGVCdG5zLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnRpY2lwYXRlQnRucy5mb3JFYWNoKGJ0biA9PiBidG4uY2xhc3NMaXN0LmFkZCgnaGlkZScpKTtcbiAgICAgICAgICAgIHVuYXV0aE1zZ3MuZm9yRWFjaChtc2cgPT4gbXNnLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNwbGF5VXNlclNwaW5zKHNwaW5zLCBza2lwUG9wdXAgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBoZWFkRHJvcEl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50LWl0ZW0uaGVhZC1kcm9wJyk7XG4gICAgICAgIGNvbnN0IG5vU3Bpbkl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWNjb3JkaW9uX19jb250ZW50LWl0ZW0ubm8tc3BpbnMnKTtcblxuICAgICAgICBpZiAoIXNwaW5zIHx8IHNwaW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgaGVhZERyb3BJdGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgIG5vU3Bpbkl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g0J/RgNC+0L/Rg9GB0LrQsNGU0LzQviDQv9C+0LrQsNC3INC/0L7Qv9Cw0L/Rgywg0Y/QutGJ0L4gc2tpcFBvcHVwINC00L7RgNGW0LLQvdGO0ZQgdHJ1ZVxuICAgICAgICBpZiAoc2tpcFBvcHVwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzcGluc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY2NvcmRpb25fX2NvbnRlbnQtd3JhcCcpO1xuICAgICAgICBzcGluc0NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBoZWFkRHJvcEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICBub1NwaW5JdGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcblxuICAgICAgICBzcGlucy5mb3JFYWNoKHNwaW4gPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3BpbkRhdGUgPSBuZXcgRGF0ZShzcGluLmRhdGUpO1xuICAgICAgICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IHNwaW5EYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygndWEtVUEnKTtcbiAgICAgICAgICAgIGNvbnN0IHNwaW5OYW1lID0gdHJhbnNsYXRlS2V5KHNwaW4ubmFtZSkgfHwgJyc7XG5cbiAgICAgICAgICAgIGNvbnN0IHNwaW5FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBzcGluRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY2NvcmRpb25fX2NvbnRlbnQtaXRlbScpO1xuXG4gICAgICAgICAgICBzcGluRWxlbWVudC5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNvbnRlbnQtZGF0ZVwiPiR7Zm9ybWF0dGVkRGF0ZX08L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNvbnRlbnQtcHJpemVcIj4ke3NwaW5OYW1lfTwvc3Bhbj5cbiAgICAgICAgYDtcblxuICAgICAgICAgICAgc3BpbnNDb250YWluZXIuYXBwZW5kQ2hpbGQoc3BpbkVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVLZXkoa2V5KSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGkxOG5EYXRhW2tleV0gfHwgJyotLS0tTkVFRCBUTyBCRSBUUkFOU0xBVEVELS0tLSogICBrZXk6ICAnICsga2V5O1xuICAgIH1cblxuICAgIGxvYWRUcmFuc2xhdGlvbnMoKVxuICAgICAgICAudGhlbihpbml0KTtcblxuICAgIGxldCBtYWluUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXYtcGFnZScpO1xuICAgIG1haW5QYWdlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblswXS5zdHlsZS56SW5kZXggPSAnMSc7XG4gICAgbWFpblBhZ2UucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNoaWxkcmVuWzBdLnN0eWxlLm1hcmdpbiA9ICcwJztcbiAgICBtYWluUGFnZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bMF0uc3R5bGUucGFkZGluZyA9ICcxNnB4JztcbiAgICBtYWluUGFnZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZCA9ICdpbmhlcml0JztcbiAgICBzZXRUaW1lb3V0KCgpID0+IG1haW5QYWdlLmNsYXNzTGlzdC5hZGQoJ292ZXJmbG93JyksIDEwMDApO1xuXG5cbiAgICBsZXQgaSA9IDE7XG4gICAgZnVuY3Rpb24gc2VuZFNwaW5SZXF1ZXN0KCkge1xuICAgICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlYnVnKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBudW1iZXI6ICdyZXNwaW4nLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXN0J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7dXNlcmlkOiB1c2VySWR9O1xuICAgICAgICByZXR1cm4gcmVxdWVzdCgnL3NwaW4nLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBhcmFtcylcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9CZWZvcmUgQ29kZVxuICAgIGNvbnN0IGRheXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndoZWVsX19kYXlzLWl0ZW1cIilcbiAgICBjb25zdCBwb3B1cERheXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcHVwX19kYXlzLWl0ZW1cIik7XG4gICAgY29uc3QgcG9wdXBEYXlzTW9iID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kYXlzX19pdGVtXCIpO1xuICAgIGxldCBjdXJyZW50RGF5ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcImN1cnJlbnREYXlcIikgPyBOdW1iZXIoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcImN1cnJlbnREYXlcIikpIDogMFxuICAgIGNvbnNvbGUubG9nKGN1cnJlbnREYXkpXG5cbiAgICBmdW5jdGlvbiBzZXREYXlzKGRheXMsIGN1cnJlbnREYXkpe1xuICAgICAgICBkYXlzLmZvckVhY2goKGRheSwgaSkgPT57XG4gICAgICAgICAgICArK2lcbiAgICAgICAgICAgIGRheS5jbGFzc0xpc3QudG9nZ2xlKFwibmV4dFwiLCBpID4gY3VycmVudERheSk7XG4gICAgICAgICAgICBkYXkuY2xhc3NMaXN0LnRvZ2dsZShcInBhc3RcIiwgaSA8IGN1cnJlbnREYXkpO1xuICAgICAgICAgICAgZGF5LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgaSA9PT0gY3VycmVudERheSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIGRheXNSZW1pbmQoZGF5cywgY2xhc3NBbmltKSB7XG4gICAgICAgIGxldCBkZWxheSA9IDkwMDtcbiAgICAgICAgZGF5cy5mb3JFYWNoKChkYXksIGkpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKGNsYXNzQW5pbSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBkYXkuY2xhc3NMaXN0LnJlbW92ZShjbGFzc0FuaW0pLCAxMjAwKVxuICAgICAgICAgICAgfSwgZGVsYXkgKiBpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIGNvbnN0IHJhbmRvbUludGVydmFsID0gTWF0aC5yYW5kb20oKSAqICg2MDAwIC0gNDAwMCkgKyA0MDAwO1xuICAgIGZ1bmN0aW9uIGFkZEZpcmV3b3Jrcyhjb250YWluZXJTZWxlY3RvciwgbnVtYmVyT2ZGaXJld29ya3MpIHtcbiAgICAgICAgY29uc3QgZmlyZXdvcmtzV3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBmaXJld29ya3NXcmFwLmNsYXNzTmFtZSA9ICdmaXJld29ya3Mtd3JhcCc7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZGaXJld29ya3M7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZmlyZXdvcmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGZpcmV3b3JrLmNsYXNzTmFtZSA9ICdmaXJld29yayc7XG4gICAgICAgICAgICBmaXJld29ya3NXcmFwLmFwcGVuZENoaWxkKGZpcmV3b3JrKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lclNlbGVjdG9yKTtcbiAgICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZpcmV3b3Jrc1dyYXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihg0JrQvtC90YLQtdC50L3QtdGAINC3INGB0LXQu9C10LrRgtC+0YDQvtC8IFwiJHtjb250YWluZXJTZWxlY3Rvcn1cIiDQvdC1INC30L3QsNC50LTQtdC90L4uYCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlRmlyZXdvcmtzKGNvbnRhaW5lclNlbGVjdG9yKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyU2VsZWN0b3IpO1xuICAgICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJld29ya3NXcmFwID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5maXJld29ya3Mtd3JhcCcpO1xuICAgICAgICAgICAgaWYgKGZpcmV3b3Jrc1dyYXApIHtcbiAgICAgICAgICAgICAgICBmaXJld29ya3NXcmFwLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihg0JrQvtC90YLQtdC50L3QtdGAINC3INGB0LXQu9C10LrRgtC+0YDQvtC8IFwiJHtjb250YWluZXJTZWxlY3Rvcn1cIiDQvdC1INC30L3QsNC50LTQtdC90L4uYCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RhcnRSYW5kb21JbnRlcnZhbCgpIHtcbiAgICAgICAgY29uc3QgcmFuZG9tSW50ZXJ2YWwgPSBNYXRoLnJhbmRvbSgpICogKDIwMDAwIC0gMTAwMDApICsgMTAwMDA7IC8vINCS0LjQv9Cw0LTQutC+0LLQuNC5INGW0L3RgtC10YDQstCw0Lsg0LzRltC2IDEwINGWIDIwINGB0LXQutGD0L3QtNCw0LzQuFxuICAgICAgICBkYXlzUmVtaW5kKGRheXMsIFwicmVtaW5kXCIpO1xuICAgICAgICBkYXlzUmVtaW5kKHBvcHVwRGF5cywgXCJyZW1pbmRcIik7XG4gICAgICAgIGRheXNSZW1pbmQocG9wdXBEYXlzTW9iLCBcInJlbWluZFwiKTtcbiAgICAgICAgc2V0VGltZW91dChzdGFydFJhbmRvbUludGVydmFsLCByYW5kb21JbnRlcnZhbCk7XG4gICAgfVxuICAgIHN0YXJ0UmFuZG9tSW50ZXJ2YWwoKTtcbiAgICBkYXlzUmVtaW5kKGRheXMsIFwicmVtaW5kXCIpXG4gICAgc2V0RGF5cyhkYXlzLCBjdXJyZW50RGF5KVxuICAgIHNldERheXMocG9wdXBEYXlzLCBjdXJyZW50RGF5KVxuICAgIHNldERheXMocG9wdXBEYXlzTW9iLCBjdXJyZW50RGF5KVxuXG4vLy8gd2hlZWwgbG9naWNcbiAgICBjb25zdCB3aGVlbFNlY3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aGVlbF9fc2VjdGlvbnNcIiksXG4gICAgICAgIHdoZWVsV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2hlZWxfX3dyYXBcIiksXG4gICAgICAgIHdoZWVsQXJyb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndoZWVsX19hcnJvd1wiKSxcbiAgICAgICAgd2hlZWxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndoZWVsX19idG5cIiksXG4gICAgICAgIHNwaW5CZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3Bpbi1iZ1wiKSxcbiAgICAgICAgc2FsdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpcmV3b3Jrcy13cmFwXCIpLFxuICAgICAgICBidWJsZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2hlZWxfX2RheXMtaWNvbnNcIiksXG4gICAgICAgIHdoZWVsQnVibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndoZWVsX19idWJsZVwiKSxcbiAgICAgICAgcG9wdXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwc1wiKSxcbiAgICAgICAgcG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwXCIpLFxuICAgICAgICBwb3B1cENsb3NlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wb3B1cF9fY2xvc2VcIilcblxuICAgIGJ1YmxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKGUpID0+e1xuICAgICAgICB3aGVlbEJ1YmxlLmNsYXNzTGlzdC5yZW1vdmUoXCJfaGlkZGVuXCIpXG4gICAgfSlcbiAgICBidWJsZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKGUpID0+e1xuICAgICAgICB3aGVlbEJ1YmxlLmNsYXNzTGlzdC5hZGQoXCJfaGlkZGVuXCIpXG4gICAgfSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiBlLnRhcmdldCA9PT0gYnVibGVCdG4gPyBudWxsIDogd2hlZWxCdWJsZS5jbGFzc0xpc3QuYWRkKFwiX2hpZGRlblwiKSlcbiAgICBsZXQgcHJpemVzID0gWydpcGhvbmUnLCAnZWNvZmxvdycsICdmczk5JywgJ25vdGhpbmcnLCBcImJvbnVzZXNcIl1cbiAgICBmdW5jdGlvbiBnZXRSYW5kb21Qcml6ZShhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwcml6ZXMubGVuZ3RoKV07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIHNob3dDbGFzcywgc3RyZWFrQm9udXMsIHNwaW5CZywgY2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCwgY2xhc3NQcml6ZSl7XG4gICAgICAgIC8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmF2LXBhZ2VcIikuY2xhc3NMaXN0LmFkZChcInBvcHVwQmdcIilcbiAgICAgICAgaWYoY2xhc3NQcml6ZSl7XG4gICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QuYWRkKGAke2NsYXNzUHJpemV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY2xhc3NQcml6ZSA9PT0gXCJyZXNwaW5cIikgcmV0dXJuXG4gICAgICAgIHBvcHVwLmNsYXNzTGlzdC5hZGQoYCR7c2hvd0NsYXNzfWApXG4gICAgICAgIHBvcHVwLmNsYXNzTGlzdC5jb250YWlucygnX25vdGhpbmcnKSA9PT0gdHJ1ZSA/IG51bGwgOiBhZGRGaXJld29ya3MoXCIucG9wdXBzXCIsIDcpXG4gICAgICAgIHN0cmVha0JvbnVzID8gcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9kb25lXCIpIDogcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9pbmNvbXBsZXRlXCIpXG4gICAgICAgIHBvcHVwQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJfb3BhY2l0eVwiLCBcIl96SW5kZXhcIilcbiAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCJcbiAgICAgICAgc3BpbkJnLmNsYXNzTGlzdC5yZW1vdmUoXCJzaG93U3BpbkJnXCIpXG4gICAgICAgIGNvbnN0IHBlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcHVwX19wZXJzXCIpXG4gICAgICAgIGNvbnN0IHByaXplID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb3B1cF9fcHJpemVcIilcbiAgICAgICAgY29uc3QgYnVibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcHVwX19idWJsZVwiKVxuICAgICAgICBjb25zdCBwb3B1cEJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBvcHVwX19tYWluXCIpXG4gICAgICAgIGNvbnN0IHBvcHVwVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBvcHVwX190aXRsZVwiKVxuICAgICAgICBjb25zdCBwb3B1cExlZnRBcnJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucG9wdXBfX2RlY29yLWxlZnRcIilcbiAgICAgICAgY29uc3QgcG9wdXBSaWdodEFycm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wb3B1cF9fZGVjb3ItcmlnaHRcIilcbiAgICAgICAgc3RyZWFrQm9udXMgPyBwb3B1cEJvZHkuY2xhc3NMaXN0LmFkZChcIl9kb25lXCIpIDogcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9pbmNvbXBsZXRlXCIpXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmF2LXBhZ2VcIikuY2xhc3NMaXN0LnJlbW92ZShcImJnU2NhbGVcIilcbiAgICAgICAgZnVuY3Rpb24gYWRkQW5pbShhcnIsIGNsYXNzQW5pbSl7XG4gICAgICAgICAgICBhcnIuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZChgJHtjbGFzc0FuaW19YCkgKVxuICAgICAgICB9XG4gICAgICAgIC8vcG9wdXAgYW5pbWF0aW9uc1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+e1xuICAgICAgICAgICAgcG9wdXBCb2R5LmNsYXNzTGlzdC5hZGQoXCJwb3B1cE1haW5BbmltXCIpXG4gICAgICAgICAgICBhZGRBbmltKHBlcnMsIFwicG9wdXBQZXJzQW5pbVwiKVxuICAgICAgICAgICAgYWRkQW5pbShidWJsZSwgXCJwb3B1cEJ1YmxlQW5pbVwiKVxuICAgICAgICB9LCAxMDApXG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PntcbiAgICAgICAgICAgIGFkZEFuaW0ocHJpemUsIFwicG9wdXBQcml6ZUFuaW1cIilcbiAgICAgICAgICAgIHBvcHVwVGl0bGUuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZChcInBvcHVwVGl0bGVBbmltXCIpKVxuXG4gICAgICAgIH0sIDYwMClcbiAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgcG9wdXBMZWZ0QXJyb3cuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZChcInBvcHVwTGVmdEFyckFuaW1cIikpXG4gICAgICAgICAgICBwb3B1cFJpZ2h0QXJyb3cuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZChcInBvcHVwUmlnaHRBcnJBbmltXCIpKVxuICAgICAgICB9LCAxMjAwKVxuICAgICAgICAvL3BvcHVwIGFuaW1hdGlvbnNcbiAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xuICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdfbm90aGluZycpID09PSB0cnVlID8gbnVsbCA6IGFkZEZpcmV3b3JrcyhcIi53aGVlbFwiLCA3KVxuICAgICAgICAgICAgd2hlZWwuY2xhc3NMaXN0LmFkZChcIl9sb2NrXCIpXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC5hZGQoXCJfbG9ja1wiKVxuICAgICAgICAgICAgd2hlZWwuY2xhc3NMaXN0LnJlbW92ZShcIndoZWVsU2l6ZUluY3JlYXNlXCIpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCJcbiAgICAgICAgICAgIHBvcHVwQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJfb3BhY2l0eVwiLCBcIl96SW5kZXhcIilcbiAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoYCR7c2hvd0NsYXNzfWAsICdfZG9uZScsICdfaW5jb21wbGV0ZScpXG4gICAgICAgICAgICByZW1vdmVGaXJld29ya3MoXCIucG9wdXBzXCIpO1xuICAgICAgICB9LCB7b25jZTogdHJ1ZX0pO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucG9wdXBfX2J0bicpLmZvckVhY2goYnRuID0+IGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdfbm90aGluZycpID09PSB0cnVlID8gbnVsbCA6IGFkZEZpcmV3b3JrcyhcIi53aGVlbFwiLCA3KVxuICAgICAgICAgICAgd2hlZWwuY2xhc3NMaXN0LmFkZChcIl9sb2NrXCIpXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC5hZGQoXCJfbG9ja1wiKVxuICAgICAgICAgICAgd2hlZWwuY2xhc3NMaXN0LnJlbW92ZShcIndoZWVsU2l6ZUluY3JlYXNlXCIpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCJcbiAgICAgICAgICAgIHBvcHVwQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJfb3BhY2l0eVwiLCBcIl96SW5kZXhcIilcbiAgICAgICAgICAgIHBvcHVwLmNsYXNzTGlzdC5yZW1vdmUoYCR7c2hvd0NsYXNzfWAsICdfZG9uZScsICdfaW5jb21wbGV0ZScpXG4gICAgICAgICAgICByZW1vdmVGaXJld29ya3MoXCIucG9wdXBzXCIpO1xuICAgICAgICB9LCB7b25jZTogdHJ1ZX0pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzcGluV2hlZWwocG9zaXRpb24sIGFuaW1hdGlvbiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dCl7XG4gICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT57XG4gICAgICAgICAgICBzZWN0aW9ucy5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKC01MCUsIC01MCUpIHJvdGF0ZSgke3Bvc2l0aW9ufWRlZylgXG4gICAgICAgICAgICBzZWN0aW9ucy5jbGFzc0xpc3QucmVtb3ZlKGAke2FuaW1hdGlvbn1gKVxuICAgICAgICB9LCB7b25jZTogdHJ1ZX0pXG4gICAgICAgIHNlY3Rpb25zLmNsYXNzTGlzdC5hZGQoYCR7YW5pbWF0aW9ufWApXG4gICAgICAgIGFycm93LnN0eWxlLm9wYWNpdHkgPSBcIjBcIlxuICAgICAgICB3aGVlbC5jbGFzc0xpc3QuYWRkKFwid2hlZWxTaXplSW5jcmVhc2VcIilcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYXYtcGFnZVwiKS5jbGFzc0xpc3QuYWRkKFwiYmdTY2FsZVwiKVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlY3Rvci1wcml6ZVwiKS5zdHlsZS5vcGFjaXR5ID0gXCIxXCJcbiAgICAgICAgc3BpbkJnLmNsYXNzTGlzdC5hZGQoXCJzaG93U3BpbkJnXCIpXG4gICAgICAgIGlmKGFuaW1hdGlvbiAhPT0gXCJyZXNwaW5BbmltXCIpe1xuICAgICAgICAgICAgYnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIlxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBpbml0U3BpbihzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHNwaW5CZywgc2FsdXQsIHByaXplLCBzdHJlYWtCb251cykge1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xuICAgICAgICAgICAgd2hlZWxCdG4uY2xhc3NMaXN0LmFkZCgnX2Rpc2FibGVkJyk7XG5cbiAgICAgICAgICAgIGlmKHByaXplID09PSBcImlwaG9uZVwiKXtcbiAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2lwaG9uZVwiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4gICAgICAgICAgICAgICAgc3BpbldoZWVsKDE4MDAsIFwiaXBob25lUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHByaXplID09PSBcImVjb2Zsb3dcIil7XG4gICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9lY29mbG93XCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTY2NSwgXCJlY29mbG93UHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHByaXplID09PSBcImZzOTlcIil7XG4gICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9mczk5XCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTcxMSwgXCJmczk5UHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHByaXplID09PSBcIm5vdGhpbmdcIil7XG4gICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9ub3RoaW5nXCIpXG4gICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLFwiX25vdGhpbmdcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxNzU1LCBcIm5vdGhpbmdQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYocHJpemUgPT09IFwiYm9udXNlc1wiKXtcbiAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2JvbnVzXCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTkzNSwgXCJib251c2VzUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHByaXplID09PSBcImZzNzdcIil7XG4gICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9mczc3XCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTg0NSwgXCJmczc3UHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHByaXplID09PSBcImJvbnVzMTExXCIpe1xuICAgICAgICAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfYm9udXMxMTFcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxODQ1LCBcImJvbnVzMTExUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHByaXplID09PSBcInJlc3BpblwiKXtcbiAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2JvbnVzXCIsIHN0cmVha0JvbnVzLCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCwgXCJyZXNwaW5cIiksIHtvbmNlOiB0cnVlfSlcbiAgICAgICAgICAgICAgICBzcGluV2hlZWwoODkuNSwgXCJyZXNwaW5BbmltXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlbmRTcGluUmVxdWVzdCgpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgIC8vICAgICBjb25zdCBhdXRoUmVzID0gY2hlY2tVc2VyQXV0aCh0cnVlKTtcbiAgICAgICAgICAgIC8vICAgICBpZihhdXRoUmVzKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIHJldHVybiBhdXRoUmVzLnRoZW4oKCkgPT4gcmVzKTtcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICAvLyAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYgKCFyZXMgfHwgISFyZXMuZXJyb3IpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHdoZWVsQnRuLmNsYXNzTGlzdC5hZGQoJ3B1bHNlLWJ0bicpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgd2hlZWxCdG4uY2xhc3NMaXN0LnJlbW92ZSgnX2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc3QgcHJpemUgPSByZXMubnVtYmVyO1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zdCBzdHJlYWtCb251cyA9IHJlcy5zdHJlYWtCb251cyB8fCBkZWJ1ZztcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmKHByaXplID09PSBcImlwaG9uZVwiKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2lwaG9uZVwiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgc3BpbldoZWVsKDE4MDAsIFwiaXBob25lUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmKHByaXplID09PSBcImVjb2Zsb3dcIil7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9lY29mbG93XCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTY2NSwgXCJlY29mbG93UHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmKHByaXplID09PSBcImZzOTlcIil7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9mczk5XCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTcxMSwgXCJmczk5UHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmKHByaXplID09PSBcIm5vdGhpbmdcIil7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9ub3RoaW5nXCIpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLFwiX25vdGhpbmdcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNwaW5XaGVlbCgxNzU1LCBcIm5vdGhpbmdQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYocHJpemUgPT09IFwiYm9udXNlc1wiKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2JvbnVzXCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTkzNSwgXCJib251c2VzUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmKHByaXplID09PSBcImZzNzdcIil7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgc2VjdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCAoKSA9PiBzaG93UG9wdXAoc2VjdGlvbnMsIHdoZWVsLCBcIl9mczc3XCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBzcGluV2hlZWwoMTcxMSwgXCJmczc3UHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgd2hlZWxCdG4sIHdoZWVsV3JhcCwgd2hlZWxBcnJvdywgc3BpbkJnLCBzYWx1dCwgXCJib251czExMVwiKVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaFVzZXJJbmZvKHVzZXJJbmZvLCBza2lwUG9wdXApIHtcbiAgICAgICAgcmVmcmVzaERhaWx5UG9pbnRzU2VjdGlvbih1c2VySW5mbyk7XG4gICAgICAgIGlmKCFza2lwUG9wdXApIHtcbiAgICAgICAgICAgIHJlZnJlc2hXaGVlbCh1c2VySW5mbyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVmcmVzaFN0cmVhayh1c2VySW5mbyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaFdoZWVsKHVzZXJJbmZvKSB7XG4gICAgICAgIGlmICh1c2VySW5mby5zcGluQWxsb3dlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VySW5mby5wb2ludHNQZXJEYXkgPj0gMTAwKSB7XG4gICAgICAgICAgICB3aGVlbFdyYXAuY2xhc3NMaXN0LmFkZCgnX2xvY2snKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QuYWRkKCdfYmxvY2snKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZnJlc2hEYWlseVBvaW50c1NlY3Rpb24odXNlckluZm8pIHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gTWF0aC5taW4odXNlckluZm8ucG9pbnRzUGVyRGF5IHx8IDAsIDEwMCk7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzU3RhdHVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2dyZXNzX19iYXItc3RhdHVzJyk7XG4gICAgICAgIHByb2dyZXNzU3RhdHVzLmlubmVySFRNTCA9IHBvaW50cyA/IGAke3BvaW50c30g4oK0YCA6IFwiIDAg4oK0XCI7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmN1cnJlbnQnKTtcbiAgICAgICAgY3VycmVudFNwYW4uaW5uZXJIVE1MID0gYCR7cG9pbnRzfWA7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzTGluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYmFyLWxpbmUnKTtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBwb2ludHMgLyAxMDAuMCAqIDEwMDtcbiAgICAgICAgcHJvZ3Jlc3NMaW5lLnN0eWxlLndpZHRoID0gYCR7cHJvZ3Jlc3N9JWA7XG5cbiAgICAgICAgY29uc3QgbGFzdFVwZGF0ZUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3NfX2Jhci1kYXRhJyk7XG4gICAgICAgIGlmIChsYXN0VXBkYXRlRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHVzZXJJbmZvLmxhc3RVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0VXBkYXRlRGF0ZSA9IG5ldyBEYXRlKHVzZXJJbmZvLmxhc3RVcGRhdGUpO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4obGFzdFVwZGF0ZURhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRheSA9IFN0cmluZyhsYXN0VXBkYXRlRGF0ZS5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gU3RyaW5nKGxhc3RVcGRhdGVEYXRlLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gbGFzdFVwZGF0ZURhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaG91cnMgPSBTdHJpbmcobGFzdFVwZGF0ZURhdGUuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWludXRlcyA9IFN0cmluZyhsYXN0VXBkYXRlRGF0ZS5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZVRpbWUgPSBgJHtkYXl9LiR7bW9udGh9LiR7eWVhcn0uICR7aG91cnN9OiR7bWludXRlc31gO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50LWRhdGEnKS5pbm5lckhUTUwgPSBmb3JtYXR0ZWREYXRlVGltZTtcblxuICAgICAgICAgICAgICAgICAgICBsYXN0VXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaFN0cmVhayh1c2VySW5mbykge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53aGVlbF9fZGF5cy1pdGVtJyk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IHN0cmVhayA9IHVzZXJJbmZvLnNwaW5zU3RyZWFrO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3Bhc3QnKTtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbmV4dCcpO1xuICAgICAgICAgICAgaWYgKGkgPCBzdHJlYWspIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3Bhc3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCduZXh0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3B1cERheXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucG9wdXBfX2RheXMtaXRlbScpO1xuICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcG9wdXBEYXlzKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdwYXN0Jyk7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ25leHQnKTtcbiAgICAgICAgICAgIGlmIChqIDwgc3RyZWFrKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdwYXN0Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnbmV4dCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaisrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW9iaWxlRGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kYXlzX19pdGVtJyk7XG4gICAgICAgIGxldCBrID0gMDtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBtb2JpbGVEYXlzKSB7XG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3Bhc3QnKTtcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnbmV4dCcpO1xuICAgICAgICAgICAgaWYgKGsgPCBzdHJlYWspIHtcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3Bhc3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCduZXh0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrKys7XG4gICAgICAgIH1cbiAgICB9XG5cblxuLy8vLyBhY2NvcmRpb25cbiAgICBjb25zdCBhY2NvcmRpb25IZWFkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbl9faGVhZGVyJyk7XG4gICAgYWNjb3JkaW9uSGVhZGVycy5mb3JFYWNoKGhlYWRlciA9PiB7XG4gICAgICAgIGhlYWRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBoZWFkZXIubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbl9fY29udGVudCcpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT09IGNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGNvbnRlbnQuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdvcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gZm9yIHRlc3RcbiAgICAvL1xuICAgIGNvbnN0IGZzOTkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnM5OS1wb3B1cCcpXG4gICAgY29uc3QgaXBob25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmlwaG9uZS1wb3B1cCcpXG4gICAgY29uc3QgZWNvZmxvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lY29mbG93LXBvcHVwJylcbiAgICBjb25zdCBib251c2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvbnVzMTAzLXBvcHVwJylcbiAgICBjb25zdCBmczc3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZzNzctcG9wdXAnKVxuICAgIGNvbnN0IGJvbnVzMTExID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvbnVzMTExLXBvcHVwJylcbiAgICBjb25zdCBkb25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvbmUnKVxuICAgIGNvbnN0IGRyb3BOb3RoaW5nQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGhpbmctcG9wdXAnKTtcbiAgICBjb25zdCByZXNwaW5CdG49IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXNwaW4tcG9wdXAnKTtcblxuICAgIGNvbnN0IGRyb3BMb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvY2snKTtcbiAgICBjb25zdCBkcm9wU2lnbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaWduJyk7XG4gICAgY29uc3Qgc2tpcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5za2lwLWFuaW0nKTtcbiAgICBjb25zdCBsbmdCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG5nLWJ0bicpO1xuXG4gICAgdmFyIHN0cmVha0JvbnVzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc3RyZWFrQm9udXMnKSkgfHwgZmFsc2U7XG5cbiAgICBsZXQgc2tpcEFuaW0gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwic2tpcFwiKSA9PT0gXCJza2lwXCIgPyB0cnVlIDogZmFsc2VcblxuICAgIGxuZ0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4gICAgICAgIGlmKGxvY2FsZSA9PT0gXCJ1a1wiKXtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJsb2NhbGVcIiwgXCJlblwiKVxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZihsb2NhbGUgPT09IFwiZW5cIil7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwibG9jYWxlXCIsIFwidWtcIilcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc29sZS5sb2coc2tpcEFuaW0pXG5cbiAgICBpZihza2lwQW5pbSl7XG4gICAgICAgIHNraXBCdG4uY2xhc3NMaXN0LmFkZChcImdyZWVuXCIpXG4gICAgICAgIHNraXBCdG4uY2xhc3NMaXN0LnJlbW92ZShcInJlZFwiKVxuICAgICAgICB3aGVlbFNlY3Rpb25zLmNsYXNzTGlzdC5hZGQoXCJza2lwU3BpblwiKVxuICAgIH1cbiAgICBpZighc2tpcEFuaW0pe1xuICAgICAgICBza2lwQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJncmVlblwiKVxuICAgICAgICBza2lwQnRuLmNsYXNzTGlzdC5hZGQoXCJyZWRcIilcbiAgICAgICAgd2hlZWxTZWN0aW9ucy5jbGFzc0xpc3QucmVtb3ZlKFwic2tpcFNwaW5cIilcbiAgICB9XG5cbiAgICBza2lwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT57XG4gICAgICAgIGlmKHNraXBBbmltKXtcbiAgICAgICAgICAgIHNraXBCdG4uY2xhc3NMaXN0LmFkZChcImdyZWVuXCIpXG4gICAgICAgICAgICBza2lwQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJyZWRcIilcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oXCJza2lwXCIpXG4gICAgICAgICAgICB3aGVlbFNlY3Rpb25zLmNsYXNzTGlzdC5hZGQoXCJza2lwU3BpblwiKVxuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShcInNraXBcIilcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgICB9XG4gICAgICAgIGlmKCFza2lwQW5pbSl7XG4gICAgICAgICAgICBza2lwQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJncmVlblwiKVxuICAgICAgICAgICAgc2tpcEJ0bi5jbGFzc0xpc3QuYWRkKFwicmVkXCIpXG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwic2tpcFwiLCBcInNraXBcIilcbiAgICAgICAgICAgIHdoZWVsU2VjdGlvbnMuY2xhc3NMaXN0LnJlbW92ZShcInNraXBTcGluXCIpXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgfVxuXG5cbiAgICB9KVxuXG5cbiAgICBpZihzdHJlYWtCb251cyl7XG4gICAgICAgIGRvbmUuc3R5bGUuYmFja2dyb3VuZCA9IFwiZ3JlZW5cIlxuICAgICAgICBjdXJyZW50RGF5ID0gMlxuICAgIH1cbiAgICBpZighc3RyZWFrQm9udXMpe1xuICAgICAgICBkb25lLnN0eWxlLmJhY2tncm91bmQgPSBcInJlZFwiXG4gICAgICAgIGN1cnJlbnREYXkgPSAwXG4gICAgfVxuXG4gICAgZG9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBzdHJlYWtCb251cyA9ICFzdHJlYWtCb251cztcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3N0cmVha0JvbnVzJywgSlNPTi5zdHJpbmdpZnkoc3RyZWFrQm9udXMpKTtcbiAgICAgICAgc3RyZWFrQm9udXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzdHJlYWtCb251cycpKSB8fCBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coc3RyZWFrQm9udXMpXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuXG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PntcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LXRlc3RcIikuY2xhc3NMaXN0LnRvZ2dsZShcIl9oaWRkZW5cIilcbiAgICB9KVxuXG5cbiAgICBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCBmczk5LCB3aGVlbFdyYXAsIHdoZWVsQXJyb3csIHNwaW5CZywgc2FsdXQsIFwiZnM5OVwiLCBzdHJlYWtCb251cylcbiAgICBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCBpcGhvbmUsIHdoZWVsV3JhcCwgd2hlZWxBcnJvdywgc3BpbkJnLCBzYWx1dCwgXCJpcGhvbmVcIiwgc3RyZWFrQm9udXMpXG4gICAgaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgZWNvZmxvdywgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImVjb2Zsb3dcIiwgc3RyZWFrQm9udXMpXG4gICAgaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgYm9udXNlcywgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImJvbnVzZXNcIiwgc3RyZWFrQm9udXMpXG4gICAgaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgZnM3Nywgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcImZzNzdcIiwgc3RyZWFrQm9udXMpXG4gICAgaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgYm9udXMxMTEsIHdoZWVsV3JhcCwgd2hlZWxBcnJvdywgc3BpbkJnLCBzYWx1dCwgXCJib251czExMVwiLCBzdHJlYWtCb251cylcbiAgICBpbml0U3Bpbih3aGVlbFNlY3Rpb25zLCBkcm9wTm90aGluZ0J1dHRvbiwgd2hlZWxXcmFwLCB3aGVlbEFycm93LCBzcGluQmcsIHNhbHV0LCBcIm5vdGhpbmdcIiwgc3RyZWFrQm9udXMpXG4gICAgaW5pdFNwaW4od2hlZWxTZWN0aW9ucywgcmVzcGluQnRuLCB3aGVlbFdyYXAsIHdoZWVsQXJyb3csIHNwaW5CZywgc2FsdXQsIFwicmVzcGluXCIsIHN0cmVha0JvbnVzKVxuXG4gICAgZHJvcExvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2hlZWxXcmFwLmNsYXNzTGlzdC50b2dnbGUoXCJfbG9ja1wiKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wcm9ncmVzc1wiKS5jbGFzc0xpc3QudG9nZ2xlKFwiX2xvY2tcIik7XG4gICAgICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QucmVtb3ZlKFwiX3NpZ25cIik7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZ3Jlc3NcIikuY2xhc3NMaXN0LnJlbW92ZShcIl9zaWduXCIpO1xuICAgIH0pO1xuICAgIGRyb3BTaWduLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdoZWVsV3JhcC5jbGFzc0xpc3QudG9nZ2xlKFwiX3NpZ25cIik7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvZ3Jlc3NcIikuY2xhc3NMaXN0LnRvZ2dsZShcIl9zaWduXCIpO1xuICAgICAgICB3aGVlbFdyYXAuY2xhc3NMaXN0LnJlbW92ZShcIl9sb2NrXCIpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnByb2dyZXNzXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJfbG9ja1wiKTtcbiAgICB9KTtcblxufSkoKTtcblxuXG5cbi8vIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4vLyAgICAgaWYocHJpemUgPT09IFwiaXBob25lXCIpe1xuLy8gICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2lwaG9uZVwiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4vLyAgICAgICAgIHNwaW5XaGVlbCgxODAwLCBcImlwaG9uZVByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4vLyAgICAgfVxuLy8gICAgIGlmKHByaXplID09PSBcImVjb2Zsb3dcIil7XG4vLyAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfZWNvZmxvd1wiLCBjdXJyZW50RGF5LCBzcGluQmcsIHBvcHVwQ2xvc2VCdG4sIHBvcHVwQ29udGFpbmVyLCBwb3B1cCkpXG4vLyAgICAgICAgIHNwaW5XaGVlbCgxNjY1LCBcImVjb2Zsb3dQcml6ZVwiLCBzZWN0aW9ucywgYnRuLCB3aGVlbCwgYXJyb3csIHByaXplLCBzcGluQmcsIHNhbHV0KVxuLy8gICAgIH1cbi8vICAgICBpZihwcml6ZSA9PT0gXCJmczk5XCIpe1xuLy8gICAgICAgICBzZWN0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsICgpID0+IHNob3dQb3B1cChzZWN0aW9ucywgd2hlZWwsIFwiX2ZzOTlcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuLy8gICAgICAgICBzcGluV2hlZWwoMTcxMSwgXCJmczk5UHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbi8vICAgICB9XG4vLyAgICAgaWYocHJpemUgPT09IFwibm90aGluZ1wiKXtcbi8vICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZChcIl9ub3RoaW5nXCIpXG4vLyAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCxcIl9ub3RoaW5nXCIsIGN1cnJlbnREYXksIHNwaW5CZywgcG9wdXBDbG9zZUJ0biwgcG9wdXBDb250YWluZXIsIHBvcHVwKSlcbi8vICAgICAgICAgc3BpbldoZWVsKDE3NTUsIFwibm90aGluZ1ByaXplXCIsIHNlY3Rpb25zLCBidG4sIHdoZWVsLCBhcnJvdywgcHJpemUsIHNwaW5CZywgc2FsdXQpXG4vLyAgICAgfVxuLy8gICAgIGlmKHByaXplID09PSBcImJvbnVzZXNcIil7XG4vLyAgICAgICAgIHNlY3Rpb25zLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgKCkgPT4gc2hvd1BvcHVwKHNlY3Rpb25zLCB3aGVlbCwgXCJfYm9udXNcIiwgY3VycmVudERheSwgc3BpbkJnLCBwb3B1cENsb3NlQnRuLCBwb3B1cENvbnRhaW5lciwgcG9wdXApKVxuLy8gICAgICAgICBzcGluV2hlZWwoMTkzNSwgXCJib251c2VzUHJpemVcIiwgc2VjdGlvbnMsIGJ0biwgd2hlZWwsIGFycm93LCBwcml6ZSwgc3BpbkJnLCBzYWx1dClcbi8vICAgICB9XG4vLyB9KVxuXG4iXX0=
