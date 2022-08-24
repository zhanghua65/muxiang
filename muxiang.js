// ==UserScript==
// @name         慕享刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       zhanghua65
// @match        *://*.moycp.com/*
// @grant        window.onurlchange
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// ==/UserScript==

var setting = {
        // 自动登录功能配置区
        username: '',
        password: '',
        isLogin: true,
        //分数未满40分
        mark: '40分',
        //默认 播放速度 1.5
        playbackRate: 1.5,
        play: false,
        timer: '',
        courseIndex: 0
    },  _self = unsafeWindow,
    url = location.pathname;

$(function () {
    'use strict';
    function init() {
        let urls = location.pathname;
        switch (urls) {
            case '/login':
                //登录
                console.log("登录");
               login();
                break;
            case '/studyCenter/studying':
                //学习中心
                console.log("学习中心");
                studying();
                break;
            case '/courseDetail/catalog':
                //课程目录
                console.log("课程目录");
                catalog();
                break;
            case '/courseware2':
                //观看视频
                // console.log("观看视频");
                courseware2();
                break;
            default:
                location.href = "https://web.moycp.com/login";
                break
        }
    }

//自动登录
    function login() {
        console.log("登录ing");
        let object = $(".choosed[style='display: none;']")
        if (object == null) {
            $(".free-login").click();
        }else {
            console.log("已经勾选")
        }
        $(":text").attr("autocomplete","off");
        $(":password").attr("autocomplete","new-password");
        let username =  $(":text").val(setting.username);
        let password = $(":password").val(setting.password);
        //七天自动登录
        if (setting.isLogin) {
            $(".el-button.login-btn").click();
            setting.isLogin = false
        }
    }

    //选择未学习的课程 （ 分数未满40分）
    function studying() {
        let infoList =  document.querySelectorAll(".detail-info");
        for (let i = 0; i < infoList.length;i++){

            let courseName =  infoList[i].getElementsByClassName("course-name")[0].innerText;
            //跳过新手课程
            console.log("courseName",courseName);
            debugger
            if (courseName.indexOf("新手课程") === -1){
                let  score =  infoList[i].getElementsByClassName("score")[0].innerText;
                if (score.indexOf(setting.mark) === -1){
                    infoList[i].getElementsByClassName("learn")[0].click();
                    break;
                }else {
                    infoList[setting.courseIndex].getElementsByClassName("learn")[0].click();
                    setting.courseIndex++;
                    break;
                }
            }
        }
    }
    function studying1() {
        let $List =  $("li.course-item");
        if ($List.length !== 0){
            $List.filter(function(index) {
                return $(this).find(".course-name").text().indexOf("新手课程") === -1
            })
        }

    }

    function catalog(){
        //显示所有的课件和闯关
        let oStudy =  document.querySelectorAll(".study-buttons");
        if (oStudy.length !== 0){
            for (let i = 0; i < oStudy.length;i++){
                oStudy[i].style.display = "flex"
            }
            //找到列表中未完成的课
            let oDt = document.getElementsByTagName("dd");
            for (let i = 0; i < oDt.length; i++) {
                let oProgress = oDt[i].getElementsByClassName("progress");
                for (let j = 0; j < oProgress.length; j++) {
                    let oSpan = oProgress[j].lastChild;
                    if (oSpan.style.width !== '100%') {
                        let studys =  oDt[i].getElementsByClassName("study")[0];
                        if (studys.innerText === '课件'){
                            oDt[i].getElementsByClassName("study")[0].click();
                        }
                    }else {
                        location.href = "https://web.moycp.com/studyCenter/studying";
                    }
                }
            }
        }

    }
    function courseware2(){
        let text = $(".vertical-line-right > .alreadystudy").text();
        if (text.indexOf("100%") === -1){
            // click_bo();
            iconfontClick();
        }else {
            nextSection();
        }
    }
    //点击按钮   开始按钮 \ue653  暂停按钮
    function iconfontClick() {
        if ($("video > source")) {
            var video = document.getElementById("moshare-video_html5_api");
            if (video !== null && video !== undefined && video !== '' ){
                if ($("#moshare-video").hasClass("vjs-ended") ){
                    console.log("播放完成");
                    nextSection();
                }else if ( ($("#moshare-video").hasClass("vjs-playing") )){
                    console.log("播放中");
                }else {

                    $("div.volume-now").css("width","0%");
                    video.muted = "0";
                    video.playbackRate = setting.playbackRate;
                    $(".fl > i:nth-child(1)").click()
                }
            }

        }
    }
    function nextSection() {
        let section =  $("dd > .catalog-item-section-col2:not(.finish)").parent(".catalog-item-section").first();
        if ( section  ){
            debugger
            console.log("section",section);
            section.click();
        }
    }

    //直接自动播放
    function click_bo() {
        if ($("video > source")) {
            var video = document.getElementById("moshare-video_html5_api");
            var suspend = document.querySelector(".vjs-controls-disabled .vjs-workinghover .vjs-v7 .moshare-video-dimensions .vjs-has-started .vjs-paused .vjs-user-inactive");
            if (video !== null && video !== undefined && video !== '' ){
                if ($("#moshare-video").hasClass("vjs-playing") ) {


                } else if (suspend) {
                    video.muted = true;
                    video.autoplay = true;
                    video.play();
                } else if ($(".bottom")) {
                    video.muted = true;
                    video.autoplay = true;
                    video.play();
                }if (document.querySelector('volume-now')) {
                    video.muted = "0";
                    video.playbackRate = setting.playbackRate;
                }
            }

        }
    }
    setting.timer = setInterval(function () {
        if (window.onurlchange === null) {
            window.addEventListener('urlchange', (info) => {
                console.log("变化", info);
                console.log("我运行了");});
                if(document.readyState === "complete"){
                    init();
                }
        }
    },500);
});


