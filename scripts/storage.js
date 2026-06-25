(function () {
  'use strict';

  function getFormData(form) {
    var data = {};
    var fields = form.querySelectorAll('[name]');
    for (var i = 0; i < fields.length; i++) {
      data[fields[i].name] = fields[i].value;
    }
    return data;
  }

  function loadData(key, form) {
    var saved = localStorage.getItem(key);
    if (!saved) return;
    try {
      var data = JSON.parse(saved);
      var fields = form.querySelectorAll('[name]');
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (data[field.name] !== undefined) {
          field.value = data[field.name];
        }
      }
    } catch (e) {
      /* ignore invalid JSON */
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* Profile form */
    var profileForm = document.querySelector('#nome, #email, #telefone');
    if (profileForm) {
      profileForm = profileForm.closest('form');
      if (profileForm) {
        loadData('cs_profile', profileForm);
        profileForm.addEventListener('formvalid', function () {
          localStorage.setItem('cs_profile', JSON.stringify(getFormData(profileForm)));
        });
      }
    }

    /* Preferences form */
    var prefsForm = document.querySelector('#moeda, #idioma');
    if (prefsForm) {
      prefsForm = prefsForm.closest('form');
      if (prefsForm) {
        loadData('cs_preferences', prefsForm);
        prefsForm.addEventListener('formvalid', function () {
          localStorage.setItem('cs_preferences', JSON.stringify(getFormData(prefsForm)));
        });
      }
    }
  });
})();
