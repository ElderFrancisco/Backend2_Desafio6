const fs = require('fs');
const path = require('path');

class CartManager {
  constructor(archivo) {
    this.path = path.join(__dirname, archivo);
    this.automaticId = 1;
    this.carts = [];
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } else {
      this.carts = [];
    }
    const maxId = Math.max(...this.carts.map((prod) => prod.id), 0);
    this.automaticId = maxId + 1;
  }
  async createNewCart(body) {
    try {
      const products = body.products || [];
      if (!products) {
        console.log('tenes que enviar datos');
        return null;
      }
      const cart = {
        id: this.automaticId++,
        products,
      };
      this.carts.push(cart);
      let text = JSON.stringify(this.carts, null, 2);
      fs.writeFileSync(this.path, text, (error) =>
        console.log(`error al escribir addProduct ${error}`),
      );
      return cart;
    } catch (error) {
      console.log(error);
    }
  }
  async getCartById(id) {
    try {
      const cartExistent = this.carts.find((prod) => prod.id === id);
      if (!cartExistent) {
        console.log('no se encontro');
        return null;
      } else {
        let text = JSON.stringify(cartExistent, null, 2);
        return text;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCarts(limit) {
    try {
      if (this.carts.length === 0) {
        return null;
      }

      if (limit) {
        const productsListLimit = this.carts.slice(0, limit);
        let text = JSON.stringify(productsListLimit, null, 2);
        return text;
      }
      let text = JSON.stringify(this.carts, null, 2);
      return text;
    } catch (error) {
      console.log(error);
    }
  }
  updateCart(cid, pid) {
    try {
      const selectedCartIndex = this.carts.findIndex((cart) => cart.id === cid);
      if (selectedCartIndex === -1) {
        return res
          .status(404)
          .send(`No se encontró ningún carrito con el ID proporcionado.`);
      }
      const selectedCart = this.carts[selectedCartIndex];

      const selectedProduct = selectedCart.products.find(
        (cart) => cart.id === pid,
      );
      if (selectedProduct) {
        selectedProduct.quantity += 1;
      } else {
        selectedCart.products.push({ id: pid, quantity: 1 });
      }

      this.carts[selectedCartIndex] = selectedCart;

      fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), (error) => {
        if (error) {
          console.log('Error al guardar los cambios en el archivo');
        } else {
          console.log('El producto fue actualizado correctamente');
        }
      });
      return selectedCart;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CartManager;
