import fs from 'fs';

class ProductManager {
    constructor(filePath) {
        this.path = filePath; //Ruta donde se guardarán los archivos
        this.products = [];//Array para almacenar los productos
        this.productIdCounter = 1;//Contador de ID inicializado en 1
    }

    async initialize() { //Mediante este método se leen los archivos almacenados en el array products utilizando fs.promises
                         // y actualizo el contador de Id con el último Id cargado
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.productIdCounter = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
        } catch (error) {
            console.error("Error al inicializar ProductManager:", error.message);
        }
    }

    async saveToFile() {//Se guardan los productos actuales en formato JSON 
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
        } catch (error) {
            console.error("Error al guardar en archivo:", error.message);
        }
    }

    async addProduct(product) {
        const codeExists = this.products.some((p) => p.code === product.code);
        if (codeExists) {
            throw new Error("El código de producto ya existe");
        } else {
            const productId = this.productIdCounter++;
            product.id = productId;
            this.products.push(product);
            await this.saveToFile();
            console.log("El producto fue agregado");
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        return product ? product : "Not found";
    }

    async updateProduct(id, updatedProduct) {// Este método actualiza un producto existente con un ID especificado.
        const index = this.products.findIndex((p) => p.id === id);// Encuentra el índice del producto en la lista por su ID.
        if (index !== -1) { // Si el producto existe lo actualiza y guarda los cambios.
            this.products[index] = { ...this.products[index], ...updatedProduct };
            await this.saveToFile();// Se guardan los cambios.
            console.log("Producto actualizado correctamente");
        } else {
            throw new Error("Producto no encontrado para actualizar");// Si el producto no existe, nuestra error.
        }
    }

    async deleteProduct(id) {// Este método recibe el Id del producto que quiero eliminar.
        const index = this.products.findIndex((p) => p.id === id);// Se busca el índice que coincida con el id dado.
        if (index !== -1) {//Si el índice existe lo elimina. Un sólo elemento del array en la posición index.
            this.products.splice(index, 1);
            await this.saveToFile(); // Se guardan los cambios.
            console.log("Producto eliminado correctamente");
        } else {
            throw new Error("Producto no encontrado para eliminar");// Si no existe producto con ese Id, muestra error.
        }
    }
}

// Como se usa
const manager = new ProductManager('products.json');//Archivo donde se guardarán los productos

(async () => {
    await manager.initialize();

    // Se llama al método addProduct con los campos especificados
    try {
        await manager.addProduct({
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
        await manager.addProduct({
            title: "producto prueba repetido",
            description: "Este es un producto prueba",
            price: 300,
            thumbnail: "Sin imagen",
            code: "abc123",
            stock: 30
        });
    } catch (error) {
        console.error(error.message);// Muestra el mensaje de error capturado al comparar si el código está repetido
    }

   // Muestra los productos del array
console.log(manager.getProducts());

    try {   
        await manager.updateProduct(1, { price: 250, stock: 20 });// Llamo al id 1 y le paso el nuevo valor de los productos.
    } catch (error) {   
        console.error(error.message);// Si no existe ese Id, captura y muestra mensaje de error.
    }

console.log(manager.getProducts());

    try {   
        await manager.deleteProduct(1); // Paso el Id a eliminar
    } catch (error) {
        console.error(error.message); // Sino existe ese Id, captura y muestra mensaje de error
    }

console.log(manager.getProducts());
 
})();
