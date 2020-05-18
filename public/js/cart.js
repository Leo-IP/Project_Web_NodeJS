function addToCart(productId, name, price, coverImage) {
    shoppingCart.addItemToCart(productId, name, price, coverImage);
    alert('Added '+name + " to cart!");
}

const shoppingCart = {};
shoppingCart.cart = [];


shoppingCart.Item = function (productId, name, price, coverImage) {
    this.name = name;
    this.price = price;
    this.productId = productId;
    this.coverImage = coverImage;
};

shoppingCart.addItemToCart = function (productId, name, price, coverImage) {
    for (let i in this.cart) {
        if (this.cart[i].name === name) {
            this.saveCart();
            return;
        }
    }
    const item = new this.Item(productId, name, Number(price), coverImage);
    this.cart.push(item);
    this.saveCart();
};


shoppingCart.countCart = function () {
    return shoppingCart.cart.length;
};

shoppingCart.totalCart = function () {
    let totalCost = 0;
    for (let i in this.cart) {
        totalCost += this.cart[i].price;
    }
    return totalCost

};

shoppingCart.saveCart = function () {
    localStorage.setItem("cart", JSON.stringify(this.cart));
};

shoppingCart.loadCart = function () {
    if(JSON.parse(localStorage.getItem("cart"))===null){
        localStorage.setItem("cart", JSON.stringify(this.cart));
    }
    this.cart = JSON.parse(localStorage.getItem("cart"));

};
shoppingCart.loadCart();
