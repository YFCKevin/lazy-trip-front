$(function () {
  fetch("logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => {
      if (resp.redirected) {
        setTimeout(() => {
          location.href = resp.url;
        }, 3 * 1000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
