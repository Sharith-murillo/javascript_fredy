document.addEventListener('DOMContentLoaded', () => {
    const tables = document.querySelectorAll('.table');

    tables.forEach(table => {
        const addButton = table.querySelector('.add-btn');
        const orderList = table.querySelector('.order-list');
        const totalPriceEl = table.querySelector('.total-price');

        let total = 0;

        addButton.addEventListener('click', () => {
            const foodSelect = table.querySelector('.food-select');
            const drinkSelect = table.querySelector('.drink-select');

            // Obtener la comida y bebida seleccionada
            const selectedFood = foodSelect.options[foodSelect.selectedIndex];
            const selectedDrink = drinkSelect.options[drinkSelect.selectedIndex];

            let selectedItems = [];

            if (selectedFood.selected && !selectedFood.disabled) {
                selectedItems.push({
                    name: selectedFood.text.split(' - ')[0],
                    price: parseFloat(selectedFood.dataset.price)
                });
            }

            if (selectedDrink.selected && !selectedDrink.disabled) {
                selectedItems.push({
                    name: selectedDrink.text.split(' - ')[0],
                    price: parseFloat(selectedDrink.dataset.price)
                });
            }

            selectedItems.forEach(item => {
                // Crear un nuevo item de pedido
                const orderItem = document.createElement('li');
                orderItem.classList.add('order-item');
                orderItem.innerHTML = `
                    ${item.name} - $${item.price.toLocaleString()} 
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-btn plus">+</button>
                    <span class="item-total">$${item.price.toLocaleString()}</span>
                `;

                // Eventos para los botones de cantidad
                orderItem.querySelector('.plus').addEventListener('click', () => {
                    const quantityEl = orderItem.querySelector('.quantity');
                    let quantity = parseInt(quantityEl.textContent);
                    quantity++;
                    quantityEl.textContent = quantity;
                    updateItemTotal(orderItem, item.price, quantity);
                });

                orderItem.querySelector('.minus').addEventListener('click', () => {
                    const quantityEl = orderItem.querySelector('.quantity');
                    let quantity = parseInt(quantityEl.textContent);
                    if (quantity > 1) {
                        quantity--;
                        quantityEl.textContent = quantity;
                        updateItemTotal(orderItem, item.price, quantity);
                    }
                });

                // Agregar el item a la lista de pedidos
                orderList.appendChild(orderItem);
                total += item.price;
                updateTotalPrice(total);
            });

            function updateItemTotal(orderItem, price, quantity) {
                const itemTotal = orderItem.querySelector('.item-total');
                const newTotal = price * quantity;
                itemTotal.textContent = `$${newTotal.toLocaleString()}`;
                updateTotal();
            }

            function updateTotal() {
                total = Array.from(orderList.children).reduce((sum, item) => {
                    const itemTotal = parseFloat(item.querySelector('.item-total').textContent.replace(/[^0-9.-]+/g, ""));
                    return sum + itemTotal;
                }, 0);
                updateTotalPrice(total);
            }

            function updateTotalPrice(newTotal) {
                totalPriceEl.textContent = newTotal.toLocaleString();
            }
        });
    });
});
