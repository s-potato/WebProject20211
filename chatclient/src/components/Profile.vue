<template>
  <v-dialog transition="dialog-top-transition" max-width="600">
        <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="blue"
              v-bind="attrs"
              v-on="on"
              icon>
                <v-icon>fas fa-user-circle</v-icon>
            </v-btn>
        </template>
        <template v-slot:default="dialog">
            <v-layout column>
                <v-card>
                    <v-card-text>
                        <v-flex class="mb-4">
                            <v-avatar size="96" class="mr-4">
                                <img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
                            </v-avatar>
                            <v-btn @click="openAvatarPicker">Change Avatar</v-btn>
                            <input
                                ref="inputAvatar"
                                type="file"
                                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                                style="display: none;">
                        </v-flex>
                        <v-text-field
                            v-model="userName"
                            label="User Name"
                            readonly></v-text-field>
                        <v-text-field
                            v-model="displayName"
                            label="Dispay Name"></v-text-field>
                        <v-text-field
                            v-model="email"
                            label="Email Address"
                            readonly></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" :loading="loading" @click.native="update" @click="dialog.value = false">
                            <v-icon left dark>check</v-icon>
                            Save Changes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-layout>
        </template>
    </v-dialog>
</template>

<script>
  export default {
    name: 'profile',

    data () {
        return {
            userName: 'John',
            displayName: 'Doe',
            email: 'john@doe.com',
        }
    },
    methods: {
        openAvatarPicker() {
            this.$refs.inputAvatar.click()
        }
    }
  }
</script>
