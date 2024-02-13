const form = document.getElementById("sellingPage");
        const ulist = document.getElementById("ulist");
        const productSumContainer = document.getElementById("productSum");
        let sum = 0;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            createUserData();
        });

        window.addEventListener("DOMContentLoaded", () => {
            fetchProducts();
        });

        function fetchProducts() {
            axios.get("https://crudcrud.com/api/d917ff79c0ee4ad5926786b59bf33ea3/products")
                .then((response) => {
                    console.log(response);
                    sum = 0;
                    ulist.innerHTML = ''; // Clear the ulist before appending new products
                    for (var i = 0; i < response.data.length; i++) {
                        const productObj = response.data[i];
                        showDetailsOnScreen(productObj);
                        sum += +productObj.price;
                    }
                    updateProductSum();
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        function createUserData() {
            const prodDetails = {
                "price": +document.getElementById("price").value, // Convert to number
                "name": document.getElementById("pName").value
            };

            axios.post("https://crudcrud.com/api/d917ff79c0ee4ad5926786b59bf33ea3/products", prodDetails)
                .then((resolve) => {
                    console.log(resolve);
                    fetchProducts(); // Fetch products again after adding a new one
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        function showDetailsOnScreen(productObj) {
            const pblock = document.createElement("div");
            pblock.classList.add("pblock-div");
            pblock.setAttribute('data-product-id', productObj._id);

            const pContent = document.createElement("p");
            pContent.innerHTML = `<strong>Product ID: </strong> ${productObj._id}<strong>     Product Name: </strong> ${productObj.name}<strong>      Product Price: </strong> ${productObj.price}`;

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                deleteProduct(productObj._id);
            });

            pblock.appendChild(pContent);
            pblock.appendChild(deleteButton);
            ulist.appendChild(pblock);
        }

        function deleteProduct(userId) {
            axios.delete(`https://crudcrud.com/api/d917ff79c0ee4ad5926786b59bf33ea3/products/${userId}`)
                .then(() => {
                    const userBlock = document.querySelector(`[data-product-id="${userId}"]`);
                    if (userBlock) {
                        userBlock.remove();
                        fetchProducts(); // Fetch products again after deleting one
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        function updateProductSum() {
            const productSum = document.createElement('p');
            productSum.innerHTML = `<h3>Sum of Product is:<h3> ${sum}`;
            productSumContainer.innerHTML = ''; // Clear previous content
            productSumContainer.appendChild(productSum);
        }