const UserList = function(props) 
{
    //If no users have been made (Should not happen becuase need to be logged in), show error
    if(props.users.length === 0)
    {
        return(
            <div className="userList">
                <h3 className="noUsers">No users found</h3>
            </div>
        )
    }
    
    //Displaying each user
    const userNodes = props.users.map(function(user){
        return(
            <div className="user">
                <h3 className="userName">Username: {user.username}</h3>
                <h3 className="userDomos">Domos Created: {user.domosMade}</h3>
            </div>
        );
    });

    return(
        <div className="userList">
            {userNodes}
        </div>
    )
}

const setup = function()
{
    //Retrieving the accounts
    sendAjax('GET', '/getAccounts', null, (data) =>{
        ReactDOM.render(<UserList users={data.users} />, document.querySelector("#userList"));

    });
}

$(document).ready(function(){setup();});