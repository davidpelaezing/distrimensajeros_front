export default (context, inject) => {
    const formatPesos = (value, decimals = 0, useSymbol = true) => {
        if (value === null || value === undefined || value === '') return ''
        const num = Number(value)
        if (isNaN(num)) return value

        const opts = {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            style: 'currency',
            currency: 'COP',
            currencyDisplay: 'symbol'
        }

        let formatted = num.toLocaleString('es-CO', opts)
        if (useSymbol) {
            // Normalizar: asegurar que muestre "$" y no "COP"
            formatted = formatted.replace(/^COP\s?/, '$ ')
        }
        return formatted
    }

    // lo inyectamos en la app (this.$formatPesos / context.$formatPesos)
    inject('formatPesos', formatPesos)
}
