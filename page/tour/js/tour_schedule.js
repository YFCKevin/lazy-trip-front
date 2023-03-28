// 將主行程的標題、起訖日期、封面圖渲染在頁面上
let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let tourId = params.get("tourId");

// +想去哪裡玩的DOM元素，以及抓取其data-date
let btnAddTrip;
let currentDate;
let tourSchedule_arr = [];
let attraction_arr = [];
let tourSchedule_arr_ready = [];
// 排序用
let result_sort;
let date_change;

//修改景點時，觸發產生的變數
let targetAttraction;
let findDate;
let targetAttractionId;
let targetAttractionDate;
let getTourScheDate;
let getTourScheId;

const loc = location.origin;
// 會員
const specifier_id = parseCookieTokens(document.cookie).get("memId");
// ======= 輔助功能 =======
function parseCookieTokens(cookie) {
  let tokens = cookie.split("; ");
  let map = new Map();
  for (let token of tokens) {
    let keyValue = token.split("=");
    map.set(keyValue[0], keyValue[1]);
  }
  return map;
}

$(document).ready(function () {
  $(document).on("click", "div.sort", function () {
    location.reload();
  });
});

$(function () {
  init();
});

function init() {
  $.ajax({
    url: `${loc}/lazy-trip-back/TourQueryOneByTourId?tourId=${tourId}`,
    type: "GET",
    success: function (data) {
      initRenderTourData(data);
      $.ajax({
        url: `${loc}/lazy-trip-back/tourScheQueryOne?tourId=${tourId}`,
        type: "GET",
        success: function (data) {
          console.log(data);
          reload_sort(data);
          initRenderTourScheData(result_sort);
        },
        error: function (xhr) {
          console.log("error");
        },
      });
    },
    error: function (xhr) {
      console.log("error");
    },
  });
}

// 排序功能
function reload_sort(data) {
  if ($("div.dayTrip").children().length <= 0) {
    return;
  } else {
    result_sort = data.reduce((acc, cur) => {
      if (!acc[cur.date]) {
        acc[cur.date] = { schedule: [] };
      }
      acc[cur.date].schedule.push({
        startTime: cur.startTime,
        attractionId: cur.attractionId,
        attractionVO: cur.attractionVO,
        carRouteTime: cur.carRouteTime,
        endTime: cur.endTime,
        stayTime: cur.stayTime,
        tourScheduleId: cur.tourScheduleId,
      });
      return acc;
    }, {});
    Object.keys(result_sort).forEach(function (date) {
      result_sort[date].schedule.sort(function (a, b) {
        return (
          new Date("1970/01/01" + " " + a.startTime) -
          new Date("1970/01/01" + " " + b.startTime)
        );
      });
    });
  }
}

function initRenderTourData(data) {
  let tour_info = "";
  tour_info = `
  <div class="top" style= background-image:url(data:image/*;base64,${data.tourImg})>
    <div class="icon" style="">
      <div class="return return_tripList">
        <a href="javascript:;" class="return">          
          <i class="fas fa-arrow-left"></i>
        </a>
      </div>
      <div class="sort">
        <a href="javascript:;" class="sort">
          <i class="fas fa-sort-amount-down"></i> 
        </a>
      </div>  
    </div>
    <div class="top_text">
      <div class="title_date">
        <ul>
          <li class="title">${data.tourTitle}</li>
          <li class="date">${data.startDate} ~ ${data.endDate}</li>
        </ul>
      </div>
    </div>
  </div>
  `;
  $("div.top").html(tour_info);
  // 求得起訖天數差
  let startDateCal = new Date(data.startDate);
  let endDateCal = new Date(data.endDate);
  let diffTime = Math.abs(endDateCal - startDateCal);
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let tour_date = "";
  let tourSchedule_title = "";
  for (let i = 0; i <= diffDays; i++) {
    date_change = new Date(
      new Date(data.startDate).getTime() + i * 24 * 3600 * 1000
    )
      .toISOString()
      .slice(0, 10);
    tour_date += `
      <li class="day">
        <p>${date_change}</p>
        <p>第${i + 1}天</p>
      </li>
      `;
    $("ul.date_detail").html(tour_date);

    tourSchedule_title += `
      <div class="dayTrip" data-date=${date_change}>
        <header>
          <h2 class="dayTripBlock_label">
            <span>第${i + 1}天 | ${date_change}</span>
          </h2>
        </header>
        <section class="dayTripBlock" data-date=${date_change}></section>
        <div class="add_trip_box" data-date=${date_change}>
          <button class="button add_trip">+ 想去哪裡玩</button>
        </div>
      </div>
      <br />
      `;
  }
  $("div.schedule.lodge").html(tourSchedule_title);
}

function initRenderTourScheData(result_sort) {
  // 遍歷每個 section.dayTripBlock 元素
  $(`section.dayTripBlock[data-date]`).each(function () {
    // 取得當前 section.dayTripBlock 元素的 data-date 的值
    let date = $(this).data("date");
    // 檢查 result_sort 中是否存在對應date的schedule
    if (result_sort.hasOwnProperty(date)) {
      // 取得對應的schedule
      let schedule = result_sort[date].schedule;
      for (let i = 0; i < schedule.length; i++) {
        let dayTripBlock_all = `
        <div class="dayTripBlock_all" data-attrid=${schedule[i].attractionId} data-scheid=${schedule[i].tourScheduleId}>
          <ul class="dayTripBlock_locationInfo">
            <li class="dayTripBlock_locationInfoImg">
              <img src=${schedule[i].attractionVO.attractionImg}/>
            </li>
          <li class="dayTripBlock_locationInfoBlock">
            <ul class="dayTripBlock_locationInfoBlockDetail">
              <li class="dayTripBlock_locationInfoBlockDetail_time">
                <span>${schedule[i].stayTime}</span><span>分鐘</span>
                <span>${schedule[i].startTime}</span> - <span>${schedule[i].endTime}</span>
              </li>
              <li class="attraction_title">
                ${schedule[i].attractionVO.attractionTitle}
              </li>
              <li class="address">${schedule[i].attractionVO.location}</li>
            </ul>
          </li>
          <li class="dayTripBlock_featureNote">
            <i class="fas fa-book-open"></i>
          </li>
          <li class="dayTripBlock_featureEdit">
            <i class="fas fa-edit"></i>
          </li>
            <li class="dayTripBlock_featureDelete delete"></li>
        </ul>
          <div class="dayTripBlock_carRouteTime">
            <span class="icon"><i class="fas fa-car"></i></span>
            <p>約 ${schedule[i].carRouteTime}</p>
          </div>
        </div>`;
        $(this).append(dayTripBlock_all);
      }
    }
  });
}

// 點擊"想去哪裡玩"button，開啟右方資訊輸入欄
$(document).on("click", "div.add_trip_box > button.add_trip", function () {
  $("div.add_info").addClass("show");
  $("div.add_info > .create_plan_trip > ul > li.text").text("新增景點");
  $("li.addAttractionBtn").html(`
    <button class="button add_attraction">加入景點</button>
    `);
  btnAddTrip = $(this).closest("div.add_trip_box");
  currentDate = btnAddTrip.attr("data-date");
});

// 點擊右方資訊輸入欄的"返回"，將欄位隱藏
$("div.create_plan_trip > ul > li > div.return").on("click", function () {
  $("div.add_info").removeClass("show");
});

// ====================筆記彈跳視窗========================= //
$(document).on(
  "click",
  "ul.location > li.note > i.fas.fa-book-open",
  function (e) {
    $(".attraction_note_lightbox").removeClass("none");
    e.stopPropagation();
  }
);

// 取消按鈕
$("div.attraction_note_lightbox button.trip_close_btn").on(
  "click",
  function () {
    $(".attraction_note_lightbox").addClass("none");
  }
);

// 點擊半透明區塊，執行取消關閉作用
$(".attraction_note_lightbox").on("click", function () {
  $(".attraction_note_lightbox").addClass("none");
});

// 點擊contents區塊，不會關閉
$(".attraction_note_lightbox > .contents").on("click", function (e) {
  e.stopPropagation();
});

//======================景點修改內容======================== //
$(document).on(
  "click",
  "li.dayTripBlock_featureEdit > i.fas.fa-edit",
  function () {
    enableButton_editAttraction();
    targetAttraction = $(this).closest("div.dayTripBlock_all");
    getTourScheId = targetAttraction.attr("data-scheid");
    getTourScheDate = $(this).closest("section.dayTripBlock").attr("data-date");
    findDate = $(this).closest("section.dayTripBlock");
    targetAttractionId = targetAttraction.attr("data-attrId");
    targetAttractionDate = findDate.attr("data-date");
    $("div.add_info").addClass("show");
    $("div.add_info > .create_plan_trip > ul > li.text").text("修改景點資訊");
    $("li.addAttractionBtn").html(`
    <button class="button edit_attraction">修改</button>
    `);

    let currentStayTime = $(this)
      .closest("ul.dayTripBlock_locationInfo")
      .find("span:first-child")
      .text()
      .trim();
    let currentStartTime = $(this)
      .closest("ul.dayTripBlock_locationInfo")
      .find("span:nth-child(3)")
      .text()
      .trim();
    $("#start_time").val(currentStartTime);
    $("#stay_time").val(currentStayTime);
  }
);

function enableButton_editAttraction() {
  if (
    $("#start_time").val() !== "" &&
    $("#stay_time").val() !== "" &&
    $("input#search_input").val() !== "輸入位置"
  ) {
    $("button.edit_attraction").prop("disabled", false);
  } else {
    $("button.edit_attraction").prop("disabled", true);
  }
}
$("#start_time").on("keyup", enableButton_editAttraction);
$("#stay_time").on("keyup", enableButton_editAttraction);
$("input#search_input").on("keyup", enableButton_editAttraction);
// 更新
$(document).on("click", "button.edit_attraction", function () {
  //點擊"修改"後，將頁面收回，並將button改回成"加入景點"
  $("div.add_info").removeClass("show");
  $("li.addAttractionBtn").html(`
    <button class="button add_attraction">加入景點</button>
    `);
  let start_time = $("#start_time").val();
  let stay_time = $("#stay_time").val();
  $.ajax({
    url: `${loc}/lazy-trip-back/attractionCreate`,
    type: "POST",
    data: JSON.stringify({
      attractionTitle: selected_attraction.name,
      location: selected_attraction.address,
      latitude: selected_attraction.latitude,
      longitude: selected_attraction.longitude,
      attractionImg: selected_attraction.photo.getUrl(),
    }),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      attraction_arr.push({
        attractionTitle: data.attractionTitle,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        attractionImg: data.attractionImg,
        carRouteTime: carRoute_time,
        attractionId: data.attractionId,
      });
      $("div.attraction_detail_show").html("");
      for (let i = attraction_arr.length; i >= attraction_arr.length; i--) {
        targetAttractionId = attraction_arr[i - 1].attractionId;
      }
    },
    error: function (xhr) {
      console.log("error");
    },
    complete: function (xhr) {
      //更新DB
      $.ajax({
        url: `${loc}/lazy-trip-back/tourScheUpdate`,
        type: "POST",
        data: JSON.stringify({
          tourScheduleId: getTourScheId,
          date: getTourScheDate,
          startTime: start_time,
          stayTime: stay_time,
          endTime: endTimeCalculateForEdit(start_time, stay_time),
          carRouteTime: carRoute_time,
          attractionId: targetAttractionId,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (tourScheData) {
          // 取得當前attractionId的景點資訊
          $.ajax({
            url: `${loc}/lazy-trip-back/attractionQueryOne?attractionId=${targetAttractionId}`,
            type: "GET",
            success: function (AttractionData) {
              // 將資料渲染到頁面上
              targetAttraction.html(`
            <ul class="dayTripBlock_locationInfo">
                 <li class="dayTripBlock_locationInfoImg">
                   <img src=${AttractionData.attractionImg}/>
                 </li>
                 <li class="dayTripBlock_locationInfoBlock">
                   <ul class="dayTripBlock_locationInfoBlockDetail">
                     <li class="dayTripBlock_locationInfoBlockDetail_time">
                       <span>${tourScheData.stayTime}</span><span>分</span>
                       <span>${tourScheData.startTime}</span> - <span>${tourScheData.endTime}</span>
                    </li>
                    <li class="attraction_title">
                      ${AttractionData.attractionTitle}
                    </li>
                    <li class="address">${AttractionData.location}</li>
                  </ul>
                </li>
                <li class="dayTripBlock_featureNote">
                  <i class="fas fa-book-open"></i>
                </li>
                <li class="dayTripBlock_featureEdit">
                  <i class="fas fa-edit"></i>
                </li>
                <li class="dayTripBlock_featureDelete delete"></li>
              </ul>
              <div class="dayTripBlock_carRouteTime">
                <span class="icon"><i class="fas fa-car"></i></span>
                <p>約 ${tourScheData.carRouteTime}</p>
              </div>
          `);
            },
            error: function (xhr) {
              console.log("error");
            },
          });
        },
        error: function (xhr) {
          console.log("error");
        },
      });
    },
  });
  $("#start_time").val("");
  $("#stay_time").val("");
});

// ===================回到行程總表頁面======================== //
$(document).on("click", ".return_tripList", function () {
  console.log(222);
  location = `${loc}/lazy-trip-back/page/tour/tour.html`;
});

// =========================崁入google地圖============================== //
let map;
let current_position;
let selected_attraction;
let marker;
let markers = [];
let directions_service;
let directions_renderer;
let info_window;
let carRoute_time;

function initMap() {
  const center = {
    lat: 25.553118,
    lng: 121.0211024,
  };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: center,
  });

  const draggable = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    draggable: true,
  });

  draggable.addListener("drag", () => {
    map.setCenter(draggable.getPosition());
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      current_position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      map.setCenter(current_position);
      map.setZoom(16);

      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("search_input"),
        {
          // 查詢的範圍
          bounds: {
            east: current_position.lng + 0.001,
            west: current_position.lng - 0.001,
            south: current_position.lat - 0.001,
            north: current_position.lat + 0.001,
          },
          // false代表非僅限上述範圍內查詢
          strictBounds: false,
        }
      );

      autocomplete.addListener("place_changed", function () {
        const place = autocomplete.getPlace();

        if (place.photos == undefined) {
          alert("此景點近期維護中，請查詢其他景點");
          return;
        }

        // 將搜尋到的地點設定為下一次查詢的起點
        const start_location = selected_attraction
          ? selected_attraction.location
          : current_position;

        selected_attraction = {
          location: place.geometry.location,
          place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          photo: place.photos[0],
          rating: place.rating,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };

        // 將搜尋到的結果渲染畫面，且給予marker
        map.setCenter(selected_attraction.location);

        marker = new google.maps.Marker({
          position: selected_attraction.location,
          map: map,
        });
        markers.push(marker);
        marker.setPosition(selected_attraction.location);

        if (!directions_service) {
          directions_service = new google.maps.DirectionsService();
        }
        if (!directions_renderer) {
          directions_renderer = new google.maps.DirectionsRenderer({
            map: map,
          });
        }
        directions_renderer.set("directions", null);
        directions_service.route(
          {
            origin: start_location,
            destination: {
              placeId: selected_attraction.place_id,
            },
            travelMode: "DRIVING", // 交通模式 DRIVING
          },
          function (response, status) {
            if (status === "OK") {
              directions_renderer.setDirections(response);
              if (!info_window) {
                info_window = new google.maps.InfoWindow();
              }
              info_window.setContent(
                `
                <div><img src="${selected_attraction.photo.getUrl()}" style="max-width: 100px; max-height: 100px;"></div>
                <h3>${selected_attraction.name}</h3>
                <div>地址：${selected_attraction.address}</div>
                <div>評分：${selected_attraction.rating}</div>
                <div>汽車時間：${response.routes[0].legs[0].duration.text}</div>
                `
              );
              info_window.open(map, marker);
              carRoute_time = response.routes[0].legs[0].duration.text;
              //將景點資訊渲染到待選區
              renderAttractionToShowBox(selected_attraction);
              // 使用者點選"加入景點"，發送請求
              // 1.景點存入DB, attraction_arr
              // 2.景點與相關資訊存入tourSchedule_arr
              // 3.將景點資訊渲染到正選區
              // 4.清空查詢input#search_input和TourScheduleBox的景點資訊
            }
          }
        );
      });
    });
  }
}

//使用者點選"加入景點"，發送請求
$(document).on("click", "button.add_attraction", function () {
  // 1.景點存入DB, attraction_arr
  // 2.景點與相關資訊存入tourSchedule_arr
  // 3.將景點資訊渲染到正選區
  let stay_time = document.getElementById("stay_time").value;
  let start_time = document.getElementById("start_time").value;
  let endTime = endTimeCalculate(start_time, stay_time);
  attractionAction(stay_time, start_time, endTime);

  // 4.清空查詢input#search_input和TourScheduleBox的景點資訊
  $("#search_input").val("");
  $("div.attraction_detail_show").html("");
  $("#stay_time").val("");
  $("#start_time").val("");
});

function attractionAction(stay_time, start_time, endTime) {
  $.ajax({
    url: `${loc}/lazy-trip-back/attractionCreate`,
    type: "POST",
    data: JSON.stringify({
      attractionTitle: selected_attraction.name,
      location: selected_attraction.address,
      latitude: selected_attraction.latitude,
      longitude: selected_attraction.longitude,
      attractionImg: selected_attraction.photo.getUrl(),
    }),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      attraction_arr.push({
        attractionTitle: data.attractionTitle,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        attractionImg: data.attractionImg,
        carRouteTime: carRoute_time,
        attractionId: data.attractionId,
      });
      $("div.attraction_detail_show").html("");

      // 2.景點與相關資訊存入tourSchedule_arr
      for (let i = attraction_arr.length; i >= attraction_arr.length; i--) {
        tourSchedule_arr.push({
          tourScheduleId: null,
          date: currentDate,
          startTime: start_time,
          stayTime: stay_time,
          endTime: endTime,
          tourId: tourId,
          attraction_info: {
            attractionTitle: attraction_arr[i - 1].attractionTitle,
            location: attraction_arr[i - 1].location,
            latitude: attraction_arr[i - 1].latitude,
            longitude: attraction_arr[i - 1].longitude,
            attractionImg: attraction_arr[i - 1].attractionImg,
            carRouteTime: attraction_arr[i - 1].carRouteTime,
            attractionId: attraction_arr[i - 1].attractionId,
          },
        });
      }
      // 3.將景點資訊渲染到正選區
      renderAttractionToTourInfo(tourSchedule_arr, start_time, stay_time);
    },
    error: function (xhr) {
      console.log("error");
    },
    complete: function (xhr) {
      // 將資料整理成tourSchedule_arr_ready陣列
      for (let i = tourSchedule_arr.length; i >= tourSchedule_arr.length; i--) {
        tourSchedule_arr_ready.push({
          date: tourSchedule_arr[i - 1].date,
          startTime: tourSchedule_arr[i - 1].startTime,
          stayTime: tourSchedule_arr[i - 1].stayTime,
          endTime: tourSchedule_arr[i - 1].endTime,
          attractionId: tourSchedule_arr[i - 1].attraction_info.attractionId,
          carRouteTime: tourSchedule_arr[i - 1].attraction_info.carRouteTime,
          tourId: tourId,
        });
      }
      // 將每日行程存入DB
      tourScheStoreIntoDB(tourSchedule_arr_ready);
      tourSchedule_arr_ready = [];
    },
  });
}

function tourScheStoreIntoDB(tourSchedule_arr_ready) {
  $.ajax({
    url: `${loc}/lazy-trip-back/tourScheCreate`,
    type: "POST",
    data: JSON.stringify(tourSchedule_arr_ready),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      arrData = Object.values(data);
      // 將primary key加入tourSchedule_arr中
      for (let i = 0; i < tourSchedule_arr.length; i++) {
        tourSchedule_arr[i].tourScheduleId = arrData[i];
      }
      // 將tourSheduleId加在DOM上
      $("div.dayTripBlock_all[data-attrid]").each(function () {
        let id = $(this).attr("data-attrid");
        let obj = tourSchedule_arr.find(function (item) {
          return parseInt(item.attraction_info.attractionId) === parseInt(id);
        });
        if (obj) {
          $(this).attr("data-scheId", obj.tourScheduleId);
        }
      });
    },
    error: function (xhr) {
      console.log("error");
    },
  });
}

function renderAttractionToShowBox(selected_attraction) {
  let new_attraction = "";
  new_attraction = `
    <div class="dayTripBlock_all">
      <ul class="dayTripBlock_locationInfo">
        <li class="dayTripBlock_locationInfoImg">
          <img style="width: 70px; height: 70px; border-radius: 4px; background-size: cover" src=${selected_attraction.photo.getUrl()}/>
        </li>
        <li class="dayTripBlock_locationInfoBlock">
          <ul class="dayTripBlock_locationInfoBlockDetail">
            <li class="attraction_title">
              ${selected_attraction.name}
            </li>
            <li class="address">${selected_attraction.address}</li>

          </ul>
        </li>
      </ul>
    </div>
  `;

  $("div.attraction_detail_show").html(new_attraction);
}

function renderAttractionToTourInfo(tourSchedule_arr, start_time, stay_time) {
  // 將景點資訊渲染到正選區
  let new_dayTripInfo = "";

  for (let i = 0; i < tourSchedule_arr.length; i++) {
    new_dayTripInfo = `
  <div class="dayTripBlock_all" data-attrId=${
    tourSchedule_arr[i].attraction_info.attractionId
  }>
    <ul class="dayTripBlock_locationInfo">
      <li class="dayTripBlock_locationInfoImg">
        <img src=${tourSchedule_arr[i].attraction_info.attractionImg}/>
      </li>
      <li class="dayTripBlock_locationInfoBlock">
        <ul class="dayTripBlock_locationInfoBlockDetail">
          <li class="dayTripBlock_locationInfoBlockDetail_time">
            <span>${tourSchedule_arr[i].stayTime}</span><span>分</span>
            <span>${
              tourSchedule_arr[i].startTime
            }</span> - <span>${endTimeCalculate(start_time, stay_time)}</span>
          </li>
          <li class="attraction_title">
            ${tourSchedule_arr[i].attraction_info.attractionTitle}
          </li>
          <li class="address">${
            tourSchedule_arr[i].attraction_info.location
          }</li>
        </ul>
      </li>
      <li class="dayTripBlock_featureNote">
        <i class="fas fa-book-open"></i>
      </li>
      <li class="dayTripBlock_featureEdit">
        <i class="fas fa-edit"></i>
      </li>
      <li class="dayTripBlock_featureDelete delete" data-date=${currentDate}></li>
    </ul>
    <div class="dayTripBlock_carRouteTime">
      <span class="icon"><i class="fas fa-car"></i></span>
      <p>約 ${tourSchedule_arr[i].attraction_info.carRouteTime}</p>
    </div>
  </div>
    `;
  }
  let targetDayTripBlock = btnAddTrip
    .closest("div.dayTrip")
    .find("section.dayTripBlock");
  $(targetDayTripBlock).append(new_dayTripInfo);
}

// 刪除每日景點 deleteTourScheduleData
$(document).on("click", ".dayTripBlock_featureDelete.delete", function () {
  // 找尋DOM元素，刪除景點用途
  targetAttraction = $(this).closest("div.dayTripBlock_all");
  getTourScheId = targetAttraction.attr("data-scheid");

  // 串接刪除API
  $.ajax({
    url: `${loc}/lazy-trip-back/tourScheDelete?tourScheduleId=${getTourScheId}`,
    type: "DELETE",
    success: function (data) {
      targetAttraction.remove();
    },
    error: function (xhr) {
      console.log("error");
    },
  });
});

function endTimeCalculate(start_time, stay_time) {
  let start_date = new Date(currentDate + " " + start_time);
  let endTime = new Date(
    parseInt(start_date.getTime()) + parseInt(stay_time) * 60000
  );
  return endTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function endTimeCalculateForEdit(start_time, stay_time) {
  let start_date = new Date(getTourScheDate + " " + start_time);
  let endTime = new Date(
    parseInt(start_date.getTime()) + parseInt(stay_time) * 60000
  );
  return endTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
