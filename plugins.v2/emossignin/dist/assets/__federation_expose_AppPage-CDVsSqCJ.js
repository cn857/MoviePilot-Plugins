import { importShared } from './__federation_fn_import-JrT3xvdd.js';

/**
 * 从 MoviePilot API 包装器中提取实际响应数据。
 * 兼容 {success, data} 包装形态和原始响应两种格式。
 */
function unwrapResponse(response) {
  if (response && Object.prototype.hasOwnProperty.call(response, 'data') && response.success !== undefined) {
    return response.data
  }
  return response?.data ?? response
}

/**
 * 将 ISO 日期字符串格式化为中文显示。
 * 例如 "2026-06-14" → "6月14日"
 */
function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr
    return `${d.getMonth() + 1}月${d.getDate()}日`
  } catch {
    return dateStr
  }
}

/**
 * 格式化萝卜数字，添加千分位分隔符。
 */
function formatCarrots(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num.toLocaleString() : '0'
}

/**
 * 将字节数格式化为可读的存储大小字符串。
 */
function formatBytes(bytes) {
  if (!bytes || Number(bytes) === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let val = Number(bytes);
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(2)} ${units[i]}`
}

/**
 * 格式化时间戳为可读的日期时间字符串。
 */
function formatDateTime(ts) {
  if (!ts) return ''
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  } catch {
    return ts
  }
}

const {openBlock:_openBlock$2,createElementBlock:_createElementBlock$1,createCommentVNode:_createCommentVNode$2,toDisplayString:_toDisplayString$1,createTextVNode:_createTextVNode$1,resolveComponent:_resolveComponent$1,withCtx:_withCtx$1,createBlock:_createBlock$2,createVNode:_createVNode$1,createElementVNode:_createElementVNode$1,unref:_unref$1} = await importShared('vue');


const _hoisted_1$1 = { class: "pa-4" };
const _hoisted_2$1 = {
  key: 0,
  class: "text-h5 mb-4"
};
const _hoisted_3$1 = { class: "text-body-2 text-medium-emphasis mb-3" };
const _hoisted_4$1 = {
  key: 0,
  class: "text-caption text-medium-emphasis ml-3"
};
const _hoisted_5$1 = {
  key: 1,
  class: "text-caption text-medium-emphasis ml-3"
};
const _hoisted_6$1 = { class: "text-h5 font-weight-bold text-primary" };
const _hoisted_7$1 = { class: "text-h5 font-weight-bold text-secondary" };
const _hoisted_8$1 = { class: "text-body-1 text-medium-emphasis" };
const _hoisted_9$1 = { class: "text-body-1" };
const _hoisted_10$1 = { class: "text-body-1" };
const _hoisted_11$1 = { class: "text-body-1" };
const _hoisted_12 = { class: "text-body-2" };
const _hoisted_13 = { class: "text-body-2" };

const {computed: computed$2} = await importShared('vue');


const _sfc_main$2 = {
  __name: 'StatusPage',
  props: {
  statusData: {
    type: Object,
    default: () => ({
      enabled: false,
      token_configured: false,
      signed_today: false,
      sign_status: null,
      stats: {},
      config: {},
      user_info: null,
    }),
  },
  loading: { type: Boolean, default: false },
  signing: { type: Boolean, default: false },
  error: { type: String, default: '' },
  success: { type: String, default: '' },
  hideTitle: { type: Boolean, default: false },
},
  emits: ['refresh', 'sign-in'],
  setup(__props, { emit: __emit }) {

const props = __props;

const emit = __emit;

const stats = computed$2(() => props.statusData.stats || {});
const config = computed$2(() => props.statusData.config || {});
const userInfo = computed$2(() => props.statusData.user_info || null);
const signedToday = computed$2(() => props.statusData.signed_today);
const tokenConfigured = computed$2(() => props.statusData.token_configured);
const signStatus = computed$2(() => props.statusData.sign_status);
computed$2(() => props.statusData.enabled);

const statusText = computed$2(() => {
  if (!tokenConfigured) return '未配置密钥'
  if (signedToday.value) return '今日已签到'
  return '今日未签到'
});

const statusColor = computed$2(() => {
  if (!tokenConfigured) return 'grey'
  if (signedToday.value) return 'success'
  return 'warning'
});

const canSign = computed$2(() => {
  return tokenConfigured && !signedToday.value && !props.signing && !props.loading
});

const lastSigninDisplay = computed$2(() => {
  if (!props.statusData.signed_today) {
    const lastDate = stats.value.last_signin_date;
    return lastDate ? `上次签到: ${formatDate(lastDate)}` : '暂无签到记录'
  }
  const signInfo = signStatus.value;
  if (signInfo && typeof signInfo === 'object') {
    const ts = signInfo.created_at || signInfo.date;
    if (ts) {
      return `签到时间: ${formatDate(ts)}`
    }
  }
  return '今日已签到'
});

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$1("VAlert");
  const _component_VCardTitle = _resolveComponent$1("VCardTitle");
  const _component_VChip = _resolveComponent$1("VChip");
  const _component_VCardSubtitle = _resolveComponent$1("VCardSubtitle");
  const _component_VCardItem = _resolveComponent$1("VCardItem");
  const _component_VBtn = _resolveComponent$1("VBtn");
  const _component_VCardText = _resolveComponent$1("VCardText");
  const _component_VCard = _resolveComponent$1("VCard");
  const _component_VCol = _resolveComponent$1("VCol");
  const _component_VRow = _resolveComponent$1("VRow");

  return (_openBlock$2(), _createElementBlock$1("div", _hoisted_1$1, [
    (!__props.hideTitle)
      ? (_openBlock$2(), _createElementBlock$1("h2", _hoisted_2$1, "Emos 签到助手"))
      : _createCommentVNode$2("", true),
    (__props.error)
      ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
          key: 1,
          type: "error",
          variant: "tonal",
          class: "mb-3",
          closable: "",
          "onUpdate:modelValue": () => {}
        }, {
          default: _withCtx$1(() => [
            _createTextVNode$1(_toDisplayString$1(__props.error), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$2("", true),
    (__props.success)
      ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
          key: 2,
          type: "success",
          variant: "tonal",
          class: "mb-3",
          closable: "",
          density: "compact"
        }, {
          default: _withCtx$1(() => [
            _createTextVNode$1(_toDisplayString$1(__props.success), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$2("", true),
    _createVNode$1(_component_VCard, {
      class: "mb-4",
      border: true
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCardItem, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardTitle, null, {
              default: _withCtx$1(() => [...(_cache[1] || (_cache[1] = [
                _createTextVNode$1("签到状态", -1)
              ]))]),
              _: 1
            }),
            _createVNode$1(_component_VCardSubtitle, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VChip, {
                  color: statusColor.value,
                  size: "small",
                  variant: "flat",
                  class: "mt-1"
                }, {
                  default: _withCtx$1(() => [
                    _createTextVNode$1(_toDisplayString$1(statusText.value), 1)
                  ]),
                  _: 1
                }, 8, ["color"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$1(_component_VCardText, null, {
          default: _withCtx$1(() => [
            _createElementVNode$1("div", _hoisted_3$1, _toDisplayString$1(lastSigninDisplay.value), 1),
            _createVNode$1(_component_VBtn, {
              color: "primary",
              variant: "tonal",
              disabled: !canSign.value,
              loading: __props.signing,
              "prepend-icon": "mdi-calendar-check",
              onClick: _cache[0] || (_cache[0] = $event => (emit('sign-in')))
            }, {
              default: _withCtx$1(() => [
                _createTextVNode$1(_toDisplayString$1(__props.signing ? '签到中...' : '立即签到'), 1)
              ]),
              _: 1
            }, 8, ["disabled", "loading"]),
            (!tokenConfigured.value)
              ? (_openBlock$2(), _createElementBlock$1("span", _hoisted_4$1, " 请先在插件设置中配置密钥 "))
              : (signedToday.value)
                ? (_openBlock$2(), _createElementBlock$1("span", _hoisted_5$1, " 今日已签到，明天再来吧 "))
                : _createCommentVNode$2("", true)
          ]),
          _: 1
        })
      ]),
      _: 1
    }),
    _createVNode$1(_component_VCard, {
      class: "mb-4",
      border: true
    }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCardItem, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardTitle, null, {
              default: _withCtx$1(() => [...(_cache[2] || (_cache[2] = [
                _createTextVNode$1("萝卜统计", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$1(_component_VCardText, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VRow, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCol, {
                  cols: "6",
                  sm: "4"
                }, {
                  default: _withCtx$1(() => [
                    _createElementVNode$1("div", _hoisted_6$1, _toDisplayString$1(_unref$1(formatCarrots)(stats.value.total_carrots)), 1),
                    _cache[3] || (_cache[3] = _createElementVNode$1("div", { class: "text-body-2 text-medium-emphasis" }, "累计萝卜", -1))
                  ]),
                  _: 1
                }),
                _createVNode$1(_component_VCol, {
                  cols: "6",
                  sm: "4"
                }, {
                  default: _withCtx$1(() => [
                    _createElementVNode$1("div", _hoisted_7$1, _toDisplayString$1(stats.value.total_signins || 0), 1),
                    _cache[4] || (_cache[4] = _createElementVNode$1("div", { class: "text-body-2 text-medium-emphasis" }, "签到次数", -1))
                  ]),
                  _: 1
                }),
                _createVNode$1(_component_VCol, {
                  cols: "12",
                  sm: "4"
                }, {
                  default: _withCtx$1(() => [
                    _createElementVNode$1("div", _hoisted_8$1, _toDisplayString$1(signedToday.value ? '✅ 今日已签' : '⏳ 等待签到'), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }),
    (userInfo.value)
      ? (_openBlock$2(), _createBlock$2(_component_VCard, {
          key: 3,
          class: "mb-4",
          border: true
        }, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardItem, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardTitle, null, {
                  default: _withCtx$1(() => [...(_cache[5] || (_cache[5] = [
                    _createTextVNode$1("用户信息", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$1(_component_VCardText, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VRow, null, {
                  default: _withCtx$1(() => [
                    (userInfo.value.pseudonym)
                      ? (_openBlock$2(), _createBlock$2(_component_VCol, {
                          key: 0,
                          cols: "6",
                          sm: "4"
                        }, {
                          default: _withCtx$1(() => [
                            _cache[6] || (_cache[6] = _createElementVNode$1("div", { class: "text-subtitle-2 text-medium-emphasis" }, "笔名", -1)),
                            _createElementVNode$1("div", _hoisted_9$1, _toDisplayString$1(userInfo.value.pseudonym), 1)
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$2("", true),
                    (userInfo.value.size_upload != null)
                      ? (_openBlock$2(), _createBlock$2(_component_VCol, {
                          key: 1,
                          cols: "6",
                          sm: "4"
                        }, {
                          default: _withCtx$1(() => [
                            _cache[7] || (_cache[7] = _createElementVNode$1("div", { class: "text-subtitle-2 text-medium-emphasis" }, "上传量", -1)),
                            _createElementVNode$1("div", _hoisted_10$1, _toDisplayString$1(_unref$1(formatBytes)(userInfo.value.size_upload)), 1)
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$2("", true),
                    (userInfo.value.invite_remaining != null)
                      ? (_openBlock$2(), _createBlock$2(_component_VCol, {
                          key: 2,
                          cols: "6",
                          sm: "4"
                        }, {
                          default: _withCtx$1(() => [
                            _cache[8] || (_cache[8] = _createElementVNode$1("div", { class: "text-subtitle-2 text-medium-emphasis" }, "可邀请人数", -1)),
                            _createElementVNode$1("div", _hoisted_11$1, _toDisplayString$1(userInfo.value.invite_remaining), 1)
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$2("", true)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode$2("", true),
    _createVNode$1(_component_VCard, { border: true }, {
      default: _withCtx$1(() => [
        _createVNode$1(_component_VCardItem, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VCardTitle, null, {
              default: _withCtx$1(() => [...(_cache[9] || (_cache[9] = [
                _createTextVNode$1("当前配置", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createVNode$1(_component_VCardText, null, {
          default: _withCtx$1(() => [
            _createVNode$1(_component_VRow, null, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCol, {
                  cols: "12",
                  sm: "6"
                }, {
                  default: _withCtx$1(() => [
                    _cache[10] || (_cache[10] = _createElementVNode$1("div", { class: "text-subtitle-2 text-medium-emphasis" }, "接口地址", -1)),
                    _createElementVNode$1("div", _hoisted_12, _toDisplayString$1(config.value.base_url || '未配置'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$1(_component_VCol, {
                  cols: "6",
                  sm: "3"
                }, {
                  default: _withCtx$1(() => [
                    _cache[11] || (_cache[11] = _createElementVNode$1("div", { class: "text-subtitle-2 text-medium-emphasis" }, "定时任务", -1)),
                    _createElementVNode$1("div", _hoisted_13, _toDisplayString$1(config.value.cron || '未配置'), 1)
                  ]),
                  _: 1
                }),
                _createVNode$1(_component_VCol, {
                  cols: "6",
                  sm: "3"
                }, {
                  default: _withCtx$1(() => [
                    _cache[12] || (_cache[12] = _createElementVNode$1("div", { class: "text-subtitle-2 text-medium-emphasis" }, "通知", -1)),
                    _createVNode$1(_component_VChip, {
                      color: config.value.notify ? 'success' : 'grey',
                      size: "x-small",
                      variant: "flat"
                    }, {
                      default: _withCtx$1(() => [
                        _createTextVNode$1(_toDisplayString$1(config.value.notify ? '已开启' : '未开启'), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ]),
                  _: 1
                }),
                _createVNode$1(_component_VCol, {
                  cols: "12",
                  sm: "6"
                }, {
                  default: _withCtx$1(() => [
                    _cache[13] || (_cache[13] = _createElementVNode$1("div", { class: "text-subtitle-2 text-medium-emphasis" }, "签到附言", -1)),
                    _createElementVNode$1("div", _hoisted_13, _toDisplayString$1(config.value.sign_content || '（未设置，留空则默认签到）'), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
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

const {openBlock:_openBlock$1,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode$1,toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,resolveComponent:_resolveComponent,withCtx:_withCtx,createBlock:_createBlock$1,unref:_unref,createElementVNode:_createElementVNode,createVNode:_createVNode,renderList:_renderList,Fragment:_Fragment,normalizeClass:_normalizeClass} = await importShared('vue');


const _hoisted_1 = { class: "pa-4" };
const _hoisted_2 = {
  key: 0,
  class: "text-h5 mb-4"
};
const _hoisted_3 = { class: "text-body-2 text-medium-emphasis" };
const _hoisted_4 = { key: 2 };
const _hoisted_5 = { class: "d-sm-none" };
const _hoisted_6 = { class: "d-flex justify-space-between align-center mb-2" };
const _hoisted_7 = { class: "text-caption text-medium-emphasis" };
const _hoisted_8 = {
  key: 0,
  class: "text-body-2 mt-2"
};
const _hoisted_9 = { class: "text-primary font-weight-medium" };
const _hoisted_10 = {
  key: 0,
  class: "text-body-2"
};
const _hoisted_11 = {
  key: 1,
  class: "text-medium-emphasis text-caption"
};

const {computed: computed$1,onMounted: onMounted$1,ref: ref$1} = await importShared('vue');


const _sfc_main$1 = {
  __name: 'HistoryPage',
  props: {
  api: {
    type: Object,
    default: () => ({}),
  },
  pluginId: {
    type: String,
    default: 'EmosSignIn',
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
},
  setup(__props, { expose: __expose }) {

const props = __props;

const loading = ref$1(false);
const error = ref$1('');
const history = ref$1([]);
const total = ref$1(0);

const pluginBase = computed$1(() => `plugin/${props.pluginId || 'EmosSignIn'}`);

const columns = [
  { key: 'date', title: '日期', width: '120px' },
  { key: 'carrot_earned', title: '获得萝卜', width: '100px', align: 'end' },
  { key: 'content', title: '签到附言' },
  { key: 'timestamp', title: '签到时间', width: '180px' },
];

async function loadHistory() {
  loading.value = true;
  error.value = '';
  try {
    const response = await props.api.get(`${pluginBase.value}/history`);
    const data = unwrapResponse(response) || {};
    history.value = data.history || [];
    total.value = data.total || history.value.length;
  } catch (err) {
    error.value = err?.message || '加载历史失败';
  } finally {
    loading.value = false;
  }
}

__expose({ loadHistory });

onMounted$1(loadHistory);

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VProgressCircular = _resolveComponent("VProgressCircular");
  const _component_VChip = _resolveComponent("VChip");
  const _component_VDataTable = _resolveComponent("VDataTable");

  return (_openBlock$1(), _createElementBlock("div", _hoisted_1, [
    (!__props.hideTitle)
      ? (_openBlock$1(), _createElementBlock("h2", _hoisted_2, "签到历史"))
      : _createCommentVNode$1("", true),
    (error.value)
      ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
          key: 1,
          type: "error",
          variant: "tonal",
          class: "mb-3",
          closable: ""
        }, {
          default: _withCtx(() => [
            _createTextVNode(_toDisplayString(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$1("", true),
    (history.value.length > 0)
      ? (_openBlock$1(), _createBlock$1(_component_VCard, {
          key: 2,
          class: "mb-4",
          border: true,
          color: "surface"
        }, {
          default: _withCtx(() => [
            _createVNode(_component_VCardText, null, {
              default: _withCtx(() => [
                _createElementVNode("span", _hoisted_3, [
                  _createTextVNode(" 共 " + _toDisplayString(total.value) + " 条签到记录，累计获得 ", 1),
                  _createElementVNode("strong", null, _toDisplayString(_unref(formatCarrots)(history.value.reduce((sum, r) => sum + Number(r.carrot_earned || 0), 0))), 1),
                  _cache[0] || (_cache[0] = _createTextVNode(" 萝卜 ", -1))
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode$1("", true),
    _createVNode(_component_VCard, { border: true }, {
      default: _withCtx(() => [
        (loading.value)
          ? (_openBlock$1(), _createBlock$1(_component_VCardText, {
              key: 0,
              class: "text-center pa-6"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VProgressCircular, {
                  indeterminate: "",
                  color: "primary"
                }),
                _cache[1] || (_cache[1] = _createElementVNode("div", { class: "text-body-2 text-medium-emphasis mt-2" }, "加载中...", -1))
              ]),
              _: 1
            }))
          : (history.value.length === 0)
            ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
                key: 1,
                type: "info",
                variant: "tonal",
                class: "ma-4"
              }, {
                default: _withCtx(() => [...(_cache[2] || (_cache[2] = [
                  _createTextVNode(" 暂无签到记录，快去签到吧！ ", -1)
                ]))]),
                _: 1
              }))
            : (_openBlock$1(), _createElementBlock("div", _hoisted_4, [
                _createElementVNode("div", _hoisted_5, [
                  (_openBlock$1(true), _createElementBlock(_Fragment, null, _renderList(history.value, (record, index) => {
                    return (_openBlock$1(), _createBlock$1(_component_VCard, {
                      key: index,
                      variant: "flat",
                      class: _normalizeClass(["border-b-sm px-4 py-3", { 'border-b': index < history.value.length - 1 }])
                    }, {
                      default: _withCtx(() => [
                        _createElementVNode("div", _hoisted_6, [
                          _createElementVNode("strong", null, _toDisplayString(_unref(formatDate)(record.date)), 1),
                          _createVNode(_component_VChip, {
                            color: "primary",
                            size: "small",
                            variant: "flat"
                          }, {
                            default: _withCtx(() => [
                              _createTextVNode(" +" + _toDisplayString(_unref(formatCarrots)(record.carrot_earned)) + " 🥕 ", 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _createElementVNode("div", _hoisted_7, _toDisplayString(record.timestamp || ''), 1),
                        (record.content)
                          ? (_openBlock$1(), _createElementBlock("div", _hoisted_8, " \"" + _toDisplayString(record.content) + "\" ", 1))
                          : _createCommentVNode$1("", true)
                      ]),
                      _: 2
                    }, 1032, ["class"]))
                  }), 128))
                ]),
                _createVNode(_component_VDataTable, {
                  class: "d-none d-sm-block",
                  headers: columns,
                  items: history.value,
                  "items-per-page": 20,
                  "items-per-page-options": [10, 20, 50],
                  hover: ""
                }, {
                  "item.date": _withCtx(({ item }) => [
                    _createTextVNode(_toDisplayString(_unref(formatDate)(item.date)), 1)
                  ]),
                  "item.carrot_earned": _withCtx(({ item }) => [
                    _createElementVNode("span", _hoisted_9, " +" + _toDisplayString(_unref(formatCarrots)(item.carrot_earned)), 1)
                  ]),
                  "item.content": _withCtx(({ item }) => [
                    (item.content)
                      ? (_openBlock$1(), _createElementBlock("span", _hoisted_10, "\"" + _toDisplayString(item.content) + "\"", 1))
                      : (_openBlock$1(), _createElementBlock("span", _hoisted_11, "-"))
                  ]),
                  "item.timestamp": _withCtx(({ item }) => [
                    _createTextVNode(_toDisplayString(_unref(formatDateTime)(item.timestamp)), 1)
                  ]),
                  _: 1
                }, 8, ["items"])
              ]))
      ]),
      _: 1
    })
  ]))
}
}

};

const {openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode} = await importShared('vue');


const {computed,onMounted,ref} = await importShared('vue');


const _sfc_main = {
  __name: 'AppPage',
  props: {
  api: {
    type: Object,
    default: () => ({}),
  },
  pluginId: {
    type: String,
    default: 'EmosSignIn',
  },
  navKey: {
    type: String,
    default: 'main',
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
},
  setup(__props, { expose: __expose }) {

const props = __props;

const loading = ref(false);
const signing = ref(false);
const error = ref('');
const success = ref('');

const statusData = ref({
  enabled: false,
  token_configured: false,
  signed_today: false,
  sign_status: null,
  stats: {
    total_signins: 0,
    total_carrots: 0,
    last_signin_date: null,
  },
  config: {
    base_url: '',
    cron: '',
    sign_content: '',
    notify: false,
  },
  user_info: null,
});

const pluginBase = computed(() => `plugin/${props.pluginId || 'EmosSignIn'}`);
const currentPage = computed(() => (props.navKey === 'history' ? 'history' : 'main'));

async function loadStatus() {
  loading.value = true;
  error.value = '';
  try {
    const response = await props.api.get(`${pluginBase.value}/status`);
    statusData.value = unwrapResponse(response) || statusData.value;
  } catch (err) {
    error.value = err?.message || '加载状态失败';
  } finally {
    loading.value = false;
  }
}

async function triggerSignIn() {
  signing.value = true;
  error.value = '';
  success.value = '';
  try {
    const response = await props.api.post(`${pluginBase.value}/sign`);
    statusData.value = unwrapResponse(response) || statusData.value;
    if (statusData.value.signed_today) {
      success.value = '签到成功！';
    }
  } catch (err) {
    error.value = err?.message || '签到请求失败';
  } finally {
    signing.value = false;
  }
}

__expose({
  loadStatus,
  triggerSignIn,
  loading,
  signing,
});

onMounted(loadStatus);

return (_ctx, _cache) => {
  return (currentPage.value === 'main')
    ? (_openBlock(), _createBlock(_sfc_main$2, {
        key: 0,
        "status-data": statusData.value,
        loading: loading.value,
        signing: signing.value,
        error: error.value,
        success: success.value,
        "hide-title": __props.hideTitle,
        onRefresh: loadStatus,
        onSignIn: triggerSignIn
      }, null, 8, ["status-data", "loading", "signing", "error", "success", "hide-title"]))
    : (_openBlock(), _createBlock(_sfc_main$1, {
        key: 1,
        api: __props.api,
        "plugin-id": __props.pluginId,
        "hide-title": __props.hideTitle
      }, null, 8, ["api", "plugin-id", "hide-title"]))
}
}

};

export { _sfc_main as default };
