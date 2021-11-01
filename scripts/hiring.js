var cnt_dev_box = 1; // counter for tracking number of boxes put up
var cnt_dev = 0; // counter for tracking number of developers 
var flags = [false] // tracking if name in box doesn't go beyond 1
const STORAGE_NAME = "users"

$(document).ready(() => {
    $("#nav").append(createNavbar());
    $("#developers").on("keyup",".developer",(event) => {
        // on keyup check if new developer is inserted 
        // or maybe deleted
        const id = parseInt(event.target.id);
        const input_val = event.target.value;
        if (input_val.length >= 1 && !flags[id - 1]) {
            ++cnt_dev; // new developer registred
            flags[id - 1] = true;
            if (cnt_dev == cnt_dev_box) {
                // create new html input box
                const input_box_html = '<div class="form-group"><label>Developer ' +  String(++cnt_dev_box) +' name:</label><input type="text" class="form-control developer"  placeholder="Enter name" id="' + String(cnt_dev_box) + '"></div>';
                $("#developers").append(input_box_html);
            }
        }
        else if (input_val.length == 0) {
            // developer deleted from box 
            flags[id - 1] = false
            --cnt_dev;
        }
})
}  
);

function hire() {
    // clean succes message
    document.getElementById("success").innerText="";

    if (cnt_dev == 0) {
        document.getElementById("error").innerText = "No developer selected!"
        return;
    }

    const developers = document.getElementsByClassName("developer")
    const start_date = document.getElementById("start_date").value;
    const end_date = document.getElementById("end_date").value;
    // validate start and end date
    if (start_date.length == 0 || end_date == 0) {
        document.getElementById("error").innerText = "Insert date!"
        return;
    }
    if (start_date > end_date) {
        document.getElementById("error").innerText = "Start date can't be after end date!";
        return;
    }

    const date = new Date();
    const leading_zero = String(date.getUTCDate()).length==1?"0":""; // leading zero needed to have consistent format with start and end date
    const today = date.getUTCFullYear() + "-" +(date.getUTCMonth()+1) + "-" +  leading_zero + date.getUTCDate();
    if (start_date <= today || end_date <= today ){
        document.getElementById("error").innerText = "Start date and end date must be after today!";
        return;
    }

    msg = checkDevelopersAvailabilty(developers,start_date,end_date);
    if (!msg.state) {
        document.getElementById("error").innerText = msg.message;
        return;
    }
    // cleaning developers and errors
    document.getElementById("error").innerText = "";
    document.getElementById("success").innerText = msg.message;
    for(let developer of developers) {
       developer.value = ""
   }
}

function checkDevelopersAvailabilty(wanted_devs,start_date,end_date) {
    // check if team of developers is avaible on dates
    let return_message = {
        state:null,
        message:null
    }
    let users_data = localStorage.getItem(STORAGE_NAME);
    if (!users_data) {
        return_message.state = false;
        return_message.message = "No developers in database";
        return return_message;
    }
    let users = JSON.parse(users_data);
    // store usernames in map for faster search
    // map format {
    //    username: [user,index in users array]
    //}
    let hash_map = new Map();
    users.forEach((user,index) => {
        hash_map.set(user.name,[user,index]);
    })
    for(let developer of wanted_devs) {
        if (developer.value == "") continue
        const dev_name = developer.value;
        if (!hash_map.has(dev_name)) {
            return_message.state = false;
            return_message.message = "Developer with name " + dev_name + " doesn't exist!"
            return return_message;
        }
        else {
            const dev = hash_map.get(dev_name)[0];

            for(let dates of dev.working_dates) {
                if ((start_date >= dates.start && start_date <= dates.end) || (end_date >= dates.start && end_date<=dates.end)) {
                    // date span is booked
                    return_message.state = false;
                    return_message.message = "Developer " + dev_name +  " is booked for this time period";
                    return return_message;
                }
            }
        }
    }
    // successfully checked dates for all users
    // update users working dates
    for (let developer of wanted_devs) {
        if (developer.value == "") continue;
        const dev_name = developer.value;
        const dev_index = hash_map.get(dev_name); // array with developer and index in users array
        dev_index[0].working_dates.push({
            start:start_date,
            end:end_date
        })
        users[dev_index[1]] = dev_index[0]
    }
    localStorage.setItem(STORAGE_NAME,JSON.stringify(users));
    return_message.state = true;
    return_message.message = "Successfully hired all developers"
    return return_message;
}