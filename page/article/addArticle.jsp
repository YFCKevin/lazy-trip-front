<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="article.model.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.sql.*"%>


<%
// String adminId = "1";
// String memberId = "1";

ArticleVO articleVO = (ArticleVO) request.getAttribute("articleVO"); //EmpServlet.java(Concroller), 存入req的empVO物件
%>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>新增文章</title>
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
		<b style="font-size: 40px;"> 新增文章 </b>
		<!-- 		<button class="button is-link is-outlined " style="margin-left: 990px">新增</button> -->

	</div>


	<%-- 錯誤表列 --%>
	<c:if test="${not empty errorMsgs}">
		<font style="color: red">請修正以下錯誤:</font>
		<ul>
			<c:forEach var="message" items="${errorMsgs}">
				<li style="color: red">${message}</li>
			</c:forEach>
		</ul>
	</c:if>

	<section class="section">
	<FORM METHOD="post" ACTION="<%=request.getContextPath()%>/article/ArticleServlet2" name="form1" enctype="multipart/form-data">
		<table style="margin-left: 10px">
			<tr>
				<td>文章標題:</td>
				<td><input type="TEXT" name="articleTitle" size="45"
					placeholder="請輸入標題"
					value="<%=(articleVO == null) ? "" : articleVO.getArticleTitle()%>" /></td>
			</tr>
			<tr>
				<td>文章內容:</td>
				<td>
					<div class="control is-loading">
						<textarea class="textarea" name="articleContent"
							placeholder="請輸入內容"><%=(articleVO == null) ? "" : articleVO.getArticleContent()%>
 		 		</textarea>
					</div>
				</td>
			</tr>

			<tr>
				<td>新增圖片：</td>
				<td>
					<div id="file-js-example" class="file has-name">
						<label class="file-label">
						 <input class="file-input"
							type="file" name="articleImage"  value="<%=(articleVO == null) ? "" : articleVO.getArticleImage()%>">
							 <span class="file-cta">
								<span class="file-icon"> <i class="fas fa-upload"></i>
							</span> <span class="file-label"> 選擇圖片 </span>
						</span> <span class="file-name"> 未選擇圖片 </span>
						</label>
					</div>
				</td>
			</tr>
			

<!-- 			<tr> -->
<!-- 				<td>新增圖片：</td> -->
<%-- 				<td><input type="file" name="articleImage" value="<%=(articleVO == null) ? "" : articleVO.getArticleImage()%>"></td> --%>
<!-- 			</tr> -->

			<tr>
				<td>日期:</td>
				<td><input name="articleDate" id="f_date1" type="text"
					readonly="readonly" style="border: none"></td>
			</tr>

			<tr>
				<td>行程編號:</td>
				<td><input type="TEXT" name="tourId" size="45"
					 style="border: none"
					value="<%=(articleVO == null) ? "1" : articleVO.getTourId()%>" /></td>
			</tr>

			
		</table>
		<br> <input type="hidden" name="action" value="insert">
		<button class="button is-link is-outlined" style="margin-left: 10px">送出新增
		</button>


	</FORM>
	</section>
	
	
<script>
  const fileInput = document.querySelector('#file-js-example input[type=file]');
  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
      const fileName = document.querySelector('#file-js-example .file-name');
      fileName.textContent = fileInput.files[0].name;
    }
  }
</script>



	<%
	java.sql.Timestamp articleDate = null;
	try {
		articleDate = articleVO.getArticleDate();
	} catch (Exception e) {
		articleDate = new java.sql.Timestamp(System.currentTimeMillis());
	}
	%>
	<link rel="stylesheet" type="text/css"
		href="<%=request.getContextPath()%>/page/datetimepicker/jquery.datetimepicker.css" />
	<script src="<%=request.getContextPath()%>/page/datetimepicker/jquery.js"></script>
	<script
		src="<%=request.getContextPath()%>/page/datetimepicker/jquery.datetimepicker.full.js"></script>


	<script>
		$.datetimepicker.setLocale('zh');
		$('#f_date1').datetimepicker({
			theme : '',
			timepicker : true,
			step : 1,
			format : 'Y-m-d H:i:s', //format:'Y-m-d H:i:s',
			value : new Date(),
		});
	</script>






    <!-- 頁尾 -->
    <footer-component></footer-component>

	<script src="<%=request.getContextPath()%>/asset/js/bulma-init.js"></script>
</body>
</html>