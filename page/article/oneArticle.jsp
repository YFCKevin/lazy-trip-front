<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="article.model.*"%>
<%@ page import="java.util.*"%>


<%-- ${articleVO.articleId} --%>
<%-- ${articleVO.articleDate} --%>
<%-- ${articleImageVO.image} --%>
<%
ArticleVO articleVO = (ArticleVO) request.getAttribute("articleVO"); //EmpServlet.java(Concroller), 存入req的empVO物件


  
//   ArticleImageVO articleImageVO = (ArticleImageVO)request.getAttribute("articleImageVO");
%>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleVO.articleTitle}</title>
    <link rel="stylesheet" href="<%=request.getContextPath()%>/asset/css/my-bulma.css" />
    <link rel="stylesheet" href="#" />
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


	<div class="columns"
		style="margin: 15px 5px 15px; display: flex; align-items: center;">
		<b style="font-size: 40px;"> ${articleVO.articleTitle} </b>
		<button class="button is-link is-outlined " style="margin-left: 990px">新增</button>

	</div>
	<section class="section">
       <table
      class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth "
    >
		<tr>
		<th class="has-background-primary-light has-text-primary">文章編號</th>
		<th class="has-background-primary-light has-text-primary">發布時間</th>
		<th class="has-background-primary-light has-text-primary">修改時間</th>
		<th class="has-background-primary-light has-text-primary">行程編號</th>
	</tr>
		<tr>
			<td>${articleVO.articleId}</td>
			<td>${articleVO.articleDate}</td>
			<td>${articleVO.articleDateChange}</td>
			<td>${articleVO.tourId}</td>
		</tr>
    </table>
    

    <div class="columns" style="margin-left: 5px;">
      <div class="column is-three-fifths">
        <div> ${articleVO.articleContent}</div>
        <div> 
        <img alt="" src="<%=request.getContextPath()%>/article/ArticleServlet2?articleId=${articleVO.articleId}" 
         width="200" height="200">
        </div>
      </div>
    </div>
    </section>








<!-- <span style="font-size: 24px; color:red;">Test123</span> -->
<hr>





      <!-- 頁尾 -->
    <footer-component></footer-component>
  
      <script src="<%=request.getContextPath()%>/asset/js/bulma-init.js"></script>
</body>
</html>