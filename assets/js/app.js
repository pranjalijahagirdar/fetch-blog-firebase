const cl=console.log;

const postForm = document.getElementById('postForm')
const AddpostBtn = document.getElementById('AddpostBtn')
const UpdatepostBtn = document.getElementById('UpdatepostBtn')
const titleControl = document.getElementById('titleControl')
const userIdControl = document.getElementById('userIdControl')
const bodyControl = document.getElementById('bodyControl')
const spinner = document.getElementById('spinner')
const postContainer = document.getElementById('postContainer')

const BASE_URL = `https://crud-6b7ce-default-rtdb.firebaseio.com`;
const BLOG_URL = `${BASE_URL}/blogs.json`

function snackbar(msg, icon){
    Swal .fire({
        title:msg,
        icon:'success',
        timer: 3000
    })
}

const state = {
    blogsArr : [],
    editId : null,
}

function showSpinner(){
    spinner.classList.remove('d-none')
}

function hideSpinner(){
    spinner.classList.add('d-none')
}

function fetchBlog(){
    showSpinner()
    fetch(BLOG_URL,{
        method : "GET",
        body : null,
        headers : {
            "content-type" : "application/json",
            "Authorization" : "TOKEN JWT LS",
        }
    })
    .then(res=>{
        return res.json()
    })
    .then(data=>{
        for(const key in data){
            data[key].id = key
            state.blogsArr.unshift(data[key])
        }
        createBlogCards(state.blogsArr)
    })
    .catch(err=>{
        cl(err)
    })
    .finally(()=>{
        hideSpinner()
    })
}

fetchBlog()

function createBlogCards(arr){
    let result = ``;
    arr.forEach(blog=>{
        result += ` <div class="col-md-4 mb-4" id="${blog.id}">
            <div class="card h-100">
                <div class="card-header">
                    <h3>
                        "${blog.title}"
                    </h3>
                </div>
                <div class="card-body">
                    <p>
                       "${blog.body}"
                    </p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="editBlog(this)" class="btn btn-sm btn-primary">EDIT</button>
                    <button onclick="deleteBlog(this)" class="btn btn-sm btn-info">DELETE</button>
                </div>
            </div>
        </div>`
    });
    postContainer.innerHTML = result;
}

//create

function onAddBlog(eve){
    eve.preventDefault()
    let blogObj={
        title:titleControl.value,
        userId:userIdControl.value,
        body:bodyControl.value,
    }
    showSpinner()
    fetch(BLOG_URL,{
        method : "POST",
        body : JSON.stringify(blogObj),
        headers : {
            "content-type" : "application/json",
        }
    })
    .then(res=>{
        return res.json()
    })
    .then(data=>{
        blogObj.id = data.name
        state.blogsArr.unshift(blogObj)
        postForm.reset()
        let col = document.createElement('div')
        col.className = 'col-md-4 mb-4'
        col.id = blogObj.id;
        col.innerHTML = `<div class="card h-100">
                <div class="card-header">
                    <h3>
                        ${blogObj.title}
                    </h3>
                </div>
                <div class="card-body">
                    <p>
                        ${blogObj.body}
                    </p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="editBlog(this)" class="btn btn-sm btn-primary">EDIT</button>
                    <button onclick="deleteBlog(this)" class="btn btn-sm btn-info">DELETE</button>
                </div>
            </div>`

            postContainer.prepend(col)
            snackbar("Blog added successfully !!!", "success")
    })
    .catch(err=>{
        snackbar("Failed to update blog !!!", "error")
        cl(err)
    })
    .finally(()=>{
        hideSpinner()
    })
}

//edit

function editBlog(ele){
    let edit_Id = ele.closest('.col-md-4').id;
    state.editId = edit_Id;
    let EDIT_URL = `${BASE_URL}/blogs/${edit_Id}.json`
    showSpinner()
    fetch(EDIT_URL,{
        method: "GET",
        body : null,
        headers : {
            "Content-type" : "application/json",
            "Authorization" : "TOKEN JWT form LS",
        }
    })
        .then(res=>{
            return res.json()
        })
        .then(res=>{
            titleControl.value = res.title;
            userIdControl.value = res.userId;
            bodyControl.value = res.body;
            AddpostBtn.classList.add('d-none')
            UpdatepostBtn.classList.remove('d-none')
        })
        .catch(err=>{
            cl(err)
        })
        .finally(()=>{
            hideSpinner()
        })
}

//update

function onUpdateBlog(){
    let update_Id = state.editId;
    let UPDATE_URL = `${BASE_URL}/blogs/${update_Id}.json`;
    let updateObj={
        title:titleControl.value,
        userId:userIdControl.value,
        body:bodyControl.value,
        id:update_Id
    }
    showSpinner()
        fetch(UPDATE_URL,{
            method : "PATCH",
            body : JSON.stringify(updateObj),
            headers : {
            "Content-type" : "application/json",
            "Authorization" : "TOKEN JWT form LS",
            }
        })
            .then(res=>{
                return res.json()
            })
            .then(data=>{
                cl(data)
                let getIndex = state.blogsArr.findIndex(a=>a.id === update_Id);
                state.blogsArr[getIndex]=updateObj;
                let col =  document.getElementById(update_Id);
                col.innerHTML = `<div class="card h-100">
                <div class="card-header">
                    <h3>
                        ${updateObj.title}
                    </h3>
                </div>
                <div class="card-body">
                    <p>
                        ${updateObj.body}
                    </p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="editBlog(this)" class="btn btn-sm btn-primary">EDIT</button>
                    <button onclick="deleteBlog(this)" class="btn btn-sm btn-info">DELETE</button>
                </div>
            </div>`
            postForm.reset()
            snackbar(`The blog with ${update_Id} is updated successufully !!!`, 'success')
            AddpostBtn.classList.remove('d-none')
            UpdatepostBtn.classList.add('d-none')
            })
            .catch(err=>{
               snackbar("Failed to update blog !!!", "error")
                cl(err)
            })
            .finally(()=>{
                hideSpinner()
            })
}

//delete

function deleteBlog(ele){
    let remove_Id = ele.closest('.col-md-4').id;
    let REMOVE_URL = `${BASE_URL}/blogs/${remove_Id}.json`;
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"

})
.then((result) => {
  if (result.isConfirmed) {

// });

     showSpinner()
    fetch(REMOVE_URL,{
        method : "DELETE",
        body : null,
        headers : {
            "Content-type" : "application/json"
        }
    
    })
    .then(res => {
        return res.json()
    })
    .then(data => {
        cl(data)
        let getIndex = state.blogsArr.findIndex
        (b=> b.id === remove_Id)
        state.blogsArr.splice(getIndex, 1)
        let col = document.getElementById(remove_Id)
        cl(col)
        ele.closest('.col-md-4').remove()
        snackbar('blog deleted successfully !!!', 'success')
    
    })

    .catch(err => {
        snackbar(err)
    })

    .finally(() => {
        hideSpinner()
    })
  }
})
}
postForm.addEventListener("submit", onAddBlog)
UpdatepostBtn.addEventListener("click", onUpdateBlog)