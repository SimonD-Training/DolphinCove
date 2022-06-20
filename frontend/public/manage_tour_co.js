let msgtrack;
$(document).ready(() => {
    $("form#form1").on("submit", function (e) {
        e.preventDefault();
        let data = {
            tour_co_id: $("input[name=tour_co_id]").val(),
            tour_company: $("input[name=tour_company]").val(),
            tour_company_address: $("input[name=tour_company_address]").val(),
            tour_company_desc: $("input[name=tour_company_desc]").val(),
            email: $("input[name=email]").val(),
        };
        $.ajax({
            type: "put",
            url: `/tour_co/${data.tour_co_id}`,
            data: data,
            success: (response) => {
                $("div#message").css({
                    display: "block",
                    background: "#0f0",
                });
                $("div#message").text("Profile Updated!");
                clearTimeout(msgtrack);
                msgtrack = setTimeout(() => {
                    $("div#message").css({ display: "none" });
                    $("div#message").text("");
                    window.location.reload();
                }, 3000);
            },
            error: () => {
                $("div#message").css({ display: "block", background: "#f00" });
                $("div#message").text("Update Failed!");
                clearTimeout(msgtrack);
                msgtrack = setTimeout(() => {
                    $("div#message").css({ display: "none" });
                    $("div#message").text("");
                }, 3000);
            },
        });
    });
});

function password(id) {
    let data = {
        password: $("input[name=password]").val(),
    };
    $.ajax({
        type: "put",
        url: `/profile/password/${id}`,
        data: data,
        success: (response) => {
            $("div#message").css({
                display: "block",
                background: "#0f0",
            });
            $("div#message").text("Profile Updated!");
            clearTimeout(msgtrack);
            msgtrack = setTimeout(() => {
                $("div#message").css({ display: "none" });
                $("div#message").text("");
                window.location.reload();
            }, 3000);
        },
        error: () => {
            $("div#message").css({ display: "block", background: "#f00" });
            $("div#message").text("Update Failed!");
            clearTimeout(msgtrack);
            msgtrack = setTimeout(() => {
                $("div#message").css({ display: "none" });
                $("div#message").text("");
            }, 3000);
        },
    });
}

function email(id) {
    let data = {
        email: $("input[name=email]").val(),
    };
    $.ajax({
        type: "put",
        url: `/profile/email/${id}`,
        data: data,
        success: (response) => {
            $("div#message").css({
                display: "block",
                background: "#0f0",
            });
            $("div#message").text("Profile Updated!");
            clearTimeout(msgtrack);
            msgtrack = setTimeout(() => {
                $("div#message").css({ display: "none" });
                $("div#message").text("");
                window.location.reload();
            }, 3000);
        },
        error: () => {
            $("div#message").css({ display: "block", background: "#f00" });
            $("div#message").text("Update Failed!");
            clearTimeout(msgtrack);
            msgtrack = setTimeout(() => {
                $("div#message").css({ display: "none" });
                $("div#message").text("");
            }, 3000);
        },
    });
}
