<template>
  <div class="home">
    <!-- Display to detail and assig to cart -->
    <h2 class="product-head">PRODUCTS</h2>
    <div v-for="item in data" :key="item.id">
      <div v-for="(val, key) in item" :key="key.id" class="card">
        <h1>{{ val.name }}</h1>
        <p class="price">{{ val.price }} SEK</p>
        <p>Available: {{ TotalItems(val.options) }} items</p>
        <p>
          <button class="details" @click="viewProduct(val)">Details</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Data from "./data.json";
export default {
  data() {
    return {
      data: Data,
    };
  },
  methods: {
    viewProduct(val) {
      this.$router.push({ name: "DetailsView", params: { id: val.id } });
    },
    TotalItems(quantities) {
      let sum = 0;
      for (let i = 0; i < quantities.length; i++) {
        sum += quantities[i].quantity;
      }
      return sum;
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  margin: 1em auto;
  text-align: center;
  font-family: arial;
}
span {
  padding: 3px;
}
.price {
  color: grey;
  font-size: 22px;
}
.cartoption {
  margin: 3px;
  padding: 3px;
  border: 1px solid black;
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
.details {
  background-color: #04aa6d !important;
  margin-top: 3px;
}

.card button:hover {
  opacity: 0.7;
}

.product-head {
  text-align: center;
}
</style>
