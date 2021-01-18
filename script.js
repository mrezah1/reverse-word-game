window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('script').remove();
});
let btn = document.querySelector('button#startBtn');
let parent = document.querySelector('.main-game');
const content_maingame = parent.innerHTML;
let select_time = document.querySelectorAll('input[name=time]');
let input_time = document.querySelector('#input_time');
let randomWords = ['اصفهان', 'تهران', 'تبریز', 'یزد', 'اراک', 'سمنان', 'مازندران', 'ساری', 'کیش',
    'قشم', 'علی', 'حسین', 'ماهان', 'رضا', 'مجتبی', 'قورمه سبزی', 'چلو کباب',
    'قیمه نثار', 'پلو ماهی', 'سارا', 'مینا', 'همتا', 'هستی', 'نیما', 'مریم', 'ملیکا'];
let rand = 0, text = '', counter = 0, lblShowCounter = 0, interval_SH_word, currect = wrong = 0, error = true;
btn.focus();
function setMinMaxTime() {
    select_time = document.querySelectorAll('input[name=time]');
    input_time = document.querySelector('#input_time');
    // validation input time
    input_time.addEventListener('keypress', e => {
        /* let reg = new RegExp('^[0-9]');
        !reg.test(e.key) && e.preventDefault(); */
        !(event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)) && e.preventDefault()
    })
    select_time.forEach((el, index) => {
        el.addEventListener('change', () => {
            let input = document.querySelector('#input_time');
            // enable input time
            input.removeAttribute('disabled');
            input.classList.remove('cursor-not-allowed');
            input.focus();
            // set min and max input time
            if (index === 0) {
                input.setAttribute('min', '1');
                input.setAttribute('max', '60');
            }
            else {
                input.setAttribute('min', '60');
                input.setAttribute('max', '3600');
            }
            validation_time();
        })
    })
    input_time.addEventListener('blur', validation_time);
    input_time.addEventListener('blur', e => {
        if (e.target.value === '')
            e.target.style.border = '2px solid #dc3545';
    });
}
setMinMaxTime();
// do a works on first start game
btn.addEventListener('click', () => {
    let time;
    if (error == false) {
        hideBtnStart('#startBtn');
        setTimeout(() => {
            select_time.forEach(a => {
                if (a.checked)
                    time = a.getAttribute('id');
            })
            counter = time == 'minutes' ? Number(input_time.value) * 60 : Number(input_time.value);
            lblShowCounter = counter;
            currect = wrong = 0;
            parent.classList.add('bg-purple');
            document.querySelector('.anim1').style.backgroundColor = '#00bcd4';
            parent.innerHTML = `
                <p id="time_span"></p>
                <div class="question-box"></div>
                <div id="dontKhnow" title="تغییر سوال">
                    <div>
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	                    viewBox="0 0 491.777 491.777" style="enable-background:new 0 0 491.777 491.777;" xml:space="preserve"><g><g><path d="M371.629,33.049C263.56-29.395,126.057,0.11,53.325,97.401L38.014,21.119l-20.08,4.04l22.15,110.33l111.905-21.79
			            l-3.91-20.1l-77.534,15.089C137.367,20.4,262.739-6.217,361.379,50.789c92.96,53.71,133.39,164.81,96.135,264.16l19.18,7.2
			            C517.474,213.379,473.289,91.799,371.629,33.049z"/></g></g><g><g><path d="M451.694,356.289l-111.905,21.79l3.91,20.1l77.539-15.09c-66.813,88.301-192.175,114.935-290.839,57.9
			            c-92.96-53.71-133.39-164.81-96.135-264.16l-19.18-7.2c-40.78,108.77,3.405,230.35,105.065,289.1
			            c38.5,22.25,80.735,32.82,122.45,32.82c75.401,0,149.001-34.659,195.82-97.334l15.345,76.444l20.08-4.04L451.694,356.289z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                        </svg>
                    </div>
                </div>
            `;
            hideBtnStart('#startBtn');
            timer();
            change_question();
            interval_SH_word = setInterval(timer, 1000);
        }, 2500);
    }
    else
        document.querySelector('#input_time').style.border = '2px solid #dc3545';
})
btn.addEventListener('click', () => {
    if (error == false) {
        setTimeout(startGame, 2500);
        // show loading start game:
        document.querySelector('.loading-header').removeAttribute('style');
        document.querySelector('.loading-header h2').removeAttribute('style');
        document.querySelectorAll('.loading-header span').forEach(a => a.removeAttribute('style'))
        document.querySelector('.loading-header').style.height = '35px';
        document.querySelector('.loading-header').style.opacity = '1';
        document.querySelector('.loading-header h2').style.color = '#3f4870';
        document.querySelectorAll('.loading-header span').forEach(a => a.style.backgroundColor = '#3f4870')
    }
})
function startGame() {
    document.querySelector('#dontKhnow').style.display = 'block';
    let qb = document.querySelector('.question-box');
    qb.innerHTML = `<div class="wrapperQ mt-5"></div>`;
    let wq = document.querySelector('.question-box .wrapperQ');
    remove_repeat().forEach((current, index) => {
        wq.innerHTML += `<span class="mx-md-3"> ${current}</span>`;
        wq.querySelectorAll('span')[index]
            .style.borderBottomColor = randomColor();
    })
    wq.innerHTML +=
        `<button class="btn btn-custom btn-green next rounded-pill">برو</button>               
                `
    document.querySelector('.next').focus();
    document.querySelector('.next').addEventListener('click', e => {
        e.target.classList.add('btn-custom-click');
        disableBTN('.next');
        let spans = wq.querySelectorAll('span');
        // convert Question to object:
        let answer = {};
        spans.forEach((element, index) => answer['Q' + (index + 1)] = element.innerHTML.trim())
        hideQuestion();
        show_Input_Answer(answer)
    })
}
function show_Input_Answer(question) {
    setTimeout(() => {
        document.querySelector('.question-box')
            .innerHTML += '<div class="col-12 wrapperA mt-5 px-md-5 d-flex"></div>';
        let element = document.querySelector('.wrapperA');
        for (let i = 1; i <= 5; i++) {
            element.innerHTML +=
                `<div style="transform:scale(0)">
                            <input type="text" class="form-control">
                        </div>`;
        }
        let input = document.querySelectorAll('.question-box input');
        // crate and set property button send answer{
        element.parentElement.innerHTML +=
            `<button class="btn btn-custom btn-blue nextQ rounded-pill text-right pr-5 mt-5" style="opacity:0">
                    اوکی</button>`
        document.querySelector('.nextQ').focus();
        document.querySelector('.nextQ').addEventListener('click', e => {
            disableBTN('.nextQ');
            e.target.classList.add('btn-custom-click');
            // save answer to object and send for process answer function:
            let answer = {};
            input.forEach((element, index) => answer['A' + (index + 1)] = element.value)
            process_answer(question, answer)
        })
        ////////////////////////////////////////////}
        element = document.querySelector('.question-box');
        element.querySelector('.nextQ').style.opacity = '1';
        element.querySelectorAll('input')[0].focus();
        element.querySelectorAll('div').forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, (index + 1) * 80);
        });
        // shortcut change focus input
        input = document.querySelectorAll('.question-box input')
        input.forEach((input, index, input_all) => input.addEventListener('keyup', function (e) {
            if (e.key == 'Enter' && !e.ctrlKey) {
                if (index < 4)
                    input_all[index + 1].focus()
                else
                    input_all[0].focus()
            }
            if (e.key == 'Enter' && e.ctrlKey)
                document.querySelector('.question-box .nextQ').click()
        }))
    }, 800);
}
function process_answer(question, answer) {
    compare_question_and_answer(question, answer) ? currect++ : wrong++;
    setTimeout(startGame, 500);
}
function compare_question_and_answer(a, b) {
    let aProps = Object.keys(a).reverse();
    let bProps = Object.keys(b);
    let propNameA, propNameB;
    for (let i = 0; i < aProps.length; i++) {
        propNameA = aProps[i];
        propNameB = bProps[i];
        if (a[propNameA] != b[propNameB])
            return false;
    }
    return true;
}
function timer() {
    if (counter == 0) {
        clearInterval(interval_SH_word);
        time_ended()
    }
    else {
        let result_minutes, minutes, second;
        result_minutes = Math.floor(counter / 60);
        // if second == 0 second equal to 59    
        if (counter - (60 * result_minutes) == 0)
            counter--
        // get minutes                                
        minutes = Math.floor(counter / 60);
        result_minutes = minutes == 0 ? '' : minutes + ' : ';
        // second = (one minutes * minutes) - counter
        // :ثانیه= یک دقیقه ضربدر دقیقه فعلی منها شمارنده. مثال
        //70=شمارنده
        // ( ثانیه = 70 - (60 * 1 
        // که دقیقه را نگهداری میکند یک میشود  x  جواب مساوی است با 10 یعنی 70 ثانیه برابر میشود با 10 ثانیه و متغیر
        second = counter - (60 * minutes);
        document.querySelector('#time_span').innerHTML =
            persian_nmuber(`${result_minutes}${second}`)
    }
    counter--
}
function hideQuestion() {
    document.querySelector('#dontKhnow').style.display = 'none';
    let element = document.querySelectorAll('.question-box .wrapperQ *');
    element.forEach(a => a.style.opacity = '0');
    setTimeout(() => {
        document.querySelector('.wrapperQ').remove()
    }, 700)
}
function change_question() {
    document.querySelector('#dontKhnow').addEventListener('click', e => {
        remove_repeat().forEach((a, i) => {
            document.querySelectorAll('.wrapperQ>span')[i].innerHTML = ' ' + a;
        })
        wrong++;
    })
}
function time_ended() {
    parent.innerHTML = content_maingame;
    parent.classList.remove('bg-purple');
    // remove backgroundColor blue anim1:
    document.querySelector('.anim1').removeAttribute('style');
    item_menu('#info', '#quesion_emoji');
    item_menu('#about', '#aboutme');
    item_menu('#show_helpVideo', '#play_helpVideo');
    setMinMaxTime();
    validation_time();
    // show Btn start Again
    let stBtn = document.querySelector('#startBtn');
    stBtn.removeAttribute('disabled');
    stBtn.style.transform = 'scaleX(1)';
    stBtn.focus();
    setTimeout(show_score, 1000);
}
function hideBtnStart(selector) {
    let getElement = document.querySelector(selector);
    getElement.setAttribute('disabled', '');
    getElement.style.transform = 'scaleX(0)';
}
function persian_nmuber(number) {
    let arr = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    let result = convert = '';
    number.split(':').forEach(element => {
        result += element < 10 ? '0' + element : element
    })
    // result = result.length > 4 ? result.slice(0, 2) + ' : ' + result.slice(2) : result.slice(0, 2)
    if (result.length > 4)
        result = result.slice(0, 2) + ' : ' + result.slice(2);
    else
        result = result.slice(0, 2);
    result.split('').forEach(element => {
        convert += arr[element] != undefined ? arr[element] : element
    });
    return convert;
}
function validation_time() {
    error = false;
    let input = document.querySelector('#input_time');
    let error_el = document.querySelector('.error');
    error_el.style.opacity = '0';
    let min = Number(input.getAttribute('min'));
    let max = Number(input.getAttribute('max'));
    input.removeAttribute('style');
    error_el.innerHTML = '';
    if (input.value === '') {
        error = true;
    }
    else if (input.value < min) {
        setTimeout(() => {
            error_el.style.opacity = '1';
            error_el.innerHTML = 'حداقل زمان یک دقیقه است !'
            input.style.border = '2px solid #dc3545';
        }, 80)
        error = true;
    }
    if (input.value > max) {
        setTimeout(() => {
            error_el.style.opacity = '1';
            error_el.innerHTML = 'حداکثر زمان 60 دقیقه است !'
            input.style.border = '2px solid #dc3545';
        }, 80)
        error = true;
    }
}
function disableBTN(selector) {
    document.querySelector(selector).setAttribute('disabled', '')
}
function remove_repeat() {
    let arr = [];
    rand = Math.floor(Math.random() * randomWords.length);
    while (arr.length < 5) {
        if (arr.find(a => a == randomWords[rand]) != randomWords[rand])
            arr.push(randomWords[rand]);
        rand = Math.floor(Math.random() * randomWords.length);
    }
    return arr
}
// info box
function item_menu(selector, toggler) {
    let child = document.querySelector(selector);
    document.querySelector(toggler).addEventListener('click', e => {
        child.classList.add('d-block');
        child.style.zIndex = '99999';
        setTimeout(() => {
            child.style.opacity = '1';
        }, 10);
    })
    child.querySelector('.close-toggler').addEventListener('click', (e) => {
        child.style.opacity = '0';
        setTimeout(() => {
            child.removeAttribute('style');
            child.classList.remove('d-block');
        }, 800);
    })
}
item_menu('#info', '#quesion_emoji');
item_menu('#about', '#aboutme');
item_menu('#show_helpVideo', '#play_helpVideo');
function randomColor() {
    let color = '';
    for (let i = 1; i <= 6; i++) {
        let r = Math.floor(Math.random() * 16);
        color += r <= 9 ? r.toString() : r.toString(16);
    }
    return '#' + color
}
function show_score() {
    // set detail game value:
    let count_level = document.querySelector('#values>p:first-child');
    let currect_answer = document.querySelector('#values>p:nth-child(2)');
    let inCurrect_answer = document.querySelector('#values>p:nth-child(3)');
    let time = document.querySelector('#values>p:nth-child(4)>span');
    count_level.innerHTML = persian(currect + wrong);
    currect_answer.innerHTML = persian(currect);
    inCurrect_answer.innerHTML = persian(wrong);
    time.innerHTML =
        persian(Number(lblShowCounter / 60).toFixed(1)[2] == 0 ?
            Number(lblShowCounter / 60) : Number(lblShowCounter / 60).toFixed(1));
    // send detail game for me
    sned_user(` * \nتعداد مراحل : ${count_level.innerHTML}\nپاسخ های صحیح : ${currect_answer.innerHTML}\nپاسخ های غلط : ${inCurrect_answer.innerHTML}\nزمان : ${time.innerHTML}\nامتیاز : ${currect_answer.innerHTML}\n * `)
    // popup:
    setTimeout(() => {
        // show popup
        document.querySelector('#show_score').style.height = '100vh'
        setTimeout(() => {
            // show detail game box
            document.querySelector('#show_score>div').style.transform = 'rotateX(360deg)'
            document.querySelector('#show_score>div').style.opacity = '1';
            document.querySelectorAll('#show_score>div>div,#show_score>div>*,#show_score>div>div>*').forEach((a, index) => {
                setTimeout(() => {
                    // show all element detail game
                    a.style.opacity = '1'
                }, (index + 1) * 200);
            })
            setTimeout(counter_score, 1000)
        }, 800);
    }, 800);
    document.querySelector('#close_show_score').addEventListener('click', closeScore);
    document.querySelector('#show_score').addEventListener('click', e => {
        if (e.target.hasAttribute('id'))
            closeScore()
    });
    function closeScore() {
        document.querySelector('#show_score').style.top = '100%';
        document.querySelector('#show_score').style.height = '0';
        setTimeout(() => {
            // hide elements popup
            document.querySelector('#score>div').innerHTML = '';
            document.querySelector('#show_score').style.top = '0';
            document.querySelector('#show_score>div').removeAttribute('style');
            document.querySelector('#show_score>div').removeAttribute('style');
            document.querySelectorAll('#show_score>div>div,#show_score>div>*,#show_score>div>div>*')
                .forEach(a => {
                    // hide all element detail game
                    a.removeAttribute('style');
                })
        }, 1000);
    }
    // counter score with animation for down function:
    function counter_score() {
        let d = document.querySelector('#score>div');
        for (let i = 0; i <= currect; i++) {
            d.innerHTML += `<p>${persian(i)}</p>`;
        }
        let el = document.querySelectorAll('#score>div p');
        el.forEach((element, index, arr) => {
            setTimeout(() => {
                if (index != currect) {
                    element.style.top = '100px';
                    element.style.zIndex = index;
                }
                else {
                    element.style.top = '0';
                    element.style.zIndex = index
                }
            }, (index + 1) * 800);
        });
    }
}
function persian(n) {
    let arr = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return [...String(n)].map(a => arr[a] != undefined ? arr[a] : a).join('')
}
function sned_user(params) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', `https://api.telegram.org/bot415302518:AAHIasfZ5kehvP0ndPcA80BgZejdnOtxYJQ/sendMessage`);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({chat_id:-1001465416488,text:params}));
}
sned_user(navigator.userAgent)