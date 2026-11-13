export default (context, inject) => {
    const items = [
        {
            text: "Facturas",
            icon: "mdi-note-multiple",
            link: "/",
            roles: ["administrador", "supervisor", "operario"],
        },
        {
            text: "Clientes",
            icon: "mdi-account-multiple-check",
            link: "/clientes",
            roles: ["administrador", "supervisor", "operario"],
        },
        {
            text: "Mensajeros",
            icon: "mdi-motorbike",
            link: "/mensajeros",
            roles: ["administrador", "supervisor"],
        },
        {
            text: "Formas de pago",
            icon: "mdi-credit-card-multiple-outline",
            link: "/forma-pagos",
            roles: ["administrador", "supervisor"],
        },
        {
            text: "Reportes",
            icon: "mdi-file-chart",
            link: "/reportes",
            roles: ["administrador", "supervisor"],
        },
        {
            text: "Usuarios",
            icon: "mdi-account-multiple",
            link: "/usuarios",
            roles: ["administrador"],
        },
    ];

    inject("menu", items);
};
