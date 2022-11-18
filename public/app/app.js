import {loginCreate, changeCampHolder, changePageContent } from "../model/model.js";

// loadMoreItems,

var userExists = false;
var userFullName = "";

function changeRoute(){
  changePageContent();
}

window.loadData = function(){
    changeRoute();
    initListeners(); 
}

function initListeners() {
    // mobile nav listeners
    barsLinksListener();

    $(".navHolder .links #home").click(function(e){
      console.log("Click home-----")
      $("#app").html("");
      // loginCreate();
      changePageContent();
      // loadData();
    });

    $(".navHolder .links #login").click(function(e){
      console.log("Click login")
      signIn();
      $("#app").html("");
      loginCreate();
      // loadData();
    });

    $(".navHolder .links #signOut").click(function(e){
      console.log("Click Sign Out")
      signOut();
      $("#app").html("");
      // loginCreate();
      loadData();
    });

    // Full image and desciption listeners
    // campHolder();

    // $(".camp-holder").click(function(e){
    //   let campIndex = e.currentTarget.id;
    //   // console.log(campIndex);
    //   changeCampHolder(campIndex);
      
    //   // close button listener
    //   addCloseListener();
    // });
    
    $(".more-items").click(function(e){
      let moreItems = e.currentTarget.id;
      console.log("More items click in app.js");
      loadMoreItems(moreItems);
      // close button listener
      addCloseListener();
    });
}

window.campHolder = function () {
  $(".camp-holder").click(function(e){
    let campIndex = e.currentTarget.id;
    // console.log(campIndex);
    changeCampHolder(campIndex);
    
    // close button listener
    addCloseListener();
  });
}

window.barsLinksListener = function (){
    $(".bars").click(function(e){
      // console.log("clicked");
      $(".bars").toggleClass("active");
      $(".links").toggleClass("active");
  });

  $(".links a").click(function(e){
      $(".bars").toggleClass("active");
      $(".links").toggleClass("active");
      // $(".links").removeClass("active");
  });
}
// window.loadMoreItems = function (){
window.addCloseListener = function(){
  $(".close").click(function(){
    $("#app").html("");
    loadData();
    barsLinksListener();
  });
}

function initFirebase() {
  firebase.auth().onAuthStateChanged((user) => {
    if(user) {
      console.log("auth change logged in");
      if(user.displayName) {
        $(".name").html(user.displayName);
      }
      $(".load").attr("disabled", false);
      userExists = true;
    }
    else {
      console.log("auth change logged out-- user does not exist");
      $(".name").html("");
      $(".load").attr("disabled", true);
      userExists = false;
      userFullName = "";
    }
  })
}

window.signOut = function() {

  // console.log("INside sign out function")
  firebase.auth().signOut()
  .then(() => {
    console.log("signed out");
  })
  .catch((error) => {
    console.log("Error Signing in out ");
  });
}

window.logIn = function () {

  let email = $("#email").val();
  let password = $("#password").val();

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log("logged in");
    $("#email").val("");
    $("#password").val("");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("logged in " + errorMessage);
  });
}

window.createAccount = function () {
  let fName = $("#fName").val();
  let lName = $("#lName").val();
  let email = $("#signup-email").val();
  let password = $("#signup-password").val();
  let fullName = fName + " " + lName;

  console.log ("Create " + fName + ' ' + lName + ' ' + email + ' ' + password);

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    console.log("created");
    firebase.auth().currentUser.updateProfile({
      displayName: fullName,
    });
    userFullName = fullName;
    $(".name").html(userFullName);
    $("#fName").val("");
    $("#lName").val("");
    $("#signup-email").val("");
    $("#signup-password").val("");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("create error " + errorMessage);
  });
}

window.signIn = function () {
  firebase.auth().signInAnonymously()
  .then(() => {
    console.log("signed in");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error Signing in " + errorMessage);
  });
}

// function signInAnon() {
//   firebase.auth().signInAnonymously()
//   .then(() => {
//     console.log("signed in");
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.log("Error Signing in " + errorMessage);
//   });
// }

$(document).ready(function() {
  try {
    let app = firebase.app();
    initFirebase();
    // signInAnon();
    loadData(); 
  }
  catch (error) {
    console.log("error" + error);
  }
    // loadData();   
});