  window.onload = function() {
    var socket = io.connect('http://localhost:3000');
    var tweetContainer = document.getElementById('tweetContainer');
    var count = 0;
    socket.on('message', function(data) {
      if (data.message[0].text) {
        $(".load").hide();
        console.log(data.message);
        console.log(data.message[0].count);
        var html = '<div class="">';
        html += ' <div class="profile-info">';
        html += '<div class="dp-container">';
        html += '<a href="https://twitter.com/' + data.message[0].screen_name + '" target="_blank"> <img src="' + data.message[0].profile_image_url + '">';
        html += '</a>';
        html += '</div>';
        html += '<div class="name-container">';
        html += '<a href="https://twitter.com/' + data.message[0].screen_name + '" target="_blank"> <strong>' + data.message[0].name + '</strong>&nbsp;@' + data.message[0].screen_name + '</a>';
        html += '<br>';
        // if (data.message[0].description)
        //   html += data.message[0].description;
        html += '</div>';
        html += '<div class="clearfix"></div>';
        html += '</div>';
        html += '<div class="tweet-container">';
        html += "<img src='images/twitter-iconSmall.png'   width= '30px';>";
        html += '<p>' + data.message[0].text + '</p>';
        html += ' <div class="media-container">';
        if (data.message[0].media_url != "no")
          html += '<center><img src="' + data.message[0].media_url + '"></center>';
        html += ' </div>';
        html += '</div>';

        html += ' <div class="clearfix"></div>';
        html += '</div>';


        // var html = "<p>";
        // html += data.message['text'];
        // $("#tweetContainer").fadeOut(2000, function() {
        //   $("#tweetContainer").html(html);
        // });
        if (count == 0) {
          $("#tweetContainer").html(html);
          $("#tweetContainer").fadeIn(100);
          count++;
        } else {

          $("#tweetContainer").fadeOut(1000, function() {
            $("#tweetContainer").html(html);
            $("#tweetContainer").fadeIn(1000);

          });
        }


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
