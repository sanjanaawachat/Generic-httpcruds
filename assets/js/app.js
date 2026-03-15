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
let arr = [];
function fetchdata() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', POST_URL, true);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let arr = JSON.parse(xhr.response);
            // console.log(res);
            createtemplatCardS(arr);

        } else {
            console.log(error);

        }
    }
}
fetchdata();

function createtemplatCardS(arr) {
    let result = '';
    arr.forEach(post => {
        result += `  <div class="col-md-4 mb-4" id="${post.id}">
                <div class="card h-100">
                
                    <div class="card-header">
                          <h6> ${post.title}</h6>
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
            </div>`

        postContainer.innerHTML = result;

    });
}


createtemplatCardS(arr);

function onaddpost(eve) {
    eve.preventDefault();
    spinner.classList.remove('d-none');
    let postObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value,
    }
    console.log(postObj);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', POST_URL, true);
    xhr.send(JSON.stringify(postObj));
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let data = JSON.parse(xhr.response);
            spinner.classList.add('d-none');
            let col = document.createElement('div');
            col.className = `col-md-4 mb-4`;
            col.id = data.id;
            col.innerHTML = `<div class="card h-100">
                    <div class="card-header">
                     <h6> ${postObj.title}</h6>
                    </div>
                    <div class="card-body">

                        <p>${postObj.body}</p>

                        <p>${postObj.userId}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-outline-primary">EDIT</button>
                        <button onclick="onRemove(this)" class="btn btn-outline-danger">REMOVE</button>
                    </div>
                </div>`

            postContainer.prepend(col);

            Swal.fire({
                title: `post ${postObj.title} add successfully!!!`,
                icon: "success",
                timer: 1500
            })
            postForm.reset();

        } else {
            Swal.fire({
                title: `something went wrong!!!!!`,
                icon: "error",
                timer: 1500
            })

        }
    }


}
let EditId;
function onEdit(ele) {
    spinner.classList.remove('d-none');
    EditId = ele.closest('.col-md-4').id;
    console.log(EditId);
    localStorage.setItem('EditId', EditId)
    let EDII_URL = `${BASE_URL}/posts/${EditId}`;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', EDII_URL, true);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let data = JSON.parse(xhr.response);
            console.log(data);
            // patch
            titleControl.value = data.title;
            bodyControl.value = data.body;
            userIdControl.value = data.userId;


            addpostbtn.classList.add('d-none');
            updatepostbtn.classList.remove('d-none')


        }
    }



}


function onupdatepost() {
    let update_Id = localStorage.getItem('EditId');
    console.log(update_Id);
    let updatedObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value,
        id: update_Id
    }
    console.log(updatedObj);

    let UPDATE_URL = `${BASE_URL}/posts/${update_Id}`;
    let xhr = new XMLHttpRequest();
    xhr.open('PATCH', UPDATE_URL, true);
    xhr.send(JSON.stringify(updatedObj));
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let data = JSON.parse(xhr.response);
            console.log(data);
            spinner.classList.add('d-none');

            let col = document.getElementById(update_Id);
            col.querySelector('.card-header h6').innerHTML = updatedObj.title;
            col.querySelector('.card-body p').innerHTML = updatedObj.body;


            updatepostbtn.classList.add('d-none');

            addpostbtn.classList.remove('d-none');


            Swal.fire({
                title: `post ${updatedObj.title} updated successfully!!!`,
                icon: "success",
                timer: 1500
            })
            postForm.reset();

        }
    }



}

function onRemove(ele) {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            let RemoveId = ele.closest('.col-md-4').id;
            console.log(RemoveId);

            let DELETE_URL = `${BASE_URL}/posts/${RemoveId}`;

            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', DELETE_URL, true);
            xhr.send();
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let data = JSON.parse(xhr.response);
                    console.log(data);

                    ele.closest('.col-md-4').remove();
                }

            }
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });


}


postForm.addEventListener('submit', onaddpost);
updatepostbtn.addEventListener('click', onupdatepost)