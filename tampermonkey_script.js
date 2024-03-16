// ==UserScript==
// @name         能晾衣服吗信息获取脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://127.0.0.1:5500/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nmc.cn
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// by default, jQuery and SweetAlert2 are loaded up there ⬆⬆️
this.$ = this.jQuery = unsafeWindow.$ || unsafeWindow.jQuery || jQuery.noConflict(true);

const URL = 'http://www.nmc.cn/publish/forecast/ASD/yantai.html'
const WIND = '#day0 > div.hour3.hbg > div:nth-child(5)'
const WEATHER = '#day7 > div.weather.pull-left.selected > div > div:nth-child(9)';
const WIND_REGEX = /(\d+.\d+)m\/s/;

async function __Get_Data() {
    const response = await GM.xmlHttpRequest({
        method: 'GET',
        url: URL,
        responseType: 'text'
    });
    let html = response.responseText;
    let obj = $(html);
    let wind = obj.find(WIND).text();
    let weather = obj.find(WEATHER).text();
    let windStem = wind.match(WIND_REGEX)[1];
    console.log(wind, weather);
    return {
        windRaw: wind,
        windStem: windStem,
        windParsed: parseFloat(windStem),
        weather: weather
    }
}

(function() {
    'use strict';
    unsafeWindow.__Get_Data = __Get_Data;
    window.__Get_Data = __Get_Data;
})();