let msgtrack;
$(document).ready(() => {
    $("form#form1").on("submit", function (e) {
        e.preventDefault();
        let data = {
            booking_id: $("input[name=booking_id]").val(),
            payment_id: $("input[name=payment_id]").val(),
            voucher: $("input[name=voucher]").val(),
            date: $("input[name=date]").val(),
            hotel_id: $("select[name=hotel_id]").val(),
            program_id: $("select[name=program_id]").val(),
        };
        $.ajax({
            type: "put",
            url: `/booking/${data.booking_id}`,
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
    $("input#limiter").change((e) => {
        $.ajax({
            type: "get",
            url: "/api/programs",
            dataType: "json",
            success: (response) => {
                let list = response.filter((e) => {
                    return (
                        new Date(e.datetime.slice(0, 10)).getDate() ==
                        new Date($("input#limiter").val()).getDate()
                    );
                });
                list.forEach((e) => {
                    let option = $(
                        `<option value='${e.program_id}'>${
                            e.program_name
                        }(${e.datetime.slice(11, 16)})</option>`
                    );
                    $("select#programs").append(option);
                });
            },
        });
    });
    $("input#limiter").change();
});
