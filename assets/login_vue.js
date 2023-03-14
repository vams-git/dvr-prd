
var login_ = {
  data() {
    return {
      email: '',
      new_login: true,
      loading: true,
      tokenUrl: '',
      logout: false,
      loader: false,
      time: 30,
      timer: null,
      auth_message: '',
      auth_attempts: 0
    }
  },
  watch: {
    email: {
      handler(newValue, oldValue) {
        this.email = newValue.toUpperCase();
        param['email'] = this.email;
      },
      deep: true
    }
  },
  methods: {
    addUserId(input) {
      if (input.toLowerCase().match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/) == null) {
        alert.add({
          text: 'invalid email',
          type: 'error'
        })
      } else {
        this.email = input.toUpperCase();
      }
      return this
    },
    addNewLogin(input) { this.new_login = input; return this },
    updateLoading(input) { this.loading = input; return this },
    updateLogout(input) {
      var nav = document.getElementById('main_nav');
      var logout_btn = document.getElementById('main_logout_btn');
      if (input) {
        nav.classList.remove("d-none");
        logout_btn.addEventListener("click", function () { login.log_out() });
      }
      else { nav.classList.add("d-none") }
      this.loader = false;
      this.logout = input;
      return this
    },
    reload() { window.location.replace(headUrl) },
    updateTokenUrl(input) { this.tokenUrl = input; return this },
    getData() { console.log(Object.entries(this.$data)) },
    update() {
      if (this.email.toLowerCase().match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/) == null) {
        alert.add({
          text: 'invalid email',
          type: 'error'
        })
      }
      else { window.location.replace(updateUrl(headUrl, param)) }
    },
    updateHTML(txt) { return txt.replace(/\n/g, "<br />") },
    log_in() {
      this.updateLoading(true);
      this.auth_attempts++;
      this.auth_message = 'fetching authorization confirmation\nattempt (' + this.auth_attempts + ')..';
      var fetch_status = new Request(updateUrl(login_gas, param), {
        redirect: "follow",
        method: 'POST',
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
      fetch(fetch_status)
        .then(function (response) { return response.json() })
        .then(function (data) {
          if (data.status) {
            var access = JSON.parse(JSON.stringify(param));
            access['exp'] = data.text.expiresAt;
            access['userid'] = data.text.usr_code;
            param['userid'] = data.text.usr_code;
            access['org'] = data.text.uog_org;
            param['org'] = data.text.uog_org;
            access['name'] = data.text.usr_desc;
            access['org_list'] = data.text.uog_org_list.split('; ')
            param['name'] = data.text.usr_desc;
            window.localStorage.setItem('access', JSON.stringify(access));
            window.location.replace(updateUrl(headUrl, param))
          }
          else {
            if (login.auth_attempts <= 5) { login.log_in() }
            else { window.location.replace(encodeURI(headUrl)) }
          }
        })

    },
    log_out() {
      this.updateLoading(true).updateLogout(false);
      var nav = document.getElementById('main_nav');
      nav.classList.add("d-none");
      param['logout'] = 'true';
      var log_out = new Request(updateUrl(login_gas, param), {
        redirect: "follow",
        method: 'POST',
        headers: { "Content-Type": "text/plain;charset=utf-8" }
      });
      fetch(log_out)
        .then(function (response) { return response.json() })
        .then(function (data) {
          window.localStorage.clear();
          window.location.replace(encodeURI(headUrl))
        });
    },
    decrementOrAlert() {
      if (this.time > 0) { this.time--; return }
      this.updateTokenUrl('');
      this.log_in();
      clearInterval(this.timer)
    },
    start() {
      this.timer = setInterval(this.decrementOrAlert, 1000)
      return this
    }
  }
}