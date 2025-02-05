(function () {
    const apiURL = 'https://fav-prom.com/api_wheel_ua';

    const
        unauthMsgs = document.querySelectorAll('.unauth-msg'),
        participateBtns = document.querySelectorAll('.btn-join');

    const roLeng = document.querySelector('#roLeng');
    const enLeng = document.querySelector('#enLeng');

    let locale = sessionStorage.getItem("locale") ? sessionStorage.getItem("locale") : "uk"

    if (roLeng) locale = 'uk';
    if (enLeng) locale = 'en';


    let i18nData = {};
    const debug = false;
    let userId;
    // userId = 134804;

    function loadTranslations() {
        return fetch(`${apiURL}/translates/${locale}`).then(res => res.json())
            .then(json => {
                i18nData = json;
                translate();

                var mutationObserver = new MutationObserver(function (mutations) {
                    translate();
                });
                mutationObserver.observe(document.getElementById('wheel'), {
                    childList: true,
                    subtree: true,
                });

            });
    }

    function translate() {
        const elems = document.querySelectorAll('[data-translate]')
        if (elems && elems.length) {
            elems.forEach(elem => {
                const key = elem.getAttribute('data-translate');
                elem.innerHTML = i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
                elem.removeAttribute('data-translate');
            })
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
        for (const lang of ['uk', 'en']) {
            element.classList.remove(baseCssClass + lang);
        }
        element.classList.add(baseCssClass + locale);
    }

    const request = function (link, extraOptions) {
        return fetch(apiURL + link, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...(extraOptions || {})
        }).then(res => res.json())
    }


    function init() {
        if (window.store) {
            var state = window.store.getState();
            userId = state.auth.isAuthorized && state.auth.id || '';
            setupPage();
        } else {
            setupPage();
            let c = 0;
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

        participateBtns.forEach((authBtn, i) => {
            authBtn.addEventListener('click', (e) => {
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

        const params = {userid: userId};
        request('/user', {
            method: 'POST',
            body: JSON.stringify(params)
        }).then(res => {
            participateBtns.forEach(item => item.classList.add('hide'));
            wheelWrap.classList.remove('_sign');
            document.querySelector(".progress").classList.remove("_sign");
            setupPage();
        });
    }



    function checkUserAuth(skipPopup = false) {
        if (userId) {
            unauthMsgs.forEach(msg => msg.classList.add('hide'));
            return request(`/favuser/${userId}?nocache=1`)
                .then(res => {
                    if (res.userid) {
                        participateBtns.forEach(item => item.classList.add('hide'));
                        wheelWrap.classList.remove('_sign');
                        document.querySelector(".progress").classList.remove("_sign");

                        // Відображення інформації користувача
                        refreshUserInfo(res, skipPopup);
                        displayUserSpins(res.spins);
                    } else {
                        participateBtns.forEach(item => item.classList.remove('hide'));
                    }
                });
        } else {
            participateBtns.forEach(btn => btn.classList.add('hide'));
            unauthMsgs.forEach(msg => msg.classList.remove('hide'));
        }
    }

    function displayUserSpins(spins, skipPopup = false) {
        const headDropItem = document.querySelector('.accordion__content-item.head-drop');
        const noSpinItem = document.querySelector('.accordion__content-item.no-spins');

        if (!spins || spins.length === 0) {
            headDropItem.classList.add('hide');
            noSpinItem.classList.remove('hide');
            return;
        }

        // Пропускаємо показ попапу, якщо skipPopup дорівнює true
        if (skipPopup) {
            return;
        }

        const spinsContainer = document.querySelector('.accordion__content-wrap');
        spinsContainer.innerHTML = '';

        headDropItem.classList.remove('hide');
        noSpinItem.classList.add('hide');

        spins.forEach(spin => {
            const spinDate = new Date(spin.date);
            const formattedDate = spinDate.toLocaleDateString('ua-UA');
            const spinName = translateKey(spin.name) || '';

            const spinElement = document.createElement('div');
            spinElement.classList.add('accordion__content-item');

            spinElement.innerHTML = `
            <span class="content-date">${formattedDate}</span>
            <span class="content-prize">${spinName}</span>
        `;

            spinsContainer.appendChild(spinElement);
        });
    }

    function translateKey(key) {
        if (!key) {
            return;
        }
        return i18nData[key] || '*----NEED TO BE TRANSLATED----*   key:  ' + key;
    }

    loadTranslations()
        .then(init);

    let mainPage = document.querySelector('.fav-page');
    mainPage.parentNode.parentNode.children[0].style.zIndex = '1';
    mainPage.parentNode.parentNode.children[0].style.margin = '0';
    mainPage.parentNode.parentNode.children[0].style.padding = '16px';
    mainPage.parentNode.parentNode.children[0].style.background = 'inherit';
    setTimeout(() => mainPage.classList.add('overflow'), 1000);


    let i = 1;
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

        const params = {userid: userId};
        return request('/spin', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    //Before Code
    const days = document.querySelectorAll(".wheel__days-item")
    const popupDays = document.querySelectorAll(".popup__days-item");
    const popupDaysMob = document.querySelectorAll(".days__item");
    let currentDay = sessionStorage.getItem("currentDay") ? Number(sessionStorage.getItem("currentDay")) : 0
    console.log(currentDay)

    function setDays(days, currentDay){
        days.forEach((day, i) =>{
            ++i
            day.classList.toggle("next", i > currentDay);
            day.classList.toggle("past", i < currentDay);
            day.classList.toggle("active", i === currentDay);
        })
    }
    function daysRemind(days, classAnim) {
        let delay = 900;
        days.forEach((day, i) => {
            setTimeout(() => {
                day.classList.add(classAnim);
                setTimeout(() => day.classList.remove(classAnim), 1200)
            }, delay * i);
        });
    }
    // const randomInterval = Math.random() * (6000 - 4000) + 4000;
    function addFireworks(containerSelector, numberOfFireworks) {
        const fireworksWrap = document.createElement('div');
        fireworksWrap.className = 'fireworks-wrap';
        for (let i = 0; i < numberOfFireworks; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework';
            fireworksWrap.appendChild(firework);
        }
        const container = document.querySelector(containerSelector);
        if (container) {
            container.appendChild(fireworksWrap);
        } else {
            console.error(`Контейнер з селектором "${containerSelector}" не знайдено.`);
        }
    }
    function removeFireworks(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (container) {
            const fireworksWrap = container.querySelector('.fireworks-wrap');
            if (fireworksWrap) {
                fireworksWrap.remove();
            }
        } else {
            console.error(`Контейнер з селектором "${containerSelector}" не знайдено.`);
        }
    }
    function startRandomInterval() {
        const randomInterval = Math.random() * (20000 - 10000) + 10000; // Випадковий інтервал між 10 і 20 секундами
        daysRemind(days, "remind");
        daysRemind(popupDays, "remind");
        daysRemind(popupDaysMob, "remind");
        setTimeout(startRandomInterval, randomInterval);
    }
    startRandomInterval();
    daysRemind(days, "remind")
    setDays(days, currentDay)
    setDays(popupDays, currentDay)
    setDays(popupDaysMob, currentDay)

/// wheel logic
    const wheelSections = document.querySelector(".wheel__sections"),
        wheelWrap = document.querySelector(".wheel__wrap"),
        wheelArrow = document.querySelector(".wheel__arrow"),
        wheelBtn = document.querySelector(".wheel__btn"),
        spinBg = document.querySelector(".spin-bg"),
        salut = document.querySelector(".fireworks-wrap"),
        bubleBtn = document.querySelector(".wheel__days-icons"),
        wheelBuble = document.querySelector(".wheel__buble"),
        popupContainer = document.querySelector(".popups"),
        popup = document.querySelector(".popup"),
        popupCloseBtn = document.querySelector(".popup__close")

    bubleBtn.addEventListener("mouseover", (e) =>{
        wheelBuble.classList.remove("_hidden")
    })
    bubleBtn.addEventListener("mouseout", (e) =>{
        wheelBuble.classList.add("_hidden")
    })
    document.addEventListener("click", e => e.target === bubleBtn ? null : wheelBuble.classList.add("_hidden"))
    let prizes = ['iphone', 'ecoflow', 'fs99', 'nothing', "bonuses"]
    function getRandomPrize(arr) {
        return arr[Math.floor(Math.random() * prizes.length)];
    }
    function showPopup(sections, wheel, showClass, streakBonus, spinBg, closeBtn, popupContainer, popup, classPrize){
        // document.querySelector(".fav-page").classList.add("popupBg")
        if(classPrize){
            popup.classList.add(`${classPrize}`);
        }
        if(classPrize === "respin") return
        popup.classList.add(`${showClass}`)
        popup.classList.contains('_nothing') === true ? null : addFireworks(".popups", 7)
        streakBonus ? popup.classList.add("_done") : popup.classList.add("_incomplete")
        popupContainer.classList.add("_opacity", "_zIndex")
        document.body.style.overflow = "hidden"
        spinBg.classList.remove("showSpinBg")
        const pers = document.querySelectorAll(".popup__pers")
        const prize = document.querySelectorAll(".popup__prize")
        const buble = document.querySelectorAll(".popup__buble")
        const popupBody = document.querySelector(".popup__main")
        const popupTitle = document.querySelectorAll(".popup__title")
        const popupLeftArrow = document.querySelectorAll(".popup__decor-left")
        const popupRightArrow = document.querySelectorAll(".popup__decor-right")
        streakBonus ? popupBody.classList.add("_done") : popup.classList.add("_incomplete")
        document.querySelector(".fav-page").classList.remove("bgScale")
        function addAnim(arr, classAnim){
            arr.forEach(item => item.classList.add(`${classAnim}`) )
        }
        //popup animations
        setTimeout(() =>{
            popupBody.classList.add("popupMainAnim")
            addAnim(pers, "popupPersAnim")
            addAnim(buble, "popupBubleAnim")
        }, 100)

        setTimeout(() =>{
            addAnim(prize, "popupPrizeAnim")
            popupTitle.forEach(item => item.classList.add("popupTitleAnim"))

        }, 600)
        setTimeout( () => {
            popupLeftArrow.forEach(item => item.classList.add("popupLeftArrAnim"))
            popupRightArrow.forEach(item => item.classList.add("popupRightArrAnim"))
        }, 1200)
        //popup animations
        closeBtn.addEventListener("click", () =>{
            popup.classList.contains('_nothing') === true ? null : addFireworks(".wheel", 7)
            wheel.classList.add("_lock")
            document.querySelector(".progress").classList.add("_lock")
            wheel.classList.remove("wheelSizeIncrease")
            document.body.style.overflow = "auto"
            popupContainer.classList.remove("_opacity", "_zIndex")
            popup.classList.remove(`${showClass}`, '_done', '_incomplete')
            removeFireworks(".popups");
        }, {once: true});
        document.querySelectorAll('.popup__btn').forEach(btn => btn.addEventListener("click", () => {
            popup.classList.contains('_nothing') === true ? null : addFireworks(".wheel", 7)
            wheel.classList.add("_lock")
            document.querySelector(".progress").classList.add("_lock")
            wheel.classList.remove("wheelSizeIncrease")
            document.body.style.overflow = "auto"
            popupContainer.classList.remove("_opacity", "_zIndex")
            popup.classList.remove(`${showClass}`, '_done', '_incomplete')
            removeFireworks(".popups");
        }, {once: true}));
    }

    function spinWheel(position, animation, sections, btn, wheel, arrow, prize, spinBg, salut){
        sections.addEventListener("animationend", () =>{
            sections.style.transform = `translate(-50%, -50%) rotate(${position}deg)`
            sections.classList.remove(`${animation}`)
        }, {once: true})
        sections.classList.add(`${animation}`)
        arrow.style.opacity = "0"
        wheel.classList.add("wheelSizeIncrease")
        document.querySelector(".fav-page").classList.add("bgScale")
        document.querySelector(".sector-prize").style.opacity = "1"
        spinBg.classList.add("showSpinBg")
        if(animation !== "respinAnim"){
            btn.style.pointerEvents = "none"
        }
    }


    function initSpin(sections, btn, wheel, arrow, spinBg, salut, prize, streakBonus) {
        btn.addEventListener("click", () =>{
            wheelBtn.classList.add('_disabled');

            if(prize === "iphone"){
                sections.addEventListener("animationend", () => showPopup(sections, wheel, "_iphone", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
                spinWheel(1800, "iphonePrize", sections, btn, wheel, arrow, prize, spinBg, salut)
            }
            if(prize === "ecoflow"){
                sections.addEventListener("animationend", () => showPopup(sections, wheel, "_ecoflow", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
                spinWheel(1665, "ecoflowPrize", sections, btn, wheel, arrow, prize, spinBg, salut)
            }
            if(prize === "fs99"){
                sections.addEventListener("animationend", () => showPopup(sections, wheel, "_fs99", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
                spinWheel(1711, "fs99Prize", sections, btn, wheel, arrow, prize, spinBg, salut)
            }
            if(prize === "nothing"){
                popup.classList.add("_nothing")
                sections.addEventListener("animationend", () => showPopup(sections, wheel,"_nothing", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
                spinWheel(1755, "nothingPrize", sections, btn, wheel, arrow, prize, spinBg, salut)
            }
            if(prize === "bonuses"){
                sections.addEventListener("animationend", () => showPopup(sections, wheel, "_bonus", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
                spinWheel(1935, "bonusesPrize", sections, btn, wheel, arrow, prize, spinBg, salut)
            }
            if(prize === "fs77"){
                sections.addEventListener("animationend", () => showPopup(sections, wheel, "_fs77", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
                spinWheel(1845, "fs77Prize", sections, btn, wheel, arrow, prize, spinBg, salut)
            }
            if(prize === "bonus111"){
                sections.addEventListener("animationend", () => showPopup(sections, wheel, "_bonus111", currentDay, spinBg, popupCloseBtn, popupContainer, popup))
                spinWheel(1845, "bonus111Prize", sections, btn, wheel, arrow, prize, spinBg, salut)
            }
            if(prize === "respin"){
                sections.addEventListener("animationend", () => showPopup(sections, wheel, "_bonus", streakBonus, spinBg, popupCloseBtn, popupContainer, popup, "respin"), {once: true})
                spinWheel(89.5, "respinAnim", sections, btn, wheel, arrow, prize, spinBg, salut)
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
        })
    }
    initSpin(wheelSections, wheelBtn, wheelWrap, wheelArrow, spinBg, salut, "bonus111")

    function refreshUserInfo(userInfo, skipPopup) {
        refreshDailyPointsSection(userInfo);
        if(!skipPopup) {
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
        const points = Math.min(userInfo.pointsPerDay || 0, 100);
        const progressStatus = document.querySelector('.progress__bar-status');
        progressStatus.innerHTML = points ? `${points} ₴` : " 0 ₴";
        const currentSpan = document.querySelector('.current');
        currentSpan.innerHTML = `${points}`;
        const progressLine = document.querySelector('.progress__bar-line');
        const progress = points / 100.0 * 100;
        progressLine.style.width = `${progress}%`;

        const lastUpdateElement = document.querySelector('.progress__bar-data');
        if (lastUpdateElement) {
            if (userInfo.lastUpdate) {
                const lastUpdateDate = new Date(userInfo.lastUpdate);
                if (!isNaN(lastUpdateDate)) {
                    const day = String(lastUpdateDate.getDate()).padStart(2, '0');
                    const month = String(lastUpdateDate.getMonth() + 1).padStart(2, '0');
                    const year = lastUpdateDate.getFullYear();
                    const hours = String(lastUpdateDate.getHours()).padStart(2, '0');
                    const minutes = String(lastUpdateDate.getMinutes()).padStart(2, '0');

                    const formattedDateTime = `${day}.${month}.${year}. ${hours}:${minutes}`;

                    document.querySelector('.current-data').innerHTML = formattedDateTime;

                    lastUpdateElement.classList.remove('hide');
                }
            }
        }
    }

    function refreshStreak(userInfo) {
        const items = document.querySelectorAll('.wheel__days-item');
        let i = 0;
        let streak = userInfo.spinsStreak;
        for (let item of items) {
            item.classList.remove('past');
            item.classList.remove('next');
            if (i < streak) {
                item.classList.add('past');
            } else {
                item.classList.add('next');
            }
            i++;
        }

        const popupDays = document.querySelectorAll('.popup__days-item');
        let j = 0;
        for (let item of popupDays) {
            item.classList.remove('active');
            item.classList.remove('past');
            item.classList.remove('next');
            if (j < streak) {
                item.classList.add('past');
            } else {
                item.classList.add('next');
            }
            j++;
        }

        const mobileDays = document.querySelectorAll('.days__item');
        let k = 0;
        for (let item of mobileDays) {
            item.classList.remove('past');
            item.classList.remove('next');
            if (k < streak) {
                item.classList.add('past');
            } else {
                item.classList.add('next');
            }
            k++;
        }
    }


//// accordion
    const accordionHeaders = document.querySelectorAll('.accordion__header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            document.querySelectorAll('.accordion__content').forEach(item => {
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
    const fs99 = document.querySelector('.fs99-popup')
    const iphone = document.querySelector('.iphone-popup')
    const ecoflow = document.querySelector('.ecoflow-popup')
    const bonuses = document.querySelector('.bonus103-popup')
    const fs77 = document.querySelector('.fs77-popup')
    const bonus111 = document.querySelector('.bonus111-popup')
    const done = document.querySelector('.done')
    const dropNothingButton = document.querySelector('.nothing-popup');
    const respinBtn= document.querySelector('.respin-popup');

    const dropLock = document.querySelector('.lock');
    const dropSign = document.querySelector('.sign');
    const skipBtn = document.querySelector('.skip-anim');
    const lngBtn = document.querySelector('.lng-btn');

    var streakBonus = JSON.parse(localStorage.getItem('streakBonus')) || false;

    let skipAnim = sessionStorage.getItem("skip") === "skip" ? true : false

    lngBtn.addEventListener("click", () =>{
        if(locale === "uk"){
            sessionStorage.setItem("locale", "en")
            window.location.reload()
            return
        }
        if(locale === "en"){
            sessionStorage.setItem("locale", "uk")
            window.location.reload()
            return
        }
    })

    console.log(skipAnim)

    if(skipAnim){
        skipBtn.classList.add("green")
        skipBtn.classList.remove("red")
        wheelSections.classList.add("skipSpin")
    }
    if(!skipAnim){
        skipBtn.classList.remove("green")
        skipBtn.classList.add("red")
        wheelSections.classList.remove("skipSpin")
    }

    skipBtn.addEventListener("click", (e) =>{
        if(skipAnim){
            skipBtn.classList.add("green")
            skipBtn.classList.remove("red")
            sessionStorage.removeItem("skip")
            wheelSections.classList.add("skipSpin")
            sessionStorage.removeItem("skip")
            window.location.reload()
        }
        if(!skipAnim){
            skipBtn.classList.remove("green")
            skipBtn.classList.add("red")
            sessionStorage.setItem("skip", "skip")
            wheelSections.classList.remove("skipSpin")
            window.location.reload()
        }


    })


    if(streakBonus){
        done.style.background = "green"
        currentDay = 2
    }
    if(!streakBonus){
        done.style.background = "red"
        currentDay = 0
    }

    done.addEventListener("click", () => {
        streakBonus = !streakBonus;
        localStorage.setItem('streakBonus', JSON.stringify(streakBonus));
        streakBonus = JSON.parse(localStorage.getItem('streakBonus')) || false;
        console.log(streakBonus)
        window.location.reload()

    });

    document.querySelector(".menu-btn").addEventListener("click", () =>{
        document.querySelector(".menu-test").classList.toggle("_hidden")
    })


    initSpin(wheelSections, fs99, wheelWrap, wheelArrow, spinBg, salut, "fs99", streakBonus)
    initSpin(wheelSections, iphone, wheelWrap, wheelArrow, spinBg, salut, "iphone", streakBonus)
    initSpin(wheelSections, ecoflow, wheelWrap, wheelArrow, spinBg, salut, "ecoflow", streakBonus)
    initSpin(wheelSections, bonuses, wheelWrap, wheelArrow, spinBg, salut, "bonuses", streakBonus)
    initSpin(wheelSections, fs77, wheelWrap, wheelArrow, spinBg, salut, "fs77", streakBonus)
    initSpin(wheelSections, bonus111, wheelWrap, wheelArrow, spinBg, salut, "bonus111", streakBonus)
    initSpin(wheelSections, dropNothingButton, wheelWrap, wheelArrow, spinBg, salut, "nothing", streakBonus)
    initSpin(wheelSections, respinBtn, wheelWrap, wheelArrow, spinBg, salut, "respin", streakBonus)

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

