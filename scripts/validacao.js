(function () {
  'use strict';

  var patterns = {
    nome: /^[A-Za-zÀ-ÿ\s]{3,100}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefone: /^[\+\d\s()-]{8,}$/,
    valor: /^\d+(\.\d{1,2})?$/,
  };

  var messages = {
    nome: 'Nome deve conter apenas letras e espaços (3 a 100 caracteres).',
    email: 'Informe um e-mail válido (ex: usuario@dominio.com).',
    telefone: 'Formato inválido. Use apenas números, espaços, +, () ou - .',
    valor: 'Informe um valor positivo válido (ex: 100.50).',
    moeda: 'Selecione uma moeda principal.',
    idioma: 'Selecione um idioma.',
  };

  function validateField(input) {
    var name = input.name;
    var value = input.value.trim();
    var valid = true;

    if (patterns[name]) {
      valid = patterns[name].test(value);
    } else if (input.hasAttribute('required')) {
      valid = value !== '';
    }

    var wrapper = input.closest('.field-group, .position-relative') || input.parentElement;
    var errorEl = wrapper.querySelector('.error-message');

    if (!valid) {
      input.classList.add('invalid');
      if (!errorEl) {
        var msg = document.createElement('span');
        msg.className = 'error-message';
        msg.textContent = messages[name] || 'Campo inválido.';
        wrapper.appendChild(msg);
      }
    } else {
      input.classList.remove('invalid');
      if (errorEl) errorEl.remove();
    }

    return valid;
  }

  function validateForm(form) {
    var allValid = true;
    var inputs = form.querySelectorAll('input, select');
    for (var i = 0; i < inputs.length; i++) {
      if (!validateField(inputs[i])) {
        allValid = false;
      }
    }
    return allValid;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form');
    for (var f = 0; f < forms.length; f++) {
      (function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (validateForm(form)) {
            var event = new CustomEvent('formvalid', { detail: { form: form } });
            form.dispatchEvent(event);
          }
        });

        var fields = form.querySelectorAll('input, select');
        for (var i = 0; i < fields.length; i++) {
          (function (field) {
            field.addEventListener('blur', function () {
              validateField(field);
            });
            field.addEventListener('input', function () {
              if (field.classList.contains('invalid')) {
                validateField(field);
              }
            });
          })(fields[i]);
        }
      })(forms[f]);
    }
  });
})();
