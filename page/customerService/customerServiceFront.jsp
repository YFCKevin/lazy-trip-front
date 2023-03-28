<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<link rel="stylesheet" href="../../asset/css/my-bulma.css" />
<script src="https://kit.fontawesome.com/616f19a0b0.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>

<title>客服前台</title>

<style>
    .bi-x-lg:hover{
        cursor: pointer;
        filter: drop-shadow(2px 2px 2px #060C3C);
    }
    #btn-chat:hover{
    	filter: drop-shadow(2px 2px 2px #060C3C);
    }
    .column is-2, .column is-10{
        padding:0;
    }
    .panel{
        margin-bottom: 0px;
    }
    .card-footer{
        background-color: #F5F5F5;
    }
    .chat-window{
        bottom:0;
        margin-left:10px;
    }
    .chat-window > div > .panel{
        border-radius: 5px 5px 0 0;
    }
    .icon_minim{
        padding:2px 10px;
    }
    .msg_container_base{
        background: #e5e5e5;
        margin: 0;
        padding: 0 10px 10px;
        max-height:400px;
        overflow-x:hidden;
    }
    .top-bar {
        background: #38C0E8;
        color: white;
        padding: 10px;
        position: relative;
        overflow: hidden;
    }
    .msg_receive{
        padding-left:0;
        margin-left:0;
    }
    .msg_sent{
        padding-bottom:20px !important;
        margin-right:0;
    }
    .messages {
        background: white;
        padding: 10px;
        border-radius: 2px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        max-width:100%;
    }
    .messages > p {
        font-size: 13px;
        margin: 0 0 0.2rem 0;
    }
    .messages > time {
        font-size: 11px;
        color: #ccc;
    }
    .msg_container {
        padding: 10px;
        overflow: hidden;
        display: flex;
    }
    .avatar {
        position: relative;
    }

    .msg_sent > time{
        float: right;
    }
	.msg_container_base{
/* 	background-color: pink; */
	}
	
    .msg_container_base::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    }

    .msg_container_base::-webkit-scrollbar
    {
        width: 12px;
        background-color: #F5F5F5;
    }

    .msg_container_base::-webkit-scrollbar-thumb
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #38C0E8;
    }

    .btn-group.dropup{
        position:fixed;
        left:0px;
        bottom:0;
    }
    .hide {
	   display: none;
	}
	#chat-icon{
		position: fixed;
		bottom: 15px;
		right: 20px;
		border-radius:10px;
		background-color:rgba(0,0,0,.1);
	}
	#chatBox{
		position: fixed;
        right: 70px;
        bottom: 0px;
        z-index: 100;
	}
	.img-responsive {
        display: block;
        width: 100%;
    }
    #alert{
    	position: absolute;
    	top:-10px;
    	right:40px;
    	z-index: 1090;
    }
</style>
<body onunload="disconnect();">
<!-- service start -->

<!-- service image start -->
<div class="btn" id="chat-icon">
    <img src="<%=request.getContextPath()%>/page/customerService/images/phone.png" style="width: 50px;">
    <img src="<%=request.getContextPath()%>/page/customerService/images/alert.png" style="width: 30px;" id="alert" class="hide">
</div>
<c:if test="${empty sessionScope.member.id}">
	<script>
	        document.querySelector('#chat-icon').addEventListener('click', function(){
	        	window.location = '<%=request.getContextPath()%>/page/login.html';
	        });
	</script>
</c:if> 
<c:if test="${not empty sessionScope.member.id}">
	<!-- service image end  -->
	<div class="container hide" id="chatBox" style="width: 500px;">
	<div class="row chat-window col-md-12" id="chat_window_1" style="margin-left:10px;">
	    <div class="col-xs-12 col-md-12">
	        <div class="panel panel-default">
	            <!-- chat-title -->
	            <div class="panel-heading top-bar d-flex">
	                <div class="col-md-8 col-xs-8">
	                    <h5 class="panel-title">線上即時服務</h5>
	                </div>
	                <div class="col-md-4 col-xs-4" style="text-align: right;"><i class="bi bi-x-lg fs-5" id="close"></i></div>
	            </div>
	            <!-- chat-body -->
	            <div class="panel-body msg_container_base has-background-white-ter" id="msgContainer"></div>
	            <!-- chat-input -->
	            <div class="card-footer p-2">
							<div class="input-group" style="width:100%">
							<input class="input is-primary" id="btn-input" type="text" placeholder="請輸入訊息..." autocomplete="off" onkeydown="if (event.keyCode == 13) sendMessage();">
							</div>
							<div>
								<button class="button is-info is-outlined"
									onclick="sendMessage();">
									<span class="icon"> <i class="fas fa-paper-plane"></i>
									</span>
									
								</button>
							</div>
						</div>
	            </div>
	        </div>
	    </div>
	</div>
	<!-- service end -->
	<script>
			const ServerPoint = "/CustomerService/${sessionScope.member.id}";
		    const host = window.location.host;  //localhost:8081
		    const path = window.location.pathname; // '/lazytrip-servlet'
		    const webCtx = path.substring(0, path.indexOf('/', 1));
		    const endPointURL = "ws://" + host + webCtx + ServerPoint;
		
		    const msgContainer = document.querySelector('#msgContainer');
		    const self = ${sessionScope.member.id};
		    let webSocket;		
	
	        let con = false;
	        let chatbox = document.querySelector('#chatBox');
	        document.querySelector('#chat-icon').addEventListener('click', function(){
	        	chatbox.classList.toggle('hide');
	        	msgContainer.scrollTop = msgContainer.scrollHeight;
	        	if(!document.querySelector('#alert').classList.contains('hide')){
               	 document.querySelector('#alert').classList += ' hide';
                }
	        	if(con === false){
	                connect();
	            };
	        });
	        
	        document.querySelector('#close').addEventListener('click', function(){
	        	chatbox.classList += ' hide';
	        });
	
	        const user = '<div class="column is-2 col-xs-2 avatar">'
			            + '<img src="<%=request.getContextPath()%>/page/customerService/images/profile.png" class="img-responsive">'
			    		+ '</div>';
			const employee = '<div class="column is-2 col-xs-2 avatar">'
	                	+ '<img src="<%=request.getContextPath()%>/page/customerService/images/customer-service.png" class="img-responsive">'
	                    + '</div>';
	
		     function connect() {
		         // create a websocket
		         webSocket = new WebSocket(endPointURL);
		         webSocket.onopen = function(event) {
		             console.log("Connect Success!");
		             con = true;
		             let jsonObj = {
						"type" : "history",
						"sender" : self,
						"receiver" : "employee",
					};
		    	webSocket.send(JSON.stringify(jsonObj));
		     };
	         
	         webSocket.onmessage = function(event) {
	             let jsonObj = JSON.parse(event.data);
	             if ("history" === jsonObj.type) {
	                 msgContainer.innerHTML = '';
	              	// 這行的jsonObj.message是從redis撈出跟客服的歷史訊息，再parse成JSON格式處理
	                 let messages = JSON.parse(jsonObj.message);
	                 for (let i = 0; i < messages.length; i++) {
	                     let div = document.createElement('div');
	                     div.className = "row msg_container";
	                     let historyData = JSON.parse(messages[i]);
	                     let showMsg = historyData.message;
	                     let time = historyData.time;
	                     let content = '';
	                  	// 根據發送者是自己還是對方來給予不同的html
	                     if(historyData.sender === self){
	                         content = '<div class="column is-10 col-xs-10">'
	                              + '<div class="messages msg_receive">'
	                              + '<p>' + showMsg + '</p>'
	                              + '<time>' + '${sessionScope.member.username} • '
	                              + time + '</time></div></div>' + user;
	                     }else{
	                         content = employee + '<div class="column is-10 col-xs-10">'
	                           + '<div class="messages msg_receive">'
	                           + '<p>' + showMsg + '</p>'
	                           + '<time>' + '客服人員 ： '
	                           + time + '</time></div></div>';
	                     }
	                     div.innerHTML = content;
	                     msgContainer.appendChild(div);
	                 }
	                 msgContainer.scrollTop = msgContainer.scrollHeight;
	             }else if ("chat" === jsonObj.type) {
	                     let div = document.createElement('div');
	                     div.className = "row msg_container";
	                     let showMsg = jsonObj.message;
	                     let time = jsonObj.time;
	                     let content = '';
	                  	// 根據發送者是自己還是對方來給予不同的html
	                     if(jsonObj.sender === self){
	                         content = '<div class="column is-10 col-xs-10">'
	                                 + '<div class="messages msg_receive">'
	                                 + '<p>' + showMsg + '</p>'
	                                 + '<time>' + '${sessionScope.member.username} • '
	                                 + time + '</time></div></div>' + user;
	                     }else{
	                         content = employee + '<div class="column is-10 col-xs-10">'
	                                 + '<div class="messages msg_receive">'
	                                 + '<p>' + showMsg + '</p>'
	                                 + '<time>' + '客服人員 ： '
	                                 + time + '</time></div></div>';
	                     }
	                     div.innerHTML = content;
	                     msgContainer.appendChild(div);
	                     if(chatbox.classList.contains('hide')){
	                    	 document.querySelector('#alert').classList.toggle('hide');
	                     }else{
		                 	 msgContainer.scrollTop = msgContainer.scrollHeight;
	                     }
	             }else if("noEmployee" === jsonObj.type){
	            	 let div = document.createElement('div');
                     div.className = "row msg_container";
                     let content = employee + '<div class="column is-10 col-xs-10">'
			                     + '<div class="messages msg_receive">'
			                     + '<p>您好，目前客服人員未在線，請留下您要的問題，我們將於第一時間回覆您</p>'
			                     + '<time>' + '客服人員 ： now</time></div></div>';
                     div.innerHTML = content;
                     msgContainer.appendChild(div);
                     msgContainer.scrollTop = msgContainer.scrollHeight;
	             }
	         };
	     };
	
	
	     function sendMessage() {
	         let inputMessage = document.getElementById("btn-input");
	         let message = inputMessage.value.trim();
	
	         if (message === "") {
	             alert("您未輸入訊息");
	             inputMessage.focus();
	         } else {
	             let now = new Date();
	             let nowStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-'
	                         + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes();
	             var jsonObj = {
	                 "type" : "chat",
	                 "sender" : self,
	                 "receiver" : "employee",
	                 "message" : message,
	                 "time" : nowStr,
	                 "status" : "unread"
	             };
	             webSocket.send(JSON.stringify(jsonObj));
	             inputMessage.value = "";
	             inputMessage.focus();
	         };
	     };
	
	     function disconnect() {
	     	let jsonObj = {
			"type" : "offline",
			"sender" : self,
			"receiver" : "employee",
	};
	   webSocket.send(JSON.stringify(jsonObj));
	   webSocket.close();
	  }
	 </script>
 </c:if>
</body>
