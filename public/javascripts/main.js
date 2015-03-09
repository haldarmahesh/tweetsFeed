console.log('mah1212');

// $(document).ready(function(){
//   alert('hey a');
//   console.log('mah');

//   $("#tweetContainer").click(function(){
//     alert('this is done');
//   });
// });
$(document).ready(function() {
  console.log("ready!");

  function clickEvent() {
    $("#tweetContainer").click(function() {
      console.log('this is done');
    });
  }
});
