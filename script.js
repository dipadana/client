$(document).ready( () => {

    checkToken()

    $('#go-register').click(function(event){
        event.preventDefault()
        goToRegisterPage()
    })

    $('#go-login').click(function(event){
        event.preventDefault()
        goToLoginPage()
    })

    $('#register-form').submit( event => {
        event.preventDefault()
        registerProcess()
    })

    $('#login-form').submit(event => {
        event.preventDefault()    
        loginProcess()    
    })

    $('#form-fetch-data').submit(event => {
        event.preventDefault()
        fetchDataFilm()
    })
})

function checkToken () {
    if(localStorage.getItem('token')){
        renderHomePage()
    }
}

function goToLoginPage () {
    $('#register-page').hide()
    $('#login-page').fadeIn()
}

function goToRegisterPage () {
    $('#login-page').hide()
    $('#register-page').fadeIn()
}

function loginProcess () {
    let email = $('#email_login').val()
    let password = $('#password_login').val()
    $.ajax({
        url : `http://localhost:3000/login`,
        method : 'POST',
        data : {
            email : email,
            password : password
        }
    })
    .done( data => {
        Swal.fire(
            'Loggin Success!',
            'You are now loggin in our web!',
            'success'
            )
        localStorage.setItem("token", data.token)
        renderHomePage()
    })
    .fail( err => {
        console.log(err)
        Swal.fire({
            title: 'error',
            type: 'error',
            text: err.responseJSON.msg
        })
    })        
}

function registerProcess () {
    let email = $('#email-register').val()
    let password = $('#password-register').val()
    $.ajax({
        url : `http://localhost:3000/register`,
        method : 'POST',
        data : {
            email : email,
            password : password
        }
    }).done( result => {
        Swal.fire(
            'Register Success!',
            'You have been registered in our web!',
            'success'
            )
        console.log(result)            
        $('#register-page').hide()
        $('#login-page').fadeIn()
    }).fail( err => {
        console.log(err)
        Swal.fire({
            title: 'error',
            type: 'error',
            text: err.responseJSON.msg
        })
        $('#email').val('')
        $('#password').val('')            
    })
}

function onSignIn(googleUser) {
    console.log('masuk')
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url : `http://localhost:3000/login-google`,
        method : "POST",
        data : {
            google_token : id_token
        }
    })
    .done( data => {
        localStorage.setItem("token", data.token)
        $('#login-page').hide()
        $('#register-page').hide()
        renderHomePage()
    })
    .fail(err=> {
        console.log(err)
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    $('#login-page').fadeIn()
    $('#home-page').hide()
    $("#nav-bar").hide()
    $("#register-page").hide()
    $("#detail-page").hide()
    $("#list-movie-page").hide()
    $("#home-page").hide()
    localStorage.removeItem("token")
}

function renderHomePage () {
    $("#sentence-emotion").val('')
    $("#nav-bar").fadeIn('slow')
    $("#home-page").fadeIn('slow')
    $("#login-page").hide()
    $("#register-page").hide()
    $("#detail-page").hide()
    $("#list-movie-page").hide()
}

function fetchDataFilm (page) {
    console.log("fetch data masuk")
    Swal.fire({
        imageUrl:"https://digitalsynopsis.com/wp-content/uploads/2016/06/loading-animations-preloader-gifs-ui-ux-effects-18.gif",
        text:'Search movie based on your mood...',
        imageHeight: 200,
        showConfirmButton: false
    })    
    $.ajax({
        method: 'post',
        url: 'http://localhost:3000',
        data:{
            text: $("#sentence-emotion").val(),
            page
        }
    })
    .done(function({list,emotion}){
        console.log(list.results,emotion)
        $("#list-movie").empty()
        for(let i = 0; i < list.results.length; i++){
            renderListMovie(list.results[i].id,list.results[i].title,list.results[i].backdrop_path)
        }
        renderListPage(emotion)
    })
    .fail(function(err){
        console.log(err)
    })
    .always(function(){
        Swal.close()
    })
}

function renderListPage (mood_status) {
    $('#mood_status').empty().append(`${mood_status}`)
    $("#list-movie-page").fadeIn('slow')
    $("#home-page").hide()
    $("#detail-page").hide()
}

function backToListPage () {
    $("#detail-page").hide()
    $("#list-movie-page").fadeIn()
}

function renderListMovie (id,title, img_url) {
    $("#list-movie").append(`
    <div onclick="fetchDetailData(${id})" style="cursor:pointer;" class="col-10 col-sm-3 mb-4">
        <img alt="image" class="img-fluid rounded" src="${ img_url ? "http://image.tmdb.org/t/p/w185/"+img_url : "./imgs/hero/blue.svg" }">
        <h3><strong>${title}</strong></h3>
    </div>
    `)
}

function toDetailPage (title, year, overview, vote_average, vote_count, runtime, youtubeId, genre) {
    $('#detail-data').empty()
    $("#detail-data").append(`
    <div class="row justify-content-center">
        <div class="col text-left">
        <h1>${title} ( <span>${year}</span> )</h1>
        <p class="lead">${overview}</p>
        </div>
    </div>
    <div class="row justify-content-center mb-5">
        <div class="col-10">
            <div class="embed-responsive embed-responsive-16by9">
        <iframe  class="img-fluid mt-5" src="https://www.youtube.com/embed/${youtubeId}">
        </iframe>
        </div>
    </div>
    </div>

    <div class="row text-left pt-5">

        <div class="col-12 col-md-4">
        <div class="row">
            <div class="col-3">
            <img alt="image" class="img-fluid" src="https://image.flaticon.com/icons/svg/616/616490.svg">
            </div>
            <div class="col-9">
            <h3><strong>Rating <span>${vote_average}</span> </strong></h3>
            <p>Vote Count: <span> ${vote_count} </span> </p>
            </div>
        </div>
        </div>

        <div class="col-12 col-md-4 pt-4 pt-md-0">
        <div class="row">
            <div class="col-3">
            <img alt="image" class="img-fluid" src="https://image.flaticon.com/icons/svg/2184/2184561.svg">
            </div>
            <div class="col-9">
            <h3><strong>Genre</strong></h3>
            <p>${genre}</p>
            </div>
        </div>
        </div>

        <div class="col-12 col-md-4 pt-4 pt-md-0">
        <div class="row">
            <div class="col-3">
            <img alt="image" class="img-fluid" src="https://image.flaticon.com/icons/svg/148/148934.svg">
            </div>
            <div class="col-9">
            <h3><strong>Runtime</strong></h3>
            <p>This movie is ${runtime} Minutes long</p>
            </div>
        </div>
        </div>
        <a style="cursor:pointer;" class="btn btn-danger ml-md-3 mt-5 text-light" onclick="backToListPage()">Back</a>    
    </div>
    `)
    $("#detail-page").show()
    $("#list-movie-page").hide()
    $("#home-page").hide()
}

function fetchDetailData (id) {
    console.log(id)
    Swal.fire({
        imageUrl:"https://digitalsynopsis.com/wp-content/uploads/2016/06/loading-animations-preloader-gifs-ui-ux-effects-18.gif",
        text:'Loading movie data...',
        imageHeight: 200,
        showConfirmButton: false
    })    
    $.ajax({
        method: 'get',
        url: `http://localhost:3000/${id}`
    })
    .done(function({detailMovie,youtubeId}){
        console.log(detailMovie, youtubeId)
        let date = new Date(detailMovie.release_date)
        let genres = []
        for(let i = 0; i < detailMovie.genres.length; i++){
            genres.push(detailMovie.genres[i].name)
        }
        toDetailPage(
            detailMovie.title,
            date.getFullYear(),
            detailMovie.overview,
            detailMovie.vote_average,
            detailMovie.vote_count,
            detailMovie.runtime,
            youtubeId,
            genres.join(', ')
        )
        Swal.close()
    })
    .fail(function(err){
        console.log(err.message)
        // error HARUS DI HANDLE DISINI
        Swal.fire({
            type: 'error',
            title: 404,
            text: 'Sorry, data you want is not found...'
        })
    })
}