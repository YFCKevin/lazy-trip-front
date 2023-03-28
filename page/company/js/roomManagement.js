//一開頁面就抓到資料
$(function () {
  console.log('init');
  init();
  
  $(".trans-right-roomManagement").removeClass("none");      
  $(".trans-right-roomAdd").addClass("none")
  $(".trans-right-orderShow").addClass("none")
  $(".trans-right-orderData").addClass("none")
});
let roomList = [];
let companyID;
let companyId;
let roomTypeID=null;
const loc = location.origin;
function init() {
	//getCookie
  companyId = getCookie("companyId");
  let companyName =getCookie("companyUsername");
  let companyImg =getCookie("companyImg");
  console.log(companyImg);
  $("#showCompanyName").text(companyName);  
  // $("#companyImg").attr("src", "data:image/*;base64,"+companyImg);
  roomList = [];
  console.log(companyId);
  
  $.ajax({
    url: `${loc}/lazy-trip-back/roomtypeservlet`,
    type: "POST",
    data: {
      action:'getAllByCompanyID',
      companyID:companyId
    }, // 將物件資料(不用雙引號) 傳送到指定的 url

    success: function (data) {
	let companyImg = data[0].companyImg;
	 $("#companyImg").attr("src", "data:image/*;base64,"+companyImg);
        console.log(data);
      for (let i = 0; i < data.length; i++) {
        roomList.push({
          roomTypeID: data[i].roomTypeID,
          companyID: data[i].companyID,
          roomTypeName: data[i].roomTypeName,
          roomTypePerson: data[i].roomTypePerson,
          roomTypeQuantity: data[i].roomTypeQuantity,
          roomTypePrice: data[i].roomTypePrice,
          roomTypeImgVO: data[i].roomTypeImgVO,
          roomDateVo: data[i].roomDateVo	  
        });
      } 
      document.querySelector("tbody.roomList").innerHTML = "";
      renderRoomData(roomList);
      console.log(roomList);
    },
    error: function (xhr) {
      console.log("error");
    },
  });
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// 事件觸發 UI 常數
//左欄位
const left_show_roomAdd = document.getElementById("left-roomAdd");  
const left_show_roomManagement = document.getElementById("left-roomManagement");
const left_show_orderData = document.getElementById("left-orderData");
const left_show_orderShow = document.getElementById("left-orderShow");

//右欄位
const right_show_roomManagement = $(".trans-right-roomManagement");
const right_show_roomAdd = $(".trans-right-roomAdd");
const right_show_orderShow = $(".trans-right-orderShow");
const right_show_orderData = $(".trans-right-orderData");

//房間總覽介面切換按鈕
left_show_roomManagement.addEventListener("click",(event) => {
    console.log(111);
    $(".trans-right-roomManagement").removeClass("none")
    $(".trans-right-roomAdd").addClass("none")
    $(".trans-right-orderShow").addClass("none")
    $(".trans-right-orderData").addClass("none")
    init();      
});

  //房型新增修改介面切換按鈕
left_show_roomAdd.addEventListener("click",(event) => {
    console.log(111);
    $(".trans-right-roomManagement").addClass("none")
    $(".trans-right-roomAdd").removeClass("none")
    $(".trans-right-orderShow").addClass("none")
    $(".trans-right-orderData").addClass("none")

    $(".updateBtn").addClass("-none")
    $("#roomAddInsert").removeClass("-none") 
});

//廠商訂單介面切換按鈕
left_show_orderShow.addEventListener("click",(event) => {
  console.log(333);
 
  $(".trans-right-roomManagement").addClass("none")
  $(".trans-right-roomAdd").addClass("none")
  $(".trans-right-orderShow").removeClass("none")
  $(".trans-right-orderData").addClass("none")
  orderShowInit();
});

//房型總覽介面搜尋按鈕
$("button.roomTypeIDSearch").on("click",(event) => {
  let searchValue = $("#searchRoomTypeID").val();
  let newRoomList = []
  console.log(roomList.length);
  for (let i = 0; i < roomList.length; i++) {
    console.log(roomList[i].roomTypeID);
    if(roomList[i].roomTypeID == searchValue){
      
      newRoomList.push({
        roomTypeID: roomList[i].roomTypeID,
        companyID: roomList[i].companyID,
        roomTypeName: roomList[i].roomTypeName,
        roomTypePerson: roomList[i].roomTypePerson,
        roomTypeQuantity: roomList[i].roomTypeQuantity,
        roomTypePrice: roomList[i].roomTypePrice,
        roomTypeImgVO: roomList[i].roomTypeImgVO,
        roomDateVo: roomList[i].roomDateVo	
      });
    }
    document.querySelector("tbody.roomList").innerHTML = "";
    renderRoomData(newRoomList);
    console.log('new___'+newRoomList);
  } 
});

//雙人房&&三人房按鈕
const twoRoom_button = $("button.twoRoom");
const threeRoom_button = $("button.threeRoom");
//雙人房按鈕觸發事件
$("button.twoRoom").on("click",(event) => {
  let newRoomList = []
  console.log(roomList.length);
  //篩選雙人房的資料
  for (let i = 0; i < roomList.length; i++) {
    console.log(roomList[i].roomTypePerson);
    if(roomList[i].roomTypePerson == 2){
      newRoomList.push({
        roomTypeID: roomList[i].roomTypeID,
        companyID: roomList[i].companyID,
        roomTypeName: roomList[i].roomTypeName,
        roomTypePerson: roomList[i].roomTypePerson,
        roomTypeQuantity: roomList[i].roomTypeQuantity,
        roomTypePrice: roomList[i].roomTypePrice,
        roomTypeImgVO: roomList[i].roomTypeImgVO,
        roomDateVo: roomList[i].roomDateVo	
      });
    }
    //篩選後送到前端
    document.querySelector("tbody.roomList").innerHTML = "";
    renderRoomData(newRoomList);
    console.log('new___'+newRoomList);
  } 
});

//房型刪除按鈕
$("tbody.roomList").on("click","button#roomAddDelete",function() {
  let newRoomTypeID = $(this).closest("tr").attr("data-card");
  console.log(newRoomTypeID);
  $.ajax({
       url: `${loc}/lazy-trip-back/roomtypeservlet`,
    type: "POST",
    data: {
      action:'delete',
           roomTypeID: newRoomTypeID,
          }, 
    success: function (data) {
  //顯示成功提示
      
      $("#ligthtboxText").text('刪除成功');
      $(".trip_delete_lightbox").removeClass("none");
      
      //點擊確認按鈕
      $("#ligthtboxSuccess").on("click",(event) => {
        console.log('successBtn');
        location.reload();
      });
      console.log(data);
      
    },
    error: function (xhr) {
            console.log("error");
    },
  });
});


//房型修改按鈕
$("tbody.roomList").on("click","button#roomAddUpdate",function() {
  
  //取得目前該筆資料
  
  let roomTypeID = $(this).closest("tr").attr("data-card");
  let roomTypeName =  $(this).closest("tr.roomList").find("td:nth-child(2)").text()
  let roomTypePerson =  $(this).closest("tr.roomList").find("td:nth-child(3)").text()
  let roomTypeQuantity =  $(this).closest("tr.roomList").find("td:nth-child(4)").text()
  let roomTypePrice =  $(this).closest("tr.roomList").find("td:nth-child(6)").text()
 
  //將資料帶入修改頁面  
  $("#roomTypeID").val(roomTypeID);
  $("#roomTypeName").val(roomTypeName);
  $("#roomTypePerson").val(roomTypePerson);
  $("#roomTypeQuantity").val(roomTypeQuantity);
  $("#roomTypePrice").val(roomTypePrice);

  $(".updateBtn").removeClass("-none")
  $("#roomAddInsert").addClass("-none")
  $(".trans-right-roomManagement").addClass("none")
  $(".trans-right-roomAdd").removeClass("none")
  $(".trans-right-orderShow").addClass("none")
  $(".trans-right-orderData").addClass("none")
});


//三人房按鈕觸發事件
$("button.threeRoom").on("click",(event) => {
  let newRoomList = []
  console.log(roomList.length);
  for (let i = 0; i < roomList.length; i++) {
    console.log(roomList[i].roomTypePerson);
    if(roomList[i].roomTypePerson == 3){
      newRoomList.push({
        roomTypeID: roomList[i].roomTypeID,
        companyID: roomList[i].companyID,
        roomTypeName: roomList[i].roomTypeName,
        roomTypePerson: roomList[i].roomTypePerson,
        roomTypeQuantity: roomList[i].roomTypeQuantity,
        roomTypePrice: roomList[i].roomTypePrice,
        roomTypeImgVO: roomList[i].roomTypeImgVO,
        roomDateVo: roomList[i].roomDateVo	
      });
    }
    document.querySelector("tbody.roomList").innerHTML = "";
    renderRoomData(newRoomList);
    console.log('new___'+newRoomList);
  } 
});

//新增房型ID用法 上傳資料
$("#roomAddInsert").on("click",(event) => {
 
  let newRoomTypeName = $("#roomTypeName").val();
  let newRoomTypePerson = $("#roomTypePerson").val();
  let newRoomTypeQuantity = $("#roomTypeQuantity").val();
  let newRoomTypePrice = $("#roomTypePrice").val();
  
//房型新增if判斷式
if(newRoomTypeName.trim()== ''){    
  alert('請輸入房型名稱');console.log(newRoomTypeName);
  return;
}
  if(newRoomTypePerson.trim()== ''){
    alert('請輸入房間人數');
    return;
  }
  if(newRoomTypeQuantity.trim()== ''){
    alert('請輸入房間總數');
    return;
  }
  if(newRoomTypePrice.trim()== ''){
    alert('請輸入房間價格');
    return;
  }

  $.ajax({
    url: `${loc}/lazy-trip-back/roomtypeservlet`,
      type: "POST",
    data: {
      action:'insert',
      companyID:companyId,
      
      roomTypeName: newRoomTypeName,
      roomTypePerson: newRoomTypePerson,
      roomTypeQuantity: newRoomTypeQuantity,
      roomTypePrice: newRoomTypePrice
    }, 

    success: function (data) {
      //顯示成功提示
      
      $("#ligthtboxText").text('上傳成功');
      $(".trip_delete_lightbox").removeClass("none");
      
      //點擊確認按鈕
      $("#ligthtboxSuccess").on("click",(event) => {
        console.log('successBtn');
        location.reload();
      });
      console.log(data);
      
    },
    error: function (xhr) {
      console.log("error");
    },
  });
});
//修改按鈕送出修改資料
$("#roomAddUpdateSubmit").on("click",(event) => {
  let newUpdateRoomTypeID = $("#roomTypeID").val();
  console.log(newUpdateRoomTypeID);
  let newRoomTypeName = $("#roomTypeName").val();
  let newRoomTypePerson = $("#roomTypePerson").val();
  let newRoomTypeQuantity = $("#roomTypeQuantity").val();
  let newRoomTypePrice = $("#roomTypePrice").val();

  const fileInput = document.getElementById("fileToUpload");
  const file = fileInput.files[0];
  if(file){
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const base64Image = reader.result.split(",")[1];
    //上傳圖片
    $.ajax({
      url: `${loc}/lazy-trip-back/roomtypeimgservlet`,
      type: "POST",
      data: {
        action:'insert',
        roomTypeID: newUpdateRoomTypeID,//動態寫法
        roomTypeImgID: 0,
        roomTypeImg: base64Image
     },
    
      success: function (data) {
        console.log(data);
      },
      error: function (xhr) {
        console.log("error");
      },
    });
  };
};

  //房型修改if判斷式

  if(newRoomTypeName.trim()== ''){    
    alert('請輸入房型名稱');console.log(newRoomTypeName);
    return;
  }
  if(newRoomTypePerson.trim()== ''){
    alert('請輸入房間人數');
    return;
  }
  if(newRoomTypeQuantity.trim()== ''){
    alert('請輸入房間總數');
    return;
  }
  if(newRoomTypePrice.trim()== ''){
    alert('請輸入房間價格');
    return;
  }
    let companyId = getCookie("companyId");
  $.ajax({
    url: `${loc}/lazy-trip-back/roomtypeimgservlet`,
    type: "POST",
    data: {
      action:'update',
      companyID:companyId,
      roomTypeID: newUpdateRoomTypeID,//動態寫法
      roomTypeName: newRoomTypeName,
      roomTypePerson: newRoomTypePerson,
      roomTypeQuantity: newRoomTypeQuantity,
      roomTypePrice: newRoomTypePrice
   },

    success: function (data) {
      //顯示成功提示      
      console.log('successBtn55555555555555');
      $("#ligthtboxText").text('修改成功');
      $(".trip_delete_lightbox").removeClass("none");
      
      //點擊確認按鈕
      $("#ligthtboxSuccess").on("click",(event) => {
        console.log('successBtn');
        location.reload();
      });
      // console.log(data);
    },
    error: function (xhr) {
      console.log("error");
    },
  });
    
});


// 將資料渲染到主視窗
function renderRoomData(roomList) {
    let newList = "";
    for (let i = 0; i < roomList.length; i++) {
      var id ="roomAddDate"+i;
      var none = "";
      
      var img = ""
      if(roomList[i].roomTypeImgVO != null && roomList[i].roomTypeImgVO.roomTypeImgOutput != null){
        img =roomList[i].roomTypeImgVO.roomTypeImgOutput
      }
      //日期邏輯
      let dateList =""
      for(let x = 0; x < roomList[i].roomDateVo.length; x++){
        if(roomList[i].roomDateVo[x].orderCheckInDate ==null && roomList[i].roomDateVo[x].orderCheckOutDate==null){
          none ="-none";
        }
        let start = roomList[i].roomDateVo[x].orderCheckInDate;
        let end =roomList[i].roomDateVo[x].orderCheckOutDate;
        dateList+=`<button class="button is-primary roomAddDate ${none}" id=${id+x} data-start=${start} data-end=${end}>訂房時間</button>`;

      }
      console.log(dateList);

      newList+=`<tr data-card=${roomList[i].roomTypeID} class="roomList" id="roomList">
                  <td >${roomList[i].roomTypeID}</td>  
                  <td>${roomList[i].roomTypeName}</td>
                  <td>${roomList[i].roomTypePerson}</td>
                  <td>${roomList[i].roomTypeQuantity}</td>
                  
                  <td><img src="data:image/png;base64, ${img}" alt="Image" style="width:400; height:300px;"></td>
                  <td>${roomList[i].roomTypePrice}</td>
                  <td> <button class="button is-primary" id="roomAddUpdate">修改</button></td>
                  <td> <button class="button is-primary" id="roomAddDelete">刪除</button></td>                  
                  <td> ${dateList}</td>
                  <td class="none">${roomList[i].orderCheckInDate}</td>
                  <td class="none">${roomList[i].orderCheckOutDate}</td>
                </tr>`;
    }
    $("tbody.roomList").html(newList);
  }

  //日期選擇器
  $("tbody.roomList").on("click","button.roomAddDate",function(index) {
    console.log(8888888888);
     console.log(index.target.id);
     var id="#"+index.target.id;
     let start =  $(id).data('start');
     let end =  $(id).data('end');
    var calendar = bulmaCalendar.attach(id, {
      color: "link",
      startDate:start,
      endDate:end,
      enableTime: false,
      timePicker: false,
      dateFormat: 'yyyyMMdd',
      displayMode: 'dialog',
      readonly: true,
      isRange: true,           // 設定日期選擇器為範圍模式
      showFooter: false
    });
    console.log(1111111111111);
    // calendar.show();
  });
  //上傳圖片顯示在瀏覽器
  function previewImage() {
    var fileInput = document.getElementById("fileToUpload");
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = document.getElementById("preview");
      img.src = e.target.result;
    }
    reader.readAsDataURL(file);
}

//ordershow抓取ordertable資料function
let orderShowList = [];

function orderShowInit() {
  orderShowList = [];
    $.ajax({
      url: `${loc}/lazy-trip-back/Order.do?type=showOrderByCompanyID&companyID=${companyId}`,
    type: "GET",
     // 將物件資料(不用雙引號) 傳送到指定的 url
    success: function (data) {
      console.log(797979);
        console.log(data);
       
      for (let i = 0; i < data.length; i++) {
        // let orderPayDatetime ="";
        // if(data[i].orderPayDatetime ==null){
        //   orderPayDatetime ="無資料";
        // }else{
        //   orderPayDatetime =data[i].orderPayDatetime;
        // }
        orderShowList.push({
          orderID: data[i].orderID,
          orderCheckInDate: data[i].orderCheckInDate,
          orderCheckOutDate: data[i].orderCheckOutDate,
          orderNumberOfNights: data[i].orderNumberOfNights,
          orderTotalPrice: data[i].orderTotalPrice,
          orderStatus: data[i].orderStatus,
          orderCreateDatetime: data[i].orderCreateDatetime,
          orderPayDeadline: data[i].orderPayDeadline,
          orderPayDatetime: data[i].orderPayDatetime !=null ?orderPayDatetime =data[i].orderPayDatetime:"無資料" ,
          travelerName: data[i].travelerName,
          travelerIDNumber: data[i].travelerIDNumber,
          travelerEmail: data[i].travelerEmail,
          travelerPhone: data[i].travelerPhone,
        });
      } 
      console.log(7744);
      console.log(orderShowList);
      // document.querySelector("tbody.orderShowList").innerHTML = "";
      renderOrderShow(orderShowList);
    },
    error: function (xhr) {
      console.log("error");
    },
  });
}

//將資料渲染到orderShow
function renderOrderShow(orderShowList) {
  console.log(8585);
  let newOrderList = [];
  for (let i = 0; i < orderShowList.length; i++) {
  newOrderList+=`<tr data-card=${orderShowList[i].orderID} class="orderShowList" id="orderShowList">
    <td >${orderShowList[i].orderID}</td>  
    <td>${orderShowList[i].orderCheckInDate}</td>
    <td>${orderShowList[i].orderCheckOutDate}</td>
    <td>${orderShowList[i].orderNumberOfNights}</td>  
    <td>${orderShowList[i].orderTotalPrice}</td>
    <td>${orderShowList[i].orderStatus}</td>
    <td>${orderShowList[i].orderCreateDatetime}</td>
    <td>${orderShowList[i].orderPayDeadline}</td>  
    <td>${orderShowList[i].orderPayDatetime}</td>
    <td>${orderShowList[i].travelerName}</td>
    <td>${orderShowList[i].travelerIDNumber}</td>
    <td>${orderShowList[i].travelerEmail}</td>  
    <td>${orderShowList[i].travelerPhone}</td>
    
    <td> <button class="button is-primary is-small" id="orderdetailbutton">訂單明細</button></td>
  </tr>`
  $("tbody.orderShowList").html(newOrderList);
  }
  console.log(newOrderList);
}

//訂單明細按鈕
$(document).on("click","button#orderdetailbutton",function() {
  let neworderDetailID = $(this).closest("tr").attr("data-card");
  let orderID =  $(this).closest("tr.orderShowList").find("td:nth-child(1)").text(); 
  let orderDataList=[];
  console.log(neworderDetailID);
  console.log(orderID);
  $.ajax({
    url: `${loc}/lazy-trip-back/Order.do?type=showOrderDetailByOrderID&orderID=${orderID}`,
    type: "GET",
            success: function (data) {
            console.log(data);
          for (let i = 0; i < data.length; i++) {
            orderDataList.push({
              orderDetailID: data[i].orderDetailID,
              orderID: data[i].orderID,
              roomTypeID: data[i].roomTypeID,
              roomTypeName: data[i].roomTypeName,
              roomTypePerson: data[i].roomTypePerson,
              orderDetailRoomPrice: data[i].orderDetailRoomPrice,
              orderDetailRoomQuantity: data[i].orderDetailRoomQuantity,
              
            });
          } 
          document.querySelector("tbody.orderDataList").innerHTML = "";
          renderOrderData(orderDataList);
          console.log(orderDataList);
        },
        error: function (xhr) {
          console.log("error");
        },
      });
    })

//將orderdetail table資料渲染到orderData
function renderOrderData(orderDataList) {
  let newOrderDataList = [];
  for (let i = 0; i < orderDataList.length; i++) {
  newOrderDataList+=`<tr data-card=${orderDataList[i].orderID} class="orderDataList" id="orderDataList">
    <td >${orderDataList[i].orderDetailID}</td>  
    <td>${orderDataList[i].orderID}</td>
    <td>${orderDataList[i].roomTypeID}</td>  
    <td>${orderDataList[i].roomTypeName}</td>
    <td>${orderDataList[i].roomTypePerson}</td>
    <td>${orderDataList[i].orderDetailRoomPrice}</td>
    <td>${orderDataList[i].orderDetailRoomQuantity}</td>  
    </tr>`
  $("tbody.orderDataList").html(newOrderDataList);
  }

  $(".trans-right-roomManagement").addClass("none")
  $(".trans-right-roomAdd").addClass("none")
  $(".trans-right-orderShow").addClass("none")
  $(".trans-right-orderData").removeClass("none")
}

//3d環景btn
$(document).ready(function() {
  $("#3dbtn").on("click", function(){
    window.location.href = `${loc}/Photo_Sphere3DViewer/Room_Sphere3DView.html`;
  })
});
