
$(function() {

  var index = $('#index');
  var search = index.find('.search');

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

    /*console.log(index.find('ul li:visible').length);*/
  });
});
