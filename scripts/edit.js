const STORAGE_NAME = "users"
const STORAGE_USER_NAME = "user"
const SHOW_USERS_URL = "show_users.html"
var index = null;
var working_dates = null;
$(document).ready(() => {
    $("#nav").append(createNavbar());
    user = localStorage.getItem(STORAGE_USER_NAME);
    if (!user) window.location.href=SHOW_USERS_URL 
    user = JSON.parse(user);
    console.log(user)
    // setup index
    index = user.index
    // setup user values
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    // disable name and email field
    $("#name").attr("disabled",true);
    $("#email").attr("disabled",true);

    document.getElementById("phone").value = user.tel ;
    document.getElementById("location").value = user.location;
    const img_req = /[j,p]ng/; // reg exp to decide if image is updated or it is url
    if (img_req.test(user.image))
        document.getElementById("img").value = user.image;
    else
        document.getElementById("img_url").value = user.image;
    document.getElementById("price").value = user.price;
    document.getElementById("technology").value = user.technology;
    document.getElementById("description").value = user.description;
    document.getElementById("experience").value = user.experience;
    document.getElementById("language").value = user.language;
    document.getElementById("linkedin_url").value = user.linkedin;
    working_dates = user.working_dates;
});

function editUser() {
    let users = JSON.parse(localStorage.getItem(STORAGE_NAME));
    
    // getting values from form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
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
        document.getElementById("error").innerText = "Fill in every required field"
        return;
    }
    // phone number validation
    if (! tel_req.test(tel)) {
        document.getElementById("error").innerText = "Invalid phone number"
        return;
    }
    // check image and image_url
    if (image.length > 0 && image_url.length > 0) {
        document.getElementById("error").innerText = "Upload image or enter url, not both"
        return;
    }
    document.getElementById("error").innerText = "";
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
        working_dates:working_dates
    };
    users[index] = user;
    localStorage.setItem(STORAGE_NAME,JSON.stringify(users))
    localStorage.removeItem(STORAGE_USER_NAME);
    window.location.href=SHOW_USERS_URL 
}