import './index.pcss'
import btn from '~/ui/button'
import { iconGenerate } from '~/ui/icon'

export default {
  template: `
    <div class="l-sidebar w-side">
      <div class="close fx"></div>
      <div class="group-first shift">
      </div>
      <div class="group-second shift">
      </div>
    </div>`,
  props: {
    params:{
      close: {},
      top: {},
      width: {}
    },
    proxies: {
      open: {
        default: false
      },
      start: {
      },
      mini: {}
    },
    methods: {
      close: {}
    }
  },
  handlers:{
    open(v) {
      v ? this.node.root.classList.add('open') : this.node.root.classList.remove('open')
    }
  },
  nodes() {
    return {
      close: {
        component: {
          type: 'induce',
          precept: () => this.param.close || false,
          src: btn,
          params: {
            name: () => 'close',
            icon: () => this.param.close
          },
          methods: {
            action: () => {
              this.proxy.open = false
              this.method.close && this.method.close()
            }
          }
        }
      },
      'l-sidebar': {
        classes: {
          mini: () => this.proxy.mini,
        }
      },
      'group-first': {
        classes: {
          hide: () => !this.proxy.start,
          'shift-next': () => this.proxy.start
        },
      },
      'group-second': {
        classes: {
          hide: () => this.proxy.start,
          'shift-back': () => !this.proxy.start
        }
      }
    }
  },
  mounted() {
    this.param.width && this.node.root.style.setProperty('--sidebar-width', this.param.width)
    this.param.top && this.node.root.style.setProperty('--sidebar-width', this.param.top)
    this.handler.open(this.proxy.open)
  }
}