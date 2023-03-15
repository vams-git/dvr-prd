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
  data() { return { 'loader': false } },
  methods: {
    startLoader() {
      this.loader = true;
      document.getElementById('header').classList.add("d-none");
      document.getElementById('unfinished').classList.add("d-none");
      document.getElementById('loader').classList.remove("d-none");
    },
    stopLoader() {
      this.loader = false;
      document.getElementById('header').classList.remove("d-none");
      document.getElementById('unfinished').classList.remove("d-none");
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
      console.log(data.obj_org);
      console.log(data.obj_code);
      loader.startLoader()
      setInterval(function(){loader.stopLoader()}, 3000)

    }
  }
};