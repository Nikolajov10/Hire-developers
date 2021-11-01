const STORAGE_NAME = "users"
const STORAGE_USER_NAME = "user"
const EDIT_USER_URL = "edit_user.html"

$(document).ready(() => {
    $("#nav").append(createNavbar())
    users = localStorage.getItem(STORAGE_NAME);
    
    if (!users) return;
    users = JSON.parse(users);
    console.log(users);
    users.forEach((user) => {
        // checking  optional atributes
        // if user dosen't have some optional atribute
        // we aren't showing it
        const desc = user.description == ""?'':'<tr><th>Description</th><td>' + user.description + '</td></tr>';

        const linkedin = user.linkedin == ""?'':'<tr><th>Linkedin</th><td><a href=' + user.linkedin + '>' + user.name + "'s profile</a></a></td></tr>";

        const image_src = user.image == ""?"images/profile_img.png":user.image;
        const img = '<img class="card-img-top" src="'+image_src+ ' " alt="Profile pic"></img>'
        
        // html representation of user in card
        let user_html = '<div class="col-sm-4" id="' + String(user.name) +'"><div class="card mb-3">' + img +'<div class="card-body"><a onclick=editUser("'  + String(user.name) + '")><h5 class="card-title">'
        + user.name + '</a></h5><small>Click username to edit user</small></small><p class="card-text"></p><table class="table table-light table-striped"><tr><th>Email</th><td>' + user.email
        + '</td></tr><tr><th>Phone number</th><td>'  + user.tel  + '</td></tr><tr><th>Location</th><td>' + user.location + '</td></tr><tr><th>Price</th><td>' + user.price + '</td></tr>' + '<tr><th>Technology</th><td>' + user.technology + '</td></tr>'
        + desc + '<tr><th>Years of experience</th><td>' + user.experience +  '</td></tr>' + '<tr><th>Language</th><td>' + user.language + '</td></tr>' + linkedin
        +'</table></p><p class="card-text"><small class="text-muted">Delete user &nbsp;<button type="button" class=" btn-danger btn" data-dismiss="alert" aria-label="Close" onClick=deleteUser("' + String(user.name) +  '")><span aria-hidden="true">&times;</span></button></small>' + htmlDropdownDates(user) +'</p></div></div></div>'; 
        $("#users").append(user_html);
    });
})

function htmlDropdownDates(user) {
    // making html representation of dropwdown button
    // where user can see working dates for selected developer
    let dropdown = '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Check working dates</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
    user.working_dates.forEach((period) => {
        dropdown += '<a class="dropdown-item" href="#">' + period.start + " : " + period.end;
    })
    dropdown += '</div></div>';
    return dropdown;
}

function deleteUser(username) {
    // delete user from local storage
    users = localStorage.getItem(STORAGE_NAME);
    if (!users) return;
    users = JSON.parse(users);
    let index = 0;
    for(user of users) {
        if (user.name == username) {
            users.splice(index,1);
            break;
        }
        ++index;
    }
    localStorage.setItem(STORAGE_NAME,JSON.stringify(users));
    $("#"+String(username)).remove(); // removing element from page
}

function editUser(username) {
    // seting up user in local storage
    // needed for editing user od edit_user.html page
    users = localStorage.getItem(STORAGE_NAME);
    if (!users) return;
    users = JSON.parse(users);
    // finding user and index
    let index = 0;
    for(user of users) {
        if (user.name == username) {
            break;
        }
        ++index;
    }

    let edit_user = users[index];
    edit_user.index = index;
    localStorage.setItem(STORAGE_USER_NAME,JSON.stringify(edit_user));
    window.location.href = EDIT_USER_URL;
}

function filterUsers() {
    // filter users by username put 
    // in search box
    const username = document.getElementById("search").value;
    users = localStorage.getItem(STORAGE_NAME);
    if (!users) return;
    users = JSON.parse(users);
    users.forEach( (user,index) => {
        if (username == "") 
            $("#" + String(user.name)).show() // if search box is empty show all users
        else if (user.name != username) 
            $("#" + String(user.name)).hide()
        else 
            $("#" + String(user.name)).show()
    } );
    document.getElementById("search").value = ""; // reset search box
}
