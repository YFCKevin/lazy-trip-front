<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="java.util.*"%>
<%@ page import="article.model.*"%>
<%@ page import="article.service.*"%>


<%
    ArticleService articleSvc = new ArticleService();
    List<ArticleVO> list = articleSvc.getAll();
    pageContext.setAttribute("list",list);
%>

<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>推薦文章</title>
    <link rel="stylesheet" href="<%=request.getContextPath()%>/asset/css/my-bulma.css" />
    <link rel="stylesheet" href="./css/allArticle.css" />
    <script
      src="https://kit.fontawesome.com/0548105e54.js"
      crossorigin="anonymous"
    ></script>
        <script
      defer
      src="<%=request.getContextPath()%>/asset/js/components.js"
      type="text/javascript"
    ></script>
                <!-- jquery -->
    <script src="<%=request.getContextPath()%>/asset/js/jquery-3.6.3.min.js"></script>
  </head>
  <body>
      <!-- 導覽列 -->
   <header-component></header-component>

     <div class="columns" style="
                margin: 15px 5px 15px;
                display: flex;
  				align-items: center;
    ">
    <b style="font-size: 40px;" > 推薦文章 </b>
    
    <a href="<%=request.getContextPath()%>/page/article/addArticle.jsp"><button class="button is-link is-outlined" style="margin-left: 990px ">
    新增
    </button></a>
    </div>
    
    
<section class="section">

		<div class="container">
			<div class="columns is-centered">
				<div class="column is-half">
					<form method="post"
						action="<%=request.getContextPath()%>/article/ArticleServlet2">
						<div class="field has-addons">
							<div class="control is-expanded">
								<input class="input is-rounded" type="text" placeholder="輸入關鍵字"
									name="select">
							</div>
							<div class="control">
								<button class="button is-link is-outlined">搜尋</button>
							</div>
						</div>
						<input type="hidden" name="action" value="search">
					</form>
				</div>
			</div>
		</div>







		<table
      class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth "
    >
		<tr>
		<th class="has-background-primary-light has-text-primary">文章編號</th>
		<th class="has-background-primary-light has-text-primary">文章標題</th>
		<th class="has-background-primary-light has-text-primary">文章內容</th>
<!-- 		<th class="has-background-primary-light has-text-primary">文章圖片</th> -->
		<th class="has-background-primary-light has-text-primary">發布時間</th>
		<th class="has-background-primary-light has-text-primary">修改時間</th>
		<th class="has-background-primary-light has-text-primary">會員編號</th>
		<th class="has-background-primary-light has-text-primary">行程編號</th>
		<th class="has-background-primary-light has-text-primary">查看文章</th>
	</tr>
	<%@ include file="page1.file" %> 
	<c:forEach var="articleVO" items="${list}" begin="<%=pageIndex%>" end="<%=pageIndex+rowsPerPage-1%>">
		<tr>
			<td>${articleVO.articleId}</td>
			<td>${articleVO.articleTitle}</td>
			<td>${articleVO.articleContent}</td>
<%-- 			<td>${articleVO.articleImage}</td> --%>
			<td>${articleVO.articleDate}</td>
			<td>${articleVO.articleDateChange}</td>
			<td>${articleVO.memberId}</td>
			<td>${articleVO.tourId}</td>
			<td>
			  <FORM METHOD="post" ACTION="<%=request.getContextPath()%>/article/ArticleServlet2" style="margin-bottom: 0px;">
			     <button class="button is-info is-outlined">查詢</button>
			     <input type="hidden" name="articleId"  value="${articleVO.articleId}">
			     <input type="hidden" name="action"	value="getOne_For_Display"></FORM>
			</td>
		</tr>
	</c:forEach>

    </table>
    <%@ include file="page2.file" %>
</section>
    
    
    
    
    
    <!-- 頁尾 -->
    <footer-component></footer-component>

    <script src="<%=request.getContextPath()%>/asset/js/bulma-init.js"></script>
  </body>
</html>
