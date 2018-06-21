$(document).ready(function() {
  $('.editbook').click(function() {
    $('.editbookform').show();
    $('.bookview').hide();
  });
  $('.addbookbutton').click(function() {
    $('.addbookform').show();
    $('.booklistview').hide();
  });
  $('.searchby').click(function () {
    window.location = '/books?searchterm=' + $(this).data('searchterm') + '&searchby=' + $(this).data('searchby');
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
  $('.addtolist').click(function(){
    let row = $(this);
    let bookid = $(this).data('bookid');
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          row.text('Subscribed');
          row.removeClass('addtolist');
          row.removeClass('btn-info');
          row.addClass('btn-success');
        }
        else {
          alert(xhr.responseText);
        }
      }
    };
    xhr.open('post', '/auth/addbook/?bookid=' + bookid, true);
    xhr.send();
  });
});
