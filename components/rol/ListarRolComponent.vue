<template>
  <v-card
    :loading="loading"
    :disabled="loading"
    elevation="0"
    class="rounded-xxl pa-4 overflow-hidden"
  >
    <v-card-text>
      <v-data-table :headers="headers" :items="roles" sort-by="calories">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="d-flex align-center">
              <v-img src="iso2.png" max-width="45"></v-img>
              Roles
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nuevo rol
                </v-btn>
              </template>

              <!-- Form usuarios -->
              <FormRolComponent @submit="listar()" @cerrar="dialog = false" />
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                color="error"
                @click="eliminar(item)"
                v-bind="attrs"
                v-on="on"
                class="mr-2"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Eliminar rol</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="primary"
                small
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                @click="addPermisos(item)"
              >
                mdi-account-key
              </v-icon>
            </template>
            <span>Agregar permisos</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
    <AlertComponent ref="alertComponent" />
    <v-dialog v-model="dialogoPermisos" persistent max-width="900px">
      <v-card>
        <v-alert
          border="left"
          text
          dense
          color="primary"
          icon="mdi-account-key"
        >
          <small>Gestión del rol</small><strong> - {{ rol }}</strong>
        </v-alert>
        <v-container>
          <v-row>
            <v-col cols="11" sm="11" md="11">
              <v-autocomplete
                clearable
                v-model="permissions"
                dense
                :items="permisos"
                item-text="nombre"
                item-value="nombre"
                small-chips
                deletable-chips
                multiple
                label="Seleccione los permisos para asignar al rol"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="1" sm="1" md="1">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mx-2"
                    small
                    fab
                    dark
                    color="success"
                    v-bind="attrs"
                    v-on="on"
                    @click="asignacionPermisoRol(permissions)"
                  >
                    <v-icon dark> mdi-plus </v-icon>
                  </v-btn>
                </template>
                <span>Asignar permisos</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
        <v-data-table
          v-model="selected"
          :headers="headers2"
          :items="permisosRol"
          item-key="name"
          class="elevation-1"
        >
          <template v-slot:[`item.permission`]="{ item }">
            <span>{{ item }}</span>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  color="error"
                  @click="eliminarPermisoRol(item)"
                  v-bind="attrs"
                  v-on="on"
                  class="mr-2"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>Eliminar rol</span>
            </v-tooltip>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cancelar()" small> Cancelar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import FormRolComponent from "./FormRolComponent.vue";
import AlertComponent from "@/components/helpers/AlertComponent";

export default {
  components: {
    FormRolComponent,
    AlertComponent,
  },

  data: () => ({
    loading: false,
    dialog: false,
    dialogoPermisos: false,
    singleSelect: true,
    headers: [
      {
        text: "Nombre",
        value: "nombre",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    headers2: [
      {
        text: "Permiso",
        value: "permission",
        sortable: false,
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    selected: [],
    permisos: [],
    permissions: [],
    roles: [],
    permisosRol: [],
    rol: "",
    rolId: "",
  }),

  watch: {
    dialog(val) {
      console.log(val);
    },
  },

  created() {
    this.listar();
    this.listarPermisos();
  },

  methods: {
    /**
     * lista los roles
     * @author calvarez
     */
    async listar() {
      try {
        const { data } = await this.$axios.get("rol/listar");
        this.roles = data;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * elimina un rol
     * @author Calvarez
     */
    async eliminar(item) {
      try {
        const confirmacion = await this.$refs.alertComponent.show(
          "Al cambiar el estado podria no ver este registro en algunas listas."
        );
        if (confirmacion) {
          await this.$axios.delete("rol/" + item._id);
        }

        this.listar();
      } catch (error) {
        console.log(error);
        console.log(error.response);
      }
    },

    /**
     * lista los permisos
     * @author calvarez
     */
    async listarPermisos() {
      try {
        const { data } = await this.$axios.get("permiso/listar");
        this.permisos = data;
      } catch (error) {
        console.log(error);
      }
    },

    async addPermisos(item) {
      this.dialogoPermisos = true;
      this.rol = item.nombre;
      this.rolId = item._id;
      this.permisosRol = item.permisos;
      console.log("asd", item);
    },

    /**
     * Asignar permisos a un rol
     * @author calvarez
     */
    async asignacionPermisoRol(permisos) {
      try {
        const response = await this.$axios.post(
          `rol/${this.rolId}/asignar-permisos-rol`,
          {
            permisos: permisos,
          }
        );
        this.listar();
        this.dialogoPermisos = false;
        this.permissions = [];
        console.log("respuesta", response.data.message);
      } catch (error) {
        console.log("Detalles del error:", error);
      }
    },

    cancelar() {
      this.dialogoPermisos = false;
      this.listar();
    },

    async eliminarPermisoRol(permiso) {
      try {
        const confirmacion = await this.$refs.alertComponent.show(
          "Al cambiar el estado podria no ver este registro en algunas listas."
        );
        if (confirmacion) {
          // Corrige la llamada al método DELETE para incluir el permiso en la URL
          await this.$axios.delete(`rol/${this.rolId}/permisos/${permiso}`);
        }
        this.dialogoPermisos = false;
        this.listarPermisos();
        this.listar();
      } catch (error) {
        console.log(error);
        console.log(error.response);
      }
    },
  },
};
</script>
