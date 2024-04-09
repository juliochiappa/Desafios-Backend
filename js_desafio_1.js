class ProductManager { // Declaro la clase ProductManager
    constructor() {
        this.products = []; // Declaro un array vacío
        this.productIdCounter = 1; // Se inicializa el contador de IDs en 1
    }

    addProduct(product) {
        // Recorro el array con el método some y verifico (utilizando la función callback) si el código del
        // producto ya existe en algún producto. Si existe muestro mensaje
        const codeExists = this.products.some((p) => p.code === product.code);
        if (codeExists) {
            console.log("El código de producto ya existe");
        }else {
            // Genero un ID único para el producto y que se incremente en el contador
            const productId = this.productIdCounter++;
            
            // Asigno el ID al producto antes de agregarlo al array de productos
            product.id = productId;
            
            // Agrego el producto al array de productos
            this.products.push(product);
            console.log("El producto fué agregado");
        }

    }

    getProducts() {
        // Retorno el array vacío (hasta este momento)
        return this.products;
    }

    getProductById(id) {
        // En este caso con el método find recorro el array y si el id ingresado es totalmente igual al de un
        // id existente retorna el producto con ese id o "Not Found", mediante el uso de operadores ternarios 
        const product = this.products.find((p) => p.id === id);
        return product ? product : "Not found" 
    }
}

// Como se usa
const manager = new ProductManager();

// Se llama al método addProduct con los campos especificados
try {
    manager.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25
    });
} catch (error) {
    console.error(error.message); 
}

// Se agrega un producto con el mismo código "abc123" y debería fallar.
// Sino es el mismo código se agrega con otro id.
try {
    manager.addProduct({
        title: "producto prueba repetido",
        description: "Este es un producto prueba",
        price: 300,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 30
    });
} catch (error) {
    console.error(error.message); // Muestra el mensaje de error capturado al comparar si el código
                                  // está repetido
}

// Muestra los productos del array
console.log(manager.getProducts());

try {
    await manager.updateProduct(1, { price: 250, stock: 20 });
} catch (error) {
    console.error(error.message);
}

console.log(manager.getProducts());

try {
    await manager.deleteProduct(1);
} catch (error) {
    console.error(error.message);
}

console.log(manager.getProducts());

