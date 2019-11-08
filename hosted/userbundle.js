"use strict";

var UserList = function UserList(props) {
    //If no users have been made (Should not happen becuase need to be logged in), show error
    if (props.users.length === 0) {
        return React.createElement(
            "div",
            { className: "userList" },
            React.createElement(
                "h3",
                { className: "noUsers" },
                "No users found"
            )
        );
    }

    //Displaying each user
    var userNodes = props.users.map(function (user) {
        return React.createElement(
            "div",
            { className: "user" },
            React.createElement(
                "h3",
                { className: "userName" },
                "Username: ",
                user.username
            ),
            React.createElement(
                "h3",
                { className: "userDomos" },
                "Domos Created: ",
                user.domosMade
            )
        );
    });

    return React.createElement(
        "div",
        { className: "userList" },
        userNodes
    );
};

var setup = function setup() {
    //Retrieving the accounts
    sendAjax('GET', '/getAccounts', null, function (data) {
        ReactDOM.render(React.createElement(UserList, { users: data.users }), document.querySelector("#userList"));
    });
};

$(document).ready(function () {
    setup();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
