let msgtrack;
$(document).ready(() => {
    $("form#form1").on("submit", function (e) {
        e.preventDefault();
        let data = {
            payment_id: $("input[name=payment_id]").val(),
            voucher: $("input[name=voucher]").val(),
            date: $("input[name=date]").val(),
        };
        $.ajax({
            type: "post",
            url: `/tourbook/addvoucher`,
            data: data,
            success: (response) => {
                $("form#form1").trigger("reset");
                $("div#message").css({
                    display: "block",
                    background: "#0f0",
                });
                $("div#message").text("Voucher Created!");
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
                $("div#message").text("Voucher Error!");
                clearTimeout(msgtrack);
                msgtrack = setTimeout(() => {
                    $("div#message").css({ display: "none" });
                    $("div#message").text("");
                }, 3000);
            },
        });
    });
});

function deleteVoucher(id) {
    $.ajax({
        type: "delete",
        url: `/pre-book/remvoucher/${id}`,
        success: (response) => {
            $("div#message").css({
                display: "block",
                background: "#0f0",
            });
            $("div#message").text("Voucher Removed!");
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
