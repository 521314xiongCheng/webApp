import Vue from 'vue';
import createLayout from '../layout';


const tpl = '<div id="app" data-server-rendered="true"><slot></slot></div>';
export default createLayout('AppLayout', {}, tpl);