$(function () {

  var $telefone = $('#telefone');
  if ($telefone.length) {
    $telefone.mask('+55 99 99999-9999');
  }

  var $valor = $('#valor');
  if ($valor.length) {
    $valor.mask('#.##0,00', { reverse: true });
  }

  $('[required]').each(function () {
    var $label = $(this).closest('.field-group, .position-relative').find('.field-label').first();
    if ($label.length && !$label.find('.required-asterisk').length) {
      $label.append('<span class="required-asterisk" style="color:#f87171;margin-left:2px;">*</span>');
    }
  });

  $('.edit-link').on('click', function (e) {
    e.preventDefault();
    $(this).closest('form').find('input, select').prop('disabled', false).focus();
  });

  $('.toggle-row .switch').on('click', function () {
    $(this).toggleClass('on');
  });

});
