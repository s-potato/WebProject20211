<template>
    <v-row>
        <v-col-1>
            <nav>
                <v-navigation-drawer v-model="drawer" dark app mini-variant mini-variant-width="100" class="white">
                    <v-list>
                        <v-list-item class="mb-16">
                            <v-list-item-content>
                                <v-icon class="mb-2" large color="blue">fas fa-dove</v-icon>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-list flat>
                        <v-list-item router to="/">
                            <v-list-item-content>
                                <v-icon class="mb-2" color="grey">
                                    fas fa-file-alt
                                </v-icon>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-list-item-content>
                                <v-icon class="mb-2" color="grey">
                                    fas fa-calendar-day
                                </v-icon>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-list-item-content>
                                <v-icon class="mb-2" color="blue">
                                    fas fa-comment-alt
                                </v-icon>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-badge color="blue" dot overlap>
                                <v-list-item-content>
                                    <v-icon class="mb-2" color="blue">
                                        fas fa-bell
                                    </v-icon>
                                </v-list-item-content>
                            </v-badge>
                        </v-list-item>
                    </v-list>
                    <v-list style="position: absolute; bottom:0" class="ml-5" flat>
                        <v-list-item >
                            <v-list-item-content>
                                <v-menu
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-width="320"
                                    offset-x
                                    >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="grey" clickable v-bind="attrs" v-on="on">fas fa-users</v-icon>
                                    </template>
                                    <v-card>
                                        <h2 class="ml-4">Pending</h2>
                                        <v-divider></v-divider>
                                        <v-list>
                                            <v-list-item>
                                                <v-list-item-avatar>
                                                <img
                                                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                                                    alt="John"
                                                >
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                <v-list-item-title>John Leider</v-list-item-title>
                                                </v-list-item-content>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    @click="menu = false"
                                                    outlined
                                                >
                                                    Cancel
                                                </v-btn>
                                                <v-btn
                                                    class="ml-2"
                                                    outlined
                                                    @click="menu = false"
                                                >
                                                    Save
                                                </v-btn>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-menu>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-list-item-content>
                                <v-icon color="grey">
                                    fas fa-cog
                                </v-icon>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item router to="/">
                            <v-list-item-avatar class="mb-5">
                                <v-badge bordered bottom color="green" dot offset-x="10" offset-y="10">
                                    <v-avatar size="40">
                                        <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
                                    </v-avatar>
                                </v-badge>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
            </nav>
        </v-col-1>
        <v-col>
            <router-view>
                
            </router-view>
        </v-col>
    </v-row>    
</template>
<script>
export default {
    data () {
        return{
            drawer: true,
            showPending: false,
            menu: false,
        }
    },
    methods: {
        
    },
    
}
</script>
