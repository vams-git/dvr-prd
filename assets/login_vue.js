
var login_ = {
  data() {
    return {
      email: '',
      new_login: true,
      loading: true,
      tokenUrl: '',
      logout: false
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
    addUserId(input) { this.email = input.toUpperCase(); return this },
    addNewLogin(input) { this.new_login = input; return this },
    updateLoading(input) { this.loading = input; return this },
    updateLogout(input) { this.logout = input; return this },
    updateTokenUrl(input) { this.tokenUrl = input; return this },
    getData() { console.log(Object.entries(this.data())) },
    update() {
      window.location.replace(updateUrl(headUrl, param))
    },
    auth() {
      var url = this.tokenUrl;
      window.location.replace(url)
    },
    log_out() {
      this.loading = true;
      param['logout'] = 'true';
      var log_out = new Request(updateUrl(gas, param), {
        redirect: "follow",
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      });
      fetch(log_out)
        .then(function (response) { return response.json() })
        .then(function (data) {
          if (data.status) {
            window.localStorage.clear();
            window.location.replace(headUrl);
          }
        });
    },
  }
}