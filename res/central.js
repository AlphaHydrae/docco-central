
$(function() {

  var index = $('#index');
  var search = index.find('.search');
  var empty = index.find('.empty');

  search.focus();

  search.keyup(function() {

    var q = $(this).val();
    index.find('ul li').each(function() {

      var current = $(this);
      var contents = current.text();
      if (contents.indexOf(q) >= 0) {
        current.css('display', 'block');
      } else {
        current.css('display', 'none');
      }
    });

    empty.css('display', index.find('ul li:visible').length ? 'none' : 'block');
  });
});
