window.onload = function(){
  var socket = io.connect('http://localhost:3000');
  var tweetContainer = document.getElementById('tweetContainer');
  socket.on('message', function(data){
    if(data.message['text'])
    {
      console.log(data.message);
      var html ='<p>';
      html += data.message['text'];
      $("#tweetContainer").append(html);
      // tweetContainer.innerHTML = html;
    }
  });
}