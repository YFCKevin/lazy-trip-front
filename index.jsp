<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="article.model.*"%>
<%@ page import="java.util.*"%>

<%
ArticleVO articleVO = (ArticleVO) request.getAttribute("articleVO"); //EmpServlet.java(Concroller), 存入req的empVO物件
%>

<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LazyTrip.io</title>
    <!-- Bulma 自訂 -->
    <link rel="stylesheet" href="asset/css/my-bulma.css" />
    <!-- 自定義 CSS -->
    <link rel="stylesheet" href="asset/css/homepage-style.css" />
    <!-- Font Awesome -->
    <script
      src="https://kit.fontawesome.com/0548105e54.js"
      crossorigin="anonymous"
    ></script>
    <script
      defer
      src="asset/js/components.js"
      type="text/javascript"
    ></script>
        <!-- jquery -->
    <script src="asset/js/jquery-3.6.3.min.js"></script>
  </head>
  <body>
  <c:import url="page/customerService/customerServiceFront.jsp"></c:import>
    <!-- 導覽列 -->
   <header-component></header-component>

    <!-- 內容 -->

    <section
      class="hero is-medium has-background-primary-light has-text-centered"
    >
      <div id="picture-behind-search" class="hero-body">
        <p class="title">開始您美好的一天</p>
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
                onclick="location.href='index.jsp'">
                查詢
              </button>
            </div>
          </div>

          <div class="column"></div>
        </div>
      </div>
    </section>

<section class="section">

    <div class="columns is-centered">
      <h2><b><a class="hot" href="<%=request.getContextPath()%>/page/article/allArticle.jsp">推薦文章</a></b></h2>
    </div>
    <div class="columns pic">
      <div class="column">台北101
        <img src="asset/img/101.jpg"  alt="">
      </div>
      <div class="column">花東5日遊
        <img src="asset/img/ocean.jpg"  alt="">
      </div>
      <div class="column">高雄
        <img src="asset/img/kaohsiung.jpg" alt="">
      </div>
      <div class="column">台南古城
        <img src="asset/img/Tainan.jpg" alt="">
      </div>
    </div>
    <hr>


    <div class="columns is-centered">
      <h2><b><a class="hot" href="${ORIGIN}/lazy-trip-back/page/tour/tour.html">熱門行程</a></b></h2>
<%--       <a href="${ORIGIN}/lazy-trip-back/page/tour/tour.html" class="navbar-item"> 行程 </a> --%>
    </div>
    <div class="columns">
      <div class="column">
        <span>夜遊象山</span>
        <img src="asset/img/象山.jpg" alt="">
      </div>
      <div class="column">
      <span>南庄矮靈祭</span>
        <img src="asset/img/南庄矮靈祭.jpg" alt="">
      </div>
      <div class="column">
      <span>熱氣球嘉年華</span>
        <img src="asset/img/熱氣球嘉年華.jpg" alt="">
      </div>
      <div class="column">
      <span>鹽水蜂炮</span>
        <img src="asset/img/鹽水蜂炮.jpg" alt="">
      </div>
    </div>
    <hr>

<div class="columns is-centered">
      <h2><b><a class="hot" href="${ORIGIN}/lazy-trip-back/page/order/order_booking_search.html">熱門訂房</a></b></h2>
  </div>
    <div class="columns pic">
      <div class="column">
        <span>台北花園大酒店</span>
        <img src="asset/img/台北花園大酒店.jpg" alt="">
      </div>
      <div class="column">
      <span>萬豪酒店</span>
        <img src="asset/img/萬豪.jpg" alt="">
      </div>
      <div class="column">
      <span>U.I.J Hotel & Hostel</span>
        <img src="asset/img/U.I.J Hotel & Hostel.jpg" alt="">
      </div>
      <div class="column">
      <span>文華東方</span>
        <img src="asset/img/文華東方.jpg" alt="">
      </div>
    </div>
    <hr>

</section>


    <!-- 頁尾 -->
    <footer-component></footer-component>
    <script src="asset/js/checkLogin.js?ver=1"></script>
    <script src="<%=request.getContextPath()%>/asset/js/bulma-init.js"></script>
  </body>
</html>
