const eventSource = new EventSource("http://localhost:8080/lazy-trip-back/push-hello");
eventSource.onmessage((e) => {
  console.log(e.data);
});