  window.onload = function() {
    var socket = io.connect('http://localhost:3000');
    var tweetContainer = document.getElementById('tweetContainer');
    socket.on('message', function(data) {
      if (data.message['text']) {
        console.log(data.message);
        var html = '<div class="well">';
        html += ' <div class="profile-info">';
        html += '<div class="dp-container">';
        html += '<a href="https://twitter.com/' + data.message.user.screen_name + '" target="_blank"> <img src="' + data.message.user.profile_image_url + '">';
        html += '</a>';
        html += '</div>';
        html += '<div class="name-container">';
        html += '<a href="https://twitter.com/' + data.message.user.screen_name + '" target="_blank"> <strong>' + data.message.user.name + '</strong>&nbsp;@' + data.message.user.screen_name + '</a>';
        html += '<br>';
        if (data.message.user.description)
          html += data.message.user.description;
        html += '</div>';
        html += '<div class="clearfix"></div>';
        html += '</div>';
        html += '<div class="tweet-container">';
        html += '<h4>' + data.message.created_at + '</h4>';
        html += '<p>' + data.message.text + '</p>';
        html += '</div>';
        html += ' <div class="media-container">';
        if (data.message.entities.media)
          html+= '<img src="'+data.message.entities.media[0].media_url+'">';
        html += ' <p></p>';
        html += ' </div>';
        html += ' <div class="clearfix"></div>';
        html += '</div>';


        // var html = "<p>";
        // html += data.message['text'];
        $("#tweetContainer").prepend(html);
        // tweetContainer.innerHTML = html;';
      }
      socket.emit('disconnect', function() {
        console.log('user disconnected!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      });
    });
  }

  window.onbeforeunload = pageleave;

  function pageleave() {
    return 'you sure??'
  }
