$(function () {
  const account = $("input#input-username");
  const password = $("input#input-password");
  const check = $("div.content-member");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  $(document).on(
    "keydown",
    "input#input-username, input#input-password",
    function (e) {
      if (e.keyCode == 13) {
        $("button#btn-login").click();
      }
    }
  );
  window.addEventListener("pageshow", function (e) {
    $(document).find("input#myonoffswitch").prop("checked", true);
  });

  $("input#myonoffswitch").on("change", function () {
    $("div.content-member").toggleClass("-on");
    $("div.content-company").toggleClass("-on");
    $("p.msg").empty();
  });

  $("button#btn-login").on("click", function () {
    $("p.msg").text();
    if (check.hasClass("-on")) {
      if (typeof Storage !== "undefined") {
        // 檢查 key 是否存在
        if (sessionStorage.getItem("loc") != null) {
          // 讀取資料
          var myData = sessionStorage.getItem("loc");
          fetch("login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              account: account.val().trim(),
              password: password.val(),
            }),
          })
            .then((resp) => {
              if (resp.redirected) {
                location.href = myData;
                alert("登入成功");
              } else {
                resp.json().then((body) => {
                  $("p.msg").text(body.errorMessage);
                  $("p.msg").css("color", "red");
                  // alert(`errorMsg: ${body.errorMessage}`);
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          fetch("login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              account: account.val(),
              password: password.val(),
            }),
          })
            .then((resp) => {
              if (resp.redirected) {
                location.href = resp.url;
                alert("登入成功");
              } else {
                resp.json().then((body) => {
                  $("p.msg").text(body.errorMessage);
                  $("p.msg").css("color", "red");
                  // alert(`errorMsg: ${body.errorMessage}`);
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        fetch("login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account: account.val(),
            password: password.val(),
          }),
        })
          .then((resp) => {
            if (resp.redirected) {
              location.href = resp.url;
              alert("登入成功");
            } else {
              resp.json().then((body) => {
                $("p.msg").text(body.errorMessage);
                $("p.msg").css("color", "red");
                // alert(`errorMsg: ${body.errorMessage}`);
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      // 廠商登入資料
      console.log("company");
      fetch("company/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyUserName: account.val(),
          companyPassword: password.val(),
        }),
      })
        .then((resp) => {
          if (resp.redirected) {
            location.href = resp.url;
            alert("登入成功");
          } else {
            resp.json().then((body) => {
              $("p.msg").text(body.errorMessage);
              $("p.msg").css("color", "red");
              // alert(`errorMsg: ${body.errorMessage}`);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
});
