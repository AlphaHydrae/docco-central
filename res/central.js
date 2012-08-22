
$(function() {

  var index = $('#index');
  var search = index.find('.search');
  var empty = index.find('.empty');
  var currentLine = null;

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

  search.keydown(function(e) {

    if (e.keyCode == 40) {
      if (!currentLine) {
        currentLine = index.find('ul li:first').addClass('active');
      } else {
        var nextLine = currentLine.next('li');
        if (nextLine.length) {
          currentLine.removeClass('active');
          currentLine = nextLine.addClass('active');
        }
      }
      return false;
    } else if (e.keyCode == 38) {
      if (!currentLine) {
        currentLine = index.find('ul li:last').addClass('active');
      } else {
        var previousLine = currentLine.prev('li');
        if (previousLine.length) {
          currentLine.removeClass('active');
          currentLine = previousLine.addClass('active');
        }
      }
      return false;
    } else if (e.keyCode == 27 && currentLine) {
      currentLine.removeClass('active');
      currentLine = null;
      return false;
    } else if (e.keyCode == 13 && currentLine) {
      console.log('enter!');
      window.location = currentLine.find('a').attr('href');
      return false;
    }
  });
});
