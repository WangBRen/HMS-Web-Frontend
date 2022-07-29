<template>
  <div>
    <a-modal class="modal" v-model="visible" title="健康信息" @ok="handleOk" :width="1000">
      <a-row>
        <a-col :span="5">
          <a-row>
            <a-col>
              <div class="modalLeft">
                <div class="leftBody" v-for="item in arrData" :key="item.id">
                  <a class="leftTitle" href="#">{{ item.name }}</a>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="19">
          <div v-for="item in arrData" :key="item.id">
            <a-row>
              <a-col>{{ item.name }}</a-col>
            </a-row>
            <div>
              <a-row>
                <a-col>
                  <a href="">内容</a>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
export default {
    data () {
        return {
            visible: false,
            arrData: [
            {
              id: '1',
              name: '健康信息',
              items: [
                {
                  id: '1',
                  name: '舒张压'
                },
                {
                  id: '2',
                  name: '舒张压'
                },
                {
                  id: '3',
                  name: '舒张压'
                },
                {
                  id: '4',
                  name: '舒张压'
                },
                {
                  id: '5',
                  name: '舒张压'
                },
                {
                  id: '6',
                  name: '舒张压'
                },
                {
                  id: '7',
                  name: '舒张压'
                },
                {
                  id: '8',
                  name: '舒张压'
                }
              ]
            },
            {
              id: '2',
              name: '!!信息',
              items: [
                {
                  id: '1',
                  name: '舒张压'
                },
                {
                  id: '2',
                  name: '舒张压'
                },
                {
                  id: '3',
                  name: '舒张压'
                },
                {
                  id: '4',
                  name: '舒张压'
                },
                {
                  id: '5',
                  name: '舒张压'
                },
                {
                  id: '6',
                  name: '舒张压'
                },
                {
                  id: '7',
                  name: '舒张压'
                },
                {
                  id: '8',
                  name: '舒张压'
                }
              ]
            },
            {
              id: '3',
              name: '个人信息',
              items: [
                {
                  id: '1',
                  name: '舒张压'
                },
                {
                  id: '2',
                  name: '舒张压'
                },
                {
                  id: '3',
                  name: '舒张压'
                },
                {
                  id: '4',
                  name: '舒张压'
                },
                {
                  id: '5',
                  name: '舒张压'
                },
                {
                  id: '6',
                  name: '舒张压'
                },
                {
                  id: '7',
                  name: '舒张压'
                },
                {
                  id: '8',
                  name: '舒张压'
                }
              ]
            },
            {
              id: '4',
              name: '!!信息',
              items: [
                {
                  id: '1',
                  name: '舒张压'
                },
                {
                  id: '2',
                  name: '舒张压'
                },
                {
                  id: '3',
                  name: '舒张压'
                },
                {
                  id: '4',
                  name: '舒张压'
                },
                {
                  id: '5',
                  name: '舒张压'
                },
                {
                  id: '6',
                  name: '舒张压'
                },
                {
                  id: '7',
                  name: '舒张压'
                },
                {
                  id: '8',
                  name: '舒张压'
                }
              ]
            },
            {
              id: '5',
              name: '!!信息',
              items: []
            },
            {
              id: '6',
              name: '!!信息',
              items: []
            },
            {
              id: '7',
              name: '!!信息',
              items: []
            },
            {
              id: '8',
              name: '!!信息',
              items: []
            },
            {
              id: '9',
              name: '!!信息',
              items: []
            },
            {
              id: '10',
              name: '!!信息',
              items: []
            },
            {
              id: '11',
              name: '!!信息',
              items: []
            },
            {
              id: '12',
              name: '!!信息',
              items: []
            }
          ]
        }
    },
    methods: {
      openModel () {
        this.visible = true
      }
    }
}
</script>

<style>
.modalLeft{
  height: 500px;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  text-align: center;
}
.leftBody{
  border-style: solid;
  border-width: 1px;
  border-color: black;
}
.leftTitle{
  font-size: 20px;
}
</style>
