<template>
  <div class="home">
    <div v-if="mycarts.length > 0">
      <h2 class="carthead">Total Amount : {{ total }} SEK</h2>
    </div>
    <div v-if="mycarts.length > 0" class="checkout">
      <button class="clear-items-in-cart-button" @click="clearItemsInCart">
        Clear Cart
      </button>
      <button class="checkout-button">CheckOut</button>
    </div>
    <div v-if="mycarts.length > 0" class>
      <hr />
      <div
        v-for="(val, productIndex) in mycarts"
        :key="productIndex"
        class="card"
      >
        <h1>{{ val.name }}</h1>
        <p class="price">{{ val.price }} SEK</p>
        <p class="price">{{ val.color }}</p>
        <div
          v-for="(option, optionIndex) in val.options"
          class="price"
          :key="optionIndex"
        >
          <div v-if="option.quantity > 0" class="card-options">
            <div v-for="key in Object.keys(option)" :key="key">
              <div v-if="key == 'quantity'" class="quantity-control">
                <button
                  class="button-count"
                  :disabled="
                    mycarts[productIndex].options[optionIndex].quantity == 1
                  "
                  @click="mycarts[productIndex].options[optionIndex].quantity--"
                >
                  -
                </button>
                <span>{{ key + ": " + option[key] }}</span
                ><button
                  class="button-count"
                  @click="mycarts[productIndex].options[optionIndex].quantity++"
                >
                  +
                </button>
              </div>
              <div v-else>
                {{ key + ": " + option[key] }}
              </div>
            </div>
            <button
              class="cart-remove"
              @click="removeCart(productIndex, optionIndex)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <hr />
    </div>
    <div v-else class="whoop-cart">
      <span><strong>Whoops!</strong> No product found in cart!</span>
    </div>
    <div class="checkout">
      <button class="go-shop" @click="returnShop">Continue Shopping</button>
    </div>
  </div>
</template>

<script>
import emitter from "../services/emitter";
export default {
  data() {
    return {
      mycarts: [],
      total: 0.0,
    };
  },
  watch: {
    mycarts: {
      handler: function (newVal) {
        let mycarts = JSON.stringify(newVal);
        window.localStorage.setItem("mycarts", mycarts);
        let total = 0;
        newVal.forEach((product) => {
          product.options.forEach((option) => {
            total += option.quantity;
          });
        });
        emitter.emit("cartItemUpdated", total);
      },
      deep: true,
    },
  },
  methods: {
    removeCart(productIndex, optionIndex) {
      this.mycarts[productIndex].options.splice(optionIndex, 1);
      if (!this.mycarts[productIndex].options.find((o) => o.quantity >= 1)) {
        this.mycarts.splice(productIndex, 1);
      }
      let mycarts = JSON.stringify(this.mycarts);
      window.localStorage.setItem("mycarts", mycarts);
      //update total when product removed from the cart
      this.total = 0.0;
      let get = JSON.parse(window.localStorage.getItem("mycarts"));
      get.forEach((element) => {
        this.total = this.total + Number(element.price);
      });

      this.updateCartItemCount(this.mycarts);
    },
    returnShop() {
      this.$router.push({ path: "/" });
    },
    clearItemsInCart() {
      this.mycarts = [];
      window.localStorage.removeItem("mycarts");
      emitter.emit("cartItemUpdated", 0);
      alert("Product removed in Cart");
    },
  },
  updateCartItemCount(cart = null) {
    if (cart) {
      let total = 0;
      cart.forEach((product) => {
        product.options.forEach((option) => {
          total += option.quantity;
        });
      });
      emitter.emit("cartItemUpdated", total);
    }
  },
  mounted() {
    //when component loaded first the carts and total amount also loaded
    if (JSON.parse(window.localStorage.getItem("mycarts"))) {
      this.mycarts = JSON.parse(window.localStorage.getItem("mycarts"));
      this.mycarts.forEach((element) => {
        this.total = this.total + Number(element.price);
      });
    }
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  margin: auto;
  text-align: center;
  font-family: arial;
}

.price {
  color: grey;
  font-size: 22px;
}

.card button {
  border: none;
  outline: 0;
  padding: 12px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
}
.quantity-control {
  display: flex;
}
.quantity-control span {
  flex-grow: 1;
}
.details {
  background-color: #04aa6d !important;
  margin-top: 3px;
}
.cart-remove {
  background-color: #e71010 !important;
  margin-top: 3px;
}
.whoop-cart {
  text-align: center;
  color: red;
  margin: 10px;
  padding: 10px;
}
.card button:hover {
  opacity: 0.7;
}

.card-options {
  text-transform: capitalize;
}
.go-shop {
  border: none;
  margin: auto;
  text-align: center;
  background-color: #04aa6d;
  color: white;
  padding: 10px;
  width: 50%;
  font-size: small;
  text-transform: capitalize;
}
.carthead {
  text-align: center;
}

.checkout {
  text-align: center;
  padding: 5px;
}
.checkout-button {
  border: none;
  padding: 10px 20px;
  width: auto;
  outline: none;
  background-color: #04aa6d;
  color: white;
  width: 50%;
  width: auto;
  margin: 4px;
  font-size: larger;
  text-transform: uppercase;
}
.clear-items-in-cart-button {
  border: none;
  padding: 10px 20px;
  width: auto;
  outline: none;
  margin: 4px;
  background-color: #e71010 !important;
  color: white;
  width: auto;
  font-size: larger;
  text-transform: uppercase;
}
.icon {
  height: 24px;
  width: 24px;
}
</style>
