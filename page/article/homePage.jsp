<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LazyTrip.io</title>
    <!-- Bulma 自訂 -->
    <link rel="stylesheet" href="../../asset/css/my-bulma.css" />
    <!-- 自定義 CSS -->
    <link rel="stylesheet" href="./../css/homepage-style.css" />
    <!-- Font Awesome -->
    <script
      src="https://kit.fontawesome.com/0548105e54.js"
      crossorigin="anonymous"
    ></script>
    <script
      defer
      src="../../asset/js/components.js"
      type="text/javascript"
    ></script>
        <!-- jquery -->
    <script src="../../asset/js/jquery-3.6.3.min.js"></script>
  </head>
  <body>
  <c:import url="../customerService/customerServiceFront.jsp"></c:import>
    <!-- 導覽列 -->
   <header-component></header-component>

    <!-- 內容 -->

    <section
      class="hero is-medium has-background-primary-light has-text-centered"
    >
      <div id="picture-behind-search" class="hero-body">
        <p class="title">網頁維修中</p>
        <div class="columns">
          <div class="column"></div>
          <div class="column">
            <input
              class="input is-primary"
              type="text"
              placeholder="輸入你想去的地方..."
            />
            <div class="column">
              <button
                class="button is-primary"
                onclick="location.href='https://www.wibibi.com/info.php?tid=117'"
              >
                查詢
              </button>
            </div>
          </div>

          <div class="column"></div>
        </div>
      </div>
    </section>

    <div class="column"></div>
    <div class="columns is-centered">
      <h2><b><a class="hot" href="https://www.kkday.com/zh-tw">熱門行程</a></b></h2>
    </div>
    <div class="columns">
      <div class="column">
        <span>台中3天兩夜</span>
        <img src="../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">花東5日遊
        <img src="../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">夜遊台北
        <img src="../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">台南古城
        <img src="../asset/img/dog.jpg" alt="">
      </div>
    </div>
    <hr>

    <div class="columns is-centered">
      <h2><b><a class="hot" href="https://www.kkday.com/zh-tw">揪團活動</a></b></h2>
    </div>
    <div class="columns">
      <div class="column">
        <span>台中3天兩夜</span>
        <img src="../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">花東5日遊
        <img src="../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">夜遊台北
        <img src="../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">台南古城
        <img src="../asset/img/dog.jpg" alt="">
      </div>
    </div>
    <hr>

    <div class="columns is-centered">
      <h2><b><a class="hot" href="https://www.kkday.com/zh-tw">廠商推薦</a></b></h2>
    </div>
    <div class="columns">
      <div class="column">
        <span>台中3天兩夜</span>
        <img src="../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">花東5日遊
        <img src="../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">夜遊台北
        <img src="../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">台南古城
        <img src="../asset/img/dog.jpg" alt="">
      </div>
    </div>
    <hr>

    <div class="columns is-centered">
      <h2><b><a class="hot" href="allArticle.jsp">推薦文章</a></b></h2>
    </div>
    <div class="columns">
      <div class="column">
        <span>台中3天兩夜</span>
        <img src="../../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">花東5日遊
        <img src="../../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">夜遊台北
        <img src="../../asset/img/dog.jpg" alt="">
      </div>
      <div class="column">台南古城
        <img src="../../asset/img/dog.jpg" alt="">
      </div>
    </div>
    <hr>


    <!-- 頁尾 -->
    <footer-component></footer-component>
    <script src="asset/js/checkLogin.js?ver=1"></script>
    <script src="../../asset/js/bulma-init.js"></script>
  </body>
</html>
