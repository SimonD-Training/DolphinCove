let msgtrack;
$(document).ready(() => {
    $("form#form1").on("submit", function (e) {
        e.preventDefault();
        let data = {
            statement_date: $("input[name=statement_date]").val(),
            payment_method_id: $("input[name=payment_method_id]").val(),
            credit: $("input[name=credit]").val(),
        };
        $.ajax({
            type: "post",
            url: "/tour/booking",
            data: data,
            success: () => {
                $("form#form1").trigger("reset");
                $("div#message").css({
                    display: "block",
                    background: "#0f0",
                });
                $("div#message").text("Payment Planned!");
                $("form#form1").prop("disabled", true);
                clearTimeout(msgtrack);
                msgtrack = setTimeout(() => {
                    $("div#message").css({ display: "none" });
                    $("div#message").text("");
                    window.location.reload();
                }, 3000);
            },
            error: () => {
                $("div#message").css({ display: "block", background: "#f00" });
                $("div#message").text("Payment Planning Failed!");
                clearTimeout(msgtrack);
                msgtrack = setTimeout(() => {
                    $("div#message").css({ display: "none" });
                    $("div#message").text("");
                }, 3000);
            },
        });
    });
});

function cancel(id) {
    $.ajax({
        type: "delete",
        url: `/payment/cancel/${id}`,
        success: () => {
            $("form#form1").trigger("reset");
            $("div#message").css({
                display: "block",
                background: "#0f0",
            });
            $("div#message").text("Payment Cancelled!");
            $("form#form1").prop("disabled", true);
            clearTimeout(msgtrack);
            msgtrack = setTimeout(() => {
                $("div#message").css({ display: "none" });
                $("div#message").text("");
                window.location.reload();
            }, 3000);
        },
        error: () => {
            $("div#message").css({ display: "block", background: "#f00" });
            $("div#message").text("Cannot Erase!");
            clearTimeout(msgtrack);
            msgtrack = setTimeout(() => {
                $("div#message").css({ display: "none" });
                $("div#message").text("");
            }, 3000);
        },
    });
}
