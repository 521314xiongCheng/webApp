import Vue from 'vue';

import VueRouter from 'vue-router';

import Home from '../view/home/index.vue'

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  // base: '/app',
  routes: [{
      path: '/home',
      component: Home
    },
    {
      path: '/employee',
      name: 'employee',
      component: () => import('../view/home/employee.vue')
    },
    {
      path: '/operation',
      name: 'operation',
      component: () => import('../view/operation/index.vue')
    },
    {
      path: '/reports_search',
      name: 'reportsSearch',
      component: () => import('../view/reports/search.vue')
    },
    {
      path: '/message',
      name: 'message',
      component: () => import('../view/message/index.vue')
    },
    {
      path: '/operation_area',
      name: 'operationArea',
      component: () => import('../view/operation/area/area.vue')
    },
    {
      path: '/operation_area_search',
      name: 'operationAreaSearch',
      component: () => import('../view/operation/area/search.vue')
    },
    {
      path: '/operation_areadiq',
      name: 'operationAreadiq',
      component: () => import('../view/operation/areadiq/areadiq.vue')
    },
    {
      path: '/operation_areadiq_search',
      name: 'operationAreadiqSearch',
      component: () => import('../view/operation/areadiq/search.vue')
    },
    {
      path: '/retail',
      name: 'retail',
      component: () => import('../view/retail/detail.vue')
    },
    {
      path: '/retail_history',
      name: 'retailHistory',
      component: () => import('../view/retail/history.vue')
    },
    {
      path: '/income',
      name: 'income',
      component: () => import('../view/income/income.vue')
    },
    {
      path: '/unit',
      name: 'unit',
      component: () => import('../view/unit/detail.vue')
    },
    {
      path: '/unit_history',
      name: 'unitHistory',
      component: () => import('../view/unit/history.vue')
    },
    {
      path: '/unit_search',
      name: 'unitSearch',
      component: () => import('../view/unit/search.vue')
    },
    {
      path: '/prep_unit',
      name: 'prepUnit',
      component: () => import('../view/prepUnit/index.vue')
    },
    {
      path: '/prep_unit_search',
      name: 'prepUnitSearch',
      component: () => import('../view/prepUnit/search.vue')
    },
    {
      path: '/area',
      name: 'area',
      component: () => import('../view/area/index.vue')
    },
    {
      path: '/area_search',
      name: 'areaSearch',
      component: () => import('../view/area/search.vue')
    },
    {
      path: '/incomeList',
      name: 'incomeList',
      component: () => import('../view/income/incomeList.vue')
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('../view/team/index.vue')
    },
    {
      path: '/team_history',
      name: 'teamHistory',
      component: () => import('../view/team/history.vue')
    },
    {
      path: '/team_search',
      name: 'team',
      component: () => import('../view/team/search.vue')
    },
    {
      path: '/diq',
      name: 'diq',
      component: () => import('../view/diq/index.vue')
    },
    {
      path: '/diq_search',
      name: 'diq',
      component: () => import('../view/diq/search.vue')
    },
    {
      path: '/diq_level30',
      name: 'diqOneself',
      component: () => import('../view/diq/oneself/level30.vue')
    },
    {
      path: '/diq_level50',
      name: 'diqOneself',
      component: () => import('../view/diq/oneself/level50.vue')
    },
    //联系人
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../view/contact/index.vue')
    },
    {
      path: '/contact_search',
      name: 'contactSearch',
      component: () => import('../view/contact/search.vue')
    },
    {
      path: '/calculate',
      name: 'calculate',
      component: () => import('../view/calculate/index.vue')
    },
    //收入预估
    {
      path: '/estimate',
      name: 'estimate',
      component: () => import('../view/estimate/index.vue')
    },
    {
      path: '/processing',
      name: 'processing',
      component: () => import('../view/income/processing.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../view/profile/index.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('../view/profile/setting.vue')
    },
    {
      path: '/nbcActionPlan',
      name: 'nbcActionPlan',
      component: () => import('../view/profile/nbcActionPlan.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../view/reports/index.vue')
    },
    {
      path: '/notice',
      name: 'notice',
      component: () => import('../view/notice/index.vue')
    },
    {
      path: '/chief',
      name: 'chief',
      component: () => import('../view/chief/index.vue')
    },
    {
      path: '/chief_search',
      name: 'chiefSearch',
      component: () => import('../view/chief/search.vue')
    },
    // 一周摘要
    {
      path: '/a_week_note',
      name: 'aWeekNote',
      component: () => import('../view/aWeekNote/index.vue')
    },
    {
      path: '/a_week_note_list',
      name: 'aWeekNoteList',
      component: () => import('../view/aWeekNote/list.vue')
    },
    {
      path: '/a_week_note_myRecognition',
      name: 'aWeekNoteMyRecognition',
      component: () => import('../view/aWeekNote/myRecognition.vue')
    },
    {
      path: '/a_week_note_addNote',
      name: 'aWeekNoteAddNote',
      component: () => import('../view/aWeekNote/addNote.vue')
    },
    //note
    {
      path: '/note',
      name: 'note',
      component: () => import('../view/note/index.vue')
    },
    {
      path: '/addNote',
      name: 'addNote',
      component: () => import('../view/note/addNote.vue')
    },
    {
      path: '/note_search',
      name: 'note',
      component: () => import('../view/note/search.vue')
    },
    {
      path: '/note_table',
      name: 'note',
      component: () => import('../view/note/table.vue')
    },
    {
      path: '/note_table_search',
      name: 'note',
      component: () => import('../view/note/table_search.vue')
    },
    // 收入申报
    {
      path: '/income_declaration',
      name: 'IncomeDeclaration',
      component: () => import('../view/reports/incomeDeclaration/index.vue')
    },
  ]
});

router.beforeEach((route, redirec, next) => {
  next();
});

router.afterEach((route, redirec) => {
  if (EASY_ENV_IS_BROWSER && route.matched && route.matched.length) {
    const matchComponent = route.matched[0].components.default;
    const asyncData = matchComponent.methods && matchComponent.methods.fetchApi;
    if (asyncData) {
      console.log('router afterEach trigger asyncData', route);
      asyncData(router.app.$store, route);
    }
  }
});

export default router;