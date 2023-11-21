const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor(archivo) {
    this.path = path.join(__dirname, archivo);
    this.automaticId = 1;
    this.productos = [];
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.productos = JSON.parse(data);
    } else {
      this.productos = [];
    }
    const maxId = Math.max(...this.productos.map((prod) => prod.id), 0);
    this.automaticId = maxId + 1;
  }

  async addProduct(body) {
    try {
      const title = body.title;
      const description = body.description;
      const price = body.price;
      const thumbnail = Array.isArray(body.thumbnail) ? body.thumbnail : [];
      const code = body.code;
      const stock = body.stock;
      const category = body.category;
      const status = body.status === false ? false : true;

      const existCode = this.productos.find((e) => e.code === code);
      if (existCode) {
        console.log(
          `El código ${code} coincide con el código ya existente de ${existCode.title}, para agregar el producto debera cambiar su code:${code}`,
        );
        return null;
      }

      if (!title || !description || !price || !category || !code || !stock) {
        console.log(
          `Por favor complete todos los campos solicitados de ${title}`,
        );
        return null;
      } else {
        const product = {
          id: this.automaticId++,
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        };
        this.productos.push(product);
        let text = JSON.stringify(this.productos, null, 2);
        fs.writeFileSync(this.path, text, (error) =>
          console.log(`error al escribir addProduct ${error}`),
        );
        console.log(`El producto ${title} fue agregado correctamente`);
        return product;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts(limit) {
    try {
      if (this.productos.length === 0) {
        return null;
      }

      if (limit) {
        const productsListLimit = this.productos.slice(0, limit);
        return productsListLimit;
      }

      return this.productos;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const productExistent = this.productos.find((prod) => prod.id === id);
      if (!productExistent) {
        return null;
      } else {
        return productExistent;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, body) {
    try {
      const fieldToUpdate = body.fieldToUpdate;
      const newValue = body.newValue;
      const product = this.productos.find((prod) => prod.id === id);

      if (!product) {
        console.log('El producto no fue encontrado');
        return;
      }
      if (fieldToUpdate === 'id') {
        console.log('El id no puede ser modificado');
        return;
      }
      if (
        fieldToUpdate === 'code' &&
        this.productos.find((product) => product.code === newValue)
      ) {
        console.log(`El código ${newValue} ya está en uso`);
        return;
      }
      product[fieldToUpdate] = newValue;
      fs.writeFile(
        this.path,
        JSON.stringify(this.productos, null, 2),
        (error) => {
          if (error) {
            console.log('Error al guardar los cambios en el archivo');
          } else {
            console.log('El producto fue actualizado correctamente');
          }
        },
      );
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const index = this.productos.findIndex((prod) => prod.id === id);
      if (index === -1) {
        return `No se encontro ningún elemento con el id ${id}`;
      }
      this.productos.splice(index, 1);
      fs.readFile(this.path, 'utf-8', (error, data) => {
        if (error) {
          console.log('Ocurrió un error al leer el archivo' + error);
        }
        let productsData = JSON.parse(data);
        productsData = this.productos;
        const contenidoActualizado = JSON.stringify(productsData, null, 2);
        fs.writeFile(this.path, contenidoActualizado, (error) => {
          if (error) {
            console.log('Hubo un error al actualizar el archivo');
          }
        });
      });
      return `el producto con el id: ${id} se elimino correctamente`;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductManager;
