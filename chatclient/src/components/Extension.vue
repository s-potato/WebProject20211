<template>
  <div class="extension" v-if="isDirect == false">
    <v-card class="text-center mt-8 mb-3" shaped>
      <v-badge bordered bottom color="green" dot offset-x="11" offset-y="13">
        <v-avatar class="mt-n7" size="60" elevation="10">
          <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
        </v-avatar>
      </v-badge>
      <v-card-title class="layout justify-center">{{
        this.nameChoose
      }}</v-card-title>
      <v-card-subtitle class="layout justify-center"
        >Hello this is {{ this.nameChoose }} room</v-card-subtitle
      >
    </v-card>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Member</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content style="overflow: auto; height:121px;"> 
          <v-list
            color="rgba(0,0,0,0)"
          >
            <v-list-item-group>
              <template v-for="(item, index) in members">
                <v-list-item
                  :key="index"
                >
                  <v-badge
                    bordered
                    bottom
                    color="green"
                    dot
                    offset-x="22"
                    offset-y="26"
                  >
                    <v-list-item-avatar>
                      <v-img
                        :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"
                      ></v-img>
                    </v-list-item-avatar>
                  </v-badge>
                  <template>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.username"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider
                  v-if="index < members.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Theme</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Files(3)</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list shaped>
            <v-list-item-group>
              <v-list-item v-for="(item, i) in files" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="item.icon" color="green"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Pinned Message</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> {{this.pinList}}</v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <div class="extension" v-else>
    <v-card class="text-center mt-8 mb-3" shaped>
      <v-badge bordered bottom color="green" dot offset-x="11" offset-y="13">
        <v-avatar class="mt-n7" size="60" elevation="10">
          <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
        </v-avatar>
      </v-badge>
      <v-card-title class="layout justify-center">{{
        this.nameChoose
      }}</v-card-title>
      <v-card-subtitle class="layout justify-center"
        >You chatting with {{ this.nameChoose }}</v-card-subtitle
      >
    </v-card>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Nickname</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> 
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Theme</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Files(3)</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list shaped>
            <v-list-item-group>
              <v-list-item v-for="(item, i) in files" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="item.icon" color="green"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>Block</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content> </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  name: "extension",
  props:{
      nameChoose:{
          type: String,
          default : 'default'
      },
      members:{
        type: Array,
        required: true
      },
      isDirect: Boolean,
      pinList:{
        type: Array,
        required: true
      },
  },
  data() {
    return {
      panel: [2],
      files: [
        { text: "Landing_page.zip", icon: " mdi-cloud-upload" },
        { text: "Requirements.pdf", icon: " mdi-cloud-upload" },
        { text: "Uwagi.docx", icon: " mdi-cloud-upload" },
      ],
    };
  },
  methods: {
  },
};
</script>

<style></style>
