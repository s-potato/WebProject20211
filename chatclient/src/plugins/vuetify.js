import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    icon: {
        iconfont: 'md' || 'fa'
    },
    theme: {
        theme: {
            dark: {
                background: colors.grey.lighten3
            },
            light: {
                background: colors.shades.white
            }
        }
    }
});