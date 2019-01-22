$(document).ready( () => {    
    $("#login_user").on("click", () => {
        user_login();
    });
    $("#register_user").on("click", () => {
        user_register();
    });

});

function user_login(){
    var success = true;
    if($("#user_name").val() == "" || $("#user_name").val() == null || $("#user_password").val() == "" || $("#user_password").val() == null){
        $("#error_message").text("Please fill all fields");
        $("#error_message").css("cssText", "display : block !important");
        success = false;
    } else{
        $("#error_message").text("");
        $("#error_message").css("cssText", "display : none !important");
    }
    if(success){
        var data = {
           name : $("#user_name").val(),
           password: $("#user_password").val()
        };
        var LOGIN_USER_URL = "/login";
        sendPostRequest(LOGIN_USER_URL, JSON.stringify(data), userLoginSuccess, userLoginError);
    }
}

function userLoginSuccess(data){
    if(data["success"]){
        window.location = "/home";
        $("#error_message1").text("");
        $("#error_message1").css("display", "none");
    } else{
        $("#error_message1").text(data["message"]);
        $("#error_message1").css("display", "block");
    }
}

function userLoginError(error){
    console.log(error);
}

function user_register(){
    var success = true;

    if($("#user_name1").val() == "" || $("#user_name1").val() == null || $("#user_password1").val() == "" || $("#user_password1").val() == null || $("#confirm_password").val() == "" || $("#confirm_password").val() == null){
        $("#error_message1").text("Please fill all fields");
        $("#error_message1").css("cssText", "display : block !important");
        success = false;
        return;
    } else{
        $("#error_message1").text("");
        $("#error_message1").css("cssText", "display : none !important");
    }

    if($("#user_password1").val() !=  $("#confirm_password").val()){
        $("#error_message1").text("Passwords do not match");
        $("#error_message1").css("cssText", "display : block !important");
        success = false;
    } else{
        $("#error_message1").text("");
        $("#error_message1").css("cssText", "display : none !important");
    }

    if(success){
        var user_name = $("#user_name1").val();
        var data = {
           name : user_name,
           password: $("#user_password1").val()
        };
        var REGISTER_USER_URL = "/register";
        sendPostRequest(REGISTER_USER_URL, JSON.stringify(data), userRegisterSuccess, userRegisterError);
    }
}

function userRegisterSuccess(data){
    if(data["success"] == true){
        $("#register_form").trigger("reset");
        $("#before_register").css("display", "none");
        $("#after_register").css("display", "block");
    }
}

function userRegisterError(error){
    console.log("error", error);
}

function sendPostRequest(url, data, success, error) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        processData: false,
        success: function postSuccess(data, textStatus, jqXhr) {
            success(data);
        },
        error: function postError(jqXhr, textStatus, errorThrown) {
            var msg = "OTHER_NETWORK_ISSUE";
            if (jqXhr["status"] == 503 || textStatus == "timeout") {
                msg = "SERVER_BUSY";
            } else if (jqXhr["readyState"] == 0) {
                msg = "INTERNET_CONNECTION_ERROR";
            }
            error(msg);
        }
    });
}