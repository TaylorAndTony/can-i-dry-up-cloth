// ==UserScript==
// @name         能晾衣服吗信息获取脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  与 can-i-dry-up-cloth 前端共同工作，提供跨域访问 nmc.cn 的数据
// @author       TaylorAndTony
// @match        http://127.0.0.1:5500/index.html
// @match        https://taylorandtony.github.io/can-i-dry-up-cloth/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nmc.cn
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// ==/UserScript==

this.$ = this.jQuery = unsafeWindow.$ || unsafeWindow.jQuery || jQuery.noConflict(true);

// 配置项
// 目标网址
const URL = 'http://www.nmc.cn/publish/forecast/ASD/yantai.html'
// 风速 css 选择器，会选择多个风速
const WIND_SELECTOR = '#day0 > div.hour3 > div:nth-child(5)'
// 天气（晴、小雨等）css 选择器
const WEATHER_SELECTOR = '#day7 > div.weather.pull-left.selected > div > div:nth-child(9)';
// 风速正则表达式
const WIND_REGEX = /(\d+.\d+)m\/s/;

async function __Get_Data() {
    const response = await GM.xmlHttpRequest({
        method: 'GET',
        url: URL,
        responseType: 'text'
    });
    let html = response.responseText;
    let obj = $(html);
    let winds = [];
    obj.find(WIND_SELECTOR).each(function () {
        console.log($(this).text());
        let t = $(this);
        let match = t.text().match(WIND_REGEX);
        if (match) {
            winds.push(parseFloat(match[1]));
        }
    });
    let windAvg = winds.reduce((a, b) => a + b) / winds.length;
    let trend = '?';
    if (winds.length > 1) {
        if (winds[1] > winds[0]) {
            trend = '+';
        } else if (winds[1] < winds[0]) {
            trend = '-';
        } else {
            trend = '=';
        }
    }
    let weather = obj.find(WEATHER_SELECTOR).text();
    console.log(windAvg, weather);
    return {
        windRaw: winds,
        windParsed: windAvg,
        trend: trend,
        weather: weather
    }
}

(function () {
    'use strict';
    unsafeWindow.__Get_Data = __Get_Data;
    window.__Get_Data = __Get_Data;
})();