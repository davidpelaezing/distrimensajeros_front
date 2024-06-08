export const state = () => ({
    facturas: [],
});

export const mutations = {
    AGREGAR_FACTURA(state, factura) {
        state.facturas.push(factura);
    },
};

export const actions = {

};

export const getters = {
    
};
