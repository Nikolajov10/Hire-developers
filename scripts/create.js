var users = []
const STORAGE_NAME = "users"
var error_msg = "";

$(document).ready( () => {
    $("#technology").prop("selectedIndex",-1);
    $("#language").prop("selectedIndex",-1);
    setUsers();
    $("#nav").append(createNavbar());
})

function setUsers() {
    // get users from local storage
    users_data = localStorage.getItem(STORAGE_NAME);
    if (!users_data) {
        users = [
            {
                name:"admin",
                email: "admin@gmail.com",
                tel:"+381-12312312",
                location:"Belgrade",
                image:"",
                price:"100",
                technology:".NET",
                description:"",
                experience:"0",
                language:"English",
                linkedin:"",
                working_dates :[]
            },
            {
                name:"admin2",
                email: "admin2@gmail.com",
                tel:"+381-12313312",
                location:"Belgrade",
                image:"",
                price:"100",
                technology:".NET",
                description:"",
                experience:"0",
                language:"English",
                linkedin:"",
                working_dates :[]
            } // some users for easier testing
        ]
        localStorage.setItem(STORAGE_NAME,JSON.stringify(users));    
    }
    else
        users = JSON.parse(users_data);
}


function checkUsernameAndEmail(name,email) {
    for(let user of users) {
        console.log(user.name,name)
        if (user.name == name || user.email == email)
            return false;
    }
    return true;
}

function createUser() {
    // getting values from form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    if (!checkUsernameAndEmail(name,email)) {
        error_msg = "Username or email already taken!";
        alert(error_msg)
        return;
    }
    const tel = document.getElementById("phone").value;
    const tel_req = /^\+\d{1,3}-\d{8,9}$/; // regExpr for tel validation
    const location = document.getElementById("location").value;
    const image = document.getElementById("img").value;
    const image_url = document.getElementById("img_url").value;
    const price = document.getElementById("price").value;
    const technology = document.getElementById("technology").value;
    const desc = document.getElementById("description").value;
    const experience = document.getElementById("experience").value;
    const language = document.getElementById("language").value;
    const linkedin = document.getElementById("linkedin_url").value;

    // checking if everything is inserted
    if (name.length == 0 || email.length == 0 || location.length == 0 || price.length == 0 || technology.length == 0 || experience.length == 0 || language.length == 0) {
        error_msg = "Fill in every required field"
        alert(error_msg)
        return;
    }
    // phone number validation
    if (! tel_req.test(tel)) {
        error_msg = "Invalid phone number"
        alert(error_msg)
        return;
    }
    // check image and image_url
    if (image.length > 0 && image_url.length > 0) {
        error_msg = "Upload image or enter url, not both"
        alert(error_msg)
        return;
    }
    // insert user into local storage
    const user = {
        name:name,
        email:email,
        tel:tel,
        location:location,
        image:image.length > 0?image:image_url,
        price:price,
        technology:technology,
        description:desc,
        experience:experience,
        language:language,
        linkedin:linkedin,
        working_dates:[]
    };
    users.push(user);
    localStorage.setItem(STORAGE_NAME,JSON.stringify(users))
    alert("User created!");
}