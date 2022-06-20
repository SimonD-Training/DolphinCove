let msgtrack;
$(document).ready(() => {
    $("form#form1").on("submit", function (e) {
        e.preventDefault();
        let data = {
            email: $("input[name=email]").val(),
            password: $("input[name=password]").val(),
        };
        $.ajax({
            type: "post",
            url: "/login",
            data: data,
            success: (response) => {
                window.location.href = response;
            },
            error: () => {
                $("div#message").css({ display: "block", background: "#f00" });
                $("div#message").text("Login Failed!");
                clearTimeout(msgtrack);
                msgtrack = setTimeout(() => {
                    $("div#message").css({ display: "none" });
                    $("div#message").text("");
                }, 3000);
            },
        });
    });
});
