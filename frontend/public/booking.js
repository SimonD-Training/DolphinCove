let msgtrack;
$(document).ready(() => {
    $("form#form1").on("submit", function (e) {
        e.preventDefault();
        let data = {
            fname: $("input[name=fname]").val(),
            lname: $("input[name=lname]").val(),
            date: $("input[name=date]").val(),
            payment_method_id: $("select[name=payment_method_id]").val(),
            hotel_id: $("select[name=hotel_id]").val(),
            program_id: $("select[name=program_id]").val(),
        };
        $.ajax({
            type: "post",
            url: "/booking",
            data: data,
            success: (response) => {
                $("form#form1").trigger("reset");
                $("div#message").css({
                    display: "block",
                    background: "#0f0",
                });
                $("div#message").text("You've Been Booked!");
                clearTimeout(msgtrack);
                msgtrack = setTimeout(() => {
                    $("div#message").css({ display: "none" });
                    $("div#message").text("");
                }, 3000);
            },
            error: () => {
                $("div#message").css({ display: "block", background: "#f00" });
                $("div#message").text("Booking Error!");
                clearTimeout(msgtrack);
                msgtrack = setTimeout(() => {
                    $("div#message").css({ display: "none" });
                    $("div#message").text("");
                }, 3000);
            },
        });
    });
    $("input#limiter").change(function (e) {
        e.preventDefault();
        $.ajax({
            type: "get",
            url: "/api/programs",
            dataType: "json",
            success: function (response) {
                let list = response.filter((e) => {
                    return (
                        new Date(e.datetime.slice(0,10)).getDate() ==
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
});
