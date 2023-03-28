const account = document.querySelector("#account");
const password = document.querySelector("#password");
const username = document.querySelector("#username");
const birth = document.querySelector("#birthday");
document.querySelector("button").addEventListener("click", () => {
  fetch("register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      member_username: account.value,
      member_password: password.value,
      member_username: username.value,
      member_birth: birth.value,
    }),
  })
    .then((resp) => resp.json())
    .then((body) => {
      alert(`successful: ${body.successful} message: ${body.message}`);
    });
});
