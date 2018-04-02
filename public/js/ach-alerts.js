var socket = io();
socket.on('achievement', function(data) {
  console.log("GOT ACHIEVEMENT: ", data);
  if(data.msg == "completed"){
    alerty.alert("The " + data.name + " achievement has been completed! ", {title: "Achievement Completed"});
  }
});
