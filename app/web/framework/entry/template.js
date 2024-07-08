
import Layout from 'component/layout/app';
import plugin from 'framework/plugin';
import {
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Select,
  Option
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

export default function (Vue) {
  Vue.use(plugin);
  Vue.component(Table.name, Table);
  Vue.component(TableColumn.name, TableColumn);
  Vue.use(Dropdown);
  Vue.use(DropdownMenu);
  Vue.use(DropdownItem);
  Vue.component(Select.name, Select);
  Vue.component(Option.name, Option);
  Vue.component(Layout.name, Layout);
}