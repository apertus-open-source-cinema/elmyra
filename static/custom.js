$(document).ready(function() {

  // $('#visualize-button').click(function() {
  //   var action = '/viz/';
  //   action += $('input#project').val() + '/';
  //   action += $('select#thing').val() + '/';
  //   action += $('select#style').val() + '/';
  //   action += $('select#resolution').val() + '/';
  //   action += $('select#format').val();
  //   $(this).closest('form').attr('action', action);
  // });

  $('input[name="media-type"]').change(function() {
    is_animation = $(this).val() === 'animation';

    $('#media-length-group').toggle(is_animation);
    $('#media-length-group').toggle(is_animation);
  });

  $('input[name="modifier-type"]').change(function() {
    is_section = $(this).val() === 'section';

    $('#modifier-section-axis-group').toggle(is_section);
    $('#modifier-section-animated-group').toggle(is_section);
    $('#modifier-section-level-group').toggle(is_section);
  });

  $('input[name="modifier-section-animated"]').change(function() {
    is_checked = this.checked;

    $('#modifier-section-animate-progress-from-group').toggle(is_checked);
    $('#modifier-section-animate-progress-to-group').toggle(is_checked);
    $('#modifier-section-level-group').toggle(!is_checked);
  });

});
