$(document).ready(function(){
  console.log('jquery works');
  console.log($('.row'));
  $('input[name=tweetType]').change(function(){
    if($(this).val() == 'live')
    {
      $(".count-container").prop("disabled",true);
    }
    else{
      $(".count-container").prop("disabled",false)
    }
  });
})