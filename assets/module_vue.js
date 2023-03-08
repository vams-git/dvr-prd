var alert_ = {
  data() {
    return {
      id:0,
      datas: [],
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
      var index = this.list.findIndex(
        function (e) { return e.id === id });
      var removed = this.list.splice(index, 1)
      console.log(removed)
    }
  },
};