let postForm = document.getElementById('postForm');
let titleControl = document.getElementById('title');
let bodyControl = document.getElementById('body');
let userIdControl = document.getElementById('userId');
let postContainer = document.getElementById('postContainer');
let addpostbtn = document.getElementById('addpostbtn');
let updatepostbtn = document.getElementById('updatepostbtn');
let spinner = document.getElementById('spinner');

let BASE_URL = `https://jsonplaceholder.typicode.com`;
let POST_URL = `${BASE_URL}/posts`;

let EditId;

// ================= FETCH POSTS =================
function fetchdata() {

    spinner.classList.remove('d-none');

    let xhr = new XMLHttpRequest();
    xhr.open('GET', POST_URL, true);
    xhr.send();

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            let data = JSON.parse(xhr.response);
            createtemplatCardS(data);
            spinner.classList.add('d-none');

        } else {
            console.log("Something went wrong");
            spinner.classList.add('d-none');
        }

    }

}

fetchdata();


// ================= CREATE CARDS =================
function createtemplatCardS(arr) {

    let result = '';

    arr.forEach(post => {

        result += `
        <div class="col-md-4 mb-4" id="${post.id}">
            <div class="card h-100">

                <div class="card-header">
                    <h6>${post.title}</h6>
                </div>

                <div class="card-body">
                    <p>${post.body}</p>
                    <p>${post.userId}</p>
                </div>

                <div class="card-footer d-flex justify-content-between">
                    <button onclick="onEdit(this)" class="btn btn-outline-primary">EDIT</button>
                    <button onclick="onRemove(this)" class="btn btn-outline-danger">REMOVE</button>
                </div>

            </div>
        </div>
        `;

    });

    postContainer.innerHTML = result;

}


// ================= ADD POST =================
function onaddpost(e) {

    e.preventDefault();

    spinner.classList.remove('d-none');

    let postObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    };

    let xhr = new XMLHttpRequest();
    xhr.open('POST', POST_URL, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(postObj));

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            let data = JSON.parse(xhr.response);

            let col = document.createElement('div');
            col.className = "col-md-4 mb-4";
            col.id = data.id;

            col.innerHTML = `
            <div class="card h-100">

                <div class="card-header">
                    <h6>${postObj.title}</h6>
                </div>

                <div class="card-body">
                    <p>${postObj.body}</p>
                    <p>${postObj.userId}</p>
                </div>

                <div class="card-footer d-flex justify-content-between">
                    <button onclick="onEdit(this)" class="btn btn-outline-primary">EDIT</button>
                    <button onclick="onRemove(this)" class="btn btn-outline-danger">REMOVE</button>
                </div>

            </div>
            `;

            postContainer.prepend(col);

            Swal.fire({
                title: `Post ${postObj.title} added successfully!`,
                icon: "success",
                timer: 1500
            });

            postForm.reset();
            spinner.classList.add('d-none');

        } else {

            spinner.classList.add('d-none');

            Swal.fire({
                title: "Something went wrong!",
                icon: "error"
            });

        }

    }

}


// ================= EDIT POST =================
function onEdit(ele) {

    EditId = ele.closest('.col-md-4').id;

    let EDIT_URL = `${BASE_URL}/posts/${EditId}`;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', EDIT_URL, true);
    xhr.send();

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            let data = JSON.parse(xhr.response);

            titleControl.value = data.title;
            bodyControl.value = data.body;
            userIdControl.value = data.userId;

            addpostbtn.classList.add('d-none');
            updatepostbtn.classList.remove('d-none');

        }

    }

}


// ================= UPDATE POST =================
function onupdatepost() {

    spinner.classList.remove('d-none');

    let updatedObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    };

    let UPDATE_URL = `${BASE_URL}/posts/${EditId}`;

    let xhr = new XMLHttpRequest();
    xhr.open('PATCH', UPDATE_URL, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(updatedObj));

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            let col = document.getElementById(EditId);

            col.querySelector('.card-header h6').innerHTML = updatedObj.title;
            col.querySelector('.card-body p').innerHTML = updatedObj.body;

            updatepostbtn.classList.add('d-none');
            addpostbtn.classList.remove('d-none');

            Swal.fire({
                title: "Post Updated Successfully!",
                icon: "success",
                timer: 1500
            });

            postForm.reset();
            spinner.classList.add('d-none');

        }

    }

}


// ================= DELETE POST =================
function onRemove(ele) {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {

        if (result.isConfirmed) {

            spinner.classList.remove('d-none');

            let RemoveId = ele.closest('.col-md-4').id;

            let DELETE_URL = `${BASE_URL}/posts/${RemoveId}`;

            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', DELETE_URL, true);
            xhr.send();

            xhr.onload = function () {

                if (xhr.status >= 200 && xhr.status <= 299) {

                    ele.closest('.col-md-4').remove();

                    spinner.classList.add('d-none');

                    Swal.fire(
                        "Deleted!",
                        "Post deleted successfully.",
                        "success"
                    );

                }

            }

        }

    });

}


// ================= EVENT LISTENERS =================
postForm.addEventListener('submit', onaddpost);
updatepostbtn.addEventListener('click', onupdatepost);