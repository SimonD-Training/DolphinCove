$(document).ready(() => {
    $.ajax({
        type: "get",
        url: "/api/profiles",
        success: function (response) {
            response.forEach((e) => {
                console.log(e.tour_company);
            });
        }
    });
});