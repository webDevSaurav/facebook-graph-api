let validTokenFound = false; //keep track if the token is valid
//ajax call starts
let getData = (token) => {
    $.ajax({
        type : "GET",
        dataType : "JSON",
        async : true,
        url : `https://graph.facebook.com/me?fields=id,name,birthday,cover,picture.type(large),hometown,email,posts{message,full_picture}&access_token=${token}`,
        //before success show loading
        beforeSend: function() {
            $(".loading").css('display',"block");
        },
        success: (response) => {
            //If the token is valid then make the flag true
            validTokenFound = true
            
            //Add the basic info 
            //Info comp starts
            $(".info-comp").html(`
                <div class="row profile-img">  
                    <img src="${response.picture.data.url ? response.picture.data.url : ""}">
                </div>
                <div class="row name info-elememt-text">
                    <span>${response.name ? response.name : ""}</span>
                </div>
                <div class="row dob info-elememt-text">
                    <strong>DOB : </strong><span>${response.birthday ? response.birthday : ""}</span>
                </div>
                <div class="row e-mail info-elememt-text">
                    <strong>E-Mail : </strong><span>${response.email ? response.email : ""}</span>
                </div>
                <div class="row hometown info-elememt-text">
                    <strong>Hometown : </strong><span>${response.hometown.name ? response.hometown.name : ""}</span>
                </div>
            `);
            $(".info-box").css("background", `url("${response.cover.source}")`, "no-repeat")
            $(".info-box").css("background-size","cover")
            //Info comp ends

            //Post component starts
            let postsText = ""
            for(post of response.posts.data){
                if(post.full_picture || post.message){ //make a card only if either msg or picture is there
                    if(post.full_picture && post.message){ // if both msg and pic
                        postsText += `
                            <div class="card text-dark">
                            <img class="card-img-top" src="${post.full_picture}" alt="Card image cap"> 
                            <div class="card-body">
                            <p class='card-text'>${post.message}</p>
                            </div>
                            </div>
                             `
                    } else if(post.full_picture){ //if only pic
                        postsText += `
                            <div class="card">
                                <img class="card-img" src="${post.full_picture}" alt="Card image">
                            </div>
                            `
                    } else if(post.message) { //if only msg
                        postsText += `
                            <div class="card text-dark text-center p-3">
                            <blockquote class="blockquote mb-0">
                            <p>${post.message}</p>
                            </blockquote>
                            </div>
                            `
                    }
                }
            }
            //add the posts to the post comp
            $(".posts").html(postsText);
            //Post component ends
        },
        //after success remove loading and move to next page
        complete: function() {
            $(".loading").css('display',"none");
            showInfoComp();
            $(".show-info").css("display","block");
            $(".show-feed").css("display","block");
        },
        error : (err) => {
            //If error make flag false
            validTokenFound = false
            alert(err.responseJSON.error.message);
        }
    })
}
//ajax call ends
//Switch between different components
let showTokenComp = () => {
    $(".token-element").fadeIn();
    $(".info-element").fadeOut();
    $(".news-feed-element").fadeOut();
}
let showInfoComp = () => {
    $(".token-element").fadeOut();
    $(".info-element").fadeIn();
    $(".news-feed-element").fadeOut();
}
let showFeedComp = () => {
    $(".token-element").fadeOut();
    $(".info-element").fadeOut();
    $(".news-feed-element").fadeIn();
}

$(document).ready(()=>{
    //When token is entered
    $(".enter-token").click(()=>{
      let token = $(".token-input")[0].value;
      if(token == null || token == "" || token == undefined){ //If token not entered
        alert("Token not found!")
        } else {
            getData(token); //call the ajax fucn
            if(validTokenFound){ //If valid token found
                
            }
        }
    })
    $(".show-token").click(function(e){
        e.preventDefault();
        showTokenComp();
    });
    $(".show-info").click(function(e){
        e.preventDefault();
        showInfoComp();
    });
    $(".show-feed").click(function(e){
        e.preventDefault();
        showFeedComp();
    });
})