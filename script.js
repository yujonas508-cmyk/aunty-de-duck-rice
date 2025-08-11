const menuItems = [
    { name: "叉烧饭", price: 7.00, type: "single", image: "char_siu_rice.jpg" },
    { name: "烧肉饭", price: 7.00, type: "single", image: "roast_pork_rice.jpg" },
    { name: "烧鸡饭", price: 6.00, type: "single", image: "roast_chicken_rice.jpg" },
    { name: "烧鸭饭", price: 7.00, type: "single", image: "roast_duck_rice.jpg" },
    { name: "双拼", price: 10.50, type: "combo", meats: 2, image: "two_combo.jpg" },
    { name: "三拼", price: 13.00, type: "combo", meats: 3, image: "three_combo.jpg" }
];

const meatsList = ["叉烧", "烧肉", "烧鸡", "烧鸭"];
let cart = [];
let selectedItem = null;
let selectedRice = "";
let selectedMeats = [];

function loadMenu() {
    const menuDiv = document.getElementById("menu");
    menuDiv.innerHTML = ""; // 先清空，避免重复加载
    menuItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "menu-item";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "space-between";

        div.innerHTML = `
            <div style="display:flex; align-items:center; gap: 15px;">
                <img src="images/${item.image}" alt="${item.name}" style="height:60px; border-radius:8px;">
                <span>${item.name} - RM ${item.price.toFixed(2)}</span>
            </div>
            <button onclick="selectItem(${index})">Add</button>
        `;
        menuDiv.appendChild(div);
    });
}

function selectItem(index) {
    selectedItem = menuItems[index];
    document.getElementById("modal-title").textContent = `选择 ${selectedItem.name}`;

    const riceDiv = document.getElementById("rice-options");
    riceDiv.innerHTML = `
        <fieldset>
            <legend><b>选择饭类:</b></legend>
            <label><input type="radio" name="rice" value="油饭"> 油饭</label>
            <label><input type="radio" name="rice" value="白饭"> 白饭</label>
        </fieldset>
    `;

    const meatDiv = document.getElementById("meat-options");
    if (selectedItem.type === "combo") {
        meatDiv.innerHTML = `
            <fieldset>
                <legend><b>选择 ${selectedItem.meats} 种肉类:</b></legend>
                ${meatsList.map(meat => `<label><input type="checkbox" name="meat" value="${meat}"> ${meat}</label>`).join("<br>")}
            </fieldset>
        `;

        const checkboxes = meatDiv.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const checked = [...checkboxes].filter(c => c.checked);
                if (checked.length > selectedItem.meats) {
                    cb.checked = false;
                    alert(`只能选择${selectedItem.meats}种肉类`);
                }
            });
        });
    } else {
        meatDiv.innerHTML = "";
    }

    document.getElementById("modal").style.display = "block";
}

function confirmSelection() {
    selectedRice = document.querySelector('input[name="rice"]:checked')?.value;
    selectedMeats = Array.from(document.querySelectorAll('input[name="meat"]:checked')).map(m => m.value);

    if (!selectedRice) {
        alert("请选择饭类");
        return;
    }
    if (selectedItem.type === "combo" && selectedMeats.length !== selectedItem.meats) {
        alert(`请选择 ${selectedItem.meats} 种肉类`);
        return;
    }

    const itemName = selectedItem.type === "combo"
        ? `${selectedItem.name} (${selectedMeats.join(", ")}) - ${selectedRice}`
        : `${selectedItem.name} - ${selectedRice}`;

    const existingItem = cart.find(ci => ci.name === itemName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: itemName, price: selectedItem.price, quantity: 1 });
    }
    updateCartCount();
    closeModal();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = `(${count})`;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function viewOrder() {
    if (cart.length === 0) {
        alert("您的购物车是空的");
        return;
    }
    let subtotal = 0;
    let orderDetails = "订单明细:\n";
    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        orderDetails += `${item.name} x${item.quantity} - RM ${total.toFixed(2)}\n`;
    });
    const sst = subtotal * 0.06;
    const serviceTax = subtotal * 0.10;
    const grandTotal = subtotal + sst + serviceTax;
    orderDetails += `\n小计: RM ${subtotal.toFixed(2)}`;
    orderDetails += `\nSST (6%): RM ${sst.toFixed(2)}`;
    orderDetails += `\n服务费 (10%): RM ${serviceTax.toFixed(2)}`;
    orderDetails += `\n总计: RM ${grandTotal.toFixed(2)}`;
    alert(orderDetails);
}

// 允许点击模态背景关闭弹窗
document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
        closeModal();
    }
});

loadMenu();