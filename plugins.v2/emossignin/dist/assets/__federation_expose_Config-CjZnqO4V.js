import { importShared } from './__federation_fn_import-JrT3xvdd.js';

const {createElementVNode:_createElementVNode,createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createVNode:_createVNode,openBlock:_openBlock,createElementBlock:_createElementBlock} = await importShared('vue');


const _hoisted_1 = { class: "pa-4" };
const _hoisted_2 = { class: "mb-4" };
const _hoisted_3 = { class: "mb-4" };
const _hoisted_4 = { class: "mb-4" };
const _hoisted_5 = { class: "mb-6" };
const _hoisted_5b = { class: "mb-4" };
const _hoisted_5c = { class: "mb-4" };
const _hoisted_6 = { class: "d-flex ga-3" };

const {reactive,ref} = await importShared('vue');



const _sfc_main = {
  __name: 'Config',
  props: {
  initialConfig: {
    type: Object,
    default: () => ({}),
  },
  pluginId: {
    type: String,
    default: 'EmosSignIn',
  },
},
  emits: ['save', 'close'],
  setup(__props, { emit: __emit }) {

const props = __props;

const emit = __emit;

const form = reactive({
  enabled: props.initialConfig.enabled ?? false,
  base_url: props.initialConfig.base_url ?? 'https://emos.best',
  token: props.initialConfig.token ?? '',
  cron: props.initialConfig.cron ?? '0 8 * * *',
  sign_content: props.initialConfig.sign_content ?? '',
  notify: props.initialConfig.notify ?? true,
  onlyonce: props.initialConfig.onlyonce ?? false,
  show_sidebar: props.initialConfig.show_sidebar ?? true,
  random_saying: props.initialConfig.random_saying ?? false,
  random_saying_url: props.initialConfig.random_saying_url ?? 'https://uapis.cn',
});

const saving = ref(false);
const error = ref('');
const success = ref('');

function handleSave() {
  saving.value = true;
  error.value = '';
  success.value = '';

  const payload = {
    enabled: form.enabled,
    base_url: form.base_url,
    token: form.token,
    cron: form.cron,
    sign_content: form.sign_content,
    notify: form.notify,
    onlyonce: form.onlyonce,
    show_sidebar: form.show_sidebar,
    random_saying: form.random_saying,
    random_saying_url: form.random_saying_url,
  };

  emit('save', payload);
  saving.value = false;
}

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _cache[15] || (_cache[15] = _createElementVNode("h2", { class: "text-h5 mb-4" }, "Emos 签到助手 - 配置", -1)),
    _createVNode(_component_VAlert, {
      type: "info",
      variant: "tonal",
      class: "mb-4",
      density: "compact"
    }, {
      default: _withCtx(() => [...(_cache[8] || (_cache[8] = [
        _createTextVNode(" 配置 Emos 站点的自动签到。「密钥」从 Emos 主站获取，格式为 xx_xxx。 ", -1)
      ]))]),
      _: 1
    }),
    _createVNode(_component_VCard, { border: true }, {
      default: _withCtx(() => [
        _createVNode(_component_VCardText, null, {
          default: _withCtx(() => [
            _createElementVNode("div", _hoisted_2, [
              _createVNode(_component_VSwitch, {
                modelValue: form.enabled,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((form.enabled) = $event)),
                label: "启用插件",
                color: "primary",
                "hide-details": ""
              }, null, 8, ["modelValue"])
            ]),
            _createVNode(_component_VTextField, {
              modelValue: form.base_url,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((form.base_url) = $event)),
              label: "接口地址",
              placeholder: "https://emos.best",
              variant: "outlined",
              density: "comfortable",
              class: "mb-4",
              "hide-details": "auto",
              "persistent-placeholder": ""
            }, null, 8, ["modelValue"]),
            _createVNode(_component_VTextField, {
              modelValue: form.token,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((form.token) = $event)),
              label: "密钥 (Bearer Token)",
              placeholder: "格式: xx_xxx",
              variant: "outlined",
              density: "comfortable",
              type: "password",
              class: "mb-4",
              "hide-details": "auto",
              "persistent-placeholder": ""
            }, null, 8, ["modelValue"]),
            _createElementVNode("div", _hoisted_3, [
              _cache[10] || (_cache[10] = _createElementVNode("div", { class: "text-subtitle-2 mb-2" }, "签到时间", -1)),
              _createVNode(_component_VTextField, {
                modelValue: form.cron,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((form.cron) = $event)),
                label: "Cron 表达式",
                placeholder: "0 8 * * *",
                variant: "outlined",
                density: "comfortable",
                class: "mb-2",
                "hide-details": "auto",
                "persistent-placeholder": ""
              }, null, 8, ["modelValue"]),
              _createVNode(_component_VAlert, {
                type: "warning",
                variant: "tonal",
                density: "compact",
                class: "text-caption"
              }, {
                default: _withCtx(() => [...(_cache[9] || (_cache[9] = [
                  _createTextVNode(" 请勿将签到时间设置为 0:00（凌晨），否则可能导致账号被限制。 ", -1)
                ]))]),
                _: 1
              })
            ]),
            _createVNode(_component_VTextField, {
              modelValue: form.sign_content,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((form.sign_content) = $event)),
              label: "签到附言（可选）",
              placeholder: "说点什么进行随机签到以获得更多萝卜",
              variant: "outlined",
              density: "comfortable",
              class: "mb-4",
              "hide-details": "auto",
              "persistent-placeholder": ""
            }, null, 8, ["modelValue"]),
            _createElementVNode("div", _hoisted_4, [
              _createVNode(_component_VSwitch, {
                modelValue: form.notify,
                "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((form.notify) = $event)),
                label: "签到通知",
                color: "primary",
                "hide-details": ""
              }, null, 8, ["modelValue"]),
              _cache[11] || (_cache[11] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mt-1" }, " 签到成功或失败时通过系统通知渠道推送消息 ", -1))
            ]),
            _createElementVNode("div", _hoisted_5, [
              _createVNode(_component_VSwitch, {
                modelValue: form.onlyonce,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((form.onlyonce) = $event)),
                label: "立即执行一次",
                color: "warning",
                "hide-details": ""
              }, null, 8, ["modelValue"]),
              _cache[12] || (_cache[12] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mt-1" }, " 保存后将立即执行一次签到（用于测试配置是否正常） ", -1))
            ]),
            _createElementVNode("div", _hoisted_5b, [
              _createVNode(_component_VSwitch, {
                modelValue: form.show_sidebar,
                "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((form.show_sidebar) = $event)),
                label: "启用左侧导航",
                color: "primary",
                "hide-details": ""
              }, null, 8, ["modelValue"]),
              _cache[17] || (_cache[17] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mt-1" }, " 在侧栏显示插件入口 ", -1))
            ]),
            _createElementVNode("div", _hoisted_5c, [
              _createVNode(_component_VTextField, {
                modelValue: form.random_saying_url,
                "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((form.random_saying_url) = $event)),
                label: "一言 API 地址",
                placeholder: "https://uapis.cn",
                variant: "outlined",
                density: "comfortable",
                class: "mb-2",
                "hide-details": "auto",
                "persistent-placeholder": ""
              }, null, 8, ["modelValue"]),
              _createVNode(_component_VSwitch, {
                modelValue: form.random_saying,
                "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((form.random_saying) = $event)),
                label: "启用一言附言",
                color: "primary",
                "hide-details": ""
              }, null, 8, ["modelValue"]),
              _cache[20] || (_cache[20] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mt-1" }, " 从 uapis.cn 获取一言(随机句子)作为签到附言 ", -1))
            ]),
            _createElementVNode("div", _hoisted_6, [
              _createVNode(_component_VBtn, {
                color: "primary",
                loading: saving.value,
                onClick: handleSave
              }, {
                default: _withCtx(() => [...(_cache[13] || (_cache[13] = [
                  _createTextVNode(" 保存配置 ", -1)
                ]))]),
                _: 1
              }, 8, ["loading"]),
              _createVNode(_component_VBtn, {
                variant: "outlined",
                onClick: _cache[7] || (_cache[7] = $event => (emit('close')))
              }, {
                default: _withCtx(() => [...(_cache[14] || (_cache[14] = [
                  _createTextVNode(" 取消 ", -1)
                ]))]),
                _: 1
              })
            ])
          ]),
          _: 1
        })
      ]),
      _: 1
    })
  ]))
}
}

};

export { _sfc_main as default };
