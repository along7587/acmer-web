<template>
  <div>
  <Table :loading="tableLoading" :height="height" :columns="columns" :data="qualifyingScoreList">
    <template slot-scope="{ index }" slot="rank">
        {{index + 1}}
    </template>
    <template slot-scope="{ row }" slot="title">
        <router-link :to="{name:'Contest',params:{id:row.contestId}}">{{ row.contestTitle }}</router-link>
    </template>
    <template slot-scope="{ row }" slot="score">
        {{ row.score.toFixed(6) }}
    </template>
    <template slot-scope="{ row }" slot="penalty">
        {{ (row.penalty / 60).toFixed(0) }}
    </template>
    <template slot-scope="{ row }" slot="solution">
      <Button v-if="row.solution && row.solution !== ''" type="info" @click="showSolutionModal(row.solution)">查看</Button>
    </template>
  </Table>
  <Modal v-model="edit_modal" width="360">
    <p slot="header" style="text-align:center">
      <span>题解</span>
    </p>
    <Input v-model="editSolution" :readonly="readOnly" type="textarea" rows="20"></Input>
    <div slot="footer">
      <Button v-if="!readOnly" type="success" :loading="edit_loading" @click="handleChangeSolution()">修改</Button>
    </div>
  </Modal>
  </div>
</template>

<script>
export default {
  name: 'QualifyingScoreTable',
  props: {
    qualifyingId: Number
  },
  data () {
    return {
      qualifyingScoreList: [],
      columns: [
        {
          title: '排名',
          slot: 'rank',
          width: 90
        },
        {
          title: '参赛者',
          key: 'students',
          width: 150
        },
        {
          title: '积分',
          slot: 'score',
          width: 120
        },
        {
          title: 'Solved',
          key: 'solvedNumber',
          width: 90
        },
        {
          title: '罚时',
          slot: 'penalty',
          width: 90
        },
        {
          title: '题解',
          slot: 'solution',
          width: 100
        }
      ],
      problemList: [],
      tableLoading: true,
      edit_modal: false,
      readOnly: true,
      editSolution: ''
    }
  },
  methods: {
    getData () {
      let that = this
      that.tableLoading = true
      that.$http
        .get('/api/qualifyingScore/' + that.qualifyingId + '/contest')
        .then(res => {
          if (res.data.status === 0) {
            that.problemList = res.data.data.problemList.split(' ')
            for (let i = 0; i < that.problemList.length; ++i) {
              that.columns.push({
                'title': that.problemList[i],
                'key': that.problemList[i],
                width: 70
              })
            }
          } else {
            that.$Message.error(res.data.msg)
          }
        })
      that.$http
        .get('/api/qualifyingScore/' + that.qualifyingId)
        .then(res => {
          if (res.data.status === 0) {
            that.qualifyingScoreList = res.data.data
            for (let i = 0; i < that.qualifyingScoreList.length; ++i) {
              that.qualifyingScoreList[i].cellClassName = Object()
              if (that.qualifyingScoreList[i].solved) {
                var solvedList = that.qualifyingScoreList[i].solved.split(' ')
                for (let j = 0; j < solvedList.length; ++j) {
                  that.qualifyingScoreList[i].cellClassName[solvedList[j]] = 'table-ac-cell'
                }
              }
              if (that.qualifyingScoreList[i].upSolved) {
                var upSolvedList = that.qualifyingScoreList[i].upSolved.split(' ')
                for (let j = 0; j < upSolvedList.length; ++j) {
                  that.qualifyingScoreList[i].cellClassName[upSolvedList[j]] = 'table-up-cell'
                }
              }
            }
            that.tableLoading = false
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    },
    showSolutionModal (solution) {
      let that = this
      that.editSolution = solution
      that.readOnly = true
      that.edit_modal = true
    }
  },
  created: function () {
    this.getData()
  }
}
</script>

<style>
  .ivu-table .table-ac-cell {
    background-color: #00c853;
  }
  .ivu-table .table-up-cell {
    background-color: #e3e300;
  }
</style>
