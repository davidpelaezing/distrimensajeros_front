<template>
  <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
    <v-card-text>
      <v-data-table :headers="headers" :items="permisos" sort-by="calories">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="d-flex align-center">
              <v-img src="iso2.png" max-width="45"></v-img>
              Permisos
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                  Nuevo permiso
                </v-btn>
              </template>

              <!-- Form usuarios -->
              <FormPermisoComponent @submit="listar()" @cerrar="dialog = false" />
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small color="error" @click="eliminar(item)" v-bind="attrs" v-on="on"> mdi-delete </v-icon>
            </template>
             <span>Eliminar rol</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
    <AlertComponent ref="alertComponent" />
  </v-card>
</template>
<script>
  import FormPermisoComponent from "./FormPermisoComponent.vue";
  import AlertComponent from "@/components/helpers/AlertComponent";

  export default {
    components: {
      FormPermisoComponent,
      AlertComponent,
    },

    data: () => ({
      loading: false,
      dialog: false,
      headers: [{
          text: "Nombre",
          value: "nombre"
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false
        },
      ],
      permisos: [],
    }),

    watch: {
      dialog(val) {
        console.log(val);
      },
    },

    created() {
      this.listar();
    },

    methods: {
      /**
       * lista los permisos
       * @author calvarez
       */
      async listar() {
        try {
          const {
            data
          } = await this.$axios.get("permiso/listar");
          this.permisos = data;
        } catch (error) {
          console.log(error);
        }
      },

      /**
       * elimina un permiso
       * @author calvarez
       */
      async eliminar(item) {
        try {
          const confirmacion = await this.$refs.alertComponent.show(
            "Al cambiar el estado podria no ver este registro en algunas listas."
          );
          if (confirmacion) {
            await this.$axios.delete("permiso/" + item._id);
          }

          this.listar();
        } catch (error) {
          console.log(error);
          console.log(error.response);
        }
      },
    },
  };

</script>
