<template>
  <div class="main-div">
    <div class="topnav">
      <router-link class="active" to="/">List View</router-link>
      <router-link to="/mycart">
        My Cart
        <strong class="cart-number"> ({{ cartTotalItems }}) </strong>
      </router-link>
    </div>

    <router-view />
  </div>
</template>
<script>
import emitter from "./services/emitter";
export default {
  data() {
    return {
      count: 0,
      cartTotalItems: 0,
    };
  },
  mounted() {
    //Register a listener
    emitter.on("cartItemUpdated", (newItemCount) => {
      this.cartTotalItems = newItemCount;
    });
    let mycarts = window.localStorage.getItem("mycarts");
    if (mycarts) {
      mycarts = JSON.parse(mycarts);
      let total = 0;
      mycarts.forEach((product) => {
        product.options.forEach((option) => {
          total += option.quantity;
        });
      });
      this.cartTotalItems = total;
    }
  },
};
</script>
<style>
* {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
.main-div {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.topnav {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  background-color: #333;
}

.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.topnav a:hover {
  background-color: #ddd;
  color: black;
}

.topnav a.active {
  background-color: #04aa6d;
  color: white;
}
.cart-number {
  font-size: large;
  color: rgb(255, 14, 14);
}
</style>
