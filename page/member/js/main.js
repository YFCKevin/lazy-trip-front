const mem_id = $("input.mem_id");
const img = document.getElementById("mem_img");
let base64;

img.addEventListener("change", function () {
  let reader = new FileReader();
  reader.readAsDataURL(this.files[0]);
  reader.addEventListener("load", function () {
    base64 = reader.result;
  });
});
$("button.btn_upload").on("click", function () {
  fetch("upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mem_id: mem_id.val(),
      mem_img: base64,
    }),
  });
});
