<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="article.model.*"%>
<%@ page import="article.service.*"%>
<%@ page import="java.util.*"%>
<%@ page import=" member.model.*"%>

<%
ArticleVO articleVO = (ArticleVO) request.getAttribute("articleVO"); //EmpServlet.java(Concroller), 存入req的empVO物件

Member member = (Member)session.getAttribute("member");
Integer memberId = member.getId();


  ArticleService articleSvc = new ArticleService();
  List<ArticleVO> list = articleSvc.getOneByMember(memberId); //先將會員ID寫死為1
  pageContext.setAttribute("list",list);
%>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>我的文章</title>
<link rel="stylesheet" href="<%=request.getContextPath()%>/asset/css/my-bulma.css" />
<link rel="stylesheet" href="" />
<script src="https://kit.fontawesome.com/0548105e54.js"
	crossorigin="anonymous"></script>
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

	<div class="columns"
		style="margin: 15px 5px 15px; display: flex; align-items: center;">
		<b style="font-size: 40px;"> 我的文章 </b>
		<a href="<%=request.getContextPath()%>/page/article/addArticle.jsp"><button class="button is-link is-outlined" style="margin-left: 990px ">
    		新增
    	</button></a>

	</div>
<section class="section">
	<table
		class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" 
		style="table-layout:fixed;"
		>
		<tr>
			<th>文章編號</th>
			<th>文章標題</th>
			<th>文章內容</th>
			<th>發布時間</th>
			<th>修改時間</th>
			<th>行程編號</th>
			<th>查詢</th>
			<th>修改</th>
			<th>刪除</th>
		</tr>
			<c:forEach var="articleVO" items="${list}"  >
		<tr>
			<td>${articleVO.articleId}</td>
			<td style="overflow:hidden;text-overflow: ellipsis;">${articleVO.articleTitle}</td>
			<td>${articleVO.articleContent}</td>
			<td>${articleVO.articleDate}</td>
			<td>${articleVO.articleDateChange}</td>
			<td>${articleVO.tourId}</td>
			
			<td>
			  <FORM METHOD="post" ACTION="<%=request.getContextPath()%>/article/ArticleServlet2" style="margin-bottom: 0px;">
			     <button class="button is-info is-outlined">查詢</button>
			     <input type="hidden" name="articleId"  value="${articleVO.articleId}">
			     <input type="hidden" name="action"	value="getOne_For_Display"></FORM>
			</td>
			<td>
				<FORM METHOD="post"
					ACTION="<%=request.getContextPath()%>/article/ArticleServlet2"
					style="margin-bottom: 0px;">
					<a href="updateArticle.jsp"> <button class="button is-success is-outlined">修改</button></a>
					<input type="hidden" name="articleId" value="${articleVO.articleId}"> 
					<input type="hidden" name="action" value="getOne_For_Update">
				</FORM>
			</td>
			<td>
				<FORM METHOD="post"
					ACTION="<%=request.getContextPath()%>/article/ArticleServlet2"
					style="margin-bottom: 0px;">
					<button class="button is-danger is-outlined">刪除</button>
					<input type="hidden"  name="articleId" value="${articleVO.articleId}">
					<input	type="hidden" name="action" value="delete">
				</FORM>
			</td>
		</tr>
		</c:forEach>


	</table>
</section>







    <!-- 頁尾 -->
    <footer-component></footer-component>

	<script src="<%=request.getContextPath()%>/asset/js/bulma-init.js"></script>
</body>
</html>