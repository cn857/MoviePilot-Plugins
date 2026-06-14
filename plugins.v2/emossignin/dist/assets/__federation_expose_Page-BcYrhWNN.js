import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import _sfc_main$1 from './__federation_expose_AppPage-CDVsSqCJ.js';

const {createElementVNode:_createElementVNode,createVNode:_createVNode,openBlock:_openBlock,createElementBlock:_createElementBlock} = await importShared('vue');


const _sfc_main = {
  __name: 'Page',
  props: {
  api: {
    type: Object,
    default: () => ({}),
  },
  pluginId: {
    type: String,
    default: 'EmosSignIn',
  },
},
  setup(__props) {

return (_ctx, _cache) => {
  return (_openBlock(), _createElementBlock("div", null, [
    _cache[0] || (_cache[0] = _createElementVNode("div", { class: "d-flex align-center pa-3 border-b" }, [
      _createElementVNode("h3", { class: "text-h6 flex-grow-1" }, "Emos 签到助手")
    ], -1)),
    _createVNode(_sfc_main$1, {
      api: __props.api,
      "plugin-id": __props.pluginId,
      "nav-key": "main"
    }, null, 8, ["api", "plugin-id"])
  ]))
}
}

};

export { _sfc_main as default };
