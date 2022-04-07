<template>
  <div class="center-items">
    <div>
      <h3>Product Details</h3>
      <hr />
      <div class="product-details">
        <h3>Name : {{ productToAdd.name }}</h3>
        <h3>Brand : {{ productToAdd.brand }}</h3>
        <h3>Price : {{ productToAdd.price }}</h3>
        <h3>Weight : {{ productToAdd.weight }}</h3>
      </div>
      <div
        v-for="(option, index) in productToAdd.options"
        class="cartoption"
        :key="index"
      >
        <div class="card">
          <span>
            <b>Option {{ index + 1 }}</b>
          </span>
          <div v-if="option['color'] != undefined">
            <span>Color: {{ option.color }}</span>
          </div>
          <div v-if="option['power'] != undefined">
            <span><b>Power</b></span>
            <div
              v-for="(power, indexp) in product.options[index].power"
              :key="indexp"
            >
              <label :for="'id' + option.power + indexp" class="label">
                <input
                  type="radio"
                  :value="power"
                  v-model="productToAdd.options[index].power"
                  :id="'id' + option.power + indexp"
                />
                {{ power }} Watts
              </label>
            </div>
          </div>
          <!-- <div v-if="option['storage'] != undefined">
            <span>Storage</span>
            <input
              type="radio"
              :value="option.storage"
              v-model="productToAdd.storage"
              :id="option.storage + index"
            />
            <label :for="option.storage + index" class="label">{{ option.storage }}</label>
          </div>-->
          <div class="input">
            <span>Quantity</span>
            <br />
            <button
              class="button-count"
              :disabled="productToAdd.options[index].quantity == 0"
              @click="productToAdd.options[index].quantity--"
            >
              -
            </button>
            <input
              class="input-count"
              type="number"
              min="0"
              v-model="productToAdd.options[index].quantity"
            />
            <button
              class="button-count"
              :disabled="
                productToAdd.options[index].quantity ==
                product.options[index].quantity
              "
              @click="productToAdd.options[index].quantity++"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <p class="error">{{ errorMessage }}</p>
      <p>
        <button class="cart-button" @click="addToCart()">Add To Cart</button>
      </p>
    </div>
  </div>
</template>

<script>
import Data from "./data.json";
import emitter from "../services/emitter";
export default {
  data() {
    return {
      product: null,
      data: Data,
      myCarts: [],
      errorMessage: "",
      productToAdd: {
        name: "",
        brand: "",
        price: "",
        color: "",
        options: [],
      },
    };
  },

  mounted() {
    let id = this.$route.params.id;
    let product = this.data.items.find((p) => p.id == id);
    this.product = JSON.parse(JSON.stringify(product));
    this.productToAdd = JSON.parse(JSON.stringify(product));

    this.productToAdd.options.forEach((option, index) => {
      this.productToAdd.options[index].quantity = 0;
    });
  },

  methods: {
    isValid() {
      this.errorMessage = "";
      //If there is atleast one option selected
      if (!this.productToAdd.options.find((o) => o.quantity > 0)) {
        this.errorMessage = "Select at least one product";
        return false;
      }
      for (let i = 0; i < this.productToAdd.options.length; i++) {
        if (
          this.productToAdd.options[i].quantity > 0 &&
          Array.isArray(this.productToAdd.options[i].power)
        ) {
          this.errorMessage = `Select power for option ${i + 1} to proceed`;
          return false;
        }
      }
      return true;
    },
    addToCart() {
      if (this.isValid()) {
        // check for product items is available in shop
        if (JSON.parse(window.localStorage.getItem("mycarts"))) {
          this.myCarts = JSON.parse(window.localStorage.getItem("mycarts"));
          this.myCarts.push(this.productToAdd);
        } else {
          this.myCarts.push(this.productToAdd);
        }
        window.localStorage.setItem("mycarts", JSON.stringify(this.myCarts));
        let total = 0;
        this.myCarts.forEach((product) => {
          product.options.forEach((option) => {
            total += option.quantity;
          });
        });
        // Raise event
        emitter.emit("cartItemUpdated", total);
        alert("Product added to cart");
      }
    },
  },
};
</script>

<style>
.error {
  color: firebrick;
}
.input {
  margin-top: 1em;
  border-spacing: 5px;
}
.label {
  text-transform: capitalize;
}
.card {
  border: 2px solid gray;
  margin-top: 12px;
  width: 20em;
  padding: 0.4em;
  border-radius: 8px;
  align-content: center;
  font-family: arial;
}
.cartoption {
  margin: auto;
}
.center-items {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 500px;
  margin-top: 5px;
  opacity: 0.9;
  text-align: center;
  border: 2px solid black;
  border-radius: 12px;
}
.cart-button {
  padding: 12px 5px 12px 5px;
  width: auto;
  outline: none;
  background-color: #04aa6d;
  color: white;
  border-radius: 5px;
  width: 50%;
  font-size: larger;
  text-transform: uppercase;

  margin: auto;
}
.product-details {
  text-align: left;
}
.input-count {
  padding: 6px;
  width: auto;
  border-radius: 5px;
  width: 75px;
}
.button-count {
  padding: 4px;
  width: auto;
  width: 45px;
  border-radius: 5px;
  background-color: green;
  font-size: medium;
  color: white;
}
</style>