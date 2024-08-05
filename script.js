document.addEventListener('DOMContentLoaded', function () {
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    const cart = [];
    const products = [
        { id: 1, name: "phone 1", price: 3329.00, image: "321.jpg", category: "phone", reviews: [] },
        { id: 2, name: "phone 2", price: 4949.00, image: "322.jpg", category: "phone", reviews: [] },
        { id: 3, name: "phone 3", price: 5279.00, image: "r4.jpg", category: "phone", reviews: [] },
        { id: 4, name: "phone 4", price: 6999.00, image: "r6.jpg", category: "phone", reviews: [] },
        { id: 5, name: "phone 5", price: 7999.00, image: "r7.jpg", category: "phone", reviews: [] },
        { id: 6, name: "phone 6", price: 8252.00, image: "r4.jpg", category: "phone", reviews: [] },
        { id: 7, name: "phone 7", price: 5374.00, image: "322.jpg", category: "phone", reviews: [] },
    ];

    const INRFormatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    });

    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");
    const sortOptions = document.getElementById("sort-options");
    const filterOptions = document.getElementById("filter-options");
    const productGrid = document.querySelector(".product-grid");
    const buyAllButton = document.querySelector(".buy-all-button");

    sortOptions.addEventListener("change", (event) => sortProducts(event.target.value));
    filterOptions.addEventListener("change", (event) => filterProducts(event.target.value));
    buyAllButton.addEventListener("click", handleBuyAllButtonClick);

    function addToCart(product) {
        const cartItem = cart.find(item => item.product.id === product.id);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ product, quantity: 1 });
        }
        updateCartDisplay();
        alert("Item added to cart!");
        animateAddToCart();
    }

    function animateAddToCart() {
        const addToCartButtons = document.querySelectorAll(".add-to-cart");
        addToCartButtons.forEach(button => {
            button.classList.add('pulse');
            setTimeout(() => button.classList.remove('pulse'), 300);
        });
    }

    function removeFromCart(productId) {
        const cartIndex = cart.findIndex(item => item.product.id === productId);
        if (cartIndex !== -1) {
            cart.splice(cartIndex, 1);
        }
        updateCartDisplay();
    }

    function goToPayment(product) {
        window.open(`payment.html?productId=${product.id}&productName=${product.name}&productPrice=${product.price}`, '_blank');
    }

    function goToPaymentAll(cartItems) {
        const serializedCart = encodeURIComponent(JSON.stringify(cartItems));
        window.open(`payment.html?cart=${serializedCart}`, '_blank');
    }

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach(cartItem => {
            total += cartItem.product.price * cartItem.quantity;
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");
            cartItemElement.innerHTML = `
                <span>${cartItem.product.name} (${cartItem.quantity})</span>
                <span>${INRFormatter.format(cartItem.product.price * cartItem.quantity)}</span>
                <button class="remove-from-cart" data-id="${cartItem.product.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotal.textContent = `Total: ${INRFormatter.format(total)}`;
        attachRemoveFromCartEvents();
    }

    function attachRemoveFromCartEvents() {
        document.querySelectorAll(".remove-from-cart").forEach(button => {
            button.addEventListener("click", (event) => {
                const productId = parseInt(event.target.getAttribute("data-id"));
                removeFromCart(productId);
            });
        });
    }

    function sortProducts(criteria) {
        let sortedProducts;
        switch (criteria) {
            case "name-asc":
                sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                sortedProducts = [...products].sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "price-asc":
                sortedProducts = [...products].sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sortedProducts = [...products].sort((a, b) => b.price - a.price);
                break;
            default:
                sortedProducts = products;
        }
        displayProducts(sortedProducts);
    }

    function filterProducts(category) {
        const filteredProducts = category === "all" ? products : products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }

    function displayProducts(products) {
        productGrid.innerHTML = "";
        products.forEach(product => {
            const productElement = createProductElement(product);
            productGrid.appendChild(productElement);
        });
    }

    function createProductElement(product) {
        const productElement = document.createElement("div");
        productElement.classList.add("product-card");
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>${INRFormatter.format(product.price)}</p>
            <div class="buttons">
                <button class="add-to-cart">Add to Cart</button>
                <button class="buy-now">Buy Now</button>
                <button class="view-reviews-videos">View Reviews/Videos</button>
                <button class="add-review">Add Review</button>
            </div>
        `;

        productElement.querySelector(".add-to-cart").addEventListener("click", () => addToCart(product));
        productElement.querySelector(".buy-now").addEventListener("click", () => goToPayment(product));
        productElement.querySelector(".view-reviews-videos").addEventListener("click", () => viewReviewsAndVideos(product));
        productElement.querySelector(".add-review").addEventListener("click", () => addReview(product));

        return productElement;
    }

    function handleBuyAllButtonClick() {
        if (cart.length > 0) {
            goToPaymentAll(cart);
        } else {
            alert("Your cart is empty!");
        }
    }

    function viewReviewsAndVideos(product) {
        let content = "Reviews:\n";
        product.reviews.forEach(review => content += `\n${review}\n`);
        
        const videoUrl = prompt("Enter the URL of the product demo video:");
        if (videoUrl) {
            window.open(videoUrl, '_blank');
        }
        
        alert(content);
    }

    function addReview(product) {
        const review = prompt("Enter your review:");
        if (review) {
            product.reviews.push(review);
            alert("Review added successfully!");
        }
    }

    // Display all products initially
    displayProducts(products);
});
