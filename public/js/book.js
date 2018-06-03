$(document).ready(function() {
  $('.editbook').click(function() {
    $('.editbookform').show();
    $('.bookview').hide();
  });
  $('.removebook').click(function(){
    let bookid = $(this).data('bookid');
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 204) {
          $('.rowid_' + bookid).hide();
        }
      }
    };
    xhr.open('DELETE', '/books/' + bookid, true);
    xhr.send();


  });
});
