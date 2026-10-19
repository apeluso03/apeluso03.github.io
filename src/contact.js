// Contact form: client-side validation, then send through EmailJS.
// Template parameter names match the existing EmailJS template (template_phef9j4).
var EMAILJS_PUBLIC_KEY = "0aJhefn8ekyqiGOHn";
var EMAILJS_SERVICE = "service_u2jiu56";
var EMAILJS_TEMPLATE = "template_phef9j4";

document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contactform");
    if (!form) return;

    var button = document.getElementById("go");
    var status = document.getElementById("form-status");
    var buttonHtml = button.innerHTML;

    if (window.emailjs) emailjs.init(EMAILJS_PUBLIC_KEY);

    var validators = {
        user_fname: function (v) { return v.length > 0; },
        user_lname: function (v) { return v.length > 0; },
        user_email: function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v); },
        user_phone: function (v) { return v === "" || /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(v); },
        user_message: function (v) { return v.length > 0; }
    };

    function check(input) {
        var ok = validators[input.id](input.value.trim());
        input.closest(".field").classList.toggle("invalid", !ok);
        input.setAttribute("aria-invalid", ok ? "false" : "true");
        return ok;
    }

    Object.keys(validators).forEach(function (id) {
        var input = document.getElementById(id);
        input.addEventListener("blur", function () { if (input.value) check(input); });
        input.addEventListener("input", function () {
            if (input.closest(".field").classList.contains("invalid")) check(input);
        });
    });

    function setStatus(text, kind) {
        status.textContent = text;
        status.className = "form-status" + (kind ? " " + kind : "");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var firstInvalid = null;
        Object.keys(validators).forEach(function (id) {
            var input = document.getElementById(id);
            if (!check(input) && !firstInvalid) firstInvalid = input;
        });
        if (firstInvalid) {
            firstInvalid.focus();
            setStatus("Please check the highlighted fields.", "err");
            return;
        }

        if (!window.emailjs) {
            setStatus("The form didn't load. Please email me at alexpeluso03@gmail.com.", "err");
            return;
        }

        button.disabled = true;
        button.textContent = "Sending…";
        setStatus("");

        var val = function (id) { return document.getElementById(id).value.trim(); };
        emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
            user_fname: val("user_fname"),
            user_lname: val("user_lname"),
            user_email: val("user_email"),
            user_phone: val("user_phone") || "Not provided",
            message: val("user_message")
        }).then(function () {
            form.reset();
            setStatus("Thanks, your message was sent.", "ok");
        }, function () {
            setStatus("The message didn't send. Please email me at alexpeluso03@gmail.com.", "err");
        }).then(function () {
            button.disabled = false;
            button.innerHTML = buttonHtml;
        });
    });
});
