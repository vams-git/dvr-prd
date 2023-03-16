var alert_ = {
  data() {
    return {
      id: 0,
      datas: []
    };
  },
  methods: {
    add(input) {
      this.id++;
      var new_id = this.id++;
      var prefix;
      var classfix;
      if (input.type == 'error') { prefix = 'E'; classfix = 'bg-danger' }
      if (input.type == 'info') { prefix = 'I'; classfix = 'bg-warning' }
      if (input.type == 'success') { prefix = 'S'; classfix = 'bg-primary' }
      this.datas.unshift({
        id: prefix + (new_id).toString().padStart(3, '0'),
        text: input.text,
        type: input.type,
        classfix: classfix
      });
    },
    remove(id) {
      var index = this.datas.findIndex(function (e) { return e.id === id });
      var removed = this.datas.splice(index, 1)
    }
  }
};

var user_ = {
  data() {
    return {
      'tenant': '',
      'logout': '',
      'email': '',
      'userid': '',
      'organization': '',
      'name': ''
    };
  },
  methods: {
    getData() {
      return Object.entries(this.$data)
    }
  }
};

var loader_ = {
  data() {
    return {
      'loader': false,
      'queue': []
    }
  },
  methods: {
    addLoader(item) {
      this.startLoader()
      this.queue.push(item);
    },
    deleteLoader(item) {
      this.queue = this.queue.filter(function (e) { return e !== item });
      if (this.queue.length === 0) {
        this.stopLoader()
      }
    },
    startLoader() {
      this.loader = true;
      document.getElementById('header').classList.add("d-none");
      document.getElementById('open_dvr').classList.add("d-none");
      document.getElementById('loader').classList.remove("d-none");
    },
    stopLoader() {
      this.loader = false;
      document.getElementById('header').classList.remove("d-none");
      document.getElementById('open_dvr').classList.remove("d-none");
      document.getElementById('loader').classList.add("d-none");
    }
  }
};

var search_ = {
  data() {
    return {
      'search': '',
      'list': [],
      'org': [],
      'org_list': [],
      'filtered_list': []
    }
  },
  methods: {
    getList() {
      var input = this.search;
      if (input === '') { this.filtered_list = []; return }

      var search = this.list.filter(function (e) { return e });
      if (this.org.length > 0) {
        var org_list = this.org
        search = search.filter(function (e) { return org_list.indexOf(e.obj_org) !== -1 })
      }
      var get_equipment = search.filter(
        function (e) { return (Object.values(e).join(' ')).search(new RegExp(input, 'gi')) !== -1 }).map(
          function (e) { return { 'obj_code': e.obj_code, 'obj_org': e.obj_org, 'text': e.obj_desc + ' (' + e.obj_udfchar39 + ')' } }).filter(
            function (e, i) { return i < 15 });
      this.filtered_list = get_equipment; return
    },
    process(data) {
      var state = loader;
      var parameters = param;
      var url = login_gas;
      state.addLoader('addchecklist');
      var app_data = this;
      var reqParam = {
        'process': 'add_checklist',
        'tenant': parameters.tenant,
        'email': parameters.email,
        'sessionid': parameters.sessionid,
        'userid': parameters.userid,
        'eqorg': data.obj_org,
        'eq': data.obj_code
      };
      var fetch_data = new Request(updateUrl(url, reqParam), {
        redirect: "follow",
        method: 'POST',
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
      fetch(fetch_data)
        .then(function (response) { return response.json() })
        .then(function (data) {
          if (data.status) {
            console.log(data);
            window.location.reload();
          }
          else {
            console.log(data)
            alert.add({
              text: data.text,
              type: 'error'
            });
            state.stopLoader('search')
          }
        });
    },
    init(state, url, parameters, userdata) {
      state.addLoader('search')
      var app_data = this;
      var reqParam = {
        'process': 'get_equipment_details',
        'tenant': parameters.tenant,
        'email': parameters.email,
        'sessionid': parameters.sessionid,
        'userid': parameters.userid,
        'org': parameters.org,
        'query': ''
      };
      var fetch_data = new Request(updateUrl(url, reqParam), {
        redirect: "follow",
        method: 'POST',
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
      fetch(fetch_data)
        .then(function (response) { return response.json() })
        .then(function (data) {
          if (data.status) {
            app_data.list = data.text;
            app_data.org_list = userdata.org_list;
            app_data.org.push(userdata.org);
            document.getElementById('new_dvr_btn').classList.remove('disabled');
            state.stopLoader('search')
          }
          else {
            console.log(data)
            alert.add({
              text: data.text,
              type: 'error'
            });
            state.stopLoader('search')
          }
        });
    }
  }
};

var open_dvr_ = {
  data() {
    return {
      'list': [],
      'open': false
    }
  },
  methods: {
    getList() {
      var get_list = this.list.map(function (e) {
        return {
          'ock_code': e['ock_code'],
          'text': e['obj_desc'] + ' (' + e['obj_udfchar39'] + ')',
          'date': e['trunc_ock_startdate'],
          'status': e['ock_state']
        }
      });
      return get_list
    },
    init(state, url, parameters) {
      state.addLoader('open_dvr');
      var app_data = this;
      var reqParam = {
        'process': 'get_open_dvr',
        'tenant': parameters.tenant,
        'email': parameters.email,
        'sessionid': parameters.sessionid,
        'userid': parameters.userid
      };
      var fetch_data = new Request(updateUrl(url, reqParam), {
        redirect: "follow",
        method: 'POST',
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
      fetch(fetch_data)
        .then(function (response) { return response.json() })
        .then(function (data) {
          if (data.status) {
            app_data.list = data.text;
            app_data.open = true;
            state.stopLoader('open_dvr')
          }
        });
    }
  }
};