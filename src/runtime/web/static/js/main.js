
//system code
  function post_json(url, data, callback, error_callback) {
      $.ajax({
          url: url,
          type: "POST",
          data: JSON.stringify(data),
          contentType: "application/json; charset=utf-8",
          success: callback,
          error: function (request, status, error) {
              console.log("error on: " + url + 
                          "\n|data: " + data  + 
                          "\n|RESPONSE: " + request.responseText + 
                          "\n| status: " + status + 
                          "\n| error: " + error);
              //TODO: figure out which one of this is "semantically correct"
              if (error_callback != null && error_callback != undefined && error_callback) {
                  error_callback(request, status, error);
              }
          }
      });
  }
var MockAPI = {
  users: [],
    create_user: function(name, email, cb) {
        this.users.push({name: name, email: email});
    },
get_all_users: function(cb) {
    cb(this.users);
}
};
var RestAPI = {
    create_session: function(role, success_cb, error_cb) {
        post_json("/create_session",
            {
              role: role
            },
            success_cb,
            error_cb);
    },
    delete_user: function(id, success_cb, error_cb) {
        $.ajax({
            url: '/users/' + id,
            type: 'DELETE',
            success: success_cb,
            error: error_cb
        });
    },
  create_user: function(name, email, role_id, cb, error_cb) {
      console.log("create_user name: " + name + " |email: " + 
                  email + " |role_id: " + role_id);
      post_json("/users",
                {name: name, email: email, role_id: role_id},
                function(data) { console.log(data); cb(data) },
                error_cb);
  },
  get_all_users: function (cb) {
    $.get("/users",
          function(data) { console.log(data); cb(data) });
  },
  login: function(role) {
      window.location.href = "/login/" + role;
  },
  logout: function(role, success_cb, failure_cb) {
      window.location = "/logout";
  }
};
  function navigate(path) {
      var current = window.location.href;
      window.location.href = current.replace(/#(.*)$/, '') + '#' + path;
      //TODO: figure out why I need to call this manually. does not work without this
      //the first time
      //$(window).trigger("hashchange")
  }
  
  function get_window_hash_url() {
      return location.hash.substring(1);
  }
  
  function make_hash_handler(handler_functions) {
      $(window).on("hashchange", function(e) {
          //strip hash out
          hash = get_window_hash_url();
          console.log("new hash: ", hash);
          //we use hasOwnProperty since we need to check if this
          //object has it, not its parents (in the prototype chain)
          if (handler_functions.hasOwnProperty(hash)) {
              //invoke said handler function
              handler_functions[hash]();
          } else {
              console.warn(`no handler for ${hash}`);
          }
      });
  };

//user code
var API = RestAPI;

//components
//use to hide all containers before displaying another container
function hide_all_containers() {
    // TODO: consider refactoring to addClass in a loop
    $('#login-container').addClass("hidden");
    $('#register-container').addClass("hidden");
    $('#get-all-users-container').addClass("hidden");
    $('#create-user-container').addClass("hidden");
    $('#home-container').addClass("hidden");
    $('#index-container').addClass("hidden");
}
function register_handler() {
    hide_all_containers()
    $("#register-container").removeClass("hidden");
}
function login_handler() {
    hide_all_containers();
    $("#login-container").removeClass("hidden");
}
  function make_li_for_user(user) {
      console.log("user: " + user + "|email: " + user.email + "|name: " + user.name)
      let delete_button = "<button style='margin-left: 1em' onclick=user_list_delete(" + user.id + ")> Delete </button>";
      let li = $("<li>" + "Name: " + user.name + " | Email: " + user.email + delete_button +  "</li>");
      return li;
  }
  
  function user_list_delete(id) {
      API.delete_user(id, function() { 
          //TODO: use client-side flash for this message
          console.log("User successfully deleted");
          //trigger page reload
          //FIXME: currently forcing' page reload
          $(window).trigger("hashchange");
          navigate("get_all_users");
      }, 
      function(req) {
          alert("error: " + req.responseText);
      });
  }
  
  
  function get_all_users_handler() {
      hide_all_containers();
      var container = $('#get-all-users-container');
      container.removeClass("hidden");
      
      API.get_all_users(function(users) {
          console.dir(users);
          let ul = $('#get-all-users-container #users-list');
          ul.empty(); //TODO: slower than removing nodes
          for(var i = 0; i < users.length; ++i) {
              let user = users[i];
              let li = make_li_for_user(user);
              ul.append(li);
          }
    });
  
  
  }
  function create_user_handler() {
      hide_all_containers();
      $("#create-user-container").removeClass("hidden");
  }
  
  function create_user_callback() {
      console.log("create user callback called")
  
      let username = $('#create-user-username').val();
      let email = $('#create-user-email').val();
      let role_id = $('#create-user-role-id').val();
  
      $("#create-user-error-box").text("");
      if (username == "") {
          $("#create-user-error-box").text("Please fill in username");
          return;
      }
      else if (email == "") {
          $("#create-user-error-box").text("Please fill in email");
          return;
      }
      
      function success_callback() {
          $('#create-user-info-box').text("Success, user: " + username + "created");
      }
  
      function error_callback(request) {
          let error_json = JSON.parse(request.responseText);
          $('#create-user-error-box').text(error_json['error'] || 'Unable to find error');
      }
      API.create_user(username,
                      email,
                      role_id,
                      success_callback,
                      error_callback);
  }
  function home_handler() {
      hide_all_containers();
      $('#home-container').removeClass("hidden");
  }
  function index_handler() {
      hide_all_containers();
      $('#index-container').removeClass("hidden");
  }

  function login_onclick() {
    //TODO: make role customizable
    API.login("admin");
  }

//NOTE: user_window_onload uses the handlers
//so keep these below the handlers

function is_logged_in() {
  return document.cookie.indexOf("session") != -1;
}

  window.onload = function() {
      make_hash_handler({register: register_handler,
                         login:  login_handler,
                         get_all_users: get_all_users_handler,
                         create_user: create_user_handler,
                         home: home_handler,
                         index: index_handler});
      
      // Hashes available when not logged in (authorized)
      var unauth_available_hashes = ["index"];

      //TODO: figure out why this does not trigger onhashchange
      //TRIAL: check if preventing race condition helps
      setTimeout(function() {

          let current_hash = get_window_hash_url();
          if (current_hash == "") {
              console.log("defaulting #url to get_all_users");
              
              //send logged in users to home, others to index
              if (is_logged_in()) {
                current_hash = "home";
              }
              else {
                current_hash = "index";
              }
          }

          console.log("navigating to: #" + current_hash);
          
          // If the hash is available to everyone, or if the user
          // is logged in, give them access
          if (unauth_available_hashes.indexOf(current_hash) > -1  ||
             is_logged_in()) {
            navigate(current_hash);
          }
          else {
            //by default, if unauthorized, send to index page
            naviagte("index");
          }

          //HACK: I don't know why this is needed for the first hash change. figure it out!
          $(window).trigger("hashchange")
      }, 100);
  }
